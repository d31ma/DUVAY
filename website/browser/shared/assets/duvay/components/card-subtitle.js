/* <w-card-subtitle> — Card subtitle subcomponent */

class WCardSubtitle extends WElement {
  _template() {
    return `<div class="w-card-subtitle"><slot></slot></div>`;
  }
}

if (!customElements.get('w-card-subtitle')) {
  customElements.define('w-card-subtitle', WCardSubtitle);
}
