/* <w-picker-title> — Vuetify structural subcomponent */

export class WPickerTitle extends WElement {
  _template() {
    return `<div class="w-picker-title"><slot></slot></div>`;
  }
}

if (!customElements.get('w-picker-title')) {
  customElements.define('w-picker-title', WPickerTitle);
}
