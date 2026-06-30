/* <w-fab-transition> — FAB transition wrapper */

export class WFabTransition extends WElement {
  _template() {
    return `<div class="w-fab-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-fab-transition')) {
  customElements.define('w-fab-transition', WFabTransition);
}
