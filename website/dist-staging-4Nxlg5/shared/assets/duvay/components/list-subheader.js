/* <w-list-subheader> — List subheader subcomponent */

class WListSubheader extends WElement {
  _template() {
    return `<div class="w-list-subheader"><slot></slot></div>`;
  }
}

if (!customElements.get('w-list-subheader')) {
  customElements.define('w-list-subheader', WListSubheader);
}
