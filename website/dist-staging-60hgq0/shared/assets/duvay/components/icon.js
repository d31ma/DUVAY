/* <w-icon> — DuVay component module */

import WIcons from '../icons.js';

export class WIcon extends WElement {
  static attrs = ['name', 'size', 'icon-set', 'icon-class'];

  get name() { return this._attr('name', ''); }
  get size() { return this._attr('size', ''); }

  _template() {
    const iconSet = this.getAttribute('icon-set') || '';
    const iconClass = this.getAttribute('icon-class') || 'w-icon';
    const value = iconSet ? `${iconSet}:${this.name}` : this.name;
    let resolved = WIcons.resolve(value, { iconClass });

    const style = this.size ? ` style="font-size: ${this._esc(this.size)};"` : '';
    if (style) resolved = resolved.replace(/(class="[^"]*")/g, `$1${style}`);

    if (!resolved.includes('<slot')) resolved += '<slot></slot>';
    return resolved;
  }
}

if (!customElements.get('w-icon')) customElements.define('w-icon', WIcon);
