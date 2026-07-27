/* <w-sparkline> — inline trend/bar chart, mirroring Vuetify's <v-sparkline>.
 *
 * Attributes:
 *   values              - comma list / JSON array of numbers
 *   type                - "trend" (line, default) | "bar"
 *   fill                - fill the area under a trend line
 *   smooth              - round trend corners (boolean, or a number for tension)
 *   smooth-mode         - "default" (corner rounding) | "monotone" (curve passes
 *                         through every data point)
 *   color               - token name or CSS color for the stroke / bars
 *   gradient            - comma list of colors for a gradient (overrides color)
 *   gradient-direction  - "left" (default) | "right" | "top" | "bottom"
 *   line-width          - trend stroke width / bar corner thickness (default 4)
 *   padding             - inset around the plot in viewBox units (default 4)
 *   inset               - run the plot edge to edge, ignoring horizontal padding
 *   auto-line-width     - bars expand to fill their slot instead of leaving a gap
 *   min, max            - clamp the value range (defaults to data extent)
 *   labels              - comma list of labels drawn under each point/bar
 *   show-labels         - draw the values themselves as labels
 *   label-size          - label font size in viewBox units (default 6)
 *   show-markers        - draw a circle at each data point
 *   marker-size         - marker diameter in viewBox units (default 4)
 *   marker-stroke       - marker border color (token or CSS color)
 *   auto-draw           - animate the trend drawing on load
 *   auto-draw-duration  - animation duration in ms (default 1000)
 *   auto-draw-easing    - CSS easing for the trace animation (default "ease")
 *   animation           - transition the path when `values` changes. Bare
 *                         attribute uses 300ms/ease; a JSON object customises it:
 *                         animation='{"duration":600,"easing":"ease-in-out"}'
 *   interactive         - hover tracking, arrow-key navigation and focus
 *   tooltip             - show the active point's value. Requires `interactive`.
 *                         Bare attribute, or JSON: '{"offset":6,"showCrosshair":true}'
 *   label               - accessible label (aria-label)
 *
 * Not implemented: the tooltip's `titleFormat` / `class` options, which take a
 * JavaScript function and a Vue class binding.
 */
import { wBoolAttr, wNumberList } from './utils.js';

let sparkUid = 0;

const CHART_W = 100;
const CHART_H = 40;
const OFF_VALUES = ['false', '0', 'off', 'none'];

/* Fritsch–Carlson tangents: the slopes that keep a cubic curve monotone between
   samples, so the line never overshoots a data point. */
export function wMonotoneTangents(pts) {
  const slopes = pts.slice(0, -1).map((p, i) => (pts[i + 1].y - p.y) / ((pts[i + 1].x - p.x) || 1));
  return pts.map((_, i) => {
    if (i === 0) return slopes[0] ?? 0;
    if (i === pts.length - 1) return slopes[slopes.length - 1] ?? 0;
    const a = slopes[i - 1];
    const b = slopes[i];
    return a * b <= 0 ? 0 : (a + b) / 2;
  });
}

export class WSparkline extends WElement {
  static attrs = ['values', 'type', 'fill', 'smooth', 'color', 'gradient', 'gradient-direction',
    'line-width', 'padding', 'min', 'max', 'labels', 'show-labels', 'label-size',
    'auto-draw', 'auto-draw-duration', 'label',
    'inset', 'auto-line-width', 'auto-draw-easing', 'smooth-mode',
    'show-markers', 'marker-size', 'marker-stroke', 'animation', 'interactive', 'tooltip'];

