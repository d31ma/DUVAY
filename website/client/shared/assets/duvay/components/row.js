/* <w-row> — responsive grid row (DuVay equivalent of Vuetify v-row)
 *
 * Attributes:
 *   no-gutters                                   - remove the column gutters
 *   dense                                        - tighter gutters
 *   gutter                                       - named (xs/sm/md/lg/xl) or custom gutter (DuVay extra)
 *   align / align-{sm…xxl}                       - align-items: start | center | end | baseline | stretch
 *   justify / justify-{sm…xxl}                   - justify-content: start | center | end | space-between | space-around | space-evenly
 *   align-content / align-content-{sm…xxl}       - align-content: start | center | end | space-between | space-around | space-evenly | stretch
 *   size                                         - lay the row out as a grid of N equal columns
 *   gap                                          - gap between columns; one value, or "column,row"
 *                                                  (replaces the gutter when set)
 */

import { wValueList } from './utils.js';

const ROW_BREAKPOINTS = ['', 'sm', 'md', 'lg', 'xl', 'xxl'];
const ROW_BREAKPOINT_PX = { sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 };
const JUSTIFY_ALIASES = { between: 'space-between', around: 'space-around', evenly: 'space-evenly' };

/* A bare number is px; anything else is already a CSS length. */
function rowLength(value) {
  const raw = String(value == null ? '' : value).trim();
  if (!raw) return '';
  return /^-?\d+(\.\d+)?$/.test(raw) ? raw + 'px' : raw;
}

export class WRow extends WElement {
  static attrs = [
    'no-gutters', 'dense', 'gutter', 'size', 'gap',
    'align', 'align-sm', 'align-md', 'align-lg', 'align-xl', 'align-xxl',
    'justify', 'justify-sm', 'justify-md', 'justify-lg', 'justify-xl', 'justify-xxl',
    'align-content', 'align-content-sm', 'align-content-md', 'align-content-lg',
    'align-content-xl', 'align-content-xxl',
  ];

  get noGutters() { return this._bool('no-gutters'); }
  get dense() { return this._bool('dense'); }
  get gutter() { return this._attr('gutter', ''); }
  get size() {
    const value = Math.floor(Number(this._attr('size', '')));
    return Number.isFinite(value) && value > 0 ? value : 0;
  }
  get gap() { return this._attr('gap', ''); }

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
    const alignContent = this._alignContentValue();
    if (alignContent) classes.push('w-grid-row--align-content-' + this._normJustify(alignContent));
    if (this.gap) classes.push('w-grid-row--flush');

    this._syncGridClasses(classes);
    this._syncGutter();
    this._syncSizing();
    this._watchBreakpoints();
  }

  _normJustify(value) { return JUSTIFY_ALIASES[value] || value; }

  _matches(bp) {
    return typeof matchMedia === 'function' && matchMedia(`(min-width: ${ROW_BREAKPOINT_PX[bp]}px)`).matches;
  }

  // `align-content-{bp}` overrides the base value once the viewport is at least
  // that wide; larger breakpoints win, matching the cascade of the class API.
  _alignContentValue() {
    let value = this._attr('align-content', '');
    Object.keys(ROW_BREAKPOINT_PX).forEach((bp) => {
      const next = this._attr('align-content-' + bp, '');
      if (next && this._matches(bp)) value = next;
    });
    return value;
  }

  // Re-resolve the breakpoint-scoped alignment when the viewport crosses one of
  // the widths this row actually uses. Bound once per breakpoint.
  _watchBreakpoints() {
    if (this._wRowWatched || typeof matchMedia !== 'function') return;
    const used = Object.keys(ROW_BREAKPOINT_PX).filter((bp) => this._attr('align-content-' + bp, ''));
    if (!used.length) return;
    this._wRowWatched = true;
    used.forEach((bp) => {
      matchMedia(`(min-width: ${ROW_BREAKPOINT_PX[bp]}px)`).addEventListener('change', () => this._events());
    });
  }

  // `size` swaps the flex track for a grid of N equal columns; `gap` sets the
  // spacing directly (the gutter is zeroed in _events so they cannot stack).
  _syncSizing() {
    const size = this.size;
    this.style.setProperty('display', size ? 'grid' : '');
    this.style.setProperty('grid-template-columns', size ? `repeat(${size}, minmax(0, 1fr))` : '');

    const [column, row] = wValueList(this.gap).map(rowLength);
    this.style.setProperty('column-gap', column || '');
    this.style.setProperty('row-gap', (row || column) || '');
  }

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
