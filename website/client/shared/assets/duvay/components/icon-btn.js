/* <w-icon-btn> — icon-only button (Vuetify VIconBtn parity)
 *
 * Extends <w-btn>, so every button attribute works here too (variant, color,
 * disabled, loading, href, text, value, block, slim, stacked, flat, ripple,
 * selected-class, prepend-icon, append-icon, aria-label …).
 *
 * Own attributes:
 *   size          - x-small | small | default | large | x-large (or xs/sm/lg/xl)
 *   sizes         - tuple list overriding the button size per named size,
 *                   "small|28,large|56" or [["small",28],["large",56]]
 *   icon-size     - explicit glyph size; a length, a number, or a named size
 *   icon-sizes    - tuple list overriding the glyph size per named size
 *   icon-color    - explicit colour for the glyph (token name or CSS colour)
 *   rotate        - glyph rotation in degrees
 *   opacity       - opacity of the whole control
 *   active        - tri-state: absent keeps `variant`, present uses
 *                   `active-variant` / `active-icon`, active="false" uses
 *                   `base-variant`
 *   active-icon   - icon shown while active
 *   active-variant/base-variant - variants for the two active states
 *   hide-overlay  - suppresses the hover / press overlay
 */

import { WBtn } from './btn.js';
import { wRows, wFields } from './utils.js';

// Glyph scale for `icon-size="small"` and friends. Button sizes live in CSS
// (.w-icon-btn--<size>), so only the named glyph sizes need a table here.
const W_ICON_GLYPHS = {
  'x-small': '0.875rem', xs: '0.875rem',
  small: '1rem', sm: '1rem',
  default: '1.25rem', md: '1.25rem',
  large: '1.5rem', lg: '1.5rem',
  'x-large': '1.75rem', xl: '1.75rem',
};

/* A bare number is pixels; anything else is already a CSS length. */
function wLength(value) {
  const raw = String(value ?? '').trim();
  return /^-?\d+(\.\d+)?$/.test(raw) ? raw + 'px' : raw;
}

/* A bare word resolves to the matching design token; anything else is used
   verbatim as a CSS colour. */
function wColor(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return /^[a-z][a-z0-9-]*$/i.test(raw) ? `var(--w-${raw.toLowerCase()}, ${raw})` : raw;
}

export class WIconBtn extends WBtn {
  static attrs = [
    'opacity', 'icon-color', 'rotate', 'icon-size', 'icon-sizes', 'sizes',
    'active-icon', 'active-variant', 'base-variant', 'hide-overlay',
  ];

  // Tri-state `active`: an explicit "false" is still a present attribute, so it
  // selects base-variant rather than falling back to the default variant.
  get active() { return this.hasAttribute('active') && this.getAttribute('active') !== 'false'; }

  get variant() {
    if (!this.hasAttribute('active')) return this._attr('variant', 'text');
    const state = this.active ? 'active-variant' : 'base-variant';
    return this._attr(state, null) ?? this._attr('variant', 'text');
  }

  get icon() {
    const activeIcon = this._attr('active-icon', '');
    return (this.active && activeIcon) || this._attr('icon', '');
  }

  // The main glyph is rendered by _contentMarkup, so prepend-icon must not fall
  // back to `icon` the way it does on <w-btn>.
  get prependIcon() { return this._attr('prepend-icon', ''); }

  _extraClasses() {
    return this._cls({
      'w-btn-icon w-icon-btn': true,
      ['w-icon-btn--' + this.size]: this.size,
      'w-icon-btn--no-overlay': this._bool('hide-overlay'),
    });
  }

  _extraAttrs(link) {
    return {
      type: link ? '' : 'button',
      'aria-label': this.getAttribute('aria-label') || this.icon || 'Icon button',
    };
  }

  _contentMarkup() {
    return this._iconMarkup(this.icon, 'w-icon') + super._contentMarkup();
  }

  _styles() {
    return [
      this._decl('--w-icon-btn-size', this._tableValue('sizes', this.size)),
      this._decl('--w-icon-btn-icon', this._iconSize()),
      this._decl('--w-icon-btn-icon-color', wColor(this._attr('icon-color', ''))),
      this._decl('--w-icon-btn-rotate', this._rotation()),
      this._decl('opacity', this._attr('opacity', '')),
    ].filter(Boolean);
  }

  _decl(name, value) { return value ? `${name}: ${value}` : ''; }

  // `sizes` / `icon-sizes` are tuple lists — wRows/wFields accept both the
  // "name|value,name|value" shorthand and the JSON array of pairs.
  _tableValue(attr, key) {
    if (!key) return '';
    const pairs = wRows(this.getAttribute(attr)).map((row) => wFields(row));
    const match = pairs.find((pair) => pair[0] === key);
    return match ? wLength(match[1]) : '';
  }

  _iconSize() {
    const named = this._attr('icon-size', '');
    if (!named) return this._tableValue('icon-sizes', this.size);
    return this._tableValue('icon-sizes', named) || W_ICON_GLYPHS[named] || wLength(named);
  }

  _rotation() {
    const raw = this._attr('rotate', '');
    if (!raw) return '';
    return /^-?[\d.]+$/.test(raw) ? raw + 'deg' : raw;
  }
}

if (!customElements.get('w-icon-btn')) customElements.define('w-icon-btn', WIconBtn);
