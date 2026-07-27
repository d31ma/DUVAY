/* <w-color-picker-swatches> — Vuetify structural subcomponent */

export class WColorPickerSwatches extends WElement {
  _template() {
    return `<div class="w-color-picker-swatches"><slot></slot></div>`;
  }
}

if (!customElements.get('w-color-picker-swatches')) {
  customElements.define('w-color-picker-swatches', WColorPickerSwatches);
}
