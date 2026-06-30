/* <w-color-picker-preview> — Vuetify structural subcomponent */

export class WColorPickerPreview extends WElement {
  _template() {
    return `<div class="w-color-picker-preview"><slot></slot></div>`;
  }
}

if (!customElements.get('w-color-picker-preview')) {
  customElements.define('w-color-picker-preview', WColorPickerPreview);
}
