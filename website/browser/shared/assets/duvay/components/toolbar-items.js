/* <w-toolbar-items> — Toolbar items container subcomponent */

class WToolbarItems extends WElement {
  _template() {
    return `<div class="w-toolbar-items"><slot></slot></div>`;
  }
}

if (!customElements.get('w-toolbar-items')) {
  customElements.define('w-toolbar-items', WToolbarItems);
}
