/* <w-data-table-row> — Data table body row */
import { wFields, wRecordValue, wValueList } from './utils.js';
import './grid.js';

export class WDataTableRow extends WElement {
  static attrs = ['headers', 'item', 'active'];

  get headers() { return wValueList(this._attr('headers', '')); }
  get item() {
    const raw = this._attr('item', '');
    if (!raw) return [];
    if (raw.trim().startsWith('[')) {
      try { return JSON.parse(raw); } catch {
        const text = raw.trim();
        return text.endsWith(']') ? wFields(text.slice(1, -1).replaceAll(',', '|')) : [];
      }
    }
    if (raw.trim().startsWith('{')) {
      try { return JSON.parse(raw); } catch { return {}; }
    }
    return wFields(raw);
  }
  get active() { return this._bool('active'); }

  _template() {
    if (!this.headers.length) return `<w-row no-gutters class="${this.active ? 'selected' : ''}"><slot></slot></w-row>`;
    const cols = Math.max(1, Math.floor(12 / this.headers.length));
    return `<w-row no-gutters class="${this.active ? 'selected' : ''}">
      ${this.headers.map((header, index) => `<w-col cols="${cols}" role="cell">${this._esc(wRecordValue(this.item, header, index))}</w-col>`).join('')}
    </w-row>`;
  }
}

if (!customElements.get('w-data-table-row')) {
  customElements.define('w-data-table-row', WDataTableRow);
}
