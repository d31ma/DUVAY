/* <w-date-picker-controls> — Vuetify structural subcomponent */

export class WDatePickerControls extends WElement {
  _template() {
    return `<div class="w-date-picker-controls"><slot></slot></div>`;
  }
}

if (!customElements.get('w-date-picker-controls')) {
  customElements.define('w-date-picker-controls', WDatePickerControls);
}
