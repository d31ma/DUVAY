/* <w-scroll-y-reverse-transition> — Reverse vertical scroll transition wrapper */

export class WScrollYReverseTransition extends WElement {
  _template() {
    return `<div class="w-scroll-y-reverse-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-scroll-y-reverse-transition')) {
  customElements.define('w-scroll-y-reverse-transition', WScrollYReverseTransition);
}
