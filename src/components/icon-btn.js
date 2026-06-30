/* <w-icon-btn> — DuVay component module */

import WIcons from '../icons.js';

export class WIconBtn extends WElement {
  static attrs = ['icon', 'icon-set', 'aria-label'];

  get icon() { return this._attr('icon', ''); }
  get iconSet() { return this._attr('icon-set', ''); }
  _template() {
    const label = this.getAttribute('aria-label') || this.icon || 'Icon button';
    const iconSet = this.iconSet;
    const value = iconSet ? `${iconSet}:${this.icon}` : this.icon;
    const icon = WIcons.resolve(value, { iconClass: 'w-icon' });
    return `<button class="w-btn w-btn-icon" type="button" aria-label="${this._esc(label)}">${icon}<slot></slot></button>`;
  }
}

if (!customElements.get('w-icon-btn')) customElements.define('w-icon-btn', WIconBtn);
