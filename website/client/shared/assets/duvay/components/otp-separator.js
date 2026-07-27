/* <w-otp-separator> — Vuetify structural subcomponent */

export class WOtpSeparator extends WElement {
  _template() {
    return `<div class="w-otp-separator"><slot></slot></div>`;
  }
}

if (!customElements.get('w-otp-separator')) {
  customElements.define('w-otp-separator', WOtpSeparator);
}
