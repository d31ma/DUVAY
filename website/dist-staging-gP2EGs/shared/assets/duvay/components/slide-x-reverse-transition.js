/* <w-slide-x-reverse-transition> — Reverse horizontal slide transition wrapper */

export class WSlideXReverseTransition extends WElement {
  _template() {
    return `<div class="w-slide-x-reverse-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-slide-x-reverse-transition')) {
  customElements.define('w-slide-x-reverse-transition', WSlideXReverseTransition);
}
