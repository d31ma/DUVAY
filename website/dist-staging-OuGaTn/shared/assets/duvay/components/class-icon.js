/* <w-class-icon> — CSS class icon renderer */

export class WClassIcon extends WElement {
  static attrs = ['name', 'size', 'label'];

  get name() { return this._attr('name', ''); }
  get size() { return this._attr('size', ''); }
  get label() { return this._attr('label', ''); }

  _template() {
    const style = this.size ? ` style="font-size:${this._esc(this.size)}"` : '';
    const aria = this.label ? ` role="img" aria-label="${this._esc(this.label)}"` : ' aria-hidden="true"';
    return `<i class="w-icon w-class-icon ${this._esc(this.name)}"${style}${aria}><slot></slot></i>`;
  }
}

if (!customElements.get('w-class-icon')) {
  customElements.define('w-class-icon', WClassIcon);
}
