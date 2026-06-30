/* <w-time-picker> — DuVay component module */
import { wBoolAttr, wModelValue, wNumberList } from './utils.js';

function parseTime(value) {
  const match = String(value || '').trim().toLowerCase().match(/^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?\s*([ap]m)?$/);
  const hour = match ? Math.max(0, Math.min(23, parseInt(match[1], 10) || 0)) : 12;
  const minute = match ? Math.max(0, Math.min(59, parseInt(match[2] || '0', 10) || 0)) : 0;
  const second = match ? Math.max(0, Math.min(59, parseInt(match[3] || '0', 10) || 0)) : 0;
  const period = match?.[4];
  return {
    hour: period ? to24Hour(hour, period) : hour,
    minute,
    second,
  };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatTime({ hour, minute, second }, seconds = false) {
  return `${pad(hour)}:${pad(minute)}${seconds ? `:${pad(second)}` : ''}`;
}

function to24Hour(hour, period) {
  const normalized = Math.max(1, Math.min(12, Number(hour) || 12));
  return (normalized % 12) + (period === 'pm' ? 12 : 0);
}

function timeValue(parts, seconds = false) {
  return parts.hour * 3600 + parts.minute * 60 + (seconds ? parts.second : 0);
}

function parseLimit(value, fallback) {
  if (!value) return fallback;
  return parseTime(value);
}

function classToken(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

export class WTimePicker extends WElement {
  static attrs = [
    'value', 'model-value', 'label', 'title', 'view', 'view-mode', 'format', 'period',
    'use-seconds', 'scrollable', 'allowed-hours', 'allowed-minutes', 'allowed-seconds',
    'min', 'max', 'color', 'elevation', 'width', 'density', 'hide-header',
    'ampm-in-title', 'variant', 'disabled', 'readonly',
  ];

  get value() { return wModelValue(this, '12:00'); }
  get label() { return this._attr('label', 'Time'); }
  get title() { return this._attr('title', 'Select time'); }
  get view() {
    const view = this._attr('view-mode', this._attr('view', 'hours'));
    if (view === 'hour') return 'hours';
    if (view === 'minute') return 'minutes';
    if (view === 'second') return 'seconds';
    if (view === 'minutes' || view === 'seconds') return view;
    return 'hours';
  }
  get viewMode() {
    return this.view === 'hours' ? 'hour' : this.view === 'minutes' ? 'minute' : 'second';
  }
  get format() {
    const format = this._attr('format', 'ampm');
    return format === '24hr' ? '24hr' : 'ampm';
  }
  get period() {
    const attr = String(this.getAttribute('period') || '').toLowerCase();
    if (attr === 'am' || attr === 'pm') return attr;
    return this._parts().hour >= 12 ? 'pm' : 'am';
  }
  get useSeconds() { return wBoolAttr(this, 'use-seconds'); }
  get scrollable() { return wBoolAttr(this, 'scrollable'); }
  get hideHeader() { return wBoolAttr(this, 'hide-header'); }
  get ampmInTitle() { return wBoolAttr(this, 'ampm-in-title'); }
  get disabled() { return wBoolAttr(this, 'disabled'); }
  get readonly() { return wBoolAttr(this, 'readonly'); }
  get color() { return this._attr('color', 'primary'); }
  get elevation() { return this._attr('elevation', ''); }
  get density() { return this._attr('density', ''); }
  get width() { return this._attr('width', ''); }
  get variant() { return this._attr('variant', 'dial') === 'input' ? 'input' : 'dial'; }

  _parts() {
    return parseTime(this.value);
  }

  _period() {
    return this.period.toUpperCase();
  }

  _displayHour() {
    const hour = this._parts().hour;
    if (this.format === '24hr') return pad(hour);
    const display = hour % 12 || 12;
    return pad(display);
  }

  _template() {
    const parts = this._parts();
    const period = this._period();
    const readonly = this.disabled || this.readonly;
    const clockItems = this.view === 'hours' ? this._hourItems(parts) : this._unitItems(this.view === 'seconds' ? parts.second : parts.minute, parts);
    const unitLabel = this.view === 'hours' ? 'hour' : this.view === 'seconds' ? 'second' : 'minute';
    const classes = [
      'w-time-picker',
      `w-time-picker--variant-${this.variant}`,
      `w-time-picker--format-${this.format}`,
      `w-time-picker--color-${classToken(this.color)}`,
      this.disabled ? 'w-time-picker--disabled' : '',
      this.readonly ? 'w-time-picker--readonly' : '',
      this.density ? `w-time-picker--density-${classToken(this.density)}` : '',
      this.elevation !== '' ? `w-time-picker--elevation-${classToken(this.elevation)}` : '',
    ].filter(Boolean).join(' ');
    const style = [
      this.width ? `width:${this._esc(this.width)}` : '',
      this.color && !/^(primary|secondary|tertiary|success|warning|error|danger|info)$/.test(this.color)
        ? `--w-time-picker-color:${this._esc(this.color)}`
        : '',
    ].filter(Boolean).join(';');
    const title = this.ampmInTitle && this.format === 'ampm'
      ? `${this.title} ${period}`
      : this.title;

    return `<div class="${classes}"${style ? ` style="${style}"` : ''} aria-label="${this._esc(this.label)}">
      ${!this.hideHeader ? `<div class="w-time-picker-title">${this._esc(title)}</div>` : ''}
      ${this.label ? `<div class="w-time-picker-label">${this._esc(this.label)}</div>` : ''}
      <div class="w-time-picker-header">
        ${this._fieldButton('hours', this._displayHour(), readonly)}
        <span class="w-time-picker-separator">:</span>
        ${this._fieldButton('minutes', pad(parts.minute), readonly)}
        ${this.useSeconds ? `<span class="w-time-picker-separator">:</span>${this._fieldButton('seconds', pad(parts.second), readonly)}` : ''}
        ${this.format === 'ampm' ? `<div class="w-time-picker-period" role="group" aria-label="Period">
          <button type="button" class="${period === 'AM' ? 'active' : ''}" data-time-period="AM"${readonly ? ' disabled' : ''}>AM</button>
          <button type="button" class="${period === 'PM' ? 'active' : ''}" data-time-period="PM"${readonly ? ' disabled' : ''}>PM</button>
        </div>` : ''}
      </div>
      <div class="w-time-picker-clock" role="listbox" aria-label="Choose ${unitLabel}"${this.scrollable ? ' data-time-scrollable' : ''}>
        ${clockItems}
        <span class="w-time-picker-hand" style="--w-time-picker-angle:${this._angle()}deg"></span>
      </div>
      <input type="hidden" value="${this._esc(formatTime(parts, this.useSeconds))}">
    </div>`;
  }

  _fieldButton(view, value, readonly) {
    const active = this.view === view;
    if (this.variant === 'input') {
      return `<label class="w-time-picker-field${active ? ' active' : ''}">
        <span class="w-sr-only">${view}</span>
        <input value="${this._esc(value)}" inputmode="numeric" maxlength="2" data-time-field="${view}"${readonly ? ' disabled' : ''}>
      </label>`;
    }
    return `<button class="w-time-picker-display${active ? ' active' : ''}" type="button" data-time-view="${view}"${readonly ? ' disabled' : ''}>${this._esc(value)}</button>`;
  }

  _hourItems(parts) {
    const values = this.format === '24hr'
      ? Array.from({ length: 24 }, (_, index) => index)
      : Array.from({ length: 12 }, (_, index) => index + 1);
    return values.map((value) => {
      const hour24 = this.format === '24hr' ? value : to24Hour(value, this.period);
      const selected = this.format === '24hr'
        ? parts.hour === value
        : ((parts.hour % 12) || 12) === value;
      const angle = this.format === '24hr' ? (value / 24) * 360 : (value / 12) * 360;
      const radius = this.format === '24hr' && value < 12 ? 31 : 42;
      const label = this.format === '24hr' ? pad(value) : String(value);
      return this._clockButton(label, value, selected, angle, radius, 'hour', this._isAllowed('hour', hour24, parts));
    }).join('');
  }

  _unitItems(selectedValue, parts) {
    return Array.from({ length: 12 }, (_, index) => index * 5).map((value) => {
      const selected = selectedValue === value;
      const unit = this.view === 'seconds' ? 'second' : 'minute';
      return this._clockButton(pad(value), value, selected, (value / 60) * 360, 42, unit, this._isAllowed(unit, value, parts));
    }).join('');
  }

  _clockButton(label, value, selected, angle, radius, unit, allowed = true) {
    const radians = (angle * Math.PI) / 180;
    const x = 50 + Math.sin(radians) * radius;
    const y = 50 - Math.cos(radians) * radius;
    return `<button class="w-time-picker-clock-item${selected ? ' selected' : ''}${allowed ? '' : ' disabled'}" type="button" data-time-unit="${unit}" data-time-value="${value}" style="left:${x}%;top:${y}%"${this.disabled || this.readonly || !allowed ? ' disabled' : ''}>${this._esc(label)}</button>`;
  }

  _angle() {
    const parts = this._parts();
    if (this.view === 'hours') {
      const value = this.format === '24hr' ? parts.hour : ((parts.hour % 12) || 12);
      return this.format === '24hr' ? (value / 24) * 360 : (value / 12) * 360;
    }
    return ((this.view === 'seconds' ? parts.second : parts.minute) / 60) * 360;
  }

  _events() {
    this._qAll('[data-time-view]').forEach((button) => {
      button.addEventListener('click', () => this._setView(button.getAttribute('data-time-view')));
    });
    this._qAll('[data-time-field]').forEach((input) => {
      input.addEventListener('focus', () => this._setView(input.getAttribute('data-time-field'), false));
      input.addEventListener('change', () => this._setField(input.getAttribute('data-time-field'), input.value));
      input.addEventListener('keydown', (event) => this._onFieldKey(event, input.getAttribute('data-time-field')));
    });
    this._qAll('[data-time-period]').forEach((button) => {
      button.addEventListener('click', () => this._setPeriod(button.getAttribute('data-time-period')));
    });
    this._qAll('[data-time-unit]').forEach((button) => {
      button.addEventListener('click', () => this._select(button.getAttribute('data-time-unit'), Number(button.getAttribute('data-time-value'))));
    });
    this._q('[data-time-scrollable]')?.addEventListener('wheel', (event) => this._onWheel(event));
  }

  _setView(view, render = true) {
    if (this.disabled || this.readonly) return;
    this._silentSet('view', view);
    this._silentSet('view-mode', this.viewMode);
    this._emit('w-update-view-mode', { value: this.viewMode });
    if (render) {
      this._render();
      this._events();
    }
  }

  _setPeriod(period) {
    if (this.disabled || this.readonly) return;
    const nextPeriod = String(period || '').toLowerCase();
    if (nextPeriod !== 'am' && nextPeriod !== 'pm') return;
    const parts = this._parts();
    if (nextPeriod === 'am' && parts.hour >= 12) parts.hour -= 12;
    if (nextPeriod === 'pm' && parts.hour < 12) parts.hour += 12;
    this._silentSet('period', nextPeriod);
    this._emit('w-update-period', { value: nextPeriod });
    this._commit(parts);
  }

  _select(unit, value) {
    if (this.disabled || this.readonly) return;
    const parts = this._parts();
    if (unit === 'hour') {
      if (this.format === 'ampm') {
        const period = this.period.toUpperCase();
        parts.hour = value % 12;
        if (period === 'PM') parts.hour += 12;
      } else {
        parts.hour = value;
      }
      if (!this._isAllowed('hour', parts.hour, parts)) return;
      this._silentSet('view', 'minutes');
      this._silentSet('view-mode', 'minute');
      this._emit('w-update-hour', { value: parts.hour });
    } else if (unit === 'minute') {
      if (!this._isAllowed('minute', value, parts)) return;
      parts.minute = value;
      if (this.useSeconds) this._silentSet('view', 'seconds');
      if (this.useSeconds) this._silentSet('view-mode', 'second');
      this._emit('w-update-minute', { value });
    } else {
      if (!this._isAllowed('second', value, parts)) return;
      parts.second = value;
      this._emit('w-update-second', { value });
    }
    this._commit(parts);
  }

  _setField(view, rawValue) {
    if (this.disabled || this.readonly) return;
    const parts = this._parts();
    const value = Math.max(0, Math.min(view === 'hours' && this.format === 'ampm' ? 12 : view === 'hours' ? 23 : 59, parseInt(rawValue, 10) || 0));
    if (view === 'hours') parts.hour = this.format === 'ampm' ? to24Hour(value || 12, this.period) : value;
    if (view === 'minutes') parts.minute = value;
    if (view === 'seconds') parts.second = value;
    const unit = view === 'hours' ? 'hour' : view === 'minutes' ? 'minute' : 'second';
    if (!this._isAllowed(unit, unit === 'hour' ? parts.hour : value, parts)) {
      this._render();
      this._events();
      return;
    }
    this._commit(parts);
  }

  _onFieldKey(event, view) {
    if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const increment = event.key === 'ArrowUp';
    const unit = view === 'hours' ? 'hour' : view === 'minutes' ? 'minute' : 'second';
    const parts = this._parts();
    const current = unit === 'hour' ? parts.hour : unit === 'minute' ? parts.minute : parts.second;
    const next = this._nextAllowed(unit, current, increment, parts, 1);
    if (unit === 'hour') return this._commitAbsoluteHour(next, parts);
    this._select(unit, next);
  }

  _onWheel(event) {
    if (!this.scrollable || this.disabled || this.readonly) return;
    event.preventDefault();
    const parts = this._parts();
    const unit = this.view === 'hours' ? 'hour' : this.view === 'minutes' ? 'minute' : 'second';
    const current = unit === 'hour' ? parts.hour : unit === 'minute' ? parts.minute : parts.second;
    const next = this._nextAllowed(unit, current, event.deltaY < 0, parts);
    if (unit === 'hour') return this._commitAbsoluteHour(next, parts);
    this._select(unit, next);
  }

  _commit(parts) {
    const value = formatTime(parts, this.useSeconds);
    const changed = value !== this.value;
    this._silentSet('value', value);
    this._render();
    this._events();
    if (changed) this._emit('w-change', { value });
  }

  _allowedList(unit) {
    const attr = unit === 'hour' ? 'allowed-hours' : unit === 'minute' ? 'allowed-minutes' : 'allowed-seconds';
    return wNumberList(this.getAttribute(attr), []);
  }

  _isAllowed(unit, value, parts = this._parts()) {
    const list = this._allowedList(unit);
    if (list.length && !list.includes(value)) return false;

    const next = { ...parts };
    if (unit === 'hour') next.hour = value;
    if (unit === 'minute') next.minute = value;
    if (unit === 'second') next.second = value;

    const min = parseLimit(this.getAttribute('min'), { hour: 0, minute: 0, second: 0 });
    const max = parseLimit(this.getAttribute('max'), { hour: 23, minute: 59, second: 59 });
    const valueSeconds = timeValue(next, this.useSeconds);
    return valueSeconds >= timeValue(min, this.useSeconds) && valueSeconds <= timeValue(max, this.useSeconds);
  }

  _commitAbsoluteHour(hour, parts = this._parts()) {
    if (!this._isAllowed('hour', hour, parts)) return;
    parts.hour = hour;
    this._silentSet('period', hour >= 12 ? 'pm' : 'am');
    this._emit('w-update-hour', { value: hour });
    this._commit(parts);
  }

  _nextAllowed(unit, current, increment, parts, stepOverride) {
    const limit = unit === 'hour' ? 24 : 60;
    const step = stepOverride || (unit === 'hour' ? 1 : 5);
    for (let i = 0; i < limit; i += step) {
      current = (current + (increment ? step : -step) + limit) % limit;
      if (this._isAllowed(unit, current, parts)) return current;
    }
    return current;
  }
}

if (!customElements.get('w-time-picker')) customElements.define('w-time-picker', WTimePicker);
