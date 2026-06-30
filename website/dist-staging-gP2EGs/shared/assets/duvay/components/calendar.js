/* <w-calendar> — responsive month, week, day, and category scheduler.
 *
 * Vuetify-compatible concepts are adapted to vanilla HTML attributes:
 * - `value` is the active date.
 * - arrays (`events`, `categories`, `weekdays`) accept JSON attributes or
 *   JavaScript arrays assigned as properties.
 * - function-valued formatters and event accessors are JavaScript properties.
 * - native `input`, `change`, and `click` events expose metadata in `detail`.
 */
import { wBoolAttr, wValueList } from './utils.js';
import {
  wCalendarAddDays,
  wCalendarAddMonths,
  wCalendarColor,
  wCalendarDate,
  wCalendarDay,
  wCalendarDays,
  wCalendarEndOfWeek,
  wCalendarHasTime,
  wCalendarIso,
  wCalendarJson,
  wCalendarMinutes,
  wCalendarStartOfWeek,
  wCalendarWeekNumber,
} from './calendar-utils.js';

const VIEW_TYPES = new Set([
  'month',
  'week',
  'day',
  '4day',
  'custom-weekly',
  'custom-daily',
  'category',
]);

export class WCalendar extends WElement {
  static attrs = [
    'value', 'type', 'start', 'end', 'month', 'year', 'min', 'max',
    'weekdays', 'first-day-of-week', 'first-day-of-year', 'locale', 'now',
    'format', 'short-weekdays', 'short-months', 'show-month-on-first',
    'show-week', 'hide-header', 'min-weeks', 'max-days',
    'events', 'event-start', 'event-end', 'event-timed', 'event-category',
    'event-height', 'event-color', 'event-text-color', 'event-name',
    'event-overlap-threshold', 'event-overlap-mode', 'event-more',
    'event-more-text', 'event-ripple', 'event-margin-bottom', 'event-draggable',
    'interval-height', 'interval-width', 'interval-minutes', 'first-interval',
    'first-time', 'interval-count', 'interval-highlight', 'short-intervals',
    'categories', 'category-days', 'category-text', 'category-hide-dynamic',
    'category-show-all', 'category-for-invalid',
  ];

  get value() { return this._attr('value', ''); }
  set value(next) {
    const parsed = wCalendarDate(next);
    if (!parsed) return;
    this._silentSet('value', wCalendarIso(parsed));
    this._refresh();
  }

  get type() {
    const value = this._attr('type', 'month');
    return VIEW_TYPES.has(value) ? value : 'month';
  }

  get events() {
    if (this._eventsInput !== undefined) return Array.isArray(this._eventsInput) ? this._eventsInput : [];
    const parsed = wCalendarJson(this.getAttribute('events'), []);
    return Array.isArray(parsed) ? parsed : [];
  }
  set events(value) {
    this._eventsInput = value;
    this._refresh();
  }

  get categories() {
    if (this._categoriesInput !== undefined) return this._categoriesInput;
    const value = this.getAttribute('categories');
    if (!value) return [];
    const parsed = wCalendarJson(value, null);
    return Array.isArray(parsed) ? parsed : wValueList(value);
  }
  set categories(value) {
    this._categoriesInput = Array.isArray(value) ? value : [];
    this._refresh();
  }

  get weekdays() {
    if (this._weekdaysInput !== undefined) return this._normalizeWeekdays(this._weekdaysInput);
    const value = this.getAttribute('weekdays');
    if (!value) return this._orderedWeekdays([0, 1, 2, 3, 4, 5, 6]);
    const parsed = wCalendarJson(value, null);
    return this._normalizeWeekdays(Array.isArray(parsed) ? parsed : wValueList(value));
  }
  set weekdays(value) {
    this._weekdaysInput = value;
    this._refresh();
  }

  get dayFormat() { return this._dayFormatInput; }
  set dayFormat(value) { this._dayFormatInput = value; this._refresh(); }
  get weekdayFormat() { return this._weekdayFormatInput; }
  set weekdayFormat(value) { this._weekdayFormatInput = value; this._refresh(); }
  get monthFormat() { return this._monthFormatInput; }
  set monthFormat(value) { this._monthFormatInput = value; this._refresh(); }
  get intervalFormat() { return this._intervalFormatInput; }
  set intervalFormat(value) { this._intervalFormatInput = value; this._refresh(); }
  get intervalStyle() { return this._intervalStyleInput; }
  set intervalStyle(value) { this._intervalStyleInput = value; this._refresh(); }
  get showIntervalLabel() { return this._showIntervalLabelInput; }
  set showIntervalLabel(value) { this._showIntervalLabelInput = value; this._refresh(); }
  get firstTime() { return this._firstTimeInput ?? this.getAttribute('first-time'); }
  set firstTime(value) { this._firstTimeInput = value; this._refresh(); }
  get start() { return this._startInput ?? this.getAttribute('start'); }
  set start(value) { this._startInput = value; this._refresh(); }
  get end() { return this._endInput ?? this.getAttribute('end'); }
  set end(value) { this._endInput = value; this._refresh(); }
  get categoryText() { return this._categoryTextInput ?? this._attr('category-text', 'name'); }
  set categoryText(value) { this._categoryTextInput = value; this._refresh(); }
  get eventName() { return this._eventNameInput ?? this._attr('event-name', 'name'); }
  set eventName(value) { this._eventNameInput = value; this._refresh(); }
  get eventColor() { return this._eventColorInput ?? this._attr('event-color', 'primary'); }
  set eventColor(value) { this._eventColorInput = value; this._refresh(); }
  get eventTextColor() { return this._eventTextColorInput ?? this._attr('event-text-color', ''); }
  set eventTextColor(value) { this._eventTextColorInput = value; this._refresh(); }
  get eventTimed() { return this._eventTimedInput ?? this._attr('event-timed', 'timed'); }
  set eventTimed(value) { this._eventTimedInput = value; this._refresh(); }
  get eventCategory() { return this._eventCategoryInput ?? this._attr('event-category', 'category'); }
  set eventCategory(value) { this._eventCategoryInput = value; this._refresh(); }
  get eventRipple() {
    if (this._eventRippleInput !== undefined) return this._eventRippleInput;
    return wBoolAttr(this, 'event-ripple', false);
  }
  set eventRipple(value) { this._eventRippleInput = value; this._refresh(); }
  get eventDraggable() { return wBoolAttr(this, 'event-draggable', false); }
  get eventOverlapMode() {
    if (typeof this._eventOverlapModeInput === 'function') return this._eventOverlapModeInput;
    return this._attr('event-overlap-mode', 'stack') === 'column' ? 'column' : 'stack';
  }
  set eventOverlapMode(value) { this._eventOverlapModeInput = value; this._refresh(); }
  get dayContent() { return this._dayContentInput; }
  set dayContent(value) { this._dayContentInput = value; this._refresh(); }
  get dayBodyContent() { return this._dayBodyContentInput; }
  set dayBodyContent(value) { this._dayBodyContentInput = value; this._refresh(); }
  get dayHeaderContent() { return this._dayHeaderContentInput; }
  set dayHeaderContent(value) { this._dayHeaderContentInput = value; this._refresh(); }
  get eventContent() { return this._eventContentInput; }
  set eventContent(value) { this._eventContentInput = value; this._refresh(); }
  get intervalContent() { return this._intervalContentInput; }
  set intervalContent(value) { this._intervalContentInput = value; this._refresh(); }
  get intervalHeaderContent() { return this._intervalHeaderContentInput; }
  set intervalHeaderContent(value) { this._intervalHeaderContentInput = value; this._refresh(); }
  get categoryContent() { return this._categoryContentInput; }
  set categoryContent(value) { this._categoryContentInput = value; this._refresh(); }

