/* <w-expand-x-transition> — Expand horizontal transition wrapper */

export class WExpandXTransition extends WElement {
  _template() {
    return `<div class="w-expand-x-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-expand-x-transition')) {
  customElements.define('w-expand-x-transition', WExpandXTransition);
}
