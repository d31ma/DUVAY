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
 * Forwarded ARIA — authored on the host, rendered on the progressbar element:
 *   aria-label, aria-labelledby, aria-describedby.
 *
 *   reveal        - alias for `tween`; an optional number sets the duration (ms)
 *
 * Linear-only:
 *   height        - bar thickness (CSS length / number, default 4px)
 *   buffer-value  - secondary buffer value (0–max)
 *   buffer-color  - token color for the buffer
 *   striped       - diagonal stripes on the bar
 *   stream        - animated buffer stream dots
 *   reverse       - fills from the opposite side
 *   rounded       - pill-rounded track + bar
 *   rounded-bar   - pill-rounded bar only, square track
 *   absolute      - position absolute (pair with location)
 *   location      - top | bottom (with absolute)
 *   active        - `active="false"` collapses the bar to zero height
 *   opacity / bg-opacity / buffer-opacity - opacity of bar / track / buffer
 *   clickable     - clicking (or arrowing along) the track sets the value
 *   chunk-count   - split the bar into this many chunks
 *   chunk-width   - fixed chunk size (wins over chunk-count)
 *   chunk-gap     - gap between chunks (default 2px)
 *
 * Circular-only:
 *   size          - x-small | small | default | large | x-large | <number>
 *   width         - stroke width (default 4)
 *   rotate        - start-angle offset in degrees
 *
 * Slots:
 *   default - centered content (e.g. a percentage label)
 *
 * Events:
 *   input / change - fire when `clickable` moves the value
 */

import { wBoolAttr, wClamp, wSetValue } from './utils.js';
import { wCssLength, wSafeColor } from './file-input.js';

export class WProgress extends WElement {

  static attrs = [
    'variant', 'type', 'label', 'details-position', 'value-format', 'hide-label', 'hide-value',
    'value', 'model-value', 'max', 'indeterminate', 'color', 'bg-color', 'tween', 'reveal',
    'height', 'buffer-value', 'buffer-color', 'striped', 'stream', 'reverse', 'rounded', 'absolute', 'location',
    'size', 'width', 'rotate',
    'active', 'opacity', 'bg-opacity', 'buffer-opacity', 'clickable', 'rounded-bar',
    'chunk-count', 'chunk-width', 'chunk-gap',
    'aria-label', 'aria-labelledby', 'aria-describedby',
  ];

  // The progressbar role sits on the rendered element, not the host, so a name
  // authored on the host has to travel with it — otherwise the progressbar is
  // unnamed to assistive technology.
  static forwardedAria = ['aria-label', 'aria-labelledby', 'aria-describedby'];

  static tokens = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info', 'surface'];
  static sizes = { 'x-small': 16, small: 24, sm: 32, default: 32, large: 48, lg: 64, 'x-large': 64 };

  get variant()       { return this._attr('type', this._attr('variant', 'linear')); }
  set value(v) { wSetValue(this, v); }
  get value()         { const mv = this._attr('model-value', null); return parseFloat(mv != null ? mv : this._attr('value', '0')) || 0; }
  get max()           { return parseFloat(this._attr('max', '100')) || 100; }
  get indeterminate() { return this._bool('indeterminate'); }
  set indeterminate(value) { this.toggleAttribute('indeterminate', !!value); }
  get bufferValue()   { const v = parseFloat(this._attr('buffer-value', '100')); return Number.isFinite(v) ? v : 100; }
  get reverse()       { return this._bool('reverse'); }
  get striped()       { return this._bool('striped'); }
  get stream()        { return this._bool('stream'); }
  get tween()         { return this._bool('tween') || this._bool('reveal'); }
  get clickable()     { return this._bool('clickable'); }
  // Vuetify's `active` defaults to true; only an explicit false hides the bar.
  get active()        { return wBoolAttr(this, 'active', true); }

  get tweenDuration() {
    const raw = Number(this._attr('reveal', ''));
    return Number.isFinite(raw) && raw > 0 ? raw : 700;
  }

  _template() {
    return this.variant === 'circular' ? this._circularTemplate() : this._linearTemplate();
  }

  _linearTemplate() {
    const classes = this._linearClasses();
    const style = this._linearStyle();

    const buffer = this._bufferMarkup();
    const stream = this._streamMarkup();
    const barStyle = this.indeterminate ? '' : ` style="inline-size: ${this._pct()}%"`;
    const content = this._contentMarkup();

    return `<div class="${classes}" role="progressbar" aria-valuemin="0" aria-valuemax="${this.max}"${this._valueNowAttr()}${this._nameAttrs()}${style}>
      ${buffer}${stream}<div class="w-progress-bar"${barStyle}></div>${content}
    </div>`;
  }

