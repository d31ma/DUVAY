/* <w-divider> — DuVay component module */

export class WDivider extends WElement {
  static attrs = ['vertical', 'inset'];

  get vertical() { return this._bool('vertical'); }
  get inset() { return this._bool('inset'); }

  _template() {
    const cls = `w-divider${this.vertical ? ' w-divider--vertical' : ''}${this.inset ? ' w-divider--inset' : ''}`;
    return `<div class="${cls}" role="separator" aria-orientation="${this.vertical ? 'vertical' : 'horizontal'}"></div>`;
  }
}

if (!customElements.get('w-divider')) customElements.define('w-divider', WDivider);
