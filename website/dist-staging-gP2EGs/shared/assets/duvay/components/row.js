/* <w-row> — responsive grid row */

export class WRow extends WElement {
  static attrs = ['no-gutters', 'dense', 'gutter', 'align', 'justify'];

  get noGutters() { return this._bool('no-gutters'); }
  get dense() { return this._bool('dense'); }
  get gutter() { return this._attr('gutter', ''); }
  get align() { return this._attr('align', ''); }
  get justify() { return this._attr('justify', ''); }

  _template() {
    return `<slot></slot>`;
  }

  _events() {
    const classes = ['w-grid-row'];
    if (this.noGutters) classes.push('w-grid-row--flush');
    else if (this.dense) classes.push('w-grid-row--tight');
    else if (this.gutter) classes.push('w-grid-row--custom');

    const alignMap = { start: 'top', center: 'middle', end: 'bottom' };
    const justifyMap = { center: 'center', between: 'between', 'space-between': 'between', around: 'around', 'space-around': 'around' };
    if (this.align) classes.push('w-grid-row--' + (alignMap[this.align] || this.align));
    if (this.justify) classes.push('w-grid-row--' + (justifyMap[this.justify] || this.justify));
    this._syncGridClasses(classes);
    this._syncGutter();
  }

  _syncGutter() {
    if (!this.gutter || this.noGutters || this.dense) {
      if (this._wInlineGutter) this.style.removeProperty('--w-grid-gutter');
      this._wInlineGutter = false;
      return;
    }

    const map = {
      none: '0px',
      0: '0px',
      xs: 'var(--w-space-1)',
      sm: 'var(--w-space-2)',
      md: 'var(--w-space-4)',
      lg: 'var(--w-space-6)',
      xl: 'var(--w-space-8)',
    };
    this.style.setProperty('--w-grid-gutter', map[this.gutter] || this.gutter);
    this._wInlineGutter = true;
  }

  _syncGridClasses(classes) {
    (this._wGridClasses || []).forEach((name) => this.classList.remove(name));
    classes.forEach((name) => this.classList.add(name));
    this._wGridClasses = classes;
  }
}

if (!customElements.get('w-row')) {
  customElements.define('w-row', WRow);
}
