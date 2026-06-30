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
 *
 * Slots:
 *   default     - content overlaid on the image
 *   placeholder - shown while loading (overrides lazy-src blur)
 *   error       - shown if the image fails to load
 *
 * Events: load, error (detail = src).
 */

export class WImg extends WElement {
  static attrs = ['src', 'alt', 'cover', 'fit', 'position', 'gradient', 'aspect-ratio', 'width', 'height', 'max-width', 'max-height', 'min-width', 'min-height', 'lazy-src', 'eager', 'srcset', 'sizes', 'color', 'rounded', 'draggable'];

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

  _template() {
    const styles = [];
    const ar = this._attr('aspect-ratio', '');
    if (ar) styles.push(`aspect-ratio: ${this._esc(ar)}`);
    [['width', 'width'], ['height', 'height'], ['max-width', 'max-width'], ['max-height', 'max-height'], ['min-width', 'min-width'], ['min-height', 'min-height']].forEach(([attr, prop]) => {
      const v = this._len(this.getAttribute(attr));
      if (v) styles.push(`${prop}: ${v}`);
    });
    const bg = this._color(this.getAttribute('color'));
    if (bg) styles.push(`background-color: ${bg}`);

    const cover = this._bool('cover') || this._attr('fit', '') === 'cover';
    const contain = this._attr('fit', '') === 'contain';
    const fitClass = cover ? ' w-img__img--cover' : contain ? ' w-img__img--contain' : '';

    const position = this._attr('position', '');
    const imgStyle = position ? ` style="object-position: ${this._esc(position)}"` : '';

    const eager = this._bool('eager');
    const loading = eager ? '' : ' loading="lazy"';
    const draggable = this.getAttribute('draggable');
    const dragAttr = draggable != null ? ` draggable="${this._esc(draggable)}"` : '';
    const srcset = this.getAttribute('srcset');
    const sizes = this.getAttribute('sizes');
    const srcsetAttr = srcset ? ` srcset="${this._esc(srcset)}"` : '';
    const sizesAttr = sizes ? ` sizes="${this._esc(sizes)}"` : '';

    const rounded = this.hasAttribute('rounded')
      ? (this.getAttribute('rounded') && this.getAttribute('rounded') !== 'true'
        ? ' w-img--rounded-' + this.getAttribute('rounded')
        : ' w-img--rounded')
      : '';

    const lazy = this._attr('lazy-src', '');
    const placeholder = this._hasSlot('placeholder')
      ? '<div class="w-img__placeholder"><slot name="placeholder"></slot></div>'
      : lazy
        ? `<div class="w-img__placeholder w-img__placeholder--lazy" style="background-image: url('${this._esc(lazy)}')"></div>`
        : '';

    const gradient = this._attr('gradient', '');
    const gradientEl = gradient ? `<div class="w-img__gradient" style="background-image: linear-gradient(${this._esc(gradient)})"></div>` : '';
    const errorEl = this._hasSlot('error') ? '<div class="w-img__error"><slot name="error"></slot></div>' : '';

    return `<div class="w-img${rounded}" style="${styles.join('; ')}">` +
      placeholder +
      `<img class="w-img__img${fitClass}" src="${this._esc(this.src)}" alt="${this._esc(this.alt)}"${srcsetAttr}${sizesAttr}${loading}${dragAttr}${imgStyle}>` +
      gradientEl +
      errorEl +
      '<div class="w-img__content"><slot></slot></div>' +
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
