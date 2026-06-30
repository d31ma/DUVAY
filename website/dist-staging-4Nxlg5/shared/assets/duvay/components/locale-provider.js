/* <w-locale-provider> — DuVay component module */

export class WLocaleProvider extends WElement {
  static attrs = ['locale'];
  get locale() { return this._attr('locale', ''); }
  _template() { return `<div class="w-locale-provider"${this.locale ? ` lang="${this._esc(this.locale)}"` : ''}><slot></slot></div>`; }
}

if (!customElements.get('w-locale-provider')) customElements.define('w-locale-provider', WLocaleProvider);
