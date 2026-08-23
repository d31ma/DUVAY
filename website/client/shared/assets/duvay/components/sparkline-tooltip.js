import { wSetValue } from './utils.js';
/* <w-sparkline-tooltip> — coordinate-positioned sparkline value tooltip.
 *
 * Attributes:
 *   value         - active data-point value (default: 0).
 *   index         - active data-point index; absent or "null" hides the tooltip.
 *   target        - viewport coordinates as JSON `[x,y]` or `x,y`.
 *   offset        - distance from the target coordinate in CSS pixels.
 *   location      - top (default) | bottom | left/start | right/end.
 *   content-class - additional class names on the tooltip content.
 *
 * Slot: default — custom tooltip content; falls back to `value`.
 */

export class WSparklineTooltip extends WElement {
  static attrs = ['value', 'index', 'target', 'offset', 'location', 'content-class'];

  set value(v) { wSetValue(this, v); }
  get value() {
    const value = Number(this._attr('value', '0'));
    return Number.isFinite(value) ? value : 0;
  }

  get index() {
    const raw = this.getAttribute('index');
    if (raw == null || raw === '' || raw === 'null') return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  }

  get target() {
    const raw = this._attr('target', '');
    let value;
    try {
      value = JSON.parse(raw);
    } catch (_) {
      value = raw.split(',').map((part) => Number(part.trim()));
    }
    if (!Array.isArray(value) || value.length < 2) return null;
    const coordinates = value.slice(0, 2).map(Number);
    return coordinates.every(Number.isFinite) ? coordinates : null;
  }

  get offset() {
    const value = Number(this._attr('offset', '0'));
    return Number.isFinite(value) ? value : 0;
  }

  get location() { return this._attr('location', 'top').toLowerCase(); }
  get contentClass() { return this._attr('content-class', ''); }

  _locationClass() {
    const aliases = { start: 'left', end: 'right' };
    const location = aliases[this.location] || this.location;
    return ['top', 'bottom', 'left', 'right'].includes(location) ? location : 'top';
  }

  _style() {
    const target = this.target;
    if (!target) return '';
    const properties = [
      `--w-sparkline-tooltip-x:${target[0]}px`,
      `--w-sparkline-tooltip-y:${target[1]}px`,
      `--w-sparkline-tooltip-offset:${this.offset}px`,
    ];
    return ` style="${this._esc(properties.join(';'))}"`;
  }

  _template() {
    const classes = ['w-sparkline-tooltip-content', `w-sparkline-tooltip--${this._locationClass()}`, this.contentClass]
      .filter(Boolean).join(' ');
    const hidden = this.index == null ? ' hidden' : '';
    const index = this.index == null ? '' : ` data-index="${this.index}"`;
    return `<span class="${this._esc(classes)}" role="tooltip"${index}${hidden}${this._style()}>
      <slot></slot><span class="w-sparkline-tooltip-default">${this._esc(this.value)}</span>
    </span>`;
  }
}

if (!customElements.get('w-sparkline-tooltip')) {
  customElements.define('w-sparkline-tooltip', WSparklineTooltip);
}
