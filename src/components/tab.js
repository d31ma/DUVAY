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
  ];

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

  _template() {
    const cls = this._classes();
    const selected = this.active ? 'true' : 'false';
    const style = this._styleAttr();

    // Link tabs render an anchor so they participate in normal navigation.
    // A disabled link is downgraded to a disabled button.
    if (this.href && !this.disabled) {
      return `<a class="${cls}"${style} href="${this._esc(this.href)}" role="tab" aria-selected="${selected}">
      ${this._content()}
    </a>`;
    }

    const dis = this.disabled ? ' disabled aria-disabled="true"' : '';
    return `<button class="${cls}"${style}${dis} type="button" role="tab" aria-selected="${selected}">
      ${this._content()}
    </button>`;
  }

  _events() {
    if (this.hasAttribute('ripple')) this._attachRipple(this._q('button, a'));
  }
}

customElements.define('w-tab', WTab);
