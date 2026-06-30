/* <w-data-table> — full data table, mirroring Vuetify's <v-data-table>.
 *
 * Renders a semantic <table> and owns the client-side pipeline:
 * filter (search) → sort → paginate. Supports rich or simple headers, single
 * and multi-column sorting, row selection, expandable detail rows, a paginated
 * footer with a per-page select, plus loading and empty states.
 *
 * Attributes:
 *   headers                 - JSON [{title,key,align,sortable,width}] OR a
 *                             simple "Col A,Col B" list (key = title)
 *   items                   - JSON array of objects/rows, or "a|b; c|d" rows
 *   item-value              - key used as a row's identity for selection
 *   sort-by                 - initial sort column key
 *   sort-desc               - initial sort descends
 *   multi-sort              - allow sorting by several columns at once
 *   search                  - case-insensitive filter across all cells
 *   page                    - current page (1-based)
 *   items-per-page          - page size (default 10; -1 shows all)
 *   items-per-page-options  - comma list for the footer select (default 10,25,50,-1)
 *   show-select             - render a selection checkbox column
 *   select-strategy         - page (default) | all | single
 *   selected                - comma list of selected row identities (reflected)
 *   show-expand             - render an expand toggle column
 *   loading                 - show the loading bar + text
 *   loading-text            - text shown while loading (default "Loading items…")
 *   no-data-text            - text shown when empty (default "No data available")
 *   density                 - default | comfortable | compact
 *   striped, hover          - row styling
 *   fixed-header            - sticky header (pair with height)
 *   height                  - CSS height for the scroll area
 *
 * Events:
 *   update:options   - { page, itemsPerPage, sortBy }  any page/sort/size change
 *   update:selected  - { selected }                    selection changed
 *   update:expanded  - { expanded }                    expansion changed
 *   change           - back-compat alias of update:options
 */
import { wBoolAttr, wClamp, wNumberAttr, wParseRecords, wRecordValue, wValueList } from './utils.js';

export class WDataTable extends WElement {
  static attrs = ['headers', 'items', 'item-value', 'sort-by', 'sort-desc', 'multi-sort',
    'search', 'page', 'items-per-page', 'items-per-page-options', 'show-select', 'select-strategy',
    'selected', 'show-expand', 'expanded', 'loading', 'loading-text', 'no-data-text',
    'density', 'striped', 'hover', 'fixed-header', 'height'];

  get density() { return this._attr('density', ''); }
  get striped() { return this._bool('striped'); }
  get hover() { return this._bool('hover'); }
  get multiSort() { return this._bool('multi-sort'); }
  get search() { return this._attr('search', '').toLowerCase(); }
  get page() { return Math.max(1, wNumberAttr(this, 'page', 1)); }
  get itemsPerPage() { return wNumberAttr(this, 'items-per-page', 10); }
  get itemsPerPageOptions() {
    const raw = this._attr('items-per-page-options', '10,25,50,-1');
    return raw.split(',').map((n) => parseInt(n, 10)).filter((n) => Number.isFinite(n));
  }
  get showSelect() { return this._bool('show-select'); }
  get selectStrategy() { return this._attr('select-strategy', 'page'); }
  get showExpand() { return this._bool('show-expand'); }
  get loading() { return this._bool('loading'); }
  get loadingText() { return this._attr('loading-text', 'Loading items…'); }
  get noDataText() { return this._attr('no-data-text', 'No data available'); }
  get fixedHeader() { return wBoolAttr(this, 'fixed-header'); }
  get height() { return this._attr('height', ''); }
  get itemValue() { return this._attr('item-value', ''); }

  get selected() { return wValueList(this._attr('selected', '')).map(String); }
  get expanded() { return wValueList(this._attr('expanded', '')).map(String); }

