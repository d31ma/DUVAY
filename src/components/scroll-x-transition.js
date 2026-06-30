/* <w-scroll-x-transition> — Horizontal scroll transition wrapper */

export class WScrollXTransition extends WElement {
  _template() {
    return `<div class="w-scroll-x-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-scroll-x-transition')) {
  customElements.define('w-scroll-x-transition', WScrollXTransition);
}
