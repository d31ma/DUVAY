/* <w-combobox> — Autocomplete that allows free-text values.
 *
 * Adds, on top of <w-autocomplete>:
 *   delimiters - characters that commit the current text as a value when typed
 *                (e.g. delimiters=", " makes comma and space both end a tag)
 *   commit on blur - pending free text is added as a value when the field loses focus
 */
import { WAutocomplete } from './autocomplete.js';

export class WCombobox extends WAutocomplete {
  static attrs = ['delimiters'];

  get _isCombobox() { return true; }
  get delimiters() { return Array.from(this._attr('delimiters', '')); }

  _events() {
    super._events();
    const input = this._q('.w-autocomplete-input');
    if (!input) return;

    const delimiters = this.delimiters;
    if (delimiters.length) {
      input.addEventListener('input', () => {
        const hit = delimiters.find((d) => input.value.includes(d));
        if (!hit) return;
        const text = input.value.split(hit)[0].trim();
        input.value = '';
        if (text) this._commitFreeText(text);
      });
    }

    // Combobox commits whatever is typed when the field is left.
    input.addEventListener('blur', () => {
      const text = input.value.trim();
      if (!text || this._hasValue(text)) return;
      // Don't re-commit a known item (single mode shows the title in the input).
      if (this._parseItems().some((it) => it.value === text || it.title === text)) return;
      this._commitFreeText(text);
    });
  }
}

if (!customElements.get('w-combobox')) {
  customElements.define('w-combobox', WCombobox);
}
