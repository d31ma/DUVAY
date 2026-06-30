/* <w-sparkline-tooltip> — Vuetify structural subcomponent */

export class WSparklineTooltip extends WElement {
  _template() {
    return `<div class="w-sparkline-tooltip"><slot></slot></div>`;
  }
}

if (!customElements.get('w-sparkline-tooltip')) {
  customElements.define('w-sparkline-tooltip', WSparklineTooltip);
}
