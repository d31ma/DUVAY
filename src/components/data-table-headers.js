/* <w-data-table-headers> — Data table header row */
import { wValueList } from './utils.js';
import './grid.js';

export class WDataTableHeaders extends WElement {
  static attrs = ['headers', 'sort-by', 'sort-desc'];

  get headers() { return wValueList(this._attr('headers', '')); }
  get sortBy() { return this._attr('sort-by', ''); }
  get sortDesc() { return this._bool('sort-desc'); }

  _template() {
    if (!this.headers.length) return `<w-row header no-gutters class="w-table-header"><slot></slot></w-row>`;
    const cols = Math.max(1, Math.floor(12 / this.headers.length));
    return `<w-row header no-gutters class="w-table-header">
      ${this.headers.map((header) => `<w-col cols="${cols}" role="columnheader"><button class="w-table-sort" type="button" data-sort="${this._esc(header)}">${this._esc(header)}${this.sortBy === header ? `<span aria-hidden="true">${this.sortDesc ? ' ↓' : ' ↑'}</span>` : ''}</button></w-col>`).join('')}
    </w-row>`;
  }

  _events() {
    this.querySelectorAll('[data-sort]').forEach((button) => {
      button.addEventListener('click', () => {
        const sortBy = button.getAttribute('data-sort');
        const sortDesc = this.sortBy === sortBy ? !this.sortDesc : false;
        this._silentSet('sort-by', sortBy);
        this._silentSet('sort-desc', sortDesc ? 'true' : null);
        this._render();
        this._events();
        this._emit('change', { sortBy, sortDesc });
      });
    });
  }
}

if (!customElements.get('w-data-table-headers')) {
  customElements.define('w-data-table-headers', WDataTableHeaders);
}
