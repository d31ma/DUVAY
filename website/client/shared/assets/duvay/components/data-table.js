/* <w-data-table> — full data table, mirroring Vuetify's <v-data-table>.
 *
 * Renders a semantic <table> and owns the client-side pipeline:
 * filter (search) → sort → group → paginate. Supports rich or simple headers,
 * single and multi-column sorting, row selection, expandable detail rows,
 * grouped rows, a paginated footer with a per-page select, plus loading and
 * empty states.
 *
 * Data:
 *   headers                 - JSON [{title,key,align,sortable,width}] OR a
 *                             simple "Col A,Col B" list (key = title)
 *   items                   - JSON array of objects/rows, or "a|b; c|d" rows
 *   item-value              - key used as a row's identity for selection
 *
 * Filtering:
 *   search                  - case-insensitive filter across all cells
 *   no-filter               - disables all item filtering
 *   filter-keys             - comma list / JSON array of keys to search in
 *   filter-mode             - some | union (any key matches, default)
 *                             every | intersection (all keys must match)
 *
 * Sorting:
 *   sort-by                 - initial sort column key
 *   sort-desc               - initial sort descends
 *   multi-sort              - allow sorting by several columns at once
 *   must-sort               - a sorted column can never be returned to unsorted
 *   disable-sort            - never render sort buttons
 *   initial-sort-order      - asc (default) | desc — direction of the 1st click
 *   sort-icon               - icon shown on sortable but unsorted columns
 *   sort-asc-icon           - icon for an ascending column (default ↑)
 *   sort-desc-icon          - icon for a descending column (default ↓)
 *
 * Selection:
 *   show-select             - render a selection checkbox column
 *   select-strategy         - page (default) | all | single
 *   select-all-label        - aria-label for the header checkbox
 *   selected                - comma list of selected row identities (reflected)
 *   return-object           - update:selected carries the row objects
 *
 * Expansion:
 *   show-expand             - render an expand toggle column
 *   expanded                - comma list of expanded row identities (reflected)
 *   expand-on-click         - clicking a row toggles its detail row
 *   expand-strategy         - multiple (default) | single
 *   expand-icon             - collapsed-row icon (default ▸)
 *   collapse-icon           - expanded-row icon (default ▾)
 *   expand-transition       - animate the detail row; "false"/"none" disables,
 *                             any other value is added as a modifier class
 *
 * Grouping:
 *   group-by                - key, comma list, or JSON [{key,order}]
 *   opened                  - comma list of open group ids (reflected)
 *   open-all                - every group starts open
 *   group-expand-icon       - collapsed-group icon (default ▸)
 *   group-collapse-icon     - expanded-group icon (default ▾)
 *
 * Pagination + footer:
 *   page                    - current page (1-based)
 *   items-per-page          - page size (default 10; -1 shows all)
 *   items-per-page-options  - comma list for the footer select (default 10,25,50,-1)
 *   items-per-page-text     - label for the per-page select
 *   page-text               - range template, {0}=start {1}=end {2}=total
 *   page-by                 - item (default) | auto | any — pagination unit
 *   first/prev/next/last-icon        - nav button icons
 *   first/prev/next/last-page-label  - nav button aria-labels
 *   show-current-page       - render "page / pages" between prev and next
 *   show-first-last-page    - true (default) | false | only-first
 *
 * Presentation:
 *   loading                 - show the loading bar + text
 *   loading-text            - text shown while loading (default "Loading items…")
 *   no-data-text            - text shown when empty (default "No data available")
 *   hide-no-data            - suppress the empty-state row entirely
 *   hide-default-header     - omit <thead>
 *   hide-default-body       - omit the generated rows
 *   hide-default-footer     - omit the footer
 *   density                 - default | comfortable | compact
 *   striped, hover          - row styling
 *   gridlines               - horizontal | vertical | all | none (true = all)
 *   fixed-header / sticky   - sticky header (pair with height)
 *   fixed-footer            - footer sticks to the bottom of the table
 *   mobile                  - force the stacked, card-like layout
 *   mobile-breakpoint       - xs…xxl or a px number below which mobile applies
 *   height                  - CSS height for the scroll area
 *
 * Events:
 *   update:options   - { page, itemsPerPage, sortBy, sortDesc } on any page /
 *                      sort / size change, plus groupBy and pageBy when those
 *                      attributes are set
 *   update:selected  - { selected }                    selection changed
 *   update:expanded  - { expanded }                    expansion changed
 *   update:opened    - { opened }                      group expansion changed
 *   change           - back-compat alias of update:options
 */
