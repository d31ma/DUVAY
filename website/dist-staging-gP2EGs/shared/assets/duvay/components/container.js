/* <w-container> — responsive layout container */

export class WContainer extends WElement {
  static attrs = ['fluid', 'size'];

  get fluid() { return this._bool('fluid'); }
  get size() { return this._attr('size', ''); }

  _template() {
    return `<slot></slot>`;
  }

  _events() {
    const classes = ['w-container'];
    if (this.fluid) classes.push('w-container--fluid');
    if (this.size) classes.push('w-container--' + this.size);
    this._syncGridClasses(classes);
  }

  _syncGridClasses(classes) {
    (this._wGridClasses || []).forEach((name) => this.classList.remove(name));
    classes.forEach((name) => this.classList.add(name));
    this._wGridClasses = classes;
  }
}

if (!customElements.get('w-container')) {
  customElements.define('w-container', WContainer);
}
