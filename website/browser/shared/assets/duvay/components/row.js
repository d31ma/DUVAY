/* <w-row> — responsive grid row (DuVay equivalent of Vuetify v-row)
 *
 * Attributes:
 *   no-gutters                                   - remove the column gutters
 *   dense                                        - tighter gutters
 *   gutter                                       - named (xs/sm/md/lg/xl) or custom gutter (DuVay extra)
 *   align / align-{sm…xxl}                       - align-items: start | center | end | baseline | stretch
 *   justify / justify-{sm…xxl}                   - justify-content: start | center | end | space-between | space-around | space-evenly
 *   align-content                                - align-content: start | center | end | space-between | space-around | stretch
 */

const ROW_BREAKPOINTS = ['', 'sm', 'md', 'lg', 'xl', 'xxl'];
const JUSTIFY_ALIASES = { between: 'space-between', around: 'space-around', evenly: 'space-evenly' };

export class WRow extends WElement {
  static attrs = [
    'no-gutters', 'dense', 'gutter',
    'align', 'align-sm', 'align-md', 'align-lg', 'align-xl', 'align-xxl',
    'justify', 'justify-sm', 'justify-md', 'justify-lg', 'justify-xl', 'justify-xxl',
    'align-content',
  ];

  get noGutters() { return this._bool('no-gutters'); }
  get dense() { return this._bool('dense'); }
  get gutter() { return this._attr('gutter', ''); }

  _template() {
    return `<slot></slot>`;
  }

  _events() {
    const classes = ['w-grid-row'];
    if (this.noGutters) classes.push('w-grid-row--flush');
    else if (this.dense) classes.push('w-grid-row--tight');
    else if (this.gutter) classes.push('w-grid-row--custom');

    ROW_BREAKPOINTS.forEach((bp) => {
      const suffix = bp ? '-' + bp : '';
      this._alignClass(classes, bp, this._attr('align' + suffix, ''));
      this._justifyClass(classes, bp, this._attr('justify' + suffix, ''));
    });
    const alignContent = this._attr('align-content', '');
    if (alignContent) classes.push('w-grid-row--align-content-' + this._normJustify(alignContent));

    this._syncGridClasses(classes);
    this._syncGutter();
  }

  _normJustify(value) { return JUSTIFY_ALIASES[value] || value; }

  _alignClass(classes, bp, value) {
    if (!value) return;
    classes.push(bp ? `w-grid-row--align-${bp}-${value}` : `w-grid-row--align-${value}`);
  }

  _justifyClass(classes, bp, value) {
    if (!value) return;
    const v = this._normJustify(value);
    classes.push(bp ? `w-grid-row--justify-${bp}-${v}` : `w-grid-row--justify-${v}`);
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
