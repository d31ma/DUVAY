/* <w-menubar> - horizontal application menu */

export class WMenubar extends WElement {
  _template() {
    return `<nav class="w-menubar" role="menubar"><slot></slot></nav>`;
  }
}

if (!customElements.get('w-menubar')) {
  customElements.define('w-menubar', WMenubar);
}
