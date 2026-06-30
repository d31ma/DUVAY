/* <w-file-upload-item> — Vuetify structural subcomponent */

export class WFileUploadItem extends WElement {
  _template() {
    return `<div class="w-file-upload-item"><slot></slot></div>`;
  }
}

if (!customElements.get('w-file-upload-item')) {
  customElements.define('w-file-upload-item', WFileUploadItem);
}
