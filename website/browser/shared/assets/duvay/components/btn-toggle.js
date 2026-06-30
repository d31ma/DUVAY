/* <w-btn-toggle> — segmented selection group (DuVay equivalent of Vuetify v-btn-toggle)
 *
 * Wraps a set of <w-btn> children in the joined .w-btn-group visual and manages
 * which ones are selected, marking them with `active`.
 *
 * Attributes:
 *   value           - selected value (single), or comma-separated list (multiple)
 *   multiple        - allow more than one selection
 *   mandatory       - true: keep at least one selected; "force": also select the first initially
 *   max             - maximum number of selections (multiple mode)
 *   selected-class  - extra class added to selected child hosts
 *   disabled        - disable the whole group
 *   divided         - show separators between buttons
 *   variant         - variant applied to child buttons that don't set their own
 *   color           - color applied to child buttons that don't set their own
 *   density         - density applied to child buttons that don't set their own
 *
 * Slots:
 *   default - w-btn elements (each may carry a `value`)
 *
 * Events:
 *   change - fires on selection change with detail { value } (string single / array multiple)
 */
import { wValueList, wNumberAttr } from './utils.js';

export class WBtnToggle extends WElement {
  static attrs = ['value', 'multiple', 'mandatory', 'max', 'selected-class', 'disabled', 'divided', 'variant', 'color', 'density'];

  get value() { return this._attr('value', ''); }
  get multiple() { return this._bool('multiple'); }
  get mandatory() {
    const value = this._attr('mandatory', null);
    if (value === null) return false;
    return value === 'force' ? 'force' : true;
  }
  get max() { return Math.max(0, wNumberAttr(this, 'max', 0)); }
  get selectedClass() { return this._attr('selected-class', ''); }
  get disabled() { return this._bool('disabled'); }
  get divided() { return this._bool('divided'); }
  get variant() { return this._attr('variant', ''); }
  get density() { return this._attr('density', ''); }

  _template() {
    const classes = ['w-btn-group', 'w-btn-toggle'];
    if (this.divided) classes.push('w-btn-group--divided');
    return `<div class="${classes.join(' ')}" role="group" aria-disabled="${this.disabled ? 'true' : 'false'}"><slot></slot></div>`;
  }

  _events() {
    this._decorate();

    // mandatory="force" selects the first enabled button when nothing is chosen.
    if (this.mandatory === 'force' && !this._values().length) {
      const first = this._btns().find((btn) => !btn.hasAttribute('disabled'));
      if (first) this._silentSet('value', this._btnValue(first));
    }
    this._sync();

    if (this.__wToggleBound) return;
    this.__wToggleBound = true;
    this.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const btn = target ? target.closest('w-btn') : null;
      if (!btn || !this.contains(btn) || btn.hasAttribute('disabled') || this.disabled) return;
      this._toggle(btn);
    });
  }

  _toggle(btn) {
    const val = this._btnValue(btn);
    let values = this._values();

    if (this.multiple) {
      if (values.includes(val)) {
        if (this.mandatory && values.length <= 1) return;
        values = values.filter((v) => v !== val);
      } else {
        if (this.max && values.length >= this.max) return;
        values = values.concat(val);
      }
    } else if (values.includes(val)) {
      if (this.mandatory) return;
      values = [];
    } else {
      values = [val];
    }
    this._commit(values);
  }

  _commit(values) {
    const next = this.multiple ? values.join(',') : (values[0] || '');
    this._silentSet('value', next || null);
    this._sync(values);
    this._emit('change', { value: this.multiple ? values : next });
  }

  _sync(values) {
    const selected = new Set(values || this._values());
    this._btns().forEach((btn) => {
      const on = selected.has(this._btnValue(btn));
      btn.toggleAttribute('active', on);
      if (this.selectedClass) btn.classList.toggle(this.selectedClass, on);
    });
    // aria-pressed lives on the inner control, which re-renders when `active`
    // toggles — re-apply after the child's microtask render settles.
    const apply = () => this._btns().forEach((btn) => {
      const inner = btn.querySelector('button, a');
      if (inner) inner.setAttribute('aria-pressed', selected.has(this._btnValue(btn)) ? 'true' : 'false');
    });
    apply();
    queueMicrotask(apply);
  }

  _decorate() {
    this._btns().forEach((btn) => {
      if (this.variant && !btn.hasAttribute('variant')) btn.setAttribute('variant', this.variant);
      if (this._attr('color', '') && !btn.hasAttribute('color')) btn.setAttribute('color', this._attr('color', ''));
      if (this.density && !btn.hasAttribute('density')) btn.setAttribute('density', this.density);
      if (this.disabled) btn.setAttribute('disabled', '');
    });
  }

  _values() {
    const raw = this.value;
    if (this.multiple) return wValueList(raw);
    return raw ? [raw] : [];
  }

  _btns() { return Array.from(this.querySelectorAll('w-btn')); }

  _btnValue(btn) { return btn.getAttribute('value') || btn.textContent.trim(); }
}

if (!customElements.get('w-btn-toggle')) customElements.define('w-btn-toggle', WBtnToggle);
