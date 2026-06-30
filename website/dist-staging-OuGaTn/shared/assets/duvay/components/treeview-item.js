/* <w-treeview-item> — Vuetify structural subcomponent */

export class WTreeviewItem extends WElement {
  _template() {
    return `<div class="w-treeview-item"><slot></slot></div>`;
  }
}

if (!customElements.get('w-treeview-item')) {
  customElements.define('w-treeview-item', WTreeviewItem);
}
