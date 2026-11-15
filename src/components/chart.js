/* <w-chart> - simple bar chart shell
 *
 * Attributes:
 *   title   - caption shown above the bars (default "Chart")
 *   values  - comma list / JSON array of numbers from 0 to 100. Also a
 *             property: `el.values = [24, 42, 36]`. The property wins over the
 *             attribute; set it to null to use the attribute again. Items that
 *             are not numbers are ignored with a warning, and an empty array
 *             draws no bars.
 *   label   - accessible label (defaults to the title)
 */
import { wNumberList, wNumberProperty } from './utils.js';

const SAMPLE_VALUES = [24, 42, 36, 58, 50, 72];

export class WChart extends WElement {
  static attrs = ['title', 'values', 'label'];

  get title() { return this._attr('title', 'Chart'); }
  get values() { return wNumberList(this._dataAttr('values', '')); }
  set values(value) { this._setData('values', wNumberProperty(this, 'values', value)); }
  get label() { return this._attr('label', this.title); }

  // Sample bars show only when no values were given at all. Data given as a
  // property is drawn as it is, so an empty array draws no bars.
  _bars() {
    const values = this.values;
    if (values.length || this._hasDataProperty('values')) return values;
    return SAMPLE_VALUES;
  }

  _template() {
    const bars = this._bars();
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
