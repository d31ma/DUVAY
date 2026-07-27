/* <w-list-subheader> — List subheader subcomponent
 *
 * Attributes:
 *   title  - heading text (alternative to the default slot)
 *   sticky - pins the subheader to the top of the scrolling list
 *   inset  - aligns the subheader with list-item content instead of the edge
 */

class WListSubheader extends WElement {
  static attrs = ['title', 'sticky', 'inset'];

  get subheaderTitle() { return this._attr('title', ''); }

  _template() {
    const cls = 'w-list-subheader' + this._cls({
      'w-list-subheader--sticky': this._bool('sticky'),
      'w-list-subheader--inset': this._bool('inset'),
    });
    const inner = this.subheaderTitle
      ? this._esc(this.subheaderTitle) + '<slot hidden></slot>'
      : '<slot></slot>';
    return `<div class="${cls}">${inner}</div>`;
  }
}

if (!customElements.get('w-list-subheader')) {
  customElements.define('w-list-subheader', WListSubheader);
}
