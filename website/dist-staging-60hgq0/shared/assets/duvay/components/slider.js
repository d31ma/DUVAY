/* <w-slider> — Range slider web component
 *
 * Attributes:
 *   min       - minimum value (default 0)
 *   max       - maximum value (default 100)
 *   value     - current value
 *   step      - step increment (default 1)
 *   disabled  - disables the slider
 *   name      - form field name
 *   size      - xs | sm | lg | xl (omit for the default)
 *
 * Events:
 *   w-input  - fires while dragging (detail: { value, name })
 *   w-change - fires when the value is committed (detail: { value, name })
 */

class WSlider extends WElement {

  static attrs = ['min', 'max', 'value', 'step', 'disabled', 'name', 'size'];

  get min()      { return this._attr('min', '0'); }
  get max()      { return this._attr('max', '100'); }
  get value()    { return this._value !== undefined ? this._value : this._attr('value', ''); }
  set value(v)   {
    this._value = v;
    const input = this._q('input');
    if (input) input.value = v;
    this._silentSet('value', v);
  }
  get step()     { return this._attr('step', '1'); }
  get disabled() { return this._bool('disabled'); }
  get name()     { return this._attr('name', ''); }
  get size()     { return this._attr('size', ''); }

  _template() {
    const sizeClass = this.size ? ' w-slider--' + this.size : '';
    const val = this.value !== '' ? ` value="${this._esc(this.value)}"` : '';
    const dis = this.disabled ? ' disabled' : '';
    const nm = this.name ? ` name="${this._esc(this.name)}"` : '';
    return `<input type="range" class="w-slider${sizeClass}"
      min="${this._esc(this.min)}" max="${this._esc(this.max)}" step="${this._esc(this.step)}"${val}${dis}${nm}>`;
  }

  _events() {
    const inp = this._q('input');
    if (!inp) return;
    inp.addEventListener('input', () => {
      this._silentSet('value', inp.value);
      this._emit('w-input', { value: inp.value, name: this.name });
    });
    inp.addEventListener('change', () => {
      this._emit('w-change', { value: inp.value, name: this.name });
    });
  }
}

customElements.define('w-slider', WSlider);
