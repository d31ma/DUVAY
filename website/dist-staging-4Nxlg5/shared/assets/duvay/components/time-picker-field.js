/* <w-time-picker-field> — Vuetify structural subcomponent */

export class WTimePickerField extends WElement {
  _template() {
    return `<div class="w-time-picker-field"><slot></slot></div>`;
  }
}

if (!customElements.get('w-time-picker-field')) {
  customElements.define('w-time-picker-field', WTimePickerField);
}
