/* <w-data-table-virtual> — Vuetify structural subcomponent */

export class WDataTableVirtual extends WElement {
  _template() {
    return `<div class="w-data-table-virtual"><slot></slot></div>`;
  }
}

if (!customElements.get('w-data-table-virtual')) {
  customElements.define('w-data-table-virtual', WDataTableVirtual);
}
