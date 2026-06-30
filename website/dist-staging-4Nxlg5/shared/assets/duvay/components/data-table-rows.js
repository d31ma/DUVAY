/* <w-data-table-rows> — Data table body rows */
import { wParseRecords, wValueList } from './utils.js';
import './data-table-row.js';

export class WDataTableRows extends WElement {
  static attrs = ['headers', 'items'];

  get headers() { return wValueList(this._attr('headers', '')); }
  get items() { return wParseRecords(this._attr('items', ''), this.headers); }

  _template() {
    if (!this.items.length || !this.headers.length) return `<div class="w-data-table-rows"><slot></slot></div>`;
    return `<div class="w-data-table-rows">
      ${this.items.map((item) => `<w-data-table-row headers="${this._esc(JSON.stringify(this.headers))}" item="${this._esc(JSON.stringify(item))}"></w-data-table-row>`).join('')}
    </div>`;
  }
}

if (!customElements.get('w-data-table-rows')) {
  customElements.define('w-data-table-rows', WDataTableRows);
}
