/* <w-btn> — Button web component
 *
 * Attributes:
 *   variant       - filled | tonal | outlined | text | ghost | plain | elevated |
 *                   icon | danger | primary-text ("flat" aliases filled)
 *   size          - xs | sm | lg | xl, or x-small | small | default | large | x-large
 *   color         - primary | success | danger | warning
 *   href          - if set, renders an <a> tag instead of <button>
 *   disabled      - disables the button
 *   loading       - shows a loading spinner and blocks pointer interaction
 *   icon          - leading icon text / glyph (legacy alias for prepend-icon)
 *   prepend-icon  - icon before the label
 *   append-icon   - icon after the label
 *   text          - label text, used instead of slotted content
 *   value         - value carried by the button inside a group
 *   block         - makes the button full-width
 *   stacked       - stacks icon above the label
 *   slim          - collapses the horizontal padding to 0 0.5rem
 *   flat          - drops the box shadow without changing the variant
 *   spaced        - start | end | both; pushes prepend/append icons to the edges
 *   active        - marks the button as selected in grouped controls
 *   selected-class- extra class put on the control while it is active
 *   ripple        - opt-in press-ripple visual (off by default)
 *   aria-label    - accessibility label (auto-used for icon buttons)
 *
 * Forwarded ARIA — authored on the host, rendered on the inner control:
 *   aria-label, aria-labelledby, aria-describedby, aria-expanded, aria-controls,
 *   aria-haspopup, aria-current, and (button form only) aria-pressed.
 *
 * Slots:
 *   default   - button label / icon content
 *
 * Subclass hooks — <w-icon-btn> and <w-app-bar-nav-icon> extend this class and
 * reuse every attribute above by overriding only these:
 *   _extraClasses()   extra class string for the control
 *   _extraAttrs(link) extra attribute map (wins over the shared ones)
 *   _styles()         inline style declarations
 *   _contentMarkup()  the control's inner HTML
 */

import WIcons from '../icons.js';
import { wSafeUrl, wSetValue } from './utils.js';
export class WBtn extends WElement {

  static attrs = ['variant', 'color', 'size', 'disabled', 'href', 'loading', 'icon', 'icon-set', 'prepend-icon', 'append-icon', 'block', 'stacked', 'active', 'aria-label', 'ripple', 'text', 'value', 'flat', 'slim', 'selected-class', 'spaced',
    'aria-labelledby', 'aria-describedby', 'aria-expanded', 'aria-controls', 'aria-haspopup', 'aria-current', 'aria-pressed'];

  // ARIA state authored on the host is forwarded to the rendered control,
  // because that control — not the host — is what the accessibility tree
  // exposes. `aria-pressed` is a toggle-button state, so it is withheld from
  // the anchor form, where it would be invalid.
  static forwardedAria = ['aria-labelledby', 'aria-describedby', 'aria-expanded', 'aria-controls', 'aria-haspopup', 'aria-current'];
  static forwardedButtonAria = ['aria-pressed'];

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

  // Vuetify spells the sizes out; DuVay's CSS uses the short scale.
  static sizeAliases = { 'x-small': 'xs', small: 'sm', default: '', large: 'lg', 'x-large': 'xl' };

  // Vuetify's "flat" variant is a filled button with no shadow; the shadow is
  // removed by the separate `flat` boolean, so the class maps straight over.
  static variantAliases = { flat: 'filled', default: 'text' };

  get variant()  { return this._attr('variant', 'text'); }
  set variant(v)  { if (v) this.setAttribute('variant', v); else this.removeAttribute('variant'); }

  get color()    { return this._attr('color', ''); }
  set color(v)    { if (v) this.setAttribute('color', v); else this.removeAttribute('color'); }

  get size()     { return this._attr('size', ''); }
  set size(v)    { if (v) this.setAttribute('size', v); else this.removeAttribute('size'); }

