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
 *   show-size        - show each file's size next to its name
 *   clearable        - show a clear-all button
 *   placeholder      - placeholder text when no files are selected
 *   hint             - helper text below the field
 *   error            - error text; also adds error styling
 *   truncate-length  - max characters for a file name (default 22)
 *   density          - compact | comfortable | default
 *
 * Events:
 *   change          - fires when files change (detail: { files, value })
 *   input           - fires on every file selection (detail: { files, value })
 */
import { wValueList } from './utils.js';

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

export class WFileInput extends WElement {
  static attrs = [
    'label', 'accept', 'multiple', 'disabled', 'readonly',
    'chips', 'small-chips', 'counter', 'show-size', 'clearable',
    'placeholder', 'hint', 'error', 'truncate-length', 'density', 'name',
  ];

  constructor() {
    super();
    this._files = [];
  }

  get label() { return this._attr('label', 'Choose file'); }
  get accept() { return wValueList(this._attr('accept', '')).join(','); }
  get multiple() { return this._bool('multiple'); }
  get disabled() { return this._bool('disabled'); }
  get readonly() { return this._bool('readonly'); }
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

  get files() { return Array.from(this._files); }
  set files(value) {
    this._files = value ? Array.from(value) : [];
    if (this._rendered) {
      this._render();
      this._events();
      this._applyCommonProps();
    }
  }

  get _enhanced() {
    return this.chips || this.smallChips || this.counter || this.showSize ||
      this.clearable || this.placeholder || this.hint || this.error ||
      this.density || this.readonly;
  }

  _template() {
    if (!this._enhanced) {
      return `<label class="w-file-input">
        <span class="w-file-input-label">${this._esc(this.label)}</span>
        <span class="w-file-input-name">${this._esc(this._fileNames()) || 'No file chosen'}</span>
        <input type="file"${this._inputAttrs()}>
      </label>`;
    }

    const rootClass = [
      'w-file-input',
      'w-file-input--field',
      this.density ? `w-file-input--density-${this.density}` : '',
    ].filter(Boolean).join(' ');

    const messageParts = [];
    if (this.error) messageParts.push(this.error);
    else if (this.hint) messageParts.push(this.hint);
    if (this.counter && !this.error) messageParts.push(this._counterText());
    const message = messageParts.join(' · ');
    const fieldClass = this.error ? 'w-field w-field-error' : 'w-field';

    return `<div class="${fieldClass}">
      ${this.label ? `<label class="w-field-label">${this._esc(this.label)}</label>` : ''}
      <div class="${rootClass}">
        <label class="w-file-input-field">
          <input type="file"${this._inputAttrs()}>
          ${this._selectionTemplate()}
          ${!this._files.length && this.placeholder ? `<span class="w-file-input-placeholder">${this._esc(this.placeholder)}</span>` : ''}
        </label>
        ${this.clearable && this._files.length && !this.disabled ? `<button class="w-file-input-clear" type="button" aria-label="Clear files">×</button>` : ''}
      </div>
      ${message ? `<span class="w-field-hint">${this._esc(message)}</span>` : ''}
    </div>`;
  }

  _inputAttrs() {
    const attrs = [];
    if (this.accept) attrs.push(` accept="${this._esc(this.accept)}"`);
    if (this.multiple) attrs.push(' multiple');
    if (this.disabled) attrs.push(' disabled');
    if (this.readonly) attrs.push(' readonly tabindex="-1"');
    if (this.name) attrs.push(` name="${this._esc(this.name)}"`);
    return attrs.join('');
  }

  _fileNames() {
    if (!this._files.length) return '';
    return this._files.map((f) => truncateName(f.name, this.truncateLength)).join(', ');
  }

  _counterText() {
    const count = this._files.length;
    const total = this._files.reduce((sum, f) => sum + (f.size || 0), 0);
    return `${count} file${count !== 1 ? 's' : ''}${total ? ` (${formatSize(total)})` : ''}`;
  }

  _selectionTemplate() {
    if (!this._files.length) return '';
    if (this.chips || this.smallChips) {
      const chipSize = this.smallChips ? 'w-chip--x-small' : 'w-chip--small';
      return `<span class="w-file-input-chips">${this._files.map((file, i) => `
        <span class="w-chip w-chip-tonal ${chipSize} w-file-input-chip" data-index="${i}">
          <span class="w-chip__content">${this._esc(truncateName(file.name, this.truncateLength))}</span>
          ${this.showSize ? `<span class="w-chip__append">${this._esc(formatSize(file.size))}</span>` : ''}
          <span class="w-chip__close w-chip-close" role="button" tabindex="0" aria-label="Remove ${this._esc(file.name)}">×</span>
        </span>
      `).join('')}</span>`;
    }
    return `<span class="w-file-input-name">${this._esc(this._fileNames())}</span>`;
  }

  _events() {
    const input = this._q('input[type="file"]');
    const field = this._q('.w-file-input-field');
    const clear = this._q('.w-file-input-clear');

    if (input) {
      input.addEventListener('change', (event) => {
        event.stopPropagation();
        const files = Array.from(event.target.files || []);
        this._files = files;
        this._render();
        this._events();
        this._applyCommonProps();
        this._emitFiles('change');
        this._emitFiles('input');
      });
      input.addEventListener('click', (event) => {
        if (this.readonly) event.preventDefault();
      });
      // Restore the FileList after re-renders.
      const list = toFileList(this._files);
      if (list) input.files = list;
    }

    if (field) {
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
        this._files = this.multiple ? dropped : dropped.slice(0, 1);
        this._render();
        this._events();
        this._applyCommonProps();
        this._emitFiles('change');
        this._emitFiles('input');
      });
    }

    if (clear) {
      clear.addEventListener('click', (event) => {
        event.stopPropagation();
        this._clear();
      });
    }

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

  _emitFiles(eventName) {
    const files = this.files.map((file) => ({ name: file.name, size: file.size, type: file.type }));
    this._emit(eventName, { files, value: files });
  }

  _removeFile(index) {
    this._files.splice(index, 1);
    this._render();
    this._events();
    this._applyCommonProps();
    this._emitFiles('change');
  }

  _clear() {
    this._files = [];
    this._render();
    this._events();
    this._applyCommonProps();
    this._emit('change', { files: [], value: [] });
  }
}

if (!customElements.get('w-file-input')) customElements.define('w-file-input', WFileInput);
