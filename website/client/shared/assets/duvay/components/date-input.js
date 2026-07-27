/* <w-date-input> — DuVay component module
 *
 * A Vuetify-style date input: a text field with a calendar icon that opens
 * a popup date picker. The canonical value is always ISO (YYYY-MM-DD),
 * comma-separated ISO dates for multiple, or "start,end" for range.
 *
 * Field attributes:
 *   value          - ISO date value(s)
 *   label          - field label
 *   placeholder    - placeholder text
 *   hint           - helper text below the field
 *   messages       - extra helper messages (comma list or JSON array)
 *   error          - error message; puts the field in error state
 *   error-messages - error message list (comma list or JSON array)
 *   max-errors     - how many errors to display (default 1)
 *   validate-on    - "input" (default) | "blur" | "submit" | + "lazy" / "eager"
 *   validation-value - text validated instead of the field's own text
 *   hide-details   - suppress the details row ("auto" keeps it only when filled)
 *   indent-details - inline padding on the details row
 *   size           - xs | sm | lg | xl
 *   variant        - outlined | filled | underlined | plain | solo |
 *                    solo-inverted | solo-filled
 *   flat           - drop the variant's elevation
 *   reverse        - reverse the text direction of the control
 *   type           - native input type (default "text")
 *   autocomplete   - native autocomplete; "suppress" also randomises `name`
 *   autofocus      - focus the field on render
 *   prefix, suffix - static text before / after the input
 *   counter        - character counter (bare = 25, or a number)
 *   persistent-counter / persistent-hint / persistent-placeholder /
 *   persistent-clear / single-line / center-affix / glow / active / dirty /
 *   hide-spin-buttons - presentation flags
 *   prepend-icon / append-icon             - icons outside the control
 *   prepend-inner-icon / append-inner-icon - icons inside the control
 *   clear-icon     - glyph for the clear button
 *   icon-color     - colour token for the adornment icons
 *   disabled, readonly, name
 *   min, max       - selectable ISO bounds
 *   format         - display format pattern (yyyy-MM-dd, MM/dd/yyyy, …)
 *   display-format - alias of `format`
 *   input-format   - pattern used to parse typed text (e.g. dd/mm/yyyy)
 *   update-on      - "blur", "enter" or both; empty makes the text read-only
 *   mode           - single (default) | multiple | range
 *   multiple       - alias of mode; bare = multiple, "range" = range,
 *                    a number caps how many dates may be selected
 *   clearable      - show a clear button
 *   mobile         - force the mobile (modal) presentation
 *   mobile-breakpoint - xs|sm|md|lg|xl|xxl or px below which mobile applies
 *
 * Popup / picker attributes:
 *   menu           - open the picker on render
 *   title, text, header   - popup header content (header shows when unset)
 *   header-date-format    - format of the header's date line
 *   header-color          - colour token for the header
 *   hide-header / hide-title
 *   divided        - divider between the header and the controls
 *   landscape / landscape-header-width
 *   control-height / control-variant (docked | modal) / no-month-picker
 *   next-icon / prev-icon / mode-icon
 *   view-mode      - month | months | year
 *   month, year    - initial view date
 *   no-auto-navigation - do not follow the selected value
 *   first-day-of-week / first-day-of-year / show-adjacent-months
 *   hide-weekdays / show-week / weekdays / weeks-in-month
 *   events / event-color  - event dots (comma list, or JSON date → colour map)
 *   allowed-dates / allowed-months / allowed-years
 *   preview-value  - highlight a date (and the range up to it)
 *   transition / reverse-transition - motion when paging forward / backward
 *   hide-actions   - defaults to true; `hide-actions="false"` shows the buttons
 *   cancel-text / ok-text  - action button labels
 *   picker-props   - JSON object of extra attributes for <w-date-picker>
 *
 * Events:
 *   input  - fires while typing (detail: { value, name })
 *   change - fires when the value commits (detail: { value, name })
 */
import WIcons from '../icons.js';
import {
  wIsoDate,
  wParseIsoDate,
  wFormatDate,
  wParseDateList,
  wDateInRange,
  wDateBetween,
  wIsSameDate,
  wValueList,
  wNumberList,
  wBoolAttr,
} from './utils.js';

const CALENDAR_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">'
  + '<path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/>'
  + '</svg>';
const CLEAR_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">'
  + '<path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>'
  + '</svg>';

// Vuetify's view-mode vocabulary mapped onto <w-date-picker>'s `view`.
const VIEW_MODES = { month: 'date', months: 'months', year: 'years' };
// Display thresholds; a viewport narrower than the value counts as mobile.
const BREAKPOINTS = { xs: 0, sm: 600, md: 960, lg: 1264, xl: 1904, xxl: 2560 };

