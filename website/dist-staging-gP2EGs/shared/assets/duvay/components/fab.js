/* <w-fab> — DuVay component module */

import WIcons from '../icons.js';

export class WFab extends WElement {
  static attrs = ['icon', 'icon-set', 'label', 'size', 'fixed', 'position', 'aria-label'];

  get icon() { return this._attr('icon', '+'); }
  get iconSet() { return this._attr('icon-set', ''); }
  get label() { return this._attr('label', ''); }
  get size() { return this._attr('size', ''); }
  get fixed() { return this._bool('fixed'); }
  get position() { return this._attr('position', 'bottom-right'); }

  _template() {
    const sizeClass = this.size ? ' w-fab--' + this.size : '';
    const fixedClass = this.fixed ? ' w-fab--fixed w-fab--' + this.position : '';
    const extendedClass = this.label ? ' w-fab--extended' : '';
    const label = this.label ? `<span>${this._esc(this.label)}</span>` : '';
    const aria = this.getAttribute('aria-label') || this.label || this.icon;
    const iconSet = this.iconSet;
    const value = iconSet ? `${iconSet}:${this.icon}` : this.icon;
    const icon = WIcons.resolve(value, { iconClass: 'w-icon' });
    return `<button class="w-fab${sizeClass}${fixedClass}${extendedClass}" type="button" aria-label="${this._esc(aria)}">
      ${icon}${label}<slot></slot>
    </button>`;
  }
}

if (!customElements.get('w-fab')) customElements.define('w-fab', WFab);
