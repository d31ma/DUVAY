/* <w-system-bar> - System Bar web component
 *
 * A thin status bar for app-level indicators (time, battery, wifi, notifications).
 *
 * Attributes:
 *   color      - primary | secondary | success | warning | error | surface | CSS color
 *   height     - number (px) or CSS length (e.g. 32, 2rem)
 *   window     - boolean; taller 32px variant (default false → 24px)
 *   rounded    - boolean or size: sm | md | lg | xl | pill
 *   elevation  - number 0-5
 *   absolute   - boolean; position absolute at top
 *
 * Slots:
 *   default - status icons, text, or other content
 */

class WSystemBar extends WElement {
  static attrs = [
    'color',
    'height',
    'window',
    'rounded',
    'elevation',
    'absolute',
  ];

  get color()     { return this._attr('color', ''); }
  get height()    { return this._attr('height', ''); }
  get window()    { return this._bool('window'); }
  get rounded()   { return this._attr('rounded', ''); }
  get elevation() { return this._attr('elevation', ''); }
  get absolute()  { return this._bool('absolute'); }

  _template() {
    const classes = [
      'w-system-bar',
      this.window ? 'w-system-bar--window' : '',
      this.absolute ? 'w-system-bar--absolute' : '',
      this._roundedClass(),
      this._elevationClass(),
      this._colorClass(),
    ].filter(Boolean).join(' ');

    const style = this._styleAttr();

    return `<div class="${classes}"${style} role="status" aria-label="System status"><slot></slot></div>`;
  }

  _roundedClass() {
    if (!this.hasAttribute('rounded')) return '';
    const value = this.rounded;
    if (!value || value === 'true') return 'w-system-bar--rounded';
    return `w-system-bar--rounded-${value}`;
  }

  _elevationClass() {
    const e = this.elevation;
    if (!e) return '';
    const num = parseInt(e, 10);
    if (num >= 1 && num <= 5) return `w-system-bar--elevation-${num}`;
    return '';
  }

  _colorClass() {
    const color = this.color;
    if (!color) return '';
    const token = color.toLowerCase().trim();
    const semantic = ['primary', 'secondary', 'success', 'warning', 'error', 'surface'];
    if (semantic.includes(token)) return `w-system-bar--color-${token}`;
    return '';
  }

  _styleAttr() {
    const styles = [];

    const height = this._resolveHeight();
    if (height) styles.push(`--w-system-bar-height: ${height}`);

    const color = this.color;
    if (color) {
      const token = color.toLowerCase().trim();
      const semantic = ['primary', 'secondary', 'success', 'warning', 'error', 'surface'];
      if (!semantic.includes(token)) {
        styles.push(`--w-system-bar-bg: ${color}`);
        styles.push(`--w-system-bar-color: #ffffff`);
      }
    }

    if (styles.length) return ` style="${styles.join('; ')}"`;
    return '';
  }

  _resolveHeight() {
    const h = this.height;
    if (!h) {
      return this.window ? '32px' : '24px';
    }
    const num = parseFloat(h);
    if (!isNaN(num) && String(num) === String(h).trim()) return `${num}px`;
    return h;
  }
}

if (!customElements.get('w-system-bar')) {
  customElements.define('w-system-bar', WSystemBar);
}
