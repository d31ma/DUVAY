/* <w-stepper-vertical-item> — a step in a vertical stepper (header + inline content)
 *
 * Attributes:
 *   value    - step value (defaults to its position)
 *   title    - step title (alias: label)
 *   caption  - secondary helper text
 *   state    - active | done | error (driven by w-stepper-vertical)
 *   complete - mark complete (✓)
 *   error    - mark in error (!)
 *   editable - header is clickable (driven by the parent)
 *
 * Slots:
 *   default - the step's panel content (shown when the step is active)
 */

export class WStepperVerticalItem extends WElement {
  static attrs = ['value', 'title', 'label', 'caption', 'state', 'complete', 'error', 'editable'];

  get value() { return this._attr('value', ''); }
  get title() { return this._attr('title', '') || this._attr('label', ''); }
  get caption() { return this._attr('caption', ''); }
  get state() { return this._attr('state', ''); }

  _template() {
    const isError = this._bool('error') || this.state === 'error';
    const isDone = !isError && (this._bool('complete') || this.state === 'done' || this.state === 'complete');
    const isActive = !isError && !isDone && this.state === 'active';
    const editable = this._bool('editable');

    const itemCls = ['w-stepper-vertical-item'];
    if (isActive) itemCls.push('active');
    if (isDone) itemCls.push('done');
    if (isError) itemCls.push('error');

    const stepCls = ['w-step'];
    if (isActive) stepCls.push('active');
    if (isDone) stepCls.push('done');
    if (isError) stepCls.push('error');
    if (editable) stepCls.push('editable');

    const indicator = isError ? '!' : isDone ? '✓' : this._esc(this.value || '');
    return `<div class="${itemCls.join(' ')}">
      <div class="${stepCls.join(' ')}" data-step-header>
        <div class="w-step-indicator">${indicator}</div>
        <div class="w-step-connector"></div>
        <div class="w-step-content">
          <div class="w-step-label">${this._esc(this.title)}</div>
          ${this.caption ? `<div class="w-step-caption">${this._esc(this.caption)}</div>` : ''}
        </div>
      </div>
      <div class="w-stepper-vertical-content"${isActive ? '' : ' hidden'}><slot></slot></div>
    </div>`;
  }
}

if (!customElements.get('w-stepper-vertical-item')) {
  customElements.define('w-stepper-vertical-item', WStepperVerticalItem);
}
