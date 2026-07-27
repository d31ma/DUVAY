/* <w-file-upload-item> — one row of an uploaded-file list.
 *
 * Attributes:
 *   file          - the file, as a JSON record ({"name":…,"size":…,"type":…})
 *                   or assigned as a property (a real File works too)
 *   file-icon     - icon in front of the name; an image file previews instead
 *   index         - the file's index within the list
 *   title         - primary text (defaults to the file name)
 *   subtitle      - secondary text
 *   value         - value reported when the row is chosen
 *   show-size     - show the file size
 *   clearable     - show a remove button
 *   href          - render the row as a link
 *   link          - mark the row as interactive without an href
 *   active        - highlighted state
 *   active-class  - extra class applied while active
 *   nav           - narrower, rounded navigation styling
 *   slim          - reduced horizontal spacing
 *   lines         - one | two | three (minimum row height)
 *   variant       - flat | text | elevated | tonal | outlined | plain
 *   prepend-icon, append-icon     - icons on either side
 *   prepend-avatar, append-avatar - avatars on either side (image URL or initials)
 *   prepend-gap   - spacing between the prepend slot and the content
 *   ripple        - press ripple
 *   icon-set      - icon set prefix for every *-icon attribute
 *
 * Slots:
 *   default, prepend, append
 *
 * Events:
 *   change - the row was chosen (detail: { value, index, title })
 *   remove - the remove button was used (detail: { value, index, title })
 */
import { formatSize, wCssLength, wIconHtml } from './file-input.js';
import { wSafeImageUrl, wSafeUrl } from './utils.js';

