/* <w-calendar-weekly> — Vuetify structural subcomponent */

export class WCalendarWeekly extends WElement {
  _template() {
    return `<div class="w-calendar-weekly"><slot></slot></div>`;
  }
}

if (!customElements.get('w-calendar-weekly')) {
  customElements.define('w-calendar-weekly', WCalendarWeekly);
}
