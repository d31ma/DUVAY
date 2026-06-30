/* <w-sparkline> — DuVay component module */
import { wBoolAttr, wNumberList } from './utils.js';

export class WSparkline extends WElement {
  static attrs = ['values', 'type', 'fill', 'label'];
  get values() { return wNumberList(this._attr('values', '')); }
  get type() { return this._attr('type', 'line'); }
  get fill() { return wBoolAttr(this, 'fill'); }
  get label() { return this._attr('label', 'Sparkline'); }
  _template() {
    const values = this.values.length ? this.values : [3, 6, 4, 8, 5, 9];
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (this.type === 'bar') {
      return `<svg class="w-sparkline w-sparkline--bar" viewBox="0 0 100 40" role="img" aria-label="${this._esc(this.label)}">
        ${values.map((v, i) => {
          const width = 100 / values.length;
          const height = (((v - min) / Math.max(1, max - min)) * 30 + 4);
          return `<rect x="${(i * width + 1).toFixed(1)}" y="${(38 - height).toFixed(1)}" width="${Math.max(2, width - 2).toFixed(1)}" height="${height.toFixed(1)}"></rect>`;
        }).join('')}
      </svg>`;
    }
    const points = values.map((v, i) => {
      const x = values.length === 1 ? 50 : (i / (values.length - 1)) * 100;
      const y = 36 - (((v - min) / Math.max(1, max - min)) * 30 + 3);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const area = this.fill ? `<polygon points="0,40 ${points.join(' ')} 100,40"></polygon>` : '';
    return `<svg class="w-sparkline${this.fill ? ' w-sparkline--fill' : ''}" viewBox="0 0 100 40" role="img" aria-label="${this._esc(this.label)}">${area}<polyline points="${points.join(' ')}"></polyline></svg>`;
  }
}

if (!customElements.get('w-sparkline')) customElements.define('w-sparkline', WSparkline);
