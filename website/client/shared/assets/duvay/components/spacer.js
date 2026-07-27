/* <w-spacer> — flexible layout spacer */

export class WSpacer extends WElement {
  _template() {
    return `<div class="w-spacer"></div>`;
  }
}

if (!customElements.get('w-spacer')) {
  customElements.define('w-spacer', WSpacer);
}
