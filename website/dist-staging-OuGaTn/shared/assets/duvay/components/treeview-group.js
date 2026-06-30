/* <w-treeview-group> — Vuetify structural subcomponent */

export class WTreeviewGroup extends WElement {
  _template() {
    return `<div class="w-treeview-group"><slot></slot></div>`;
  }
}

if (!customElements.get('w-treeview-group')) {
  customElements.define('w-treeview-group', WTreeviewGroup);
}
