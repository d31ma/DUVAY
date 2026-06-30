/* <w-data-table-column> — Vuetify structural subcomponent */

export class WDataTableColumn extends WElement {
  _template() {
    return `<div class="w-data-table-column"><slot></slot></div>`;
  }
}

if (!customElements.get('w-data-table-column')) {
  customElements.define('w-data-table-column', WDataTableColumn);
}
