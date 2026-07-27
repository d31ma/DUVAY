/* <w-combobox> — Autocomplete that allows free-text values.
 *
 * Adds, on top of <w-autocomplete>:
 *   delimiters    - characters that commit the current text as a value when typed
 *                   (e.g. delimiters=", " makes comma and space both end a tag)
 *   always-filter - keep filtering the list against the field text even when
 *                   that text is just the current selection echoed back
 *   commit on blur - pending free text is added as a value when the field loses focus
 *
 * Everything else — the field surface (variant, flat, prefix, icons, counter,
 * messages, validate-on, …), the menu props, and filtering — is inherited from
 * <w-autocomplete> and works unchanged on <w-combobox>.
 */
import { WAutocomplete } from './autocomplete.js';

export class WCombobox extends WAutocomplete {
  static attrs = ['delimiters', 'always-filter'];

  get _isCombobox() { return true; }
  get delimiters() { return Array.from(this._attr('delimiters', '')); }
  get alwaysFilter() { return this._bool('always-filter'); }

  _events() {
    super._events();
    const input = this._q('.w-autocomplete-input');
    if (!input) return;
    this._delimiterEvents(input);
    this._freeTextEvents(input);
  }

  _delimiterEvents(input) {
    const delimiters = this.delimiters;
    if (!delimiters.length) return;
    input.addEventListener('input', () => {
      const hit = delimiters.find((d) => input.value.includes(d));
      if (!hit) return;
      const text = input.value.split(hit)[0].trim();
      input.value = '';
      if (text) this._commitFreeText(text);
    });
  }

  // Combobox commits whatever is typed when the field is left.
  _freeTextEvents(input) {
    input.addEventListener('blur', () => {
      const text = input.value.trim();
      if (!text || this._hasValue(text)) return;
      // Don't re-commit a known item (single mode shows the title in the input).
      if (this._parseItems().some((it) => it.value === text || it.title === text)) return;
      this._commitFreeText(text);
    });
  }

  // A combobox echoes the chosen item back into the input, so re-opening the
  // menu would otherwise show a list filtered down to that one item. The whole
  // list comes back instead — unless `always-filter` asks for suggestions that
  // stay narrowed to the text in the field.
  _filter() {
    const input = this._q('.w-autocomplete-input');
    if (!input || this.multiple || this.alwaysFilter) return super._filter();
    const selected = this._findItem(this.value);
    if (!selected || input.value !== selected.title) return super._filter();
    const text = input.value;
    input.value = '';
    super._filter();
    input.value = text;
  }
}

if (!customElements.get('w-combobox')) {
  customElements.define('w-combobox', WCombobox);
}
