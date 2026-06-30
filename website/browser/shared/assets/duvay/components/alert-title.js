/* <w-alert-title> — Alert title subcomponent */

class WAlertTitle extends WElement {
  _template() {
    return `<div class="w-alert-title"><slot></slot></div>`;
  }
}

if (!customElements.get('w-alert-title')) {
  customElements.define('w-alert-title', WAlertTitle);
}
