/* <w-card-title> — Card title subcomponent */

class WCardTitle extends WElement {
  _template() {
    return `<div class="w-card-title"><slot></slot></div>`;
  }
}

if (!customElements.get('w-card-title')) {
  customElements.define('w-card-title', WCardTitle);
}
