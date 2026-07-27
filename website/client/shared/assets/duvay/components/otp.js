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
 *   error        - manual error state (red boxes, aria-invalid)
 *   variant      - outlined | plain | filled | underlined | solo | solo-inverted
 *                  | solo-filled
 *   pattern      - numeric | alpha | alphanumeric | unicode-alpha |
 *                  unicode-alphanumeric | a custom regular expression source.
 *                  Defaults to numeric when type="number".
 *   autofocus    - focus the first box on render
 *   label        - visible label above the boxes, also names the group
 *   merged       - one seamless block instead of separated boxes
 *   focus-all    - every box shows the focus state while any one has focus
 *   masked       - render entered characters as bullets (works with type=number)
 *
 * Events:
 *   input               - { value } on each change
 *   change              - { value } once every box is filled
 */

let otpUid = 0;

export class WOtp extends WElement {
  static attrs = ['length', 'value', 'type', 'divider', 'placeholder', 'disabled',
    'error', 'variant', 'pattern', 'autofocus', 'label', 'merged', 'focus-all', 'masked'];

  // Vuetify's named character classes; anything else is read as a regex source.
  static patterns = {
    numeric: /[0-9]/,
    alpha: /[a-zA-Z]/,
    alphanumeric: /[a-zA-Z0-9]/,
    'unicode-alpha': /\p{L}/u,
    'unicode-alphanumeric': /[\p{L}\p{N}]/u,
  };

  get length() { return parseInt(this._attr('length', '6'), 10) || 6; }
  get value() { return this._attr('value', ''); }
  get type() { const t = this._attr('type', 'text'); return ['text', 'number', 'password'].includes(t) ? t : 'text'; }
  get divider() { return this._attr('divider', ''); }
  get placeholder() { return this._attr('placeholder', ''); }
  get disabled() { return this._bool('disabled'); }
  get error() { return this._bool('error'); }
  get variant() { return this._attr('variant', ''); }
  get label() { return this._attr('label', ''); }
  get merged() { return this._bool('merged'); }
  get focusAll() { return this._bool('focus-all'); }
  get masked() { return this._bool('masked'); }

  get pattern() {
    const raw = this._attr('pattern', '');
    if (!raw) return this.type === 'number' ? WOtp.patterns.numeric : null;
    if (WOtp.patterns[raw]) return WOtp.patterns[raw];
    try {
      return new RegExp(raw, 'u');
    } catch (_) {
      return null;
    }
  }

  _uid() {
    if (!this.__uid) this.__uid = 'w-otp-' + (++otpUid);
    return this.__uid;
  }

  _filter(text) {
    const pattern = this.pattern;
    if (!pattern) return text;
    return String(text).split('').filter((char) => pattern.test(char)).join('');
  }

  _rootClass() {
    return 'w-otp' + this._cls({
      'w-otp--error': this.error,
      'w-otp--merged': this.merged,
      'w-otp--focus-all': this.focusAll,
      ['w-otp--variant-' + this.variant]: this.variant,
    });
  }

  _box(index, char) {
    const attrs = this._attrs({
      class: 'w-otp-input',
      type: this.type === 'password' || this.masked ? 'password' : 'text',
      inputmode: this.type === 'number' ? 'numeric' : 'text',
      autocomplete: 'one-time-code',
      maxlength: '1',
      value: char,
      placeholder: this.placeholder,
      disabled: this.disabled,
      'aria-invalid': this.error && 'true',
      'aria-label': `Digit ${index + 1}`,
    });
    return `<input${attrs}>`;
  }

  _template() {
    const chars = this.value.split('');
    const parts = [];
    for (let i = 0; i < this.length; i++) {
      if (i > 0 && this.divider) {
        parts.push(`<span class="w-otp-separator" aria-hidden="true">${this._esc(this.divider)}</span>`);
      }
      parts.push(this._box(i, chars[i] || ''));
    }
    const label = this.label
      ? `<span class="w-label" id="${this._uid()}-label">${this._esc(this.label)}</span>`
      : '';
    const group = this._attrs({ role: 'group', 'aria-labelledby': this.label && `${this._uid()}-label` });
    return `${label}<div class="${this._rootClass()}"${group}>${parts.join('')}</div>`;
  }

  _events() {
    const inputs = Array.from(this._qAll('.w-otp input'));
    this._bindFocusAll(inputs);
    this._autofocus(inputs);
    inputs.forEach((input, index) => {
      // Select on focus so the next keystroke overwrites the digit in place.
      input.addEventListener('focus', () => input.select());

      input.addEventListener('input', (event) => {
        event.stopPropagation();
        input.value = this._filter(input.value).slice(-1);
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
        const text = this._filter((event.clipboardData && event.clipboardData.getData('text')) || '');
        const chars = text.split('');
        for (let i = index, j = 0; i < inputs.length && j < chars.length; i += 1, j += 1) {
          inputs[i].value = chars[j];
        }
        this._sync(inputs);
        inputs[Math.min(index + chars.length, inputs.length - 1)].focus();
      });
    });
  }

  // `focus-all` lights every box while focus is anywhere inside the row.
  _bindFocusAll(inputs) {
    const root = this._q('.w-otp');
    if (!this.focusAll || !root || !inputs.length) return;
    inputs.forEach((input) => {
      input.addEventListener('focus', () => root.classList.add('w-otp--focused'));
      input.addEventListener('blur', () => root.classList.remove('w-otp--focused'));
    });
  }

  // Autofocus once per element: a re-render must not steal focus back.
  _autofocus(inputs) {
    if (!this._bool('autofocus') || this.__autofocused || !inputs.length) return;
    this.__autofocused = true;
    inputs[0].focus();
  }

  _sync(inputs) {
    const value = inputs.map((el) => el.value).join('');
    this._silentSet('value', value);
    this._emit('input', { value });
    if (inputs.every((el) => el.value !== '')) this._emit('change', { value });
  }
}

if (!customElements.get('w-otp')) customElements.define('w-otp', WOtp);