import { wBoolAttr, wClamp, wNumberAttr, wParseRecords, wRecordValue, wValueList } from './utils.js';

// Screen widths (px) behind the named `mobile-breakpoint` values.
const W_TABLE_BREAKPOINTS = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 };

export class WDataTable extends WElement {
  static attrs = ['headers', 'items', 'item-value', 'sort-by', 'sort-desc', 'multi-sort',
    'search', 'page', 'items-per-page', 'items-per-page-options', 'show-select', 'select-strategy',
    'selected', 'show-expand', 'expanded', 'loading', 'loading-text', 'no-data-text',
    'density', 'striped', 'hover', 'fixed-header', 'height',
    'sticky', 'mobile', 'mobile-breakpoint', 'gridlines', 'fixed-footer',
    'no-filter', 'filter-keys', 'filter-mode',
    'must-sort', 'disable-sort', 'initial-sort-order', 'sort-icon', 'sort-asc-icon', 'sort-desc-icon',
    'select-all-label', 'return-object',
    'expand-on-click', 'expand-strategy', 'expand-icon', 'collapse-icon', 'expand-transition',
    'group-by', 'opened', 'open-all', 'group-expand-icon', 'group-collapse-icon', 'page-by',
    'hide-default-body', 'hide-default-header', 'hide-default-footer', 'hide-no-data',
    'items-per-page-text', 'page-text', 'first-icon', 'prev-icon', 'next-icon', 'last-icon',
    'first-page-label', 'prev-page-label', 'next-page-label', 'last-page-label',
    'show-current-page', 'show-first-last-page'];

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
  get selectAllLabel() { return this._attr('select-all-label', 'Select all'); }
  get returnObject() { return this._bool('return-object'); }
  get showExpand() { return this._bool('show-expand'); }
  get loading() { return this._bool('loading'); }
  get loadingText() { return this._attr('loading-text', 'Loading items…'); }
  get noDataText() { return this._attr('no-data-text', 'No data available'); }
  get hideNoData() { return this._bool('hide-no-data'); }
  get hideDefaultHeader() { return this._bool('hide-default-header'); }
  get hideDefaultBody() { return this._bool('hide-default-body'); }
  get hideDefaultFooter() { return this._bool('hide-default-footer'); }
  // `sticky` is Vuetify's deprecated spelling of `fixed-header`.
  get fixedHeader() { return wBoolAttr(this, 'fixed-header') || wBoolAttr(this, 'sticky'); }
  get fixedFooter() { return wBoolAttr(this, 'fixed-footer'); }
  get height() { return this._attr('height', ''); }
  get itemValue() { return this._attr('item-value', ''); }

  set selected(v) { this.setAttribute('selected', Array.isArray(v) ? v.join(',') : v ?? ''); }
  get selected() { return wValueList(this._attr('selected', '')).map(String); }
  get expanded() { return wValueList(this._attr('expanded', '')).map(String); }

  /* ── presentation options ───────────────────────────────────────────────── */

  // '' keeps the default (horizontal rules only), matching bare <table> styling.
  get gridlines() {
    const value = this._attr('gridlines', null);
    if (value === null) return '';
    if (value === '' || value === 'true') return 'all';
    if (value === 'false') return 'none';
    return ['vertical', 'horizontal', 'all', 'none'].includes(value) ? value : '';
  }

