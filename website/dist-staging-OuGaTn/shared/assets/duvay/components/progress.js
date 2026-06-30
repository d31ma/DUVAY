/* <w-progress> — Linear or circular progress indicator
 * (shared base for <w-progress-linear> and <w-progress-circular>).
 *
 * Common attributes:
 *   variant       - linear | circular (set by the subclass)
 *   value         - current value (0–max)
 *   model-value   - Vuetify alias for value
 *   max           - maximum value (default: 100)
 *   indeterminate - animated indeterminate state
 *   color         - token color (or raw CSS color) for the fill
 *   bg-color      - token color for the track
 *   tween         - animates the determinate value from 0 on render
 *
 * Linear-only:
 *   height        - bar thickness (CSS length / number, default 4px)
 *   buffer-value  - secondary buffer value (0–max)
 *   buffer-color  - token color for the buffer
 *   striped       - diagonal stripes on the bar
 *   stream        - animated buffer stream dots
 *   reverse       - fills from the opposite side
 *   rounded       - pill-rounded track + bar
 *   absolute      - position absolute (pair with location)
 *   location      - top | bottom (with absolute)
 *
 * Circular-only:
 *   size          - x-small | small | default | large | x-large | <number>
 *   width         - stroke width (default 4)
 *   rotate        - start-angle offset in degrees
 *
 * Slots:
 *   default - centered content (e.g. a percentage label)
 */

export class WProgress extends WElement {

  static attrs = [
    'variant', 'value', 'model-value', 'max', 'indeterminate', 'color', 'bg-color', 'tween',
    'height', 'buffer-value', 'buffer-color', 'striped', 'stream', 'reverse', 'rounded', 'absolute', 'location',
    'size', 'width', 'rotate',
  ];

  static tokens = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info', 'surface'];
  static sizes = { 'x-small': 16, small: 24, sm: 32, default: 32, large: 48, lg: 64, 'x-large': 64 };

  get variant()       { return this._attr('variant', 'linear'); }
  get value()         { const mv = this._attr('model-value', null); return parseFloat(mv != null ? mv : this._attr('value', '0')) || 0; }
  get max()           { return parseFloat(this._attr('max', '100')) || 100; }
  get indeterminate() { return this._bool('indeterminate'); }
  get bufferValue()   { const v = parseFloat(this._attr('buffer-value', '100')); return Number.isFinite(v) ? v : 100; }
  get reverse()       { return this._bool('reverse'); }
  get striped()       { return this._bool('striped'); }
  get stream()        { return this._bool('stream'); }
  get tween()         { return this._bool('tween'); }

  _template() {
    return this.variant === 'circular' ? this._circularTemplate() : this._linearTemplate();
  }

  _linearTemplate() {
    const classes = [
      'w-progress',
      this.indeterminate ? 'w-progress--indeterminate' : '',
      this.reverse ? 'w-progress--reverse' : '',
      this.striped ? 'w-progress--striped' : '',
      this.stream ? 'w-progress--stream' : '',
      this.hasAttribute('rounded') ? 'w-progress--rounded' : '',
      this._bool('absolute') ? 'w-progress--absolute' : '',
      this._location() ? 'w-progress--' + this._location() : '',
    ].filter(Boolean).join(' ');

    const styles = [];
    const h = this._cssLength(this._attr('height', ''));
    if (h) styles.push('--w-progress-height: ' + h);
    const fill = this._color(this._attr('color', ''));
    if (fill) styles.push('--w-progress-color: ' + fill);
    const bg = this._color(this._attr('bg-color', ''));
    if (bg) styles.push('--w-progress-bg: ' + bg);
    const bufColor = this._color(this._attr('buffer-color', ''));
    if (bufColor) styles.push('--w-progress-buffer-color: ' + bufColor);
    const style = styles.length ? ` style="${styles.join('; ')}"` : '';

    const buffer = (!this.indeterminate && this.hasAttribute('buffer-value'))
      ? `<div class="w-progress-buffer" style="inline-size: ${this._pctOf(this.bufferValue)}%"></div>` : '';
    const stream = this.stream ? `<div class="w-progress-stream" style="inline-size: ${this.indeterminate ? 100 : this._pctOf(this.bufferValue)}%"></div>` : '';
    const barStyle = this.indeterminate ? '' : ` style="inline-size: ${this._pct()}%"`;
    const content = this._hasContent() ? '<div class="w-progress-content"><slot></slot></div>' : '';

    return `<div class="${classes}" role="progressbar" aria-valuemin="0" aria-valuemax="${this.max}"${this.indeterminate ? '' : ` aria-valuenow="${this.value}"`}${style}>
      ${buffer}${stream}<div class="w-progress-bar"${barStyle}></div>${content}
    </div>`;
  }

