/* <w-date-picker-month> — Vuetify structural subcomponent */

export class WDatePickerMonth extends WElement {
  _template() {
    return `<div class="w-date-picker-month"><slot></slot></div>`;
  }
}

if (!customElements.get('w-date-picker-month')) {
  customElements.define('w-date-picker-month', WDatePickerMonth);
}
