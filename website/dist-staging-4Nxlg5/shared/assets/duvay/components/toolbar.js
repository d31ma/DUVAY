/* <w-toolbar> — DuVay component module */

export class WToolbar extends WElement {
  _template() {
    return `<div class="w-toolbar"><slot></slot></div>`;
  }
}

if (!customElements.get('w-toolbar')) customElements.define('w-toolbar', WToolbar);
