/* <w-otp-group> — Vuetify structural subcomponent
 *
 * Attributes:
 *   merged - fuse the contained fields into a single visual block
 */

export class WOtpGroup extends WElement {
  static attrs = ['merged'];

  _template() {
    const classes = 'w-otp-group' + this._cls({ 'w-otp-group--merged': this._bool('merged') });
    return `<div class="${classes}"><slot></slot></div>`;
  }
}

if (!customElements.get('w-otp-group')) {
  customElements.define('w-otp-group', WOtpGroup);
}
