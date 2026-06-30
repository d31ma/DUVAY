/* <w-data-iterator> — render records as repeated cards, mirroring Vuetify's
 * <v-data-iterator>.
 *
 * Owns the data pipeline — filter (search) → sort → paginate — and renders a
 * card grid with a footer (item range, per-page select, pagination). Also
 * surfaces loading and empty states.
 *
 * Attributes:
 *   items                  - records: JSON array, or "a|b|c; d|e|f" rows
 *   page                   - current page (1-based)
 *   items-per-page         - page size (default 6)
 *   items-per-page-options - comma list, e.g. "3,6,12"; renders a per-page select
 *   search                 - case-insensitive filter across all fields
 *   sort-by                - field to sort by (title | subtitle | meta | key)
 *   sort-desc              - sort descending
 *   loading                - show skeleton placeholders
 *   no-data-text           - message when nothing matches (default "No data available")
 *   title-field            - record key for the card title (default "title")
 *   subtitle-field         - record key for the subtitle (default "subtitle")
 *   meta-field             - record key for the meta line (default "meta")
 *
 * Slots:
 *   default - custom content shown when `items` is empty
 *
 * Events:
 *   change  - { value: page }                 page changed
 *   update  - { page, itemsPerPage }          page size changed
 */
import { wClamp, wParseRecords, wRecordValue } from './utils.js';
import './pagination.js';

export class WDataIterator extends WElement {
  static attrs = ['items', 'page', 'items-per-page', 'items-per-page-options', 'search',
    'sort-by', 'sort-desc', 'loading', 'no-data-text', 'title-field', 'subtitle-field', 'meta-field'];

  get headers() { return ['title', 'subtitle', 'meta']; }
  get items() { return wParseRecords(this._attr('items', ''), this.headers); }
  get page() { return Math.max(1, Number(this._attr('page', '1')) || 1); }
  get itemsPerPage() { return Math.max(1, Number(this._attr('items-per-page', '6')) || 6); }
  get itemsPerPageOptions() {
    return this._attr('items-per-page-options', '')
      .split(',').map((n) => parseInt(n, 10)).filter((n) => n > 0);
  }
  get search() { return this._attr('search', '').toLowerCase(); }
  get sortBy() { return this._attr('sort-by', ''); }
  get sortDesc() { return this._bool('sort-desc'); }
  get loading() { return this._bool('loading'); }
  get noDataText() { return this._attr('no-data-text', 'No data available'); }
  get titleField() { return this._attr('title-field', 'title'); }
  get subtitleField() { return this._attr('subtitle-field', 'subtitle'); }
  get metaField() { return this._attr('meta-field', 'meta'); }

  _template() {
    if (this.loading) return `<div class="w-data-iterator">${this._loadingHtml()}</div>`;
    if (!this.items.length) return `<div class="w-data-iterator"><slot></slot></div>`;

    const filtered = this._processed();
    if (!filtered.length) {
      return `<div class="w-data-iterator"><div class="w-data-iterator-empty">${this._esc(this.noDataText)}</div></div>`;
    }

    const pages = Math.max(1, Math.ceil(filtered.length / this.itemsPerPage));
    const page = wClamp(this.page, 1, pages);
    const start = (page - 1) * this.itemsPerPage;
    const items = filtered.slice(start, start + this.itemsPerPage);
    const end = start + items.length;

    return `<div class="w-data-iterator">
      <div class="w-data-iterator-grid">
        ${items.map((item, index) => this._itemHtml(item, start + index)).join('')}
      </div>
      <div class="w-data-iterator-footer">
        <span class="w-data-iterator-range">${start + 1}&#8211;${end} of ${filtered.length}</span>
        <div class="w-data-iterator-controls">
          ${this._perPageHtml()}
          <w-pagination page="${page}" length="${pages}"></w-pagination>
        </div>
      </div>
    </div>`;
  }

  _perPageHtml() {
    const options = this.itemsPerPageOptions;
    if (!options.length) return '';
    const opts = options.map((n) =>
      `<option value="${n}"${n === this.itemsPerPage ? ' selected' : ''}>${n}</option>`).join('');
    return `<label class="w-data-iterator-per-page">Per page
      <select class="w-select" data-per-page>${opts}</select>
    </label>`;
  }

  _loadingHtml() {
    const cards = Array.from({ length: this.itemsPerPage }, () =>
      `<article class="w-data-iterator-item" aria-hidden="true">
        <span class="w-skeleton w-skeleton-text"></span>
        <span class="w-skeleton w-skeleton-text"></span>
      </article>`).join('');
    return `<div class="w-data-iterator-grid" aria-busy="true">${cards}</div>`;
  }

  _events() {
    this.querySelector('w-pagination')?.addEventListener('change', (event) => {
      event.stopPropagation();
      const page = event.detail.value ?? event.detail.page;
      this._silentSet('page', page);
      this._render();
      this._events();
      this._emit('change', { value: page });
    });

    this.querySelector('[data-per-page]')?.addEventListener('change', (event) => {
      event.stopPropagation();
      const itemsPerPage = parseInt(event.target.value, 10) || this.itemsPerPage;
      this._silentSet('items-per-page', itemsPerPage);
      this._silentSet('page', 1);
      this._render();
      this._events();
      this._emit('update', { page: 1, itemsPerPage });
    });
  }

  // filter → sort (pagination happens in _template).
  _processed() {
    let rows = this._filteredItems();
    if (this.sortBy) {
      const dir = this.sortDesc ? -1 : 1;
      rows = rows.slice().sort((a, b) => this._compare(this._field(a, this.sortBy), this._field(b, this.sortBy)) * dir);
    }
    return rows;
  }

  _filteredItems() {
    if (!this.search) return this.items;
    return this.items.filter((item) => JSON.stringify(item).toLowerCase().includes(this.search));
  }

  _field(item, field) {
    const idx = this.headers.indexOf(field);
    return wRecordValue(item, field, idx >= 0 ? idx : 0);
  }

  _compare(a, b) {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb) && String(na) === String(a).trim() && String(nb) === String(b).trim()) {
      return na - nb;
    }
    return String(a).localeCompare(String(b));
  }

  _itemHtml(item, index) {
    const title = wRecordValue(item, this.titleField, 0);
    const subtitle = wRecordValue(item, this.subtitleField, 1);
    const meta = wRecordValue(item, this.metaField, 2);
    return `<article class="w-data-iterator-item" data-index="${index}">
      <strong>${this._esc(title)}</strong>
      ${subtitle ? `<span>${this._esc(subtitle)}</span>` : ''}
      ${meta ? `<small>${this._esc(meta)}</small>` : ''}
    </article>`;
  }
}

if (!customElements.get('w-data-iterator')) customElements.define('w-data-iterator', WDataIterator);
