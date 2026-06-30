/* <w-dialog-bottom-transition> — Dialog bottom transition wrapper */

export class WDialogBottomTransition extends WElement {
  _template() {
    return `<div class="w-dialog-bottom-transition w-transition-wrapper"><slot></slot></div>`;
  }
}

if (!customElements.get('w-dialog-bottom-transition')) {
  customElements.define('w-dialog-bottom-transition', WDialogBottomTransition);
}
