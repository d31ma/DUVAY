/* <w-sparkline> — inline trend/bar chart, mirroring Vuetify's <v-sparkline>.
 *
 * Attributes:
 *   values              - comma list / JSON array of numbers
 *   type                - "trend" (line, default) | "bar"
 *   fill                - fill the area under a trend line
 *   smooth              - round trend corners (boolean, or a number for tension)
 *   color               - token name or CSS color for the stroke / bars
 *   gradient            - comma list of colors for a gradient (overrides color)
 *   gradient-direction  - "left" (default) | "right" | "top" | "bottom"
 *   line-width          - trend stroke width / bar corner thickness (default 4)
 *   padding             - inset around the plot in viewBox units (default 4)
 *   min, max            - clamp the value range (defaults to data extent)
 *   labels              - comma list of labels drawn under each point/bar
 *   show-labels         - draw the values themselves as labels
 *   label-size          - label font size in viewBox units (default 6)
 *   auto-draw           - animate the trend drawing on load
 *   auto-draw-duration  - animation duration in ms (default 1000)
 *   label               - accessible label (aria-label)
 */
import { wBoolAttr, wNumberList } from './utils.js';

let sparkUid = 0;

export class WSparkline extends WElement {
  static attrs = ['values', 'type', 'fill', 'smooth', 'color', 'gradient', 'gradient-direction',
    'line-width', 'padding', 'min', 'max', 'labels', 'show-labels', 'label-size',
    'auto-draw', 'auto-draw-duration', 'label'];

  get values() { return wNumberList(this._attr('values', '')); }
  get type() { return this._attr('type', 'trend'); }
  get isBar() { return this.type === 'bar'; }
  get fill() { return wBoolAttr(this, 'fill'); }
  get smooth() {
    if (!this.hasAttribute('smooth')) return 0;
    const n = parseFloat(this._attr('smooth', ''));
    return Number.isFinite(n) ? n : 8;
  }
  get color() { return this._attr('color', ''); }
  get gradient() { return this._attr('gradient', '').split(',').map((c) => c.trim()).filter(Boolean); }
  get gradientDirection() { return this._attr('gradient-direction', 'left'); }
  get lineWidth() { const n = parseFloat(this._attr('line-width', '')); return Number.isFinite(n) ? n : 4; }
  get padding() { const n = parseFloat(this._attr('padding', '')); return Number.isFinite(n) ? n : 4; }
  get labels() { return this._attr('labels', '').split(',').map((l) => l.trim()).filter(Boolean); }
  get showLabels() { return wBoolAttr(this, 'show-labels'); }
  get labelSize() { const n = parseFloat(this._attr('label-size', '')); return Number.isFinite(n) ? n : 6; }
  get autoDraw() { return wBoolAttr(this, 'auto-draw'); }
  get autoDrawDuration() { const n = parseFloat(this._attr('auto-draw-duration', '')); return Number.isFinite(n) ? n : 1000; }
  get label() { return this._attr('label', 'Sparkline'); }

  // token / named color / hex / rgb() → a usable CSS colour, preferring a token.
  _color(c) {
    c = String(c).trim();
    return /^[a-z][a-z0-9-]*$/i.test(c) ? `var(--w-${c}, ${c})` : c;
  }

  _template() {
    const values = this.values.length ? this.values : [3, 6, 4, 8, 5, 9];
    const pad = this.padding;
    const W = 100;
    const labelList = this.showLabels ? values.map((v) => String(v)) : this.labels;
    const labelH = labelList.length ? this.labelSize + 4 : 0;
    const chartH = 40;
    const H = chartH + labelH;

    const min = Number.isFinite(parseFloat(this._attr('min', ''))) ? parseFloat(this._attr('min', '')) : Math.min(...values);
    const max = Number.isFinite(parseFloat(this._attr('max', ''))) ? parseFloat(this._attr('max', '')) : Math.max(...values);
    const range = (max - min) || 1;

    const uid = this._uid || (this._uid = `w-spark-${++sparkUid}`);
    const stroke = this.gradient.length ? `url(#${uid})` : (this.color ? this._color(this.color) : 'var(--w-primary)');
    const defs = this.gradient.length ? this._gradientDefs(uid) : '';

    const aria = ` role="img" aria-label="${this._esc(this.label)}"`;
    const cls = `w-sparkline w-sparkline--${this.isBar ? 'bar' : 'trend'}${this.fill ? ' w-sparkline--fill' : ''}${this.autoDraw && !this.isBar ? ' w-sparkline--auto-draw' : ''}`;
    const style = ` style="--w-sparkline-color:${stroke};--w-sparkline-width:${this.lineWidth};--w-sparkline-draw-duration:${this.autoDrawDuration}ms"`;

    const body = this.isBar
      ? this._barBody(values, min, range, pad, W, chartH)
      : this._trendBody(values, min, range, pad, W, chartH);

    const labelsSvg = labelList.length ? this._labelsSvg(values, labelList, pad, W, H) : '';

    return `<svg class="${cls}" viewBox="0 0 ${W} ${H}"${aria}${style}>${defs}${body}${labelsSvg}</svg>`;
  }

