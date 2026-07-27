/* <w-list-item-title> — List item title subcomponent */

class WListItemTitle extends WElement {
  _template() {
    return `<div class="w-list-item-title"><slot></slot></div>`;
  }
}

if (!customElements.get('w-list-item-title')) {
  customElements.define('w-list-item-title', WListItemTitle);
}
