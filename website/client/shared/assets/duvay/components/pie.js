/* <w-pie>, <w-pie-segment>, and <w-pie-tooltip> — zero-dependency pie chart. */

import { wParseRecords, wRecordValue } from './utils.js';
import { wSafeColor } from './file-input.js';

const PIE_COLORS = ['var(--w-primary)', 'var(--w-secondary)', 'var(--w-tertiary)', 'var(--w-success)', 'var(--w-warning)', 'var(--w-error)'];

export class WPie extends WElement {
  static attrs = [
    'title', 'density', 'rounded', 'size', 'gap', 'items', 'bg-color', 'legend',
    'tooltip', 'item-title', 'item-value', 'palette', 'item-key', 'rotate',
    'gauge-cut', 'inner-cut', 'hover-scale', 'animation', 'hide-slice', 'reveal',
  ];

  get items() { return this._itemsValue !== undefined ? this._itemsValue : wParseRecords(this.getAttribute('items')); }
  set items(value) { this._itemsValue = Array.isArray(value) ? value : []; this._refresh(); }
  get palette() {
    if (this._paletteValue !== undefined) return this._paletteValue;
    try { const value = JSON.parse(this._attr('palette', '[]')); return Array.isArray(value) ? value : []; }
    catch { return []; }
  }
  set palette(value) { this._paletteValue = Array.isArray(value) ? value : []; this._refresh(); }

  _template() {
    const entries = this._entries();
    const total = entries.reduce((sum, item) => sum + item.value, 0);
    let cursor = Number(this._attr('rotate', '-90')) || -90;
    const stops = [];
    entries.forEach((entry) => {
      const extent = total > 0 ? entry.value / total * 360 : 0;
      stops.push(`${entry.color} ${cursor}deg ${cursor + extent}deg`);
      entry.start = cursor;
      entry.end = cursor + extent;
      cursor += extent;
    });
    const title = this._attr('title', 'Pie chart');
    const chartStyle = this._chartStyle(stops);
    const labels = entries.map((entry) => `<li><i style="--w-pie-color:${this._esc(entry.color)}"></i><span>${this._esc(entry.title)}</span><strong>${entry.value}</strong></li>`).join('');
    const legend = this.hasAttribute('legend') && this.getAttribute('legend') !== 'false' ? `<figcaption><ul class="w-pie-legend">${labels}</ul></figcaption>` : '';
    const accessible = entries.map((entry) => `${entry.title}: ${entry.value}`).join(', ');
    return `<figure class="w-pie" aria-label="${this._esc(`${title}. ${accessible}`)}"><div class="w-pie-chart" role="img"${chartStyle}><span class="w-pie-center"><slot></slot></span></div>${legend}</figure>`;
  }

  _entries() {
    const titleKey = this._attr('item-title', 'title');
    const valueKey = this._attr('item-value', 'value');
    return this.items.map((item, index) => {
      const raw = item && typeof item === 'object' ? item : { title: String(item), value: 1 };
      const value = Math.max(0, Number(wRecordValue(raw, valueKey, 1)) || 0);
      const palette = this.palette[index % Math.max(this.palette.length, 1)];
      const paletteColor = palette && typeof palette === 'object' ? palette.color : palette;
      const color = wSafeColor(raw.color || paletteColor || '') || PIE_COLORS[index % PIE_COLORS.length];
      return { raw, value, color, title: String(wRecordValue(raw, titleKey, 0) || `Item ${index + 1}`) };
    });
  }

  _chartStyle(stops) {
    const styles = [`--w-pie-fill:conic-gradient(from 0deg,${stops.join(',') || 'var(--w-surface-container-high) 0deg 360deg'})`];
    const size = this._size(this._attr('size', ''));
    const cut = this._percent(this._attr('inner-cut', this._attr('gauge-cut', '')));
    const scale = Number(this._attr('hover-scale', ''));
    if (size) styles.push(`--w-pie-size:${size}`);
    if (cut) styles.push(`--w-pie-inner-cut:${cut}`);
    if (Number.isFinite(scale) && scale > 0) styles.push(`--w-pie-hover-scale:${scale}`);
    return ` style="${this._esc(styles.join(';'))}"`;
  }
  _size(value) { const raw = String(value || '').trim(); return /^\d+(?:\.\d+)?$/.test(raw) ? `${raw}px` : /^\d+(?:\.\d+)?(?:px|rem|em)$/.test(raw) ? raw : ''; }
  _percent(value) { const number = Number(value); return Number.isFinite(number) && number >= 0 && number < 100 ? `${number}%` : ''; }
  _refresh() { if (this._rendered) this._render(); }
}

export class WPieSegment extends WElement {
  static attrs = ['rounded', 'color', 'pattern', 'value', 'active', 'gap', 'rotate', 'inner-cut', 'hover-scale', 'animation', 'hide-slice', 'reveal'];
  _template() {
    const value = Math.min(100, Math.max(0, Number(this._attr('value', '0')) || 0));
    const color = wSafeColor(this._attr('color', '')) || 'var(--w-primary)';
    const rotate = Number(this._attr('rotate', '-90')) || -90;
    const styles = `--w-pie-fill:conic-gradient(${color} ${rotate}deg ${rotate + value * 3.6}deg,var(--w-surface-container-high) 0);`;
    return `<span class="w-pie-chart w-pie-segment${this._bool('active') ? ' w-pie-segment--active' : ''}${this._bool('hide-slice') ? ' w-pie-segment--hidden' : ''}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}" style="${this._esc(styles)}"><slot></slot></span>`;
  }
}

export class WPieTooltip extends WElement {
  static attrs = ['model-value', 'transition', 'item', 'target', 'offset', 'title-format', 'subtitle-format'];
  get item() { if (this._itemValue !== undefined) return this._itemValue; try { return JSON.parse(this._attr('item', '{}')); } catch { return {}; } }
  set item(value) { this._itemValue = value && typeof value === 'object' ? value : {}; this._refresh(); }
  _template() {
    const item = this.item;
    const visible = this.hasAttribute('model-value') && this.getAttribute('model-value') !== 'false';
    return `<div class="w-pie-tooltip" role="tooltip"${visible ? '' : ' hidden'}><strong>${this._esc(item.title ?? '')}</strong><span>${this._esc(item.value ?? '')}</span><slot></slot></div>`;
  }
  _refresh() { if (this._rendered) this._render(); }
}

if (!customElements.get('w-pie')) customElements.define('w-pie', WPie);
if (!customElements.get('w-pie-segment')) customElements.define('w-pie-segment', WPieSegment);
if (!customElements.get('w-pie-tooltip')) customElements.define('w-pie-tooltip', WPieTooltip);
