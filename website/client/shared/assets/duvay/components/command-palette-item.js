/* <w-command-palette-item> — structured command palette row.
 *
 * Attributes:
 *   item  - JSON object (or the `item` property): { title, value, subtitle, snippet,
 *           prependIcon|icon, prependAvatar|avatar, tag, tagColor, hotkey, disabled }
 *   index - position in the parent list
 *
 * Renders the same row as <w-command-item>; the option's accessible name is
 * the title, and subtitle/snippet/tag/hotkey are its description.
 */

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
    return this._rowMarkup(this._itemFields(item));
  }

  _itemFields(item) {
    const title = item.title || item.value || '';
    return {
      value: item.value ?? title,
      title: this._esc(title),
      subtitle: item.subtitle,
      snippet: item.snippet,
      icon: item.prependIcon || item.icon,
      avatar: item.prependAvatar || item.avatar,
      tag: item.tag,
      tagColor: this._tagColor(item.tagColor),
      shortcut: item.hotkey,
      disabled: item.disabled,
    };
  }

  _refresh() { if (this._rendered) this._render(); }
}

if (!customElements.get('w-command-palette-item')) customElements.define('w-command-palette-item', WCommandPaletteItem);
