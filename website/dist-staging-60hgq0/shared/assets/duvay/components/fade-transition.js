/* <w-fade-transition> — Fade transition wrapper */

export class WFadeTransition extends WElement {
  _template() {
    return `<div class="w-fade-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-fade-transition')) {
  customElements.define('w-fade-transition', WFadeTransition);
}
