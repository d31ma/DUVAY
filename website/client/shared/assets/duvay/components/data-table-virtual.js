/* <w-data-table-virtual> — virtualised data table, mirroring Vuetify's
 * <v-data-table-virtual>.
 *
 * Renders only the rows in (and near) the viewport, padding the rest with
 * spacer rows so the scrollbar stays accurate. No pagination — scroll through
 * the whole, sorted dataset. Pair `height` with a uniform `item-height`.
 *
 * Everything else — filtering, sorting, selection, expansion, grouping, mobile
 * stacking, gridlines, icons and labels — is <w-data-table>'s, reused as-is;
 * only the body is windowed.
 *
 * Extra attributes:
 *   item-height   - row height in px (default 48)
 *   item-key      - alias of `item-value` (the row's identity for selection)
 *   height        - scroll-area height (default 400px)
 *   sticky        - deprecated alias of `fixed-header`, which is on by default
 *                   here because the table scrolls its own body
 *   fixed-footer  - pins a `footer` slot to the bottom of the scroll area
 *
 * See <w-data-table> for the shared attributes and events.
 */
import { wBoolAttr, wNumberAttr } from './utils.js';
import { WDataTable } from './data-table.js';

export class WDataTableVirtual extends WDataTable {
  static attrs = [...WDataTable.attrs, 'item-height', 'item-key'];

  // getAttribute() returns null when absent and Number(null) is 0, so the
  // documented 48px default needs a presence check to survive.
  get itemHeight() {
    return Math.max(1, this.hasAttribute('item-height') ? wNumberAttr(this, 'item-height', 48) : 48);
  }
  get height() { return this._attr('height', '400px'); }
  // The body scrolls, so the header sticks unless it is explicitly turned off.
  get fixedHeader() { return wBoolAttr(this, 'fixed-header', wBoolAttr(this, 'sticky', true)); }
  // `item-key` is Vuetify's name for the identity column; `item-value` wins.
  get itemValue() { return this._attr('item-value', '') || this._attr('item-key', ''); }

  // No pagination: the window is the viewport, so every row is "visible".
  _visibleRows() { return this._sorted(this._filtered()); }

  /* ── render ─────────────────────────────────────────────────────────────── */

  _template() {
    const cols = this.columns;
    if (!cols.length) return `<div class="w-table-wrap"><slot></slot></div>`;

    const head = this.hideDefaultHeader ? '' : `<thead>${this._headHtml(cols, this._visibleRows())}</thead>`;
    const rootClasses = 'w-data-table w-data-table--virtual' + this._cls({ 'w-data-table--loading': this.loading });

    return `<div class="${rootClasses}" style="--w-virtual-row-height:${this.itemHeight}px">
      ${this.loading ? '<span class="w-data-table-loader" aria-hidden="true"></span>' : ''}
      <div class="${this._wrapClasses()}" style="height:${this._esc(this.height)};overflow:auto" data-virtual-scroll>
        <table class="${this._tableClasses()}">
          ${head}
          <tbody data-virtual-body></tbody>
          ${this._footerSlotHtml(cols)}
        </table>
      </div>
    </div>`;
  }

  _wrapClasses() {
    return super._wrapClasses() + this._cls({ 'w-table-wrap--fixed-footer': this.fixedFooter });
  }

  // A `footer` slot becomes a <tfoot> — that is what `fixed-footer` pins.
  _footerSlotHtml(cols) {
    if (!this.querySelector('[slot="footer"]')) return '';
    return `<tfoot><tr><td colspan="${this._span(cols)}"><slot name="footer"></slot></td></tr></tfoot>`;
  }

  /* ── virtual window ─────────────────────────────────────────────────────── */

  // One entry per rendered <tr>, so the window maths stays a multiplication.
  // Group headers count as a row; a closed group contributes only its header.
  _entries(rows) {
    if (!this._groupKey()) return rows.map((item, index) => ({ item, index }));
    const entries = [];
    let index = 0;
    for (const group of this._groups(rows)) {
      entries.push({ group });
      if (this._groupOpen(group.id)) group.items.forEach((item, i) => entries.push({ item, index: index + i }));
      index += group.items.length;
    }
    return entries;
  }

  _renderWindow() {
    const scroller = this._q('[data-virtual-scroll]');
    const tbody = this._q('[data-virtual-body]');
    if (!scroller || !tbody) return;
    if (this.hideDefaultBody) { tbody.innerHTML = ''; return; }

    const cols = this.columns;
    const rows = this._visibleRows();
    const message = this._messageHtml(rows, this._span(cols));
    if (message !== null) { tbody.innerHTML = message; return; }

    tbody.innerHTML = this._windowHtml(this._entries(rows), cols, scroller);
    this._bindWindowEvents();
  }

  _windowHtml(entries, cols, scroller) {
    const rowHeight = this.itemHeight;
    const { start, end } = this._window(scroller, entries.length, rowHeight);
    let html = this._spacerHtml(cols, start * rowHeight);
    for (let i = start; i < end; i++) html += this._entryHtml(entries[i], cols);
    return html + this._spacerHtml(cols, (entries.length - end) * rowHeight);
  }

  _window(scroller, count, rowHeight) {
    const viewport = scroller.clientHeight || Number.parseInt(this.height, 10) || 400;
    const overscan = 4;
    const start = Math.max(0, Math.floor(scroller.scrollTop / rowHeight) - overscan);
    const end = Math.min(count, start + Math.ceil(viewport / rowHeight) + overscan * 2);
    return { start, end };
  }

  _spacerHtml(cols, height) {
    if (height <= 0) return '';
    return `<tr aria-hidden="true" style="height:${height}px"><td colspan="${this._span(cols)}"></td></tr>`;
  }

  _entryHtml(entry, cols) {
    if (entry.group) return this._groupHeaderHtml(entry.group, this._span(cols));
    return this._rowHtml(entry.item, entry.index, cols);
  }

  /* ── interaction ────────────────────────────────────────────────────────── */

  _events() {
    super._events();
    this._q('[data-virtual-scroll]')?.addEventListener('scroll', () => this._renderWindow());
    this._renderWindow();
  }

  // Row controls live inside the window, so they are rebound after every pass.
  // The select-all box lives in the header and is already bound by _events().
  _bindWindowEvents() {
    this._qAll('[data-virtual-body] [data-select]').forEach((box) =>
      box.addEventListener('change', (event) => {
        event.stopPropagation();
        this._toggleSelect(box.getAttribute('data-select'), event.target.checked);
      }));
    this._bindExpandEvents();
    this._bindGroupEvents();
  }

  // Re-rendering rebuilds the scroll container, so the offset is carried over.
  _rerender() {
    const top = this._q('[data-virtual-scroll]')?.scrollTop || 0;
    super._rerender();
    const scroller = this._q('[data-virtual-scroll]');
    if (scroller && top) {
      scroller.scrollTop = top;
      this._renderWindow();
    }
  }
}

if (!customElements.get('w-data-table-virtual')) customElements.define('w-data-table-virtual', WDataTableVirtual);
