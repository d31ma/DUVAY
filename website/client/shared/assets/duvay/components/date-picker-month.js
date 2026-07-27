/* <w-date-picker-month> — the day grid of a date picker, usable on its own.
 *
 * Shares every attribute (and all of the selection/keyboard behaviour) with
 * <w-date-picker>; it simply renders the month body without the picker title
 * or the month/year controls.
 */
import { WDatePicker } from './date-picker.js';

export class WDatePickerMonth extends WDatePicker {
  static attrs = [
    'value', 'min', 'max', 'multiple', 'transition', 'reverse-transition',
    'weekdays', 'first-day-of-week', 'first-day-of-year', 'month', 'year',
    'events', 'event-color', 'show-week', 'hide-weekdays', 'no-auto-navigation',
    'show-adjacent-months', 'weeks-in-month', 'allowed-dates', 'preview-value',
  ];

  _template() {
    return '<div class="w-date-picker-month w-date-picker-month--view">'
      + this._bodyTemplate(this._daysTemplate())
      + '<slot></slot></div>';
  }
}

if (!customElements.get('w-date-picker-month')) {
  customElements.define('w-date-picker-month', WDatePickerMonth);
}