  // Stacked (card-like) layout: forced by `mobile`, or below `mobile-breakpoint`.
  get mobile() {
    if (wBoolAttr(this, 'mobile')) return true;
    const query = this._mobileQuery();
    return !!query && typeof matchMedia === 'function' && matchMedia(query).matches;
  }

  _mobileQuery() {
    const raw = this._attr('mobile-breakpoint', '');
    if (!raw) return '';
    const px = raw in W_TABLE_BREAKPOINTS ? W_TABLE_BREAKPOINTS[raw] : Number(raw);
    return Number.isFinite(px) && px > 0 ? `(max-width: ${px - 0.02}px)` : '';
  }

  /* ── icons + labels ─────────────────────────────────────────────────────── */

  get sortIcon() { return this._attr('sort-icon', ''); }
  get sortAscIcon() { return this._attr('sort-asc-icon', '↑'); }
  get sortDescIcon() { return this._attr('sort-desc-icon', '↓'); }
  get expandIcon() { return this._attr('expand-icon', '▸'); }
  get collapseIcon() { return this._attr('collapse-icon', '▾'); }
  get groupExpandIcon() { return this._attr('group-expand-icon', '▸'); }
  get groupCollapseIcon() { return this._attr('group-collapse-icon', '▾'); }
  get itemsPerPageText() { return this._attr('items-per-page-text', 'Rows per page'); }
  get pageText() { return this._attr('page-text', '{0}–{1} of {2}'); }
  get showCurrentPage() { return this._bool('show-current-page'); }

  // 'both' | 'only-first' | '' — defaults to 'both' so existing markup keeps
  // its first/last buttons (Vuetify defaults this off).
  get showFirstLastPage() {
    if (this._attr('show-first-last-page', null) === 'only-first') return 'only-first';
    return wBoolAttr(this, 'show-first-last-page', true) ? 'both' : '';
  }

  _pageLabel(action) {
    const labels = {
      first: this._attr('first-page-label', 'First page'),
      prev: this._attr('prev-page-label', 'Previous page'),
      next: this._attr('next-page-label', 'Next page'),
      last: this._attr('last-page-label', 'Last page'),
    };
    return labels[action] || '';
  }

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

  _col(key) {
    return this.columns.find((c) => c.key === key) || { key, index: 0 };
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

  get noFilter() { return this._bool('no-filter'); }
  get filterKeys() { return wValueList(this._attr('filter-keys', '')); }
  get filterMode() {
    const value = this._attr('filter-mode', 'some');
    return ['every', 'some', 'union', 'intersection'].includes(value) ? value : 'some';
  }
  // `every` / `intersection` require a hit in every filtered column.
  get _filterEvery() { return this.filterMode === 'every' || this.filterMode === 'intersection'; }

  _filtered() {
    if (!this.search || this.noFilter) return this.items;
    return this.items.filter((item) => this._matches(item));
  }

  _matches(item) {
    const keys = this.filterKeys;
    if (!keys.length) return JSON.stringify(item).toLowerCase().includes(this.search);
    const hit = (key) => String(this._cell(item, this._col(key))).toLowerCase().includes(this.search);
    return this._filterEvery ? keys.every(hit) : keys.some(hit);
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

  /* ── grouping ───────────────────────────────────────────────────────────── */

  get groupBy() {
    const raw = this._attr('group-by', '').trim();
    if (raw.startsWith('[') && raw.includes('{')) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr.map((g) => this._normGroup(g));
      } catch { /* fall through to simple list */ }
    }
    return wValueList(raw).map((key) => this._normGroup(key));
  }

  _normGroup(g) {
    if (g && typeof g === 'object') return { key: String(g.key ?? ''), order: g.order === 'desc' ? 'desc' : 'asc' };
    return { key: String(g), order: 'asc' };
  }

