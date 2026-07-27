/* <w-chart> - simple bar chart shell */
import { wNumberList } from './utils.js';

export class WChart extends WElement {
  static attrs = ['title', 'values', 'label'];

  get title() { return this._attr('title', 'Chart'); }
  get values() { return this._attr('values', '[24,42,36,58,50,72]'); }
  get label() { return this._attr('label', this.title); }

  _template() {
    const values = wNumberList(this.values);
    const bars = values.length ? values : [24, 42, 36, 58, 50, 72];
    return `<figure class="w-chart" aria-label="${this._esc(this.label)}">
      <figcaption class="w-chart-title">${this._esc(this.title)}</figcaption>
      <div class="w-chart-bars">
        ${bars.map((value) => `<span class="w-chart-bar" style="--w-chart-value: ${Math.max(0, Math.min(100, value))}%;"></span>`).join('')}
      </div>
      <slot></slot>
    </figure>`;
  }
}

if (!customElements.get('w-chart')) {
  customElements.define('w-chart', WChart);
}
