/* <w-layout> — layout grid host (Vuetify VLayout).
 *
 * Attributes:
 *   full-height - stretch the layout to 100% of its container's height
 *
 * Not implemented: `overlaps`, which Vuetify documents as "FOR INTERNAL USE
 * ONLY" — it configures Vue's layout-registration internals and has no
 * attribute-layer meaning.
 */

export class WLayout extends WElement {
  static attrs = ['full-height'];

  _template() {
    const cls = 'w-layout' + this._cls({ 'w-layout--full-height': this._bool('full-height') });
    return `<div class="${cls}"><slot></slot></div>`;
  }
}

if (!customElements.get('w-layout')) customElements.define('w-layout', WLayout);
