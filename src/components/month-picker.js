/* <w-month-picker> — month and year picker with single, multiple, and range modes. */

import { WDatePicker } from './date-picker.js';

export class WMonthPicker extends WDatePicker {
  static attrs = [
    'model-value', 'multiple', 'selected-icon', 'months-columns', 'years-columns',
    'header-color', 'mode-icon', 'allowed-months', 'allowed-years', 'next-icon',
    'prev-icon', 'reverse-transition', 'readonly', 'disabled',
  ];

  get view() { return this._monthView || 'months'; }
  get columns() {
    const name = this.view === 'years' ? 'years-columns' : 'months-columns';
    return Math.max(1, Number.parseInt(this._attr(name, '3'), 10) || 3);
  }
  get value() { return this._attr('model-value', this._attr('value', '')); }

  _setView(view) {
    this._monthView = view === 'years' ? 'years' : 'months';
    this._render();
    this._events();
  }

  _selectMonth(month) {
    if (this._bool('disabled') || this._bool('readonly') || !this._monthAllowed(month - 1)) return;
    const selected = `${this.year}-${String(month).padStart(2, '0')}`;
    const values = this.value ? this.value.split(',').filter(Boolean) : [];
    let next = selected;
    const mode = this.getAttribute('multiple');
    if (mode === 'range') {
      next = values.length === 1 ? [values[0], selected].sort().join(',') : selected;
    } else if (mode != null && mode !== 'false') {
      const index = values.indexOf(selected);
      if (index >= 0) values.splice(index, 1); else values.push(selected);
      next = values.sort().join(',');
    }
    this._silentSet('month', month);
    this._silentSet('value', next);
    this._silentSet('model-value', next);
    this._render();
    this._events();
    this._emit('change', { value: next, month, year: this.year });
    this._emit('update:modelValue', { value: next });
  }

  _selectYear(year) {
    if (!this._yearAllowed(year)) return;
    this._silentSet('year', year);
    this._setView('months');
  }
}

if (!customElements.get('w-month-picker')) customElements.define('w-month-picker', WMonthPicker);
