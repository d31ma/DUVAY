/* <w-file-input> — DuVay component module
 *
 * Attributes:
 *   label            - button / field label (default: "Choose file")
 *   accept           - comma-separated accepted MIME types/extensions
 *   multiple         - allow multiple file selection
 *   disabled         - disable the input
 *   readonly         - make the input read-only
 *   chips            - display selected files as chips
 *   small-chips      - display smaller chips
 *   counter          - show file count and total size
 *   counter-string   - counter template; {0} is the file count
 *   counter-size-string - counter template used with show-size; {1} is the total size
 *   show-size        - show each file's size next to its name
 *   clearable        - show a clear-all button
 *   clear-icon       - icon for the clear button
 *   persistent-clear - keep the clear button visible (it only shows on hover otherwise)
 *   placeholder      - placeholder text when no files are selected
 *   hint             - helper text below the field
 *   persistent-hint  - keep the hint visible alongside an error
 *   error            - error text; also adds error styling
 *   error-messages   - error messages (string or JSON array); sets the error state
 *   max-errors       - how many error messages to show (default 1)
 *   messages         - extra messages (string or JSON array)
 *   validate-on      - `lazy` withholds errors until the field is used; a `blur`
 *                      token makes blur (not selection) the trigger
 *   hide-details     - suppress the details row (`auto` == the default)
 *   indent-details   - inset the details row
 *   truncate-length  - max characters for a file name (default 22)
 *   density          - compact | comfortable | default
 *   variant          - outlined | filled | underlined | plain | solo |
 *                      solo-filled | solo-inverted
 *   flat             - drop the elevation of the solo variants
 *   reverse          - reverse the control's horizontal order
 *   active           - render the highlighted/active state
 *   dirty            - force the dirty (has-value) styling
 *   single-line      - no label row; the label becomes the placeholder
 *   center-affix     - vertically center the affixes / icons
 *   glow             - light the icons up while the field is focused
 *   icon-color       - color for the affix icons
 *   hide-spin-buttons - shared field-surface flag (numeric fields)
 *   hide-input       - icons only; the selected file names are not shown
 *   prepend-icon, append-icon             - icons outside the control
 *   prepend-inner-icon, append-inner-icon - icons inside the control
 *   clear-icon       - icon used for the clear button
 *   icon-set         - icon set prefix for every *-icon attribute
 *   filter-by-type   - only accept files matching these type specifiers
 *   validation-value - serializable value used instead of the FileList for
 *                      required validation and dirty state
 *   required         - require a file or a non-empty validation-value
 *   name             - form field name
 *
 * Events:
 *   change          - fires when files change (detail: { files, value })
 *   input           - fires on every file selection (detail: { files, value })
 *   rejected        - files turned away by `filter-by-type` (detail: { files })
 */
import { wValueList } from './utils.js';
import WIcons from '../icons.js';

const SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

