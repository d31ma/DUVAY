/* <w-responsive> — aspect-ratio box (Vuetify VResponsive parity).
 *
 * Attributes:
 *   aspect-ratio  - CSS aspect-ratio for the box (default "16 / 9")
 *   content-class - extra classes applied to the internal content element
 *   inline        - render inline instead of block, and stop growing in a flex row
 */

export class WResponsive extends WElement {
  static attrs = ['aspect-ratio', 'content-class', 'inline'];

  get aspectRatio() { return this._attr('aspect-ratio', '16 / 9'); }
  get contentClass() { return this._attr('content-class', ''); }
  get inline() { return this._bool('inline'); }

  _rootStyle() {
    const styles = ['aspect-ratio:' + this._esc(this.aspectRatio)];
    // `inline` shrinks the box to its content and stops it filling a flex row.
    if (this.inline) styles.push('display:inline-block', 'width:auto', 'flex-grow:0');
    return styles.join(';');
  }

  _template() {
    const cls = 'w-responsive' + this._cls({ 'w-responsive--inline': this.inline });
    const contentCls = 'w-responsive__content' + (this.contentClass ? ' ' + this.contentClass : '');
    return `<div class="${cls}" style="${this._rootStyle()}">`
      + `<div class="${this._esc(contentCls)}" style="height:100%">`
      + '<slot style="display:contents"></slot></div></div>';
  }
}

if (!customElements.get('w-responsive')) customElements.define('w-responsive', WResponsive);
