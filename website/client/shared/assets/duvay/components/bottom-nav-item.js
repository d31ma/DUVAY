/* <w-bottom-nav-item> — DuVay component module
 *
 * Attributes:
 *   value    - unique identifier for this item (required for active management)
 *   icon     - icon content (text or SVG)
 *   label    - text label
 *   href     - URL for link behavior
 *   active   - boolean; marks as active
 *   disabled - boolean; disables the item
 *   color    - palette token for active color override
 */

export class WBottomNavItem extends WElement {
  static attrs = ['value', 'href', 'icon', 'label', 'active', 'disabled', 'color'];

  get value() { return this._attr('value', ''); }
  get href() { return this._attr('href', ''); }
  get icon() { return this._attr('icon', ''); }
  get label() { return this._attr('label', ''); }
  get active() { return this._bool('active'); }
  set active(v) {
    if (v) this.setAttribute('active', '');
    else this.removeAttribute('active');
  }
  get disabled() { return this._bool('disabled'); }
  get color() { return this._attr('color', ''); }

  _template() {
    const tag = this.href ? 'a' : 'button';
    const href = this.href ? ` href="${this._esc(this.href)}"` : ' type="button"';
    const disabled = this.disabled ? ' disabled' : '';
    const ariaCurrent = this.active ? ' aria-current="true"' : '';

    const classes = ['w-bottom-nav-item'];
    if (this.active) classes.push('w-bottom-nav-item--active');
    if (this.disabled) classes.push('w-bottom-nav-item--disabled');

    const styles = [];
    if (this.color) styles.push('--w-bottom-nav-item-color: var(--w-' + this.color + ');');
    const styleAttr = styles.length ? ' style="' + styles.join(' ') + '"' : '';

    return `<${tag} class="${classes.join(' ')}"${href}${disabled}${ariaCurrent}${styleAttr}>
      ${this.icon ? `<span class="w-bottom-nav-item__icon" aria-hidden="true">${this._esc(this.icon)}</span>` : ''}
      <span class="w-bottom-nav-item__label">${this._esc(this.label)}<slot></slot></span>
    </${tag}>`;
  }

  _events() {
    const el = this._q('.w-bottom-nav-item');
    if (!el) return;

    if (this.disabled) {
      el.addEventListener('click', (e) => e.preventDefault());
    }
  }
}

if (!customElements.get('w-bottom-nav-item')) customElements.define('w-bottom-nav-item', WBottomNavItem);
