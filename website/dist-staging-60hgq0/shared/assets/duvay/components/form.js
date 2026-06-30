/* <w-form> — form wrapper with aggregate validation.
 *
 * Mirrors Vuetify's <v-form> (https://vuetifyjs.com/en/components/forms/).
 *
 * Attributes:
 *   disabled      - disables every contained control
 *   readonly      - makes every contained control read-only (where supported)
 *   fast-fail     - stop validating at the first failing field
 *   validate-on   - when fields validate: "input" (default) | "blur" | "submit"
 *                   (space-separated combos allowed, e.g. "blur submit")
 *   model-value   - reflects validity: "true" valid, "false" invalid, absent = not validated
 *
 * Events:
 *   w-submit              - { valid, errors }; native submit is prevented
 *   update:model-value    - { value: boolean | null } when validity changes
 *
 * Methods (call via element ref, matching v-form's exposed API):
 *   validate()        -> { valid, errors: [{ id, errorMessages }] }
 *   reset()           -> reset field values and validation
 *   resetValidation() -> clear validation, keep values
 *
 * Getters: items, errors, isValid, isValidating, isDisabled, isReadonly
 *
 * ponytail: validation is native HTML5 constraint validation (required, type,
 * pattern, min/max...). Upgrade path: add a per-field `rules` array + a w-field
 * validate() hook if JS validators beyond the platform's are ever needed.
 */

export class WForm extends WElement {
  static attrs = ['fast-fail', 'validate-on'];

  get fastFail()   { return this.hasAttribute('fast-fail'); }
  get validateOn() { return this._attr('validate-on', 'input'); }
  get isDisabled() { return this.hasAttribute('disabled'); }
  get isReadonly() { return this.hasAttribute('readonly'); }
  get items()      { return this._fields(); }
  get errors()     { return this._errors || []; }
  get isValidating() { return false; }
  get isValid() {
    const v = this.getAttribute('model-value');
    return v == null ? null : v === 'true';
  }

  _template() { return `<form class="w-form" novalidate><slot></slot></form>`; }

  _events() {
    // Re-applied after every render (base calls _events() post-render).
    this._applyState();

    // Delegated listeners attach to the host once and survive re-renders.
    if (this._formBound) return;
    this._formBound = true;

    this.addEventListener('submit', (event) => this._onSubmit(event));
    this.addEventListener('input', (event) => this._onFieldEvent(event, 'input'), true);
    this.addEventListener('blur', (event) => this._onFieldEvent(event, 'blur'), true);
  }

  /* ── Public API (mirrors v-form's exposed ref) ─────────────────────────── */

  validate() {
    const errors = [];
    let valid = true;

    this._fields().forEach((el, i) => {
      if (!valid && this.fastFail) return;
      const ok = el.validity.valid;
      this._mark(el, ok);
      if (!ok) {
        valid = false;
        errors.push({ id: this._fieldId(el, i), errorMessages: [el.validationMessage] });
      }
    });

    this._errors = errors;
    this._setValidity(this._fields().length ? valid : null);
    return { valid, errors };
  }

  reset() {
    this.querySelector('form')?.reset();
    this.resetValidation();
  }

  resetValidation() {
    this._fields().forEach((el) => this._mark(el, null));
    this._errors = [];
    this._setValidity(null);
  }

  /* ── Internals ─────────────────────────────────────────────────────────── */

  _fields() {
    // willValidate is false for disabled controls, buttons, fieldsets, etc.
    return Array.from(this.querySelectorAll('input, select, textarea'))
      .filter((el) => el.willValidate);
  }

  _fieldId(el, i) {
    return el.name || el.id || ('field-' + i);
  }

  _onSubmit(event) {
    const result = this.validate();
    this._emit('w-submit', { valid: result.valid, errors: result.errors });

    // Like v-form: only let the browser actually submit when valid, the
    // consumer didn't preventDefault, and there's somewhere to submit to.
    const form = this.querySelector('form');
    if (!event.defaultPrevented && result.valid && form && form.getAttribute('action')) {
      form.submit();
    }
    event.preventDefault();
  }

  _onFieldEvent(event, kind) {
    if (!this.validateOn.split(/\s+/).includes(kind)) return;
    const el = event.target;
    if (!el || !this._fields().includes(el)) return;
    this._mark(el, el.validity.valid);
    this._refreshValidity();
  }

  // Aggregate validity from only the fields that have been validated so far,
  // so untouched fields don't flip the form to valid prematurely.
  _refreshValidity() {
    const states = this._fields().map((el) => el.dataset.wValidated);
    if (states.some((s) => s === 'invalid')) return this._setValidity(false);
    if (states.length && states.every((s) => s === 'valid')) return this._setValidity(true);
    this._setValidity(null);
  }

  // ok === true: valid, false: invalid, null: cleared.
  _mark(el, ok) {
    if (ok === null) {
      el.removeAttribute('aria-invalid');
      delete el.dataset.wValidated;
    } else {
      el.dataset.wValidated = ok ? 'valid' : 'invalid';
      if (ok) el.removeAttribute('aria-invalid');
      else el.setAttribute('aria-invalid', 'true');
    }
    const field = el.closest('.w-field');
    if (field) field.classList.toggle('w-field-error', ok === false);
  }

  _setValidity(value) {
    if (this._validity === value) return;
    this._validity = value;
    this._silentSet('model-value', value === null ? null : (value ? 'true' : 'false'));
    this.dispatchEvent(new CustomEvent('update:model-value', {
      detail: { value }, bubbles: true, composed: true,
    }));
  }

  // Cascade disabled/readonly onto contained native controls. We tag what the
  // form imposed (data-w-form-*) so toggling the form back on never clobbers a
  // control that was individually disabled/readonly.
  // ponytail: operates on native controls directly; a w-* child that re-renders
  // mid-session reapplies its own state, which is the desired precedence anyway.
  _applyState() {
    const dis = this.isDisabled;
    const ro = this.isReadonly;
    this.querySelectorAll('input, select, textarea, button').forEach((el) => {
      this._cascade(el, 'disabled', dis);
      if ('readOnly' in el) this._cascade(el, 'readOnly', ro);
    });
  }

  _cascade(el, prop, on) {
    const flag = 'wForm' + prop;
    if (on) {
      if (!el[prop]) { el[prop] = true; el.dataset[flag] = '1'; }
    } else if (el.dataset[flag]) {
      el[prop] = false;
      delete el.dataset[flag];
    }
  }
}

if (!customElements.get('w-form')) customElements.define('w-form', WForm);
