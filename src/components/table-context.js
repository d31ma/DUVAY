/* WTableContext — gives the w-data-table parts a table to sit in (DUVAY-9).
 *
 * `w-data-table-headers`, `w-data-table-rows` and `w-data-table-row` render
 * role="row" w-row elements, and ARIA requires a row to be owned by a table.
 * Inside a `<table>`, a w-table grid or any element with a table role nothing
 * changes. Otherwise the nearest `.w-table-grid` (the CSS-class grid the parts
 * are documented in) becomes the table, or the part itself when there is none.
 * A row inside `w-data-table-rows` leaves this to the rows element.
 */

export class WTableContext {
  static OWNERS = '[role="table"], [role="grid"], [role="treegrid"], table, w-data-table-rows';

  static GRID = '.w-table-grid';

  static ensure(host) {
    if (WTableContext.hasOwner(host)) return;
    WTableContext.tableFor(host).setAttribute('role', 'table');
  }

  static hasOwner(host) {
    return !!host.parentElement?.closest(WTableContext.OWNERS);
  }

  static tableFor(host) {
    return host.closest(WTableContext.GRID) || host;
  }
}