  // Only the first (top-level) grouping key is honoured.
  _groupKey() {
    const first = this.groupBy[0];
    return first ? first.key : '';
  }

  _groups(rows) {
    const key = this._groupKey();
    if (!key) return [];
    const col = this._col(key);
    const map = new Map();
    rows.forEach((item) => {
      const value = String(this._cell(item, col));
      if (!map.has(value)) map.set(value, { id: value, key, value, items: [] });
      map.get(value).items.push(item);
    });
    const groups = [...map.values()].sort((a, b) => a.value.localeCompare(b.value, undefined, { numeric: true }));
    return this.groupBy[0].order === 'desc' ? groups.reverse() : groups;
  }

  get openAll() { return this._bool('open-all'); }

  get opened() {
    if (this.hasAttribute('opened')) return wValueList(this._attr('opened', '')).map(String);
    return this.openAll ? this._groups(this._filtered()).map((g) => g.id) : [];
  }

  _groupOpen(id) { return this.opened.includes(id); }

  /* ── pagination ─────────────────────────────────────────────────────────── */

  get pageBy() {
    const value = this._attr('page-by', 'item');
    return ['item', 'auto', 'any'].includes(value) ? value : 'item';
  }

  // How many pagination units the dataset holds under the current `page-by`.
  _countUnits(rows) {
    const mode = this.pageBy;
    if (mode === 'item' || !this._groupKey()) return rows.length;
    const groups = this._groups(rows);
    return mode === 'any' ? groups.length + rows.length : groups.length;
  }

  get _total() { return this._countUnits(this._filtered()); }
  get _pageCount() {
    if (this.itemsPerPage <= 0) return 1;
    return Math.max(1, Math.ceil(this._total / this.itemsPerPage));
  }

  _pagedRows(rows) {
    const perPage = this.itemsPerPage;
    if (perPage <= 0) return rows;
    const start = (wClamp(this.page, 1, this._pageCount) - 1) * perPage;
    if (this.pageBy === 'item' || !this._groupKey()) return rows.slice(start, start + perPage);
    return this._pagedGroupRows(rows, start, perPage);
  }

  // `auto` pages whole groups; `any` counts each group header as a unit too.
  _pagedGroupRows(rows, start, perPage) {
    const groups = this._groups(rows);
    if (this.pageBy === 'auto') return groups.slice(start, start + perPage).flatMap((g) => g.items);
    const out = [];
    let unit = 0;
    for (const group of groups) {
      for (const entry of [null, ...group.items]) {
        if (entry && unit >= start && unit < start + perPage) out.push(entry);
        unit += 1;
      }
    }
    return out;
  }

  // Rows for the current page after filter + sort. Overridden by the server table.
  _visibleRows() { return this._pagedRows(this._sorted(this._filtered())); }

  /* ── render ─────────────────────────────────────────────────────────────── */

  _tableClasses() {
    return 'w-table' + this._cls({
      'w-table--striped': this.striped,
      'w-table--no-hover': !this.hover,
      'w-table--dense': this.density === 'compact' || this.density === 'dense',
      'w-table--comfortable': this.density === 'comfortable',
      ['w-table--gridlines-' + this.gridlines]: this.gridlines,
      'w-table--responsive-stack': this.mobile,
    });
  }

  _wrapClasses() {
    return 'w-table-wrap' + this._cls({
      'w-table-wrap--fixed-header': this.fixedHeader,
      'w-table-wrap--responsive-stack': this.mobile,
    });
  }

