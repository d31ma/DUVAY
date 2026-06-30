/* <w-data-table-footer> — Data table footer subcomponent */

class WDataTableFooter extends WElement {
  _template() {
    return `<div class="w-data-table-footer"><slot></slot></div>`;
  }
}

if (!customElements.get('w-data-table-footer')) {
  customElements.define('w-data-table-footer', WDataTableFooter);
}