// The `file` attribute carries a JSON record; the property carries the File.
function wFileRecord(value) {
  const text = String(value == null ? '' : value).trim();
  if (!text.startsWith('{')) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// A real File has no address until one is minted for it.
function wObjectUrl(file) {
  if (typeof File === 'undefined' || !(file instanceof File)) return '';
  return URL.createObjectURL(file);
}

export class WFileUploadItem extends WElement {
  static attrs = [
    'file', 'file-icon', 'index', 'title', 'subtitle', 'value', 'show-size',
    'clearable', 'href', 'link', 'active', 'active-class', 'nav', 'slim',
    'lines', 'variant', 'prepend-icon', 'append-icon', 'prepend-avatar',
    'append-avatar', 'prepend-gap', 'ripple', 'icon-set',
  ];

  get file() { return this._file || wFileRecord(this.getAttribute('file')); }
  set file(value) {
    this._file = value || null;
    if (this._rendered) this._refresh();
  }

  get fileName() {
    const file = this.file;
    return file && file.name ? String(file.name) : '';
  }

  get itemTitle() { return this._attr('title', '') || this.fileName; }
  get subtitle() { return this._attr('subtitle', ''); }
  get value() { return this._attr('value', this.itemTitle); }
  get index() { return this._attr('index', ''); }
  get href() { return wSafeUrl(this._attr('href', '')); }
  get link() { return this._bool('link'); }
  get lines() { return this._attr('lines', ''); }
  get variant() { return this._attr('variant', ''); }
  get activeClass() { return this._attr('active-class', ''); }
  get active() { return this._bool('active'); }
  set active(value) {
    if (value) this.setAttribute('active', '');
    else this.removeAttribute('active');
  }

  _token(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // `active-class` adds the caller's own classes alongside the marker.
  _activeClassNames() {
    if (!this.active || !this.activeClass) return '';
    return ' ' + this.activeClass.split(/\s+/).map((name) => this._token(name)).filter(Boolean).join(' ');
  }

  _classes() {
    return 'w-file-upload-item' + this._cls({
      'w-file-upload-item--active': this.active,
      'w-file-upload-item--nav': this._bool('nav'),
      'w-file-upload-item--slim': this._bool('slim'),
      'w-file-upload-item--link': this.link || this.href,
      [`w-file-upload-item--${this._token(this.lines)}-line`]: this.lines && this.lines !== 'one',
      [`w-file-upload-item--variant-${this._token(this.variant)}`]: this.variant,
    }) + this._activeClassNames();
  }

  _rootAttrs(isLink) {
    return this._attrs({
      'data-index': this.index,
      'data-value': this.value,
      href: this.href,
      role: this.link && !isLink ? 'link' : 'listitem',
      tabindex: this.link && !isLink ? '0' : '',
      'aria-current': this.active && isLink ? 'page' : '',
      'aria-selected': this.active && !isLink ? 'true' : '',
    });
  }

  _style() {
    const gap = wCssLength(this._attr('prepend-gap', ''));
    return gap ? ` style="--w-file-upload-item-prepend-gap:${this._esc(gap)}"` : '';
  }

  // An image file shows a thumbnail; everything else falls back to `file-icon`.
  _previewSrc() {
    const file = this.file;
    const type = file ? String(file.type || '') : '';
    if (!type.startsWith('image/')) return '';
    return wSafeImageUrl(file.url || wObjectUrl(file));
  }

  _fileIconMarkup() {
    const preview = this._previewSrc();
    if (preview) return `<img class="w-file-upload-item-preview" src="${this._esc(preview)}" alt="">`;
    return wIconHtml(this, 'file-icon', 'w-file-upload-item-icon');
  }

  // An avatar wins over an icon on the same side; the leading side falls back
  // to the file's own preview or icon.
  _mediaMarkup(side) {
    const avatar = this._attr(side + '-avatar', '');
    if (avatar) return this._avatarMarkup(avatar);
    const icon = wIconHtml(this, side + '-icon', 'w-file-upload-item-icon');
    if (icon) return icon;
    return side === 'prepend' ? this._fileIconMarkup() : '';
  }

  _avatarMarkup(value) {
    const text = String(value);
    const looksLikeImage = /^(?:https?:|blob:|data:image\/|\/|\.\/|\.\.\/)/i.test(text);
    const image = looksLikeImage ? wSafeImageUrl(text) : '';
    const content = image
      ? `<img class="w-avatar-image" src="${this._esc(image)}" alt="">`
      : `<span class="w-avatar-text">${this._esc(text)}</span>`;
    return `<span class="w-avatar w-avatar-sm" role="img" aria-label="Avatar">${content}</span>`;
  }

  _adornment(side) {
    const media = this._mediaMarkup(side);
    if (!media && !this.querySelector(`[slot="${side}"]`)) return '';
    return `<span class="w-file-upload-item-${side}">${media}<slot name="${side}"></slot></span>`;
  }

  _contentMarkup() {
    const title = this.itemTitle ? `<span class="w-file-upload-item-name">${this._esc(this.itemTitle)}</span>` : '';
    const subtitle = this.subtitle ? `<span class="w-file-upload-item-subtitle">${this._esc(this.subtitle)}</span>` : '';
    return `<span class="w-file-upload-item-content">${title}${subtitle}<slot></slot></span>`;
  }

  _sizeMarkup() {
    const file = this.file;
    if (!this._bool('show-size') || !file || file.size == null) return '';
    return `<span class="w-file-upload-item-size">${this._esc(formatSize(file.size))}</span>`;
  }

  _removeMarkup() {
    if (!this._bool('clearable')) return '';
    const label = this.itemTitle || 'file';
    return `<button class="w-file-upload-item-remove" type="button" tabindex="0" aria-label="Remove ${this._esc(label)}">×</button>`;
  }

  _template() {
    const isLink = !!this.href;
    const tag = isLink ? 'a' : 'div';
    return `<${tag} class="${this._classes()}"${this._rootAttrs(isLink)}${this._style()}>
      ${this._adornment('prepend')}
      ${this._contentMarkup()}
      ${this._sizeMarkup()}
      ${this._adornment('append')}
      ${this._removeMarkup()}
    </${tag}>`;
  }

  _events() {
    const root = this._q('.w-file-upload-item');
    if (!root) return;
    if (this.hasAttribute('ripple')) this._attachRipple(root);

    // The remove control is a <button>, so Enter / Space reach it as clicks.
    const remove = this._q('.w-file-upload-item-remove');
    if (remove) {
      remove.addEventListener('click', (event) => {
        event.stopPropagation();
        this._emit('remove', this._detail());
      });
    }

    root.addEventListener('click', (event) => {
      if (event.target.closest('.w-file-upload-item-remove')) return;
      this._emit('change', this._detail());
    });
    root.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || !this.link) return;
      this._emit('change', this._detail());
    });
  }

  _detail() {
    return { value: this.value, index: this.index, title: this.itemTitle };
  }

  _refresh() {
    this._render();
    this._events();
    this._applyCommonProps();
  }
}

if (!customElements.get('w-file-upload-item')) {
  customElements.define('w-file-upload-item', WFileUploadItem);
}