  get locale() { return this._attr('locale', document.documentElement.lang || 'en-US'); }
  get title() { return this._title(this._range()); }
  get times() {
    const now = this._now();
    return {
      now: { ...this._dayScope(now), hour: now.getHours(), minute: now.getMinutes() },
      today: wCalendarIso(now),
    };
  }
  get firstDayOfWeek() { return this._boundedInt('first-day-of-week', 0, 0, 6); }
  get firstDayOfYear() { return this._boundedInt('first-day-of-year', 4, 1, 7); }
  get minWeeks() { return this._boundedInt('min-weeks', 1, 1, 8); }
  get maxDays() { return this._boundedInt('max-days', 7, 1, 366); }
  get categoryDays() { return this._boundedInt('category-days', 1, 1, 31); }
  get intervalHeight() { return Math.max(24, this._numberAttr('interval-height', 48)); }
  get intervalWidth() { return Math.max(44, this._numberAttr('interval-width', 60)); }
  get intervalMinutes() { return Math.max(1, this._numberAttr('interval-minutes', 60)); }
  get firstInterval() { return Math.max(0, this._numberAttr('first-interval', 0)); }
  get intervalCount() { return Math.max(1, Math.floor(this._numberAttr('interval-count', 24))); }
  get eventHeight() { return Math.max(16, this._numberAttr('event-height', 20)); }
  get eventMarginBottom() { return Math.max(0, this._numberAttr('event-margin-bottom', 1)); }
  get eventOverlapThreshold() { return Math.max(0, this._numberAttr('event-overlap-threshold', 60)); }
  get shortWeekdays() { return wBoolAttr(this, 'short-weekdays', true); }
  get shortMonths() { return wBoolAttr(this, 'short-months', true); }
  get showMonthOnFirst() { return wBoolAttr(this, 'show-month-on-first', true); }
  get showWeek() { return wBoolAttr(this, 'show-week', false); }
  get hideHeader() { return wBoolAttr(this, 'hide-header', false); }
  get eventMore() { return wBoolAttr(this, 'event-more', true); }
  get intervalHighlight() { return wBoolAttr(this, 'interval-highlight', false); }
  get shortIntervals() { return wBoolAttr(this, 'short-intervals', true); }
  get categoryHideDynamic() { return wBoolAttr(this, 'category-hide-dynamic', false); }
  get categoryShowAll() { return wBoolAttr(this, 'category-show-all', false); }

  _numberAttr(name, fallback) {
    const raw = this.getAttribute(name);
    if (raw == null || raw === '') return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }

  _boundedInt(name, fallback, min, max) {
    return Math.min(max, Math.max(min, Math.floor(this._numberAttr(name, fallback))));
  }

  _normalizeWeekdays(values) {
    const normalized = [...new Set((Array.isArray(values) ? values : [])
      .map(Number)
      .filter((value) => Number.isInteger(value) && value >= 0 && value <= 6))];
    return this._orderedWeekdays(normalized.length ? normalized : [0, 1, 2, 3, 4, 5, 6]);
  }

  _orderedWeekdays(values) {
    return [...values].sort((a, b) => (
      (a - this.firstDayOfWeek + 7) % 7
      - (b - this.firstDayOfWeek + 7) % 7
    ));
  }

  _now() {
    return wCalendarDate(this._attr('now', ''), new Date()) || new Date();
  }

  _anchor() {
    const fallback = wCalendarDate(this.start, this._now()) || this._now();
    const selected = wCalendarDate(this.value, fallback) || fallback;
    const month = this.hasAttribute('month') ? this._boundedInt('month', selected.getMonth() + 1, 1, 12) : selected.getMonth() + 1;
    const year = this.hasAttribute('year') ? this._boundedInt('year', selected.getFullYear(), 1, 9999) : selected.getFullYear();
    const lastDay = new Date(year, month, 0).getDate();
    return new Date(year, month - 1, Math.min(selected.getDate(), lastDay), 12);
  }

