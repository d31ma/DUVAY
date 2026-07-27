/* <w-label> — DuVay component module
 *
 * Attributes:
 *   text - label content (alternative to the default slot)
 */

export class WLabel extends WElement {
  static attrs = ['text'];

  get text() { return this._attr('text', ''); }

  _template() {
    const inner = this.text ? this._esc(this.text) + '<slot hidden></slot>' : '<slot></slot>';
    return `<span class="w-label">${inner}</span>`;
  }
}

if (!customElements.get('w-label')) customElements.define('w-label', WLabel);
