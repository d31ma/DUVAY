/* <w-switch> — Toggle switch web component, mirroring Vuetify's <v-switch>.
 *
 * An accessible checkbox styled as an on/off control. Use it for settings that
 * take effect immediately.
 *
 * Attributes:
 *   checked        - whether the switch is on (reflected)
 *   disabled       - non-interactive and dimmed
 *   readonly       - prevents toggling while keeping focus
 *   loading        - shows a spinner in the thumb and blocks toggling
 *   name           - form field name
 *   value          - native form value when checked (default "on")
 *   label          - label text (alternative to default slot)
 *   color          - 'primary' | 'error' | 'success' | 'warning'
 *   size           - 'xs' | 'sm' | 'md' | 'lg'
 *   inset          - track fully encloses the thumb
 *   flat           - thumb without elevation
 *   hint           - helper text rendered below the label
 *   error          - error text; also tints the track red
 *   hide-details   - suppresses hint/error text
 *
 * Slot:
 *   default  - label text (alternative to the label attribute)
 *
 * Events:
 *   change   - fires on toggle (detail: { checked, value, name })
 */

class WSwitch extends WElement {

  static attrs = ['checked', 'disabled', 'readonly', 'loading', 'name', 'value', 'label', 'color', 'size', 'inset', 'flat', 'hint', 'error', 'hide-details'];

  get checked()     { return this.hasAttribute('checked'); }
  set checked(v)    { v ? this.setAttribute('checked', '') : this.removeAttribute('checked'); }
  get disabled()    { return this._bool('disabled'); }
  get readonly()    { return this._bool('readonly'); }
  get loading()     { return this._bool('loading'); }
  get name()        { return this._attr('name', ''); }
  get value()       { return this._attr('value', 'on'); }
  get label()       { return this._attr('label', ''); }
  get color()       { return this._attr('color', ''); }
  get size()        { return this._attr('size', 'md'); }
  get inset()       { return this._bool('inset'); }
  get flat()        { return this._bool('flat'); }
  get hint()        { return this._attr('hint', ''); }
  get error()       { return this._attr('error', ''); }
  get hideDetails() { return this._bool('hide-details'); }

  _template() {
    const chk = this.checked ? ' checked' : '';
    const blocked = this.disabled || this.readonly || this.loading;
    const dis = this.disabled ? ' disabled' : '';
    const ro = this.readonly ? ' readonly' : '';
    const nm = this.name ? ` name="${this._esc(this.name)}"` : '';
    const val = this.value ? ` value="${this._esc(this.value)}"` : '';
    const invalid = this.error ? ' aria-invalid="true"' : '';
    const busy = this.loading ? ' aria-busy="true"' : '';

    const cls = [
      'w-switch',
      this.color ? 'w-switch--' + this._esc(this.color) : '',
      'w-switch--' + this._esc(this.size || 'md'),
      this.inset ? 'w-switch--inset' : '',
      this.flat ? 'w-switch--flat' : '',
      this.loading ? 'w-switch--loading' : '',
      this.error ? 'w-switch--error' : '',
    ].filter(Boolean).join(' ');

    const input = `<input class="w-switch-input" type="checkbox"${chk}${dis}${ro}${nm}${val}${invalid}${busy}>`;
    const track = `<span class="w-switch-track" aria-hidden="true"><span class="w-switch-thumb">${this.loading ? '<span class="w-switch-spinner"></span>' : ''}</span></span>`;

    let text = this.label
      ? `<span class="w-switch-label">${this._esc(this.label)}</span>`
      : `<span class="w-switch-label"><slot></slot></span>`;

    let details = '';
    if (!this.hideDetails) {
      if (this.error) details = `<span class="w-switch-error">${this._esc(this.error)}</span>`;
      else if (this.hint) details = `<span class="w-switch-hint">${this._esc(this.hint)}</span>`;
    }
    if (details) text = `<span class="w-switch-text">${text}${details}</span>`;

    return `<label class="${cls}">${input}${track}${text}</label>`;
  }

  _events() {
    const inp = this._q('input[type="checkbox"]');
    if (!inp) return;

    inp.addEventListener('click', (e) => {
      if (this.readonly || this.disabled || this.loading) e.preventDefault();
    });

    inp.addEventListener('change', (event) => {
      event.stopPropagation();
      if (this.readonly || this.disabled || this.loading) return;
      this._silentSet('checked', inp.checked);
      this._emit('change', { checked: inp.checked, name: this.name, value: this.value });
    });
  }
}

customElements.define('w-switch', WSwitch);
