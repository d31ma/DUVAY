/* <w-file-upload> — DuVay component module
 *
 * A Vuetify-style drag-and-drop file upload area.
 *
 * Attributes:
 *   title        - dropzone title (default: "Upload files")
 *   subtitle     - helper text below the browse button (default: "Drag and drop files here")
 *   browse-text  - browse button text (default: "Browse")
 *   divider-text - divider text (default: "or")
 *   hide-browse  - drop the divider and the browse button
 *   icon         - icon character/HTML for the dropzone (default: ⬆)
 *   accept       - comma-separated accepted MIME types/extensions
 *   filter-by-type - only accept files matching these type specifiers
 *   validation-value - serializable value used instead of the FileList for
 *                      required validation
 *   required     - require a file or a non-empty validation-value
 *   multiple     - allow multiple file selection
 *   disabled     - disable interaction
 *   readonly     - make read-only
 *   clearable    - show remove buttons on each file item
 *   show-size    - show each file's size
 *   inset-file-list - render the file list inside the dropzone
 *   density      - compact | comfortable | default
 *   name         - form field name
 *   label        - field label above the dropzone
 *   hint         - helper text below the dropzone
 *   persistent-hint - keep the hint visible alongside an error
 *   error        - manual error state
 *   error-messages  - error messages (string or JSON array); sets the error state
 *   max-errors   - how many error messages to show (default 1)
 *   messages     - extra messages (string or JSON array)
 *   validate-on  - `lazy` withholds errors until the field is used; a `blur`
 *                  token makes blur (not selection) the trigger
 *   hide-details - suppress the details row (`auto` == the default)
 *   indent-details - inset the details row
 *   scrim        - overlay shown while files hover the dropzone; a color name
 *                  or value tints it, `false` turns it off
 *   center-affix, glow, hide-spin-buttons - shared field-surface flags
 *   icon-color   - color for the affix icons
 *   prepend-icon, append-icon - icons outside the dropzone
 *   icon-set     - icon set prefix for every *-icon attribute
 *
 * Events:
 *   change      - fires when files change (detail: { files, value })
 *   input       - fires on every file selection (detail: { files, value })
 *   rejected    - files turned away by `filter-by-type` (detail: { files })
 */
import {
  formatSize, truncateName, wErrorTexts, wFieldClasses, wFieldExtras,
  wFileDetail, wFileRequiredError, wFilterByType, wHideDetails, wIconHtml,
  wSafeColor, wSuppressErrors,
} from './file-input.js';
import { wValueList } from './utils.js';

function toFileList(files) {
  try {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    return dt.files;
  } catch (e) {
    return null;
  }
}

export class WFileUpload extends WElement {
  static attrs = [
    'title', 'subtitle', 'browse-text', 'divider-text', 'icon',
    'accept', 'multiple', 'disabled', 'readonly',
    'clearable', 'show-size', 'density',
    // Vuetify field surface
    'name', 'label', 'hint', 'persistent-hint', 'error', 'error-messages',
    'max-errors', 'messages', 'validate-on', 'hide-details', 'indent-details',
    'variant', 'center-affix', 'glow', 'icon-color', 'hide-spin-buttons',
    'prepend-icon', 'append-icon', 'icon-set',
    'scrim', 'filter-by-type', 'inset-file-list', 'hide-browse',
    'validation-value', 'required',
  ];

  constructor() {
    super();
    this._files = [];
  }

