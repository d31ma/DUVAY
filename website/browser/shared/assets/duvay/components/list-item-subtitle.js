/* <w-list-item-subtitle> — List item subtitle subcomponent */

class WListItemSubtitle extends WElement {
  _template() {
    return `<div class="w-list-item-subtitle"><slot></slot></div>`;
  }
}

if (!customElements.get('w-list-item-subtitle')) {
  customElements.define('w-list-item-subtitle', WListItemSubtitle);
}