  _template() {
    const cols = this.columns;
    if (!cols.length) return `<div class="w-table-wrap"><slot></slot></div>`;

    const rows = this._visibleRows();
    const wrapStyle = this.height ? ` style="max-height:${this._esc(this.height)}"` : '';
    const head = this.hideDefaultHeader ? '' : `<thead>${this._headHtml(cols, rows)}</thead>`;
    const rootClasses = 'w-data-table' + this._cls({
      'w-data-table--loading': this.loading,
      'w-data-table--fixed-footer': this.fixedFooter,
    });

    return `<div class="${rootClasses}">
      ${this.loading ? '<span class="w-data-table-loader" aria-hidden="true"></span>' : ''}
      <div class="${this._wrapClasses()}"${wrapStyle}>
        <table class="${this._tableClasses()}">
          ${head}
          <tbody>${this._bodyHtml(cols, rows)}</tbody>
        </table>
      </div>
      ${this._footerHtml()}
    </div>`;
  }

  _headHtml(cols, rows) {
    return `<tr>${this._headLeadHtml(rows)}${cols.map((col) => this._thHtml(col)).join('')}</tr>`;
  }

  _headLeadHtml(rows) {
    let lead = '';
    if (this.showSelect) lead += this._selectAllHtml(rows);
    if (this.showExpand) lead += `<th class="w-table-expand"></th>`;
    return lead;
  }

  _selectAllHtml(rows) {
    if (this.selectStrategy === 'single') return `<th class="w-table-select"></th>`;
    const all = rows.length && rows.every((r, i) => this.selected.includes(this._rowKey(r, i)));
    return `<th class="w-table-select"><input type="checkbox" data-select-all${all ? ' checked' : ''}`
      + ` aria-label="${this._esc(this.selectAllLabel)}"></th>`;
  }

  _thHtml(col) {
    const width = col.width ? `width:${this._esc(col.width)};` : '';
    const style = ` style="${width}text-align:${this._align(col)}"`;
    if (!col.sortable || this.disableSort) return `<th${style}>${this._esc(col.title)}</th>`;
    const sort = this._sorts.find((s) => s.key === col.key);
    return `<th class="w-table-sortable" aria-sort="${this._ariaSort(sort)}"${style}>`
      + `<button class="w-table-sort" type="button" data-sort="${this._esc(col.key)}">`
      + `${this._esc(col.title)}${this._sortIconHtml(sort)}</button></th>`;
  }

  _ariaSort(sort) {
    if (!sort) return 'none';
    return sort.desc ? 'descending' : 'ascending';
  }

  _sortIconHtml(sort) {
    const icon = sort ? (sort.desc ? this.sortDescIcon : this.sortAscIcon) : this.sortIcon;
    if (!icon) return '';
    const inactive = sort ? '' : ' w-table-sort-icon--inactive';
    return `<span class="w-table-sort-icon${inactive}" aria-hidden="true">${this._esc(icon)}</span>`;
  }

  _align(col) { return col.align === 'end' || col.align === 'right' ? 'right' : col.align === 'center' ? 'center' : 'left'; }

  _span(cols) { return cols.length + (this.showSelect ? 1 : 0) + (this.showExpand ? 1 : 0); }

  _bodyHtml(cols, rows) {
    if (this.hideDefaultBody) return '';
    const message = this._messageHtml(rows, this._span(cols));
    if (message !== null) return message;
    if (this._groupKey()) return this._groupedBodyHtml(cols, rows);
    return rows.map((item, i) => this._rowHtml(item, i, cols)).join('');
  }

  // Loading / empty placeholder, or null when there are rows to render.
  _messageHtml(rows, span) {
    if (this.loading && !rows.length) return `<tr><td colspan="${span}" class="w-table-message">${this._esc(this.loadingText)}</td></tr>`;
    if (rows.length) return null;
    if (this.hideNoData) return '';
    return `<tr><td colspan="${span}" class="w-table-message">${this._esc(this.noDataText)}</td></tr>`;
  }

  _groupedBodyHtml(cols, rows) {
    const span = this._span(cols);
    let html = '';
    let index = 0;
    for (const group of this._groups(rows)) {
      html += this._groupHeaderHtml(group, span);
      if (this._groupOpen(group.id)) html += group.items.map((item, i) => this._rowHtml(item, index + i, cols)).join('');
      index += group.items.length;
    }
    return html;
  }

