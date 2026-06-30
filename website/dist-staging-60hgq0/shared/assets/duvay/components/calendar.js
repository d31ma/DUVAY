/* <w-calendar> — DuVay component module */
import { wIsoDate, wModelValue } from './utils.js';

export class WCalendar extends WElement {
  static attrs = ['month', 'year', 'value', 'model-value', 'min', 'max'];

  get value() { return wModelValue(this, ''); }
  get selectedDate() { return this.value ? new Date(`${this.value}T00:00:00`) : null; }
  get month() {
    const selected = this.selectedDate;
    return parseInt(this._attr('month', selected ? String(selected.getMonth() + 1) : String(new Date().getMonth() + 1)), 10) || 1;
  }
  get year() {
    const selected = this.selectedDate;
    return parseInt(this._attr('year', selected ? String(selected.getFullYear()) : String(new Date().getFullYear())), 10) || new Date().getFullYear();
  }
  get min() { return this._attr('min', ''); }
  get max() { return this._attr('max', ''); }

  _template() {
    const date = new Date(this.year, this.month - 1, 1);
    const days = new Date(this.year, this.month, 0).getDate();
    const firstDay = date.getDay();
    const today = wIsoDate(new Date());
    let html = `<div class="w-calendar" role="grid" aria-label="${date.toLocaleString(undefined, { month: 'long', year: 'numeric' })}">
      <div class="w-calendar-title">
        <button class="w-calendar-nav" type="button" data-month-nav="-1" aria-label="Previous month">‹</button>
        <strong>${date.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</strong>
        <button class="w-calendar-nav" type="button" data-month-nav="1" aria-label="Next month">›</button>
      </div>`;
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((day) => { html += `<span class="w-calendar-weekday">${day}</span>`; });
    for (let i = 0; i < firstDay; i++) html += '<span class="w-calendar-empty" aria-hidden="true"></span>';
    for (let day = 1; day <= days; day++) {
      const iso = wIsoDate(new Date(this.year, this.month - 1, day));
      const selected = iso === this.value;
      const disabled = (this.min && iso < this.min) || (this.max && iso > this.max);
      html += `<button class="${selected ? 'selected ' : ''}${iso === today ? 'today' : ''}" type="button" role="gridcell" data-date="${iso}" aria-selected="${selected}"${disabled ? ' disabled' : ''}>${day}</button>`;
    }
    html += '</div>';
    return html;
  }

  _events() {
    this.querySelectorAll('[data-month-nav]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = new Date(this.year, this.month - 1 + Number(button.getAttribute('data-month-nav')), 1);
        this._silentSet('month', String(next.getMonth() + 1));
        this._silentSet('year', String(next.getFullYear()));
        this._render();
        this._events();
        this._emit('w-view-change', { month: next.getMonth() + 1, year: next.getFullYear() });
      });
    });
    this.querySelectorAll('[data-date]').forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.getAttribute('data-date');
        this._silentSet('value', value);
        this._silentSet('model-value', value);
        this.querySelectorAll('[data-date]').forEach((day) => {
          const active = day.getAttribute('data-date') === value;
          day.classList.toggle('selected', active);
          day.setAttribute('aria-selected', String(active));
        });
        this._emit('w-change', { value });
      });
    });
  }
}

if (!customElements.get('w-calendar')) customElements.define('w-calendar', WCalendar);
