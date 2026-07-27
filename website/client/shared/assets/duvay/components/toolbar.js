/* <w-toolbar> — DuVay component module
 *
 * Vuetify parity attributes:
 *   title             - text title rendered as .w-toolbar-title
 *   flat              - removes the toolbar shadow
 *   absolute          - position: absolute against the offset parent
 *   floating          - display: inline-flex, so the bar hugs its content
 *   image             - background image URL
 *   collapse          - collapsed (reduced max-width) state
 *   collapse-position - start (default) | end; side the collapsed bar attaches to
 *   extended          - renders the `extension` slot below the bar
 *   extension-height  - height of the extension area (default 48px)
 *
 * Slots:
 *   default, extension
 */

export class WToolbar extends WElement {
  static attrs = [
    'title',
    'flat',
    'absolute',
    'floating',
    'image',
    'collapse',
    'collapse-position',
    'extended',
    'extension-height',
  ];

  get toolbarTitle() { return this._attr('title', ''); }
  get flat() { return this._bool('flat'); }
  get absolute() { return this._bool('absolute'); }
  get floating() { return this._bool('floating'); }
  get image() { return this._attr('image', ''); }
  get collapse() { return this._bool('collapse'); }
  get collapsePosition() { return this._attr('collapse-position', 'start'); }
  get extended() { return this._bool('extended'); }
  get extensionHeight() { return this._attr('extension-height', '48'); }

  _template() {
    const title = this.toolbarTitle
      ? `<strong class="w-toolbar-title">${this._esc(this.toolbarTitle)}</strong>`
      : '';
    const extension = this.extended
      ? `<div class="w-toolbar-extension"${this._extensionStyle()}><slot name="extension"></slot></div>`
      : '<slot name="extension" hidden></slot>';

    return `<div class="${this._classes()}"${this._styleAttr()}>${title}<slot></slot></div>${extension}`;
  }

  _classes() {
    return 'w-toolbar' + this._cls({
      'w-toolbar--flat': this.flat,
      'w-toolbar--absolute': this.absolute,
      'w-toolbar--floating': this.floating,
      'w-toolbar--image': this.image,
      'w-toolbar--collapse': this.collapse,
      'w-toolbar--collapse-end': this.collapse && this.collapsePosition === 'end',
      'w-toolbar--extended': this.extended,
    });
  }

  _styleAttr() {
    if (!this.image) return '';
    return ' style="--w-toolbar-image: url(' + this._esc(this.image) + ');"';
  }

  _extensionStyle() {
    if (!this.extensionHeight) return '';
    return ' style="--w-toolbar-extension-height: ' + this._length(this.extensionHeight) + ';"';
  }

  _length(value) {
    return isNaN(value) ? this._esc(value) : value + 'px';
  }
}

if (!customElements.get('w-toolbar')) customElements.define('w-toolbar', WToolbar);