  get disabled() { return this._bool('disabled'); }
  set disabled(v) { v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get href()     { return wSafeUrl(this.getAttribute('href')); }
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

  get text()     { return this._attr('text', ''); }
  set value(v) { wSetValue(this, v); }
  get value()    { return this._attr('value', ''); }
  get flat()     { return this._bool('flat'); }
  get slim()     { return this._bool('slim'); }
  get spaced()   { return this._attr('spaced', ''); }
  get selectedClass() { return this._attr('selected-class', ''); }

  // Map variant to CSS class
  get _variantClass() {
    const variant = WBtn.variantAliases[this.variant] || this.variant;
    return this._cls({ ['w-btn-' + variant]: variant && variant !== 'text' });
  }

  _sizeToken() {
    const alias = WBtn.sizeAliases[this.size];
    return alias === undefined ? this.size : alias;
  }

  // Color combines with variant: e.g. w-btn-filled.w-btn-danger
  _classes() {
    const size = this._sizeToken();
    return 'w-btn' + this._variantClass
      + this._cls({
        ['w-btn-' + this.color]: this.color,
        ['w-btn--' + size]: size,
        ['w-btn--spaced-' + this.spaced]: this.spaced,
        disabled: this.disabled,
        'w-loading': this.loading,
        active: this.active,
        'w-btn-block': this.block,
        'w-btn-stacked': this.stacked,
        'w-btn--flat': this.flat,
        'w-btn--slim': this.slim,
        [this.selectedClass]: this.active && this.selectedClass,
      })
      + this._extraClasses();
  }

  _iconMarkup(name, iconClass) {
    if (!name) return '';
    const iconSet = this.getAttribute('icon-set') || '';
    return WIcons.resolve(iconSet ? `${iconSet}:${name}` : name, { iconClass });
  }

  _template() {
    const link = !!this.href && !this.disabled;
    const tag = link ? 'a' : 'button';
    const attrs = this._attrs(this._controlAttrs(link));
    return `<${tag} class="${this._classes()}"${attrs}${this._styleAttr()}>${this._contentMarkup()}</${tag}>`;
  }

  // Anchors take href; buttons take the form-ish attributes. Subclass extras
  // are merged last so they can override anything above them.
  _controlAttrs(link) {
    const own = link
      ? { href: this.href }
      : { disabled: this.disabled, value: this.value };
    const aria = WBtn.forwardedAria.concat(link ? [] : WBtn.forwardedButtonAria);
    return Object.assign(own, {
      'aria-busy': this.loading && 'true',
      'aria-label': this.getAttribute('aria-label'),
    }, this._ariaAttrs(aria), this._extraAttrs(link));
  }

  _contentMarkup() {
    return this._iconMarkup(this.prependIcon, 'w-icon w-btn-leading-icon')
      + this._labelMarkup()
      + this._iconMarkup(this.appendIcon, 'w-icon w-btn-append-icon');
  }

  // `text` replaces slotted content but must not drop it: the slot stays in the
  // tree (hidden) so re-renders can still redistribute the authored children.
  _labelMarkup() {
    return this.text ? `${this._esc(this.text)}<slot hidden></slot>` : '<slot></slot>';
  }

  _styleAttr() {
    const styles = this._styles();
    return styles.length ? ` style="${styles.join('; ')}"` : '';
  }

  _styles() { return []; }
  _extraClasses() { return ''; }
  _extraAttrs() { return {}; }

  _events() {
    const btn = this._q('button, a');
    if (!btn) return;

    if (this.hasAttribute('ripple')) this._attachRipple(btn);

    // Forward click to host — but only for programmatic listeners,
    // not re-dispatching. The native event bubbles already.
    btn.addEventListener('focus', () => this._emit('focus'));
    btn.addEventListener('blur', () => this._emit('blur'));
  }
}

if (!customElements.get('w-btn')) customElements.define('w-btn', WBtn);
