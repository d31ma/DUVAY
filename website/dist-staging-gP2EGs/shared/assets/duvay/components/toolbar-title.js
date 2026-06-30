/* <w-toolbar-title> — Toolbar title subcomponent */

class WToolbarTitle extends WElement {
  _template() {
    return `<div class="w-toolbar-title"><slot></slot></div>`;
  }
}

if (!customElements.get('w-toolbar-title')) {
  customElements.define('w-toolbar-title', WToolbarTitle);
}
