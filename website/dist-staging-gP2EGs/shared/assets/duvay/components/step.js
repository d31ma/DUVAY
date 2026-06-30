/* <w-step> — DuVay component module */

export class WStep extends WElement {
  static attrs = ['label', 'caption', 'state', 'value'];

  get label() { return this._attr('label', ''); }
  get caption() { return this._attr('caption', ''); }
  get state() { return this._attr('state', ''); }
  get value() { return this._attr('value', ''); }

  _template() {
    const stateClass = this.state ? ' ' + this.state : '';
    return `<div class="w-step${stateClass}">
      <div class="w-step-indicator">${this._esc(this.value || '')}</div>
      <div class="w-step-connector"></div>
      <div class="w-step-content">
        <div class="w-step-label">${this._esc(this.label)}<slot></slot></div>
        ${this.caption ? `<div class="w-step-caption">${this._esc(this.caption)}</div>` : ''}
      </div>
    </div>`;
  }
}

if (!customElements.get('w-step')) customElements.define('w-step', WStep);
