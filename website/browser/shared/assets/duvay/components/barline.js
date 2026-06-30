/* <w-barline> — Vuetify structural subcomponent */

export class WBarline extends WElement {
  _template() {
    return `<div class="w-barline"><slot></slot></div>`;
  }
}

if (!customElements.get('w-barline')) {
  customElements.define('w-barline', WBarline);
}
