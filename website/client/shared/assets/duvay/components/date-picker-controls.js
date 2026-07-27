/* <w-date-picker-controls> — the month / year / navigation bar of a date picker.
 *
 * Attributes mirror Vuetify's VDatePickerControls:
 *   month-text, year-text   — the labels shown on the two chooser buttons
 *   view-mode               — 'month' | 'months' | 'year', which chooser is open
 *   control-variant         — 'docked' (separate buttons) | 'modal' (combined)
 *   no-month-picker         — modal only; the combined button opens years
 *   active                  — control name(s) to highlight ("month", "year", …)
 *   prev-icon / next-icon / mode-icon, control-height, text
 *
 * Clicking a control emits `change` with `{ control, viewMode }`; the chooser
 * buttons additionally toggle `view-mode` and emit `update:view-mode`.
 */
import { wValueList } from './utils.js';

const VIEW_FOR = { month: 'months', year: 'year', mode: 'year' };
const CONTROL_LABELS = { month: 'Select month', year: 'Select year', mode: 'Toggle year selection' };

export class WDatePickerControls extends WElement {
  static attrs = [
    'text', 'active', 'prev-icon', 'next-icon', 'mode-icon', 'control-height',
    'control-variant', 'no-month-picker', 'month-text', 'year-text', 'view-mode',
  ];

  get text() { return this._attr('text', ''); }
  get activeList() { return wValueList(this._attr('active', '')); }
  get prevIcon() { return this._attr('prev-icon', '‹'); }
  get nextIcon() { return this._attr('next-icon', '›'); }
  get modeIcon() { return this._attr('mode-icon', '▾'); }
  get monthText() { return this._attr('month-text', ''); }
  get yearText() { return this._attr('year-text', ''); }
  get noMonthPicker() { return this._bool('no-month-picker'); }
  get viewMode() { return this._attr('view-mode', 'month'); }

  get controlVariant() {
    return this._attr('control-variant', 'docked') === 'modal' ? 'modal' : 'docked';
  }

  get controlHeight() {
    const raw = this._attr('control-height', '').trim();
    if (!raw) return '';
    return /^-?\d*\.?\d+$/.test(raw) ? `${raw}px` : raw;
  }

  _template() {
    const controls = this.controlVariant === 'modal' ? this._modalControls() : this._dockedControls();
    return `<div class="w-date-picker-controls w-date-picker-controls--${this.controlVariant}"${this._styleAttr()}>`
      + this._textTemplate()
      + controls
      + this._navTemplate()
      + '<slot></slot></div>';
  }

  _styleAttr() {
    const height = this.controlHeight;
    return height ? ` style="--w-date-picker-control-height:${this._esc(height)}"` : '';
  }

  _textTemplate() {
    return this.text ? `<span class="w-date-picker-controls__text">${this._esc(this.text)}</span>` : '';
  }

  _dockedControls() {
    return this._controlButton('month', this.monthText, 'months')
      + this._controlButton('year', this.yearText, 'year');
  }

  _modalControls() {
    const control = this.noMonthPicker ? 'year' : 'month';
    const label = [this.monthText, this.yearText].filter(Boolean).join(' ');
    return this._controlButton(control, label, VIEW_FOR[control])
      + this._controlButton('mode', '', 'year');
  }

  _controlButton(control, label, view) {
    const expanded = this.viewMode === view;
    const active = expanded || this.activeList.includes(control);
    const icon = `<span class="w-date-picker-controls__mode" aria-hidden="true">${this._esc(this.modeIcon)}</span>`;
    return `<button class="w-date-picker-controls__btn w-date-picker-controls__btn--${control}${active ? ' active' : ''}"`
      + ` type="button" data-control="${control}" aria-expanded="${expanded}"`
      + this._attrs({ 'aria-pressed': active && 'true', 'aria-label': !label && CONTROL_LABELS[control] })
      + `>${this._esc(label)}${icon}</button>`;
  }

  _navTemplate() {
    return '<span class="w-date-picker-controls__nav">'
      + `<button class="w-date-picker-controls__btn w-date-picker-controls__btn--prev" type="button" data-control="prev" aria-label="Previous">${this._esc(this.prevIcon)}</button>`
      + `<button class="w-date-picker-controls__btn w-date-picker-controls__btn--next" type="button" data-control="next" aria-label="Next">${this._esc(this.nextIcon)}</button>`
      + '</span>';
  }

  _events() {
    this._qAll('[data-control]').forEach((button) => {
      button.addEventListener('click', () => this._activate(button.getAttribute('data-control')));
    });
  }

  _activate(control) {
    this._emit('change', { control, viewMode: this.viewMode });
    const view = VIEW_FOR[control];
    if (!view) return;
    const value = this.viewMode === view ? 'month' : view;
    this._silentSet('view-mode', value);
    this._render();
    this._events();
    this._emit('update:view-mode', { value, control });
  }
}

if (!customElements.get('w-date-picker-controls')) {
  customElements.define('w-date-picker-controls', WDatePickerControls);
}
