/* <w-date-input> — DuVay component module
 *
 * A Vuetify-style date input: a text field with a calendar icon that opens
 * a popup date picker. The canonical value is always ISO (YYYY-MM-DD),
 * comma-separated ISO dates for multiple, or "start,end" for range.
 *
 * Attributes:
 *   value          - ISO date value(s)
 *   label          - field label
 *   placeholder    - placeholder text
 *   hint           - helper text below the field
 *   error          - error message; puts the field in error state
 *   size           - xs | sm | lg | xl
 *   disabled       - disables the input and picker
 *   readonly       - makes the input read-only
 *   name           - form field name
 *   min            - minimum selectable ISO date
 *   max            - maximum selectable ISO date
 *   format         - display format pattern (yyyy-MM-dd, MM/dd/yyyy, etc.)
 *   mode           - single (default) | multiple | range
 *   clearable      - show a clear button
 *
 * Events:
 *   input  - fires while typing (detail: { value, name })
 *   change - fires when the value commits (detail: { value, name })
 */
import {
  wIsoDate,
  wParseIsoDate,
  wFormatDate,
  wParseDateList,
  wDateInRange,
} from './utils.js';

export class WDateInput extends WElement {
  static attrs = [
    'value', 'label', 'placeholder', 'hint', 'error', 'size',
    'disabled', 'readonly', 'name', 'min', 'max', 'format', 'mode', 'clearable',
    'first-day-of-week', 'show-adjacent-months',
  ];

  constructor() {
    super();
    this._popupUid = Math.random().toString(36).slice(2, 9);
    this._outsideClick = null;
  }

  get value() { return this._attr('value', ''); }
  set value(v) {
    this._silentSet('value', v);
    const input = this._q('.w-date-input-field');
    if (input) input.value = this._displayValue(v);
    const clear = this._q('.w-date-input-clear');
    if (clear) clear.hidden = !v;
  }
  get label() { return this._attr('label', ''); }
  get placeholder() { return this._attr('placeholder', ''); }
  get hint() { return this._attr('hint', ''); }
  get error() { return this._attr('error', ''); }
  get size() { return this._attr('size', ''); }
  get disabled() { return this._bool('disabled'); }
  get readonly() { return this._bool('readonly'); }
  get name() { return this._attr('name', ''); }
  get min() { return this._attr('min', ''); }
  get max() { return this._attr('max', ''); }
  get format() { return this._attr('format', ''); }
  get mode() {
    const m = this._attr('mode', 'single');
    return m === 'multiple' || m === 'range' ? m : 'single';
  }
  get clearable() { return this._bool('clearable'); }
  get firstDayOfWeek() {
    const n = parseInt(this._attr('first-day-of-week', '0'), 10);
    return Number.isNaN(n) ? 0 : ((n % 7) + 7) % 7;
  }
  get showAdjacentMonths() { return this._bool('show-adjacent-months'); }

  _displayValue(value) {
    const fmt = this.format;
    if (this.mode === 'single') {
      const d = wParseIsoDate(value);
      return d ? wFormatDate(d, fmt) : value;
    }
    if (this.mode === 'multiple') {
      return wParseDateList(value)
        .map((d) => wFormatDate(d, fmt))
        .join(', ');
    }
    // range
    return value
      .split(',')
      .map((s) => {
        const d = wParseIsoDate(s.trim());
        return d ? wFormatDate(d, fmt) : s.trim();
      })
      .filter(Boolean)
      .join(' – ');
  }

  _parseInput(text) {
    const mode = this.mode;
    if (!text.trim()) return '';

    if (mode === 'single') {
      // Accept ISO first, then a few common locale formats.
      let d = wParseIsoDate(text.trim());
      if (d) return wIsoDate(d);
      const tryDate = new Date(text.trim());
      if (!Number.isNaN(tryDate.getTime())) return wIsoDate(tryDate);
      return this.value;
    }

    if (mode === 'multiple') {
      const items = text.split(/,|;/).map((s) => s.trim()).filter(Boolean);
      const dates = [];
      for (const item of items) {
        const d = wParseIsoDate(item) || (Number.isNaN(new Date(item).getTime()) ? null : new Date(item));
        if (d) dates.push(d);
      }
      return dates.map(wIsoDate).join(',');
    }

    // range
    const parts = text.split(/[–\-–,]/).map((s) => s.trim()).filter(Boolean);
    if (parts.length < 2) return this.value;
    const start = wParseIsoDate(parts[0]) || (Number.isNaN(new Date(parts[0]).getTime()) ? null : new Date(parts[0]));
    const end = wParseIsoDate(parts[1]) || (Number.isNaN(new Date(parts[1]).getTime()) ? null : new Date(parts[1]));
    if (start && end) return `${wIsoDate(start)},${wIsoDate(end)}`;
    return this.value;
  }

  _selectedDates() {
    const mode = this.mode;
    if (mode === 'single') {
      const d = wParseIsoDate(this.value);
      return d ? [d] : [];
    }
    if (mode === 'multiple') {
      return wParseDateList(this.value);
    }
    // range
    const parts = this.value.split(',').map((s) => s.trim()).filter(Boolean);
    const start = wParseIsoDate(parts[0] || '');
    const end = wParseIsoDate(parts[1] || '');
    return start && end ? [start, end] : start ? [start] : [];
  }

  _isOpen() { return this.classList.contains('w-date-input--open'); }

  _setOpen(open) {
    this.classList.toggle('w-date-input--open', open);
    const popup = this._q('.w-date-input-popup');
    const icon = this._q('.w-date-input-icon');
    if (popup) popup.hidden = !open;
    if (icon) icon.setAttribute('aria-expanded', String(open));
    if (open) {
      this._refreshPicker();
    }
  }

