/* <w-component-icon> — Icon component slot wrapper */

export class WComponentIcon extends WElement {
  static attrs = ['label'];

  get label() { return this._attr('label', ''); }

  _template() {
    const aria = this.label ? ` role="img" aria-label="${this._esc(this.label)}"` : ' aria-hidden="true"';
    return `<span class="w-icon w-component-icon"${aria}><slot></slot></span>`;
  }
}

if (!customElements.get('w-component-icon')) {
  customElements.define('w-component-icon', WComponentIcon);
}