  _groupHeaderHtml(group, span) {
    const open = this._groupOpen(group.id);
    const icon = open ? this.groupCollapseIcon : this.groupExpandIcon;
    return `<tr class="w-data-table-group"><td colspan="${span}">`
      + `<button class="w-data-table-group-btn" type="button" data-group="${this._esc(group.id)}" aria-expanded="${open}">`
      + `<span class="w-data-table-group-icon" aria-hidden="true">${this._esc(icon)}</span>`
      + `${this._esc(group.value)} <span class="w-data-table-group-count">(${group.items.length})</span>`
      + `</button></td></tr>`;
  }

  _rowHtml(item, index, cols) {
    const key = this._rowKey(item, index);
    const isSel = this.selected.includes(key);
    const isExp = this.expanded.includes(key);
    const cells = cols.map((col) =>
      `<td data-label="${this._esc(col.title)}" style="text-align:${this._align(col)}">${this._esc(this._cell(item, col))}</td>`).join('');
    const attrs = this._attrs({
      class: isSel ? 'selected' : '', 'data-row': key,
      tabindex: this.expandOnClick ? '0' : '', 'aria-expanded': this.expandOnClick ? String(isExp) : '',
    });
    const main = `<tr${attrs}>${this._rowLeadHtml(key, isSel, isExp)}${cells}</tr>`;
    return isExp ? main + this._detailHtml(item, cols) : main;
  }

  _rowLeadHtml(key, isSel, isExp) {
    let lead = '';
    if (this.showSelect) {
      const type = this.selectStrategy === 'single' ? 'radio' : 'checkbox';
      lead += `<td class="w-table-select"><input type="${type}" data-select="${this._esc(key)}"${isSel ? ' checked' : ''} aria-label="Select row"></td>`;
    }
    if (this.showExpand) {
      const icon = isExp ? this.collapseIcon : this.expandIcon;
      lead += `<td class="w-table-expand"><button class="w-table-expand-btn" type="button" data-expand="${this._esc(key)}"`
        + ` aria-expanded="${isExp}" aria-label="Toggle details">${this._esc(icon)}</button></td>`;
    }
    return lead;
  }

  get expandOnClick() { return this._bool('expand-on-click'); }
  get expandStrategy() { return this._attr('expand-strategy', 'multiple'); }
  get disableSort() { return this._bool('disable-sort'); }
  get mustSort() { return this._bool('must-sort'); }
  get initialSortOrder() { return this._attr('initial-sort-order', 'asc') === 'desc' ? 'desc' : 'asc'; }

  // '' when the detail row should not animate; otherwise the modifier classes.
  _expandTransitionClasses() {
    if (!this.hasAttribute('expand-transition')) return '';
    const value = this._attr('expand-transition', '');
    if (value === 'false' || value === 'none') return '';
    const custom = value && value !== 'true' ? ' ' + this._commonClass('w-data-table-expanded--', value) : '';
    return ' w-data-table-expanded--transition' + custom;
  }

  _detailHtml(item, cols) {
    const detail = cols.map((col) =>
      `<div><strong>${this._esc(col.title)}:</strong> ${this._esc(this._cell(item, col))}</div>`).join('');
    return `<tr class="w-data-table-expanded${this._expandTransitionClasses()}"><td colspan="${this._span(cols)}">`
      + `<div class="w-data-table-detail">${detail}</div></td></tr>`;
  }

  _footerHtml() {
    if (this.hideDefaultFooter) return '';
    if (this.itemsPerPage <= 0 && !this.itemsPerPageOptions.length) return '';
    const total = this._total;
    const page = wClamp(this.page, 1, this._pageCount);

    return `<div class="w-data-table-footer">
      ${this._perPageHtml()}
      ${this._rangeHtml(total, page)}
      <div class="w-data-table-pagination">${this._navHtml(page)}</div>
    </div>`;
  }

