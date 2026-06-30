/* <w-theme-provider> — DuVay component module */

export class WThemeProvider extends WElement {
  static attrs = ['theme'];
  get theme() { return this._attr('theme', ''); }
  _template() { return `<div class="w-theme-provider"${this.theme ? ` data-w-theme="${this._esc(this.theme)}"` : ''}><slot></slot></div>`; }
}

if (!customElements.get('w-theme-provider')) customElements.define('w-theme-provider', WThemeProvider);
