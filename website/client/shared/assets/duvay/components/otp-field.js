/* <w-otp-field> — Vuetify structural subcomponent
 *
 * Attributes:
 *   index - logical position of this field within the OTP value
 */

export class WOtpField extends WElement {
  static attrs = ['index'];

  _template() {
    const index = this._attr('index', '');
    const attrs = this._attrs({ 'data-index': index, 'aria-posinset': index });
    return `<div class="w-otp-field"${attrs}><slot></slot></div>`;
  }
}

if (!customElements.get('w-otp-field')) {
  customElements.define('w-otp-field', WOtpField);
}
