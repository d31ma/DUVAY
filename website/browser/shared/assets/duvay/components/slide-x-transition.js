/* <w-slide-x-transition> — Horizontal slide transition wrapper */

export class WSlideXTransition extends WElement {
  _template() {
    return `<div class="w-slide-x-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-slide-x-transition')) {
  customElements.define('w-slide-x-transition', WSlideXTransition);
}
