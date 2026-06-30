/* <w-app> — application root / layout host (Vuetify VApp).
 *
 * Attributes:
 *   theme       - light | dark | auto | high-contrast — scopes the app theme
 *                 via data-w-theme so descendants resolve to that palette.
 *   full-height - fill the viewport height (default true; set "false" to opt out).
 *
 * Slot: default — the application shell (app bars, navigation drawers, w-main…).
 */

export class WApp extends WElement {
  static attrs = ['theme', 'full-height'];

  get theme() { return this._attr('theme', ''); }
  get fullHeight() {
    const v = this.getAttribute('full-height');
    return v == null || !['false', '0', 'off'].includes(v.toLowerCase());
  }

  _template() {
    const cls = ['w-app', this.fullHeight ? 'w-app--full-height' : ''].filter(Boolean).join(' ');
    const themeAttr = this.theme ? ` data-w-theme="${this._esc(this.theme)}"` : '';
    return `<div class="${cls}"${themeAttr}><slot></slot></div>`;
  }
}

if (!customElements.get('w-app')) customElements.define('w-app', WApp);
