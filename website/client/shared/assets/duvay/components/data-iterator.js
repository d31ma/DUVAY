/* <w-data-iterator> — render records as repeated cards, mirroring Vuetify's
 * <v-data-iterator>.
 *
 * Shares its whole data pipeline — filter → sort → group → paginate, plus
 * selection and expansion — with <w-data-table>, so every attribute below
 * carries exactly the same meaning there. Only the presentation differs: a card
 * grid with a footer (item range, per-page select, pagination) instead of a
 * table.
 *
 * Data:
 *   items                  - records: JSON array, or "a|b|c; d|e|f" rows
 *   item-value             - record key used as a card's identity
 *   items-length           - total row count for server-side paging; when set,
 *                            `items` is taken to be the current page already
 *   title-field            - record key for the card title (default "title")
 *   subtitle-field         - record key for the subtitle (default "subtitle")
 *   meta-field             - record key for the meta line (default "meta")
 *
 * Filtering:
 *   search, no-filter, filter-keys, filter-mode
 *
 * Sorting (through the `toggleSort(key)` method):
 *   sort-by, sort-desc, multi-sort, must-sort, initial-sort-order
 *
 * Selection:
 *   show-select, select-strategy (page | all | single), selected,
 *   return-object, select-all-label
 *
 * Expansion:
 *   show-expand, expanded, expand-on-click, expand-strategy,
 *   expand-icon, collapse-icon
 *
 * Grouping:
 *   group-by, opened, open-all, group-expand-icon, group-collapse-icon
 *
 * Pagination:
 *   page, items-per-page (default 6), items-per-page-options, page-by
 *
 * Presentation:
 *   loading                - show skeleton placeholders
 *   no-data-text           - message when nothing matches
 *   transition             - card entrance animation: fade (default) | scale |
 *                            slide-y | slide-x; `false` / `none` disables it
 *
 * Slots:
 *   default - custom content shown when `items` is empty
 *
 * Events:
 *   change           - { value: page }                page changed
 *   update           - { page, itemsPerPage }         page size changed
 *   update:selected  - { selected }                   selection changed
 *   update:expanded  - { expanded }                   expansion changed
 *   update:opened    - { opened }                     group expansion changed
 */
import { wClamp, wNumberAttr, wRecordValue } from './utils.js';
import { WDataTable } from './data-table.js';
import './pagination.js';

// The three card slots, in order; each maps to one *-field attribute.
const W_FIELDS = ['title', 'subtitle', 'meta'];

// `transition` names that map onto the framework's entrance animations.
const W_TRANSITIONS = ['fade', 'scale', 'slide-y', 'slide-x'];

export class WDataIterator extends WDataTable {
  static attrs = ['title-field', 'subtitle-field', 'meta-field', 'items-length', 'transition'];

  get titleField() { return this._attr('title-field', 'title'); }
  get subtitleField() { return this._attr('subtitle-field', 'subtitle'); }
  get metaField() { return this._attr('meta-field', 'meta'); }

  // A card has three fixed slots rather than author-defined columns.
  get columns() {
    return [this.titleField, this.subtitleField, this.metaField].map((key, index) => ({
      title: W_FIELDS[index], key, index, align: 'start', sortable: true, width: '',
    }));
  }

  // `sort-by="meta"` addresses a slot even when meta-field renames its key.
  _col(key) {
    const columns = this.columns;
    const found = columns.find((column) => column.key === key);
    if (found) return found;
    const slot = W_FIELDS.indexOf(key);
    return slot >= 0 ? columns[slot] : { key, index: 0 };
  }

  get itemsPerPage() { return Math.max(1, wNumberAttr(this, 'items-per-page', 6)); }

  // No footer select unless the author lists the sizes.
  get itemsPerPageOptions() {
    return this._attr('items-per-page-options', '')
      .split(',').map((n) => parseInt(n, 10)).filter((n) => n > 0);
  }

  /* ── server-side paging ─────────────────────────────────────────────────── */

  get itemsLength() { return wNumberAttr(this, 'items-length', -1); }
  get _serverSide() { return this.hasAttribute('items-length') && this.itemsLength >= 0; }
  get _total() { return this._serverSide ? this.itemsLength : super._total; }

  // The server already sliced the page, so the rows arrive ready to render.
  _pagedRows(rows) {
    return this._serverSide ? rows : super._pagedRows(rows);
  }

