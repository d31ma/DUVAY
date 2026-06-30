/* <w-calendar-daily> — Vuetify structural subcomponent */

export class WCalendarDaily extends WElement {
  _template() {
    return `<div class="w-calendar-daily"><slot></slot></div>`;
  }
}

if (!customElements.get('w-calendar-daily')) {
  customElements.define('w-calendar-daily', WCalendarDaily);
}