  get title() { return this._attr('title', 'Upload files'); }
  get subtitle() { return this._attr('subtitle', 'Drag and drop files here'); }
  get browseText() { return this._attr('browse-text', 'Browse'); }
  get dividerText() { return this._attr('divider-text', 'or'); }
  get icon() { return this._attr('icon', '⬆'); }
  get accept() { return wValueList(this._attr('accept', '')).join(','); }
  get multiple() { return this._bool('multiple'); }
  get disabled() { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get readonly() { return this._bool('readonly'); }
  set readonly(value) { this.toggleAttribute('readonly', !!value); }
  get clearable() { return this._bool('clearable'); }
  get showSize() { return this._bool('show-size'); }
  get density() { return this._attr('density', ''); }
  get name() { return this._attr('name', ''); }
  get label() { return this._attr('label', ''); }
  get hint() { return this._attr('hint', ''); }
  get hideBrowse() { return this._bool('hide-browse'); }
  get insetFileList() { return this._bool('inset-file-list'); }

  // `scrim` is on unless it is absent or explicitly false; a value also tints it.
  get scrim() {
    const value = this._attr('scrim', null);
    return value !== null && value !== 'false';
  }

  get scrimColor() {
    const value = this._attr('scrim', '');
    return value === 'true' ? '' : value;
  }

  get files() { return Array.from(this._files); }
  set files(value) {
    this._files = value ? Array.from(value) : [];
    if (this._rendered) this._refresh();
  }

  /* ── Field surface ─────────────────────────────────────────────────────── */

  _errorTexts() {
    if (wSuppressErrors(this, this.__touched)) return [];
    return wErrorTexts(this, wFileRequiredError(this, this._files));
  }

  _hasError() {
    return this._bool('error') || this._errorTexts().length > 0;
  }

  _labelMarkup() {
    if (!this.label) return '';
    return `<label class="w-field-label">${this._esc(this.label)}</label>`;
  }

  _detailsMarkup() {
    if (wHideDetails(this)) return '';
    const errors = this._errorTexts();
    const primary = errors[0] || this.hint;
    const extras = wFieldExtras(this, errors, this.hint);
    if (!primary && !extras) return '';
    const indent = this._cls({ 'w-field--indent-details': this._bool('indent-details') });
    const hint = primary ? `<span class="w-field-hint">${this._esc(primary)}</span>` : '';
    return `<div class="w-field-details${indent}">${hint}${extras}</div>`;
  }

  // `prepend-icon` / `append-icon` sit outside the dropzone, so they only add a
  // wrapper row when one of them is set.
  _outerMarkup(control) {
    const before = wIconHtml(this, 'prepend-icon', 'w-field-prepend');
    const after = wIconHtml(this, 'append-icon', 'w-field-append');
    if (!before && !after) return control;
    return `<div class="w-file-upload-outer">${before}${control}${after}</div>`;
  }

  // Custom properties the dropzone carries. The standalone <w-file-upload-dropzone>
  // extends this list with its divider and timing knobs.
  _styleProps() {
    const props = [];
    const icon = wSafeColor(this._attr('icon-color', ''));
    if (icon) props.push(`--w-field-icon-color:${icon}`);
    const scrim = wSafeColor(this.scrimColor);
    if (scrim) props.push(`--w-file-upload-scrim:${scrim}`);
    return props;
  }

  _dropzoneStyle() {
    const props = this._styleProps();
    return props.length ? ` style="${this._esc(props.join(';'))}"` : '';
  }

  /* ── Template ──────────────────────────────────────────────────────────── */

  _dropzoneClass() {
    return [
      'w-file-upload-dropzone',
      this.density ? `w-file-upload-dropzone--density-${this.density}` : '',
      this.disabled ? 'w-file-upload-dropzone--disabled' : '',
      this.readonly ? 'w-file-upload-dropzone--readonly' : '',
      this.scrim ? 'w-file-upload-dropzone--scrim' : '',
      this.insetFileList ? 'w-file-upload-dropzone--inset' : '',
    ].concat(wFieldClasses(this)).filter(Boolean).join(' ');
  }

  // Authored children render inside the dropzone for the standalone element.
  _slotMarkup() { return ''; }

  _browseMarkup() {
    if (this.hideBrowse) return '';
    const disabled = this._attrs({ disabled: this.disabled });
    return `<div class="w-file-upload-divider"><span>${this._esc(this.dividerText)}</span></div>
        <button class="w-file-upload-browse w-btn w-btn-tonal" type="button"${disabled}>${this._esc(this.browseText)}</button>`;
  }

  _dropzoneMarkup(insetList) {
    const subtitle = this.subtitle ? `<div class="w-file-upload-subtitle">${this._esc(this.subtitle)}</div>` : '';
    /* `role="button"` may not contain focusable descendants, and the browse
     * button is one. `group` is a container role, so it takes children legally
     * while keeping the drop area named and the Enter/Space shortcut working.
     * With browse hidden the dropzone really is the only control, so it stays a
     * button — the clipped file input is not a tab stop either way. */
    const state = this._attrs({
      tabindex: this.disabled ? '-1' : '0',
      role: this.hideBrowse ? 'button' : 'group',
      'aria-label': this.title,
      'aria-invalid': this._hasError() && 'true',
    });

    return `<div class="${this._dropzoneClass()}"${state}${this._dropzoneStyle()}>
        <input type="file"${this._inputAttrs()}>
        <div class="w-file-upload-icon">${this.icon}</div>
        <div class="w-file-upload-title">${this._esc(this.title)}</div>
        ${this._browseMarkup()}
        ${subtitle}
        ${this._slotMarkup()}
        ${insetList}
      </div>`;
  }

  _template() {
    const list = this._files.length ? this._listTemplate() : '';
    const inset = this.insetFileList;
    const rootClass = 'w-file-upload' + this._cls({ 'w-field-error': this._hasError() });

    return `<div class="${rootClass}">
      ${this._labelMarkup()}
      ${this._outerMarkup(this._dropzoneMarkup(inset ? list : ''))}
      ${inset ? '' : list}
      ${this._detailsMarkup()}
    </div>`;
  }

  _inputAttrs() {
    return this._attrs({
      accept: this.accept,
      multiple: this.multiple,
      disabled: this.disabled,
      readonly: this.readonly,
      required: this.hasAttribute('required'),
      name: this.name,
      // The input is clipped to 1x1 and opened by clicking the dropzone or the
      // browse button, so it is an implementation detail rather than a tab
      // stop. It still needs a name: a form control without one is announced
      // as "edit blank", and it is what a screen reader lands on in forms mode.
      tabindex: '-1',
      'aria-label': this.label || this.title,
      'aria-invalid': this._hasError() && 'true',
    });
  }

  _itemMarkup(file, index) {
    const size = this.showSize ? `<span class="w-file-upload-item-size">${this._esc(formatSize(file.size))}</span>` : '';
    const remove = this.clearable
      ? `<button class="w-file-upload-item-remove" type="button" aria-label="Remove ${this._esc(file.name)}" tabindex="0">×</button>`
      : '';
    return `<div class="w-file-upload-item" data-index="${index}">
        <span class="w-file-upload-item-name">${this._esc(truncateName(file.name, 40))}</span>
        ${size}
        ${remove}
      </div>`;
  }

  _listTemplate() {
    const items = this._files.map((file, i) => this._itemMarkup(file, i)).join('');
    return `<div class="w-file-upload-list" role="list">${items}</div>`;
  }

  /* ── Behaviour ─────────────────────────────────────────────────────────── */

  _events() {
    const input = this._q('input[type="file"]');
    this._inputEvents(input);
    this._dropzoneEvents(input);
    this._browseEvents(input);
    this._removeEvents();
  }

  _inputEvents(input) {
    if (!input) return;
    input.addEventListener('change', (event) => {
      event.stopPropagation();
      this._addFiles(Array.from(event.target.files || []));
    });
    const list = toFileList(this._files);
    if (list) input.files = list;
  }

  _dropzoneEvents(input) {
    const dropzone = this._q('.w-file-upload-dropzone');
    if (!dropzone) return;

    dropzone.addEventListener('click', (event) => {
      if (event.target.closest('.w-file-upload-browse, .w-file-upload-item-remove')) return;
      this._open(input);
    });

    dropzone.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      this._open(input);
    });

