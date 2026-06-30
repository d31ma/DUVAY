/* <w-expand-both-transition> — Expand both axes transition wrapper */

export class WExpandBothTransition extends WElement {
  _template() {
    return `<div class="w-expand-both-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-expand-both-transition')) {
  customElements.define('w-expand-both-transition', WExpandBothTransition);
}
