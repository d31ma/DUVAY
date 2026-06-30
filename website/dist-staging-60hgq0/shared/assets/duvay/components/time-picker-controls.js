/* <w-time-picker-controls> — Vuetify structural subcomponent */

export class WTimePickerControls extends WElement {
  _template() {
    return `<div class="w-time-picker-controls"><slot></slot></div>`;
  }
}

if (!customElements.get('w-time-picker-controls')) {
  customElements.define('w-time-picker-controls', WTimePickerControls);
}
