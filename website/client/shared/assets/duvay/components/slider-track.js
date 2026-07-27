/* <w-slider-track> — Vuetify structural subcomponent */

export class WSliderTrack extends WElement {
  _template() {
    return `<div class="w-slider-track"><slot></slot></div>`;
  }
}

if (!customElements.get('w-slider-track')) {
  customElements.define('w-slider-track', WSliderTrack);
}
