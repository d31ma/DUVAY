/* <w-main> — primary content region of the application shell (Vuetify VMain).
 *
 * Sits beside persistent navigation drawers and below app bars. Add
 * `scrollable` to give the main region its own scroll container instead of
 * scrolling the page.
 *
 * Attributes:
 *   scrollable - main becomes an independent scroll area (own overflow).
 *
 * Slot: default — page content.
 */

export class WMain extends WElement {
  static attrs = ['scrollable'];

  get scrollable() { return this._bool('scrollable'); }

  _template() {
    const cls = ['w-main', this.scrollable ? 'w-main--scrollable' : ''].filter(Boolean).join(' ');
    return `<main class="${cls}"><slot></slot></main>`;
  }
}

if (!customElements.get('w-main')) customElements.define('w-main', WMain);
