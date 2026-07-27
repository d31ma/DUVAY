/* <w-banner-actions> — Banner actions subcomponent */

class WBannerActions extends WElement {
  _template() {
    return `<span class="w-banner-actions"><slot></slot></span>`;
  }
}

if (!customElements.get('w-banner-actions')) {
  customElements.define('w-banner-actions', WBannerActions);
}
