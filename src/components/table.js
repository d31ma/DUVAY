/* <w-table> — Table wrapper web component (DuVay equivalent of Vuetify v-table)
 *
 * Attributes:
 *   density      - compact | comfortable (omit for default)
 *   striped      - odd | even (bare attribute = even)
 *   hover        - enables row hover state
 *   gridlines    - horizontal (default) | vertical | all | none — native <table> only
 *   fixed-header - keeps the header visible within the scroll area
 *   fixed-footer - keeps a <tfoot> visible within the scroll area
 *   height       - max-height for fixed-header/footer tables (e.g. "320px")
 *   grid         - forces DuVay row / col presentation
 *   responsive   - auto | stack | scroll (default: auto)
 *
 * Semantics:
 *   A native <table> keeps its own table semantics and the wrapper has no
 *   role. A w-row / w-col grid gets role="table", "row", "columnheader" and
 *   "cell". Either way there is exactly one table in the accessibility tree.
 *
 * Slots:
 *   default - a native <table>, or w-row elements containing w-col cells
 *   top     - content rendered above the table (toolbars, filters)
 *   bottom  - content rendered below the table (footers, pagination)
 */

class WTable extends WElement {

  static ROW = 'w-row, .w-grid-row';
  static HEADER_ROW = 'w-row[header], .w-grid-row[header], .w-table-header';
  static CELL = 'w-col, .w-grid-col, [class*="w-grid-col-"]';

  static attrs = [
    'density', 'striped', 'hover', 'gridlines', 'grid', 'responsive',
    'fixed-header', 'fixed-footer', 'height',
  ];

  get density() { return this._attr('density', ''); }
  get striped() {
    const value = this._attr('striped', null);
    if (value === null) return '';
    return value === 'odd' ? 'odd' : 'even';
  }
  get hover() { return this._bool('hover'); }
  get grid() { return this._bool('grid'); }
  get gridlines() {
    const value = this._attr('gridlines', 'horizontal');
    if (['horizontal', 'vertical', 'all', 'none'].includes(value)) return value;
    return value === '' ? 'all' : 'horizontal';
  }
  get responsive() {
    const value = this._attr('responsive', 'auto');
    return ['auto', 'stack', 'scroll'].includes(value) ? value : 'auto';
  }
  get fixedHeader() { return this._bool('fixed-header'); }
  get fixedFooter() { return this._bool('fixed-footer'); }
  get height() { return this._attr('height', ''); }

  _hasSlotted(name) { return !!this.querySelector('[slot="' + name + '"]'); }

  _template() {
    const wrap = ['w-table-wrap', 'w-table-wrap--responsive-' + this.responsive];
    if (this.fixedHeader) wrap.push('w-table-wrap--fixed-header');
    if (this.fixedFooter) wrap.push('w-table-wrap--fixed-footer');
    const style = this.height ? ` style="max-height: ${this._esc(this.height)};"` : '';
    const top = this._hasSlotted('top') ? '<div class="w-table-top"><slot name="top"></slot></div>' : '';
    const bottom = this._hasSlotted('bottom') ? '<div class="w-table-bottom"><slot name="bottom"></slot></div>' : '';

    return `${top}<div class="${wrap.join(' ')}"${style}>
      <div class="w-table-grid"${this._gridRole()}><slot></slot></div>
    </div>${bottom}`;
  }

  // A native <table> already carries table semantics, so the wrapper stays a
  // plain element; only the w-row / w-col grid needs role="table".
  _gridRole() {
    return this.querySelector('table') ? '' : ' role="table"';
  }

  _events() {
    const table = this.querySelector('table');
    const grid = this._q('.w-table-grid');

    if (table) {
      grid?.removeAttribute('role');
      table.classList.add('w-table');
      table.classList.remove('w-table--responsive-auto', 'w-table--responsive-stack');
      if (this.responsive !== 'scroll') table.classList.add('w-table--responsive-' + this.responsive);
      table.classList.remove('w-table--striped', 'w-table--striped-odd');
      if (this.striped === 'even') table.classList.add('w-table--striped');
      else if (this.striped === 'odd') table.classList.add('w-table--striped-odd');
      ['horizontal', 'vertical', 'all', 'none'].forEach((line) => {
        table.classList.toggle('w-table--gridlines-' + line, this.gridlines === line);
      });
      table.classList.toggle('w-table--no-hover', !this.hover);
      ['dense', 'comfortable'].forEach((density) => {
        table.classList.toggle('w-table--' + density, this.density === density || (density === 'dense' && this.density === 'compact'));
      });
      this._labelCells();
      return;
    }

    if (!grid) return;
    grid.classList.remove('w-table-grid--responsive-auto', 'w-table-grid--responsive-stack');
    if (this.responsive !== 'scroll') grid.classList.add('w-table-grid--responsive-' + this.responsive);
    grid.classList.remove('w-table-grid--striped', 'w-table-grid--striped-odd');
    if (this.striped === 'even') grid.classList.add('w-table-grid--striped');
    else if (this.striped === 'odd') grid.classList.add('w-table-grid--striped-odd');
    grid.classList.toggle('w-table-grid--no-hover', !this.hover);
    grid.classList.toggle('w-table-grid--dense', this.density === 'compact' || this.density === 'dense');
    grid.classList.toggle('w-table-grid--comfortable', this.density === 'comfortable');

    this.querySelectorAll(WTable.ROW).forEach((row) => this._decorateGridRow(row));
    this._labelCells();
  }

