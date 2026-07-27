/* <w-banner-text> — Banner text subcomponent */

class WBannerText extends WElement {
  _template() {
    return `<span class="w-banner-text"><slot></slot></span>`;
  }
}

if (!customElements.get('w-banner-text')) {
  customElements.define('w-banner-text', WBannerText);
}
