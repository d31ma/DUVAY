/* <w-step> — a single stepper step header
 *
 * Attributes:
 *   value     - indicator label (usually the step number)
 *   label     - step title
 *   caption   - secondary helper text
 *   state     - active | done | complete | error (usually driven by w-stepper)
 *   complete  - mark this step complete (✓)
 *   error     - mark this step in error (!)
 *   editable  - the step header is clickable (driven by w-stepper editable/non-linear)
 */

export class WStep extends WElement {
  static attrs = ['label', 'caption', 'state', 'value', 'complete', 'error', 'editable'];

  get label() { return this._attr('label', ''); }
  get caption() { return this._attr('caption', ''); }
  get state() { return this._attr('state', ''); }
  get value() { return this._attr('value', ''); }

  _template() {
    const isError = this._bool('error') || this.state === 'error';
    const isDone = !isError && (this._bool('complete') || this.state === 'done' || this.state === 'complete');
    const isActive = !isError && !isDone && this.state === 'active';
    const editable = this._bool('editable');

    const cls = ['w-step'];
    if (isActive) cls.push('active');
    if (isDone) cls.push('done');
    if (isError) cls.push('error');
    if (editable) cls.push('editable');

    const indicator = isError ? '!' : isDone ? '✓' : this._esc(this.value || '');
    return `<div class="${cls.join(' ')}" role="presentation" data-step-header>
      <div class="w-step-indicator">${indicator}</div>
      <div class="w-step-connector"></div>
      <div class="w-step-content">
        <div class="w-step-label">${this._esc(this.label)}<slot></slot></div>
        ${this.caption ? `<div class="w-step-caption">${this._esc(this.caption)}</div>` : ''}
      </div>
    </div>`;
  }
}

if (!customElements.get('w-step')) customElements.define('w-step', WStep);
