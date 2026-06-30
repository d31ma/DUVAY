/* <w-otp-field> — Vuetify structural subcomponent */

export class WOtpField extends WElement {
  _template() {
    return `<div class="w-otp-field"><slot></slot></div>`;
  }
}

if (!customElements.get('w-otp-field')) {
  customElements.define('w-otp-field', WOtpField);
}
