/* <w-date-picker-years> — the year chooser of a date picker, usable on its own. */
import { WDatePicker } from './date-picker.js';

export class WDatePickerYears extends WDatePicker {
  static attrs = ['value', 'min', 'max', 'year', 'columns', 'allowed-years'];

  // Standalone, a bounded min/max spans the whole range rather than the
  // twelve-year page <w-date-picker> flips through.
  _yearsList() {
    const min = this.min;
    const max = this.max;
    if (!min || !max) return super._yearsList();
    const from = min.getFullYear();
    const to = max.getFullYear();
    if (to < from || to - from > 200) return super._yearsList();
    return Array.from({ length: to - from + 1 }, (_, index) => from + index);
  }

  _template() {
    return this._yearsTemplate() + '<slot></slot>';
  }
}

if (!customElements.get('w-date-picker-years')) {
  customElements.define('w-date-picker-years', WDatePickerYears);
}
