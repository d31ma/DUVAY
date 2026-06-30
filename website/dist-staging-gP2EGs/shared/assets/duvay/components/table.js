/* <w-table> — Grid table wrapper web component
 *
 * Attributes:
 *   density      - compact | comfortable (omit for default)
 *   striped      - applies alternating row backgrounds
 *   hover        - enables row hover state
 *   grid         - forces DuVay row / col presentation
 *   responsive   - auto | stack | scroll (default: auto)
 *   fixed-header - keeps the header visible within the scroll area
 *   height       - max-height for fixed-header tables (e.g. "320px")
 *
 * Slots:
 *   default - w-row elements containing w-col cells
 */

class WTable extends WElement {

  static attrs = ['density', 'striped', 'hover', 'grid', 'responsive', 'fixed-header', 'height'];

  get density() { return this._attr('density', ''); }
  get striped() { return this._bool('striped'); }
  get hover() { return this._bool('hover'); }
  get grid() { return this._bool('grid'); }
  get responsive() {
    const value = this._attr('responsive', 'auto');
    return ['auto', 'stack', 'scroll'].includes(value) ? value : 'auto';
  }
  get fixedHeader() { return this._bool('fixed-header'); }
  get height() { return this._attr('height', ''); }

  _template() {
    const fixedClass = this.fixedHeader ? ' w-table-wrap--fixed-header' : '';
    const style = this.height ? ` style="max-height: ${this._esc(this.height)};"` : '';

    return `<div class="w-table-wrap w-table-wrap--responsive-${this.responsive}${fixedClass}"${style}>
      <div class="w-table-grid" role="table"><slot></slot></div>
    </div>`;
  }

  _events() {
    const table = this.querySelector('table');
    const grid = this._q('.w-table-grid');

    if (table) {
      table.classList.add('w-table');
      table.classList.remove('w-table--responsive-auto', 'w-table--responsive-stack');
      if (this.responsive !== 'scroll') table.classList.add('w-table--responsive-' + this.responsive);
      table.classList.toggle('w-table--striped', this.striped);
      table.classList.toggle('w-table--no-hover', !this.hover);
      ['dense', 'comfortable'].forEach((density) => {
        table.classList.toggle('w-table--' + density, this.density === density || (density === 'dense' && this.density === 'compact'));
      });
      this._labelNativeCells(table);
      return;
    }

    if (!grid) return;
    grid.classList.remove('w-table-grid--responsive-auto', 'w-table-grid--responsive-stack');
    if (this.responsive !== 'scroll') grid.classList.add('w-table-grid--responsive-' + this.responsive);
    grid.classList.toggle('w-table-grid--striped', this.striped);
    grid.classList.toggle('w-table-grid--no-hover', !this.hover);
    grid.classList.toggle('w-table-grid--dense', this.density === 'compact' || this.density === 'dense');
    grid.classList.toggle('w-table-grid--comfortable', this.density === 'comfortable');

    this.querySelectorAll('w-row, .w-grid-row').forEach((row) => {
      row.setAttribute('role', 'row');
      if (row.hasAttribute('header')) row.classList.add('w-table-header');
    });

    this.querySelectorAll('w-col, .w-grid-col, [class*="w-grid-col-"]').forEach((cell) => {
      const row = cell.closest('w-row, .w-grid-row');
      cell.setAttribute('role', row && (row.classList.contains('w-table-header') || row.hasAttribute('header')) ? 'columnheader' : 'cell');
    });
    this._labelGridCells(grid);
  }

  _labelNativeCells(table) {
    const labels = Array.from(table.querySelectorAll('thead th')).map((cell) => cell.textContent.trim());
    if (!labels.length) return;
    table.querySelectorAll('tbody tr').forEach((row) => {
      Array.from(row.cells).forEach((cell, index) => {
        if (!cell.hasAttribute('data-label') && labels[index]) cell.setAttribute('data-label', labels[index]);
      });
    });
  }

  _labelGridCells(grid) {
    const slot = grid.querySelector(':scope > slot');
    const rows = Array.from(slot ? slot.children : grid.children)
      .filter((row) => row.matches('w-row, .w-grid-row'));
    const header = rows.find((row) => row.hasAttribute('header') || row.classList.contains('w-table-header'));
    if (!header) return;

    const labels = Array.from(header.children).map((cell) => cell.textContent.trim());
    rows.filter((row) => row !== header).forEach((row) => {
      Array.from(row.children).forEach((cell, index) => {
        if (!cell.hasAttribute('data-label') && labels[index]) cell.setAttribute('data-label', labels[index]);
      });
    });
  }
}

customElements.define('w-table', WTable);
