/* <w-data-table-server> — server-driven data table, mirroring Vuetify's
 * <v-data-table-server>.
 *
 * Identical chrome to <w-data-table>, but it does NOT filter, sort, or paginate
 * locally: `items` is the current page already prepared by the server, and
 * `items-length` is the total row count used for pagination math. When the user
 * changes the page, page size, or sort, it emits `update:options` so the host
 * can fetch the matching slice and update `items` / `items-length`.
 *
 * Extra attributes:
 *   items-length  - total number of server rows (drives the footer)
 *
 * See <w-data-table> for the shared attributes and events.
 */
import { wNumberAttr } from './utils.js';
import { WDataTable } from './data-table.js';

export class WDataTableServer extends WDataTable {
  static attrs = [...WDataTable.attrs, 'items-length'];

  get itemsLength() { return wNumberAttr(this, 'items-length', this.items.length); }

  // The server already filtered, sorted, and paginated — render items as-is.
  _filtered() { return this.items; }
  _sorted(rows) { return rows; }
  _visibleRows() { return this.items; }
  get _total() { return this.itemsLength; }
}

if (!customElements.get('w-data-table-server')) customElements.define('w-data-table-server', WDataTableServer);