  _perPageHtml() {
    const options = this.itemsPerPageOptions;
    if (!options.length) return '';
    const opts = options.map((n) =>
      `<option value="${n}"${n === this.itemsPerPage ? ' selected' : ''}>${n < 0 ? 'All' : n}</option>`).join('');
    return `<label class="w-data-table-per-page">${this._esc(this.itemsPerPageText)}
      <select class="w-select" data-per-page>${opts}</select></label>`;
  }

  _rangeHtml(total, page) {
    const perPage = this.itemsPerPage <= 0 ? total : this.itemsPerPage;
    const start = total ? (page - 1) * perPage + 1 : 0;
    const end = this.itemsPerPage <= 0 ? total : Math.min(start + perPage - 1, total);
    const text = this._esc(this.pageText)
      .replace('{0}', String(start)).replace('{1}', String(end)).replace('{2}', String(total));
    return `<span class="w-data-table-range">${text}</span>`;
  }

  _navHtml(page) {
    const last = this._pageCount;
    const mode = this.showFirstLastPage;
    const parts = [];
    if (mode) parts.push(this._navBtn('first', page <= 1));
    parts.push(this._navBtn('prev', page <= 1));
    if (this.showCurrentPage) parts.push(`<span class="w-data-table-page">${page} / ${last}</span>`);
    parts.push(this._navBtn('next', page >= last));
    if (mode === 'both') parts.push(this._navBtn('last', page >= last));
    return parts.join('');
  }

  _navBtn(action, disabled) {
    return `<button class="w-data-table-nav" type="button" data-page-action="${action}"`
      + ` aria-label="${this._esc(this._pageLabel(action))}"${disabled ? ' disabled' : ''}>${this._navIcon(action)}</button>`;
  }

  _navIcon(action) {
    const icons = {
      first: this._attr('first-icon', '«'), prev: this._attr('prev-icon', '‹'),
      next: this._attr('next-icon', '›'), last: this._attr('last-icon', '»'),
    };
    return this._esc(icons[action] || '');
  }

  /* ── interaction ────────────────────────────────────────────────────────── */

  _events() {
    this._bindSortEvents();
    this._bindPageEvents();
    this._bindSelectEvents();
    this._bindExpandEvents();
    this._bindGroupEvents();
    this._bindMobileQuery();
  }

  _bindSortEvents() {
    this.querySelectorAll('[data-sort]').forEach((btn) =>
      btn.addEventListener('click', () => this._toggleSort(btn.getAttribute('data-sort'))));
  }

  _bindPageEvents() {
    this.querySelectorAll('[data-page-action]').forEach((btn) =>
      btn.addEventListener('click', () => this._goPage(btn.getAttribute('data-page-action'))));

    this.querySelector('[data-per-page]')?.addEventListener('change', (event) => {
      event.stopPropagation();
      this._silentSet('items-per-page', parseInt(event.target.value, 10));
      this._silentSet('page', 1);
      this._rerender();
      this._emitOptions();
    });
  }

  _bindSelectEvents() {
    this.querySelector('[data-select-all]')?.addEventListener('change', (event) => {
      event.stopPropagation();
      this._toggleSelectAll(event.target.checked);
    });
    this.querySelectorAll('[data-select]').forEach((box) =>
      box.addEventListener('change', (event) => {
        event.stopPropagation();
        this._toggleSelect(box.getAttribute('data-select'), event.target.checked);
      }));
  }

  _bindExpandEvents() {
    this.querySelectorAll('[data-expand]').forEach((btn) =>
      btn.addEventListener('click', () => this._toggleExpand(btn.getAttribute('data-expand'))));
    if (!this.expandOnClick) return;
    this.querySelectorAll('tr[data-row]').forEach((row) => {
      row.addEventListener('click', (event) => this._rowActivate(row, event));
      row.addEventListener('keydown', (event) => this._rowKeydown(row, event));
    });
  }

