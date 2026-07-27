/* <w-fab> — DuVay Floating Action Button (Vuetify parity)
 *
 * Attributes:
 *   icon         - icon name/glyph (default '+')
 *   icon-set     - icon set prefix (e.g. 'mdi')
 *   prepend-icon - icon rendered before the main icon
 *   append-icon  - icon rendered after the label
 *   label        - text label; triggers extended mode ("text" is the alias)
 *   extended     - force the extended (pill + label) shape
 *   size         - x-small | small | default | large | x-large
 *   color        - primary | secondary | success | warning | error | surface | …
 *   variant      - elevated | flat | tonal | outlined | text | plain
 *   flat         - drop the shadow without changing the variant
 *   rounded      - pill | circle | sm | md | lg | xl | 0 | true
 *   block        - stretch to the full width of the container
 *   slim         - collapse the extended padding to one space step
 *   stacked      - stack the icon above the label
 *   fixed        - fixed positioning
 *   absolute     - absolute positioning inside nearest relative ancestor
 *   app          - pin to the viewport per `location` (layout-level FAB)
 *   layout       - the pinned FAB still takes part in layout flow (sticky)
 *   offset       - translate the FAB across the top/bottom edge it sits on
 *   order        - CSS order within its flex/grid parent
 *   name         - layout registration name, mirrored to data-name
 *   position     - bottom-right | bottom-left | top-right | top-left
 *   location     - top-start | top-end | bottom-start | bottom-end (Vuetify alias)
 *   href         - render an <a> instead of a <button>
 *   value        - value carried by the FAB inside a group
 *   active       - visibility toggle (modelValue parity)
 *   selected-class - extra class applied while active
 *   transition   - named enter animation (fade | scale | slide | none)
 *   ripple       - opt-in press-ripple visual
 *   appear       - triggers appear transition on mount
 *   aria-label   - accessibility label
 *
 * Events:
 *   click  - native click from the inner control
 */

import WIcons from '../icons.js';
import { wTransitionClass } from './overlay.js';
import { wSafeUrl } from './utils.js';

export class WFab extends WElement {
  static attrs = [
    'icon', 'icon-set', 'prepend-icon', 'append-icon', 'label', 'text', 'extended',
    'size', 'color', 'variant', 'flat', 'rounded', 'block', 'slim', 'stacked',
    'fixed', 'absolute', 'app', 'layout', 'offset', 'order', 'name',
    'position', 'location', 'href', 'value', 'active', 'selected-class',
    'transition', 'ripple', 'appear', 'aria-label',
  ];

  get icon()      { return this._attr('icon', '+'); }
  get iconSet()   { return this._attr('icon-set', ''); }
  // Vuetify calls the content `text`; DuVay's own name is `label` and wins.
  get label()     { return this._attr('label', '') || this._attr('text', ''); }
  get size()      { return this._attr('size', ''); }
  get color()     { return this._attr('color', ''); }
  get variant()   { return this._attr('variant', 'elevated'); }
  get rounded()   { return this._attr('rounded', ''); }
  get fixed()     { return this._bool('fixed'); }
  get absolute()  { return this._bool('absolute'); }
  get app()       { return this._bool('app'); }
  get position()  { return this._attr('position', ''); }
  get location()  { return this._attr('location', ''); }
  get active()    { return this._bool('active'); }
  get appear()    { return this._bool('appear'); }
  get href()      { return wSafeUrl(this._attr('href', '')); }
  get extended()  { return this._bool('extended') || !!this.label; }
  get anchored()  { return this.fixed || this.absolute || this.app; }
  get selectedClass() { return this._attr('selected-class', ''); }

  _classes() {
    return 'w-fab'
      + this._cls({
        ['w-fab--' + this.size]: this.size,
        ['w-fab--color-' + this.color]: this.color,
        'w-fab--fixed': this.fixed,
        'w-fab--absolute': this.absolute,
        'w-fab--app': this.app,
        'w-fab--extended': this.extended,
        'w-fab--flat': this._bool('flat'),
        'w-fab--block': this._bool('block'),
        'w-fab--slim': this._bool('slim'),
        'w-fab--stacked': this._bool('stacked'),
        'w-fab--offset': this._bool('offset'),
        'w-fab--layout': this._bool('layout'),
        'w-fab--appear': this.appear,
        'w-fab--active': this.active,
        [this.selectedClass]: this.active && this.selectedClass,
      })
      + this._positionClasses()
      + this._variantClass()
      + this._roundedClass()
      + this._transitionClass();
  }

  // Vuetify location = "top start" etc. DuVay position = "top-right" etc.
  // Only anchored FABs (fixed/absolute/app) are placed.
  _positionClasses() {
    if (!this.anchored) return '';
    const parts = (this.location || this.position || '').split(/[-\s]+/);
    return this._cls({ ['w-fab--' + parts[0]]: parts[0] })
      + this._cls({ ['w-fab--' + parts[1]]: parts[1] });
  }

  _variantClass() {
    const variant = this.variant;
    return this._cls({ ['w-fab--variant-' + variant]: variant && variant !== 'elevated' });
  }

  _roundedClass() {
    const rounded = this.rounded;
    if (!rounded) return '';
    return this._cls({
      'w-fab--rounded': rounded === 'true',
      ['w-fab--rounded-' + rounded]: rounded !== 'true',
    });
  }

  // Shared with every other overlay-ish surface so "transition" means the same
  // thing everywhere; absent leaves the resting CSS transition alone.
  _transitionClass() {
    const name = wTransitionClass(this.getAttribute('transition'), 'w-fab');
    return name ? ' ' + name : '';
  }

  _icon(name, iconClass) {
    if (!name) return '';
    const iconSet = this.iconSet;
    return WIcons.resolve(iconSet ? `${iconSet}:${name}` : name, { iconClass });
  }

  _contentMarkup() {
    const label = this.label ? `<span class="w-fab__label">${this._esc(this.label)}</span>` : '';
    return this._icon(this._attr('prepend-icon', ''), 'w-icon w-fab__prepend')
      + this._icon(this.icon, 'w-icon')
      + label
      + '<slot></slot>'
      + this._icon(this._attr('append-icon', ''), 'w-icon w-fab__append');
  }

  _styleAttr() {
    const order = this._attr('order', '');
    return order ? ` style="order: ${this._esc(order)}"` : '';
  }

  _template() {
    const link = !!this.href;
    const tag = link ? 'a' : 'button';
    const attrs = this._attrs({
      href: this.href,
      type: link ? '' : 'button',
      value: link ? '' : this._attr('value', ''),
      'data-name': this._attr('name', ''),
      'aria-label': this.getAttribute('aria-label') || this.label || this.icon,
    });

    return `<${tag} class="${this._classes()}"${attrs}${this._styleAttr()}>${this._contentMarkup()}</${tag}>`;
  }

  _events() {
    const btn = this._q('button, a');
    if (!btn) return;
    if (this.hasAttribute('ripple')) this._attachRipple(btn);
    btn.addEventListener('click', (e) => {
      // Native click already bubbles; emit explicit for component listeners
      this._emit('click', { originalEvent: e });
    });
  }
}

if (!customElements.get('w-fab')) customElements.define('w-fab', WFab);
