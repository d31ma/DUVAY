/* <w-date-picker> — DuVay component module
 *
 * Vuetify's VDatePicker props are mapped onto plain HTML attributes:
 * - boolean props are bare attributes (`show-week`, `landscape`, `divided`)
 * - value props are strings (`view-mode="months"`, `weeks-in-month="static"`)
 * - array/record props (`weekdays`, `events`, `event-color`, `allowed-dates`,
 *   `allowed-months`, `allowed-years`) accept a JSON or comma-separated
 *   attribute, and the same names work as JavaScript properties when a
 *   function or live object is needed.
 *
 * `allowed-months` / `allowed-years` receive the value Vuetify passes: a
 * zero-based month index (0 = January) and a full year number.
 */
import { wDateBetween, wDateInRange, wFormatDate, wIsSameDate, wIsoDate, wNumberList, wParseIsoDate, wSetValue, wValueList } from './utils.js';
import {
  wAllowedBy,
  wCalendarColor,
  wCalendarJson,
  wCalendarWeekNumber,
  wCallSafe,
  wEventColorList,
  wMonthRows,
} from './calendar-utils.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ALL_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

// Bare numbers mean pixels, matching Vuetify's `string | number` sizing props.
function wCssSize(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  return /^-?\d*\.?\d+$/.test(raw) ? `${raw}px` : raw;
}

function wGridRows(items, columns) {
  let html = '';
  for (let index = 0; index < items.length; index += columns) {
    html += `<div class="w-date-picker-row" role="row">${items.slice(index, index + columns).join('')}</div>`;
  }
  return html;
}

export class WDatePicker extends WElement {
  static attrs = [
    'value', 'month', 'year', 'min', 'max', 'first-day-of-week', 'show-adjacent-months',
    'mode', 'view', 'title', 'hide-header',
    'text', 'multiple', 'header', 'transition', 'reverse-transition', 'divided',
    'weekdays', 'first-day-of-year', 'events', 'event-color', 'show-week',
    'next-icon', 'prev-icon', 'landscape', 'hide-title', 'header-color',
    'header-date-format', 'landscape-header-width', 'control-height', 'control-variant',
    'no-month-picker', 'mode-icon', 'view-mode', 'hide-weekdays', 'no-auto-navigation',
    'weeks-in-month', 'allowed-dates', 'preview-value', 'allowed-months', 'allowed-years',
    'columns',
  ];

  set value(v) { wSetValue(this, v); }
  get value() { return this._attr('value', ''); }
  get min() { return wParseIsoDate(this._attr('min', '')); }
  get max() { return wParseIsoDate(this._attr('max', '')); }
  get title() { return this._attr('title', 'Select date'); }
  get text() { return this._attr('text', ''); }
  get header() { return this._attr('header', 'No date selected'); }
  get hideHeader() { return this._bool('hide-header'); }
  get hideTitle() { return this._bool('hide-title'); }
  get hideWeekdays() { return this._bool('hide-weekdays'); }
  get showWeek() { return this._bool('show-week'); }
  get landscape() { return this._bool('landscape'); }
  get divided() { return this._bool('divided'); }
  get noMonthPicker() { return this._bool('no-month-picker'); }
  get noAutoNavigation() { return this._bool('no-auto-navigation'); }
  get showAdjacentMonths() { return this._bool('show-adjacent-months'); }
  get prevIcon() { return this._attr('prev-icon', '‹'); }
  get nextIcon() { return this._attr('next-icon', '›'); }
  get modeIcon() { return this._attr('mode-icon', '▾'); }
  get transition() { return this._attr('transition', ''); }
  get reverseTransition() { return this._attr('reverse-transition', ''); }
  get headerColor() { return this._attr('header-color', ''); }
  get controlHeight() { return wCssSize(this._attr('control-height', '')); }
  get landscapeHeaderWidth() { return wCssSize(this._attr('landscape-header-width', '')); }
  get columns() { return Math.max(0, Math.trunc(this._num('columns', 0))); }
  get firstDayOfYear() { return this._num('first-day-of-year', 4); }

  get controlVariant() {
    return this._attr('control-variant', 'docked') === 'modal' ? 'modal' : 'docked';
  }

  get weeksInMonth() {
    return this._attr('weeks-in-month', 'dynamic') === 'static' ? 'static' : 'dynamic';
  }

  get month() {
    if (this.hasAttribute('month')) return parseInt(this._attr('month', ''), 10) || 1;
    return this._displayDate().getMonth() + 1;
  }