  _rowActivate(row, event) {
    if (event.target.closest('button, input, a, select, textarea')) return;
    this._toggleExpand(row.getAttribute('data-row'));
  }

  _rowKeydown(row, event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this._toggleExpand(row.getAttribute('data-row'));
  }

  _bindGroupEvents() {
    this.querySelectorAll('[data-group]').forEach((btn) =>
      btn.addEventListener('click', () => this._toggleGroup(btn.getAttribute('data-group'))));
  }

  // Re-render when the viewport crosses the mobile breakpoint.
  _bindMobileQuery() {
    const query = this._mobileQuery();
    if (!query || this._mobileBound === query || typeof matchMedia !== 'function') return;
    this._mobileBound = query;
    matchMedia(query).addEventListener('change', () => this._rerender());
  }

  _rerender() { this._render(); this._events(); }

  _toggleSort(key) {
    const initialDesc = this.initialSortOrder === 'desc';
    const existing = this._sorts.find((s) => s.key === key);
    this._sortState = this.multiSort
      ? this._nextMultiSort(key, existing, initialDesc)
      : this._nextSort(key, existing, initialDesc);

    const primary = this._sorts[0];
    this._silentSet('sort-by', primary ? primary.key : null);
    this._silentSet('sort-desc', primary && primary.desc ? 'true' : null);
    this._silentSet('page', 1);
    this._rerender();
    this._emitOptions();
  }

  // unsorted → initial order → opposite → unsorted (or back to initial when
  // `must-sort` forbids the unsorted state).
  _nextSort(key, existing, initialDesc) {
    if (!existing) return [{ key, desc: initialDesc }];
    if (existing.desc === initialDesc) return [{ key, desc: !initialDesc }];
    return this.mustSort ? [{ key, desc: initialDesc }] : [];
  }

  _nextMultiSort(key, existing, initialDesc) {
    const sorts = this._sorts;
    if (!existing) return [...sorts, { key, desc: initialDesc }];
    if (existing.desc === initialDesc) return sorts.map((s) => (s.key === key ? { key, desc: !initialDesc } : s));
    if (this.mustSort) return sorts.map((s) => (s.key === key ? { key, desc: initialDesc } : s));
    return sorts.filter((s) => s.key !== key);
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
    this._emit('update:selected', { selected: this._selectionPayload(keys) });
  }

  // `return-object` swaps the identity strings for the matching row objects.
  _selectionPayload(keys) {
    if (!this.returnObject) return keys;
    const byKey = new Map(this.items.map((item, i) => [this._rowKey(item, i), item]));
    return keys.map((key) => (byKey.has(key) ? byKey.get(key) : key));
  }

  _toggleExpand(key) {
    const set = new Set(this.expanded);
    const opening = !set.has(key);
    if (this.expandStrategy === 'single') set.clear();
    if (opening) set.add(key);
    else set.delete(key);
    const keys = [...set];
    this._silentSet('expanded', keys.join(','));
    this._rerender();
    this._emit('update:expanded', { expanded: keys });
  }

  _toggleGroup(id) {
    const set = new Set(this.opened);
    set.has(id) ? set.delete(id) : set.add(id);
    const keys = [...set];
    this._silentSet('opened', keys.join(','));
    this._rerender();
    this._emit('update:opened', { opened: keys });
  }

  _emitOptions() {
    const primary = this._sorts[0];
    const detail = { page: this.page, itemsPerPage: this.itemsPerPage, sortBy: primary ? primary.key : '', sortDesc: !!(primary && primary.desc) };
    // Only reported when configured, so a plain table keeps a minimal payload.
    const groups = this.groupBy;
    if (groups.length) detail.groupBy = groups;
    if (this.hasAttribute('page-by')) detail.pageBy = this.pageBy;
    this._emit('update:options', detail);
    this._emit('change', detail);
  }
}

if (!customElements.get('w-data-table')) customElements.define('w-data-table', WDataTable);
