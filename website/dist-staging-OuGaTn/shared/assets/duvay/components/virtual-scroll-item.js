/* <w-virtual-scroll-item> — Vuetify structural subcomponent */

export class WVirtualScrollItem extends WElement {
  _template() {
    return `<div class="w-virtual-scroll-item"><slot></slot></div>`;
  }
}

if (!customElements.get('w-virtual-scroll-item')) {
  customElements.define('w-virtual-scroll-item', WVirtualScrollItem);
}
