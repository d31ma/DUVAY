/* <w-data-table> — DuVay component module */
import { wBoolAttr, wClamp, wNumberAttr, wParseRecords, wRecordValue, wValueList } from './utils.js';
import './grid.js';
import './pagination.js';

export class WDataTable extends WElement {
  static attrs = ['density', 'striped', 'hover', 'headers', 'items', 'sort-by', 'sort-desc', 'page', 'items-per-page', 'search', 'fixed-header'];
  get density() { return this._attr('density', ''); }
  get striped() { return this._bool('striped'); }
  get hover() { return this._bool('hover'); }
  get headers() { return wValueList(this._attr('headers', '')); }
  get items() { return wParseRecords(this._attr('items', ''), this.headers); }
  get sortBy() { return this._attr('sort-by', ''); }
  get sortDesc() { return wBoolAttr(this, 'sort-desc'); }
  get page() { return Math.max(1, wNumberAttr(this, 'page', 1)); }
  get itemsPerPage() { return Math.max(1, wNumberAttr(this, 'items-per-page', 25)); }
  get search() { return this._attr('search', '').toLowerCase(); }
  get fixedHeader() { return wBoolAttr(this, 'fixed-header'); }

  _template() {
    const wrapClass = `w-table-wrap${this.fixedHeader ? ' w-table-wrap--fixed-header' : ''}`;
    if (!this.items.length || !this.headers.length) return `<div class="${wrapClass}"><div class="w-table-grid" role="table"><slot></slot></div></div>`;
    const rows = this._pageRows();
    const pages = Math.max(1, Math.ceil(this._filteredRows().length / this.itemsPerPage));
    const cols = Math.max(1, Math.floor(12 / this.headers.length));
    return `<div class="${wrapClass}">
      <div class="w-table-grid" role="table" aria-rowcount="${rows.length + 1}" aria-colcount="${this.headers.length}">
        <w-row header no-gutters>
          ${this.headers.map((header) => `<w-col cols="${cols}" role="columnheader"><button class="w-table-sort" type="button" data-sort="${this._esc(header)}">${this._esc(header)}${this.sortBy === header ? `<span aria-hidden="true">${this.sortDesc ? ' ↓' : ' ↑'}</span>` : ''}</button></w-col>`).join('')}
        </w-row>
        ${rows.map((row) => `<w-row no-gutters>${this.headers.map((header, index) => `<w-col cols="${cols}" role="cell">${this._esc(wRecordValue(row, header, index))}</w-col>`).join('')}</w-row>`).join('')}
      </div>
      ${pages > 1 ? `<div class="w-data-table-footer"><w-pagination page="${wClamp(this.page, 1, pages)}" length="${pages}"></w-pagination></div>` : ''}
    </div>`;
  }

  _events() {
    this.querySelectorAll('[data-sort]').forEach((button) => {
      button.addEventListener('click', () => {
        const sortBy = button.getAttribute('data-sort');
        const desc = this.sortBy === sortBy ? !this.sortDesc : false;
        this._silentSet('sort-by', sortBy);
        this._silentSet('sort-desc', desc ? 'true' : null);
        this._render();
        this._events();
        this._emit('w-sort', { sortBy, sortDesc: desc });
      });
    });
    this.querySelector('w-pagination')?.addEventListener('w-change', (event) => {
      const page = event.detail.value ?? event.detail.page;
      this._silentSet('page', page);
      this._render();
      this._events();
      this._emit('w-page-change', { value: page });
    });
    const table = this.querySelector('table');
    if (table) {
      table.classList.add('w-table');
      table.classList.toggle('w-table--striped', this.striped);
      table.classList.toggle('w-table--no-hover', !this.hover);
      table.classList.toggle('w-table--dense', this.density === 'compact' || this.density === 'dense');
      return;
    }

    const grid = this.querySelector('.w-table-grid');
    if (!grid) return;
    grid.classList.toggle('w-table-grid--striped', this.striped);
    grid.classList.toggle('w-table-grid--no-hover', !this.hover);
    grid.classList.toggle('w-table-grid--dense', this.density === 'compact' || this.density === 'dense');
    this.querySelectorAll('w-row, .w-grid-row').forEach((row, index) => {
      row.setAttribute('role', 'row');
      if (row.hasAttribute('header') || index === 0) row.classList.add('w-table-header');
    });
    this.querySelectorAll('w-col, .w-grid-col, [class*="w-grid-col-"]').forEach((cell) => {
      const row = cell.closest('w-row, .w-grid-row');
      cell.setAttribute('role', row && row.classList.contains('w-table-header') ? 'columnheader' : 'cell');
    });
  }

  _filteredRows() {
    const rows = !this.search ? this.items : this.items.filter((item) => JSON.stringify(item).toLowerCase().includes(this.search));
    if (!this.sortBy) return rows;
    const headerIndex = this.headers.indexOf(this.sortBy);
    return rows.slice().sort((a, b) => {
      const left = String(wRecordValue(a, this.sortBy, headerIndex));
      const right = String(wRecordValue(b, this.sortBy, headerIndex));
      return left.localeCompare(right, undefined, { numeric: true }) * (this.sortDesc ? -1 : 1);
    });
  }

  _pageRows() {
    const filtered = this._filteredRows();
    const page = wClamp(this.page, 1, Math.max(1, Math.ceil(filtered.length / this.itemsPerPage)));
    const start = (page - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }
}

if (!customElements.get('w-data-table')) customElements.define('w-data-table', WDataTable);
