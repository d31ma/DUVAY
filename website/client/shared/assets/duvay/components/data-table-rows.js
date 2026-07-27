/* <w-data-table-rows> — Data table body rows, mirroring Vuetify's <v-data-table-rows>.
 *
 * Renders one <w-data-table-row> per item and forwards the per-row presentation
 * attributes to them. With `group-by` the rows are bucketed under collapsible
 * group headers.
 *
 * Attributes:
 *   headers              - column labels (comma list or JSON array)
 *   items                - JSON array of records, or "a|b; c|d" rows
 *   no-data-text         - message when there are no items (default "No data available")
 *   loading-text         - message while `loading` is set (default "Loading items…")
 *   hide-no-data         - suppress the empty message entirely
 *   group-by             - column key to group rows under
 *   opened               - comma list of open group names (reflected)
 *   group-expand-icon    - glyph on a closed group header (default ▸)
 *   group-collapse-icon  - glyph on an open group header (default ▾)
 *   expand-transition    - animate group reveals; `false` / `none` turns it off
 *   expand-icon          - forwarded: glyph on a collapsed row (default ▸)
 *   collapse-icon        - forwarded: glyph on an expanded row (default ▾)
 *   show-select          - forwarded: render row selection controls
 *   show-expand          - forwarded: render row expand toggles
 *   mobile               - forwarded: stack each row's cells with column labels
 *   mobile-breakpoint    - forwarded: stack below this width
 *
 * Events:
 *   update:opened  - { opened }
 */
import { wParseRecords, wRecordValue, wValueList } from './utils.js';
import { wMobileMode, wWatchMobile } from './data-table-row.js';

export class WDataTableRows extends WElement {
  static attrs = ['headers', 'items', 'no-data-text', 'loading-text', 'hide-no-data',
    'group-by', 'opened', 'group-expand-icon', 'group-collapse-icon', 'expand-transition',
    'expand-icon', 'collapse-icon', 'show-select', 'show-expand', 'mobile', 'mobile-breakpoint'];

  get headers() { return wValueList(this._attr('headers', '')); }
  get items() { return wParseRecords(this._attr('items', ''), this.headers); }
  get noDataText() { return this._attr('no-data-text', 'No data available'); }
  get loadingText() { return this._attr('loading-text', 'Loading items…'); }
  get hideNoData() { return this._bool('hide-no-data'); }
  get groupBy() { return wValueList(this._attr('group-by', ''))[0] || ''; }
  get opened() { return wValueList(this._attr('opened', '')); }
  get groupExpandIcon() { return this._attr('group-expand-icon', '▸'); }
  get groupCollapseIcon() { return this._attr('group-collapse-icon', '▾'); }
  get mobile() { return wMobileMode(this); }

  _template() {
    if (!this.headers.length) return `<div class="w-data-table-rows"><slot></slot></div>`;
    return `<div class="w-data-table-rows">${this._contentHtml()}<slot></slot></div>`;
  }

  _contentHtml() {
    if (!this.items.length) return this._messageHtml();
    if (!this.groupBy) return this.items.map((item, index) => this._rowHtml(item, index)).join('');
    return this._groupNames().map((name) => this._groupHtml(name)).join('');
  }

  _messageHtml() {
    if (this._bool('loading')) return `<div class="w-table-message">${this._esc(this.loadingText)}</div>`;
    if (this.hideNoData) return '';
    return `<div class="w-table-message">${this._esc(this.noDataText)}</div>`;
  }

  _rowHtml(item, index) {
    return `<w-data-table-row index="${index}" headers="${this._esc(JSON.stringify(this.headers))}"`
      + ` item="${this._esc(JSON.stringify(item))}"${this._forwarded()}></w-data-table-row>`;
  }

  // Presentation attributes Vuetify passes down through the rows component.
  _forwarded() {
    return this._attrs({
      mobile: this.mobile,
      'expand-icon': this._attr('expand-icon', ''),
      'collapse-icon': this._attr('collapse-icon', ''),
      'show-select': this._bool('show-select'),
      'show-expand': this._bool('show-expand'),
    });
  }

  /* ── grouping ───────────────────────────────────────────────────────────── */

  _groupValue(item) {
    return String(wRecordValue(item, this.groupBy, this.headers.indexOf(this.groupBy)) ?? '');
  }

  _groupNames() {
    return [...new Set(this.items.map((item) => this._groupValue(item)))];
  }

  // No `opened` attribute at all means every group starts open; once the user
  // toggles one, the attribute lists exactly which groups are open.
  _isOpen(name) {
    return this.hasAttribute('opened') ? this.opened.includes(name) : true;
  }

  _groupHtml(name) {
    const open = this._isOpen(name);
    const rows = this.items.map((item, index) => ({ item, index }))
      .filter((row) => this._groupValue(row.item) === name);
    return `<div class="w-data-table-group-header-row"><button class="w-data-table-group-btn" type="button"`
      + ` data-group="${this._esc(name)}" aria-expanded="${open}">`
      + `<span aria-hidden="true">${this._esc(open ? this.groupCollapseIcon : this.groupExpandIcon)}</span>`
      + `<span>${this._esc(name)}</span><span class="w-data-table-group-count">(${rows.length})</span></button></div>`
      + `<div class="w-data-table-group-body${this._transitionClass()}" data-group-body="${this._esc(name)}"`
      + `${open ? '' : ' hidden'}>${rows.map((row) => this._rowHtml(row.item, row.index)).join('')}</div>`;
  }

  _transitionClass() {
    const value = this._attr('expand-transition', 'true');
    if (!value || value === 'false' || value === 'none') return '';
    return ' w-data-table-group-body--transition';
  }

  _events() {
    wWatchMobile(this);
    this._qAll('[data-group]').forEach((button) => button.addEventListener('click', () => {
      this._toggleGroup(button.getAttribute('data-group'));
    }));
  }

  _rerender() { this._render(); this._events(); }

  _toggleGroup(name) {
    const names = this._groupNames();
    const open = new Set(names.filter((groupName) => this._isOpen(groupName)));
    if (open.has(name)) open.delete(name);
    else open.add(name);
    const opened = names.filter((groupName) => open.has(groupName));
    this._silentSet('opened', opened.join(','));
    this._rerender();
    this._emit('update:opened', { opened });
  }
}

if (!customElements.get('w-data-table-rows')) {
  customElements.define('w-data-table-rows', WDataTableRows);
}
