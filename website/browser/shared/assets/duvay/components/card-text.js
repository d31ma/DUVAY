/* <w-card-text> — Card body text subcomponent */

class WCardText extends WElement {
  _template() {
    return `<div class="w-card-text"><slot></slot></div>`;
  }
}

if (!customElements.get('w-card-text')) {
  customElements.define('w-card-text', WCardText);
}
