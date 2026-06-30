/* <w-time-picker-clock> — Vuetify structural subcomponent */

export class WTimePickerClock extends WElement {
  _template() {
    return `<div class="w-time-picker-clock"><slot></slot></div>`;
  }
}

if (!customElements.get('w-time-picker-clock')) {
  customElements.define('w-time-picker-clock', WTimePickerClock);
}
