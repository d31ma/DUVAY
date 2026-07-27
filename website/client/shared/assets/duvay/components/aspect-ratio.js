/* <w-aspect-ratio> — fixed-ratio content wrapper (Vuetify VResponsive / VAspectRatio).
 *
 * Attributes:
 *   ratio / aspect-ratio - W/H ratio (default 16 / 9). Number ("1.7") or "16 / 9".
 *   width, height        - explicit dimensions (number → px, or any CSS length)
 *   max-width, max-height, min-width, min-height
 *   content-class        - extra class applied to the inner content wrapper
 *   inline               - render inline-block instead of block
 *
 * Slot: default — media/content stretched to fill the ratio box.
 */

function wLen(v) {
  const s = String(v == null ? '' : v).trim();
  if (!s) return '';
  return /^-?\d+(\.\d+)?$/.test(s) ? s + 'px' : s;
}

export class WAspectRatio extends WElement {
  static attrs = ['ratio', 'aspect-ratio', 'width', 'height', 'max-width', 'max-height', 'min-width', 'min-height', 'content-class', 'inline'];

  get ratio() { return this._attr('ratio', this._attr('aspect-ratio', '16 / 9')); }

  _template() {
    const styles = [`--w-aspect-ratio: ${this._esc(this.ratio)}`];
    [['width', 'width'], ['height', 'height'], ['max-width', 'max-width'], ['max-height', 'max-height'], ['min-width', 'min-width'], ['min-height', 'min-height']].forEach(([attr, prop]) => {
      const v = wLen(this.getAttribute(attr));
      if (v) styles.push(`${prop}: ${v}`);
    });

    const cls = ['w-aspect-ratio', this._bool('inline') ? 'w-aspect-ratio--inline' : ''].filter(Boolean).join(' ');
    const contentClass = ['w-aspect-ratio__content', this._attr('content-class', '')].filter(Boolean).join(' ');
    return `<div class="${cls}" style="${styles.join('; ')}"><div class="${this._esc(contentClass)}"><slot></slot></div></div>`;
  }
}

if (!customElements.get('w-aspect-ratio')) {
  customElements.define('w-aspect-ratio', WAspectRatio);
}

export { wLen };
