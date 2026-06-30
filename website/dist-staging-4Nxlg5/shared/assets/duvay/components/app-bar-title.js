/* <w-app-bar-title> — App bar title subcomponent */

class WAppBarTitle extends WElement {
  _template() {
    return `<div class="w-app-bar-title"><slot></slot></div>`;
  }
}

if (!customElements.get('w-app-bar-title')) {
  customElements.define('w-app-bar-title', WAppBarTitle);
}
