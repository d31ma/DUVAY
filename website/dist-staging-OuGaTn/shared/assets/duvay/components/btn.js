/* <w-btn> — Button web component
 *
 * Attributes:
 *   variant       - filled | tonal | outlined | text | ghost | plain | elevated |
 *                   icon | danger | primary-text
 *   size          - xs | sm | lg | xl (omit for default)
 *   color         - primary | success | danger | warning
 *   href          - if set, renders an <a> tag instead of <button>
 *   disabled      - disables the button
 *   loading       - shows a loading spinner and blocks pointer interaction
 *   icon          - leading icon text / glyph (legacy alias for prepend-icon)
 *   prepend-icon  - icon before the label
 *   append-icon   - icon after the label
 *   block         - makes the button full-width
 *   stacked       - stacks icon above the label
 *   active        - marks the button as selected in grouped controls
 *   aria-label    - accessibility label (auto-used for icon buttons)
 *
 * Slots:
 *   default   - button label / icon content
 */

import WIcons from '../icons.js';

class WBtn extends WElement {

  static attrs = ['variant', 'color', 'size', 'disabled', 'href', 'loading', 'icon', 'icon-set', 'prepend-icon', 'append-icon', 'block', 'stacked', 'active', 'aria-label'];

  // Only string-valued attributes are reflected here. Boolean attributes
  // (disabled, loading, block, stacked, active) have explicit get/set pairs
  // below; reflecting them through the generic string sync would treat the
  // empty-string attribute value as falsy and strip the attribute on change.
  static props = {
    variant: 'variant',
    color: 'color',
    size: 'size',
    href: 'href',
    icon: 'icon',
    'prepend-icon': 'prependIcon',
    'append-icon': 'appendIcon'
  };

  get variant()  { return this._attr('variant', 'text'); }
  set variant(v)  { if (v) this.setAttribute('variant', v); else this.removeAttribute('variant'); }

  get color()    { return this._attr('color', ''); }
  set color(v)    { if (v) this.setAttribute('color', v); else this.removeAttribute('color'); }

  get size()     { return this._attr('size', ''); }
  set size(v)    { if (v) this.setAttribute('size', v); else this.removeAttribute('size'); }

  get disabled() { return this._bool('disabled'); }
  set disabled(v) { v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get href()     { return this.getAttribute('href'); }
  set href(v)    { if (v) this.setAttribute('href', v); else this.removeAttribute('href'); }

  get loading()  { return this._bool('loading'); }
  set loading(v) { v ? this.setAttribute('loading', '') : this.removeAttribute('loading'); }

  get icon()     { return this._attr('icon', ''); }
  set icon(v)    { if (v) this.setAttribute('icon', v); else this.removeAttribute('icon'); }

  get prependIcon() { return this._attr('prepend-icon', '') || this._attr('icon', ''); }
  set prependIcon(v) { if (v) this.setAttribute('prepend-icon', v); else this.removeAttribute('prepend-icon'); }

  get appendIcon() { return this._attr('append-icon', ''); }
  set appendIcon(v) { if (v) this.setAttribute('append-icon', v); else this.removeAttribute('append-icon'); }

  get block()    { return this._bool('block'); }
  set block(v)   { v ? this.setAttribute('block', '') : this.removeAttribute('block'); }

  get stacked()  { return this._bool('stacked'); }
  set stacked(v) { v ? this.setAttribute('stacked', '') : this.removeAttribute('stacked'); }

  get active()   { return this._bool('active'); }
  set active(v)  { v ? this.setAttribute('active', '') : this.removeAttribute('active'); }

  _template() {
    const v = this.variant;
    const c = this.color;
    const sz = this.size ? ' w-btn--' + this.size : '';
    const ariaLabel = this.getAttribute('aria-label') || '';
    const isDisabled = this.disabled ? ' disabled' : '';
    const isLoading = this.loading ? ' w-loading' : '';
    const isActive = this.active ? ' active' : '';
    const blockClass = this.block ? ' w-btn-block' : '';
    const stackedClass = this.stacked ? ' w-btn-stacked' : '';
    const ariaBusy = this.loading ? ' aria-busy="true"' : '';
    const href = this.href;
    const iconSet = this.getAttribute('icon-set') || '';

    const prependValue = this.prependIcon ? (iconSet ? `${iconSet}:${this.prependIcon}` : this.prependIcon) : '';
    const appendValue = this.appendIcon ? (iconSet ? `${iconSet}:${this.appendIcon}` : this.appendIcon) : '';
    const prependIcon = prependValue ? WIcons.resolve(prependValue, { iconClass: 'w-icon w-btn-leading-icon' }) : '';
    const appendIcon = appendValue ? WIcons.resolve(appendValue, { iconClass: 'w-icon w-btn-append-icon' }) : '';

    // Map variant to CSS class
    const variantClass = v === 'danger' || v === 'primary-text' || v === 'icon'
      ? ' w-btn-' + v
      : v !== 'text' ? ' w-btn-' + v : '';

    // Map color to CSS class (combines with variant: e.g. w-btn-filled.w-btn-danger)
    const colorClass = c ? ' w-btn-' + c : '';

    const classes = `w-btn${variantClass}${colorClass}${sz}${isDisabled}${isLoading}${isActive}${blockClass}${stackedClass}`;

    if (href && !this.disabled) {
      return `<a class="${classes}" href="${href}"${ariaBusy}${ariaLabel ? ' aria-label="' + ariaLabel + '"' : ''}>
        ${prependIcon}<slot></slot>${appendIcon}
      </a>`;
    }

    return `<button class="${classes}"${isDisabled}${ariaBusy}${ariaLabel ? ' aria-label="' + ariaLabel + '"' : ''}>
      ${prependIcon}<slot></slot>${appendIcon}
    </button>`;
  }

  _events() {
    const btn = this._q('button, a');
    if (!btn) return;

    // Forward click to host — but only for programmatic listeners,
    // not re-dispatching. The native event bubbles already.
    btn.addEventListener('focus', () => this._emit('focus'));
    btn.addEventListener('blur', () => this._emit('blur'));
  }
}

customElements.define('w-btn', WBtn);
