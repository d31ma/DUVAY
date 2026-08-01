/* <w-heatmap> / <w-heatmap-cell> — accessible categorical heatmap. */

import { wParseRecords, wRecordValue } from './utils.js';
import { wSafeColor } from './file-input.js';

export class WHeatmap extends WElement {
  static attrs = [
    'legend', 'items', 'rounded', 'item-value', 'item-props', 'group-by', 'hover',
    'columns', 'cell-size', 'gap', 'group-gap', 'hide-column-headers',
    'hide-row-headers', 'hover-scale', 'item-row', 'item-column', 'thresholds',
    'empty-color', 'rows',
  ];

  get items() { return this._itemsValue !== undefined ? this._itemsValue : wParseRecords(this.getAttribute('items')); }
  set items(value) { this._itemsValue = Array.isArray(value) ? value : []; this._refresh(); }
  get rows() { return this._rowsValue !== undefined ? this._rowsValue : this._list('rows'); }
  set rows(value) { this._rowsValue = Array.isArray(value) ? value : []; this._refresh(); }
  get columns() { return this._columnsValue !== undefined ? this._columnsValue : this._list('columns'); }
  set columns(value) { this._columnsValue = Array.isArray(value) ? value : []; this._refresh(); }

  _template() {
    const rowKey = this._attr('item-row', 'row');
    const columnKey = this._attr('item-column', 'column');
    const rows = this.rows.length ? this.rows : this._unique(rowKey, 0);
    const columns = this.columns.length ? this.columns : this._unique(columnKey, 1);
    const cells = rows.map((row) => columns.map((column) => this._cell(row, column, rowKey, columnKey)).join('')).join('');
    const columnHeaders = this._bool('hide-column-headers') ? '' : columns.map((column) => `<span class="w-heatmap-column-header">${this._esc(this._label(column))}</span>`).join('');
    const rowHeaders = this._bool('hide-row-headers') ? '' : rows.map((row) => `<span class="w-heatmap-row-header">${this._esc(this._label(row))}</span>`).join('');
    return `<figure class="w-heatmap${this._bool('hover') ? ' w-heatmap--hover' : ''}"${this._style(rows, columns)} aria-label="${this._esc(this._attr('aria-label', 'Heatmap'))}"><div class="w-heatmap-column-headers">${columnHeaders}</div><div class="w-heatmap-row-headers">${rowHeaders}</div><div class="w-heatmap-grid">${cells}</div>${this._legend()}</figure>`;
  }

  _cell(row, column, rowKey, columnKey) {
    const item = this.items.find((candidate) => this._value(candidate, rowKey, 0) === row && this._value(candidate, columnKey, 1) === column);
    const valueKey = this._attr('item-value', 'value');
    const value = item ? Number(this._value(item, valueKey, 2)) : 0;
    const color = item ? this._color(value, item) : wSafeColor(this._attr('empty-color', ''));
    const label = `${this._label(row)}, ${this._label(column)}: ${Number.isFinite(value) ? value : 0}`;
    return `<span class="w-heatmap-cell" role="img" aria-label="${this._esc(label)}"${color ? ` style="--w-heatmap-cell-color:${this._esc(color)}"` : ''}><span class="w-sr-only">${this._esc(label)}</span></span>`;
  }

  _value(item, key, index) { return wRecordValue(item, key, index); }
  _label(value) { return value && typeof value === 'object' ? (value.title ?? value.value ?? '') : String(value ?? ''); }
  _list(name) {
    const raw = this.getAttribute(name);
    if (!raw) return [];
    try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : []; }
    catch { return raw.split(',').map((value) => value.trim()).filter(Boolean); }
  }
  _unique(key, index) { return [...new Set(this.items.map((item) => this._value(item, key, index)))]; }
  _thresholds() {
    if (this._thresholdValue !== undefined) return this._thresholdValue;
    try { const parsed = JSON.parse(this._attr('thresholds', '[]')); return Array.isArray(parsed) ? parsed : []; }
    catch { return []; }
  }
  set thresholds(value) { this._thresholdValue = Array.isArray(value) ? value : []; this._refresh(); }
  _color(value, item) {
    const direct = wSafeColor(item?.color || '');
    if (direct) return direct;
    const threshold = this._thresholds().filter((entry) => value >= Number(entry.min)).at(-1);
    return wSafeColor(threshold?.color || '') || 'var(--w-primary)';
  }
  _style(rows, columns) {
    const size = this._size(this._attr('cell-size', ''));
    const gap = this._size(this._attr('gap', ''));
    const scale = Number(this._attr('hover-scale', ''));
    const styles = [`--w-heatmap-columns:${Math.max(columns.length, 1)}`, `--w-heatmap-rows:${Math.max(rows.length, 1)}`];
    if (size) styles.push(`--w-heatmap-cell-size:${size}`);
    if (gap) styles.push(`--w-heatmap-gap:${gap}`);
    if (Number.isFinite(scale) && scale > 0) styles.push(`--w-heatmap-hover-scale:${scale}`);
    return ` style="${styles.join(';')}"`;
  }
  _size(value) { const raw = String(value || '').split(',')[0].trim(); return /^\d+(?:\.\d+)?$/.test(raw) ? `${raw}px` : /^\d+(?:\.\d+)?(?:px|rem|em)$/.test(raw) ? raw : ''; }
  _legend() {
    if (!this.hasAttribute('legend') || this.getAttribute('legend') === 'false') return '';
    const entries = this._thresholds().map((entry) => `<span><i style="--w-heatmap-cell-color:${this._esc(this._color(Number(entry.min), entry))}"></i>${this._esc(entry.label ?? entry.min)}</span>`).join('');
    return `<figcaption class="w-heatmap-legend">${entries || '<slot name="legend"></slot>'}</figcaption>`;
  }
  _refresh() { if (this._rendered) this._render(); }
}

export class WHeatmapCell extends WElement {
  static attrs = ['disabled', 'height', 'width', 'item', 'cell-props', 'y', 'x'];
  get item() { if (this._itemValue !== undefined) return this._itemValue; try { return JSON.parse(this._attr('item', '{}')); } catch { return {}; } }
  set item(value) { this._itemValue = value && typeof value === 'object' ? value : {}; this._refresh(); }
  _template() {
    const item = this.item;
    const color = wSafeColor(item.color || '') || 'var(--w-primary)';
    const label = item.title || `${item.row ?? this._attr('y', '')}, ${item.column ?? this._attr('x', '')}: ${item.value ?? ''}`;
    return `<span class="w-heatmap-cell${this._bool('disabled') ? ' w-heatmap-cell--disabled' : ''}" role="img" aria-label="${this._esc(label)}" style="--w-heatmap-cell-color:${this._esc(color)}"><slot></slot></span>`;
  }
  _refresh() { if (this._rendered) this._render(); }
}

if (!customElements.get('w-heatmap')) customElements.define('w-heatmap', WHeatmap);
if (!customElements.get('w-heatmap-cell')) customElements.define('w-heatmap-cell', WHeatmapCell);
