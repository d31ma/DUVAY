/* <w-checkbox-btn> — Vuetify structural subcomponent */

export class WCheckboxBtn extends WElement {
  _template() {
    return `<div class="w-checkbox-btn"><slot></slot></div>`;
  }
}

if (!customElements.get('w-checkbox-btn')) {
  customElements.define('w-checkbox-btn', WCheckboxBtn);
}