  _range() {
    const anchor = this._anchor();
    if (this.type === 'month') {
      return {
        start: new Date(anchor.getFullYear(), anchor.getMonth(), 1, 12),
        end: new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0, 12),
      };
    }
    if (this.type === 'week') {
      return {
        start: wCalendarStartOfWeek(anchor, this.firstDayOfWeek),
        end: wCalendarEndOfWeek(anchor, this.firstDayOfWeek),
      };
    }
    if (this.type === 'day') return { start: anchor, end: anchor };
    if (this.type === '4day') return { start: anchor, end: wCalendarAddDays(anchor, 3) };
    if (this.type === 'category') return { start: anchor, end: wCalendarAddDays(anchor, this.categoryDays - 1) };

    const start = wCalendarDate(this.start, anchor) || anchor;
    const fallbackEnd = wCalendarAddDays(start, this.maxDays - 1);
    const end = wCalendarDate(this.end, fallbackEnd) || fallbackEnd;
    return { start, end: end < start ? start : end };
  }

  _title(range) {
    const month = (date, style = 'long') => new Intl.DateTimeFormat(this.locale, {
      month: style,
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1)));
    if (range.start.getFullYear() === range.end.getFullYear() && range.start.getMonth() === range.end.getMonth()) {
      if (this.type === 'month') return `${month(range.start)} ${range.start.getFullYear()}`;
      if (range.start.getDate() === range.end.getDate()) {
        return new Intl.DateTimeFormat(this.locale, {
          month: 'long', day: 'numeric', year: 'numeric',
        }).format(range.start);
      }
      return `${month(range.start, 'short')} ${range.start.getDate()}–${range.end.getDate()}, ${range.start.getFullYear()}`;
    }
    const start = `${month(range.start, 'short')} ${range.start.getDate()}${range.start.getFullYear() !== range.end.getFullYear() ? `, ${range.start.getFullYear()}` : ''}`;
    const end = `${month(range.end, 'short')} ${range.end.getDate()}, ${range.end.getFullYear()}`;
    return `${start} – ${end}`;
  }

  _template() {
    const range = this._range();
    const events = this._parsedEvents();
    const classes = [
      'w-calendar',
      `w-calendar--${this.type}`,
      this.showWeek ? 'w-calendar--show-week' : '',
      events.length ? 'w-calendar--with-events' : '',
    ].filter(Boolean).join(' ');

    const header = this.hideHeader ? '' : this._headerTemplate(range);
    let body;
    if (this.type === 'month' || this.type === 'custom-weekly') {
      body = this._monthTemplate(range, events);
    } else if (this.type === 'category') {
      body = this._categoryTemplate(range, events);
    } else {
      body = this._scheduleTemplate(range, events);
    }

    return `<section class="${classes}" aria-label="${this._esc(this._title(range))}" data-view="${this.type}">
      ${header}
      ${body}
    </section>`;
  }

  _headerTemplate(range) {
    return `<header class="w-calendar-header">
      <div class="w-calendar-header__nav">
        <button class="w-calendar-nav" type="button" data-calendar-nav="prev" aria-label="Previous period">‹</button>
        <button class="w-calendar-today" type="button" data-calendar-nav="today">Today</button>
        <button class="w-calendar-nav" type="button" data-calendar-nav="next" aria-label="Next period">›</button>
      </div>
      <strong class="w-calendar-title" aria-live="polite">${this._esc(this._title(range))}</strong>
    </header>`;
  }

  _monthTemplate(range, events) {
    const weekdays = this.weekdays;
    const monthMode = this.type === 'month';
    const monthStart = monthMode
      ? new Date(this._anchor().getFullYear(), this._anchor().getMonth(), 1, 12)
      : range.start;
    const monthEnd = monthMode
      ? new Date(this._anchor().getFullYear(), this._anchor().getMonth() + 1, 0, 12)
      : range.end;
    let cursor = wCalendarStartOfWeek(monthStart, this.firstDayOfWeek);
    let finish = wCalendarEndOfWeek(monthEnd, this.firstDayOfWeek);
    const weeks = [];

    while (cursor <= finish || weeks.length < this.minWeeks) {
      const fullWeek = wCalendarDays(cursor, wCalendarAddDays(cursor, 6));
      weeks.push(fullWeek.filter((date) => weekdays.includes(date.getDay())));
      cursor = wCalendarAddDays(cursor, 7);
      if (cursor > finish && weeks.length < this.minWeeks) finish = wCalendarAddDays(finish, 7);
    }

    const columns = weekdays.length + (this.showWeek ? 1 : 0);
    const weekdayHeader = weekdays.map((weekday) => (
      `<div class="w-calendar-weekday" role="columnheader">${this._esc(this._formatWeekday(weekday))}</div>`
    )).join('');

    const weekRows = weeks.map((week) => {
      const number = this.showWeek
        ? `<div class="w-calendar-week-number" aria-label="Week ${wCalendarWeekNumber(week[0], this.firstDayOfWeek, this.firstDayOfYear)}">${wCalendarWeekNumber(week[0], this.firstDayOfWeek, this.firstDayOfYear)}</div>`
        : '';
      return `<div class="w-calendar-week" role="row" style="--w-calendar-columns:${columns}">
        ${number}
        ${week.map((date) => this._monthDayTemplate(date, range, events)).join('')}
      </div>`;
    }).join('');

    return `<div class="w-calendar-month" role="grid" style="--w-calendar-columns:${columns}">
      <div class="w-calendar-weekdays" role="row" style="--w-calendar-columns:${columns}">
        ${this.showWeek ? '<div class="w-calendar-week-number w-calendar-week-number--head" aria-hidden="true">#</div>' : ''}
        ${weekdayHeader}
      </div>
      ${weekRows}
    </div>`;
  }

  _monthDayTemplate(date, range, events) {
    const iso = wCalendarIso(date);
    const selected = iso === wCalendarIso(this._anchor());
    const today = iso === wCalendarIso(this._now());
    const outside = date < range.start || date > range.end;
    const disabled = this._dateDisabled(iso);
    const dayEvents = events.filter((event) => this._eventOnDate(event, date));
    const visibleCount = this.eventMore ? Math.min(dayEvents.length, 3) : dayEvents.length;
    const hidden = dayEvents.length - visibleCount;
    const label = date.getDate() === 1 && this.showMonthOnFirst
      ? `${this._formatMonth(date)} ${this._formatDay(date)}`
      : this._formatDay(date);
    const classes = [
      'w-calendar-day',
      outside ? 'outside' : '',
      selected ? 'selected' : '',
      today ? 'today' : '',
      disabled ? 'disabled' : '',
    ].filter(Boolean).join(' ');
    const content = this._renderCallback(this.dayContent, {
      ...this._dayScope(date),
      outside,
      events: dayEvents.map((event) => event.source),
    });

    return `<div class="${classes}" role="gridcell" data-date-cell="${iso}">
      <button
        class="w-calendar-day-button"
        type="button"
        data-date="${iso}"
        aria-label="${this._esc(this._formatDateLabel(date))}"
        aria-selected="${selected}"
        tabindex="${selected ? '0' : '-1'}"
        ${disabled ? 'disabled' : ''}
      >${this._esc(label)}</button>
      ${content ? `<div class="w-calendar-day-content">${content}</div>` : ''}
      <div class="w-calendar-day-events">
        ${dayEvents.slice(0, visibleCount).map((event) => this._eventTemplate(event, iso, false, '', event.timed)).join('')}
        ${hidden > 0 ? `<button class="w-calendar-more" type="button" data-more-date="${iso}" data-hidden="${hidden}">${this._esc(this._moreText(hidden))}</button>` : ''}
      </div>
    </div>`;
  }

  _scheduleTemplate(range, events) {
    const days = this._scheduleDays(range);
    const firstMinute = this._firstMinute();
    const intervalLabels = Array.from({ length: this.intervalCount }, (_, index) => {
      const minutes = firstMinute + index * this.intervalMinutes;
      const visible = typeof this.showIntervalLabel === 'function'
        ? this.showIntervalLabel(this._intervalScope(days[0], minutes, index))
        : true;
      return `<div class="w-calendar-time-label" style="height:${this.intervalHeight}px">${visible ? this._esc(this._formatTime(minutes)) : ''}</div>`;
    }).join('');

    const headers = days.map((date) => {
      const iso = wCalendarIso(date);
      const content = this._renderCallback(this.dayHeaderContent, this._dayScope(date));
      return `<div class="w-calendar-day-header" data-date="${iso}">
        <span>${this._esc(this._formatWeekday(date.getDay()))}</span>
        <button type="button" data-date="${iso}" aria-label="${this._esc(this._formatDateLabel(date))}">${this._esc(this._formatDay(date))}</button>
        ${content ? `<div class="w-calendar-day-header-content">${content}</div>` : ''}
      </div>`;
    }).join('');

    const allDay = days.map((date) => {
      const iso = wCalendarIso(date);
      const dayEvents = events.filter((event) => !event.timed && this._eventOnDate(event, date));
      return `<div class="w-calendar-all-day-cell" data-date-cell="${iso}">
        ${dayEvents.map((event) => this._eventTemplate(event, iso, false)).join('')}
      </div>`;
    }).join('');

    const columns = days.map((date) => this._dayColumnTemplate(date, events, firstMinute)).join('');
    const highlight = this.getAttribute('interval-highlight');
    const highlightColor = highlight && !['true', 'false'].includes(highlight)
      ? wCalendarColor(highlight, 'selected')
      : 'var(--w-selected)';
    return `<div
      class="w-calendar-schedule"
      role="grid"
      style="--w-calendar-days:${Math.max(1, days.length)};--w-calendar-interval-height:${this.intervalHeight}px;--w-calendar-interval-width:${this.intervalWidth}px;--w-calendar-event-height:${this.eventHeight}px;--w-calendar-event-gap:${this.eventMarginBottom}px;--w-calendar-interval-highlight:${highlightColor}"
    >
      <div class="w-calendar-schedule-head">
        <div class="w-calendar-gutter-head">${this._renderCallback(this.intervalHeaderContent, { days: days.map((date) => this._dayScope(date)) })}</div>
        <div class="w-calendar-day-headers">${headers}</div>
      </div>
      <div class="w-calendar-all-day">
        <div class="w-calendar-all-day-label">All day</div>
        <div class="w-calendar-all-day-cells">${allDay}</div>
      </div>
      <div class="w-calendar-schedule-scroll">
        <div class="w-calendar-time-axis">${intervalLabels}</div>
        <div class="w-calendar-day-columns">${columns}</div>
      </div>
    </div>`;
  }

  _scheduleDays(range) {
    let days;
    if (this.type === 'week') {
      days = wCalendarDays(
        wCalendarStartOfWeek(this._anchor(), this.firstDayOfWeek),
        wCalendarEndOfWeek(this._anchor(), this.firstDayOfWeek),
      );
    } else if (this.type === 'day') {
      days = [this._anchor()];
    } else if (this.type === '4day') {
      days = wCalendarDays(this._anchor(), wCalendarAddDays(this._anchor(), 3));
    } else {
      days = wCalendarDays(range.start, range.end, this.maxDays);
    }
    const allowed = this.weekdays;
    const filtered = days.filter((date) => allowed.includes(date.getDay()));
    return filtered.length ? filtered : days.slice(0, 1);
  }

  _dayColumnTemplate(date, events, firstMinute, category = '') {
    const iso = wCalendarIso(date);
    const intervals = Array.from({ length: this.intervalCount }, (_, index) => {
      const minutes = firstMinute + index * this.intervalMinutes;
      const scope = this._intervalScope(date, minutes, index);
      const customStyle = this._styleValue(
        typeof this.intervalStyle === 'function' ? this.intervalStyle(scope) : '',
      );
      const content = this._renderCallback(this.intervalContent, scope);
      return `<button
        class="w-calendar-interval${this.intervalHighlight ? ' w-calendar-interval--highlight' : ''}"
        type="button"
        style="height:${this.intervalHeight}px;${customStyle}"
        data-interval="${iso} ${scope.time}"
        data-date="${iso}"
        data-time="${scope.time}"
        ${category ? `data-category="${this._esc(category)}"` : ''}
        aria-label="${this._esc(`${this._formatDateLabel(date)} ${this._formatTime(minutes)}`)}"
      >${content ? `<span class="w-calendar-interval-content">${content}</span>` : ''}</button>`;
    }).join('');

    const timed = events.filter((event) => (
      event.timed
      && this._eventOnDate(event, date)
      && (!category || event.category === category)
    ));
    const layouts = this._eventLayouts(timed, firstMinute, date);
    const bodyContent = this._renderCallback(this.dayBodyContent, {
      ...this._dayScope(date),
      intervalRange: [firstMinute, firstMinute + this.intervalCount * this.intervalMinutes],
    });
    return `<div class="w-calendar-day-column" data-date-cell="${iso}">
      <div class="w-calendar-intervals">${intervals}</div>
      ${bodyContent ? `<div class="w-calendar-day-body-content">${bodyContent}</div>` : ''}
      <div class="w-calendar-timed-events">
        ${layouts.map(({ event, style }) => this._eventTemplate(event, iso, true, style)).join('')}
      </div>
    </div>`;
  }

  _categoryTemplate(range, events) {
    const days = wCalendarDays(range.start, range.end, this.categoryDays);
    const categories = this._parsedCategories(events);
    const firstMinute = this._firstMinute();
    const columns = [];

    days.forEach((date) => {
      categories.forEach((category) => columns.push({ date, category }));
    });

    const headers = columns.map(({ date, category }) => (
      `<div class="w-calendar-category-header">
        ${days.length > 1 ? `<span>${this._esc(this._formatWeekday(date.getDay()))} ${this._esc(this._formatDay(date))}</span>` : ''}
        <strong>${this._renderCallback(this.categoryContent, { date: this._dayScope(date), category }, this._esc(this._categoryLabel(category)))}</strong>
      </div>`
    )).join('');
    const labels = Array.from({ length: this.intervalCount }, (_, index) => (
      `<div class="w-calendar-time-label" style="height:${this.intervalHeight}px">${this._esc(this._formatTime(firstMinute + index * this.intervalMinutes))}</div>`
    )).join('');
    const allDay = columns.map(({ date, category }) => {
      const name = this._categoryValue(category);
      const dayEvents = events.filter((event) => (
        !event.timed
        && event.category === name
        && this._eventOnDate(event, date)
      ));
      return `<div class="w-calendar-all-day-cell" data-category="${this._esc(name)}" data-date-cell="${wCalendarIso(date)}">
        ${dayEvents.map((event) => this._eventTemplate(event, wCalendarIso(date), false)).join('')}
      </div>`;
    }).join('');
    const bodies = columns.map(({ date, category }) => {
      const name = this._categoryValue(category);
      return `<div class="w-calendar-category-column" data-category="${this._esc(name)}" data-date="${wCalendarIso(date)}">
        ${this._dayColumnTemplate(date, events, firstMinute, name)}
      </div>`;
    }).join('');
    const highlight = this.getAttribute('interval-highlight');
    const highlightColor = highlight && !['true', 'false'].includes(highlight)
      ? wCalendarColor(highlight, 'selected')
      : 'var(--w-selected)';

    return `<div
      class="w-calendar-schedule w-calendar-category"
      role="grid"
      style="--w-calendar-days:${Math.max(1, columns.length)};--w-calendar-interval-height:${this.intervalHeight}px;--w-calendar-interval-width:${this.intervalWidth}px;--w-calendar-event-height:${this.eventHeight}px;--w-calendar-event-gap:${this.eventMarginBottom}px;--w-calendar-interval-highlight:${highlightColor}"
    >
      <div class="w-calendar-schedule-head">
        <div class="w-calendar-gutter-head">${this._renderCallback(this.intervalHeaderContent, { days: days.map((date) => this._dayScope(date)), categories })}</div>
        <div class="w-calendar-category-headers">${headers}</div>
      </div>
      <div class="w-calendar-all-day">
        <div class="w-calendar-all-day-label">All day</div>
        <div class="w-calendar-all-day-cells">${allDay}</div>
      </div>
      <div class="w-calendar-schedule-scroll">
        <div class="w-calendar-time-axis">${labels}</div>
        <div class="w-calendar-category-columns">${bodies}</div>
      </div>
    </div>`;
  }

  _parsedCategories(events) {
    const categories = [...this.categories];
    const dynamic = events.map((event) => event.category).filter(Boolean);
    if (!this.categoryHideDynamic) {
      dynamic.forEach((category) => {
        if (!categories.some((item) => this._categoryValue(item) === category)) categories.push(category);
      });
    }
    if (!events.length || this.categoryShowAll) return categories;
    return categories.filter((category) => dynamic.includes(this._categoryValue(category)));
  }

  _categoryValue(category) {
    if (typeof category === 'string') return category;
    if (!category || typeof category !== 'object') return this._attr('category-for-invalid', '');
    return String(category.categoryName ?? category.name ?? category.value ?? this._attr('category-for-invalid', ''));
  }

  _categoryLabel(category) {
    if (typeof this.categoryText === 'function') return this.categoryText(category);
    if (typeof category === 'string') return category;
    return String(category?.[this.categoryText] ?? category?.categoryName ?? this._categoryValue(category));
  }

  _parsedEvents() {
    return this.events.map((source, index) => {
      const startValue = source?.[this._attr('event-start', 'start')];
      const endValue = source?.[this._attr('event-end', 'end')] ?? startValue;
      const start = wCalendarDate(startValue);
      const parsedEnd = wCalendarDate(endValue, start);
      if (!start) return null;
      const end = parsedEnd && parsedEnd >= start ? parsedEnd : start;
      const timed = typeof this.eventTimed === 'function'
        ? Boolean(this.eventTimed(source))
        : source?.[this.eventTimed] != null
          ? Boolean(source[this.eventTimed])
          : wCalendarHasTime(startValue) || wCalendarHasTime(endValue);
      const category = typeof this.eventCategory === 'function'
        ? this.eventCategory(source)
        : source?.[this.eventCategory];
      const name = typeof this.eventName === 'function'
        ? this.eventName(source, timed)
        : source?.[this.eventName] ?? '';
      const colorOption = typeof this.eventColor === 'function'
        ? this.eventColor(source)
        : source?.[this.eventColor] ?? this.eventColor;
      const textColorOption = typeof this.eventTextColor === 'function'
        ? this.eventTextColor(source)
        : source?.[this.eventTextColor] ?? this.eventTextColor;
      return {
        source,
        index,
        start,
        end,
        timed,
        category: category == null ? this._attr('category-for-invalid', '') : String(category),
        name: String(name),
        color: wCalendarColor(colorOption, 'primary'),
        textColor: textColorOption ? wCalendarColor(textColorOption, 'on-primary') : 'var(--w-on-primary)',
      };
    }).filter(Boolean).sort((a, b) => a.start - b.start || a.end - b.end);
  }

  _eventOnDate(event, date) {
    const day = wCalendarDay(date);
    return day >= wCalendarDay(event.start) && day <= wCalendarDay(event.end);
  }

  _eventTemplate(event, date, timed, position = '', showTime = timed) {
    const time = showTime ? `${this._formatTime(wCalendarMinutes(event.start))} ` : '';
    const content = this._renderCallback(this.eventContent, {
      event: event.source,
      parsed: event,
      date,
      timed,
      time: showTime ? this._formatTime(wCalendarMinutes(event.start)) : '',
    }, this._esc(time + event.name));
    const classes = [
      'w-calendar-event',
      timed ? 'w-calendar-event--timed' : 'w-calendar-event--all-day',
      this.eventRipple ? 'w-ripple' : '',
    ].filter(Boolean).join(' ');
    const style = `--w-calendar-event-color:${event.color};--w-calendar-event-text:${event.textColor};${position}`;
    return `<button
      class="${classes}"
      type="button"
      data-event-index="${event.index}"
      data-event-date="${date}"
      ${this.eventDraggable ? 'draggable="true"' : ''}
      style="${style}"
      title="${this._esc(event.name)}"
    >${content}</button>`;
  }

  _eventLayouts(events, firstMinute, date) {
    const visibleStart = firstMinute;
    const visibleEnd = firstMinute + this.intervalCount * this.intervalMinutes;
    const candidates = events.filter((event) => (
      wCalendarMinutes(event.end) > visibleStart
      && wCalendarMinutes(event.start) < visibleEnd
    ));

    let customVisuals = null;
    if (typeof this.eventOverlapMode === 'function') {
      try {
        const handler = this.eventOverlapMode(candidates, this.firstDayOfWeek, this.eventOverlapThreshold);
        customVisuals = typeof handler === 'function'
          ? handler(this._dayScope(date), candidates, true, true)
          : handler;
      } catch {
        customVisuals = null;
      }
    }

    return candidates.map((event) => {
      const start = Math.max(visibleStart, wCalendarMinutes(event.start));
      const end = Math.min(visibleEnd, wCalendarMinutes(event.end));
      const top = ((start - visibleStart) / this.intervalMinutes) * this.intervalHeight;
      const height = Math.max(
        this.eventHeight,
        ((Math.max(end, start + 1) - start) / this.intervalMinutes) * this.intervalHeight - this.eventMarginBottom,
      );
      const overlaps = candidates.filter((candidate) => (
        wCalendarMinutes(candidate.start) < wCalendarMinutes(event.end) + this.eventOverlapThreshold
        && wCalendarMinutes(candidate.end) > wCalendarMinutes(event.start) - this.eventOverlapThreshold
      ));
      const rank = Math.max(0, overlaps.indexOf(event));
      let left = 0;
      let width = 100;
      const custom = Array.isArray(customVisuals)
        ? customVisuals.find((visual) => visual?.event === event || visual?.event?.index === event.index)
        : null;
      if (custom) {
        left = Number.isFinite(Number(custom.left)) ? Number(custom.left) : left;
        width = Number.isFinite(Number(custom.width)) ? Number(custom.width) : width;
      } else if (overlaps.length > 1 && this.eventOverlapMode === 'column') {
        width = 100 / overlaps.length;
        left = rank * width;
      } else if (overlaps.length > 1) {
        left = rank * 4;
        width = 100 - left;
      }
      return {
        event,
        style: `top:${top}px;height:${height}px;left:${left}%;width:${width}%;z-index:${rank + 1};`,
      };
    });
  }

  _firstMinute() {
    const value = this.firstTime;
    if (value && typeof value === 'object') {
      const hour = Number(value.hour || 0);
      const minute = Number(value.minute || 0);
      if (Number.isFinite(hour) && Number.isFinite(minute)) {
        return Math.min(1440, Math.max(0, hour * 60 + minute));
      }
    }
    if (value != null && value !== '') {
      if (/^\d{1,2}:\d{2}$/.test(value)) {
        const [hour, minute] = value.split(':').map(Number);
        return Math.min(1440, Math.max(0, hour * 60 + minute));
      }
      const numeric = Number(value);
      if (Number.isFinite(numeric)) return Math.min(1440, Math.max(0, numeric));
    }
    return this.firstInterval * this.intervalMinutes;
  }

  _intervalScope(date, minutes, index) {
    const normalized = ((minutes % 1440) + 1440) % 1440;
    const hour = Math.floor(normalized / 60);
    const minute = normalized % 60;
    return {
      date: wCalendarIso(date),
      time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      hour,
      minute,
      index,
    };
  }

  _formatTime(minutes) {
    const normalized = ((minutes % 1440) + 1440) % 1440;
    const scope = this._intervalScope(this._anchor(), normalized, 0);
    if (typeof this.intervalFormat === 'function') return this.intervalFormat(scope);
    const date = new Date(2000, 0, 1, scope.hour, scope.minute);
    return new Intl.DateTimeFormat(this.locale, {
      hour: this._attr('format', '') === '24hr' ? '2-digit' : 'numeric',
      minute: !this.shortIntervals || scope.minute || this._attr('format', '') === '24hr' ? '2-digit' : undefined,
      hour12: this._attr('format', '') === 'ampm' ? true : this._attr('format', '') === '24hr' ? false : undefined,
    }).format(date);
  }

  _formatWeekday(weekday) {
    const date = new Date(2026, 5, 7 + weekday, 12);
    if (typeof this.weekdayFormat === 'function') return this.weekdayFormat(this._dayScope(date), this.shortWeekdays);
    return new Intl.DateTimeFormat(this.locale, {
      weekday: this.shortWeekdays ? 'short' : 'long',
    }).format(date);
  }

  _formatDay(date) {
    if (typeof this.dayFormat === 'function') return this.dayFormat(this._dayScope(date));
    return new Intl.DateTimeFormat(this.locale, { day: 'numeric' }).format(date);
  }

  _formatMonth(date) {
    if (typeof this.monthFormat === 'function') return this.monthFormat(this._dayScope(date), this.shortMonths);
    return new Intl.DateTimeFormat(this.locale, {
      month: this.shortMonths ? 'short' : 'long',
    }).format(date);
  }

  _formatDateLabel(date) {
    return new Intl.DateTimeFormat(this.locale, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    }).format(date);
  }

  _dayScope(date) {
    const iso = wCalendarIso(date);
    const today = wCalendarIso(this._now());
    return {
      date: iso,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      weekday: date.getDay(),
      present: iso === today,
      past: iso < today,
      future: iso > today,
    };
  }

  _moreText(count) {
    const template = this._attr('event-more-text', '{count} more');
    return template.includes('{count}') ? template.replace(/\{count\}/g, String(count)) : `${count} ${template}`;
  }

  _dateDisabled(iso) {
    const min = this._attr('min', '');
    const max = this._attr('max', '');
    return Boolean((min && iso < min) || (max && iso > max));
  }

  _styleValue(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value !== 'object') return '';
    return Object.entries(value).map(([name, entry]) => {
      const property = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      return `${property}:${String(entry)}`;
    }).join(';');
  }

  _renderCallback(renderer, scope, fallback = '') {
    if (typeof renderer !== 'function') return fallback;
    try {
      const value = renderer(scope, this);
      return value == null ? fallback : String(value);
    } catch {
      return fallback;
    }
  }

  _events() {
    this.querySelectorAll('[data-calendar-nav]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const action = button.getAttribute('data-calendar-nav');
        if (action === 'prev') this.prev();
        else if (action === 'next') this.next();
        else this.today();
      });
    });

    this.querySelectorAll('[data-date]').forEach((button) => {
      button.addEventListener('click', (event) => {
        if (button.disabled) return;
        event.stopPropagation();
        this._selectDate(button.getAttribute('data-date'));
      });
      button.addEventListener('keydown', (event) => this._onDateKeydown(event, button));
    });

    this.querySelectorAll('[data-event-index]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const parsed = this._parsedEvents().find((item) => item.index === Number(button.getAttribute('data-event-index')));
        if (!parsed) return;
        this._emit('click', {
          kind: 'event',
          date: button.getAttribute('data-event-date'),
          event: parsed.source,
        });
      });
      if (this.eventDraggable) {
        button.addEventListener('dragstart', (event) => {
          this._dragEventIndex = Number(button.getAttribute('data-event-index'));
          button.classList.add('w-calendar-event--dragging');
          event.dataTransfer?.setData('text/plain', String(this._dragEventIndex));
          if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
        });
        button.addEventListener('dragend', () => {
          button.classList.remove('w-calendar-event--dragging');
          this._dragEventIndex = null;
        });
      }
    });

    this.querySelectorAll('[data-more-date]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const date = button.getAttribute('data-more-date');
        this._emit('click', {
          kind: 'more',
          date,
          hidden: Number(button.getAttribute('data-hidden')),
          events: this._parsedEvents().filter((item) => this._eventOnDate(item, wCalendarDate(date))),
        });
      });
    });

    this.querySelectorAll('[data-interval]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        this._emit('click', {
          kind: button.hasAttribute('data-category') ? 'timeCategory' : 'time',
          date: button.getAttribute('data-date'),
          time: button.getAttribute('data-time'),
          category: button.getAttribute('data-category') || undefined,
        });
      });
      if (this.eventDraggable) {
        button.addEventListener('dragover', (event) => {
          event.preventDefault();
          if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
        });
        button.addEventListener('drop', (event) => {
          event.preventDefault();
          const raw = event.dataTransfer?.getData('text/plain');
          const transferred = raw ? Number(raw) : Number.NaN;
          const index = Number.isInteger(transferred) ? transferred : this._dragEventIndex;
          this._dropEvent(index, button);
        });
      }
    });
  }

  _dropEvent(index, target) {
    if (!Number.isInteger(index)) return;
    const parsed = this._parsedEvents().find((event) => event.index === index);
    const date = target.getAttribute('data-date');
    const time = target.getAttribute('data-time');
    const start = wCalendarDate(`${date} ${time}`);
    if (!parsed || !start) return;

    const duration = Math.max(60000, parsed.end - parsed.start);
    const end = new Date(start.getTime() + duration);
    const startKey = this._attr('event-start', 'start');
    const endKey = this._attr('event-end', 'end');
    parsed.source[startKey] = this._dateTimeValue(start);
    parsed.source[endKey] = this._dateTimeValue(end);
    if (typeof this.eventTimed === 'string') parsed.source[this.eventTimed] = true;
    const category = target.getAttribute('data-category');
    if (category && typeof this.eventCategory === 'string') parsed.source[this.eventCategory] = category;
    if (this._eventsInput === undefined) {
      const events = this.events;
      events[index] = parsed.source;
      this._silentSet('events', JSON.stringify(events));
    }

    this._refresh();
    this._emit('change', {
      reason: 'event-drop',
      value: this.value || wCalendarIso(this._anchor()),
      event: parsed.source,
      date,
      time,
      category: category || undefined,
      ...this._rangeDetail(),
    });
  }

  _dateTimeValue(date) {
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${wCalendarIso(date)} ${hour}:${minute}`;
  }

  _onDateKeydown(event, button) {
    const date = wCalendarDate(button.getAttribute('data-date'));
    if (!date) return;
    let next = null;
    if (event.key === 'ArrowLeft') next = wCalendarAddDays(date, -1);
    if (event.key === 'ArrowRight') next = wCalendarAddDays(date, 1);
    if (event.key === 'ArrowUp') next = wCalendarAddDays(date, -7);
    if (event.key === 'ArrowDown') next = wCalendarAddDays(date, 7);
    if (event.key === 'Home') next = wCalendarStartOfWeek(date, this.firstDayOfWeek);
    if (event.key === 'End') next = wCalendarEndOfWeek(date, this.firstDayOfWeek);
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._selectDate(wCalendarIso(date));
      return;
    }
    if (!next) return;
    event.preventDefault();
    const target = this.querySelector(`[data-date="${wCalendarIso(next)}"]:not(:disabled)`);
    target?.focus();
  }

  _selectDate(value) {
    const date = wCalendarDate(value);
    if (!date || this._dateDisabled(value)) return;
    const detail = { kind: 'date', date: value, ...this._dayScope(date) };
    this._emit('click', detail);
    this._silentSet('value', value);
    if (this.hasAttribute('month')) this._silentSet('month', String(date.getMonth() + 1));
    if (this.hasAttribute('year')) this._silentSet('year', String(date.getFullYear()));
    this._refresh();
    this._emit('input', { value, ...detail });
    this._emit('change', { reason: 'select', value, ...this._rangeDetail() });
  }

  _rangeDetail() {
    const range = this._range();
    return { start: wCalendarIso(range.start), end: wCalendarIso(range.end), type: this.type };
  }

  _refresh() {
    if (!this._rendered) return;
    this._render();
    this._events();
    this._applyCommonProps();
  }

  move(amount = 1) {
    const step = Number(amount) || 0;
    if (!step) return;
    let next;
    if (this.type === 'month') next = wCalendarAddMonths(this._anchor(), step);
    else if (this.type === 'week') next = wCalendarAddDays(this._anchor(), step * 7);
    else if (this.type === '4day') next = wCalendarAddDays(this._anchor(), step * 4);
    else if (this.type === 'category') next = wCalendarAddDays(this._anchor(), step * this.categoryDays);
    else next = wCalendarAddDays(this._anchor(), step);
    this._moveTo(next, 'move');
  }

  next(amount = 1) { this.move(Math.abs(Number(amount) || 1)); }
  prev(amount = 1) { this.move(-Math.abs(Number(amount) || 1)); }
  today() { this._moveTo(this._now(), 'today'); }

  _moveTo(date, reason) {
    const value = wCalendarIso(date);
    this._silentSet('value', value);
    if (this.hasAttribute('month')) this._silentSet('month', String(date.getMonth() + 1));
    if (this.hasAttribute('year')) this._silentSet('year', String(date.getFullYear()));
    this._refresh();
    const detail = { reason, value, ...this._rangeDetail() };
    this._emit('change', detail);
    this._emit('moved', detail);
  }

  checkChange() {
    const detail = { reason: 'check', value: wCalendarIso(this._anchor()), ...this._rangeDetail() };
    this._emit('change', detail);
    return detail;
  }

  updateTimes() {
    this._refresh();
    return this.times;
  }

  minutesToPixels(minutes) {
    const value = Number(minutes);
    return Number.isFinite(value) ? value / this.intervalMinutes * this.intervalHeight : false;
  }

  timeDelta(value) {
    const minutes = this._timeMinutes(value);
    if (minutes === false) return false;
    return (minutes - this._firstMinute()) / (this.intervalCount * this.intervalMinutes);
  }

  timeToY(value, clamp = false) {
    const delta = this.timeDelta(value);
    if (delta === false) return false;
    const height = this.intervalCount * this.intervalHeight;
    const y = delta * height;
    return clamp ? Math.min(height, Math.max(0, y)) : y;
  }

  _timeMinutes(value) {
    if (value instanceof Date) return wCalendarMinutes(value);
    if (value && typeof value === 'object') {
      const hour = Number(value.hour || 0);
      const minute = Number(value.minute || 0);
      return Number.isFinite(hour) && Number.isFinite(minute) ? hour * 60 + minute : false;
    }
    if (/^\d{1,2}:\d{2}$/.test(String(value || ''))) {
      const [hour, minute] = String(value).split(':').map(Number);
      return hour * 60 + minute;
    }
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : false;
  }

  scrollToTime(value) {
    const minutes = this._timeMinutes(value);
    const scroll = this._q('.w-calendar-schedule-scroll');
    if (!scroll || minutes === false) return false;
    scroll.scrollTop = Math.max(0, this.timeToY(minutes));
    return true;
  }

  getVisibleRange() {
    return this._rangeDetail();
  }
}

if (!customElements.get('w-calendar')) customElements.define('w-calendar', WCalendar);
