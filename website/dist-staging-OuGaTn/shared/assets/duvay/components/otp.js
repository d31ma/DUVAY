/* <w-otp> — one-time-code input, mirroring Vuetify's <v-otp-input>.
 *
 * Renders one box per character for verification codes. Supports paste-to-fill
 * (a full code pasted into any box distributes across the row), arrow-key
 * navigation, select-on-focus for quick overwrite, and digit/password typing.
 *
 * Attributes:
 *   length       - number of boxes (default 6)
 *   value        - current code (string)
 *   type         - text | number | password (default text)
 *   divider      - character drawn between boxes (e.g. "-")
 *   placeholder  - single-char placeholder for empty boxes
 *   disabled     - disable every box
 *
 * Events:
 *   input               - { value } on each change
 *   change              - { value } once every box is filled
 */

export class WOtp extends WElement {
  static attrs = ['length', 'value', 'type', 'divider', 'placeholder', 'disabled'];

  get length() { return parseInt(this._attr('length', '6'), 10) || 6; }
  get value() { return this._attr('value', ''); }
  get type() { const t = this._attr('type', 'text'); return ['text', 'number', 'password'].includes(t) ? t : 'text'; }
  get divider() { return this._attr('divider', ''); }
  get placeholder() { return this._attr('placeholder', ''); }
  get disabled() { return this._bool('disabled'); }

  _template() {
    const chars = this.value.split('');
    const inputType = this.type === 'password' ? 'password' : 'text';
    const inputmode = this.type === 'number' ? 'numeric' : 'text';
    const ph = this.placeholder ? ` placeholder="${this._esc(this.placeholder)}"` : '';
    const dis = this.disabled ? ' disabled' : '';

    const parts = [];
    for (let i = 0; i < this.length; i++) {
      if (i > 0 && this.divider) {
        parts.push(`<span class="w-otp-separator" aria-hidden="true">${this._esc(this.divider)}</span>`);
      }
      parts.push(`<input class="w-otp-input" type="${inputType}" inputmode="${inputmode}"`
        + ` autocomplete="one-time-code" maxlength="1" value="${this._esc(chars[i] || '')}"`
        + `${ph}${dis} aria-label="Digit ${i + 1}">`);
    }
    return `<div class="w-otp">${parts.join('')}</div>`;
  }

  _events() {
    const inputs = Array.from(this._qAll('.w-otp input'));
    inputs.forEach((input, index) => {
      // Select on focus so the next keystroke overwrites the digit in place.
      input.addEventListener('focus', () => input.select());

      input.addEventListener('input', (event) => {
        event.stopPropagation();
        let v = input.value;
        if (this.type === 'number') v = v.replace(/\D/g, '');
        input.value = v.slice(-1);
        this._sync(inputs);
        if (input.value && inputs[index + 1]) inputs[index + 1].focus();
      });

      input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && !input.value && inputs[index - 1]) {
          inputs[index - 1].focus();
        } else if (event.key === 'ArrowLeft' && inputs[index - 1]) {
          event.preventDefault();
          inputs[index - 1].focus();
        } else if (event.key === 'ArrowRight' && inputs[index + 1]) {
          event.preventDefault();
          inputs[index + 1].focus();
        }
      });

      // Paste a whole code into any box and it spreads across the remaining ones.
      input.addEventListener('paste', (event) => {
        event.preventDefault();
        let text = (event.clipboardData && event.clipboardData.getData('text')) || '';
        if (this.type === 'number') text = text.replace(/\D/g, '');
        const chars = text.split('');
        for (let i = index, j = 0; i < inputs.length && j < chars.length; i += 1, j += 1) {
          inputs[i].value = chars[j];
        }
        this._sync(inputs);
        inputs[Math.min(index + chars.length, inputs.length - 1)].focus();
      });
    });
  }

  _sync(inputs) {
    const value = inputs.map((el) => el.value).join('');
    this._silentSet('value', value);
    this._emit('input', { value });
    if (inputs.every((el) => el.value !== '')) this._emit('change', { value });
  }
}

if (!customElements.get('w-otp')) customElements.define('w-otp', WOtp);