  _linearClasses() {
    const location = this._location();
    return 'w-progress' + this._cls({
      'w-progress--indeterminate': this.indeterminate,
      'w-progress--reverse': this.reverse,
      'w-progress--striped': this.striped,
      'w-progress--stream': this.stream,
      'w-progress--rounded': this.hasAttribute('rounded'),
      'w-progress--rounded-bar': this._bool('rounded-bar'),
      'w-progress--absolute': this._bool('absolute'),
      'w-progress--inactive': !this.active,
      'w-progress--clickable': this.clickable,
      'w-progress--chunked': this._chunked(),
      [`w-progress--details-${this._attr('details-position', 'bottom')}`]: this.hasAttribute('details-position'),
      ['w-progress--' + location]: location,
    });
  }

  _linearStyle() {
    return this._styleAttr(Object.assign({
      '--w-progress-height': this._cssLength(this._attr('height', '')),
      '--w-progress-color': this._color(this._attr('color', '')),
      '--w-progress-bg': this._color(this._attr('bg-color', '')),
      '--w-progress-buffer-color': this._color(this._attr('buffer-color', '')),
      '--w-progress-opacity': this._opacity(this._attr('opacity', '')),
      '--w-progress-bg-opacity': this._opacity(this._attr('bg-opacity', '')),
      '--w-progress-buffer-opacity': this._opacity(this._attr('buffer-opacity', '')),
    }, this._chunkStyles()));
  }

  _styleAttr(map) {
    const pairs = Object.keys(map).filter((name) => map[name] !== '' && map[name] != null);
    if (!pairs.length) return '';
    return ` style="${this._esc(pairs.map((name) => `${name}: ${map[name]}`).join('; '))}"`;
  }

  // A chunked bar is masked into slices: `chunk-width` pins the slice size,
  // otherwise `chunk-count` divides the track evenly around the gaps.
  _chunkStyles() {
    const count = Number(this._attr('chunk-count', ''));
    const width = this._cssLength(this._attr('chunk-width', ''));
    if (!width && !(Number.isInteger(count) && count > 0)) return {};
    const gap = this._cssLength(this._attr('chunk-gap', '')) || '2px';
    return {
      '--w-progress-chunk-size': width || `calc((100% + ${gap}) / ${count} - ${gap})`,
      '--w-progress-chunk-gap': gap,
    };
  }

  _chunked() {
    return Object.keys(this._chunkStyles()).length > 0;
  }

  _bufferMarkup() {
    if (this.indeterminate || !this.hasAttribute('buffer-value')) return '';
    return `<div class="w-progress-buffer" style="inline-size: ${this._pctOf(this.bufferValue)}%"></div>`;
  }

  _streamMarkup() {
    if (!this.stream) return '';
    return `<div class="w-progress-stream" style="inline-size: ${this.indeterminate ? 100 : this._pctOf(this.bufferValue)}%"></div>`;
  }

  _contentMarkup() {
    if (this._hasContent()) return '<div class="w-progress-content"><slot></slot></div>';
    const label = this._bool('hide-label') ? '' : this._attr('label', '');
    const value = this._bool('hide-value') ? '' : this._formattedValue();
    if (!label && !value) return '';
    return `<div class="w-progress-content">${label ? `<span>${this._esc(label)}</span>` : ''}${value ? `<strong>${this._esc(value)}</strong>` : ''}</div>`;
  }

  get valueFormat() { return this._valueFormatInput !== undefined ? this._valueFormatInput : this._attr('value-format', ''); }
  set valueFormat(value) { this._valueFormatInput = value; if (this._rendered) { this._render(); this._events(); } }

  _formattedValue() {
    const context = { value: this.value, max: this.max, percent: this._pct() };
    if (typeof this.valueFormat === 'function') {
      try { return String(this.valueFormat(context)); } catch { return String(this.value); }
    }
    const format = String(this.valueFormat || '');
    if (!format) return `${Math.round(context.percent)}%`;
    return format.replaceAll('{value}', String(context.value)).replaceAll('{max}', String(context.max)).replaceAll('{percent}', String(Math.round(context.percent)));
  }

  _valueNowAttr() {
    return this.indeterminate ? '' : ` aria-valuenow="${this.value}"`;
  }

