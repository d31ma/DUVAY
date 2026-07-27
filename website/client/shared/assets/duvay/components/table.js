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
 * Slots:
 *   default - a native <table>, or w-row elements containing w-col cells
 *   top     - content rendered above the table (toolbars, filters)
 *   bottom  - content rendered below the table (footers, pagination)
 */

class WTable extends WElement {

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
      <div class="w-table-grid" role="table"><slot></slot></div>
    </div>${bottom}`;
  }

  _events() {
    const table = this.querySelector('table');
    const grid = this._q('.w-table-grid');

    if (table) {
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
      this._labelNativeCells(table);
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
