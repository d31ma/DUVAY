/* <w-date-picker> — DuVay component module */
import {
  wIsoDate,
  wParseIsoDate,
  wIsSameDate,
  wDateInRange,
  wDateBetween,
} from './utils.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export class WDatePicker extends WElement {
  static attrs = ['value', 'month', 'year', 'min', 'max', 'first-day-of-week', 'show-adjacent-months', 'mode', 'view', 'title', 'hide-header'];

  get value() { return this._attr('value', ''); }
  get month() { return parseInt(this._attr('month', String(new Date().getMonth() + 1)), 10) || 1; }
  get year() { return parseInt(this._attr('year', String(new Date().getFullYear())), 10) || new Date().getFullYear(); }
  get min() { return wParseIsoDate(this._attr('min', '')); }
  get max() { return wParseIsoDate(this._attr('max', '')); }
  get title() { return this._attr('title', 'Select date'); }
  get hideHeader() { return this._bool('hide-header'); }
  get view() {
    const view = this._attr('view', 'date');
    return view === 'months' || view === 'years' ? view : 'date';
  }
  get firstDayOfWeek() {
    const n = parseInt(this._attr('first-day-of-week', '0'), 10);
    return Number.isNaN(n) ? 0 : ((n % 7) + 7) % 7;
  }
  get showAdjacentMonths() { return this._bool('show-adjacent-months'); }
  get mode() {
    const m = this._attr('mode', 'single');
    return m === 'multiple' || m === 'range' ? m : 'single';
  }

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

  _template() {
    const label = this._monthYearLabel();
    let html = `<div class="w-date-picker w-date-picker--view-${this.view}" role="application" aria-label="Calendar">`;
    if (!this.hideHeader) {
      html += `<div class="w-date-picker-picker-title">
        <span>${this._esc(this.title)}</span>
        <strong>${this._esc(this._selectionLabel())}</strong>
      </div>`;
    }
    html += `<div class="w-date-picker-header">
      <button class="w-date-picker-nav w-date-picker-nav--prev" type="button" aria-label="${this._esc(this._navLabel(-1))}">‹</button>
      <button class="w-date-picker-title" type="button" aria-label="Change calendar view">${this._esc(label)}</button>
      <button class="w-date-picker-nav w-date-picker-nav--next" type="button" aria-label="${this._esc(this._navLabel(1))}">›</button>
    </div>`;
    html += this.view === 'years' ? this._yearsTemplate() : this.view === 'months' ? this._monthsTemplate() : this._daysTemplate();
    html += '</div>';
    return html;
  }

  _selectionLabel() {
    const dates = this._selectedDates();
    if (!dates.length) return 'No date selected';
    if (this.mode === 'range' && dates.length === 2) return `${dates[0].toLocaleDateString()} – ${dates[1].toLocaleDateString()}`;
    if (this.mode === 'multiple') return `${dates.length} selected`;
    return dates[0].toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }

  _monthYearLabel() {
    if (this.view === 'months') return String(this.year);
    if (this.view === 'years') {
      const start = this._yearPageStart();
      return `${start} - ${start + 11}`;
    }
    return new Date(this.year, this.month - 1, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' });
  }

  _navLabel(delta) {
    if (this.view === 'years') return delta < 0 ? 'Previous years' : 'Next years';
    if (this.view === 'months') return delta < 0 ? 'Previous year' : 'Next year';
    return delta < 0 ? 'Previous month' : 'Next month';
  }

  _daysTemplate() {
    const date = new Date(this.year, this.month - 1, 1);
    const daysInMonth = new Date(this.year, this.month, 0).getDate();
    const offset = (date.getDay() - this.firstDayOfWeek + 7) % 7;
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const orderedWeekdays = [...weekdays.slice(this.firstDayOfWeek), ...weekdays.slice(0, this.firstDayOfWeek)];
    const prevMonthDays = new Date(this.year, this.month - 1, 0).getDate();
    const range = this._rangeState();
    let html = '<div class="w-date-picker-grid" role="grid">';

    orderedWeekdays.forEach((day) => {
      html += `<div class="w-date-picker-weekday" role="columnheader">${day}</div>`;
    });

    if (this.showAdjacentMonths) {
      for (let i = offset - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        html += this._dayButton(day, this._isoForDay(this.year, this.month - 1, day), true, range);
      }
    } else {
      for (let i = 0; i < offset; i++) html += '<span class="w-date-picker-spacer"></span>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
      html += this._dayButton(day, this._isoForDay(this.year, this.month, day), false, range);
    }

    if (this.showAdjacentMonths) {
      const totalCells = offset + daysInMonth;
      const remainder = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
      for (let day = 1; day <= remainder; day++) {
        html += this._dayButton(day, this._isoForDay(this.year, this.month + 1, day), true, range);
      }
    }

    html += '</div>';
    return html;
  }

  _monthsTemplate() {
    return `<div class="w-date-picker-months" role="grid">${MONTHS.map((label, index) => {
      const month = index + 1;
      const selected = month === this.month;
      return `<button class="w-date-picker-month${selected ? ' selected' : ''}" type="button" data-month="${month}" aria-selected="${selected}">${label}</button>`;
    }).join('')}</div>`;
  }

  _yearsTemplate() {
    const start = this._yearPageStart();
    return `<div class="w-date-picker-years" role="grid">${Array.from({ length: 12 }, (_, index) => start + index).map((year) => {
      const selected = year === this.year;
      return `<button class="w-date-picker-year${selected ? ' selected' : ''}" type="button" data-year="${year}" aria-selected="${selected}">${year}</button>`;
    }).join('')}</div>`;
  }

  _yearPageStart() {
    return Math.floor(this.year / 12) * 12;
  }

  _isoForDay(year, month, day) {
    return wIsoDate(new Date(year, month - 1, day));
  }

  _dayButton(day, iso, otherMonth, range) {
    const date = wParseIsoDate(iso);
    const disabled = !wDateInRange(date, this.min, this.max);
    const selected = this._isSelected(date);
    const today = wIsSameDate(date, new Date());
    const classes = ['w-date-picker-day'];
    if (otherMonth) classes.push('other-month');
    if (disabled) classes.push('disabled');
    if (today) classes.push('today');
    if (selected) classes.push('selected');

    if (range && date) {
      const { start, end } = range;
      const isStart = wIsSameDate(date, start);
      const isEnd = wIsSameDate(date, end);
      if (isStart) classes.push('range-start');
      if (isEnd) classes.push('range-end');
      if (!isStart && !isEnd && wDateBetween(date, start, end)) classes.push('in-range');
    }

    return `<button class="${classes.join(' ')}" type="button" role="gridcell" data-date="${iso}"${disabled ? ' disabled' : ''}${selected ? ' aria-selected="true"' : ''}>${day}</button>`;
  }

  _events() {
    this._q('.w-date-picker-nav--prev')?.addEventListener('click', () => this._shiftView(-1));
    this._q('.w-date-picker-nav--next')?.addEventListener('click', () => this._shiftView(1));
    this._q('.w-date-picker-title')?.addEventListener('click', () => this._cycleView());

    this._qAll('[data-date]').forEach((button) => {
      button.addEventListener('click', () => {
        const date = wParseIsoDate(button.getAttribute('data-date'));
        if (date) this._select(date);
      });
      button.addEventListener('keydown', (event) => this._onDayKeyDown(event, button));
    });
    this._qAll('[data-month]').forEach((button) => {
      button.addEventListener('click', () => this._selectMonth(Number(button.getAttribute('data-month'))));
    });
    this._qAll('[data-year]').forEach((button) => {
      button.addEventListener('click', () => this._selectYear(Number(button.getAttribute('data-year'))));
    });
  }

  _cycleView() {
    const next = this.view === 'date' ? 'months' : this.view === 'months' ? 'years' : 'date';
    this._setView(next);
  }

  _setView(view) {
    this._silentSet('view', view);
    this._render();
    this._events();
  }

  _selectMonth(month) {
    this._silentSet('month', month);
    this._setView('date');
    this._emit('change', { month, year: this.year, view: 'date' });
  }

  _selectYear(year) {
    this._silentSet('year', year);
    this._setView('months');
    this._emit('change', { month: this.month, year, view: 'months' });
  }

  _shiftView(delta) {
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
    let delta = 0;
    if (event.key === 'ArrowRight') delta = 1;
    else if (event.key === 'ArrowLeft') delta = -1;
    else if (event.key === 'ArrowDown') delta = 7;
    else if (event.key === 'ArrowUp') delta = -7;
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._select(current);
      return;
    } else {
      return;
    }
    event.preventDefault();
    const next = new Date(current);
    next.setDate(current.getDate() + delta);
    const nextIso = wIsoDate(next);
    let nextButton = this._q(`[data-date="${nextIso}"]`);
    if (!nextButton) {
      this._silentSet('month', next.getMonth() + 1);
      this._silentSet('year', next.getFullYear());
      this._render();
      this._events();
      this._emit('change', { month: next.getMonth() + 1, year: next.getFullYear(), view: this.view });
      nextButton = this._q(`[data-date="${nextIso}"]`);
    }
    if (nextButton) nextButton.focus();
  }

  _select(date) {
    let nextValue = '';
    if (this.mode === 'single') {
      nextValue = wIsoDate(date);
    } else if (this.mode === 'multiple') {
      const dates = this._selectedDates();
      const index = dates.findIndex((d) => wIsSameDate(d, date));
      if (index >= 0) dates.splice(index, 1);
      else dates.push(date);
      nextValue = dates.map(wIsoDate).join(',');
    } else {
      const dates = this._selectedDates();
      if (dates.length === 0 || dates.length === 2) {
        nextValue = wIsoDate(date);
      } else {
        const start = dates[0];
        const ordered = [start, date].sort((a, b) => a.getTime() - b.getTime());
        nextValue = `${wIsoDate(ordered[0])},${wIsoDate(ordered[1])}`;
      }
    }

    this._silentSet('value', nextValue);
    this._render();
    this._events();
    this._emit('change', { value: nextValue });
  }
}

if (!customElements.get('w-date-picker')) customElements.define('w-date-picker', WDatePicker);
