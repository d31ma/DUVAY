/* <w-step> — a single stepper step header
 *
 * Attributes:
 *   value          - indicator label (usually the step number)
 *   label / title  - step title
 *   caption / subtitle - secondary helper text
 *   state          - active | done | complete | error (usually driven by w-stepper)
 *   complete       - mark this step complete (✓)
 *   error          - mark this step in error (!)
 *   editable       - the step header is clickable (driven by w-stepper editable/non-linear)
 *   icon           - glyph shown in the indicator instead of the value
 *   complete-icon  - glyph shown instead of ✓
 *   edit-icon      - glyph shown while the step is editable
 *   error-icon     - glyph shown instead of !
 *   selected-class - extra class applied to the header while it is the active step
 *   ripple         - press-ripple visual on the indicator
 *   focusable      - the header is keyboard reachable and activates on Enter/Space
 *   hover          - the header lights up on pointer hover
 *
 * The parent <w-stepper> mirrors its own icon / selected-class / ripple /
 * focusable / hover attributes onto every step, so they can be set in one place.
 */

import WIcons from '../icons.js';
import { wSetValue } from './utils.js';

export class WStep extends WElement {
  static attrs = ['label', 'title', 'caption', 'subtitle', 'state', 'value', 'complete',
    'error', 'editable', 'icon', 'complete-icon', 'edit-icon', 'error-icon',
    'selected-class', 'ripple', 'focusable', 'hover'];

  get label() { return this._attr('label', '') || this._attr('title', ''); }
  get caption() { return this._attr('caption', '') || this._attr('subtitle', ''); }
  get state() { return this._attr('state', ''); }
  set value(v) { wSetValue(this, v); }
  get value() { return this._attr('value', ''); }
  get icon() { return this._attr('icon', ''); }
  get focusable() { return this._bool('focusable'); }

  // Author-supplied, so it lands in a class attribute — keep it to class syntax.
  get selectedClass() { return this._attr('selected-class', '').replace(/[^\w\s-]/g, ''); }

  _isError() { return this._bool('error') || this.state === 'error'; }
  _isDone() { return !this._isError() && (this._bool('complete') || this.state === 'done' || this.state === 'complete'); }
  _isActive() { return !this._isError() && !this._isDone() && this.state === 'active'; }

  _stepClass() {
    const active = this._isActive();
    return 'w-step' + this._cls({
      active,
      done: this._isDone(),
      error: this._isError(),
      editable: this._bool('editable'),
      'w-step--hover': this._bool('hover'),
      [this.selectedClass]: active && this.selectedClass,
    });
  }

  _glyph(name, fallback) {
    return name ? WIcons.resolve(name, { iconClass: 'w-icon' }) : fallback;
  }

  _indicator() {
    if (this._isError()) return this._glyph(this._attr('error-icon', ''), '!');
    if (this._isDone()) return this._glyph(this._attr('complete-icon', ''), '✓');
    if (this.icon) return this._glyph(this.icon, '');
    if (this._bool('editable')) return this._glyph(this._attr('edit-icon', ''), this._esc(this.value));
    return this._esc(this.value || '');
  }

  _captionMarkup() {
    return this.caption ? `<div class="w-step-caption">${this._esc(this.caption)}</div>` : '';
  }

  // `focusable` promotes the header from decoration to a real control.
  _headerAttrs() {
    return this.focusable ? ' role="button" tabindex="0"' : ' role="presentation"';
  }

  // <w-step> renders slotted children next to the label; subclasses that own
  // their own default slot (the vertical item) opt out.
  _labelSlot() { return '<slot></slot>'; }

  // Rendered after the content column — the vertical item hangs its chevron here.
  _headerExtra() { return ''; }

  _headerMarkup() {
    return `<div class="${this._stepClass()}"${this._headerAttrs()} data-step-header>
      <div class="w-step-indicator">${this._indicator()}</div>
      <div class="w-step-connector"></div>
      <div class="w-step-content">
        <div class="w-step-label">${this._esc(this.label)}${this._labelSlot()}</div>
        ${this._captionMarkup()}
      </div>
      ${this._headerExtra()}
    </div>`;
  }

  _template() {
    return this._headerMarkup();
  }

  _events() {
    const header = this._q('.w-step');
    if (!header) return;
    if (this._bool('ripple')) this._attachRipple(this._q('.w-step-indicator'));
    if (!this.focusable) return;
    header.addEventListener('keydown', (event) => this._onKeydown(event, header));
  }

  _onKeydown(event, header) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    header.click();
  }
}

if (!customElements.get('w-step')) customElements.define('w-step', WStep);