export class WDateInput extends WElement {
  static attrs = [
    'value', 'label', 'placeholder', 'hint', 'error', 'size',
    'disabled', 'readonly', 'name', 'min', 'max', 'format', 'mode', 'clearable',
    'first-day-of-week', 'show-adjacent-months',
    // Field surface
    'flat', 'type', 'reverse', 'autocomplete', 'multiple', 'prefix', 'suffix',
    'autofocus', 'variant', 'counter', 'persistent-placeholder',
    'persistent-counter', 'persistent-hint', 'persistent-clear', 'center-affix',
    'glow', 'icon-color', 'prepend-icon', 'append-icon', 'prepend-inner-icon',
    'append-inner-icon', 'clear-icon', 'hide-spin-buttons', 'indent-details',
    'single-line', 'active', 'dirty', 'mobile', 'mobile-breakpoint',
    // Messages and validation
    'messages', 'error-messages', 'max-errors', 'validate-on',
    'validation-value', 'hide-details',
    // Value formatting / commit
    'display-format', 'input-format', 'update-on',
    // Popup and picker
    'menu', 'title', 'text', 'header', 'header-color', 'header-date-format',
    'hide-header', 'hide-title', 'divided', 'landscape',
    'landscape-header-width', 'control-height', 'control-variant',
    'no-month-picker', 'next-icon', 'prev-icon', 'mode-icon', 'view-mode',
    'month', 'year', 'no-auto-navigation', 'hide-weekdays', 'show-week',
    'weekdays', 'weeks-in-month', 'first-day-of-year', 'allowed-dates',
    'allowed-months', 'allowed-years', 'preview-value', 'events', 'event-color',
    'transition', 'reverse-transition', 'cancel-text', 'ok-text',
    'hide-actions', 'picker-props',
  ];

  // Picker-side props. Each one is forwarded verbatim to <w-date-picker> when
  // that element observes it, so the picker stays the single implementation;
  // anything it does not observe is applied here instead (see _decorate).
  static pickerAttrs = [
    'title', 'text', 'header', 'header-color', 'header-date-format', 'hide-title',
    'divided', 'landscape', 'landscape-header-width', 'control-height',
    'control-variant', 'no-month-picker', 'next-icon', 'prev-icon', 'mode-icon',
    'view-mode', 'month', 'year', 'no-auto-navigation', 'hide-weekdays',
    'show-week', 'weekdays', 'weeks-in-month', 'first-day-of-year',
    'allowed-dates', 'allowed-months', 'allowed-years', 'preview-value',
    'events', 'event-color', 'transition', 'reverse-transition',
  ];

  constructor() {
    super();
    this._popupUid = Math.random().toString(36).slice(2, 9);
    this._outsideClick = null;
    this._ruleErrors = [];
    this._pending = null;
  }

  /* ── Value ─────────────────────────────────────────────────────────────── */