export function formatSize(bytes) {
  if (bytes == null || bytes === 0) return '0 B';
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), SIZE_UNITS.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${SIZE_UNITS[i]}`;
}

export function truncateName(name, len = 22) {
  if (!len || name.length <= len) return name;
  const first = Math.floor((len - 1) / 2);
  const last = len - first - 1;
  return name.slice(0, first) + '…' + name.slice(name.length - last);
}

function toFileList(files) {
  try {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    return dt.files;
  } catch (e) {
    return null;
  }
}

/* ── Shared Vuetify field surface ───────────────────────────────────────────
 * The file components expose the same VField/VInput prop surface as the other
 * DuVay fields. These helpers are host-agnostic — every modifier is written
 * against whichever element is the control root — so <w-file-upload> and the
 * dropzone import them from here rather than growing their own copies.
 * The `w-field--*` classes they emit ship with the shared field stylesheet.
 */

const FIELD_FLAGS = [
  'flat', 'reverse', 'center-affix', 'glow', 'single-line', 'active',
  'indent-details', 'hide-spin-buttons', 'persistent-clear',
];

const FIELD_VARIANTS = [
  'outlined', 'filled', 'underlined', 'plain', 'solo', 'solo-filled', 'solo-inverted',
];

// Modifier classes for the surface flags plus `variant`.
export function wFieldClasses(host) {
  const names = FIELD_FLAGS
    .filter((flag) => host.hasAttribute(flag))
    .map((flag) => 'w-field--' + flag);
  const variant = host.getAttribute('variant');
  if (variant && FIELD_VARIANTS.includes(variant)) names.push('w-field--variant-' + variant);
  return names;
}

// A token name resolves to its custom property (falling back to the literal),
// so `icon-color="primary"` and `icon-color="#c00"` both work. Characters that
// could break out of a style attribute are dropped.
export function wSafeColor(value) {
  const text = String(value == null ? '' : value).trim().replace(/[^\w#(),.%\s-]/g, '');
  if (!text) return '';
  return /^[a-z][\w-]*$/i.test(text) ? `var(--w-${text}, ${text})` : text;
}

// Resolve an icon attribute through the registry, honouring `icon-set`.
// A literal glyph works too — the default `text` set renders it as-is.
export function wIconHtml(host, attr, cls) {
  const name = host.getAttribute(attr);
  if (!name || name === 'false') return '';
  const set = host.getAttribute('icon-set');
  return WIcons.resolve(set ? `${set}:${name}` : name, { iconClass: 'w-icon ' + cls });
}

// `messages` / `error-messages` accept a single string or a JSON array.
export function wMessageList(value) {
  const text = String(value == null ? '' : value).trim();
  if (!text) return [];
  return text.startsWith('[') ? wValueList(text) : [text];
}

// The host's own error text plus `error-messages`, capped by `max-errors` (1).
export function wErrorTexts(host, error = '') {
  const all = (error ? [error] : []).concat(wMessageList(host.getAttribute('error-messages')));
  const max = Number(host.getAttribute('max-errors'));
  return all.slice(0, Number.isFinite(max) && max > 0 ? max : 1);
}

// Vuetify's `validation-value` lets a wrapper validate a serializable stand-in
// for an opaque FileList. JSON arrays use their length; null/false/empty values
// are empty; all other values count as present.
export function wFileValidationHasValue(host, files = []) {
  if (!host.hasAttribute('validation-value')) return files.length > 0;
  const raw = String(host.getAttribute('validation-value') ?? '').trim();
  if (!raw) return false;
  try {
    const value = JSON.parse(raw);
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== false && value !== '';
  } catch (_) {
    return true;
  }
}

export function wFileRequiredError(host, files = []) {
  return host.hasAttribute('required') && !wFileValidationHasValue(host, files)
    ? 'Please select a file.'
    : '';
}

export function wHideDetails(host) {
  return host.hasAttribute('hide-details') && host.getAttribute('hide-details') !== 'auto';
}

// `validate-on` carries a lazy/eager distinction: `lazy` withholds the error
// state until the user has interacted with the field.
export function wSuppressErrors(host, touched) {
  const mode = host.getAttribute('validate-on') || '';
  return mode.includes('lazy') && !touched;
}

// Everything in the details row after the primary message: the remaining error
// messages, `messages`, and a hint kept alongside an error by `persistent-hint`.
export function wFieldExtras(host, errors = [], hint = '') {
  const rows = errors.slice(1).map((text) => ({ text, error: true }))
    .concat(wMessageList(host.getAttribute('messages')).map((text) => ({ text, error: false })));
  if (errors.length && hint && host.hasAttribute('persistent-hint')) rows.push({ text: hint, error: false });
  return rows.map((row) => {
    const cls = row.error ? ' w-field-message--error' : '';
    return `<span class="w-field-message${cls}">${host._esc(row.text)}</span>`;
  }).join('');
}

/* ── File plumbing shared by the file components ─────────────────────────── */

// A file matches a `filter-by-type` token when the token is its extension
// (".png"), a wildcard family ("image/*"), or its exact MIME type.
export function wFileMatchesType(file, token) {
  const type = String(file.type || '').toLowerCase();
  const name = String(file.name || '').toLowerCase();
  if (token.startsWith('.')) return name.endsWith(token);
  if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
  return type === token;
}

// Split a selection into the files `filter-by-type` lets through and the rest.
export function wFilterByType(host, files) {
  const tokens = wValueList(host.getAttribute('filter-by-type') || '')
    .map((token) => token.toLowerCase());
  if (!tokens.length) return { accepted: files, rejected: [] };
  const accepted = files.filter((file) => tokens.some((token) => wFileMatchesType(file, token)));
  return { accepted, rejected: files.filter((file) => !accepted.includes(file)) };
}

// The serialisable shape every file event carries.
export function wFileDetail(file) {
  return { name: file.name, size: file.size, type: file.type };
}

// `length` / `thickness` style values default to pixels, as they do in Vuetify.
export function wCssLength(value) {
  const text = String(value == null ? '' : value).trim();
  if (!text) return '';
  if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(text)) return `${text}px`;
  return /^-?(?:\d+\.?\d*|\.\d+)(?:%|ch|cm|dvh|dvw|em|ex|in|lh|lvh|lvw|mm|pc|pt|px|rem|rlh|svh|svw|vh|vmax|vmin|vw)$/i.test(text)
    ? text
    : '';
}

export class WFileInput extends WElement {
  static attrs = [
    'label', 'accept', 'multiple', 'disabled', 'readonly',
    'chips', 'small-chips', 'counter', 'show-size', 'clearable',
    'placeholder', 'hint', 'error', 'truncate-length', 'density', 'name',
    // Vuetify field surface
    'variant', 'flat', 'reverse', 'active', 'dirty', 'single-line',
    'center-affix', 'glow', 'icon-color', 'hide-spin-buttons', 'indent-details',
    'persistent-hint', 'persistent-clear', 'hide-details', 'hide-input',
    'messages', 'error-messages', 'max-errors', 'validate-on',
    'prepend-icon', 'append-icon', 'prepend-inner-icon', 'append-inner-icon',
    'clear-icon', 'icon-set', 'counter-string', 'counter-size-string',
    'filter-by-type', 'validation-value', 'required',
  ];

  // Attributes that pull the input out of its bare <label> form and into the
  // full field shell.
  static fieldAttrs = [
    'variant', 'flat', 'reverse', 'active', 'dirty', 'single-line', 'center-affix',
    'glow', 'icon-color', 'hide-spin-buttons', 'indent-details', 'persistent-hint',
    'persistent-clear', 'hide-details', 'hide-input', 'messages', 'error-messages',
    'max-errors', 'validate-on', 'prepend-icon', 'append-icon', 'prepend-inner-icon',
    'append-inner-icon', 'clear-icon', 'counter-string', 'counter-size-string',
    'validation-value', 'required',
  ];

  constructor() {
    super();
    this._files = [];
  }

  get label() { return this._attr('label', 'Choose file'); }
  get accept() { return wValueList(this._attr('accept', '')).join(','); }
  get multiple() { return this._bool('multiple'); }
  get disabled() { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get readonly() { return this._bool('readonly'); }
  set readonly(value) { this.toggleAttribute('readonly', !!value); }
  get chips() { return this._bool('chips'); }
  get smallChips() { return this._bool('small-chips'); }
  get counter() { return this._bool('counter'); }
  get showSize() { return this._bool('show-size'); }
  get clearable() { return this._bool('clearable'); }
  get placeholder() { return this._attr('placeholder', ''); }
  get hint() { return this._attr('hint', ''); }
  get error() { return this._attr('error', ''); }
  get truncateLength() {
    const n = parseInt(this._attr('truncate-length', '22'), 10);
    return Number.isNaN(n) ? 22 : n;
  }
  get density() { return this._attr('density', ''); }
  get name() { return this._attr('name', ''); }
  get singleLine() { return this._bool('single-line'); }
  get hideInput() { return this._bool('hide-input'); }

  // `dirty` forces the has-value styling that a selection applies on its own.
  get dirty() { return this._bool('dirty') || wFileValidationHasValue(this, this._files); }

  // With `single-line` the label collapses into the placeholder.
  get placeholderText() {
    if (this.placeholder) return this.placeholder;
    return this.singleLine ? this.label : '';
  }

  get files() { return Array.from(this._files); }
  set files(value) {
    this._files = value ? Array.from(value) : [];
    if (this._rendered) this._refresh();
  }

  get _enhanced() {
    return this.chips || this.smallChips || this.counter || this.showSize ||
      this.clearable || this.placeholder || this.hint || this.error ||
      this.density || this.readonly || this._hasFieldAttr;
  }

  get _hasFieldAttr() {
    return WFileInput.fieldAttrs.some((name) => this.hasAttribute(name));
  }

  _plainTemplate() {
    return `<label class="w-file-input">
        <span class="w-file-input-label">${this._esc(this.label)}</span>
        <span class="w-file-input-name">${this._esc(this._fileNames()) || 'No file chosen'}</span>
        <input type="file"${this._inputAttrs()}>
      </label>`;
  }

  _rootClass() {
    return [
      'w-file-input',
      'w-file-input--field',
      this.density ? `w-file-input--density-${this.density}` : '',
      this.dirty ? 'w-file-input--dirty' : '',
      this.hideInput ? 'w-file-input--hide-input' : '',
    ].concat(wFieldClasses(this)).filter(Boolean).join(' ');
  }

  _rootStyle() {
    const color = wSafeColor(this._attr('icon-color', ''));
    return color ? ` style="--w-field-icon-color:${color}"` : '';
  }

  // Error text withheld while `validate-on="lazy"` waits for an interaction.
  _errorTexts() {
    if (wSuppressErrors(this, this.__touched)) return [];
    return wErrorTexts(this, this.error || wFileRequiredError(this, this._files));
  }

  _hasError() {
    return this._errorTexts().length > 0;
  }

  _message() {
    const errors = this._errorTexts();
    const parts = [];
    if (errors.length) parts.push(errors[0]);
    else if (this.hint) parts.push(this.hint);
    if (this.counter && !errors.length) parts.push(this._counterText());
    return parts.join(' · ');
  }

  _placeholderMarkup() {
    const text = this.placeholderText;
    if (this._files.length || !text) return '';
    return `<span class="w-file-input-placeholder">${this._esc(text)}</span>`;
  }

  _clearMarkup() {
    if (!this.clearable || !this._files.length || this.disabled) return '';
    const glyph = wIconHtml(this, 'clear-icon', 'w-file-input-clear-icon') || '×';
    return `<button class="w-file-input-clear" type="button" aria-label="Clear files">${glyph}</button>`;
  }

  _labelMarkup() {
    if (!this.label || this.singleLine) return '';
    return `<label class="w-field-label">${this._esc(this.label)}</label>`;
  }

  // `prepend-icon` / `append-icon` sit outside the control, so they only add a
  // wrapper row when one of them is set.
  _outerMarkup(control) {
    const before = wIconHtml(this, 'prepend-icon', 'w-field-prepend');
    const after = wIconHtml(this, 'append-icon', 'w-field-append');
    if (!before && !after) return control;
    return `<div class="w-file-input-outer">${before}${control}${after}</div>`;
  }

  // `hide-input` keeps the icons and drops the names / placeholder.
  _contentMarkup() {
    if (this.hideInput) return '';
    return this._selectionTemplate() + this._placeholderMarkup();
  }

  _controlMarkup() {
    return `<div class="${this._rootClass()}"${this._rootStyle()}>
        <label class="w-file-input-field">
          <input type="file"${this._inputAttrs()}>
          ${wIconHtml(this, 'prepend-inner-icon', 'w-field-prepend-inner')}
          ${this._contentMarkup()}
          ${wIconHtml(this, 'append-inner-icon', 'w-field-append-inner')}
        </label>
        ${this._clearMarkup()}
      </div>`;
  }

  _detailsMarkup() {
    if (wHideDetails(this)) return '';
    const primary = this._message();
    const extras = wFieldExtras(this, this._errorTexts(), this.hint);
    if (!primary && !extras) return '';
    const indent = this._cls({ 'w-field--indent-details': this._bool('indent-details') });
    const hint = primary ? `<span class="w-field-hint">${this._esc(primary)}</span>` : '';
    return `<div class="w-field-details${indent}">${hint}${extras}</div>`;
  }

  _template() {
    if (!this._enhanced) return this._plainTemplate();
    const fieldClass = 'w-field' + this._cls({ 'w-field-error': this._hasError() });

    return `<div class="${fieldClass}">
      ${this._labelMarkup()}
      ${this._outerMarkup(this._controlMarkup())}
      ${this._detailsMarkup()}
    </div>`;
  }

  _inputAttrs() {
    return this._attrs({
      accept: this.accept,
      multiple: this.multiple,
      disabled: this.disabled,
      required: this.hasAttribute('required'),
      name: this.name,
      'aria-invalid': this._hasError() && 'true',
    }) + (this.readonly ? ' readonly tabindex="-1"' : '');
  }

  _fileNames() {
    if (!this._files.length) return '';
    return this._files.map((f) => truncateName(f.name, this.truncateLength)).join(', ');
  }

  // The default reads "2 files (11 B)". `counter-string` replaces it, and
  // `counter-size-string` replaces it while `show-size` is on; {0} is the
  // count and {1} the total size.
  _counterText() {
    const count = this._files.length;
    const total = this._files.reduce((sum, f) => sum + (f.size || 0), 0);
    const template = this._attr(this.showSize ? 'counter-size-string' : 'counter-string', '');
    if (template) return template.replace('{0}', String(count)).replace('{1}', formatSize(total));
    return `${count} file${count !== 1 ? 's' : ''}${total ? ` (${formatSize(total)})` : ''}`;
  }

  _chipMarkup(file, index) {
    const size = this.showSize ? `<span class="w-chip__append">${this._esc(formatSize(file.size))}</span>` : '';
    return `<span class="w-chip w-chip-tonal ${this._chipSize} w-file-input-chip" data-index="${index}">
          <span class="w-chip__content">${this._esc(truncateName(file.name, this.truncateLength))}</span>
          ${size}
          <span class="w-chip__close w-chip-close" role="button" tabindex="0" aria-label="Remove ${this._esc(file.name)}">×</span>
        </span>`;
  }

  get _chipSize() { return this.smallChips ? 'w-chip--x-small' : 'w-chip--small'; }

  _selectionTemplate() {
    if (!this._files.length) return '';
    if (this.chips || this.smallChips) {
      const chips = this._files.map((file, i) => this._chipMarkup(file, i)).join('');
      return `<span class="w-file-input-chips">${chips}</span>`;
    }
    return `<span class="w-file-input-name">${this._esc(this._fileNames())}</span>`;
  }

  _events() {
    this._inputEvents();
    this._fieldEvents();
    this._clearEvents();
    this._chipEvents();
  }

  _inputEvents() {
    const input = this._q('input[type="file"]');
    if (!input) return;

    input.addEventListener('change', (event) => {
      event.stopPropagation();
      this._setFiles(Array.from(event.target.files || []));
    });
    input.addEventListener('click', (event) => {
      if (this.readonly) event.preventDefault();
    });
    input.addEventListener('blur', () => this._onBlur());
    // Restore the FileList after re-renders.
    const list = toFileList(this._files);
    if (list) input.files = list;
  }

  _fieldEvents() {
    const field = this._q('.w-file-input-field');
    if (!field) return;

    field.addEventListener('dragover', (event) => {
      event.preventDefault();
      field.classList.add('w-file-input--dragover');
    });
    field.addEventListener('dragleave', () => {
      field.classList.remove('w-file-input--dragover');
    });
    field.addEventListener('drop', (event) => {
      event.preventDefault();
      field.classList.remove('w-file-input--dragover');
      if (this.disabled || this.readonly) return;
      const dropped = Array.from(event.dataTransfer?.files || []);
      this._setFiles(this.multiple ? dropped : dropped.slice(0, 1));
    });
  }

  _clearEvents() {
    const clear = this._q('.w-file-input-clear');
    if (!clear) return;
    clear.addEventListener('click', (event) => {
      event.stopPropagation();
      this._clear();
    });
  }

  _chipEvents() {
    this._qAll('.w-file-input-chip .w-chip-close').forEach((btn) => {
      const onActivate = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const chip = btn.closest('.w-file-input-chip');
        const index = parseInt(chip?.getAttribute('data-index'), 10);
        if (!Number.isNaN(index)) this._removeFile(index);
      };
      btn.addEventListener('click', onActivate);
      btn.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        onActivate(event);
      });
    });
  }

  // Leaving the field is what reveals validation under `validate-on="blur"`.
  _onBlur() {
    if (this.__touched) return;
    this._markTouched('blur');
    if (this.__touched) this._refresh();
  }

  // `validate-on="blur …"` waits for the field to be left; every other mode
  // counts a selection as the interaction that reveals validation.
  _markTouched(source) {
    const mode = this._attr('validate-on', '');
    if (mode.includes('blur') && source !== 'blur') return;
    this.__touched = true;
  }

  // The single path every selection takes: `filter-by-type` first, then the
  // re-render and the change/input pair.
  _setFiles(files) {
    const { accepted, rejected } = wFilterByType(this, files);
    this._files = accepted;
    this._markTouched('change');
    this._refresh();
    if (rejected.length) this._emit('rejected', { files: rejected.map(wFileDetail) });
    this._emitFiles('change');
    this._emitFiles('input');
  }

  _refresh() {
    this._render();
    this._events();
    this._applyCommonProps();
  }

  _emitFiles(eventName) {
    const files = this.files.map(wFileDetail);
    this._emit(eventName, { files, value: files });
  }

  _removeFile(index) {
    this._files.splice(index, 1);
    this._refresh();
    this._emitFiles('change');
  }

  _clear() {
    this._files = [];
    this._refresh();
    this._emit('change', { files: [], value: [] });
  }
}

if (!customElements.get('w-file-input')) customElements.define('w-file-input', WFileInput);
