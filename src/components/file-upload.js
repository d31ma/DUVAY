/* <w-file-upload> — DuVay component module
 *
 * A Vuetify-style drag-and-drop file upload area.
 *
 * Attributes:
 *   title        - dropzone title (default: "Upload files")
 *   subtitle     - helper text below the browse button (default: "Drag and drop files here")
 *   browse-text  - browse button text (default: "Browse")
 *   divider-text - divider text (default: "or")
 *   icon         - icon character/HTML for the dropzone (default: ⬆)
 *   accept       - comma-separated accepted MIME types/extensions
 *   multiple     - allow multiple file selection
 *   disabled     - disable interaction
 *   readonly     - make read-only
 *   clearable    - show remove buttons on each file item
 *   show-size    - show each file's size
 *   density      - compact | comfortable | default
 *
 * Events:
 *   change      - fires when files change (detail: { files, value })
 *   input       - fires on every file selection (detail: { files, value })
 */
import { wValueList } from './utils.js';
import { formatSize, truncateName } from './file-input.js';

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
  get readonly() { return this._bool('readonly'); }
  get clearable() { return this._bool('clearable'); }
  get showSize() { return this._bool('show-size'); }
  get density() { return this._attr('density', ''); }

  get files() { return Array.from(this._files); }
  set files(value) {
    this._files = value ? Array.from(value) : [];
    if (this._rendered) {
      this._render();
      this._events();
      this._applyCommonProps();
    }
  }

  _template() {
    const dropClass = [
      'w-file-upload-dropzone',
      this.density ? `w-file-upload-dropzone--density-${this.density}` : '',
      this.disabled ? 'w-file-upload-dropzone--disabled' : '',
      this.readonly ? 'w-file-upload-dropzone--readonly' : '',
    ].filter(Boolean).join(' ');

    return `<div class="w-file-upload">
      <div class="${dropClass}" tabindex="${this.disabled ? '-1' : '0'}" role="button" aria-label="${this._esc(this.title)}">
        <input type="file"${this._inputAttrs()}>
        <div class="w-file-upload-icon">${this.icon}</div>
        <div class="w-file-upload-title">${this._esc(this.title)}</div>
        <div class="w-file-upload-divider"><span>${this._esc(this.dividerText)}</span></div>
        <button class="w-file-upload-browse w-btn w-btn-tonal" type="button"${this.disabled ? ' disabled' : ''}>${this._esc(this.browseText)}</button>
        ${this.subtitle ? `<div class="w-file-upload-subtitle">${this._esc(this.subtitle)}</div>` : ''}
      </div>
      ${this._files.length ? this._listTemplate() : ''}
    </div>`;
  }

  _inputAttrs() {
    const attrs = [];
    if (this.accept) attrs.push(` accept="${this._esc(this.accept)}"`);
    if (this.multiple) attrs.push(' multiple');
    if (this.disabled) attrs.push(' disabled');
    if (this.readonly) attrs.push(' readonly');
    return attrs.join('');
  }

  _listTemplate() {
    return `<div class="w-file-upload-list">${this._files.map((file, i) => `
      <div class="w-file-upload-item" data-index="${i}">
        <span class="w-file-upload-item-name">${this._esc(truncateName(file.name, 40))}</span>
        ${this.showSize ? `<span class="w-file-upload-item-size">${this._esc(formatSize(file.size))}</span>` : ''}
        ${this.clearable ? `<button class="w-file-upload-item-remove" type="button" aria-label="Remove ${this._esc(file.name)}" tabindex="0">×</button>` : ''}
      </div>
    `).join('')}</div>`;
  }

  _events() {
    const dropzone = this._q('.w-file-upload-dropzone');
    const input = this._q('input[type="file"]');
    const browse = this._q('.w-file-upload-browse');

    if (input) {
      input.addEventListener('change', (event) => {
        event.stopPropagation();
        const selected = Array.from(event.target.files || []);
        this._addFiles(selected);
      });
      const list = toFileList(this._files);
      if (list) input.files = list;
    }

    if (dropzone) {
      dropzone.addEventListener('click', (event) => {
        if (event.target.closest('.w-file-upload-browse, .w-file-upload-item-remove')) return;
        if (this.disabled || this.readonly) return;
        input?.click();
      });

      dropzone.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        if (this.disabled || this.readonly) return;
        input?.click();
      });

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
        const dropped = Array.from(event.dataTransfer?.files || []);
        this._addFiles(dropped);
      });

      dropzone.addEventListener('paste', (event) => {
        if (this.disabled || this.readonly) return;
        const pasted = Array.from(event.clipboardData?.files || []);
        if (!pasted.length) return;
        event.preventDefault();
        this._addFiles(pasted);
      });
    }

    if (browse) {
      browse.addEventListener('click', (event) => {
        event.stopPropagation();
        if (this.disabled || this.readonly) return;
        input?.click();
      });
    }

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

  _addFiles(files) {
    if (!files.length) return;
    this._files = this.multiple ? [...this._files, ...files] : files.slice(0, 1);
    this._render();
    this._events();
    this._applyCommonProps();
    this._emitFiles('change');
    this._emitFiles('input');
  }

  _removeFile(index) {
    this._files.splice(index, 1);
    this._render();
    this._events();
    this._applyCommonProps();
    this._emitFiles('change');
  }

  _emitFiles(eventName) {
    const files = this.files.map((file) => ({ name: file.name, size: file.size, type: file.type }));
    this._emit(eventName, { files, value: files });
  }
}

if (!customElements.get('w-file-upload')) customElements.define('w-file-upload', WFileUpload);
