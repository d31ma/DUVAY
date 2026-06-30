/* <w-radio-group> — DuVay component module */

export class WRadioGroup extends WElement {
  static attrs = ['name', 'value', 'label', 'disabled', 'inline'];
  get name() { return this._attr('name', 'w-radio-group'); }
  get value() { return this._attr('value', ''); }
  get label() { return this._attr('label', ''); }
  get disabled() { return this._bool('disabled'); }
  get inline() { return this._bool('inline'); }
  _template() {
    const cls = `w-selection-control-group w-radio-group${this.inline ? ' w-radio-group--inline' : ''}`;
    return `<div class="${cls}" role="radiogroup"${this.label ? ` aria-label="${this._esc(this.label)}"` : ''}>
      ${this.label ? `<span class="w-label">${this._esc(this.label)}</span>` : ''}
      <slot></slot>
    </div>`;
  }
  _events() {
    this.querySelectorAll('w-radio').forEach((radio) => {
      if (!radio.getAttribute('name')) radio.setAttribute('name', this.name);
      if (this.disabled) {
        radio.setAttribute('disabled', '');
        radio.__wRadioGroupDisabled = true;
      } else if (radio.__wRadioGroupDisabled) {
        radio.removeAttribute('disabled');
        radio.__wRadioGroupDisabled = false;
      }
      const value = radio.getAttribute('value') || radio.textContent.trim();
      radio.toggleAttribute('checked', value === this.value);
      if (radio.__wRadioGroup === this) return;
      radio.__wRadioGroup = this;
      radio.addEventListener('change', (event) => {
        event.stopPropagation();
        if (!event.detail?.checked) return;
        const next = event.detail.value;
        this._silentSet('value', next);
        this.querySelectorAll('w-radio').forEach((item) => {
          item.toggleAttribute('checked', (item.getAttribute('value') || item.textContent.trim()) === next);
        });
        this._emit('change', { value: next, name: this.name });
      });
    });
  }
}

if (!customElements.get('w-radio-group')) customElements.define('w-radio-group', WRadioGroup);
