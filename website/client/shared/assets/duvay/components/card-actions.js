/* <w-card-actions> — Card actions subcomponent */

class WCardActions extends WElement {
  _template() {
    return `<div class="w-card-actions"><slot></slot></div>`;
  }
}

if (!customElements.get('w-card-actions')) {
  customElements.define('w-card-actions', WCardActions);
}