  _circularTemplate() {
    const styles = [];
    const size = this._resolveSize(this._attr('size', ''));
    if (size) styles.push(`width: ${size}px`, `height: ${size}px`);
    const fill = this._color(this._attr('color', ''));
    if (fill) styles.push('--w-progress-color: ' + fill);
    const bg = this._color(this._attr('bg-color', ''));
    if (bg) styles.push('--w-progress-bg: ' + bg);
    const width = this._attr('width', '');
    if (width) styles.push('--w-progress-width: ' + width);
    const rotate = this._attr('rotate', '');
    if (rotate) styles.push('--w-progress-rotate: ' + rotate + 'deg');
    const style = styles.length ? ` style="${styles.join('; ')}"` : '';

    const indet = this.indeterminate ? ' w-progress-circular--indeterminate' : '';
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = this.indeterminate ? '' : ` stroke-dashoffset="${circumference - (this._pct() / 100) * circumference}"`;
    const content = this._hasContent() ? '<div class="w-progress-content"><slot></slot></div>' : '';

    return `<div class="w-progress-circular${indet}" role="progressbar" aria-valuemin="0" aria-valuemax="${this.max}"${this.indeterminate ? '' : ` aria-valuenow="${this.value}"`}${style}>
      <svg viewBox="0 0 48 48" width="100%" height="100%">
        <circle class="w-progress-track" cx="24" cy="24" r="${radius}"></circle>
        <circle class="w-progress-fill" cx="24" cy="24" r="${radius}" stroke-dasharray="${circumference}"${offset}></circle>
      </svg>${content}
    </div>`;
  }

  _location() {
    const loc = String(this._attr('location', '')).toLowerCase();
    return loc === 'top' || loc === 'bottom' ? loc : '';
  }

  _resolveSize(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return '';
    if (this.constructor.sizes[raw]) return this.constructor.sizes[raw];
    return /^\d+(\.\d+)?$/.test(raw) ? raw : '';
  }

  _color(value) {
    const t = String(value || '').trim().toLowerCase();
    if (!t) return '';
    if (t === 'surface') return 'var(--w-surface-container-high)';
    if (this.constructor.tokens.includes(t)) return `var(--w-${t === 'info' ? 'primary' : t})`;
    return value;
  }

  _cssLength(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    return /^\d+(\.\d+)?$/.test(raw) ? raw + 'px' : raw;
  }

  _pct() { return this._pctOf(this.value); }

  _pctOf(v) {
    const max = this.max || 100;
    if (max <= 0) return 0;
    return Math.min(100, Math.max(0, (v / max) * 100));
  }

  _hasContent() {
    return Array.from(this.childNodes).some((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return !n.hasAttribute('slot');
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      return false;
    });
  }

  _events() {
    if (!this.tween || this.indeterminate || !window.WMotion) return;
    if (this.variant === 'circular') {
      const fill = this._q('.w-progress-fill');
      if (!fill) return;
      const radius = 20;
      const circumference = 2 * Math.PI * radius;
      const to = circumference - (this._pct() / 100) * circumference;
      window.WMotion.tween(fill, { from: circumference, to, property: 'attr:stroke-dashoffset', duration: 700, format: 'raw' });
      return;
    }
    const bar = this._q('.w-progress-bar');
    if (bar) window.WMotion.tween(bar, { from: 0, to: this._pct(), property: 'inline-size', duration: 700 });
  }
}
