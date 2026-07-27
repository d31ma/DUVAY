/* <w-data-table-headers> — Data table header row, mirroring Vuetify's
 * <v-data-table-headers>.
 *
 * Attributes:
 *   headers            - column labels (comma list or JSON array)
 *   sort-by            - sorted column key; a comma list when `multi-sort` is on
 *   sort-desc          - sort direction; a comma list aligned with `sort-by`
 *   multi-sort         - keep sorting on several columns at once
 *   disable-sort       - render plain labels instead of sort buttons
 *   initial-sort-order - direction the first click applies (asc | desc)
 *   sort-icon          - glyph on an unsorted column (default none)
 *   sort-asc-icon      - glyph on an ascending column (default ↑)
 *   sort-desc-icon     - glyph on a descending column (default ↓)
 *   fixed-header       - stick the row to the top of the scroll area
 *   sticky             - deprecated alias of `fixed-header`
 *   show-select        - render a leading "select all" control
 *   select-all-label   - aria-label for that control (default "Select all")
 *   mobile             - hide the header row (stacked rows carry their labels)
 *   mobile-breakpoint  - hide below this width: px number or xs|sm|md|lg|xl|xxl
 *
 * Events:
 *   change           - { sortBy, sortDesc, sorts }
 *   update:selected  - { selected } from the select-all control
 */
import { wBoolAttr, wValueList } from './utils.js';
import { wMobileMode, wWatchMobile } from './data-table-row.js';
import './grid.js';

export class WDataTableHeaders extends WElement {
  static attrs = ['headers', 'sort-by', 'sort-desc', 'multi-sort', 'disable-sort',
    'initial-sort-order', 'sort-icon', 'sort-asc-icon', 'sort-desc-icon', 'fixed-header',
    'sticky', 'show-select', 'select-all-label', 'mobile', 'mobile-breakpoint'];

  get headers() { return wValueList(this._attr('headers', '')); }
  get sortBy() { return this._attr('sort-by', ''); }
  get sortDesc() {
    const first = wValueList(this._attr('sort-desc', ''))[0];
    if (first == null) return this._bool('sort-desc');
    return first !== 'false' && first !== '0';
  }
  get multiSort() { return this._bool('multi-sort'); }
  get disableSort() { return this._bool('disable-sort'); }
  get initialSortOrder() { return this._attr('initial-sort-order', 'asc'); }
  get showSelect() { return this._bool('show-select'); }
  get selectAllLabel() { return this._attr('select-all-label', 'Select all'); }
  get mobile() { return wMobileMode(this); }
  // `sticky` is Vuetify's deprecated spelling; an explicit fixed-header wins.
  get fixedHeader() { return wBoolAttr(this, 'fixed-header', wBoolAttr(this, 'sticky', false)); }

  /* Sort descriptors. `sort-by` / `sort-desc` stay single-valued unless
     `multi-sort` is on, so existing single-column usage is untouched. */
  get sorts() {
    const directions = wValueList(this._attr('sort-desc', ''));
    return wValueList(this.sortBy).map((key, index) => ({ key, desc: this._descAt(directions, index) }));
  }

  _descAt(directions, index) {
    const value = directions[index];
    if (value == null) return directions.length ? false : this.sortDesc;
    return value !== 'false' && value !== '0';
  }

  _template() {
    const rowAttrs = ` class="w-table-header${this._cls({
      'w-table-header--sticky': this.fixedHeader,
      'w-table-header--mobile': this.mobile,
    })}"`;
    if (!this.headers.length) return `<w-row header no-gutters${rowAttrs}><slot></slot></w-row>`;
    const cols = Math.max(1, Math.floor(12 / this.headers.length));
    return `<w-row header no-gutters${rowAttrs}>${this._selectAllHtml()}`
      + this.headers.map((header) => this._headerHtml(header, cols)).join('')
      + `</w-row>`;
  }

  _selectAllHtml() {
    if (!this.showSelect && !this.hasAttribute('select-all-label')) return '';
    return `<w-col cols="1" role="columnheader" class="w-table-select">`
      + `<input type="checkbox" data-select-all aria-label="${this._esc(this.selectAllLabel)}"></w-col>`;
  }

  _headerHtml(header, cols) {
    const label = this._esc(header);
    if (this.disableSort) return `<w-col cols="${cols}" role="columnheader">${label}</w-col>`;
    const sort = this.sorts.find((entry) => entry.key === header);
    return `<w-col cols="${cols}" role="columnheader" aria-sort="${this._ariaSort(sort)}">`
      + `<button class="w-table-sort" type="button" data-sort="${label}">${label}`
      + this._iconHtml(sort) + `</button></w-col>`;
  }

  _ariaSort(sort) {
    if (!sort) return 'none';
    return sort.desc ? 'descending' : 'ascending';
  }

  _iconHtml(sort) {
    const glyph = sort ? this._directionIcon(sort) : this._attr('sort-icon', '');
    if (!glyph) return '';
    const inactive = sort ? '' : ' w-table-sort-icon--inactive';
    return `<span class="w-table-sort-icon${inactive}" aria-hidden="true">${this._esc(glyph)}</span>`;
  }

  _directionIcon(sort) {
    return sort.desc ? this._attr('sort-desc-icon', '↓') : this._attr('sort-asc-icon', '↑');
  }

  _events() {
    wWatchMobile(this);
    this._qAll('[data-sort]').forEach((button) => button.addEventListener('click', () => {
      this._toggleSort(button.getAttribute('data-sort'));
    }));
    this._q('[data-select-all]')?.addEventListener('change', (event) => {
      event.stopPropagation();
      this._emit('update:selected', { selected: event.target.checked });
    });
  }

  _rerender() { this._render(); this._events(); }

  _toggleSort(key) {
    const sorts = this.sorts;
    const next = this._nextSorts(sorts, sorts.find((entry) => entry.key === key), key);
    this._silentSet('sort-by', next.map((entry) => entry.key).join(','));
    this._silentSet('sort-desc', next.map((entry) => entry.desc).join(','));
    this._rerender();
    const active = next.find((entry) => entry.key === key);
    this._emit('change', { sortBy: key, sortDesc: !!active && active.desc, sorts: next });
  }

  _nextSorts(sorts, existing, key) {
    if (!existing) {
      const entry = { key, desc: this.initialSortOrder === 'desc' };
      return this.multiSort ? [...sorts, entry] : [entry];
    }
    const flipped = sorts.map((entry) => (entry.key === key ? { key, desc: !entry.desc } : entry));
    return this.multiSort ? flipped : flipped.filter((entry) => entry.key === key);
  }
}

if (!customElements.get('w-data-table-headers')) {
  customElements.define('w-data-table-headers', WDataTableHeaders);
}
