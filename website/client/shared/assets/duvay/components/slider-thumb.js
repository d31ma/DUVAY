/* <w-slider-thumb> — Vuetify structural subcomponent */

export class WSliderThumb extends WElement {
  _template() {
    return `<div class="w-slider-thumb"><slot></slot></div>`;
  }
}

if (!customElements.get('w-slider-thumb')) {
  customElements.define('w-slider-thumb', WSliderThumb);
}
