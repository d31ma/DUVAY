/* <w-time-picker-controls> — the hour : minute [: second] · AM/PM row of a time
 * picker (DuVay equivalent of Vuetify v-time-picker-controls).
 *
 * Usable on its own: it owns the displayed time, which unit is being edited,
 * and whether the current time sits inside the allowed range.
 *
 * Attributes:
 *   value            - displayed time, "HH:MM[:SS]" (a bare number is an hour)
 *   hour / minute / second
 *                    - override a single part of `value`
 *   period           - am | pm; also makes `hour` a 12-hour number
 *   view-mode        - hour (default) | minute | second — the highlighted unit
 *   ampm             - 12-hour display with an AM/PM toggle
 *   use-seconds      - show the seconds control
 *   input-hints      - render a label under each control
 *   min / max        - allowed time range, "HH:MM[:SS]"
 *   allowed-hours / allowed-minutes / allowed-seconds
 *                    - comma list or JSON array of selectable numbers
 *
 * Events:
 *   update:view-mode - { viewMode } a unit control was activated
 *   update:period    - { period }   AM/PM was toggled
 */
import { wBoolAttr, wNumberList } from './utils.js';
import { wParseLimit, wParseTime, wPad, wTimeSeconds } from './time-picker.js';

const W_UNITS = [
  { unit: 'hour', hint: 'Hour', allowed: 'allowed-hours' },
  { unit: 'minute', hint: 'Minute', allowed: 'allowed-minutes' },
  { unit: 'second', hint: 'Second', allowed: 'allowed-seconds' },
];

export class WTimePickerControls extends WElement {
  static attrs = ['value', 'hour', 'minute', 'second', 'period', 'view-mode', 'ampm',
    'use-seconds', 'input-hints', 'min', 'max',
    'allowed-hours', 'allowed-minutes', 'allowed-seconds'];

  get ampm() { return wBoolAttr(this, 'ampm'); }
  get useSeconds() { return wBoolAttr(this, 'use-seconds'); }
  get inputHints() { return wBoolAttr(this, 'input-hints'); }

  get period() {
    const attr = this._periodAttr();
    return attr || (this.parts.hour >= 12 ? 'pm' : 'am');
  }

  _periodAttr() {
    const attr = String(this._attr('period', '')).toLowerCase();
    return attr === 'am' || attr === 'pm' ? attr : '';
  }

  get viewMode() {
    const view = this._attr('view-mode', 'hour');
    return W_UNITS.some((entry) => entry.unit === view) ? view : 'hour';
  }

  // `value` carries the whole time; hour/minute/second override one part each.
  get parts() {
    const parts = wParseTime(this._attr('value', '12:00'));
    W_UNITS.forEach(({ unit }) => {
      const raw = this.getAttribute(unit);
      if (raw !== null && raw !== '') parts[unit] = Math.max(0, parseInt(raw, 10) || 0);
    });
    return this._withPeriod(parts);
  }

  // An explicit `period` makes `hour` a 12-hour number.
  _withPeriod(parts) {
    const attr = this._periodAttr();
    if (!attr) return parts;
    parts.hour = (parts.hour % 12) + (attr === 'pm' ? 12 : 0);
    return parts;
  }

  _label(unit, parts) {
    if (unit !== 'hour' || !this.ampm) return wPad(Math.min(59, parts[unit]));
    return wPad(parts.hour % 12 || 12);
  }

  /* ── allowed range ───────────────────────────────────────────────────── */

  _allowed(unit, value, parts) {
    const entry = W_UNITS.find((item) => item.unit === unit);
    const list = wNumberList(this.getAttribute(entry.allowed), []);
    if (list.length && !list.includes(value)) return false;
    const seconds = wTimeSeconds({ ...parts, [unit]: value }, this.useSeconds);
    return seconds >= wTimeSeconds(this._bound('min'), this.useSeconds)
      && seconds <= wTimeSeconds(this._bound('max'), this.useSeconds);
  }

  _bound(name) {
    const fallback = name === 'min'
      ? { hour: 0, minute: 0, second: 0 }
      : { hour: 23, minute: 59, second: 59 };
    return wParseLimit(this.getAttribute(name), fallback);
  }

  // The hour the time would take on if the given period were picked.
  _periodHour(period, parts) {
    return (parts.hour % 12) + (period === 'pm' ? 12 : 0);
  }

  /* ── template ────────────────────────────────────────────────────────── */

  _units() {
    return this.useSeconds ? W_UNITS : W_UNITS.slice(0, 2);
  }

  _controlHtml(entry, parts) {
    const active = this.viewMode === entry.unit;
    const allowed = this._allowed(entry.unit, parts[entry.unit], parts);
    const button = `<button type="button" class="w-time-picker-display${active ? ' active' : ''}"`
      + this._attrs({
        'data-time-view': entry.unit,
        'aria-pressed': String(active),
        'aria-invalid': allowed ? '' : 'true',
        'aria-label': entry.hint,
      })
      + `>${this._esc(this._label(entry.unit, parts))}</button>`;
    const hint = this.inputHints ? `<span class="w-time-picker-hint">${entry.hint}</span>` : '';
    return `<span class="w-time-picker-control">${button}${hint}</span>`;
  }

  _periodButton(period, parts) {
    const current = this.period === period;
    const allowed = this._allowed('hour', this._periodHour(period, parts), parts);
    return `<button type="button" class="${current ? 'active' : ''}"`
      + this._attrs({
        'data-time-period': period,
        'aria-pressed': String(current),
        disabled: !allowed,
      })
      + `>${period.toUpperCase()}</button>`;
  }

  _periodHtml(parts) {
    if (!this.ampm) return '';
    return '<div class="w-time-picker-period" role="group" aria-label="Period">'
      + this._periodButton('am', parts) + this._periodButton('pm', parts) + '</div>';
  }

  _template() {
    const parts = this.parts;
    const controls = this._units()
      .map((entry) => this._controlHtml(entry, parts))
      .join('<span class="w-time-picker-separator">:</span>');
    return '<div class="w-time-picker-controls w-time-picker-header" role="group">'
      + `${controls}${this._periodHtml(parts)}<slot></slot></div>`;
  }

  /* ── events ──────────────────────────────────────────────────────────── */

  _events() {
    this._qAll('[data-time-view]').forEach((button) => {
      button.addEventListener('click', () => this._setView(button.getAttribute('data-time-view')));
    });
    this._qAll('[data-time-period]').forEach((button) => {
      button.addEventListener('click', () => this._setPeriod(button.getAttribute('data-time-period')));
    });
  }

  _locked() {
    return this.hasAttribute('disabled') || this.hasAttribute('readonly');
  }

  _rerender() { this._render(); this._events(); }

  _setView(view) {
    if (this._locked()) return;
    this._silentSet('view-mode', view);
    this._rerender();
    this._emit('update:view-mode', { viewMode: view });
  }

  _setPeriod(period) {
    if (this._locked()) return;
    this._silentSet('period', period);
    this._rerender();
    this._emit('update:period', { period });
  }
}

if (!customElements.get('w-time-picker-controls')) {
  customElements.define('w-time-picker-controls', WTimePickerControls);
}
