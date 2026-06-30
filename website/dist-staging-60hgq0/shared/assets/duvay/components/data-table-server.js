/* <w-data-table-server> — Vuetify structural subcomponent */

export class WDataTableServer extends WElement {
  _template() {
    return `<div class="w-data-table-server"><slot></slot></div>`;
  }
}

if (!customElements.get('w-data-table-server')) {
  customElements.define('w-data-table-server', WDataTableServer);
}
