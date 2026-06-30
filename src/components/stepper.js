/* <w-stepper> — interactive step navigation (DuVay equivalent of Vuetify v-stepper)
 *
 * Manages an active-step `value` across w-step / w-stepper-item header children,
 * marks earlier steps complete, optionally drives a w-stepper-window's panels,
 * and wires prev/next actions ([data-stepper-action]).
 *
 * Attributes:
 *   value       - the active step's value (defaults to the first step)
 *   editable    - every step header is clickable
 *   non-linear  - steps may be visited in any order (headers clickable)
 *   alt-labels  - place labels beneath the indicators
 *   vertical    - stack steps vertically
 *
 * Slots:
 *   default - w-step/w-stepper-item headers, an optional w-stepper-window, and
 *             an optional w-stepper-actions
 *
 * Events:
 *   change - fires when the active step changes, detail { value }
 */

export class WStepper extends WElement {
  static attrs = ['value', 'editable', 'non-linear', 'alt-labels', 'mandatory', 'vertical'];

  get editable() { return this._bool('editable'); }
  get nonLinear() { return this._bool('non-linear'); }
  get altLabels() { return this._bool('alt-labels'); }
  get vertical() { return this._bool('vertical'); }

  _stepSelector() { return 'w-step, w-stepper-item'; }

  _template() {
    const cls = ['w-stepper'];
    if (this.vertical) cls.push('w-stepper--vertical');
    if (this.altLabels) cls.push('w-stepper--alt-labels');
    if (this.editable || this.nonLinear) cls.push('w-stepper--clickable');
    return `<div class="${cls.join(' ')}"><slot></slot></div>`;
  }

  _events() {
    this._sync();
    queueMicrotask(() => this.isConnected && this._sync());
    if (this.__wStepperBound) return;
    this.__wStepperBound = true;
    this.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      const action = target.closest('[data-stepper-action]');
      if (action && this.contains(action) && !action.hasAttribute('disabled')) {
        this._move(action.getAttribute('data-stepper-action') === 'prev' ? -1 : 1);
        return;
      }
      const header = target.closest('[data-step-header]');
      if (!header || !this.contains(header)) return;
      const step = header.closest(this._stepSelector());
      if (!step || step.closest('w-stepper-window')) return;
      if (!(this.editable || this.nonLinear)) return;
      const steps = this._steps();
      const index = steps.indexOf(step);
      if (index >= 0) this._goto(this._stepValue(step, index));
    });
  }

  /* ── Step model ──────────────────────────────────────────────────────── */
  _steps() {
    return Array.from(this.querySelectorAll(this._stepSelector()))
      .filter((step) => !step.closest('w-stepper-window'));
  }

  _stepValue(step, index) { return step.getAttribute('value') || String(index + 1); }

  get activeValue() {
    const value = this._attr('value', '');
    if (value) return value;
    const steps = this._steps();
    return steps.length ? this._stepValue(steps[0], 0) : '';
  }

  _activeIndex() {
    const steps = this._steps();
    const active = this.activeValue;
    const index = steps.findIndex((step, i) => this._stepValue(step, i) === active);
    return index < 0 ? 0 : index;
  }

  /* ── Navigation ──────────────────────────────────────────────────────── */
  _move(delta) {
    const steps = this._steps();
    const index = this._activeIndex() + delta;
    if (index < 0 || index >= steps.length) return;
    this._goto(this._stepValue(steps[index], index));
  }

  _goto(value) {
    if (value === this.activeValue) return;
    this._silentSet('value', value);
    this._sync();
    this._emit('change', { value });
  }

  /* ── Sync ────────────────────────────────────────────────────────────── */
  _sync() {
    const steps = this._steps();
    const activeIndex = this._activeIndex();
    const clickable = this.editable || this.nonLinear;

    steps.forEach((step, i) => {
      const active = i === activeIndex;
      const error = step.hasAttribute('error');
      const complete = !active && (i < activeIndex || step.hasAttribute('complete'));
      const state = error ? 'error' : active ? 'active' : complete ? 'done' : '';
      if (step.getAttribute('state') !== state) step.setAttribute('state', state);
      if (step.hasAttribute('editable') !== clickable) step.toggleAttribute('editable', clickable);
      step.setAttribute('aria-current', active ? 'step' : 'false');
    });

    const win = this.querySelector('w-stepper-window');
    if (win && win.getAttribute('value') !== String(activeIndex)) win.setAttribute('value', String(activeIndex));

    this.querySelectorAll('[data-stepper-action]').forEach((btn) => {
      const dir = btn.getAttribute('data-stepper-action');
      const disabled = dir === 'prev' ? activeIndex <= 0 : activeIndex >= steps.length - 1;
      btn.toggleAttribute('disabled', disabled);
    });
  }
}

if (!customElements.get('w-stepper')) customElements.define('w-stepper', WStepper);
