/* <w-date-picker-months> — the month chooser of a date picker, usable on its own. */
import { WDatePicker } from './date-picker.js';

export class WDatePickerMonths extends WDatePicker {
  static attrs = ['value', 'min', 'max', 'year', 'month', 'columns', 'allowed-months'];

  _template() {
    return this._monthsTemplate() + '<slot></slot>';
  }
}

if (!customElements.get('w-date-picker-months')) {
  customElements.define('w-date-picker-months', WDatePickerMonths);
}
