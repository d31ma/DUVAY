/* <w-date-picker-months> — Vuetify structural subcomponent */

export class WDatePickerMonths extends WElement {
  _template() {
    return `<div class="w-date-picker-months"><slot></slot></div>`;
  }
}

if (!customElements.get('w-date-picker-months')) {
  customElements.define('w-date-picker-months', WDatePickerMonths);
}
