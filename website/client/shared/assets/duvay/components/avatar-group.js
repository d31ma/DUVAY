/* <w-avatar-group> — overlapping or spaced collection of avatars. */

import { wParseRecords } from './utils.js';

export class WAvatarGroup extends WElement {
  static attrs = ['border', 'reverse', 'size', 'gap', 'hoverable', 'items', 'limit', 'overflow-text', 'vertical'];

  get items() {
    if (this._itemsValue !== undefined) return this._itemsValue;
    return wParseRecords(this.getAttribute('items'));
  }
  set items(value) { this._itemsValue = Array.isArray(value) ? value : []; this._refresh(); }

  _template() {
    const items = this.items;
    const limit = Math.max(0, Number.parseInt(this._attr('limit', '0'), 10) || 0);
    const visible = limit ? items.slice(0, limit) : items;
    const remaining = Math.max(0, items.length - visible.length);
    const style = this._groupStyle();
    const generated = visible.map((item) => this._avatar(item)).join('');
    const overflow = remaining ? this._overflow(remaining) : '';
    return `<div class="w-avatar-group${this._classes()}" role="group"${style}>${generated}<slot></slot>${overflow}</div>`;
  }

  _classes() {
    return this._cls({
      'w-avatar-group--reverse': this._bool('reverse'),
      'w-avatar-group--hoverable': this._bool('hoverable'),
      'w-avatar-group--vertical': this._bool('vertical'),
      'w-avatar-group--bordered': this.hasAttribute('border'),
    });
  }

  _groupStyle() {
    const declarations = [];
    const gap = this._cssSize(this._attr('gap', ''));
    const size = this._cssSize(this._attr('size', ''));
    if (gap) declarations.push(`--w-avatar-group-gap:${gap}`);
    if (size) declarations.push(`--w-avatar-group-size:${size}`);
    return declarations.length ? ` style="${this._esc(declarations.join(';'))}"` : '';
  }

  _avatar(item) {
    const record = item && typeof item === 'object' ? item : { text: item };
    const image = record.image || record.src;
    const text = record.text || record.initials || record.title || '';
    const alt = record.alt || record.title || text || 'Avatar';
    const size = this._attr('size', '');
    return `<w-avatar${this._attrs({ image, text, alt, size })}></w-avatar>`;
  }

  _overflow(count) {
    const format = this._attr('overflow-text', '+{0}');
    const text = format.includes('{0}') ? format.replaceAll('{0}', String(count)) : `${format}${count}`;
    return `<span class="w-avatar-group-overflow" aria-label="${this._esc(`${count} more`)}">${this._esc(text)}</span>`;
  }

  _cssSize(value) {
    const raw = String(value || '').trim();
    if (/^\d+(?:\.\d+)?$/.test(raw)) return `${raw}px`;
    return /^\d+(?:\.\d+)?(?:rem|em|px|%)$/.test(raw) ? raw : '';
  }

  _refresh() { if (this._rendered) { this._render(); this._applyCommonProps(); } }
}

if (!customElements.get('w-avatar-group')) customElements.define('w-avatar-group', WAvatarGroup);
