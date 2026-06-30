/* <w-defaults-provider> — DuVay component module */

export class WDefaultsProvider extends WElement {
  _template() { return `<div class="w-defaults-provider"><slot></slot></div>`; }
}

if (!customElements.get('w-defaults-provider')) customElements.define('w-defaults-provider', WDefaultsProvider);