  get year() {
    if (this.hasAttribute('year')) return parseInt(this._attr('year', ''), 10) || new Date().getFullYear();
    return this._displayDate().getFullYear();
  }

  get view() {
    const view = this._attr('view', '') || this._viewModeAlias();
    return view === 'months' || view === 'years' ? view : 'date';
  }

  get firstDayOfWeek() {
    const n = parseInt(this._attr('first-day-of-week', '0'), 10);
    return Number.isNaN(n) ? 0 : ((n % 7) + 7) % 7;
  }

  get mode() {
    const m = this._attr('mode', '');
    if (m === 'multiple' || m === 'range') return m;
    if (m === 'single') return 'single';
    return this._multipleMode();
  }

  // Vuetify's `multiple` doubles as a cap on how many dates can be picked.
  get multipleLimit() {
    const raw = Number(this.getAttribute('multiple'));
    return Number.isFinite(raw) && raw > 0 ? raw : 0;
  }

  get weekdays() {
    const raw = this.getAttribute('weekdays');
    if (raw == null) return null;
    const list = [...new Set(wNumberList(raw, []).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6))];
    return list.length ? list : null;
  }

  get events() {
    if (this._eventsInput !== undefined) return this._eventsInput;
    return wCalendarJson(this.getAttribute('events'), null);
  }
  set events(value) { this._eventsInput = value; this._refresh(); }

  get eventColor() {
    if (this._eventColorInput !== undefined) return this._eventColorInput;
    const raw = this.getAttribute('event-color');
    if (raw == null) return 'primary';
    return wCalendarJson(raw, raw);
  }
  set eventColor(value) { this._eventColorInput = value; this._refresh(); }

  get allowedDates() { return this._allowRule('allowed-dates', this._allowedDatesInput, false); }
  set allowedDates(value) { this._allowedDatesInput = value; this._refresh(); }

  get allowedMonths() { return this._allowRule('allowed-months', this._allowedMonthsInput, true); }
  set allowedMonths(value) { this._allowedMonthsInput = value; this._refresh(); }

  get allowedYears() { return this._allowRule('allowed-years', this._allowedYearsInput, true); }
  set allowedYears(value) { this._allowedYearsInput = value; this._refresh(); }

  /* Attribute readers */

  _num(name, fallback) {
    const raw = this.getAttribute(name);
    const value = Number(raw);
    return raw != null && raw !== '' && Number.isFinite(value) ? value : fallback;
  }

  _viewModeAlias() {
    const mode = this._attr('view-mode', '');
    if (mode === 'year') return 'years';
    if (mode === 'months') return 'months';
    return 'date';
  }

  _multipleMode() {
    const raw = this.getAttribute('multiple');
    if (raw == null || raw === 'false') return 'single';
    return raw === 'range' ? 'range' : 'multiple';
  }

  _allowRule(name, override, numeric) {
    if (override !== undefined) return override;
    const raw = this.getAttribute(name);
    if (raw == null) return null;
    return numeric ? wNumberList(raw, []) : wValueList(raw);
  }

  /* Selection state */

  _selectedDates() {
    if (this.mode === 'single') {
      const d = wParseIsoDate(this.value);
      return d ? [d] : [];
    }
    if (this.mode === 'multiple') {
      return this.value.split(',').map((s) => wParseIsoDate(s.trim())).filter(Boolean);
    }
    const parts = this.value.split(',').map((s) => s.trim());
    const start = wParseIsoDate(parts[0] || '');
    const end = wParseIsoDate(parts[1] || '');
    return start && end ? [start, end] : start ? [start] : [];
  }

  _isSelected(date) {
    return this._selectedDates().some((d) => wIsSameDate(d, date));
  }

  _rangeState() {
    const dates = this._selectedDates();
    if (this.mode !== 'range' || dates.length < 2) return null;
    return { start: dates[0], end: dates[1] };
  }

  _previewState() {
    const preview = wParseIsoDate(this._attr('preview-value', ''));
    const dates = this._selectedDates();
    if (!preview || this.mode !== 'range' || dates.length !== 1) return null;
    return { start: dates[0], end: preview };
  }

  // The month/year on screen follows the selection unless the author pinned it
  // with explicit `month`/`year` attributes or opted out with no-auto-navigation.
  _displayDate() {
    if (this.noAutoNavigation) return new Date();
    return this._selectedDates()[0] || new Date();
  }

  /* Template */

  _template() {
    const body = this.view === 'years' ? this._yearsTemplate()
      : this.view === 'months' ? this._monthsTemplate()
        : this._daysTemplate();
    return `<div class="${this._rootClass()}" role="application" aria-label="Calendar"${this._rootStyle()}>`
      + this._titleTemplate()
      + this._headerTemplate()
      + this._bodyTemplate(body)
      + '</div>';
  }

  _rootClass() {
    return `w-date-picker w-date-picker--view-${this.view}` + this._cls({
      'w-date-picker--landscape': this.landscape,
      'w-date-picker--divided': this.divided,
      'w-date-picker--show-week': this.showWeek,
      'w-date-picker--header-color': this.headerColor,
      [`w-date-picker--control-${this.controlVariant}`]: true,
    });
  }

  _rootStyle() {
    const style = [
      this.controlHeight && `--w-date-picker-control-height:${this.controlHeight}`,
      this.landscapeHeaderWidth && `--w-date-picker-landscape-header-width:${this.landscapeHeaderWidth}`,
      this.headerColor && `--w-date-picker-header-color:${wCalendarColor(this.headerColor, 'primary')}`,
    ].filter(Boolean).join(';');
    return style ? ` style="${this._esc(style)}"` : '';
  }

  _titleTemplate() {
    if (this.hideHeader) return '';
    const title = this.hideTitle ? '' : `<span>${this._esc(this.title)}</span>`;
    const text = this.text ? `<small class="w-date-picker-text">${this._esc(this.text)}</small>` : '';
    return `<div class="w-date-picker-picker-title">${title}<strong>${this._esc(this._selectionLabel())}</strong>${text}</div>`;
  }

  _headerTemplate() {
    return this.controlVariant === 'modal' ? this._modalHeader() : this._dockedHeader();
  }

  _dockedHeader() {
    return `<div class="w-date-picker-header">`
      + this._navButton('prev')
      + `<button class="w-date-picker-title" type="button" aria-label="Change calendar view">${this._esc(this._monthYearLabel())}</button>`
      + this._navButton('next')
      + '</div>';
  }

  _modalHeader() {
    const target = this.noMonthPicker ? 'years' : 'months';
    return `<div class="w-date-picker-header w-date-picker-header--modal">`
      + `<button class="w-date-picker-title" type="button" data-view-target="${target}"`
      + ` aria-expanded="${this.view === target}" aria-label="Change calendar view">${this._esc(this._modalLabel())}</button>`
      + `<button class="w-date-picker-mode" type="button" aria-label="Toggle year selection"`
      + ` aria-expanded="${this.view === 'years'}">${this._esc(this.modeIcon)}</button>`
      + `<span class="w-date-picker-header__nav">${this._navButton('prev')}${this._navButton('next')}</span>`
      + '</div>';
  }

  _navButton(direction) {
    const delta = direction === 'prev' ? -1 : 1;
    const icon = direction === 'prev' ? this.prevIcon : this.nextIcon;
    return `<button class="w-date-picker-nav w-date-picker-nav--${direction}" type="button"`
      + ` aria-label="${this._esc(this._navLabel(delta))}">${this._esc(icon)}</button>`;
  }

  _bodyTemplate(body) {
    const name = this._transitionName();
    return `<div class="w-date-picker-body${this._cls({ [`w-date-picker-body--transition-${name}`]: name })}"`
      + this._attrs({ 'data-transition': name })
      + `>${body}</div>`;
  }

  _transitionName() {
    const name = this._navDelta < 0 ? this.reverseTransition : this.transition;
    return String(name || '').trim();
  }

  _selectionLabel() {
    const dates = this._selectedDates();
    if (!dates.length) return this.header;
    if (this.mode === 'range' && dates.length === 2) {
      return `${this._headerDate(dates[0])} – ${this._headerDate(dates[1])}`;
    }
    if (this.mode === 'multiple') return `${dates.length} selected`;
    return this._headerDate(dates[0], { weekday: 'short', month: 'short', day: 'numeric' });
  }

  _headerDate(date, options) {
    const format = this._attr('header-date-format', '');
    if (format) return wFormatDate(date, format);
    return date.toLocaleDateString(undefined, options);
  }

  _modalLabel() {
    return new Date(this.year, this.month - 1, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' });
  }

  _monthYearLabel() {
    if (this.view === 'months') return String(this.year);
    if (this.view === 'years') {
      const start = this._yearPageStart();
      return `${start} - ${start + 11}`;
    }
    return this._modalLabel();
  }

  _navLabel(delta) {
    if (this.view === 'years') return delta < 0 ? 'Previous years' : 'Next years';
    if (this.view === 'months') return delta < 0 ? 'Previous year' : 'Next year';
    return delta < 0 ? 'Previous month' : 'Next month';
  }

  /* Day grid */

  _daysTemplate() {
    const rows = wMonthRows({
      year: this.year,
      month: this.month,
      firstDayOfWeek: this.firstDayOfWeek,
      showAdjacentMonths: this.showAdjacentMonths,
      weeksInMonth: this.weeksInMonth,
      weekdays: this.weekdays,
    });
    const range = this._rangeState();
    const preview = this._previewState();
    const columns = (this.weekdays || ALL_WEEKDAYS).length + (this.showWeek ? 1 : 0);
    const body = rows.map((row) => this._rowTemplate(row, range, preview)).join('');
    return `<div class="w-date-picker-grid" role="grid" style="--w-date-picker-columns:${columns}">`
      + this._weekdaysTemplate() + body + '</div>';
  }

  // The grid stays a flat sequence of cells so that consumers which decorate it
  // (w-date-input) can keep indexing columns as `position % columns`.
  _weekdaysTemplate() {
    if (this.hideWeekdays) return '';
    const week = this.showWeek
      ? '<div class="w-date-picker-weekday w-date-picker-weekday--week" role="columnheader" aria-label="Week">#</div>'
      : '';
    const cells = this._weekdayLabels()
      .map((label) => `<div class="w-date-picker-weekday" role="columnheader">${label}</div>`)
      .join('');
    return week + cells;
  }

  _weekdayLabels() {
    const allowed = this.weekdays;
    const first = this.firstDayOfWeek;
    return ALL_WEEKDAYS
      .map((index) => (first + index) % 7)
      .filter((day) => !allowed || allowed.includes(day))
      .map((day) => WEEKDAY_LABELS[day]);
  }

  _rowTemplate(row, range, preview) {
    const number = wCalendarWeekNumber(row.weekStart, this.firstDayOfWeek, this.firstDayOfYear);
    const week = this.showWeek
      ? `<div class="w-date-picker-week" role="rowheader" aria-label="Week ${number}">${number}</div>`
      : '';
    const cells = row.cells.map((cell) => this._cellTemplate(cell, range, preview)).join('');
    return week + cells;
  }

  _cellTemplate(cell, range, preview) {
    if (cell.type === 'spacer') return '<span class="w-date-picker-spacer"></span>';
    if (cell.type !== 'day') return '';
    return this._dayButton(cell, range, preview);
  }

  _dayButton(cell, range, preview) {
    const date = cell.date;
    const disabled = !this._dateAllowed(cell.iso, date);
    const selected = this._isSelected(date);
    const classes = ['w-date-picker-day'];
    if (cell.adjacent) classes.push('other-month');
    if (disabled) classes.push('disabled');
    if (wIsSameDate(date, new Date())) classes.push('today');
    if (selected) classes.push('selected');
    if (range) classes.push(...this._rangeClasses(date, range));
    if (preview) classes.push(...this._previewClasses(date, preview));
    return `<button class="${classes.join(' ')}" type="button" role="gridcell" data-date="${cell.iso}"`
      + this._attrs({ disabled, 'aria-disabled': disabled && 'true' })
      + ` aria-selected="${selected}">${cell.day}${this._eventDots(cell.iso)}</button>`;
  }

  _dateAllowed(iso, date) {
    return wDateInRange(date, this.min, this.max) && wAllowedBy(this.allowedDates, iso);
  }

  _rangeClasses(date, range) {
    const { start, end } = range;
    const isStart = wIsSameDate(date, start);
    const isEnd = wIsSameDate(date, end);
    const classes = [];
    if (isStart) classes.push('range-start');
    if (isEnd) classes.push('range-end');
    if (!isStart && !isEnd && wDateBetween(date, start, end)) classes.push('in-range');
    return classes;
  }

  _previewClasses(date, preview) {
    if (wIsSameDate(date, preview.end)) return ['preview-end'];
    if (wIsSameDate(date, preview.start)) return [];
    return wDateBetween(date, preview.start, preview.end) ? ['in-preview'] : [];
  }

  /* Event dots */

  _eventEntry(iso) {
    const source = this.events;
    if (typeof source === 'function') return wCallSafe(source, iso);
    if (Array.isArray(source)) return source.includes(iso);
    if (source && typeof source === 'object') return source[iso];
    return false;
  }

  _eventColorEntry(iso) {
    const source = this.eventColor;
    if (typeof source === 'function') return wCallSafe(source, iso);
    if (source && typeof source === 'object' && !Array.isArray(source)) return source[iso];
    return source;
  }

  _eventColors(iso) {
    const entry = this._eventEntry(iso);
    if (!entry) return [];
    const own = wEventColorList(entry);
    if (own.length) return own;
    const fallback = wEventColorList(this._eventColorEntry(iso));
    return fallback.length ? fallback : [wCalendarColor('primary')];
  }

  _eventDots(iso) {
    const colors = this._eventColors(iso);
    if (!colors.length) return '';
    const dots = colors.slice(0, 3).map((color) => (
      `<i class="w-date-picker-event" style="--w-date-picker-event-color:${this._esc(color)}"></i>`
    )).join('');
    return `<span class="w-date-picker-events" aria-hidden="true">${dots}</span>`;
  }

  /* Month / year grids */

  _monthsTemplate() {
    const columns = this.columns || 3;
    const buttons = MONTHS.map((label, index) => this._monthButton(label, index));
    return `<div class="w-date-picker-months" role="grid" style="--w-date-picker-columns:${columns}">`
      + wGridRows(buttons, columns) + '</div>';
  }

  _monthButton(label, index) {
    const selected = index + 1 === this.month;
    const disabled = !this._monthAllowed(index);
    return `<button class="w-date-picker-month${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}"`
      + ` type="button" role="gridcell" data-month="${index + 1}" aria-selected="${selected}"`
      + this._attrs({ disabled, 'aria-disabled': disabled && 'true' })
      + `>${label}</button>`;
  }

  _monthAllowed(index) {
    if (!wAllowedBy(this.allowedMonths, index)) return false;
    return this._inMonthRange(this.year, index);
  }

  _inMonthRange(year, index) {
    const min = this.min;
    const max = this.max;
    if (min && new Date(year, index + 1, 0, 12) < min) return false;
    if (max && new Date(year, index, 1, 12) > max) return false;
    return true;
  }

  _yearsTemplate() {
    const columns = this.columns || 3;
    const buttons = this._yearsList().map((year) => this._yearButton(year));
    return `<div class="w-date-picker-years" role="grid" style="--w-date-picker-columns:${columns}">`
      + wGridRows(buttons, columns) + '</div>';
  }

  _yearsList() {
    const start = this._yearPageStart();
    return Array.from({ length: 12 }, (_, index) => start + index);
  }

  _yearButton(year) {
    const selected = year === this.year;
    const disabled = !this._yearAllowed(year);
    return `<button class="w-date-picker-year${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}"`
      + ` type="button" role="gridcell" data-year="${year}" aria-selected="${selected}"`
      + this._attrs({ disabled, 'aria-disabled': disabled && 'true' })
      + `>${year}</button>`;
  }

  _yearAllowed(year) {
    if (!wAllowedBy(this.allowedYears, year)) return false;
    const min = this.min;
    const max = this.max;
    if (min && year < min.getFullYear()) return false;
    return !(max && year > max.getFullYear());
  }

  _yearPageStart() {
    return Math.floor(this.year / 12) * 12;
  }

  /* Behaviour */

  _events() {
    this._q('.w-date-picker-nav--prev')?.addEventListener('click', () => this._shiftView(-1));
    this._q('.w-date-picker-nav--next')?.addEventListener('click', () => this._shiftView(1));
    this._q('.w-date-picker-title')?.addEventListener('click', () => this._onTitleClick());
    this._q('.w-date-picker-mode')?.addEventListener('click', () => this._toggleView('years'));
    this._q('.w-date-picker-grid')?.addEventListener('pointerleave', () => this._setPreview(''));

    this._qAll('[data-date]').forEach((button) => {
      button.addEventListener('click', () => {
        const date = wParseIsoDate(button.getAttribute('data-date'));
        if (date) this._select(date);
      });
      button.addEventListener('keydown', (event) => this._onDayKeyDown(event, button));
      button.addEventListener('pointerenter', () => this._setPreview(button.getAttribute('data-date')));
    });
    this._qAll('[data-month]').forEach((button) => {
      button.addEventListener('click', () => this._selectMonth(Number(button.getAttribute('data-month'))));
    });
    this._qAll('[data-year]').forEach((button) => {
      button.addEventListener('click', () => this._selectYear(Number(button.getAttribute('data-year'))));
    });
  }

  _refresh() {
    if (!this._rendered) return;
    this._render();
    this._events();
  }

  _onTitleClick() {
    const target = this._q('.w-date-picker-title')?.getAttribute('data-view-target');
    if (target) this._toggleView(target);
    else this._cycleView();
  }

  _toggleView(view) {
    this._setView(this.view === view ? 'date' : view);
  }

  _cycleView() {
    const next = this.view === 'date' ? 'months' : this.view === 'months' ? 'years' : 'date';
    this._setView(next);
  }

  _setView(view) {
    this._silentSet('view', view);
    if (this.hasAttribute('view-mode')) this._silentSet('view-mode', this._viewModeFor(view));
    this._render();
    this._events();
  }

  _viewModeFor(view) {
    if (view === 'years') return 'year';
    return view === 'months' ? 'months' : 'month';
  }

  _selectMonth(month) {
    if (!this._monthAllowed(month - 1)) return;
    this._silentSet('month', month);
    this._setView('date');
    this._emit('change', { month, year: this.year, view: 'date' });
  }

  _selectYear(year) {
    if (!this._yearAllowed(year)) return;
    this._silentSet('year', year);
    this._setView('months');
    this._emit('change', { month: this.month, year, view: 'months' });
  }

  _shiftView(delta) {
    this._navDelta = delta;
    if (this.view === 'years') {
      this._silentSet('year', this.year + delta * 12);
    } else if (this.view === 'months') {
      this._silentSet('year', this.year + delta);
    } else {
      const d = new Date(this.year, this.month - 1 + delta, 1);
      this._silentSet('month', d.getMonth() + 1);
      this._silentSet('year', d.getFullYear());
    }
    this._render();
    this._events();
    this._emit('change', { month: this.month, year: this.year, view: this.view });
  }

  _onDayKeyDown(event, button) {
    const current = wParseIsoDate(button.getAttribute('data-date'));
    if (!current) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._select(current);
      return;
    }
    const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[event.key];
    if (!delta) return;
    event.preventDefault();
    const next = new Date(current);
    next.setDate(current.getDate() + delta);
    this._focusDate(next, delta);
  }

  _focusDate(next, delta) {
    const nextIso = wIsoDate(next);
    let nextButton = this._q(`[data-date="${nextIso}"]`);
    if (!nextButton) {
      this._navDelta = delta;
      this._silentSet('month', next.getMonth() + 1);
      this._silentSet('year', next.getFullYear());
      this._render();
      this._events();
      this._emit('change', { month: next.getMonth() + 1, year: next.getFullYear(), view: this.view });
      nextButton = this._q(`[data-date="${nextIso}"]`);
    }
    if (nextButton) nextButton.focus();
  }

  _setPreview(iso) {
    if (this.mode !== 'range' || this._selectedDates().length !== 1) return;
    if (this._attr('preview-value', '') === iso) return;
    this._silentSet('preview-value', iso || null);
    this._applyPreviewClasses();
  }

  _applyPreviewClasses() {
    const preview = this._previewState();
    this._qAll('[data-date]').forEach((button) => {
      const date = wParseIsoDate(button.getAttribute('data-date'));
      const classes = preview && date ? this._previewClasses(date, preview) : [];
      button.classList.toggle('in-preview', classes.includes('in-preview'));
      button.classList.toggle('preview-end', classes.includes('preview-end'));
    });
  }

  _select(date) {
    if (!this._dateAllowed(wIsoDate(date), date)) return;
    const nextValue = this._nextValue(date);
    this._silentSet('value', nextValue);
    this._silentSet('preview-value', null);
    this._render();
    this._events();
    this._emit('change', { value: nextValue });
  }

  _nextValue(date) {
    if (this.mode === 'single') return wIsoDate(date);
    if (this.mode === 'multiple') return this._nextMultiple(date);
    return this._nextRange(date);
  }

  _nextMultiple(date) {
    const dates = this._selectedDates();
    const index = dates.findIndex((d) => wIsSameDate(d, date));
    const limit = this.multipleLimit;
    if (index >= 0) dates.splice(index, 1);
    else if (!limit || dates.length < limit) dates.push(date);
    return dates.map(wIsoDate).join(',');
  }

  _nextRange(date) {
    const dates = this._selectedDates();
    if (dates.length === 0 || dates.length === 2) return wIsoDate(date);
    const ordered = [dates[0], date].sort((a, b) => a.getTime() - b.getTime());
    return `${wIsoDate(ordered[0])},${wIsoDate(ordered[1])}`;
  }
}

if (!customElements.get('w-date-picker')) customElements.define('w-date-picker', WDatePicker);
