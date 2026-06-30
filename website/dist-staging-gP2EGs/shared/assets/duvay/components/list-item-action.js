/* <w-list-item-action> — Vuetify structural subcomponent */

export class WListItemAction extends WElement {
  _template() {
    return `<div class="w-list-item-action"><slot></slot></div>`;
  }
}

if (!customElements.get('w-list-item-action')) {
  customElements.define('w-list-item-action', WListItemAction);
}