  get values() { return wNumberList(this._attr('values', '')); }
  get type() { return this._attr('type', 'trend'); }
  get isBar() { return this.type === 'bar'; }
  get fill() { return wBoolAttr(this, 'fill'); }
  get smooth() {
    if (!this.hasAttribute('smooth')) return 0;
    const n = parseFloat(this._attr('smooth', ''));
    return Number.isFinite(n) ? n : 8;
  }
  get smoothMode() { return this._attr('smooth-mode', 'default'); }
  get color() { return this._attr('color', ''); }
  get gradient() { return this._attr('gradient', '').split(',').map((c) => c.trim()).filter(Boolean); }
  get gradientDirection() { return this._attr('gradient-direction', 'left'); }
  get lineWidth() { return this._number('line-width', 4); }
  get padding() { return this._number('padding', 4); }
  get inset() { return wBoolAttr(this, 'inset'); }
  get autoLineWidth() { return wBoolAttr(this, 'auto-line-width'); }
  get labels() { return this._attr('labels', '').split(',').map((l) => l.trim()).filter(Boolean); }
  get showLabels() { return wBoolAttr(this, 'show-labels'); }
  get labelSize() { return this._number('label-size', 6); }
  get showMarkers() { return wBoolAttr(this, 'show-markers'); }
  get markerSize() { return this._number('marker-size', 4); }
  get markerStroke() { return this._attr('marker-stroke', ''); }
  get autoDraw() { return wBoolAttr(this, 'auto-draw'); }
  get autoDrawDuration() { return this._number('auto-draw-duration', 1000); }
  get autoDrawEasing() { return this._attr('auto-draw-easing', 'ease'); }
  get label() { return this._attr('label', 'Sparkline'); }
  get interactive() { return wBoolAttr(this, 'interactive'); }
  get animation() { return this._options('animation', { duration: 300, easing: 'ease' }); }
  // Vuetify gates the tooltip behind `interactive`; without it there is nothing
  // to make a point active.
  get tooltip() { return this.interactive ? this._options('tooltip', { offset: 4, showCrosshair: false }) : null; }

  _number(name, fallback) {
    const n = parseFloat(this._attr(name, ''));
    return Number.isFinite(n) ? n : fallback;
  }

