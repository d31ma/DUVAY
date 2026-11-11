import WIcons from '../icons.js';
import { wSetValue } from './utils.js';
/* <w-bottom-nav-item> — DuVay component module
 *
 * Attributes:
 *   value    - unique identifier for this item (required for active management)
 *   icon     - icon name, resolved through WIcons (default `text` set prints it as text;
 *              `set:name` or `icon-set` picks a registered set)
 *   icon-set - WIcons set for `icon` (e.g. mdi); empty uses the default set
 *   label    - text label
 *   href     - URL for link behavior
 *   active   - boolean; marks as active
 *   disabled - boolean; disables the item
 *   color    - palette token for active color override
 */

export class WBottomNavItem extends WElement {
  static attrs = ['value', 'href', 'icon', 'icon-set', 'label', 'active', 'disabled', 'color'];

  set value(v) { wSetValue(this, v); }
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
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
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
      ${this._iconMarkup()}
      <span class="w-bottom-nav-item__label">${this._esc(this.label)}<slot></slot></span>
    </${tag}>`;
  }

  _iconMarkup() {
    if (!this.icon) return '';
    const iconSet = this.getAttribute('icon-set') || '';
    const name = iconSet ? `${iconSet}:${this.icon}` : this.icon;
    return WIcons.resolve(name, { iconClass: 'w-bottom-nav-item__icon' });
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
