/* <w-footer> - Footer web component
 *
 * A footer for app-level content, links, and actions.
 *
 * Attributes:
 *   color      - primary | secondary | success | warning | error | surface | CSS color
 *   height     - number (px) or CSS length (e.g. 64, 3rem)
 *   border     - boolean; adds border on all sides
 *   elevation  - number 0-5
 *   rounded    - boolean or size: sm | md | lg | xl | pill
 *   app        - boolean; sticks footer to bottom of viewport
 *
 * Slots:
 *   default - footer content (links, text, buttons, etc.)
 */

class WFooter extends WElement {
  static attrs = [
    'color',
    'height',
    'border',
    'elevation',
    'rounded',
    'app',
  ];

  get color()     { return this._attr('color', ''); }
  get height()    { return this._attr('height', ''); }
  get border()    { return this._bool('border'); }
  get elevation() { return this._attr('elevation', ''); }
  get rounded()   { return this._attr('rounded', ''); }
  get app()       { return this._bool('app'); }

  _template() {
    const classes = [
      'w-footer',
      this.border ? 'w-footer--border' : '',
      this.app ? 'w-footer--app' : '',
      this._roundedClass(),
      this._elevationClass(),
      this._colorClass(),
    ].filter(Boolean).join(' ');

    const style = this._styleAttr();

    return `<footer class="${classes}"${style}><slot></slot></footer>`;
  }

  _roundedClass() {
    if (!this.hasAttribute('rounded')) return '';
    const value = this.rounded;
    if (!value || value === 'true') return 'w-footer--rounded';
    return `w-footer--rounded-${value}`;
  }

  _elevationClass() {
    const e = this.elevation;
    if (!e) return '';
    const num = parseInt(e, 10);
    if (num >= 1 && num <= 5) return `w-footer--elevation-${num}`;
    return '';
  }

  _colorClass() {
    const color = this.color;
    if (!color) return '';
    const token = color.toLowerCase().trim();
    const semantic = ['primary', 'secondary', 'success', 'warning', 'error', 'surface'];
    if (semantic.includes(token)) return `w-footer--color-${token}`;
    return '';
  }

  _styleAttr() {
    const styles = [];

    const height = this._resolveHeight();
    if (height) styles.push(`--w-footer-height: ${height}`);

    const color = this.color;
    if (color) {
      const token = color.toLowerCase().trim();
      const semantic = ['primary', 'secondary', 'success', 'warning', 'error', 'surface'];
      if (!semantic.includes(token)) {
        styles.push(`--w-footer-bg: ${color}`);
        styles.push(`--w-footer-color: #ffffff`);
      }
    }

    if (styles.length) return ` style="${styles.join('; ')}"`;
    return '';
  }

  _resolveHeight() {
    const h = this.height;
    if (!h) return '';
    const num = parseFloat(h);
    if (!isNaN(num) && String(num) === String(h).trim()) return `${num}px`;
    return h;
  }
}

if (!customElements.get('w-footer')) {
  customElements.define('w-footer', WFooter);
}
