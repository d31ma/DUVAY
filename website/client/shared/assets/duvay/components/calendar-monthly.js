/* <w-calendar-monthly> — Calendar monthly structural view */

export class WCalendarMonthly extends WElement {
  _template() {
    return `<div class="w-calendar-monthly"><slot></slot></div>`;
  }
}

if (!customElements.get('w-calendar-monthly')) {
  customElements.define('w-calendar-monthly', WCalendarMonthly);
}