  _x(i, n, pad, W) { return n === 1 ? W / 2 : (i / (n - 1)) * (W - pad * 2) + pad; }
  _y(v, min, range, pad, chartH) { return chartH - pad - ((v - min) / range) * (chartH - pad * 2); }

  _trendBody(values, min, range, pad, W, chartH) {
    const pts = values.map((v, i) => ({ x: this._x(i, values.length, pad, W), y: this._y(v, min, range, pad, chartH) }));
    const d = this.smooth ? this._smoothPath(pts) : pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    const fill = this.fill && pts.length
      ? `<path class="w-sparkline-fill" d="${d} L${pts[pts.length - 1].x.toFixed(2)},${chartH} L${pts[0].x.toFixed(2)},${chartH} Z"></path>`
      : '';
    return `${fill}<path class="w-sparkline-line" d="${d}" pathLength="1"></path>`;
  }

  _smoothPath(pts) {
    if (pts.length < 2) return pts.length ? `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}` : '';
    const t = Math.min(Math.max(this.smooth, 0) / 48, 0.3) || 1 / 6;
    let d = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) * t;
      const c1y = p1.y + (p2.y - p0.y) * t;
      const c2x = p2.x - (p3.x - p1.x) * t;
      const c2y = p2.y - (p3.y - p1.y) * t;
      d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
    }
    return d;
  }

  _barBody(values, min, range, pad, W, chartH) {
    const n = values.length;
    const slot = (W - pad * 2) / n;
    const gap = Math.min(slot * 0.25, this.lineWidth / 2 + 1);
    const bw = Math.max(1, slot - gap);
    return values.map((v, i) => {
      const h = ((v - min) / range) * (chartH - pad * 2) + pad;
      const x = pad + i * slot + (slot - bw) / 2;
      return `<rect class="w-sparkline-bar" x="${x.toFixed(2)}" y="${(chartH - h).toFixed(2)}" width="${bw.toFixed(2)}" height="${h.toFixed(2)}" rx="1.5"></rect>`;
    }).join('');
  }

  _labelsSvg(values, labels, pad, W, H) {
    const n = values.length;
    return `<g class="w-sparkline-labels" font-size="${this.labelSize}">` + labels.map((text, i) => {
      const x = this.isBar
        ? pad + ((i + 0.5) / n) * (W - pad * 2)
        : this._x(i, n, pad, W);
      return `<text x="${x.toFixed(2)}" y="${(H - 1).toFixed(2)}" text-anchor="middle">${this._esc(text)}</text>`;
    }).join('') + `</g>`;
  }

  _gradientDefs(uid) {
    const dir = { left: [0, 0, 1, 0], right: [1, 0, 0, 0], top: [0, 0, 0, 1], bottom: [0, 1, 0, 0] }[this.gradientDirection] || [0, 0, 1, 0];
    const colors = this.gradient;
    const stops = colors.map((c, i) =>
      `<stop offset="${colors.length === 1 ? 0 : (i / (colors.length - 1) * 100).toFixed(0)}%" stop-color="${this._color(c)}"></stop>`).join('');
    return `<defs><linearGradient id="${uid}" x1="${dir[0]}" y1="${dir[1]}" x2="${dir[2]}" y2="${dir[3]}">${stops}</linearGradient></defs>`;
  }
}

if (!customElements.get('w-sparkline')) customElements.define('w-sparkline', WSparkline);
