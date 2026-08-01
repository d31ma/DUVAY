/* <w-command-palette-item> — structured command palette row. */

import { WCommandItem } from './command-item.js';

export class WCommandPaletteItem extends WCommandItem {
  static attrs = ['item', 'index'];

  get item() {
    if (this._itemValue !== undefined) return this._itemValue;
    try { return JSON.parse(this._attr('item', '{}')); } catch { return {}; }
  }
  set item(value) { this._itemValue = value && typeof value === 'object' ? value : {}; this._refresh(); }

  _template() {
    const item = this.item;
    if (!item || !Object.keys(item).length) return super._template();
    const title = item.title || item.value || '';
    const subtitle = item.subtitle ? `<span class="w-command-item-subtitle">${this._esc(item.subtitle)}</span>` : '';
    const leading = this._leading(item);
    const hotkey = item.hotkey ? `<kbd class="w-kbd">${this._esc(item.hotkey)}</kbd>` : '';
    return `<button class="w-command-item" role="option" type="button" value="${this._esc(item.value ?? title)}"${item.disabled ? ' disabled aria-disabled="true"' : ''}>${leading}<span class="w-command-item-content"><span class="w-command-item-title">${this._esc(title)}</span>${subtitle}</span>${hotkey}</button>`;
  }

  _leading(item) {
    if (item.prependAvatar) return `<w-avatar image="${this._esc(item.prependAvatar)}" size="small"></w-avatar>`;
    const icon = item.prependIcon || item.icon;
    return icon ? `<span class="w-command-item-icon" aria-hidden="true">${this._esc(icon)}</span>` : '';
  }

  _refresh() { if (this._rendered) this._render(); }
}

if (!customElements.get('w-command-palette-item')) customElements.define('w-command-palette-item', WCommandPaletteItem);
