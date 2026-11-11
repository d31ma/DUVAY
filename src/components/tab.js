/* <w-tab> — Individual tab button for use inside <w-tabs>
 *
 * Attributes:
 *   value          - identifier value for this tab
 *   active         - whether this tab is selected
 *   disabled       - disables the tab
 *   text           - label text (alternative to slotted content)
 *   stacked        - stack icon above label (column layout)
 *   href           - render a link tab (<a>) instead of a <button>
 *   ripple         - opt-in press-ripple visual (off by default)
 *   fixed          - equal-width tab capped at --w-tab-max-width, centred
 *   slim           - reduce the horizontal padding
 *   size           - x-small | small | default | large | x-large, or a length
 *   variant        - flat | text | elevated | tonal | outlined | plain
 *   prepend-icon   - icon rendered before the label
 *   append-icon    - icon rendered after the label
 *   icon           - bare (round icon tab) or a glyph name, which also becomes
 *                    the leading icon
 *   icon-set       - icon set for the icon attributes
 *   direction      - horizontal (default) | vertical (usually propagated from
 *                    <w-tabs>)
 *   inset          - the active indicator takes the full tab height
 *   spaced         - start | end | both; pushes prepend/append to the edges
 *   selected-class - extra class applied while this tab is active
 *   nav            - render a plain link (no tab role); set by <w-tabs nav>
 *
 * Forwarded ARIA — authored on the host, rendered on the inner control:
 *   aria-label, aria-labelledby, aria-describedby, aria-controls (the id of
 *   the panel this tab shows). A link tab gets aria-current="page" while
 *   active. Inside <w-tabs> only the active tab is in the Tab order.
 *
 * Slider attributes — read by the parent <w-tabs> while this tab is active,
 * so a single tab can restyle the shared indicator:
 *   hide-slider                - hide the indicator on this tab
 *   slider-color               - palette token for the indicator
 *   slider-transition          - shift | grow | fade
 *   slider-transition-duration - ms number or any CSS duration
 *
 * Slots:
 *   default - tab label content (icon + text, etc.)
 */

import WIcons from '../icons.js';
import { wSetValue } from './utils.js';

const W_TAB_SIZES = ['x-small', 'small', 'default', 'large', 'x-large'];
const W_TAB_VARIANTS = ['flat', 'text', 'elevated', 'tonal', 'outlined', 'plain'];
const W_TAB_SPACING = ['start', 'end', 'both'];

class WTab extends WElement {

  static attrs = [
    'value', 'active', 'disabled', 'stacked', 'href', 'ripple', 'text',
    'fixed', 'slim', 'size', 'variant', 'prepend-icon', 'append-icon', 'icon',
    'icon-set', 'direction', 'inset', 'spaced', 'selected-class',
    'hide-slider', 'slider-color', 'slider-transition', 'slider-transition-duration',
    'nav', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-controls',
  ];

  // Host ARIA rendered on the inner tab control, which carries the role.
  static forwardedAria = ['aria-label', 'aria-labelledby', 'aria-describedby', 'aria-controls'];

  set value(v) { wSetValue(this, v); }
  get value()    { return this._attr('value', ''); }
  get active()   { return this._bool('active'); }
  set active(v)  { v ? this.setAttribute('active', '') : this.removeAttribute('active'); }
  get disabled() { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get stacked()  { return this.hasAttribute('stacked'); }
  get href()     { return this._attr('href', ''); }
  get text()     { return this._attr('text', ''); }
  get size()     { return this._attr('size', ''); }
  get variant()  { return this._attr('variant', ''); }
  get spaced()   { return this._attr('spaced', ''); }
  get selectedClass() { return this._attr('selected-class', ''); }
  get vertical() { return this._attr('direction', 'horizontal') === 'vertical'; }

  // `icon` doubles as a boolean (round tab) and as a glyph name.
  get iconGlyph() { return this._attr('icon', '') || ''; }
  get prependIcon() { return this._attr('prepend-icon', '') || this._namedIcon(); }

  _namedIcon() {
    const glyph = this.iconGlyph;
    return glyph && glyph !== 'true' ? glyph : '';
  }

  _classes() {
    const size = this.size;
    return 'w-tab' + this._cls({
      active: this.active,
      [this.selectedClass]: this.active && this.selectedClass,
      'w-tab--stacked': this.stacked,
      'w-tab--fixed': this._bool('fixed'),
      'w-tab--slim': this._bool('slim'),
      'w-tab--inset': this._bool('inset'),
      'w-tab--icon': this.hasAttribute('icon'),
      'w-tab--vertical': this.vertical,
      ['w-tab--' + size]: size !== 'default' && W_TAB_SIZES.includes(size),
      ['w-tab--' + this.variant]: W_TAB_VARIANTS.includes(this.variant),
      ['w-tab--spaced-' + this.spaced]: W_TAB_SPACING.includes(this.spaced),
    });
  }

  // A `size` that is not one of the presets is taken as a length and drives
  // the tab's own sizing custom property.
  _styleAttr() {
    const size = this.size;
    if (!size || W_TAB_SIZES.includes(size)) return '';
    const length = /^\d+(\.\d+)?$/.test(size) ? size + 'px' : size;
    return ` style="--w-tab-size:${this._esc(length)}"`;
  }

  _iconMarkup(name, iconClass) {
    if (!name) return '';
    const set = this.getAttribute('icon-set') || '';
    return WIcons.resolve(set ? `${set}:${name}` : name, { iconClass });
  }

  _content() {
    const label = this.text ? `<span class="w-tab__text">${this._esc(this.text)}</span>` : '';
    return this._iconMarkup(this.prependIcon, 'w-icon w-tab-leading-icon')
      + `<span class="w-tab__content">${label}<slot></slot></span>`
      + this._iconMarkup(this._attr('append-icon', ''), 'w-icon w-tab-append-icon');
  }

  // Link tabs render an anchor so they participate in normal navigation.
  // A disabled link is downgraded to a disabled button.
  _template() {
    const tag = this._isLink() ? 'a' : 'button';
    const attrs = this._attrs(this._controlAttrs());
    return `<${tag} class="${this._classes()}"${this._styleAttr()}${attrs}>
      ${this._content()}
    </${tag}>`;
  }

  _isLink() {
    return !!this.href && !this.disabled;
  }

  _controlAttrs() {
    const own = this._isLink()
      ? { href: this.href }
      : { type: 'button', disabled: this.disabled, 'aria-disabled': this.disabled && 'true' };
    return Object.assign(own, this._roleAttrs(), this._ariaAttrs(WTab.forwardedAria));
  }

  // In a `nav` strip the tab is a plain link; otherwise it is a tab. A link
  // tab marks the page it points to with aria-current while it is active.
  _roleAttrs() {
    const current = this._isLink() && this.active ? 'page' : '';
    if (this._bool('nav')) return { 'aria-current': current };
    return { role: 'tab', 'aria-selected': this.active ? 'true' : 'false', 'aria-current': current };
  }

  // A re-render resets the control's tabindex, so the parent strip puts its
  // roving tab stop back.
  _events() {
    if (this.hasAttribute('ripple')) this._attachRipple(this._q('button, a'));
    this.closest('w-tabs')?._syncRoving?.();
  }
}

customElements.define('w-tab', WTab);