  /* Vuetify's `boolean | object` props: absent or an explicit falsy string is
     off, a bare attribute takes the defaults, and JSON overrides them. */
  _options(name, defaults) {
    if (!this.hasAttribute(name)) return null;
    const raw = String(this.getAttribute(name)).trim();
    if (OFF_VALUES.includes(raw.toLowerCase())) return null;
    if (raw[0] !== '{') return { ...defaults };
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? { ...defaults, ...parsed } : { ...defaults };
    } catch (_) {
      return { ...defaults };
    }
  }

  // token / named color / hex / rgb() → a usable CSS colour, preferring a token.
  _color(c) {
    c = String(c).trim();
    return /^[a-z][a-z0-9-]*$/i.test(c) ? `var(--w-${c}, ${c})` : c;
  }

  // Data extent, clamped by the min / max attributes when they are numbers.
  _extent(values) {
    const min = Number.isFinite(parseFloat(this._attr('min', ''))) ? parseFloat(this._attr('min', '')) : Math.min(...values);
    const max = Number.isFinite(parseFloat(this._attr('max', ''))) ? parseFloat(this._attr('max', '')) : Math.max(...values);
    return { min, range: (max - min) || 1 };
  }

  _stroke(uid) {
    return this.gradient.length ? `url(#${uid})` : (this.color ? this._color(this.color) : 'var(--w-primary)');
  }

  _rootClass() {
    return 'w-sparkline' + this._cls({
      ['w-sparkline--' + (this.isBar ? 'bar' : 'trend')]: true,
      'w-sparkline--fill': this.fill,
      'w-sparkline--auto-draw': this.autoDraw && !this.isBar,
      'w-sparkline--inset': this.inset,
      'w-sparkline--interactive': this.interactive,
    });
  }

  _plotValues() {
    const values = this.values;
    return values.length ? values : [3, 6, 4, 8, 5, 9];
  }

  // `inset` drops the horizontal padding so the plot runs edge to edge.
  _xPad() { return this.inset ? 0 : this.padding; }

  _points(values) {
    const { min, range } = this._extent(values);
    return values.map((v, i) => ({
      x: this._x(i, values.length, this._xPad(), CHART_W),
      y: this._y(v, min, range, this.padding, CHART_H),
    }));
  }

  _rootStyle(stroke) {
    const parts = [
      `--w-sparkline-color:${stroke}`,
      `--w-sparkline-width:${this.lineWidth}`,
      `--w-sparkline-draw-duration:${this.autoDrawDuration}ms`,
      `--w-sparkline-draw-easing:${this.autoDrawEasing}`,
      `--w-sparkline-marker-size:${this.markerSize}`,
    ];
    return ` style="${this._esc(parts.join(';'))}"`;
  }

  _template() {
    const values = this._plotValues();
    const labelList = this.showLabels ? values.map((v) => String(v)) : this.labels;
    const labelH = labelList.length ? this.labelSize + 4 : 0;
    const H = CHART_H + labelH;

    const uid = this._uid || (this._uid = `w-spark-${++sparkUid}`);
    const defs = this.gradient.length ? this._gradientDefs(uid) : '';
    const focusable = this.interactive ? ' tabindex="0"' : '';

    const body = this.isBar ? this._barBody(values) : this._trendBody(this._points(values));
    const labelsSvg = labelList.length ? this._labelsSvg(values, labelList, this._xPad(), CHART_W, H) : '';

    return `<svg class="${this._rootClass()}" viewBox="0 0 ${CHART_W} ${H}" role="img"`
      + ` aria-label="${this._esc(this.label)}"${focusable}${this._rootStyle(this._stroke(uid))}>`
      + `${defs}${body}${labelsSvg}${this._tooltipBody()}</svg>`;
  }

  _x(i, n, pad, W) { return n === 1 ? W / 2 : (i / (n - 1)) * (W - pad * 2) + pad; }
  _y(v, min, range, pad, chartH) { return chartH - pad - ((v - min) / range) * (chartH - pad * 2); }

  // `animation` transitions the `d` attribute, so the path morphs between value
  // sets instead of snapping.
  _animStyle() {
    const anim = this.animation;
    return anim ? ` style="transition:d ${Number(anim.duration) || 300}ms ${this._esc(String(anim.easing || 'ease'))}"` : '';
  }

  _linePath(pts) {
    if (!this.smooth) return pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    return this.smoothMode === 'monotone' ? this._monotonePath(pts) : this._smoothPath(pts);
  }

  _trendBody(pts) {
    const d = this._linePath(pts);
    const anim = this._animStyle();
    const fill = this.fill && pts.length
      ? `<path class="w-sparkline-fill" d="${d} L${pts[pts.length - 1].x.toFixed(2)},${CHART_H} L${pts[0].x.toFixed(2)},${CHART_H} Z"${anim}></path>`
      : '';
    return `${fill}<path class="w-sparkline-line" d="${d}" pathLength="1"${anim}></path>${this._markersBody(pts)}`;
  }

  _markersBody(pts) {
    if (!this.showMarkers) return '';
    const r = (this.markerSize / 2).toFixed(2);
    const stroke = this.markerStroke ? ` stroke="${this._esc(this._color(this.markerStroke))}"` : '';
    return pts.map((p, i) => (
      `<circle class="w-sparkline-marker" data-index="${i}" cx="${p.x.toFixed(2)}"`
      + ` cy="${p.y.toFixed(2)}" r="${r}"${stroke}></circle>`
    )).join('');
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

  // Monotone cubic: control points derived from Fritsch–Carlson tangents, so the
  // curve sticks to the data instead of rounding past it.
  _monotonePath(pts) {
    if (pts.length < 2) return pts.length ? `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}` : '';
    const m = wMonotoneTangents(pts);
    let d = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const dx = (pts[i + 1].x - pts[i].x) / 3;
      const c1y = pts[i].y + m[i] * dx;
      const c2y = pts[i + 1].y - m[i + 1] * dx;
      d += ` C${(pts[i].x + dx).toFixed(2)},${c1y.toFixed(2)}`
        + ` ${(pts[i + 1].x - dx).toFixed(2)},${c2y.toFixed(2)}`
        + ` ${pts[i + 1].x.toFixed(2)},${pts[i + 1].y.toFixed(2)}`;
    }
    return d;
  }

  _barBody(values) {
    const pad = this._xPad();
    const { min, range } = this._extent(values);
    const n = values.length;
    const slot = (CHART_W - pad * 2) / n;
    // `auto-line-width` gives the gap back to the bars so they use the full slot.
    const gap = this.autoLineWidth ? 0 : Math.min(slot * 0.25, this.lineWidth / 2 + 1);
    const bw = Math.max(1, slot - gap);
    const anim = this._animStyle();
    return values.map((v, i) => {
      const h = ((v - min) / range) * (CHART_H - this.padding * 2) + this.padding;
      const x = pad + i * slot + (slot - bw) / 2;
      return `<rect class="w-sparkline-bar" data-index="${i}" x="${x.toFixed(2)}" y="${(CHART_H - h).toFixed(2)}"`
        + ` width="${bw.toFixed(2)}" height="${h.toFixed(2)}" rx="1.5"${anim}></rect>`;
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

  /* ── Tooltip + interaction ──────────────────────────────────────────────── */

  _tooltipBody() {
    const options = this.tooltip;
    if (!options) return '';
    const crosshair = options.showCrosshair
      ? `<line class="w-sparkline-crosshair" y1="0" y2="${CHART_H}"></line>`
      : '';
    return '<g class="w-sparkline-tooltip" hidden>' + crosshair
      + '<g class="w-sparkline-tooltip-tip">'
      + '<rect class="w-sparkline-tooltip-bg" x="-9" y="-13" width="18" height="11" rx="2"></rect>'
      + '<text class="w-sparkline-tooltip-text" text-anchor="middle" y="-5" font-size="7"></text>'
      + '</g></g>';
  }

  _events() {
    const svg = this._q('svg');
    if (!svg || !this.interactive) return;
    this._active = -1;
    svg.addEventListener('pointermove', (event) => this._setActive(this._indexAt(svg, event.clientX)));
    svg.addEventListener('pointerleave', () => this._setActive(-1));
    svg.addEventListener('focus', () => this._setActive(Math.max(this._active, 0)));
    svg.addEventListener('blur', () => this._setActive(-1));
    svg.addEventListener('keydown', (event) => this._onKey(event));
  }

  _indexAt(svg, clientX) {
    const rect = svg.getBoundingClientRect();
    if (!rect.width) return -1;
    const n = this._plotValues().length;
    const fraction = (clientX - rect.left) / rect.width;
    return Math.min(n - 1, Math.max(0, Math.round(fraction * (n - 1))));
  }

  _onKey(event) {
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowUp: 1, ArrowDown: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const n = this._plotValues().length;
    this._setActive(Math.min(n - 1, Math.max(0, (this._active < 0 ? 0 : this._active) + step)));
  }

  // The active point is reflected on the svg (for styling and tests) and folded
  // into the accessible name, so keyboard users hear what they moved to.
  _setActive(index) {
    if (index === this._active) return;
    this._active = index;
    const svg = this._q('svg');
    if (!svg) return;
    svg.setAttribute('data-active-index', String(index));
    const values = this._plotValues();
    const suffix = index >= 0 ? `, point ${index + 1} of ${values.length}: ${values[index]}` : '';
    svg.setAttribute('aria-label', this.label + suffix);
    this._syncTooltip(index, values);
  }

  _syncTooltip(index, values) {
    const layer = this._q('.w-sparkline-tooltip');
    if (!layer) return;
    if (index < 0) { layer.setAttribute('hidden', ''); return; }
    layer.removeAttribute('hidden');
    const point = this._points(values)[index];
    const offset = Number(this.tooltip.offset) || 0;
    this._q('.w-sparkline-tooltip-tip').setAttribute('transform', `translate(${point.x.toFixed(2)}, ${(point.y - offset).toFixed(2)})`);
    this._q('.w-sparkline-tooltip-text').textContent = String(values[index]);
    const crosshair = this._q('.w-sparkline-crosshair');
    if (crosshair) {
      crosshair.setAttribute('x1', point.x.toFixed(2));
      crosshair.setAttribute('x2', point.x.toFixed(2));
    }
  }
}

if (!customElements.get('w-sparkline')) customElements.define('w-sparkline', WSparkline);
