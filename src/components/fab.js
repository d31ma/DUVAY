/* <w-fab> — DuVay Floating Action Button (Vuetify parity)
 *
 * Attributes:
 *   icon        - icon name/glyph (default '+')
 *   icon-set    - icon set prefix (e.g. 'mdi')
 *   label       - text label; triggers extended mode
 *   size        - x-small | small | default | large | x-large
 *   color       - primary | secondary | success | warning | error | surface | …
 *   variant     - elevated | flat | tonal | outlined | text | plain
 *   rounded     - pill | circle | sm | md | lg | xl | 0 | true
 *   fixed       - fixed positioning
 *   absolute    - absolute positioning inside nearest relative ancestor
 *   position    - bottom-right | bottom-left | top-right | top-left
 *   location    - top-start | top-end | bottom-start | bottom-end (Vuetify alias for position)
 *   active      - visibility toggle (modelValue parity)
 *   appear      - triggers appear transition on mount
 *   aria-label  - accessibility label
 *
 * Events:
 *   click  - native click from the inner <button>
 */

import WIcons from '../icons.js';

export class WFab extends WElement {
  static attrs = ['icon', 'icon-set', 'label', 'size', 'color', 'variant', 'rounded', 'fixed', 'absolute', 'position', 'location', 'active', 'appear', 'aria-label'];

  get icon()      { return this._attr('icon', '+'); }
  get iconSet()   { return this._attr('icon-set', ''); }
  get label()     { return this._attr('label', ''); }
  get size()      { return this._attr('size', ''); }
  get color()     { return this._attr('color', ''); }
  get variant()   { return this._attr('variant', 'elevated'); }
  get rounded()   { return this._attr('rounded', ''); }
  get fixed()     { return this._bool('fixed'); }
  get absolute()  { return this._bool('absolute'); }
  get position()  { return this._attr('position', ''); }
  get location()  { return this._attr('location', ''); }
  get active()    { return this._bool('active'); }
  get appear()    { return this._bool('appear'); }

  _template() {
    const size = this.size;
    const sizeClass = size ? ' w-fab--' + size : '';
    const fixedClass = this.fixed ? ' w-fab--fixed' : '';
    const absoluteClass = this.absolute ? ' w-fab--absolute' : '';
    const extendedClass = this.label ? ' w-fab--extended' : '';

    // Vuetify location = "top start" etc. DuVay position = "top-right" etc.
    const loc = this.location || this.position || '';
    const locParts = loc.split(/[-\s]+/);
    const vPos = locParts[0] || '';
    const hPos = locParts[1] || '';
    const vClass = vPos ? ' w-fab--' + vPos : '';
    const hClass = hPos ? ' w-fab--' + hPos : '';
    const locClass = (fixedClass || absoluteClass) ? (vClass + hClass) : '';

    const color = this.color;
    const colorClass = color ? ' w-fab--color-' + color : '';
    const variant = this.variant;
    const variantClass = variant && variant !== 'elevated' ? ' w-fab--variant-' + variant : '';
    const rounded = this.rounded;
    const roundedClass = rounded ? (rounded === 'true' || rounded === '' ? ' w-fab--rounded' : ' w-fab--rounded-' + rounded) : '';
    const activeClass = this.active ? ' w-fab--active' : '';

    const label = this.label ? `<span class="w-fab__label">${this._esc(this.label)}</span>` : '';
    const aria = this.getAttribute('aria-label') || this.label || this.icon;
    const iconSet = this.iconSet;
    const value = iconSet ? `${iconSet}:${this.icon}` : this.icon;
    const icon = WIcons.resolve(value, { iconClass: 'w-icon' });

    return `<button class="w-fab${sizeClass}${fixedClass}${absoluteClass}${extendedClass}${locClass}${colorClass}${variantClass}${roundedClass}${activeClass}" type="button" aria-label="${this._esc(aria)}">
      ${icon}${label}<slot></slot>
    </button>`;
  }

  _events() {
    const btn = this._q('button');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      // Native click already bubbles; emit explicit for component listeners
      this._emit('click', { originalEvent: e });
    });
  }
}

if (!customElements.get('w-fab')) customElements.define('w-fab', WFab);
