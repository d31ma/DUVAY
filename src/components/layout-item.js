/* <w-layout-item> — Vuetify structural subcomponent */

export class WLayoutItem extends WElement {
  _template() {
    return `<div class="w-layout-item"><slot></slot></div>`;
  }
}

if (!customElements.get('w-layout-item')) {
  customElements.define('w-layout-item', WLayoutItem);
}