  _refreshPicker() {
    const picker = this._q('.w-date-input-popup w-date-picker');
    if (!picker) return;
    const dates = this._selectedDates();
    if (dates.length) {
      const d = dates[0];
      picker.setAttribute('month', d.getMonth() + 1);
      picker.setAttribute('year', d.getFullYear());
    }
    picker.setAttribute('value', this.value);
    picker.setAttribute('min', this.min);
    picker.setAttribute('max', this.max);
    picker.setAttribute('mode', this.mode);
    if (this.firstDayOfWeek) picker.setAttribute('first-day-of-week', this.firstDayOfWeek);
    else picker.removeAttribute('first-day-of-week');
    if (this.showAdjacentMonths) picker.setAttribute('show-adjacent-months', '');
    else picker.removeAttribute('show-adjacent-months');
  }

  _template() {
    const ph = this.placeholder ? ` placeholder="${this._esc(this.placeholder)}"` : '';
    const val = this.value ? ` value="${this._esc(this._displayValue(this.value))}"` : '';
    const dis = this.disabled ? ' disabled' : '';
    const ro = this.readonly ? ' readonly' : '';
    const iconDis = this.disabled || this.readonly ? ' disabled' : '';
    const nameAttr = this.name ? ` name="${this._esc(this.name)}"` : '';
    const sizeClass = this.size ? ` w-input--${this.size}` : '';
    const errorClass = this.error ? ' w-field-error' : '';
    const hasValue = Boolean(this.value);
    const canClear = this.clearable && hasValue && !this.disabled && !this.readonly;
    const firstDate = this._selectedDates()[0];
    const pickerExtras = [
      firstDate ? ` year="${firstDate.getFullYear()}"` : '',
      firstDate ? ` month="${firstDate.getMonth() + 1}"` : '',
      this.firstDayOfWeek ? ` first-day-of-week="${this.firstDayOfWeek}"` : '',
      this.showAdjacentMonths ? ' show-adjacent-months' : '',
    ].join('');

    return `<div class="w-field w-date-input${errorClass}">
      ${this.label ? `<label class="w-field-label">${this._esc(this.label)}</label>` : ''}
      <div class="w-date-input-wrap">
        <button class="w-date-input-icon" type="button" aria-label="Open calendar" aria-expanded="false" aria-controls="${this._popupId()}"${iconDis}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/>
          </svg>
        </button>
        <input class="w-input w-date-input-field${sizeClass}" type="text"${ph}${val}${dis}${ro}${nameAttr}>
        ${canClear ? `<button class="w-date-input-clear" type="button" aria-label="Clear date"${dis}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>` : ''}
      </div>
      ${this.error || this.hint ? `<span class="w-field-hint">${this._esc(this.error || this.hint)}</span>` : ''}
      <div class="w-date-input-popup" id="${this._popupId()}" hidden>
        <w-date-picker value="${this._esc(this.value)}" min="${this._esc(this.min)}" max="${this._esc(this.max)}" mode="${this.mode}" hide-header${pickerExtras}></w-date-picker>
      </div>
    </div>`;
  }

  _popupId() {
    return `w-date-input-popup-${this._popupUid}`;
  }

  _events() {
    const input = this._q('.w-date-input-field');
    const icon = this._q('.w-date-input-icon');
    const clear = this._q('.w-date-input-clear');
    const picker = this._q('.w-date-input-popup w-date-picker');

    if (icon) {
      icon.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.disabled || this.readonly) return;
        this._setOpen(!this._isOpen());
        if (this._isOpen()) input?.focus();
      });
    }

    if (input) {
      input.addEventListener('input', (event) => {
        event.stopPropagation();
        this._emit('input', { value: input.value, name: this.name });
      });
      input.addEventListener('change', (event) => {
        event.stopPropagation();
        const parsed = this._parseInput(input.value);
        this._commit(parsed);
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this._isOpen()) {
          e.preventDefault();
          this._setOpen(false);
        }
      });
    }

    if (clear) {
      clear.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.disabled) return;
        this._commit('');
        input?.focus();
      });
    }

    if (picker) {
      picker.addEventListener('change', (e) => {
        e.stopImmediatePropagation();
        const next = e.detail?.value ?? '';
        this._commit(next);
        if (this.mode === 'single') this._setOpen(false);
      });
    }

    if (this._outsideClick) {
      document.removeEventListener('click', this._outsideClick);
    }
    this._outsideClick = (e) => {
      if (!this._isOpen()) return;
      if (e.composedPath().includes(this)) return;
      this._setOpen(false);
    };
    document.addEventListener('click', this._outsideClick);
  }

  _commit(nextValue) {
    // Clamp to min/max for single values
    if (this.mode === 'single') {
      const d = wParseIsoDate(nextValue);
      const min = wParseIsoDate(this.min);
      const max = wParseIsoDate(this.max);
      if (d && !wDateInRange(d, min, max)) {
        nextValue = this.value; // reject
      }
    }

    const changed = nextValue !== this.value;
    this._silentSet('value', nextValue);
    const input = this._q('.w-date-input-field');
    if (input) input.value = this._displayValue(nextValue);
    const clear = this._q('.w-date-input-clear');
    if (clear) clear.hidden = !nextValue;
    if (this._isOpen()) this._refreshPicker();
    if (changed) this._emit('change', { value: nextValue, name: this.name });
  }

  disconnectedCallback() {
    if (this._outsideClick) document.removeEventListener('click', this._outsideClick);
  }

  focus() {
    const input = this._q('.w-date-input-field');
    if (input) input.focus();
  }
}

if (!customElements.get('w-date-input')) customElements.define('w-date-input', WDateInput);
