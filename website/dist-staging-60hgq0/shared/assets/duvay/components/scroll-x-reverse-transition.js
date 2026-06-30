/* <w-scroll-x-reverse-transition> — Reverse horizontal scroll transition wrapper */

export class WScrollXReverseTransition extends WElement {
  _template() {
    return `<div class="w-scroll-x-reverse-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-scroll-x-reverse-transition')) {
  customElements.define('w-scroll-x-reverse-transition', WScrollXReverseTransition);
}
