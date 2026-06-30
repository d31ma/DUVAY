/* <w-col> — responsive grid column */

export class WCol extends WElement {
  static attrs = ['cols', 'sm', 'md', 'lg', 'offset', 'offset-sm', 'offset-md', 'offset-lg', 'align-self'];

  get cols() { return this._attr('cols', ''); }
  get sm() { return this._attr('sm', ''); }
  get md() { return this._attr('md', ''); }
  get lg() { return this._attr('lg', ''); }
  get offset() { return this._attr('offset', ''); }
  get offsetSm() { return this._attr('offset-sm', ''); }
  get offsetMd() { return this._attr('offset-md', ''); }
  get offsetLg() { return this._attr('offset-lg', ''); }
  get alignSelf() { return this._attr('align-self', ''); }

  _template() {
    return `<slot></slot>`;
  }

  _events() {
    const classes = ['w-grid-col'];
    this._colClass(classes, '', this.cols);
    this._colClass(classes, 'sm', this.sm);
    this._colClass(classes, 'md', this.md);
    this._colClass(classes, 'lg', this.lg);
    this._offsetClass(classes, '', this.offset);
    this._offsetClass(classes, 'sm', this.offsetSm);
    this._offsetClass(classes, 'md', this.offsetMd);
    this._offsetClass(classes, 'lg', this.offsetLg);
    if (this.alignSelf) {
      const map = { start: 'top', center: 'middle', end: 'bottom' };
      classes.push('w-grid-col--' + (map[this.alignSelf] || this.alignSelf));
    }
    this._syncGridClasses(classes);
  }

  _colClass(classes, bp, value) {
    if (!value) return;
    const suffix = bp ? '-' + bp : '';
    classes.push(value === 'auto' ? `w-grid-col${suffix}-auto` : `w-grid-col${suffix}-${value}`);
  }

  _offsetClass(classes, bp, value) {
    if (!value) return;
    classes.push(bp ? `w-grid-offset-${bp}-${value}` : `w-grid-offset-${value}`);
  }

  _syncGridClasses(classes) {
    (this._wGridClasses || []).forEach((name) => this.classList.remove(name));
    classes.forEach((name) => this.classList.add(name));
    this._wGridClasses = classes;
  }
}

if (!customElements.get('w-col')) {
  customElements.define('w-col', WCol);
}
