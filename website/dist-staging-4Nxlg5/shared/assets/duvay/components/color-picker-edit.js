/* <w-color-picker-edit> — Vuetify structural subcomponent */

export class WColorPickerEdit extends WElement {
  _template() {
    return `<div class="w-color-picker-edit"><slot></slot></div>`;
  }
}

if (!customElements.get('w-color-picker-edit')) {
  customElements.define('w-color-picker-edit', WColorPickerEdit);
}
