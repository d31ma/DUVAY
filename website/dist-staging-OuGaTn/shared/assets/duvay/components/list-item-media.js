/* <w-list-item-media> — Vuetify structural subcomponent */

export class WListItemMedia extends WElement {
  _template() {
    return `<div class="w-list-item-media"><slot></slot></div>`;
  }
}

if (!customElements.get('w-list-item-media')) {
  customElements.define('w-list-item-media', WListItemMedia);
}