  get value() { return this._attr('value', ''); }
  set value(v) {
    this._silentSet('value', v);
    this._syncField(this.value);
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
  get type() { return this._attr('type', 'text'); }
  get variant() { return this._attr('variant', ''); }
  get prefix() { return this._attr('prefix', ''); }
  get suffix() { return this._attr('suffix', ''); }
  get clearable() { return this._bool('clearable'); }

  // `display-format` is Vuetify's name for the same pattern; `format` wins.
  get format() { return this._attr('format', '') || this._attr('display-format', ''); }

  // `mode` is the DuVay name; Vuetify spells the same idea `multiple`.
  get mode() {
    const m = this._attr('mode', '');
    if (m === 'multiple' || m === 'range') return m;
    if (m) return 'single';
    return this._multipleMode();
  }

  _multipleMode() {
    if (!this.hasAttribute('multiple')) return 'single';
    const raw = this.getAttribute('multiple');
    if (raw === 'range') return 'range';
    if (raw === 'false') return 'single';
    return 'multiple';
  }

  // `multiple="3"` caps the selection at three dates.
  _multipleLimit() {
    const n = Number.parseInt(this._attr('multiple', ''), 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  get firstDayOfWeek() {
    const n = parseInt(this._attr('first-day-of-week', '0'), 10);
    return Number.isNaN(n) ? 0 : ((n % 7) + 7) % 7;
  }

  get firstDayOfYear() {
    const n = parseInt(this._attr('first-day-of-year', '0'), 10);
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

    if (mode === 'single') return this._parseSingle(text);
    if (mode === 'multiple') return this._parseMultiple(text);
    return this._parseRange(text);
  }

  // `input-format` first, then ISO, then a few common locale formats.
  _parseDate(text) {
    const masked = this._parseWithMask(text);
    if (masked) return masked;
    const iso = wParseIsoDate(text);
    if (iso) return iso;
    const loose = new Date(text);
    return Number.isNaN(loose.getTime()) ? null : loose;
  }

  // Build a regexp from the yyyy / mm / dd pattern in `input-format`.
  _parseWithMask(text) {
    const pattern = this._attr('input-format', '');
    if (!pattern) return null;
    const order = [];
    const source = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/yyyy|mm|dd/g, (token) => {
        order.push(token);
        return token === 'yyyy' ? '(\\d{4})' : '(\\d{1,2})';
      });
    const match = String(text).trim().match(new RegExp('^' + source + '$'));
    return match ? this._maskDate(order, match) : null;
  }

  _maskDate(order, match) {
    const parts = {};
    order.forEach((token, index) => { parts[token] = match[index + 1]; });
    const year = String(parts.yyyy || '').padStart(4, '0');
    const month = String(parts.mm || '').padStart(2, '0');
    const day = String(parts.dd || '').padStart(2, '0');
    return wParseIsoDate(`${year}-${month}-${day}`);
  }

  _parseSingle(text) {
    const d = this._parseDate(text.trim());
    return d ? wIsoDate(d) : this.value;
  }

  _parseMultiple(text) {
    const items = text.split(/,|;/).map((s) => s.trim()).filter(Boolean);
    const dates = [];
    for (const item of items) {
      const d = this._parseDate(item);
      if (d) dates.push(d);
    }
    return dates.map(wIsoDate).join(',');
  }

  _parseRange(text) {
    const parts = text.split(/[–\-–,]/).map((s) => s.trim()).filter(Boolean);
    if (parts.length < 2) return this.value;
    const start = this._parseDate(parts[0]);
    const end = this._parseDate(parts[1]);
    if (start && end) return `${wIsoDate(start)},${wIsoDate(end)}`;
    return this.value;
  }

  _selectedDates(value = this.value) {
    const mode = this.mode;
    if (mode === 'single') {
      const d = wParseIsoDate(value);
      return d ? [d] : [];
    }
    if (mode === 'multiple') {
      return wParseDateList(value);
    }
    // range
    const parts = value.split(',').map((s) => s.trim()).filter(Boolean);
    const start = wParseIsoDate(parts[0] || '');
    const end = wParseIsoDate(parts[1] || '');
    return start && end ? [start, end] : start ? [start] : [];
  }

  /* ── Open state ────────────────────────────────────────────────────────── */

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
    const view = this._viewDate();
    if (view.month) picker.setAttribute('month', view.month);
    if (view.year) picker.setAttribute('year', view.year);
    picker.setAttribute('value', this.value);
    picker.setAttribute('mode', this.mode);
    this._syncPickerBounds(picker);
  }

  _syncPickerBounds(picker) {
    picker.setAttribute('min', this.min);
    picker.setAttribute('max', this.max);
    if (this.firstDayOfWeek) picker.setAttribute('first-day-of-week', this.firstDayOfWeek);
    else picker.removeAttribute('first-day-of-week');
    if (this.showAdjacentMonths) picker.setAttribute('show-adjacent-months', '');
    else picker.removeAttribute('show-adjacent-months');
  }

  /* ── Template ──────────────────────────────────────────────────────────── */

  _template() {
    return `<div class="${this._rootClasses()}"${this._rootStyle()}>
      ${this._labelMarkup()}
      <div class="w-date-input-wrap">
        ${this._outerIcon('prepend')}
        <div class="w-date-input-control">
          ${this._toggleMarkup()}
          ${this._affixMarkup('prefix')}
          ${this._innerIcon('prepend')}
          ${this._fieldMarkup()}
          ${this._innerIcon('append')}
          ${this._affixMarkup('suffix')}
          ${this._clearMarkup()}
        </div>
        ${this._outerIcon('append')}
      </div>
      ${this._detailsMarkup()}
      ${this._popupMarkup()}
    </div>`;
  }

  _rootClasses() {
    return 'w-field w-date-input' + this._cls({
      'w-field-error': this._hasError(),
      'w-date-input--clearable': this.clearable,
      [`w-date-input--${this.variant}`]: this.variant,
      'w-date-input--flat': this._bool('flat'),
      'w-date-input--reverse': this._bool('reverse'),
      'w-date-input--active': this._bool('active'),
      'w-date-input--dirty': this._bool('dirty') || Boolean(this.value),
      'w-date-input--single-line': this._bool('single-line'),
      'w-date-input--center-affix': this._bool('center-affix'),
      'w-date-input--glow': this._bool('glow'),
      'w-date-input--indent-details': this._bool('indent-details'),
      'w-date-input--persistent-hint': this._bool('persistent-hint'),
      'w-date-input--persistent-placeholder': this._bool('persistent-placeholder'),
      'w-date-input--persistent-counter': this._bool('persistent-counter'),
      'w-date-input--persistent-clear': this._bool('persistent-clear'),
      'w-date-input--hide-spin-buttons': this._bool('hide-spin-buttons'),
      'w-date-input--mobile': this._isMobile(),
    });
  }

  _rootStyle() {
    const declarations = [
      ['--w-di-icon-color', this._colorValue(this._attr('icon-color', ''))],
      ['--w-di-header-color', this._colorValue(this._attr('header-color', ''))],
      ['--w-di-control-height', this._lengthValue(this._attr('control-height', ''))],
      ['--w-di-header-width', this._lengthValue(this._attr('landscape-header-width', ''))],
    ].filter((pair) => pair[1]).map((pair) => `${pair[0]}:${pair[1]}`).join(';');
    return declarations ? ` style="${this._esc(declarations)}"` : '';
  }

  // Bare token names resolve through the palette; anything else is passed
  // through so `#0f0` / `rgb(...)` keep working.
  _colorValue(value) {
    if (!value || value === 'false') return '';
    return /^[a-z][a-z0-9-]*$/.test(value) ? `var(--w-${value}, ${value})` : value;
  }

  _lengthValue(value) {
    if (!value) return '';
    return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
  }

  _labelMarkup() {
    if (!this.label) return '';
    return `<label class="w-field-label">${this._esc(this.label)}</label>`;
  }

  _toggleMarkup() {
    const attrs = this._attrs({ disabled: this.disabled || this.readonly });
    return `<button class="w-date-input-icon" type="button" aria-label="Open calendar"`
      + ` aria-haspopup="dialog" aria-expanded="false" aria-controls="${this._popupId()}"${attrs}>`
      + `${CALENDAR_SVG}</button>`;
  }

  _affixMarkup(kind) {
    const text = this._attr(kind, '');
    if (!text) return '';
    return `<span class="w-date-input-affix w-date-input-${kind}" aria-hidden="true">${this._esc(text)}</span>`;
  }

  _outerIcon(side) {
    return this._iconSlot(this._attr(`${side}-icon`, ''), `w-date-input-${side}`);
  }

  _innerIcon(side) {
    return this._iconSlot(this._attr(`${side}-inner-icon`, ''), `w-date-input-${side}-inner`);
  }

  _iconSlot(name, className) {
    if (!name) return '';
    return `<span class="${className}" aria-hidden="true">${this._iconHtml(name)}</span>`;
  }

  _iconHtml(name) {
    if (!name) return '';
    return WIcons.resolve(name, { iconClass: 'w-icon w-date-input-glyph' });
  }

  _fieldMarkup() {
    const sizeClass = this._cls({ [`w-input--${this.size}`]: this.size });
    const attrs = this._attrs({
      placeholder: this.placeholder,
      value: this.value && this._displayValue(this.value),
      disabled: this.disabled,
      readonly: this._readonlyInput(),
      autofocus: this._bool('autofocus'),
      name: this._fieldName(),
      autocomplete: this._autocompleteValue(),
      'aria-invalid': this._hasError() && 'true',
      'aria-describedby': this._hideDetails() ? '' : this._detailsId(),
    });
    return `<input class="w-input w-date-input-field${sizeClass}" type="${this._esc(this.type)}"${attrs}>`;
  }

  // An `update-on` list with no entries means the text is display-only.
  _readonlyInput() {
    return this.readonly || (this._updateOn() || ['x']).length === 0;
  }

  _updateOn() {
    if (!this.hasAttribute('update-on')) return null;
    return wValueList(this.getAttribute('update-on')).map((item) => item.toLowerCase());
  }

  // Vuetify's `autocomplete="suppress"` also perturbs the field name so that
  // browsers cannot key their suggestion history off it.
  _fieldName() {
    if (this._attr('autocomplete', '') === 'suppress') return `w-di-${this._popupUid}`;
    return this.name;
  }

  _autocompleteValue() {
    const value = this._attr('autocomplete', '');
    if (!value) return '';
    return value === 'suppress' ? 'off' : value;
  }

  _clearMarkup() {
    const canClear = this.clearable && Boolean(this.value) && !this.disabled && !this.readonly;
    if (!canClear) return '';
    const custom = this._attr('clear-icon', '');
    return `<button class="w-date-input-clear" type="button" aria-label="Clear date">`
      + `${custom ? this._iconHtml(custom) : CLEAR_SVG}</button>`;
  }

  /* ── Details, messages, counter ────────────────────────────────────────── */

  _detailsId() { return `w-date-input-details-${this._popupUid}`; }

  _detailsMarkup() {
    if (this._hideDetails()) return '';
    return `<div class="w-date-input-details" id="${this._detailsId()}" role="status">${this._detailsInner()}</div>`;
  }

  _detailsInner() {
    const messages = this._messageList()
      .map((message) => `<span class="w-field-hint">${this._esc(message)}</span>`)
      .join('');
    return messages + this._counterMarkup();
  }

  // `hide-details="auto"` keeps the container; CSS collapses it when empty.
  _hideDetails() {
    const raw = this.getAttribute('hide-details');
    return raw !== null && raw !== 'auto' && raw !== 'false';
  }

  // Errors replace the hint, except under `persistent-hint`, which keeps the
  // hint rendered after them.
  _messageList() {
    const hints = this.hint ? [this.hint] : [];
    const errors = this._errorList();
    if (!errors.length) return hints.concat(wValueList(this._attr('messages', '')));
    const shown = errors.slice(0, this._maxErrors());
    return this._bool('persistent-hint') ? shown.concat(hints) : shown;
  }

  _errorList() {
    const explicit = this.error ? [this.error] : [];
    return explicit
      .concat(wValueList(this._attr('error-messages', '')))
      .concat(this._ruleErrors);
  }

  _maxErrors() {
    const n = Number.parseInt(this._attr('max-errors', ''), 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }

  _hasError() { return this._errorList().length > 0; }

  _counterMarkup() {
    const raw = this.getAttribute('counter');
    if (raw === null || raw === 'false') return '';
    const parsed = Number.parseInt(raw, 10);
    const limit = Number.isFinite(parsed) ? parsed : 25;
    return `<span class="w-date-input-counter">${this._fieldText().length} / ${limit}</span>`;
  }

  _fieldText() {
    const input = this._q('.w-date-input-field');
    return input ? input.value : this._displayValue(this.value);
  }

  /* ── Validation ────────────────────────────────────────────────────────── */

  _validationText() {
    const override = this.getAttribute('validation-value');
    return override === null ? this._fieldText() : override;
  }

  _runRules() {
    const text = String(this._validationText()).trim();
    if (!text || this.mode !== 'single') return [];
    const date = this._parseDate(text);
    if (!date) return ['Enter a valid date'];
    if (!wDateInRange(date, wParseIsoDate(this.min), wParseIsoDate(this.max))) return ['Date is out of range'];
    if (!this._isAllowedDate(date)) return ['Date is not available'];
    return [];
  }

  _isAllowedDate(date) {
    return this._dateAllowed(wIsoDate(date), this._allowedSets());
  }

  _shouldValidate(trigger) {
    const tokens = this._attr('validate-on', 'input').split(/\s+/).filter(Boolean);
    if (trigger === 'mount') return tokens.includes('eager');
    if (trigger === 'submit') return true;
    if (tokens.includes('lazy') && !this._touched) return false;
    return tokens.includes(trigger) || tokens.includes('invalid-input');
  }

  _validate(trigger) {
    if (!this._shouldValidate(trigger)) return;
    this._ruleErrors = this._runRules();
  }

  // Public: force validation regardless of `validate-on`. Returns validity.
  validate() {
    this._touched = true;
    this._ruleErrors = this._runRules();
    this._syncMessages();
    return this._ruleErrors.length === 0;
  }

  _syncMessages() {
    const root = this._q('.w-date-input');
    if (root) root.classList.toggle('w-field-error', this._hasError());
    const details = this._q('.w-date-input-details');
    if (details) details.innerHTML = this._detailsInner();
    const input = this._q('.w-date-input-field');
    if (input) input.setAttribute('aria-invalid', String(this._hasError()));
  }

  /* ── Popup ─────────────────────────────────────────────────────────────── */

  _popupMarkup() {
    return `<div class="${this._popupClasses()}" id="${this._popupId()}" role="dialog" aria-label="Choose date" hidden>
      ${this._headerMarkup()}
      <w-date-picker${this._pickerAttrs()}></w-date-picker>
      ${this._actionsMarkup()}
    </div>`;
  }

  _popupClasses() {
    const variant = this._attr('control-variant', '');
    return 'w-date-input-popup' + this._cls({
      'w-date-input-popup--landscape': this._bool('landscape'),
      'w-date-input-popup--divided': this._bool('divided'),
      'w-date-input-popup--hide-weekdays': this._bool('hide-weekdays'),
      'w-date-input-popup--show-week': this._bool('show-week'),
      'w-date-input-popup--no-month-picker': this._bool('no-month-picker'),
      [`w-date-input-popup--${variant}`]: variant,
      'w-date-input-popup--mobile': this._isMobile(),
    });
  }

  _popupId() {
    return `w-date-input-popup-${this._popupUid}`;
  }

  _pickerAttrs() {
    const view = this._viewDate();
    return this._attrs({
      value: this.value,
      min: this.min,
      max: this.max,
      mode: this.mode,
      view: VIEW_MODES[this._attr('view-mode', '')] || '',
      year: view.year,
      month: view.month,
      'first-day-of-week': this.firstDayOfWeek || '',
      'show-adjacent-months': this.showAdjacentMonths,
      'hide-header': this._hidePickerHeader(),
    }) + this._forwardedAttrs() + this._pickerPropsAttrs();
  }

  // True when <w-date-picker> observes `name`, i.e. it owns that prop and this
  // component only has to hand it over.
  _pickerHandles(name) {
    if (!this._pickerAttrSet) {
      const ctor = customElements.get('w-date-picker');
      this._pickerAttrSet = new Set(ctor ? ctor.observedAttributes : []);
    }
    return this._pickerAttrSet.has(name);
  }

  _forwardedAttrs() {
    const map = {};
    WDateInput.pickerAttrs.forEach((name) => {
      if (!this.hasAttribute(name) || !this._pickerHandles(name)) return;
      map[name] = this.getAttribute(name) || true;
    });
    return this._attrs(map);
  }

  // The popup header is this component's own unless the picker implements it.
  _ownsHeader() { return !this._pickerHandles('header'); }

  _hidePickerHeader() {
    if (this._ownsHeader() || this._bool('hide-header')) return true;
    return !this._attr('title', '') && !this._attr('text', '') && !this._attr('header', '');
  }

  // `no-auto-navigation` keeps the view on the authored month / year instead of
  // following the selection.
  _viewDate() {
    const first = this._selectedDates()[0];
    if (first && !this._bool('no-auto-navigation')) {
      return { year: first.getFullYear(), month: first.getMonth() + 1 };
    }
    return { year: this._attr('year', ''), month: this._attr('month', '') };
  }

  _pickerPropsAttrs() {
    const raw = this._attr('picker-props', '').trim();
    if (!raw) return '';
    try {
      const props = JSON.parse(raw);
      return props && typeof props === 'object' ? this._attrs(props) : '';
    } catch {
      return '';
    }
  }

  _headerMarkup() {
    if (!this._ownsHeader() || this._bool('hide-header')) return '';
    const title = this._bool('hide-title') ? '' : this._attr('title', '');
    const text = this._attr('text', '');
    const header = this._attr('header', '');
    if (!title && !text && !header) return '';
    return `<div class="w-date-input-header">
        ${this._headerLine('title', title)}
        ${this._headerLine('text', text)}
        <div class="w-date-input-header-date">${this._esc(this._headerDate(header))}</div>
      </div>`;
  }

  _headerLine(kind, value) {
    if (!value) return '';
    return `<div class="w-date-input-${kind}">${this._esc(value)}</div>`;
  }

  _headerDate(fallback, value = this.value) {
    const dates = this._selectedDates(value);
    if (!dates.length) return fallback;
    const fmt = this._attr('header-date-format', '') || this.format;
    return dates.map((date) => wFormatDate(date, fmt)).join(' – ');
  }

  // Actions default to hidden so a pick commits straight away; opt in with
  // `hide-actions="false"` for the confirm-then-commit flow.
  _hideActions() { return wBoolAttr(this, 'hide-actions', true); }

  _actionsMarkup() {
    if (this._hideActions()) return '';
    return `<div class="w-date-input-actions">
        <button class="w-btn w-btn-text w-date-input-cancel" type="button">${this._esc(this._attr('cancel-text', 'Cancel'))}</button>
        <button class="w-btn w-btn-text w-date-input-ok" type="button">${this._esc(this._attr('ok-text', 'OK'))}</button>
      </div>`;
  }

  /* ── Responsive ────────────────────────────────────────────────────────── */

  _isMobile() {
    if (this._bool('mobile')) return true;
    return Boolean(this._mobileMatch && this._mobileMatch.matches);
  }

  _setupMobile() {
    if (this._mobileMatch !== undefined) return;
    this._mobileMatch = null;
    const raw = this._attr('mobile-breakpoint', '');
    if (!raw || typeof window.matchMedia !== 'function') return;
    const px = BREAKPOINTS[raw] ?? Number(raw);
    if (!Number.isFinite(px)) return;
    this._mobileMatch = window.matchMedia(`(max-width: ${px - 0.02}px)`);
    this._mobileListener = () => this._syncMobile();
    this._mobileMatch.addEventListener('change', this._mobileListener);
  }

  _syncMobile() {
    const mobile = this._isMobile();
    const root = this._q('.w-date-input');
    if (root) root.classList.toggle('w-date-input--mobile', mobile);
    const popup = this._q('.w-date-input-popup');
    if (popup) popup.classList.toggle('w-date-input-popup--mobile', mobile);
  }

  /* ── Picker decoration ─────────────────────────────────────────────────── */

  _observePicker(picker) {
    if (this._pickerObserver) this._pickerObserver.disconnect();
    this._pickerObserver = new MutationObserver(() => this._decorate());
    this._pickerObserver.observe(picker, { childList: true, subtree: true });
  }

  _decorate() {
    const picker = this._q('.w-date-input-popup w-date-picker');
    if (!picker || this._decorating) return;
    this._decorating = true;
    if (this._pickerObserver) this._pickerObserver.disconnect();
    try {
      this._decorateAllowed(picker);
      this._decorateEvents(picker);
      this._decoratePreview(picker);
      this._applyTransition(picker);
    } finally {
      this._decorating = false;
      this._observePicker(picker);
    }
  }

  _allowedSets() {
    return {
      dates: wValueList(this._attr('allowed-dates', '')),
      months: wNumberList(this._attr('allowed-months', ''), []),
      years: wNumberList(this._attr('allowed-years', ''), []),
    };
  }

  _decorateAllowed(picker) {
    const sets = this._allowedSets();
    if (!sets.dates.length && !sets.months.length && !sets.years.length) return;
    picker.querySelectorAll('[data-date]').forEach((el) => {
      this._blockCell(el, this._dateAllowed(el.getAttribute('data-date'), sets));
    });
    picker.querySelectorAll('[data-month]').forEach((el) => {
      this._blockCell(el, !sets.months.length || sets.months.includes(Number(el.getAttribute('data-month'))));
    });
    picker.querySelectorAll('[data-year]').forEach((el) => {
      this._blockCell(el, !sets.years.length || sets.years.includes(Number(el.getAttribute('data-year'))));
    });
  }

  // Months are 1-based here, matching DuVay's own `month` attribute.
  _dateAllowed(iso, sets) {
    const date = wParseIsoDate(iso);
    if (!date) return true;
    if (sets.dates.length && !sets.dates.includes(iso)) return false;
    if (sets.months.length && !sets.months.includes(date.getMonth() + 1)) return false;
    if (sets.years.length && !sets.years.includes(date.getFullYear())) return false;
    return true;
  }

  _blockCell(el, allowed) {
    if (allowed) return;
    el.disabled = true;
    el.classList.add('disabled');
  }

  _eventMap() {
    const raw = this._attr('events', '').trim();
    if (!raw) return null;
    if (raw.startsWith('{')) return this._parseEventObject(raw);
    const map = {};
    wValueList(raw).forEach((iso) => { map[iso] = true; });
    return map;
  }

  _parseEventObject(raw) {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  }

  _decorateEvents(picker) {
    const map = this._eventMap();
    if (!map) return;
    picker.querySelectorAll('[data-date]').forEach((el) => {
      const entry = map[el.getAttribute('data-date')];
      if (entry === undefined || entry === false) return;
      el.insertAdjacentHTML('beforeend', this._dotsHtml(entry));
    });
  }

  _dotsHtml(entry) {
    const fallback = this._attr('event-color', '') || 'primary';
    const list = Array.isArray(entry) ? entry : [entry];
    const dots = list
      .map((color) => this._colorValue(String(color === true ? fallback : color)) || 'currentColor')
      .map((color) => `<i class="w-date-input-event" style="background:${this._esc(color)}"></i>`)
      .join('');
    return `<span class="w-date-input-events" aria-hidden="true">${dots}</span>`;
  }

  _decoratePreview(picker) {
    const preview = wParseIsoDate(this._attr('preview-value', ''));
    if (!preview) return;
    const start = this._selectedDates()[0];
    const ranged = Boolean(start) && this.mode === 'range';
    picker.querySelectorAll('[data-date]').forEach((el) => {
      const date = wParseIsoDate(el.getAttribute('data-date'));
      if (!date) return;
      el.classList.toggle('w-date-input-preview', wIsSameDate(date, preview));
      el.classList.toggle('w-date-input-preview-range', ranged && wDateBetween(date, start, preview));
    });
  }

  _viewIndex(picker) {
    return Number(picker.getAttribute('year') || 0) * 12 + Number(picker.getAttribute('month') || 0);
  }

  // Paging forward uses `transition`, paging backward `reverse-transition`.
  _applyTransition(picker) {
    const index = this._viewIndex(picker);
    const previous = this._viewIdx;
    this._viewIdx = index;
    if (previous === undefined || previous === index) return;
    const name = index > previous ? this._attr('transition', '') : this._attr('reverse-transition', '');
    if (!name) return;
    const popup = this._q('.w-date-input-popup');
    if (popup) popup.dataset.transition = name;
    const grid = picker.querySelector('.w-date-picker-grid');
    if (grid && window.WMotion) window.WMotion.enter(grid, name);
  }

  /* ── Events ────────────────────────────────────────────────────────────── */

  _events() {
    this._bindToggle();
    this._bindInput();
    this._bindClear();
    this._bindPicker();
    this._bindActions();
    this._bindOutside();
    this._setupMobile();
    this._syncMobile();
    this._restoreOpen();
    this._validate('mount');
    this._syncMessages();
  }

  _restoreOpen() {
    if (this._bool('menu') && this._menuApplied === undefined) {
      this._menuApplied = true;
      this.classList.add('w-date-input--open');
    }
    this._setOpen(this._isOpen());
  }

  _bindToggle() {
    const icon = this._q('.w-date-input-icon');
    if (!icon) return;
    icon.addEventListener('click', (event) => {
      event.preventDefault();
      if (this.disabled || this.readonly) return;
      this._setOpen(!this._isOpen());
      if (this._isOpen()) this.focus();
    });
  }

  _bindInput() {
    const input = this._q('.w-date-input-field');
    if (!input) return;
    input.addEventListener('input', (event) => this._onInput(event, input));
    input.addEventListener('blur', () => this._onBlur(input));
    input.addEventListener('keydown', (event) => this._onKeydown(event, input));
    if (this._updateOn()) return;
    input.addEventListener('change', (event) => {
      event.stopPropagation();
      this._commit(this._parseInput(input.value));
    });
  }

  _onInput(event, input) {
    event.stopPropagation();
    this._touched = true;
    this._validate('input');
    this._syncMessages();
    this._emit('input', { value: input.value, name: this.name });
  }

  _onBlur(input) {
    this._touched = true;
    this._validate('blur');
    this._syncMessages();
    const list = this._updateOn();
    if (list && list.includes('blur')) this._commit(this._parseInput(input.value));
  }

  _onKeydown(event, input) {
    if (event.key === 'Escape' && this._isOpen()) {
      event.preventDefault();
      this._setOpen(false);
      return;
    }
    if (event.key !== 'Enter') return;
    const list = this._updateOn();
    if (!list || !list.includes('enter')) return;
    event.preventDefault();
    this._commit(this._parseInput(input.value));
  }

  _bindClear() {
    const clear = this._q('.w-date-input-clear');
    if (!clear) return;
    clear.addEventListener('click', (event) => {
      event.preventDefault();
      if (this.disabled) return;
      this._commit('');
      this.focus();
    });
  }

  _bindPicker() {
    const picker = this._q('.w-date-input-popup w-date-picker');
    if (!picker) return;
    this._viewIdx = undefined;
    picker.addEventListener('change', (event) => this._onPickerChange(event));
    this._observePicker(picker);
    this._decorate();
  }

  _onPickerChange(event) {
    event.stopImmediatePropagation();
    const next = event.detail && event.detail.value;
    if (next === undefined) return; // month / year navigation, not a selection
    if (!this._hideActions()) {
      this._pending = next;
      this._syncHeader(next);
      return;
    }
    this._commit(next);
    if (this.mode === 'single') this._setOpen(false);
  }

  _bindActions() {
    const cancel = this._q('.w-date-input-cancel');
    const ok = this._q('.w-date-input-ok');
    if (cancel) cancel.addEventListener('click', () => this._closeActions(false));
    if (ok) ok.addEventListener('click', () => this._closeActions(true));
  }

  _closeActions(commit) {
    if (commit && this._pending !== null) this._commit(this._pending);
    this._pending = null;
    this._setOpen(false);
    this.focus();
  }

  _bindOutside() {
    if (this._outsideClick) {
      document.removeEventListener('click', this._outsideClick);
    }
    this._outsideClick = (event) => {
      if (!this._isOpen()) return;
      if (event.composedPath().includes(this)) return;
      this._setOpen(false);
    };
    document.addEventListener('click', this._outsideClick);
  }

  /* ── Commit ────────────────────────────────────────────────────────────── */

  _commit(nextValue) {
    const value = this._clampValue(nextValue);
    const changed = value !== this.value;
    this._silentSet('value', value);
    this._syncField(value);
    if (this._isOpen()) this._refreshPicker();
    if (changed) this._emit('change', { value, name: this.name });
  }

  _clampValue(next) {
    if (this.mode === 'multiple') return this._limitMultiple(next);
    if (this.mode !== 'single') return next;
    const date = wParseIsoDate(next);
    const rejected = date && !wDateInRange(date, wParseIsoDate(this.min), wParseIsoDate(this.max));
    return rejected ? this.value : next;
  }

  _limitMultiple(next) {
    const limit = this._multipleLimit();
    if (!limit) return next;
    const items = wValueList(next);
    return items.slice(Math.max(0, items.length - limit)).join(',');
  }

  _syncField(value) {
    const input = this._q('.w-date-input-field');
    if (input) input.value = this._displayValue(value);
    const clear = this._q('.w-date-input-clear');
    if (clear) clear.hidden = !value;
    this._syncHeader(value);
    if (this._ruleErrors.length) this._ruleErrors = this._runRules();
    this._syncMessages();
  }

  _syncHeader(value) {
    const header = this._q('.w-date-input-header-date');
    if (header) header.textContent = this._headerDate(this._attr('header', ''), value);
  }

  disconnectedCallback() {
    if (this._outsideClick) document.removeEventListener('click', this._outsideClick);
    if (this._pickerObserver) this._pickerObserver.disconnect();
    if (this._mobileMatch && this._mobileListener) {
      this._mobileMatch.removeEventListener('change', this._mobileListener);
    }
  }

  focus() {
    const input = this._q('.w-date-input-field');
    if (input) input.focus();
  }
}

if (!customElements.get('w-date-input')) customElements.define('w-date-input', WDateInput);
