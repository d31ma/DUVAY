/* <w-no-ssr> — DuVay component module */

export class WNoSsr extends WElement {
  _template() { return `<slot></slot>`; }
}

if (!customElements.get('w-no-ssr')) customElements.define('w-no-ssr', WNoSsr);
