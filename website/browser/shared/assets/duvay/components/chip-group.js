/* <w-chip-group> — selectable chip group (DuVay equivalent of Vuetify v-chip-group) */

export class WChipGroup extends WElement {
  static attrs = ['value', 'multiple', 'mandatory', 'max', 'disabled', 'selected-class', 'column', 'filter', 'variant', 'color'];

  get value() { return this._attr('value', ''); }
  get multiple() { return this._bool('multiple'); }
  get mandatory() { return this._bool('mandatory'); }
  get max() { return Math.max(0, parseInt(this._attr('max', '0'), 10) || 0); }
  get disabled() { return this._bool('disabled'); }
  get column() { return this._bool('column'); }
  get filter() { return this._bool('filter'); }
  get variant() { return this._attr('variant', ''); }
  get color() { return this._attr('color', ''); }
  get selectedClass() { return this._attr('selected-class', 'selected'); }

  _template() {
    const cls = ['w-chip-group'];
    if (this.column) cls.push('w-chip-group--column');
    if (this.filter) cls.push('w-chip-group--filter');
    return `<div class="${cls.join(' ')}" role="group" aria-disabled="${this.disabled ? 'true' : 'false'}"><slot></slot></div>`;
  }

  _events() {
    this._decorate();
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

  _decorate() {
    this._chips().forEach((chip) => {
      if (this.variant && !chip.hasAttribute('variant')) chip.setAttribute('variant', this.variant);
      if (this.color && !chip.hasAttribute('color')) chip.setAttribute('color', this.color);
    });
  }

  _selectChip(chip, selected) {
    const chipValue = this._chipValue(chip);
    if (!chipValue) return;

    if (this.multiple) {
      const values = new Set(this._values());
      if (selected) {
        if (this.max && values.size >= this.max) return;
        values.add(chipValue);
      } else if (!this.mandatory || values.size > 1) {
        values.delete(chipValue);
      }
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
