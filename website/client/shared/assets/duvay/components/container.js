/* <w-container> — responsive layout container (DuVay equivalent of Vuetify v-container)
 *
 * Attributes:
 *   fluid        - remove the max-width (full bleed)
 *   fill-height  - stretch to the parent height and center its rows
 *   size         - sm | md | lg | xl fixed max-width (DuVay extra)
 */

export class WContainer extends WElement {
  static attrs = ['fluid', 'fill-height', 'size'];

  get fluid() { return this._bool('fluid'); }
  get fillHeight() { return this._bool('fill-height'); }
  get size() { return this._attr('size', ''); }

  _template() {
    return `<slot></slot>`;
  }

  _events() {
    const classes = ['w-container'];
    if (this.fluid) classes.push('w-container--fluid');
    if (this.fillHeight) classes.push('w-container--fill-height');
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