  /* ── sorting ────────────────────────────────────────────────────────────── */

  // Re-seed the sort state when sort-by / sort-desc are set from outside;
  // toggleSort() reaches the attributes through _silentSet, which never lands
  // here, so a multi-column sort survives its own re-render.
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'sort-by' || name === 'sort-desc') this._sortState = null;
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  // Vuetify exposes toggleSort through the default slot; here it is a method.
  toggleSort(key) { this._toggleSort(key); }

  /* ── template ───────────────────────────────────────────────────────────── */

  // Index of the first card on the current page, in the whole result set.
  _start() {
    return (wClamp(this.page, 1, this._pageCount) - 1) * this.itemsPerPage;
  }

  _template() {
    if (this.loading) return `<div class="w-data-iterator">${this._loadingHtml()}</div>`;
    if (!this.items.length) return `<div class="w-data-iterator"><slot></slot></div>`;

    const total = this._total;
    if (!total) {
      return `<div class="w-data-iterator"><div class="w-data-iterator-empty">${this._esc(this.noDataText)}</div></div>`;
    }

    const rows = this._visibleRows();
    return `<div class="w-data-iterator">
      ${this._selectAllHtml(rows)}
      ${this._gridHtml(rows)}
      ${this._iteratorFooterHtml(rows.length, total)}
    </div>`;
  }

  _gridHtml(rows) {
    const start = this._start();
    if (this._groupKey()) return this._groupsHtml(rows, start);
    return `<div class="w-data-iterator-grid">`
      + rows.map((item, index) => this._itemHtml(item, start + index)).join('') + `</div>`;
  }

  _groupsHtml(rows, start) {
    let index = start;
    return this._groups(rows).map((group) => {
      const items = group.items.map((item, offset) => this._itemHtml(item, index + offset)).join('');
      index += group.items.length;
      return this._groupHtml(group, items);
    }).join('');
  }

  _groupHtml(group, items) {
    const open = this._groupOpen(group.id);
    const icon = open ? this.groupCollapseIcon : this.groupExpandIcon;
    const body = open ? `<div class="w-data-iterator-grid">${items}</div>` : '';
    return `<section class="w-data-iterator-group">`
      + `<button class="w-data-table-group-btn" type="button" data-group="${this._esc(group.id)}" aria-expanded="${open}">`
      + `<span class="w-data-table-group-icon" aria-hidden="true">${this._esc(icon)}</span>`
      + `${this._esc(group.value)} <span class="w-data-table-group-count">(${group.items.length})</span>`
      + `</button>${body}</section>`;
  }

  /* ── cards ──────────────────────────────────────────────────────────────── */

  // '' when the cards should not animate, otherwise the entrance class.
  _transitionClass() {
    if (!this.hasAttribute('transition')) return '';
    const value = this._attr('transition', '').replace(/-transition$/, '');
    if (value === 'false' || value === 'none') return '';
    const name = W_TRANSITIONS.includes(value) ? value : 'fade';
    return ` w-animate-${name}-in`;
  }

  _itemHtml(item, index) {
    const key = this._rowKey(item, index);
    const selected = this.selected.includes(key);
    const expanded = this.expanded.includes(key);
    const classes = 'w-data-iterator-item' + (selected ? ' selected' : '') + this._transitionClass();
    return `<article class="${classes}"${this._cardAttrs(key, index, expanded)}>`
      + this._selectHtml(key, selected)
      + `<strong>${this._esc(wRecordValue(item, this.titleField, 0))}</strong>`
      + this._lineHtml('span', wRecordValue(item, this.subtitleField, 1))
      + this._lineHtml('small', wRecordValue(item, this.metaField, 2))
      + this._expandHtml(key, expanded)
      + (expanded ? this._detailHtml(item) : '')
      + `</article>`;
  }

  _cardAttrs(key, index, expanded) {
    return this._attrs({
      'data-index': String(index),
      'data-row': key,
      tabindex: this.expandOnClick ? '0' : '',
      'aria-expanded': this.expandOnClick || this.showExpand ? String(expanded) : '',
    });
  }

  _lineHtml(tag, value) {
    return value ? `<${tag}>${this._esc(value)}</${tag}>` : '';
  }

  _selectHtml(key, selected) {
    if (!this.showSelect) return '';
    const type = this.selectStrategy === 'single' ? 'radio' : 'checkbox';
    return `<label class="w-data-iterator-select"><input type="${type}" data-select="${this._esc(key)}"`
      + `${selected ? ' checked' : ''} aria-label="Select item"></label>`;
  }

  _expandHtml(key, expanded) {
    if (!this.showExpand) return '';
    const icon = expanded ? this.collapseIcon : this.expandIcon;
    return `<button class="w-data-iterator-expand" type="button" data-expand="${this._esc(key)}"`
      + ` aria-expanded="${expanded}" aria-label="Toggle details">${this._esc(icon)}</button>`;
  }

  _detailHtml(item) {
    const rows = this.columns.map((column) =>
      `<div><b>${this._esc(column.title)}:</b> ${this._esc(this._cell(item, column))}</div>`).join('');
    return `<div class="w-data-iterator-detail">${rows}</div>`;
  }

  /* ── select all ─────────────────────────────────────────────────────────── */

  // 'all' spans the whole filtered set; 'page' (default) only this page.
  _selectableRows() {
    return this.selectStrategy === 'all' ? this._sorted(this._filtered()) : this._visibleRows();
  }

  _selectAllHtml(rows) {
    if (!this.showSelect || this.selectStrategy === 'single') return '';
    const keys = this._selectableRows().map((item, index) => this._rowKey(item, index));
    const all = !!keys.length && keys.every((key) => this.selected.includes(key));
    return `<div class="w-data-iterator-toolbar"><label class="w-data-iterator-select-all">`
      + `<input type="checkbox" data-select-all${all ? ' checked' : ''}`
      + ` aria-label="${this._esc(this.selectAllLabel)}"> ${this._esc(this.selectAllLabel)}`
      + `</label><span class="w-data-iterator-count">${this.selected.length} selected of ${rows.length}</span></div>`;
  }

  /* ── footer ─────────────────────────────────────────────────────────────── */

  _iteratorFooterHtml(count, total) {
    const start = this._start();
    return `<div class="w-data-iterator-footer">
      <span class="w-data-iterator-range">${start + 1}&#8211;${start + count} of ${total}</span>
      <div class="w-data-iterator-controls">
        ${this._perPageHtml()}
        <w-pagination page="${wClamp(this.page, 1, this._pageCount)}" length="${this._pageCount}"></w-pagination>
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

  /* ── events ─────────────────────────────────────────────────────────────── */

  _events() {
    this._bindPagination();
    this._bindPerPage();
    this._bindSelectEvents();
    this._bindExpandEvents();
    this._bindGroupEvents();
  }

  _bindPagination() {
    this.querySelector('w-pagination')?.addEventListener('change', (event) => {
      event.stopPropagation();
      const page = event.detail.value ?? event.detail.page;
      this._silentSet('page', page);
      this._rerender();
      this._emit('change', { value: page });
    });
  }

  _bindPerPage() {
    this.querySelector('[data-per-page]')?.addEventListener('change', (event) => {
      event.stopPropagation();
      const itemsPerPage = parseInt(event.target.value, 10) || this.itemsPerPage;
      this._silentSet('items-per-page', itemsPerPage);
      this._silentSet('page', 1);
      this._rerender();
      this._emit('update', { page: 1, itemsPerPage });
    });
  }

  // Cards, not table rows, carry the expand-on-click affordance.
  _bindExpandEvents() {
    super._bindExpandEvents();
    if (!this.expandOnClick) return;
    this._qAll('article[data-row]').forEach((card) => {
      card.addEventListener('click', (event) => this._rowActivate(card, event));
      card.addEventListener('keydown', (event) => this._rowKeydown(card, event));
    });
  }

  // A card has no <tr> to restyle, so selection re-renders the grid.
  _toggleSelect(key, checked) {
    this._commitSelection(this._nextSelection(key, checked));
    this._rerender();
  }

  _nextSelection(key, checked) {
    if (this.selectStrategy === 'single') return checked ? [key] : [];
    const set = new Set(this.selected);
    if (checked) set.add(key);
    else set.delete(key);
    return [...set];
  }

  _toggleSelectAll(checked) {
    const keys = this._selectableRows().map((item, index) => this._rowKey(item, index));
    const set = new Set(this.selected);
    keys.forEach((key) => (checked ? set.add(key) : set.delete(key)));
    this._commitSelection([...set]);
    this._rerender();
  }
}

if (!customElements.get('w-data-iterator')) customElements.define('w-data-iterator', WDataIterator);
