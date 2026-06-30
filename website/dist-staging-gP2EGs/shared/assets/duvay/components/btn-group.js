/* <w-btn-group> — DuVay component module */

export class WBtnGroup extends WElement {
  _template() { return `<div class="w-btn-group" role="group"><slot></slot></div>`; }
}

if (!customElements.get('w-btn-group')) customElements.define('w-btn-group', WBtnGroup);
