/* <w-data-iterator> — DuVay component module */
import { wClamp, wParseRecords, wRecordValue } from './utils.js';
import './pagination.js';

export class WDataIterator extends WElement {
  static attrs = ['items', 'page', 'items-per-page', 'search', 'title-field', 'subtitle-field'];

  get headers() { return ['title', 'subtitle', 'meta']; }
  get items() { return wParseRecords(this._attr('items', ''), this.headers); }
  get page() { return Math.max(1, Number(this._attr('page', '1')) || 1); }
  get itemsPerPage() { return Math.max(1, Number(this._attr('items-per-page', '6')) || 6); }
  get search() { return this._attr('search', '').toLowerCase(); }
  get titleField() { return this._attr('title-field', 'title'); }
  get subtitleField() { return this._attr('subtitle-field', 'subtitle'); }

  _template() {
    if (!this.items.length) return `<div class="w-data-iterator"><slot></slot></div>`;
    const filtered = this._filteredItems();
    const pages = Math.max(1, Math.ceil(filtered.length / this.itemsPerPage));
    const page = wClamp(this.page, 1, pages);
    const start = (page - 1) * this.itemsPerPage;
    const items = filtered.slice(start, start + this.itemsPerPage);
    return `<div class="w-data-iterator">
      <div class="w-data-iterator-grid">
        ${items.map((item, index) => this._itemHtml(item, start + index)).join('')}
      </div>
      <div class="w-data-iterator-footer">
        <span>${filtered.length} item${filtered.length === 1 ? '' : 's'}</span>
        <w-pagination page="${page}" length="${pages}"></w-pagination>
      </div>
    </div>`;
  }

  _events() {
    this.querySelector('w-pagination')?.addEventListener('w-change', (event) => {
      const page = event.detail.value ?? event.detail.page;
      this._silentSet('page', page);
      this._render();
      this._events();
      this._emit('w-page-change', { value: page });
    });
  }

  _filteredItems() {
    if (!this.search) return this.items;
    return this.items.filter((item) => JSON.stringify(item).toLowerCase().includes(this.search));
  }

  _itemHtml(item, index) {
    const title = wRecordValue(item, this.titleField, 0);
    const subtitle = wRecordValue(item, this.subtitleField, 1);
    const meta = wRecordValue(item, 'meta', 2);
    return `<article class="w-data-iterator-item" data-index="${index}">
      <strong>${this._esc(title)}</strong>
      ${subtitle ? `<span>${this._esc(subtitle)}</span>` : ''}
      ${meta ? `<small>${this._esc(meta)}</small>` : ''}
    </article>`;
  }
}

if (!customElements.get('w-data-iterator')) customElements.define('w-data-iterator', WDataIterator);
