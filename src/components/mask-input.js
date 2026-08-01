/* <w-mask-input> — text field with a small, deterministic input-mask grammar.
 * Tokens: # digit, A letter, N alphanumeric, X any character. A backslash
 * escapes the next mask character.
 */

import { WTextField } from './text-field.js';

export class WMaskInput extends WTextField {
  static attrs = ['mask', 'return-masked-value', 'model-value', 'model-modifiers'];

  get mask() {
    if (this._maskValue !== undefined) return this._maskValue;
    const raw = this._attr('mask', '');
    if (!raw.startsWith('{')) return raw;
    try { return JSON.parse(raw).mask || ''; } catch { return ''; }
  }
  set mask(value) {
    this._maskValue = this._maskFrom(value);
    this._refresh();
  }

  _maskFrom(value) {
    if (value && typeof value === 'object') return value.mask || '';
    return String(value || '');
  }

  get value() { return this._value !== undefined ? this._value : this._attr('model-value', this._attr('value', '')); }
  set value(value) { super.value = value; }

  _events() {
    const input = this._control();
    if (!input || !this.mask) return super._events();

    input.addEventListener('input', (event) => {
      event.stopPropagation();
      const masked = this._applyMask(input.value);
      input.value = masked;
      this._value = masked;
      this._silentSet('value', masked);
      const value = this._bool('return-masked-value') ? masked : this._unmask(masked);
      this._silentSet('model-value', value);
      this._sync();
      this._emit('input', { value, maskedValue: masked, name: this.name });
      this._emit('update:modelValue', { value });
    });
    input.addEventListener('change', (event) => {
      event.stopPropagation();
      const masked = this._applyMask(input.value);
      const value = this._bool('return-masked-value') ? masked : this._unmask(masked);
      this._emit('change', { value, maskedValue: masked, name: this.name });
    });

    this._bindClear(input);
    this._q('.w-text-field-clear')?.addEventListener('click', () => {
      this._silentSet('model-value', '');
      this._emit('update:modelValue', { value: '' });
    });
    this._bindValidation(input);

    const masked = this._applyMask(input.value);
    input.value = masked;
    this._value = masked;
    this._silentSet('value', masked);
    this._silentSet('model-value', this._bool('return-masked-value') ? masked : this._unmask(masked));
    this._sync();
  }

  _applyMask(value) {
    const state = { input: Array.from(String(value || '')), index: 0, output: '', done: false };
    for (let cursor = 0; cursor < this.mask.length; cursor += 1) {
      let token = this.mask[cursor];
      const escaped = token === '\\' && cursor + 1 < this.mask.length;
      if (escaped) {
        token = this.mask[++cursor];
      }
      this._applyMaskToken(state, token, escaped);
      if (state.done) break;
    }
    return state.output;
  }

  _applyMaskToken(state, token, escaped) {
    if (escaped) {
      if (state.index < state.input.length) state.output += token;
      return;
    }
    const rule = { '#': /\d/, A: /[A-Za-z]/, N: /[A-Za-z0-9]/, X: /[\s\S]/ }[token];
    if (!rule) {
      if (state.index < state.input.length) state.output += token;
      if (state.input[state.index] === token) state.index += 1;
      return;
    }
    while (state.index < state.input.length && !rule.test(state.input[state.index])) state.index += 1;
    if (state.index >= state.input.length) {
      state.done = true;
      return;
    }
    state.output += state.input[state.index++];
  }

  _unmask(value) {
    const literals = new Set();
    const tokens = new Set(['#', 'A', 'N', 'X']);
    for (let index = 0; index < this.mask.length; index += 1) {
      const char = this.mask[index];
      if (char === '\\' && index + 1 < this.mask.length) literals.add(this.mask[++index]);
      else if (!tokens.has(char)) literals.add(char);
    }
    return Array.from(value).filter((char) => !literals.has(char)).join('');
  }

  _refresh() { if (this._rendered) { this._render(); this._events(); this._applyCommonProps(); } }
}

if (!customElements.get('w-mask-input')) customElements.define('w-mask-input', WMaskInput);
