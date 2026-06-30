/* <w-file-upload-list> — Vuetify structural subcomponent */

export class WFileUploadList extends WElement {
  _template() {
    return `<div class="w-file-upload-list"><slot></slot></div>`;
  }
}

if (!customElements.get('w-file-upload-list')) {
  customElements.define('w-file-upload-list', WFileUploadList);
}
