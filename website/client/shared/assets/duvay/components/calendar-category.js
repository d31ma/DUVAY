/* <w-calendar-category> — Vuetify structural subcomponent */

export class WCalendarCategory extends WElement {
  _template() {
    return `<div class="w-calendar-category"><slot></slot></div>`;
  }
}

if (!customElements.get('w-calendar-category')) {
  customElements.define('w-calendar-category', WCalendarCategory);
}
