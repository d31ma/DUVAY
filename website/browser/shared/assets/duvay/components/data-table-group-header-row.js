/* <w-data-table-group-header-row> — Vuetify structural subcomponent */

export class WDataTableGroupHeaderRow extends WElement {
  _template() {
    return `<div class="w-data-table-group-header-row"><slot></slot></div>`;
  }
}

if (!customElements.get('w-data-table-group-header-row')) {
  customElements.define('w-data-table-group-header-row', WDataTableGroupHeaderRow);
}
