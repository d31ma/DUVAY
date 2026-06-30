/* <w-app> — DuVay component module */

export class WApp extends WElement {
  _template() { return `<div class="w-app"><slot></slot></div>`; }
}

if (!customElements.get('w-app')) customElements.define('w-app', WApp);
