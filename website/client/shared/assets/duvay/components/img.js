/* <w-img> — responsive image (Vuetify VImg parity).
 *
 * Attributes:
 *   src           - image URL
 *   alt           - alt text
 *   cover         - crop to fill (object-fit: cover)
 *   fit           - cover | contain (legacy; `cover` boolean preferred)
 *   position      - object-position (e.g. "center top")
 *   gradient      - CSS gradient stops overlaid on the image
 *                   (e.g. "to top, rgba(0,0,0,.6), transparent")
 *   aspect-ratio  - reserve a ratio box (number or "16 / 9")
 *   width, height, max-width, max-height, min-width, min-height
 *   lazy-src      - low-res placeholder shown (blurred) until the image loads
 *   eager         - load immediately (skip native lazy loading)
 *   srcset, sizes - responsive source descriptors
 *   color         - placeholder background color (token or CSS color)
 *   rounded       - true | <variant> border radius
 *   draggable     - native draggable attribute passthrough
 *   absolute      - position: absolute on the image box
 *   inline        - render inline instead of block, and stop growing in a flex row
 *   content-class - extra classes for the internal content element
 *   image-class   - extra classes for the inner <img>
 *   transition    - transition used when swapping lazy-src for src:
 *                   fade (default vocabulary) | scale | slide-y, or false/none
 *   crossorigin   - "" | anonymous | use-credentials, passed to the <img>
 *   referrerpolicy - referrer policy passed to the <img>
 *
 * Slots:
 *   default     - content overlaid on the image
 *   placeholder - shown while loading (overrides lazy-src blur)
 *   error       - shown if the image fails to load
 *
 * Events: load, error (detail = src).
 */

import { wTransitionClass } from './overlay.js';

export class WImg extends WElement {
  static attrs = ['src', 'alt', 'cover', 'fit', 'position', 'gradient', 'aspect-ratio', 'width', 'height', 'max-width', 'max-height', 'min-width', 'min-height', 'lazy-src', 'eager', 'srcset', 'sizes', 'color', 'rounded', 'draggable', 'absolute', 'inline', 'content-class', 'image-class', 'transition', 'crossorigin', 'referrerpolicy'];

  static colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'danger', 'info', 'surface'];

  get src() { return this._attr('src', ''); }
  get alt() { return this._attr('alt', ''); }

  _len(v) {
    const s = String(v == null ? '' : v).trim();
    if (!s) return '';
    return /^-?\d+(\.\d+)?$/.test(s) ? s + 'px' : s;
  }

  _color(value) {
    const raw = String(value || '').toLowerCase();
    if (!raw) return '';
    const map = { danger: 'error', info: 'primary' };
    if (this.constructor.colors.includes(raw)) return `var(--w-${map[raw] || raw})`;
    return value;
  }

  _hasSlot(name) { return !!this.querySelector('[slot="' + name + '"]'); }

  _boxStyle() {
    const styles = [];
    const ar = this._attr('aspect-ratio', '');
    if (ar) styles.push(`aspect-ratio: ${this._esc(ar)}`);
    [['width', 'width'], ['height', 'height'], ['max-width', 'max-width'], ['max-height', 'max-height'], ['min-width', 'min-width'], ['min-height', 'min-height']].forEach(([attr, prop]) => {
      const v = this._len(this.getAttribute(attr));
      if (v) styles.push(`${prop}: ${v}`);
    });
    const bg = this._color(this.getAttribute('color'));
    if (bg) styles.push(`background-color: ${bg}`);
    return styles.join('; ');
  }

  _layoutClass() {
    return this._cls({
      'w-img--absolute': this._bool('absolute'),
      'w-img--inline': this._bool('inline'),
    });
  }

  _roundedClass() {
    if (!this.hasAttribute('rounded')) return '';
    const value = this.getAttribute('rounded');
    return value && value !== 'true' ? ' w-img--rounded-' + value : ' w-img--rounded';
  }

  _fitClass() {
    const fit = this._attr('fit', '');
    if (this._bool('cover') || fit === 'cover') return ' w-img__img--cover';
    return fit === 'contain' ? ' w-img__img--contain' : '';
  }

  // Attributes forwarded to the inner <img> verbatim; `crossorigin` may legally
  // be the empty string, so presence — not truthiness — decides.
  static passthrough = ['srcset', 'sizes', 'crossorigin', 'referrerpolicy', 'draggable'];

  _imgAttrs() {
    const parts = this.constructor.passthrough
      .filter((name) => this.getAttribute(name) != null)
      .map((name) => ` ${name}="${this._esc(this.getAttribute(name))}"`);
    if (!this._bool('eager')) parts.push(' loading="lazy"');
    const position = this._attr('position', '');
    if (position) parts.push(` style="object-position: ${this._esc(position)}"`);
    return parts.join('');
  }

  // Author-supplied class hooks for the inner elements.
  _extraClass(attr) {
    const value = this._attr(attr, '');
    return value ? ' ' + this._esc(value) : '';
  }

  _placeholderTemplate() {
    if (this._hasSlot('placeholder')) return '<div class="w-img__placeholder"><slot name="placeholder"></slot></div>';
    const lazy = this._attr('lazy-src', '');
    if (!lazy) return '';
    return `<div class="w-img__placeholder w-img__placeholder--lazy" style="background-image: url('${this._esc(lazy)}')"></div>`;
  }

  _gradientTemplate() {
    const gradient = this._attr('gradient', '');
    return gradient ? `<div class="w-img__gradient" style="background-image: linear-gradient(${this._esc(gradient)})"></div>` : '';
  }

  _errorTemplate() {
    return this._hasSlot('error') ? '<div class="w-img__error"><slot name="error"></slot></div>' : '';
  }

  _template() {
    const transition = wTransitionClass(this.getAttribute('transition'), 'w-img');
    const root = 'w-img' + this._roundedClass() + this._layoutClass() + (transition ? ' ' + transition : '');
    return `<div class="${root}" style="${this._boxStyle()}">` +
      this._placeholderTemplate() +
      `<img class="w-img__img${this._fitClass()}${this._extraClass('image-class')}" src="${this._esc(this.src)}" alt="${this._esc(this.alt)}"${this._imgAttrs()}>` +
      this._gradientTemplate() +
      this._errorTemplate() +
      `<div class="w-img__content${this._extraClass('content-class')}"><slot></slot></div>` +
      '</div>';
  }

  _events() {
    const img = this._q('.w-img__img');
    if (!img) return;
    const done = () => { this.classList.add('w-img--loaded'); this._emit('load', this.src); };
    img.addEventListener('load', done);
    img.addEventListener('error', () => { this.classList.add('w-img--error'); this._emit('error', this.src); });
    if (img.complete && img.naturalWidth) done();
  }
}

if (!customElements.get('w-img')) customElements.define('w-img', WImg);
