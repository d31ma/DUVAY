/* <w-footer> — DuVay component module */

export class WFooter extends WElement {
  _template() {
    return `<footer class="w-footer"><slot></slot></footer>`;
  }
}

if (!customElements.get('w-footer')) customElements.define('w-footer', WFooter);
