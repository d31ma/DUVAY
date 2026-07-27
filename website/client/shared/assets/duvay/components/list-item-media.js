/* <w-list-item-media> — Vuetify structural subcomponent
 *
 * Attributes:
 *   start - the media sits at the start of the row, so the gap goes after it
 *   end   - the media sits at the end of the row, so the gap goes before it
 */

export class WListItemMedia extends WElement {
  static attrs = ['start', 'end'];

  _template() {
    const classes = 'w-list-item-media' + this._cls({
      'w-list-item-media--start': this._bool('start'),
      'w-list-item-media--end': this._bool('end'),
    });
    return `<div class="${classes}"><slot></slot></div>`;
  }
}

if (!customElements.get('w-list-item-media')) {
  customElements.define('w-list-item-media', WListItemMedia);
}
