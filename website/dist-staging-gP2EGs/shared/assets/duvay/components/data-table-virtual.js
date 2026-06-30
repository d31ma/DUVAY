/* <w-data-table-virtual> — virtualised data table, mirroring Vuetify's
 * <v-data-table-virtual>.
 *
 * Renders only the rows in (and near) the viewport, padding the rest with
 * spacer rows so the scrollbar stays accurate. No pagination — scroll through
 * the whole, sorted dataset. Pair `height` with a uniform `item-height`.
 *
 * Extra attributes:
 *   height       - scroll-area height (default 400px)
 *   item-height  - row height in px (default 48)
 *
 * See <w-data-table> for the shared attributes (headers, items, sort, …).
 */
import { wNumberAttr } from './utils.js';
import { WDataTable } from './data-table.js';

export class WDataTableVirtual extends WDataTable {
  static attrs = [...WDataTable.attrs, 'item-height'];

  get itemHeight() { return Math.max(1, wNumberAttr(this, 'item-height', 48)); }
  get height() { return this._attr('height', '400px'); }

  _allRows() { return this._sorted(this._filtered()); }

  _template() {
    const cols = this.columns;
    if (!cols.length) return `<div class="w-table-wrap"><slot></slot></div>`;

    const tableClasses = ['w-table',
      this.striped ? 'w-table--striped' : '',
      this.hover ? '' : 'w-table--no-hover',
      this.density === 'compact' || this.density === 'dense' ? 'w-table--dense' : '',
      this.density === 'comfortable' ? 'w-table--comfortable' : '',
    ].filter(Boolean).join(' ');

    return `<div class="w-data-table w-data-table--virtual">
      <div class="w-table-wrap w-table-wrap--fixed-header" style="height:${this._esc(this.height)};overflow:auto" data-virtual-scroll>
        <table class="${tableClasses}">
          <thead>${this._headHtml(cols, [])}</thead>
          <tbody data-virtual-body></tbody>
        </table>
      </div>
    </div>`;
  }

  _events() {
    const scroller = this.querySelector('[data-virtual-scroll]');
    if (scroller) scroller.addEventListener('scroll', () => this._renderWindow());
    // Header sorting re-sorts and re-windows (via _toggleSort → _rerender).
    this.querySelectorAll('[data-sort]').forEach((btn) =>
      btn.addEventListener('click', () => this._toggleSort(btn.getAttribute('data-sort'))));
    this._renderWindow();
  }

  _renderWindow() {
    const scroller = this.querySelector('[data-virtual-scroll]');
    const tbody = this.querySelector('[data-virtual-body]');
    if (!scroller || !tbody) return;

    const cols = this.columns;
    const rows = this._allRows();
    const rowH = this.itemHeight;
    const viewport = scroller.clientHeight || parseInt(this.height, 10) || 400;
    const overscan = 4;
    const start = Math.max(0, Math.floor(scroller.scrollTop / rowH) - overscan);
    const count = Math.ceil(viewport / rowH) + overscan * 2;
    const end = Math.min(rows.length, start + count);

    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="${cols.length}" class="w-table-message">${this._esc(this.noDataText)}</td></tr>`;
      return;
    }

    let html = '';
    if (start > 0) html += `<tr aria-hidden="true" style="height:${start * rowH}px"><td colspan="${cols.length}"></td></tr>`;
    for (let i = start; i < end; i++) {
      html += `<tr style="height:${rowH}px">`
        + cols.map((col) => `<td style="text-align:${this._align(col)}">${this._esc(this._cell(rows[i], col))}</td>`).join('')
        + `</tr>`;
    }
    if (end < rows.length) html += `<tr aria-hidden="true" style="height:${(rows.length - end) * rowH}px"><td colspan="${cols.length}"></td></tr>`;
    tbody.innerHTML = html;
  }
}

if (!customElements.get('w-data-table-virtual')) customElements.define('w-data-table-virtual', WDataTableVirtual);