    dropzone.addEventListener('blur', () => this._onBlur());
    this._dragEvents(dropzone);
  }

  _dragEvents(dropzone) {
    dropzone.addEventListener('dragover', (event) => {
      event.preventDefault();
      if (this.disabled || this.readonly) return;
      dropzone.classList.add('w-file-upload-dropzone--dragover');
    });

    dropzone.addEventListener('dragleave', (event) => {
      event.preventDefault();
      if (!dropzone.contains(event.relatedTarget)) {
        dropzone.classList.remove('w-file-upload-dropzone--dragover');
      }
    });

    dropzone.addEventListener('drop', (event) => {
      event.preventDefault();
      dropzone.classList.remove('w-file-upload-dropzone--dragover');
      if (this.disabled || this.readonly) return;
      this._addFiles(Array.from(event.dataTransfer?.files || []));
    });

    dropzone.addEventListener('paste', (event) => {
      if (this.disabled || this.readonly) return;
      const pasted = Array.from(event.clipboardData?.files || []);
      if (!pasted.length) return;
      event.preventDefault();
      this._addFiles(pasted);
    });
  }

  _browseEvents(input) {
    const browse = this._q('.w-file-upload-browse');
    if (!browse) return;
    browse.addEventListener('click', (event) => {
      event.stopPropagation();
      this._open(input);
    });
  }

  _removeEvents() {
    this._qAll('.w-file-upload-item-remove').forEach((btn) => {
      const handler = (event) => {
        event.stopPropagation();
        const item = btn.closest('.w-file-upload-item');
        const index = parseInt(item?.getAttribute('data-index'), 10);
        if (!Number.isNaN(index)) this._removeFile(index);
      };
      btn.addEventListener('click', handler);
      btn.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        handler(event);
      });
    });
  }

  _open(input) {
    if (this.disabled || this.readonly) return;
    input?.click();
  }

  // Leaving the dropzone is what reveals validation under `validate-on="blur"`.
  _onBlur() {
    if (this.__touched) return;
    this._markTouched('blur');
    if (this.__touched) this._refresh();
  }

  _markTouched(source) {
    const mode = this._attr('validate-on', '');
    if (mode.includes('blur') && source !== 'blur') return;
    this.__touched = true;
  }

  _addFiles(files) {
    if (!files.length) return;
    const { accepted, rejected } = wFilterByType(this, files);
    if (rejected.length) this._emit('rejected', { files: rejected.map(wFileDetail) });
    if (!accepted.length) return;
    this._files = this.multiple ? [...this._files, ...accepted] : accepted.slice(0, 1);
    this._markTouched('change');
    this._refresh();
    this._emitFiles('change');
    this._emitFiles('input');
  }

  _refresh() {
    this._render();
    this._events();
    this._applyCommonProps();
  }

  _removeFile(index) {
    this._files.splice(index, 1);
    this._refresh();
    this._emitFiles('change');
  }

  _emitFiles(eventName) {
    const files = this.files.map(wFileDetail);
    this._emit(eventName, { files, value: files });
  }
}

if (!customElements.get('w-file-upload')) customElements.define('w-file-upload', WFileUpload);
