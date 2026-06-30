/* <w-scroll-y-transition> — Vertical scroll transition wrapper */

export class WScrollYTransition extends WElement {
  _template() {
    return `<div class="w-scroll-y-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-scroll-y-transition')) {
  customElements.define('w-scroll-y-transition', WScrollYTransition);
}
