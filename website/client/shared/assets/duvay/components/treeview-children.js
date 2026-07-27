/* <w-treeview-children> — Vuetify structural subcomponent */

export class WTreeviewChildren extends WElement {
  _template() {
    return `<div class="w-treeview-children"><slot></slot></div>`;
  }
}

if (!customElements.get('w-treeview-children')) {
  customElements.define('w-treeview-children', WTreeviewChildren);
}
