/* <w-radio> — Radio button web component
 *
 * Attributes:
 *   checked  - whether selected
 *   disabled - disables the radio
 *   name     - form field name (required for grouping)
 *   value    - form value when selected
 *   label    - if set, wraps in a label
 *   color    - 'primary' | 'error' | 'success' | 'warning'
 *   size     - 'xs' | 'sm' | 'md' | 'lg'
 *
 * Slot:
 *   default  - label text (alternative to label attribute)
 *
 * Events:
 *   w-change - fires on selection change (detail: { checked, name, value })
 */

class WRadio extends WElement {

  static attrs = ['checked', 'disabled', 'name', 'value', 'label', 'color', 'size'];

  get checked()  { return this._bool('checked'); }
  set checked(v)  { v ? this.setAttribute('checked', '') : this.removeAttribute('checked'); }
  get disabled() { return this._bool('disabled'); }
  get name()     { return this._attr('name', ''); }
  get value()    { return this._attr('value', 'on'); }
  get label()    { return this._attr('label', ''); }
  get color()    { return this._attr('color', ''); }
  get size()     { return this._attr('size', 'md'); }

  _template() {
    const chk = this.checked ? ' checked' : '';
    const dis = this.disabled ? ' disabled' : '';
    const nm = this.name ? ` name="${this._esc(this.name)}"` : '';
    const val = this.value ? ` value="${this._esc(this.value)}"` : '';

    const colorClass = this.color ? ` w-checkbox--${this._esc(this.color)}` : '';
    const sizeClass = ` w-checkbox--${this._esc(this.size || 'md')}`;

    const input = `<input class="w-checkbox-input" type="radio"${chk}${dis}${nm}${val}>`;
    const box = '<span class="w-checkbox-box" aria-hidden="true"></span>';

    let text = '';
    if (this.label) {
      text = `<span class="w-checkbox-label">${this._esc(this.label)}</span>`;
    } else {
      text = `<span class="w-checkbox-label"><slot></slot></span>`;
    }

    return `<label class="w-checkbox w-radio${colorClass}${sizeClass}">${input}${box}${text}</label>`;
  }

  _events() {
    const inp = this._q('input[type="radio"]');
    if (!inp) return;

    inp.addEventListener('change', () => {
      if (inp.checked && this.name) {
        const root = this.getRootNode();
        root.querySelectorAll('w-radio').forEach((radio) => {
          if (radio === this || radio.getAttribute('name') !== this.name) return;
          radio._silentSet?.('checked', false);
          const otherInput = radio.querySelector('input[type="radio"]');
          if (otherInput) otherInput.checked = false;
        });
      }
      this._silentSet('checked', inp.checked);
      this._emit('w-change', { checked: inp.checked, name: this.name, value: this.value });
    });
  }
}

customElements.define('w-radio', WRadio);
