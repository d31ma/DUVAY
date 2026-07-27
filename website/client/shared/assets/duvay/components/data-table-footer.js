/* <w-data-table-footer> — standalone data table footer, mirroring Vuetify's
 * <v-data-table-footer>.
 *
 * Owns the page-size select, the range readout, and the pagination controls for
 * a table you are driving yourself. It never touches the rows: it reports what
 * the user asked for through `update:options` and reflects `page` /
 * `items-per-page` back onto itself.
 *
 * Attributes:
 *   page                    - current page, 1-based (reflected)
 *   items-per-page          - page size; -1 or 0 means "all" (reflected)
 *   items-length            - total number of rows the table is paging through
 *   items-per-page-options  - "10,25,50,-1" or JSON [{ title, value }]
 *   items-per-page-text     - label for the page-size select
 *   page-text               - range template, {0} start, {1} end, {2} total
 *   show-current-page       - show the page number between prev and next
 *   show-first-last-page    - add first/last buttons; "only-first" adds just first
 *   first-icon / prev-icon / next-icon / last-icon    - nav glyphs
 *   first-page-label / prev-page-label /
 *   next-page-label / last-page-label                 - nav aria-labels
 *
 * Events:
 *   update:options  - { page, itemsPerPage }
 *   change          - alias of update:options
 */
import { wClamp, wNumberAttr, wValueList } from './utils.js';

export class WDataTableFooter extends WElement {
  static attrs = ['page', 'items-per-page', 'items-length', 'items-per-page-options',
    'items-per-page-text', 'page-text', 'show-current-page', 'show-first-last-page',
    'first-icon', 'prev-icon', 'next-icon', 'last-icon',
    'first-page-label', 'prev-page-label', 'next-page-label', 'last-page-label'];

  get page() { return Math.max(1, this._number('page', 1)); }
  get itemsPerPage() { return this._number('items-per-page', 10); }
  get itemsLength() { return Math.max(0, this._number('items-length', 0)); }
  get itemsPerPageText() { return this._attr('items-per-page-text', 'Items per page:'); }
  get pageText() { return this._attr('page-text', '{0}-{1} of {2}'); }
  get showCurrentPage() { return this._bool('show-current-page'); }

  // getAttribute() returns null when absent and Number(null) is 0, so presence
  // has to be checked before the fallback can survive.
  _number(name, fallback) {
    return this.hasAttribute(name) ? wNumberAttr(this, name, fallback) : fallback;
  }

  get itemsPerPageOptions() {
    const raw = this._attr('items-per-page-options', '10,25,50,-1').trim();
    if (raw.startsWith('[') && raw.includes('{')) return this._jsonOptions(raw);
    return wValueList(raw).map((value) => this._option(value)).filter((option) => option);
  }

  _jsonOptions(raw) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map((entry) => this._option(entry)).filter((o) => o) : [];
    } catch { return []; }
  }

  _option(entry) {
    const source = entry && typeof entry === 'object' ? entry : { value: entry };
    const value = Number.parseInt(source.value, 10);
    if (!Number.isFinite(value)) return null;
    return { value, title: String(source.title ?? (value < 0 ? 'All' : value)) };
  }

  get _perPage() { return this.itemsPerPage > 0 ? this.itemsPerPage : this.itemsLength; }
  get _pageCount() {
    if (this.itemsPerPage <= 0) return 1;
    return Math.max(1, Math.ceil(this.itemsLength / this.itemsPerPage));
  }

  _showFirst() {
    if (!this.hasAttribute('show-first-last-page')) return false;
    return this._attr('show-first-last-page', '') !== 'false';
  }

  _showLast() {
    return this._showFirst() && this._attr('show-first-last-page', '') !== 'only-first';
  }

  _rangeText() {
    const total = this.itemsLength;
    const page = wClamp(this.page, 1, this._pageCount);
    const start = total ? (page - 1) * this._perPage + 1 : 0;
    const end = Math.min(start + this._perPage - 1, total);
    return this.pageText.replace('{0}', String(start)).replace('{1}', String(end)).replace('{2}', String(total));
  }

  _template() {
    return `<div class="w-data-table-footer">${this._perPageHtml()}`
      + `<span class="w-data-table-range">${this._esc(this._rangeText())}</span>`
      + `<div class="w-data-table-pagination">${this._navHtml()}</div><slot></slot></div>`;
  }

  _perPageHtml() {
    const options = this.itemsPerPageOptions;
    if (!options.length) return '';
    return `<label class="w-data-table-per-page">${this._esc(this.itemsPerPageText)}`
      + `<select class="w-select" data-per-page>${options.map((option) => (
        `<option value="${option.value}"${option.value === this.itemsPerPage ? ' selected' : ''}>`
        + `${this._esc(option.title)}</option>`)).join('')}</select></label>`;
  }

  _navHtml() {
    const page = wClamp(this.page, 1, this._pageCount);
    const atStart = page <= 1;
    const atEnd = page >= this._pageCount;
    const current = this.showCurrentPage
      ? `<span class="w-data-table-page" aria-current="page">${page}</span>` : '';
    return (this._showFirst() ? this._navBtn('first', atStart) : '')
      + this._navBtn('prev', atStart) + current + this._navBtn('next', atEnd)
      + (this._showLast() ? this._navBtn('last', atEnd) : '');
  }

  _navBtn(action, disabled) {
    const labels = { first: 'First page', prev: 'Previous page', next: 'Next page', last: 'Last page' };
    const glyphs = { first: '«', prev: '‹', next: '›', last: '»' };
    const label = this._attr(`${action}-page-label`, labels[action]);
    return `<button class="w-data-table-nav" type="button" data-page-action="${action}"`
      + ` aria-label="${this._esc(label)}"${disabled ? ' disabled' : ''}>`
      + `${this._esc(this._attr(`${action}-icon`, glyphs[action]))}</button>`;
  }

  _events() {
    this._qAll('[data-page-action]').forEach((button) => button.addEventListener('click', () => {
      this._goPage(button.getAttribute('data-page-action'));
    }));
    this._q('[data-per-page]')?.addEventListener('change', (event) => {
      event.stopPropagation();
      this._silentSet('items-per-page', Number.parseInt(event.target.value, 10));
      this._silentSet('page', 1);
      this._rerender();
      this._emitOptions();
    });
  }

  _rerender() { this._render(); this._events(); }

  _goPage(action) {
    const page = wClamp(this.page, 1, this._pageCount);
    const targets = { first: 1, prev: page - 1, next: page + 1, last: this._pageCount };
    const next = wClamp(targets[action], 1, this._pageCount);
    if (next === page) return;
    this._silentSet('page', next);
    this._rerender();
    this._emitOptions();
  }

  _emitOptions() {
    const detail = { page: this.page, itemsPerPage: this.itemsPerPage };
    this._emit('update:options', detail);
    this._emit('change', detail);
  }
}

if (!customElements.get('w-data-table-footer')) {
  customElements.define('w-data-table-footer', WDataTableFooter);
}
