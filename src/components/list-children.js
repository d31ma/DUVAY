/* <w-list-children> — Vuetify structural subcomponent */

export class WListChildren extends WElement {
  _template() {
    return `<div class="w-list-children"><slot></slot></div>`;
  }
}

if (!customElements.get('w-list-children')) {
  customElements.define('w-list-children', WListChildren);
}
