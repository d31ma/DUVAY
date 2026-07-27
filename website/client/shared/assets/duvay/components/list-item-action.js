/* <w-list-item-action> — Vuetify structural subcomponent
 *
 * Attributes:
 *   start - the action sits at the start of the row, so the gap goes after it
 *   end   - the action sits at the end of the row, so the gap goes before it
 */

export class WListItemAction extends WElement {
  static attrs = ['start', 'end'];

  _template() {
    const classes = 'w-list-item-action' + this._cls({
      'w-list-item-action--start': this._bool('start'),
      'w-list-item-action--end': this._bool('end'),
    });
    return `<div class="${classes}"><slot></slot></div>`;
  }
}

if (!customElements.get('w-list-item-action')) {
  customElements.define('w-list-item-action', WListItemAction);
}
