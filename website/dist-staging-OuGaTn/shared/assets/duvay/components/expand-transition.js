/* <w-expand-transition> — Expand transition wrapper */

export class WExpandTransition extends WElement {
  _template() {
    return `<div class="w-expand-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-expand-transition')) {
  customElements.define('w-expand-transition', WExpandTransition);
}
