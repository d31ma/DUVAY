/* <w-skeleton> — Loading placeholder web component
 *
 * Attributes:
 *   variant  - text | avatar | block (default: text)
 *   lines    - number of text lines to render (default: 1, only for variant="text")
 *   width    - CSS width override (e.g., "60%", "200px")
 *   height   - CSS height override (e.g., "56px")
 *
 * No slots — self-contained visual element.
 */

class WSkeleton extends WElement {

  static attrs = ['variant', 'lines', 'width', 'height'];

  get variant() { return this._attr('variant', 'text'); }
  get lines()   { return parseInt(this._attr('lines', '1'), 10) || 1; }
  get width()   { return this._attr('width', ''); }
  get height()  { return this._attr('height', ''); }

  _template() {
    const v = this.variant;
    const customWidth = this.width ? ` style="width: ${this._esc(this.width)};"` : '';
    const customHeight = this.height ? ` style="height: ${this._esc(this.height)};"` : '';

    if (v === 'avatar') {
      return `<div class="w-skeleton w-skeleton-avatar"${customWidth}${customHeight}></div>`;
    }

    if (v === 'block') {
      return `<div class="w-skeleton w-skeleton-block"${customWidth}${customHeight}></div>`;
    }

    // text variant (default)
    let html = '';
    const count = Math.max(1, this.lines);
    for (let i = 0; i < count; i++) {
      const style = customWidth || (i === count - 1 && count > 1 ? ' style="width: 60%;"' : '');
      html += `<div class="w-skeleton w-skeleton-text"${style}></div>`;
    }
    return html;
  }
}

customElements.define('w-skeleton', WSkeleton);
