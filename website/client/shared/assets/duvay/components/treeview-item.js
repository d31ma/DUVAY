/* <w-treeview-item> — a single tree row (DuVay equivalent of Vuetify v-treeview-item)
 *
 * A treeview item is a list item plus tree state, so it shares the list-item
 * surface (title/subtitle, prepend/append media, lines, density, variant)
 * and adds the tree-only bits: a toggle glyph and indent-line guides.
 *
 * Attributes:
 *   title / subtitle    - primary and secondary text
 *   value               - selection value, mirrored onto `data-value`
 *   index               - position in the tree, mirrored onto `aria-posinset`
 *   href / to           - renders the row as an anchor
 *   link                - marks a non-anchor row as interactive
 *   active              - highlighted state (`aria-selected="true"`)
 *   active-class        - extra class applied while active
 *   nav / slim / variant / lines - list-item styling knobs
 *   prepend-icon / append-icon   - leading and trailing glyphs
 *   prepend-avatar / append-avatar - leading and trailing avatars
 *   prepend-gap         - horizontal gap between prepend and content
 *   has-custom-prepend  - keeps the prepend area even without media
 *   toggle-icon         - branch expand/collapse glyph
 *   hide-actions        - drops the toggle glyph
 *   indent-lines        - JSON/CSV list of leaf | none | line | last-leaf | leaf-link
 *   ripple              - press ripple
 *   disabled            - disables interaction
 *
 * Slots:
 *   default - row content when title is omitted
 *   prepend - custom leading content
 *   append  - custom trailing content
 *
 * Events:
 *   change - fires on activation (detail: { value, title })
 */

import { wValueList } from './utils.js';

const TREEVIEW_LINE_KINDS = ['leaf', 'none', 'line', 'last-leaf', 'leaf-link'];

export class WTreeviewItem extends WElement {

  static attrs = [
    'title', 'subtitle', 'value', 'index',
    'href', 'to', 'target', 'rel', 'link',
    'active', 'active-class', 'nav', 'slim', 'lines', 'variant',
    'prepend-icon', 'append-icon', 'prepend-avatar', 'append-avatar',
    'prepend-gap', 'has-custom-prepend', 'toggle-icon', 'hide-actions',
    'indent-lines', 'ripple', 'disabled',
  ];

  get itemTitle() { return this._attr('title', ''); }
  get subtitle() { return this._attr('subtitle', ''); }
  get value() { return this._attr('value', this.itemTitle); }
  get index() { return this._attr('index', ''); }
  get href() { return this._attr('href', this._attr('to', '')); }
  get link() { return this._bool('link'); }
  get active() { return this._bool('active'); }
  get activeClass() { return this._attr('active-class', ''); }
  get nav() { return this._bool('nav'); }
  get slim() { return this._bool('slim'); }
  get lines() { return this._attr('lines', ''); }
  get variant() { return this._attr('variant', ''); }
  get prependIcon() { return this._attr('prepend-icon', ''); }
  get appendIcon() { return this._attr('append-icon', ''); }
  get prependAvatar() { return this._attr('prepend-avatar', ''); }
  get appendAvatar() { return this._attr('append-avatar', ''); }
  get hasCustomPrepend() { return this._bool('has-custom-prepend'); }
  get toggleIcon() { return this._attr('toggle-icon', ''); }
  get hideActions() { return this._bool('hide-actions'); }
  get disabled() { return this._bool('disabled'); }

  get indentLines() {
    return wValueList(this._attr('indent-lines', ''))
      .filter((kind) => TREEVIEW_LINE_KINDS.includes(kind));
  }

  _template() {
    const tag = this.href && !this.disabled ? 'a' : 'div';
    return `<${tag} class="${this._classes()}"${this._hostAttrs(tag)}${this._style()}>`
      + this._linesHtml()
      + this._toggleHtml()
      + this._adornment('prepend')
      + this._contentHtml()
      + this._adornment('append')
      + `</${tag}>`;
  }

  _classes() {
    return 'w-treeview-item' + this._cls({
      active: this.active,
      disabled: this.disabled,
      ['w-treeview-item--' + this.lines + '-line']: this.lines && this.lines !== 'one',
      ['w-treeview-item--variant-' + this._classToken(this.variant)]: this.variant,
      'w-treeview-item--nav': this.nav,
      'w-treeview-item--slim': this.slim,
      'w-treeview-item--link': this.link || this.href,
      'w-treeview-item--hide-actions': this.hideActions,
      'w-treeview-item--custom-prepend': this.hasCustomPrepend,
    }) + this._activeClassSuffix();
  }

