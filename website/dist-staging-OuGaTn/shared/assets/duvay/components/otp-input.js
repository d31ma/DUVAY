/* <w-otp-input> — alias for <w-otp>
 *
 * Attributes, events, and slots are identical to <w-otp>.
 */

import './otp.js';

class WOtpInput extends customElements.get('w-otp') {}

if (!customElements.get('w-otp-input')) {
  customElements.define('w-otp-input', WOtpInput);
}
