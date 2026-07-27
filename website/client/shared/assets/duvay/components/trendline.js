/* <w-trendline> — Vuetify structural subcomponent */

export class WTrendline extends WElement {
  _template() {
    return `<div class="w-trendline"><slot></slot></div>`;
  }
}

if (!customElements.get('w-trendline')) {
  customElements.define('w-trendline', WTrendline);
}
