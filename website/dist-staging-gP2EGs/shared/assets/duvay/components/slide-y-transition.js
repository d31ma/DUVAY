/* <w-slide-y-transition> — Vertical slide transition wrapper */

export class WSlideYTransition extends WElement {
  _template() {
    return `<div class="w-slide-y-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-slide-y-transition')) {
  customElements.define('w-slide-y-transition', WSlideYTransition);
}
