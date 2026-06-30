/* <w-list-img> — Vuetify structural subcomponent */

export class WListImg extends WElement {
  _template() {
    return `<div class="w-list-img"><slot></slot></div>`;
  }
}

if (!customElements.get('w-list-img')) {
  customElements.define('w-list-img', WListImg);
}
