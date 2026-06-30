/* <w-slide-y-reverse-transition> — Reverse vertical slide transition wrapper */

export class WSlideYReverseTransition extends WElement {
  _template() {
    return `<div class="w-slide-y-reverse-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-slide-y-reverse-transition')) {
  customElements.define('w-slide-y-reverse-transition', WSlideYReverseTransition);
}