  _nameAttrs() {
    return this._attrs(this._ariaAttrs(WProgress.forwardedAria));
  }

  // The circular indicator is sized and coloured entirely through inline
  // declarations, because the ring geometry is a per-instance value the
  // stylesheet cannot know. Each entry drops out when its attribute is absent
  // or fails validation, leaving the stylesheet default in place.
  _circularStyle() {
    const size = this._resolveSize(this._attr('size', ''));
    const rotate = this._number(this._attr('rotate', ''));
    return this._styleAttr({
      width: size && `${size}px`,
      height: size && `${size}px`,
      '--w-progress-color': this._color(this._attr('color', '')),
      '--w-progress-bg': this._color(this._attr('bg-color', '')),
      '--w-progress-width': this._number(this._attr('width', ''), { min: 0 }),
      '--w-progress-rotate': rotate && `${rotate}deg`,
    });
  }

  _circularTemplate() {
    const style = this._circularStyle();

    const indet = this.indeterminate ? ' w-progress-circular--indeterminate' : '';
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = this.indeterminate ? '' : ` stroke-dashoffset="${circumference - (this._pct() / 100) * circumference}"`;
    const content = this._contentMarkup();

    return `<div class="w-progress-circular${indet}" role="progressbar" aria-valuemin="0" aria-valuemax="${this.max}"${this._valueNowAttr()}${this._nameAttrs()}${style}>
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
    return wSafeColor(value);
  }

  _cssLength(value) {
    return wCssLength(value);
  }

  _opacity(value) {
    const raw = String(value == null ? '' : value).trim();
    if (!/^(?:0|1|0?\.\d+|1\.0+)$/.test(raw)) return '';
    const number = Number(raw);
    return number >= 0 && number <= 1 ? String(number) : '';
  }

  _number(value, { min = -Infinity } = {}) {
    const raw = String(value == null ? '' : value).trim();
    if (!/^-?(?:\d+\.?\d*|\.\d+)$/.test(raw)) return '';
    const number = Number(raw);
    return Number.isFinite(number) && number >= min ? String(number) : '';
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
    this._bindClickable();
    if (!this.tween || this.indeterminate || !window.WMotion) return;
    if (this.variant === 'circular') {
      const fill = this._q('.w-progress-fill');
      if (!fill) return;
      const radius = 20;
      const circumference = 2 * Math.PI * radius;
      const to = circumference - (this._pct() / 100) * circumference;
      window.WMotion.tween(fill, { from: circumference, to, property: 'attr:stroke-dashoffset', duration: this.tweenDuration, format: 'raw' });
      return;
    }
    const bar = this._q('.w-progress-bar');
    if (bar) window.WMotion.tween(bar, { from: 0, to: this._pct(), property: 'inline-size', duration: this.tweenDuration });
  }

  // `clickable` turns the track into an input: it takes focus and answers to
  // pointer and arrow keys, so it is exposed as a slider rather than a readout.
  _bindClickable() {
    if (!this.clickable || this.variant === 'circular') return;
    const track = this._q('.w-progress');
    if (!track) return;
    track.setAttribute('tabindex', '0');
    track.setAttribute('role', 'slider');
    track.addEventListener('click', (event) => this._setFromPointer(track, event));
    track.addEventListener('keydown', (event) => this._onClickableKey(event));
  }

  _setFromPointer(track, event) {
    const rect = track.getBoundingClientRect();
    if (!rect.width) return;
    const offset = (event.clientX - rect.left) / rect.width;
    const ratio = this.reverse ? 1 - offset : offset;
    this._setValue(Math.round(wClamp(ratio, 0, 1) * this.max));
  }

  _onClickableKey(event) {
    const step = WProgress.keySteps[event.key];
    if (!step) return;
    event.preventDefault();
    this._setValue(wClamp(this.value + step, 0, this.max));
  }

  // Updated in place: a re-render here would drop the element the pointer or
  // the keyboard is still interacting with.
  _setValue(value) {
    this._silentSet(this.hasAttribute('model-value') ? 'model-value' : 'value', String(value));
    const bar = this._q('.w-progress-bar');
    if (bar) bar.style.inlineSize = this._pct() + '%';
    const track = this._q('.w-progress');
    if (track) track.setAttribute('aria-valuenow', String(value));
    this._emit('input', { value });
    this._emit('change', { value });
  }

  static keySteps = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };
}

if (!customElements.get('w-progress')) {
  customElements.define('w-progress', WProgress);
}
