/* <w-stepper> — interactive step navigation (DuVay equivalent of Vuetify v-stepper)
 *
 * Manages an active-step `value` across w-step / w-stepper-item header children,
 * marks earlier steps complete, optionally drives a w-stepper-window's panels,
 * and wires prev/next actions ([data-stepper-action]).
 *
 * Attributes:
 *   value             - the active step's value (defaults to the first step);
 *                       a comma-separated list when `multiple` is set
 *   editable          - every step header is clickable
 *   non-linear        - steps may be visited in any order (headers clickable)
 *   alt-labels        - place labels beneath the indicators
 *   vertical          - stack steps vertically
 *   flat              - drop the surrounding border and elevation
 *   multiple          - more than one step can be active at a time
 *   max               - with `multiple`, how many steps may stay active
 *   items             - JSON array of strings or { title, value, subtitle, icon,
 *                       complete, error } records; generates the step headers
 *   mobile            - force the compact layout (indicators only)
 *   mobile-breakpoint - xs…xxl or a px width below which mobile applies
 *   hide-actions      - hide the prev/next actions bar
 *   selected-class    - extra class applied to the active step header
 *   complete-icon / edit-icon / error-icon
 *                     - indicator glyphs mirrored onto every step
 *   prev-text / next-text - labels for the actions bar buttons
 *   ripple / focusable / hover - mirrored onto every step header
 *
 * Slots:
 *   default - w-step/w-stepper-item headers, an optional w-stepper-window, and
 *             an optional w-stepper-actions
 *
 * Events:
 *   change - fires when the active step changes, detail { value }
 */

import { wNumberAttr, wParseRecords, wValueList } from './utils.js';

// Screen widths (px) behind the named `mobile-breakpoint` values.
const W_STEPPER_BREAKPOINTS = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 };

export class WStepper extends WElement {
  static attrs = ['value', 'editable', 'non-linear', 'alt-labels', 'mandatory', 'vertical',
    'flat', 'multiple', 'max', 'items', 'mobile', 'mobile-breakpoint', 'hide-actions',
    'selected-class', 'complete-icon', 'edit-icon', 'error-icon', 'prev-text', 'next-text',
    'ripple', 'focusable', 'hover'];

  // Mirrored onto every step header so they can be configured in one place.
  static stepProps = ['selected-class', 'complete-icon', 'edit-icon', 'error-icon',
    'ripple', 'focusable', 'hover'];

  get editable() { return this._bool('editable'); }
  get nonLinear() { return this._bool('non-linear'); }
  get altLabels() { return this._bool('alt-labels'); }
  get vertical() { return this._bool('vertical'); }
  get flat() { return this._bool('flat'); }
  get multiple() { return this._bool('multiple'); }
  get max() { return wNumberAttr(this, 'max', 0); }
  get hideActions() { return this._bool('hide-actions'); }
  get items() { return wParseRecords(this._attr('items', '')); }

  get mobile() {
    if (this._bool('mobile')) return true;
    const query = this._mobileQuery();
    return !!query && typeof matchMedia === 'function' && matchMedia(query).matches;
  }

  _mobileQuery() {
    const raw = this._attr('mobile-breakpoint', '');
    if (!raw) return '';
    const px = raw in W_STEPPER_BREAKPOINTS ? W_STEPPER_BREAKPOINTS[raw] : Number(raw);
    return Number.isFinite(px) && px > 0 ? `(max-width: ${px - 0.02}px)` : '';
  }

  _stepSelector() { return 'w-step, w-stepper-item'; }

  /* ── Template ────────────────────────────────────────────────────────── */

  _rootClasses() {
    return this._cls({
      'w-stepper--vertical': this.vertical,
      'w-stepper--alt-labels': this.altLabels,
      'w-stepper--clickable': this.editable || this.nonLinear,
      'w-stepper--flat': this.flat,
      'w-stepper--mobile': this.mobile,
      'w-stepper--hide-actions': this.hideActions,
    });
  }

  _template() {
    return `<div class="w-stepper${this._rootClasses()}"${this._gapStyle()}>`
      + this._itemsMarkup() + `<slot></slot></div>`;
  }

  _gapStyle() {
    const gap = this._cssLength(this._attr('gap', ''));
    return gap ? ` style="--w-stepper-gap:${gap}"` : '';
  }

  _cssLength(value) {
    const raw = String(value || '').trim();
    if (/^\d+(\.\d+)?$/.test(raw)) return `${raw}px`;
    return /^\d+(\.\d+)?(px|rem|em|%)$/.test(raw) ? raw : '';
  }

  // `items` generates the step headers, so a stepper can be driven from data
  // alone; authored children still arrive through the slot alongside them.
  _itemsMarkup() {
    const items = this.items;
    if (!items.length) return '';
    const markup = items.map((item, index) => this._itemMarkup(item, index)).join('');
    // Only the horizontal layout needs the header row; vertical items stack.
    return this.vertical ? markup : `<div class="w-stepper-header">${markup}</div>`;
  }

  _itemMarkup(item, index) {
    const record = this._itemRecord(item);
    return `<${this._itemTag()}${this._attrs({
      value: String(record.value ?? index + 1),
      title: record.title ?? record.text ?? '',
      subtitle: record.subtitle ?? '',
      icon: record.icon ?? '',
      complete: record.complete === true,
      error: record.error === true,
    })}></${this._itemTag()}>`;
  }

  _itemTag() { return 'w-stepper-item'; }

  _itemRecord(item) {
    if (typeof item === 'string') return { title: item };
    if (Array.isArray(item)) return { title: item[0], value: item[1] };
    return item || {};
  }

  /* ── Events ──────────────────────────────────────────────────────────── */

