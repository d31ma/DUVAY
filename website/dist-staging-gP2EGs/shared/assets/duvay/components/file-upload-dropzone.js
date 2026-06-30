/* <w-file-upload-dropzone> — Vuetify structural subcomponent */

export class WFileUploadDropzone extends WElement {
  _template() {
    return `<div class="w-file-upload-dropzone"><slot></slot></div>`;
  }
}

if (!customElements.get('w-file-upload-dropzone')) {
  customElements.define('w-file-upload-dropzone', WFileUploadDropzone);
}