  // Normalised column descriptors. Accepts a `headers` property (array of
  // strings or {title,key,…} objects) or the `headers` attribute.
  get columns() {
    if (Array.isArray(this._headersData)) return this._headersData.map((h, i) => this._normCol(h, i));
    const raw = this._attr('headers', '').trim();
    if (raw.startsWith('[') && raw.includes('{')) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr.map((h, i) => this._normCol(h, i));
      } catch { /* fall through to simple list */ }
    }
    return wValueList(raw).map((title, i) => this._normCol(title, i));
  }
  set headers(v) { this._headersData = v; if (this._rendered) this._rerender(); }

  _normCol(h, i) {
    if (h && typeof h === 'object') {
      return {
        title: h.title ?? h.key ?? '', key: h.key ?? h.title ?? i, index: i,
        align: h.align || 'start', sortable: h.sortable !== false, width: h.width || '',
      };
    }
    return { title: h, key: h, index: i, align: 'start', sortable: true, width: '' };
  }

  get items() {
    if (this._itemsData !== undefined) return this._itemsData;
    return wParseRecords(this._attr('items', ''), this.columns.map((c) => c.key));
  }
  // Allow large/remote datasets to be supplied as a JS array (or string) without
  // round-tripping through a huge `items` attribute.
  set items(v) {
    this._itemsData = Array.isArray(v) ? v : wParseRecords(v, this.columns.map((c) => c.key));
    if (this._rendered) this._rerender();
  }

  _cell(item, col) {
    if (Array.isArray(item)) return item[col.index] ?? '';
    return wRecordValue(item, col.key, col.index);
  }

  _rowKey(item, index) {
    if (this.itemValue) return String(this._cell(item, { key: this.itemValue, index: 0 }));
    return JSON.stringify(item);
  }

  /* ── data pipeline ──────────────────────────────────────────────────────── */

  // Multi/single sort state, seeded from sort-by / sort-desc on first read.
  get _sorts() {
    if (!this._sortState) {
      const key = this._attr('sort-by', '');
      this._sortState = key ? [{ key, desc: wBoolAttr(this, 'sort-desc') }] : [];
    }
    return this._sortState;
  }

  _filtered() {
    if (!this.search) return this.items;
    return this.items.filter((item) => JSON.stringify(item).toLowerCase().includes(this.search));
  }

  _sorted(rows) {
    if (!this._sorts.length) return rows;
    const cols = this.columns;
    return rows.slice().sort((a, b) => {
      for (const s of this._sorts) {
        const col = cols.find((c) => c.key === s.key) || { key: s.key, index: 0 };
        const cmp = String(this._cell(a, col)).localeCompare(String(this._cell(b, col)), undefined, { numeric: true });
        if (cmp) return s.desc ? -cmp : cmp;
      }
      return 0;
    });
  }

  get _total() { return this._filtered().length; }
  get _pageCount() {
    if (this.itemsPerPage <= 0) return 1;
    return Math.max(1, Math.ceil(this._total / this.itemsPerPage));
  }

  // Rows for the current page after filter + sort. Overridden by the server table.
  _visibleRows() {
    const rows = this._sorted(this._filtered());
    if (this.itemsPerPage <= 0) return rows;
    const page = wClamp(this.page, 1, this._pageCount);
    const start = (page - 1) * this.itemsPerPage;
    return rows.slice(start, start + this.itemsPerPage);
  }

  /* ── render ─────────────────────────────────────────────────────────────── */

  _template() {
    const cols = this.columns;
    if (!cols.length) return `<div class="w-table-wrap"><slot></slot></div>`;

    const rows = this._visibleRows();
    const tableClasses = ['w-table',
      this.striped ? 'w-table--striped' : '',
      this.hover ? '' : 'w-table--no-hover',
      this.density === 'compact' || this.density === 'dense' ? 'w-table--dense' : '',
      this.density === 'comfortable' ? 'w-table--comfortable' : '',
    ].filter(Boolean).join(' ');

    const wrapClasses = ['w-table-wrap', this.fixedHeader ? 'w-table-wrap--fixed-header' : ''].filter(Boolean).join(' ');
    const wrapStyle = this.height ? ` style="max-height:${this._esc(this.height)}"` : '';

    return `<div class="w-data-table${this.loading ? ' w-data-table--loading' : ''}">
      ${this.loading ? '<span class="w-data-table-loader" aria-hidden="true"></span>' : ''}
      <div class="${wrapClasses}"${wrapStyle}>
        <table class="${tableClasses}">
          <thead>${this._headHtml(cols, rows)}</thead>
          <tbody>${this._bodyHtml(cols, rows)}</tbody>
        </table>
      </div>
      ${this._footerHtml()}
    </div>`;
  }

  _headHtml(cols, rows) {
    let lead = '';
    if (this.showSelect && this.selectStrategy !== 'single') {
      const all = rows.length && rows.every((r, i) => this.selected.includes(this._rowKey(r, i)));
      lead += `<th class="w-table-select"><input type="checkbox" data-select-all${all ? ' checked' : ''} aria-label="Select all"></th>`;
    } else if (this.showSelect) {
      lead += `<th class="w-table-select"></th>`;
    }
    if (this.showExpand) lead += `<th class="w-table-expand"></th>`;

    const ths = cols.map((col) => {
      const sort = this._sorts.find((s) => s.key === col.key);
      const arrow = sort ? `<span class="w-table-sort-icon" aria-hidden="true">${sort.desc ? '↓' : '↑'}</span>` : '';
      const style = col.width ? ` style="width:${this._esc(col.width)};text-align:${this._align(col)}"` : ` style="text-align:${this._align(col)}"`;
      if (!col.sortable) return `<th${style}>${this._esc(col.title)}</th>`;
      return `<th class="w-table-sortable" aria-sort="${sort ? (sort.desc ? 'descending' : 'ascending') : 'none'}"${style}>`
        + `<button class="w-table-sort" type="button" data-sort="${this._esc(col.key)}">${this._esc(col.title)}${arrow}</button></th>`;
    }).join('');

    return `<tr>${lead}${ths}</tr>`;
  }

  _align(col) { return col.align === 'end' || col.align === 'right' ? 'right' : col.align === 'center' ? 'center' : 'left'; }

  _bodyHtml(cols, rows) {
    const span = cols.length + (this.showSelect ? 1 : 0) + (this.showExpand ? 1 : 0);
    if (this.loading && !rows.length) return `<tr><td colspan="${span}" class="w-table-message">${this._esc(this.loadingText)}</td></tr>`;
    if (!rows.length) return `<tr><td colspan="${span}" class="w-table-message">${this._esc(this.noDataText)}</td></tr>`;

    return rows.map((item, i) => {
      const key = this._rowKey(item, i);
      const isSel = this.selected.includes(key);
      const isExp = this.expanded.includes(key);
      let lead = '';
      if (this.showSelect) {
        const type = this.selectStrategy === 'single' ? 'radio' : 'checkbox';
        lead += `<td class="w-table-select"><input type="${type}" data-select="${this._esc(key)}"${isSel ? ' checked' : ''} aria-label="Select row"></td>`;
      }
      if (this.showExpand) {
        lead += `<td class="w-table-expand"><button class="w-table-expand-btn" type="button" data-expand="${this._esc(key)}" aria-expanded="${isExp}" aria-label="Toggle details">${isExp ? '▾' : '▸'}</button></td>`;
      }
      const cells = cols.map((col) => `<td style="text-align:${this._align(col)}">${this._esc(this._cell(item, col))}</td>`).join('');
      const main = `<tr${isSel ? ' class="selected"' : ''}>${lead}${cells}</tr>`;
      if (!isExp) return main;
      const detail = cols.map((col) => `<div><strong>${this._esc(col.title)}:</strong> ${this._esc(this._cell(item, col))}</div>`).join('');
      return main + `<tr class="w-data-table-expanded"><td colspan="${span}"><div class="w-data-table-detail">${detail}</div></td></tr>`;
    }).join('');
  }

  _footerHtml() {
    if (this.itemsPerPage <= 0 && !this.itemsPerPageOptions.length) return '';
    const total = this._total;
    const page = wClamp(this.page, 1, this._pageCount);
    const perPage = this.itemsPerPage <= 0 ? total : this.itemsPerPage;
    const start = total ? (page - 1) * perPage + 1 : 0;
    const end = this.itemsPerPage <= 0 ? total : Math.min(start + perPage - 1, total);

    const options = this.itemsPerPageOptions;
    const perPageSelect = options.length ? `<label class="w-data-table-per-page">Rows per page
      <select class="w-select" data-per-page>${options.map((n) =>
        `<option value="${n}"${n === this.itemsPerPage ? ' selected' : ''}>${n < 0 ? 'All' : n}</option>`).join('')}</select></label>` : '';

    const navBtn = (action, label, disabled) =>
      `<button class="w-data-table-nav" type="button" data-page-action="${action}" aria-label="${label}"${disabled ? ' disabled' : ''}>${this._navIcon(action)}</button>`;

    return `<div class="w-data-table-footer">
      ${perPageSelect}
      <span class="w-data-table-range">${start}&#8211;${end} of ${total}</span>
      <div class="w-data-table-pagination">
        ${navBtn('first', 'First page', page <= 1)}
        ${navBtn('prev', 'Previous page', page <= 1)}
        ${navBtn('next', 'Next page', page >= this._pageCount)}
        ${navBtn('last', 'Last page', page >= this._pageCount)}
      </div>
    </div>`;
  }

  _navIcon(action) {
    return { first: '«', prev: '‹', next: '›', last: '»' }[action] || '';
  }

  /* ── interaction ────────────────────────────────────────────────────────── */

  _events() {
    this.querySelectorAll('[data-sort]').forEach((btn) =>
      btn.addEventListener('click', () => this._toggleSort(btn.getAttribute('data-sort'))));

    this.querySelectorAll('[data-page-action]').forEach((btn) =>
      btn.addEventListener('click', () => this._goPage(btn.getAttribute('data-page-action'))));

    this.querySelector('[data-per-page]')?.addEventListener('change', (event) => {
      event.stopPropagation();
      this._silentSet('items-per-page', parseInt(event.target.value, 10));
      this._silentSet('page', 1);
      this._rerender();
      this._emitOptions();
    });

    this.querySelector('[data-select-all]')?.addEventListener('change', (event) => {
      event.stopPropagation();
      this._toggleSelectAll(event.target.checked);
    });
    this.querySelectorAll('[data-select]').forEach((box) =>
      box.addEventListener('change', (event) => {
        event.stopPropagation();
        this._toggleSelect(box.getAttribute('data-select'), event.target.checked);
      }));

    this.querySelectorAll('[data-expand]').forEach((btn) =>
      btn.addEventListener('click', () => this._toggleExpand(btn.getAttribute('data-expand'))));
  }

  _rerender() { this._render(); this._events(); }

  _toggleSort(key) {
    const sorts = this._sorts;
    const existing = sorts.find((s) => s.key === key);
    if (!this.multiSort) {
      if (!existing) this._sortState = [{ key, desc: false }];
      else if (!existing.desc) this._sortState = [{ key, desc: true }];
      else this._sortState = [];
    } else if (!existing) sorts.push({ key, desc: false });
    else if (!existing.desc) existing.desc = true;
    else this._sortState = sorts.filter((s) => s.key !== key);

    const primary = this._sorts[0];
    this._silentSet('sort-by', primary ? primary.key : null);
    this._silentSet('sort-desc', primary && primary.desc ? 'true' : null);
    this._silentSet('page', 1);
    this._rerender();
    this._emitOptions();
  }

  _goPage(action) {
    const page = wClamp(this.page, 1, this._pageCount);
    const next = { first: 1, prev: page - 1, next: page + 1, last: this._pageCount }[action];
    const clamped = wClamp(next, 1, this._pageCount);
    if (clamped === page) return;
    this._silentSet('page', clamped);
    this._rerender();
    this._emitOptions();
  }

  _toggleSelectAll(checked) {
    const keys = this._visibleRows().map((r, i) => this._rowKey(r, i));
    const set = new Set(this.selected);
    keys.forEach((k) => (checked ? set.add(k) : set.delete(k)));
    this._commitSelection([...set]);
  }

  _toggleSelect(key, checked) {
    if (this.selectStrategy === 'single') {
      this._commitSelection(checked ? [key] : []);
      this._rerender();
      return;
    }
    const set = new Set(this.selected);
    checked ? set.add(key) : set.delete(key);
    this._commitSelection([...set]);
    // keep the header "select all" checkbox in sync without a full re-render
    const all = this._visibleRows().every((r, i) => set.has(this._rowKey(r, i)));
    const master = this.querySelector('[data-select-all]');
    if (master) master.checked = all && this._visibleRows().length > 0;
    const tr = this.querySelector(`[data-select="${CSS.escape(key)}"]`)?.closest('tr');
    if (tr) tr.classList.toggle('selected', checked);
  }

  _commitSelection(keys) {
    this._silentSet('selected', keys.join(','));
    this._emit('update:selected', { selected: keys });
  }

  _toggleExpand(key) {
    const set = new Set(this.expanded);
    set.has(key) ? set.delete(key) : set.add(key);
    const keys = [...set];
    this._silentSet('expanded', keys.join(','));
    this._rerender();
    this._emit('update:expanded', { expanded: keys });
  }

  _emitOptions() {
    const primary = this._sorts[0];
    const detail = { page: this.page, itemsPerPage: this.itemsPerPage, sortBy: primary ? primary.key : '', sortDesc: !!(primary && primary.desc) };
    this._emit('update:options', detail);
    this._emit('change', detail);
  }
}

if (!customElements.get('w-data-table')) customElements.define('w-data-table', WDataTable);
