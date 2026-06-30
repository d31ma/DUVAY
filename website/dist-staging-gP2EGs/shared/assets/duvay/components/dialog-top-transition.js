/* <w-dialog-top-transition> — Dialog top transition wrapper */

export class WDialogTopTransition extends WElement {
  _template() {
    return `<div class="w-dialog-top-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-dialog-top-transition')) {
  customElements.define('w-dialog-top-transition', WDialogTopTransition);
}