  _activeClassSuffix() {
    if (!this.active || !this.activeClass) return '';
    return ' ' + this._classList(this.activeClass);
  }

  _hostAttrs(tag) {
    const anchor = tag === 'a';
    return this._attrs({
      role: anchor ? '' : (this.link ? 'link' : 'treeitem'),
      href: anchor ? this.href : '',
      target: anchor ? this._attr('target', '') : '',
      rel: anchor ? this._attr('rel', '') : '',
      'data-value': this.value,
      'data-index': this.index,
      'aria-posinset': this.index,
      'aria-selected': this.active ? 'true' : '',
      'aria-disabled': this.disabled ? 'true' : '',
      tabindex: this.disabled ? '' : '0',
    });
  }

  _style() {
    const gap = this._size(this._attr('prepend-gap', ''));
    return gap ? ` style="--w-treeview-item-prepend-gap: ${this._esc(gap)}"` : '';
  }

  _size(value) {
    if (!value) return '';
    return /^-?\d+(\.\d+)?$/.test(String(value)) ? String(value) + 'px' : String(value);
  }

  // The guide column the parent tree asks for, one span per hop.
  _linesHtml() {
    const kinds = this.indentLines;
    if (!kinds.length) return '';
    const spans = kinds.map((kind) => (
      `<span class="w-treeview-indent-line w-treeview-indent-line--${kind}"></span>`
    )).join('');
    return `<span class="w-treeview-item-lines" aria-hidden="true">${spans}</span>`;
  }

  _toggleHtml() {
    if (this.hideActions || !this.toggleIcon) return '';
    return '<button class="w-treeview-item-toggle" type="button" tabindex="-1"'
      + ` aria-label="Toggle ${this._esc(this.itemTitle)}">${this._esc(this.toggleIcon)}</button>`;
  }

  // An avatar wins over an icon on the same side.
  _mediaMarkup(side) {
    const avatar = side === 'prepend' ? this.prependAvatar : this.appendAvatar;
    if (avatar) return this._avatar(avatar, side);
    const icon = side === 'prepend' ? this.prependIcon : this.appendIcon;
    return icon ? `<span class="w-treeview-item-icon" aria-hidden="true">${this._esc(icon)}</span>` : '';
  }

  _adornment(side) {
    const media = this._mediaMarkup(side);
    const forced = side === 'prepend' && this.hasCustomPrepend;
    if (media || forced || this.querySelector(`[slot="${side}"]`)) {
      return `<span class="w-treeview-item-${side}">${media}<slot name="${side}"></slot></span>`;
    }
    return `<span class="w-treeview-item-${side}" aria-hidden="true"></span>`;
  }

  _contentHtml() {
    const title = this.itemTitle
      ? `<span class="w-treeview-item-title">${this._esc(this.itemTitle)}</span>` : '';
    const subtitle = this.subtitle
      ? `<span class="w-treeview-item-subtitle">${this._esc(this.subtitle)}</span>` : '';
    return `<span class="w-treeview-item-content">${title}${subtitle}<slot></slot></span>`;
  }

  _avatar(value, position) {
    const text = String(value);
    const isImage = /^(https?:|\/|\.\/|\.\.\/|data:image\/)/.test(text);
    const label = position === 'prepend' ? this.itemTitle || 'Avatar' : 'Avatar';
    const content = isImage
      ? `<img class="w-avatar-image" src="${this._esc(text)}" alt="${this._esc(label)}">`
      : `<span class="w-avatar-text">${this._esc(text)}</span>`;
    return `<span class="w-avatar w-avatar-sm w-treeview-item-avatar" role="img" aria-label="${this._esc(label)}">${content}</span>`;
  }

  _events() {
    const root = this._q('.w-treeview-item');
    if (!root || this.disabled) return;
    if (this.hasAttribute('ripple')) this._attachRipple(root);

    root.addEventListener('click', () => {
      this._emit('change', { value: this.value, title: this.itemTitle });
    });

    root.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
      event.preventDefault();
      root.click();
    });
  }

  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  }

  _classList(value) {
    return String(value).split(/\s+/).map((entry) => this._classToken(entry)).filter(Boolean).join(' ');
  }
}

if (!customElements.get('w-treeview-item')) {
  customElements.define('w-treeview-item', WTreeviewItem);
}
