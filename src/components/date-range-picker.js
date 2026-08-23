/* <w-date-range-picker> — two-endpoint date selection built on w-date-picker. */

import { WDatePicker } from './date-picker.js';
import { wSetValue } from './utils.js';

export class WDateRangePicker extends WDatePicker {
  static attrs = [
    'model-value', 'bg-color', 'disabled', 'readonly', 'transition', 'divided',
    'weekdays', 'first-day-of-week', 'first-day-of-year', 'weekday-format',
    'show-week', 'hide-header', 'next-icon', 'prev-icon', 'reverse-transition',
    'landscape', 'hide-title', 'control-height', 'hide-weekdays', 'weeks-in-month',
    'allowed-dates', 'allowed-months', 'allowed-years', 'independent-months',
  ];

  get mode() { return 'range'; }
  set value(v) { wSetValue(this, v); }
  get value() { return this._attr('model-value', this._attr('value', '')); }

  _select(date) {
    if (this._bool('disabled') || this._bool('readonly')) return;
    super._select(date);
    this._silentSet('model-value', this._attr('value', ''));
    this._emit('update:modelValue', { value: this._attr('value', '') });
  }
}

if (!customElements.get('w-date-range-picker')) customElements.define('w-date-range-picker', WDateRangePicker);
