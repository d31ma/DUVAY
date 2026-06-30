/* <w-field-label> — Vuetify structural subcomponent */

export class WFieldLabel extends WElement {
  _template() {
    return `<div class="w-field-label"><slot></slot></div>`;
  }
}

if (!customElements.get('w-field-label')) {
  customElements.define('w-field-label', WFieldLabel);
}
