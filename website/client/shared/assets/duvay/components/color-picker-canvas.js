/* <w-color-picker-canvas> — Vuetify structural subcomponent */

export class WColorPickerCanvas extends WElement {
  _template() {
    return `<div class="w-color-picker-canvas"><slot></slot></div>`;
  }
}

if (!customElements.get('w-color-picker-canvas')) {
  customElements.define('w-color-picker-canvas', WColorPickerCanvas);
}
