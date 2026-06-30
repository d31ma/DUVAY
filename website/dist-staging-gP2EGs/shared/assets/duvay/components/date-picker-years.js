/* <w-date-picker-years> — Vuetify structural subcomponent */

export class WDatePickerYears extends WElement {
  _template() {
    return `<div class="w-date-picker-years"><slot></slot></div>`;
  }
}

if (!customElements.get('w-date-picker-years')) {
  customElements.define('w-date-picker-years', WDatePickerYears);
}
