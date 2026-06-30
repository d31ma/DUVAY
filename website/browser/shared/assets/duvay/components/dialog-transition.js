/* <w-dialog-transition> — Dialog transition wrapper */

export class WDialogTransition extends WElement {
  _template() {
    return `<div class="w-dialog-transition"><slot></slot></div>`;
  }
}

if (!customElements.get('w-dialog-transition')) {
  customElements.define('w-dialog-transition', WDialogTransition);
}
