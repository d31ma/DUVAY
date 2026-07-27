/* <w-col> — responsive grid column (DuVay equivalent of Vuetify v-col)
 *
 * Attributes:
 *   cols / sm / md / lg / xl / xxl                 - span (1-12 or "auto") per breakpoint
 *   offset / offset-sm / … / offset-xxl            - left offset (0-11) per breakpoint
 *   order / order-sm / … / order-xxl               - flex order (0-12, "first", "last")
 *   align-self                                     - auto | start | center | end | baseline | stretch
 */

const COL_BREAKPOINTS = ['', 'sm', 'md', 'lg', 'xl', 'xxl'];

export class WCol extends WElement {
  static attrs = [
    'cols', 'sm', 'md', 'lg', 'xl', 'xxl',
    'offset', 'offset-sm', 'offset-md', 'offset-lg', 'offset-xl', 'offset-xxl',
    'order', 'order-sm', 'order-md', 'order-lg', 'order-xl', 'order-xxl',
    'align-self',
  ];

  _template() {
    return `<slot></slot>`;
  }

  _events() {
    const classes = ['w-grid-col'];
    COL_BREAKPOINTS.forEach((bp) => {
      const suffix = bp ? '-' + bp : '';
      this._colClass(classes, bp, this._attr(bp || 'cols', ''));
      this._offsetClass(classes, bp, this._attr('offset' + suffix, ''));
      this._orderClass(classes, bp, this._attr('order' + suffix, ''));
    });
    const alignSelf = this._attr('align-self', '');
    if (alignSelf) classes.push('w-grid-col--align-self-' + alignSelf);
    this._syncGridClasses(classes);
  }

  _colClass(classes, bp, value) {
    if (value === '' || value == null) return;
    const suffix = bp ? '-' + bp : '';
    classes.push(value === 'auto' ? `w-grid-col${suffix}-auto` : `w-grid-col${suffix}-${value}`);
  }

  _offsetClass(classes, bp, value) {
    if (value === '' || value == null) return;
    classes.push(bp ? `w-grid-offset-${bp}-${value}` : `w-grid-offset-${value}`);
  }

  _orderClass(classes, bp, value) {
    if (value === '' || value == null) return;
    classes.push(bp ? `w-grid-order-${bp}-${value}` : `w-grid-order-${value}`);
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
