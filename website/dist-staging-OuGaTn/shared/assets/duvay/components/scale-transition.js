/* <w-scale-transition> — Scale transition wrapper */

export class WScaleTransition extends WElement {
  _template() {
    return `<div class="w-scale-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-scale-transition')) {
  customElements.define('w-scale-transition', WScaleTransition);
}