  connectedCallback() {
    super.connectedCallback();
    // A re-attached table skips the render, so label rows that changed while
    // it was detached and watch for new ones again.
    if (this._rendered) this._labelCells();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this._unwatchCells();
  }

  // Labels every body cell, then watches the table for rows added later (live
  // updates) and for header text changes.
  _labelCells() {
    const table = this.querySelector('table');
    const grid = this._q('.w-table-grid');
    if (table) this._labelNativeCells(table);
    else if (grid) this._labelGridCells(grid);
    this._watchCells(grid);
  }

  _watchCells(grid) {
    this._unwatchCells();
    if (!grid || typeof MutationObserver !== 'function') return;
    this._cellObserver = new MutationObserver((records) => this._onCellsChanged(records));
    this._cellObserver.observe(grid, { childList: true, subtree: true, characterData: true });
  }

  _unwatchCells() {
    if (!this._cellObserver) return;
    this._cellObserver.disconnect();
    this._cellObserver = null;
  }

  _onCellsChanged(records) {
    const table = this.querySelector('table');
    const header = table ? 'thead' : WTable.HEADER_ROW;
    if (records.some((record) => this._touchesHeader(record, header))) {
      this._labelCells();
      return;
    }
    const rows = new Set();
    records.forEach((record) => record.addedNodes.forEach((node) => this._rowsOf(node, table).forEach((row) => rows.add(row))));
    if (table) rows.forEach((row) => this._labelNativeRow(row, this._nativeLabels(table)));
    else this._labelNewGridRows(rows);
  }

  _touchesHeader(record, header) {
    const target = this._elementOf(record.target);
    if (target && target.closest(header)) return true;
    return [...record.addedNodes, ...record.removedNodes].some((node) => (
      node.nodeType === Node.ELEMENT_NODE && (node.matches(header) || !!node.querySelector(header))
    ));
  }

  _elementOf(node) {
    return node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  }

  // The body rows an added node belongs to or contains.
  _rowsOf(node, table) {
    if (node.nodeType !== Node.ELEMENT_NODE) return [];
    const selector = table ? 'tr' : WTable.ROW;
    const row = node.closest(selector);
    const rows = row ? [row] : Array.from(node.querySelectorAll(selector));
    return rows.filter((candidate) => (table ? this._isNativeBodyRow(candidate, table) : this._isGridRow(candidate)));
  }

  _isNativeBodyRow(row, table) {
    return !!row.parentElement && row.parentElement.tagName === 'TBODY' && row.closest('table') === table;
  }

  _isGridRow(row) {
    return !!row.parentElement && row.parentElement.closest(WTable.ROW + ', w-table') === this;
  }

  _decorateGridRow(row) {
    row.setAttribute('role', 'row');
    if (row.hasAttribute('header')) row.classList.add('w-table-header');
    row.querySelectorAll(WTable.CELL).forEach((cell) => {
      const owner = cell.closest(WTable.ROW);
      cell.setAttribute('role', owner && (owner.classList.contains('w-table-header') || owner.hasAttribute('header')) ? 'columnheader' : 'cell');
    });
  }

  _labelNewGridRows(rows) {
    const labels = this._gridLabels(this._gridRows(this._q('.w-table-grid')));
    rows.forEach((row) => {
      this._decorateGridRow(row);
      if (labels.length && !this._isHeaderRow(row)) this._labelRow(this._gridCells(row), labels);
    });
  }

  _nativeLabels(table) {
    return Array.from(table.querySelectorAll('thead th')).map((cell) => cell.textContent.trim());
  }

  _labelNativeCells(table) {
    const labels = this._nativeLabels(table);
    if (!labels.length) return;
    table.querySelectorAll('tbody tr').forEach((row) => this._labelNativeRow(row, labels));
  }

  _labelNativeRow(row, labels) {
    if (labels.length) this._labelRow(Array.from(row.cells), labels);
  }

  _gridRows(grid) {
    if (!grid) return [];
    return this._children(grid).filter((row) => row.matches(WTable.ROW));
  }

  _gridLabels(rows) {
    const header = rows.find((row) => this._isHeaderRow(row));
    return header ? this._gridCells(header).map((cell) => cell.textContent.trim()) : [];
  }

  _isHeaderRow(row) {
    return row.hasAttribute('header') || row.classList.contains('w-table-header');
  }

  // A rendered w-row keeps its cells inside its own <slot>.
  _gridCells(row) {
    return this._children(row);
  }

  _children(element) {
    const slot = element.querySelector(':scope > slot');
    return Array.from(slot ? slot.children : element.children);
  }

  _labelGridCells(grid) {
    const rows = this._gridRows(grid);
    const labels = this._gridLabels(rows);
    if (!labels.length) return;
    rows.filter((row) => !this._isHeaderRow(row)).forEach((row) => this._labelRow(this._gridCells(row), labels));
  }

  _labelRow(cells, labels) {
    cells.forEach((cell, index) => this._labelCell(cell, labels[index] || ''));
  }

  // An author-set data-label always wins. A label this component set is
  // remembered on the cell, so it follows later header text changes.
  _labelCell(cell, label) {
    const current = cell.getAttribute('data-label');
    if (current !== null && current !== cell._wTableLabel) return;
    if (label) cell.setAttribute('data-label', label);
    else cell.removeAttribute('data-label');
    cell._wTableLabel = label;
  }
}

customElements.define('w-table', WTable);