  _events() {
    this._sync();
    queueMicrotask(() => this.isConnected && this._sync());
    this._bindMobileQuery();
    if (this.__wStepperBound) return;
    this.__wStepperBound = true;
    this.addEventListener('click', (event) => this._onClick(event));
  }

  // Re-render when the viewport crosses the mobile breakpoint.
  _bindMobileQuery() {
    const query = this._mobileQuery();
    if (!query || this.__wMobileBound === query || typeof matchMedia !== 'function') return;
    this.__wMobileBound = query;
    matchMedia(query).addEventListener('change', () => this._rerender());
  }

  _rerender() {
    if (!this.isConnected) return;
    this._render();
    this._events();
  }

  _onClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (this._handleAction(target)) return;
    this._handleHeader(target);
  }

  _handleAction(target) {
    const action = target.closest('[data-stepper-action]');
    if (!action || !this.contains(action) || action.hasAttribute('disabled')) return false;
    this._move(action.getAttribute('data-stepper-action') === 'prev' ? -1 : 1);
    return true;
  }

  _handleHeader(target) {
    const header = target.closest('[data-step-header]');
    if (!header || !this.contains(header)) return;
    const step = header.closest(this._stepSelector());
    if (!step || step.closest('w-stepper-window')) return;
    if (!(this.editable || this.nonLinear)) return;
    const steps = this._steps();
    const index = steps.indexOf(step);
    if (index >= 0) this._select(this._stepValue(step, index));
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

  // Every value currently marked active — a one-element list unless `multiple`.
  _activeValues() {
    if (!this.multiple) return [this.activeValue];
    return wValueList(this._attr('value', ''));
  }

  _currentValue() {
    return this.multiple ? this._attr('value', '') : this.activeValue;
  }

  // Navigation and the window follow the last active step.
  _activeIndex() {
    const active = this._activeValues();
    let index = -1;
    this._steps().forEach((step, i) => {
      if (active.includes(this._stepValue(step, i))) index = i;
    });
    return index < 0 ? 0 : index;
  }

  /* ── Navigation ──────────────────────────────────────────────────────── */
  _move(delta) {
    const steps = this._steps();
    const index = this._activeIndex() + delta;
    if (index < 0 || index >= steps.length) return;
    this._goto(this._stepValue(steps[index], index));
  }

  _select(value) {
    if (!this.multiple) return this._goto(value);
    this._goto(this._toggled(value).join(','));
  }

  // `multiple` keeps a list of active steps; `max` caps its length, the oldest
  // entry dropping out first.
  _toggled(value) {
    const current = this._activeValues();
    if (current.includes(value)) return current.filter((item) => item !== value);
    const next = current.concat(value);
    const max = this.max;
    return max > 0 ? next.slice(next.length - max) : next;
  }

  _goto(value) {
    if (value === this._currentValue()) return;
    this._silentSet('value', value);
    this._sync();
    this._emit('change', { value });
  }

  /* ── Sync ────────────────────────────────────────────────────────────── */
  _sync() {
    const steps = this._steps();
    const active = this._activeValues();
    const activeIndex = this._activeIndex();
    const clickable = this.editable || this.nonLinear;

    steps.forEach((step, i) => this._syncStep(step, i, active, activeIndex, clickable));
    this._syncWindow(activeIndex);
    this._syncActions(activeIndex, steps.length);
  }

  _syncStep(step, index, active, activeIndex, clickable) {
    const isActive = active.includes(this._stepValue(step, index));
    const state = this._stepState(step, index, isActive, activeIndex);
    if (step.getAttribute('state') !== state) step.setAttribute('state', state);
    if (step.hasAttribute('editable') !== clickable) step.toggleAttribute('editable', clickable);
    step.setAttribute('aria-current', isActive ? 'step' : 'false');
    this._applyStepProps(step);
  }

  _stepState(step, index, isActive, activeIndex) {
    if (step.hasAttribute('error')) return 'error';
    if (isActive) return 'active';
    if (index < activeIndex || step.hasAttribute('complete')) return 'done';
    return '';
  }

  _applyStepProps(step) {
    const applied = step.__wStepperProps || (step.__wStepperProps = {});
    this.constructor.stepProps.forEach((name) => this._applyStepProp(step, applied, name));
  }

  // An attribute the author put on the step always wins; anything the stepper
  // owns is kept in step, including removal.
  _applyStepProp(step, applied, name) {
    const value = this.getAttribute(name);
    if (step.hasAttribute(name) && applied[name] === undefined) return;
    if (value === applied[name]) return;
    applied[name] = value;
    if (value == null) step.removeAttribute(name);
    else step.setAttribute(name, value);
  }

  _syncWindow(activeIndex) {
    const win = this.querySelector('w-stepper-window');
    if (win && win.getAttribute('value') !== String(activeIndex)) {
      win.setAttribute('value', String(activeIndex));
    }
  }

  _syncActions(activeIndex, count) {
    this.querySelectorAll('w-stepper-actions, w-stepper-vertical-actions')
      .forEach((bar) => this._applyActionText(bar));

    this.querySelectorAll('[data-stepper-action]').forEach((btn) => {
      const dir = btn.getAttribute('data-stepper-action');
      const disabled = dir === 'prev' ? activeIndex <= 0 : activeIndex >= count - 1;
      btn.toggleAttribute('disabled', disabled);
    });
  }

  _applyActionText(bar) {
    ['prev-text', 'next-text'].forEach((name) => {
      const value = this.getAttribute(name);
      if (value != null && bar.getAttribute(name) !== value) bar.setAttribute(name, value);
    });
  }
}

if (!customElements.get('w-stepper')) customElements.define('w-stepper', WStepper);
