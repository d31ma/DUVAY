/* <w-icon> — icon element (Vuetify VIcon parity).
 *
 * Attributes:
 *   name / icon - icon name resolved through the WIcons registry
 *   size        - x-small | small | default | large | x-large | xs..xl | CSS length
 *   color       - token (primary, success, …) or any CSS color
 *   opacity     - icon opacity (0–1)
 *   disabled    - dim and disable pointer events
 *   start / end  - inline spacing helpers (before/after adjacent text)
 *   icon-set    - registry set name (e.g. "mdi")
 *   icon-class  - override the rendered element class
 */

import WIcons from '../icons.js';

export class WIcon extends WElement {
  static attrs = ['name', 'icon', 'size', 'icon-set', 'icon-class', 'color', 'disabled', 'start', 'end', 'opacity'];

  static sizeAliases = { xs: 'x-small', sm: 'small', md: 'default', lg: 'large', xl: 'x-large' };
  static sizes = ['x-small', 'small', 'default', 'large', 'x-large'];
  static colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'danger', 'info'];

  get name() { return this._attr('name', this._attr('icon', '')); }
  get size() { return this._attr('size', ''); }

  _template() {
    const iconSet = this.getAttribute('icon-set') || '';
    const sizeRaw = String(this.size || '').toLowerCase();
    const sizeAlias = this.constructor.sizeAliases[sizeRaw] || sizeRaw;
    const isNamedSize = this.constructor.sizes.includes(sizeAlias);

    const classes = [
      this.getAttribute('icon-class') || 'w-icon',
      isNamedSize ? 'w-icon--' + sizeAlias : '',
      this._bool('start') ? 'w-icon--start' : '',
      this._bool('end') ? 'w-icon--end' : '',
      this._bool('disabled') ? 'w-icon--disabled' : '',
    ].filter(Boolean).join(' ');

    const value = iconSet ? `${iconSet}:${this.name}` : this.name;
    let resolved = WIcons.resolve(value, { iconClass: classes });

    const styles = [];
    if (this.size && !isNamedSize) styles.push(`font-size: ${this._esc(this.size)}`);
    const color = this._color();
    if (color) styles.push(`color: ${color}`);
    const opacity = this.getAttribute('opacity');
    if (opacity != null && opacity !== '') styles.push(`--w-icon-opacity: ${this._esc(opacity)}`);
    if (styles.length) resolved = resolved.replace(/(class="[^"]*")/, `$1 style="${styles.join('; ')}"`);

    if (!resolved.includes('<slot')) resolved += '<slot></slot>';
    return resolved;
  }

  _color() {
    const raw = String(this._attr('color', '')).toLowerCase();
    if (!raw) return '';
    const map = { danger: 'error', info: 'primary' };
    if (this.constructor.colors.includes(raw)) return `var(--w-${map[raw] || raw})`;
    return this.getAttribute('color');
  }
}

if (!customElements.get('w-icon')) customElements.define('w-icon', WIcon);
