/* <w-theme-provider> — applies a DuVay theme to its descendants (Vuetify VThemeProvider).
 *
 * Attributes:
 *   theme           - light | dark | auto | high-contrast — scopes the theme via
 *                     data-w-theme so descendant tokens resolve to that palette.
 *   with-background - paint the themed surface + text on the wrapper (otherwise
 *                     the provider is renderless and only scopes the tokens).
 *
 * Slot: default — content rendered within the theme scope.
 */

export class WThemeProvider extends WElement {
  static attrs = ['theme', 'with-background'];

  get theme() { return this._attr('theme', ''); }

  _template() {
    const cls = ['w-theme-provider', this._bool('with-background') ? 'w-theme-provider--with-background' : ''].filter(Boolean).join(' ');
    const themeAttr = this.theme ? ` data-w-theme="${this._esc(this.theme)}"` : '';
    return `<div class="${cls}"${themeAttr}><slot></slot></div>`;
  }
}

if (!customElements.get('w-theme-provider')) customElements.define('w-theme-provider', WThemeProvider);
