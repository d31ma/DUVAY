/* <w-chip-group> — selectable chip group */

export class WChipGroup extends WElement {
  static attrs = ['value', 'multiple', 'mandatory', 'disabled', 'selected-class'];

  get value() { return this._attr('value', ''); }
  get multiple() { return this._bool('multiple'); }
  get mandatory() { return this._bool('mandatory'); }
  get disabled() { return this._bool('disabled'); }
  get selectedClass() { return this._attr('selected-class', 'selected'); }

  _template() {
    return `<div class="w-chip-group" role="group" aria-disabled="${this.disabled ? 'true' : 'false'}"><slot></slot></div>`;
  }

  _events() {
    this._syncChildren();
    const schedule = typeof queueMicrotask === 'function'
      ? queueMicrotask
      : (callback) => Promise.resolve().then(callback);
    schedule(() => this.isConnected && this._syncChildren());
    if (this.__wChipGroupChange) return;
    this.__wChipGroupChange = (event) => {
      const chip = event.target?.closest?.('w-chip');
      if (!chip || !this.contains(chip) || chip.hasAttribute('disabled') || this.disabled) return;
      event.stopImmediatePropagation();
      this._selectChip(chip, event.detail?.selected !== false);
    };
    this.addEventListener('change', this.__wChipGroupChange);
  }

  _selectChip(chip, selected) {
    const chipValue = this._chipValue(chip);
    if (!chipValue) return;

    if (this.multiple) {
      const values = new Set(this._values());
      if (selected) values.add(chipValue);
      else if (!this.mandatory || values.size > 1) values.delete(chipValue);
      this._commit(Array.from(values));
      return;
    }

    if (!selected && this.mandatory) {
      this._commit([chipValue]);
      return;
    }
    this._commit(selected ? [chipValue] : []);
  }

  _commit(values) {
    const next = this.multiple ? values.join(',') : (values[0] || '');
    this._silentSet('value', next || null);
    this._syncChildren(values);
    this._emit('change', { value: this.multiple ? values : next });
  }

  _syncChildren(values = this._values()) {
    const selected = new Set(values);
    this._chips().forEach((chip) => {
      const isSelected = selected.has(this._chipValue(chip));
      chip._silentSet?.('selected', isSelected ? '' : null);
      chip.querySelector('.w-chip')?.classList.toggle(this.selectedClass, isSelected);
      chip.querySelector('.w-chip')?.classList.toggle('w-chip--selected', isSelected);
      chip.querySelector('.w-chip')?.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      if (this.disabled) chip.setAttribute('disabled', '');
    });
  }

  _values() {
    return String(this.value || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }

  _chips() {
    return Array.from(this.querySelectorAll('w-chip'));
  }

  _chipValue(chip) {
    return chip.getAttribute('value') || chip.textContent.trim();
  }
}

if (!customElements.get('w-chip-group')) customElements.define('w-chip-group', WChipGroup);
