/* <w-otp-group> — Vuetify structural subcomponent */

export class WOtpGroup extends WElement {
  _template() {
    return `<div class="w-otp-group"><slot></slot></div>`;
  }
}

if (!customElements.get('w-otp-group')) {
  customElements.define('w-otp-group', WOtpGroup);
}
