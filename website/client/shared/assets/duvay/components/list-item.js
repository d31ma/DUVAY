/* <w-list-item> — List item web component
 *
 * Attributes:
 *   title        - primary text
 *   subtitle     - secondary text
 *   value        - value emitted when selected
 *   href / to    - renders as a link when set
 *   link         - marks the row as interactive
 *   prepend-icon - leading icon text / glyph
 *   append-icon  - trailing icon text / glyph
 *   prepend-avatar - leading avatar image URL or initials
 *   append-avatar  - trailing avatar image URL or initials
 *   lines        - one | two | three (omit for inherited/default density)
 *   density      - compact | comfortable (omit for inherited/default density)
 *   variant      - text | plain | tonal | outlined
 *   slim         - lower-padding list item
 *   nav          - navigation styling for standalone items
 *   active-class - extra class when active
 *   active       - selected state
 *   disabled     - disables interaction
 *
 * Slots:
 *   default - custom item content when title is omitted
 *   prepend - custom leading content
 *   append  - custom trailing content
 *
 * Events:
 *   change - fires on activation (detail: { value, title })
 */

class WListItem extends WElement {

  static attrs = [
    'title',
    'subtitle',
    'value',
    'href',
    'to',
    'target',
    'rel',
    'link',
    'prepend-icon',
    'append-icon',
    'prepend-avatar',
    'append-avatar',
    'lines',
    'density',
    'variant',
    'active-class',
    'tabindex',
    'active',
    'disabled',
    'nav',
    'slim',
    'rounded',
    'border',
    'elevation',
    'ripple',
    'prepend-gap',
    'index',
  ];

  get itemTitle() { return this._attr('title', ''); }
  get subtitle() { return this._attr('subtitle', ''); }
  get value() { return this._attr('value', this.itemTitle); }
  get href() { return this._attr('href', this._attr('to', '')); }
  get target() { return this._attr('target', ''); }
  get rel() { return this._attr('rel', ''); }
  get link() { return this._bool('link'); }
  get prependIcon() { return this._attr('prepend-icon', ''); }
  get appendIcon() { return this._attr('append-icon', ''); }
  get prependAvatar() { return this._attr('prepend-avatar', ''); }
  get appendAvatar() { return this._attr('append-avatar', ''); }
  get lines() { return this._attr('lines', ''); }
  get density() { return this._attr('density', ''); }
  get variant() { return this._attr('variant', 'text'); }
  get activeClass() { return this._attr('active-class', ''); }
  get tabindex() { return this._attr('tabindex', ''); }
  get nav() { return this._bool('nav'); }
  get slim() { return this._bool('slim'); }
  get rounded() { return this.hasAttribute('rounded'); }
  get border() { return this._bool('border'); }
  get elevation() { return this._attr('elevation', ''); }
  get prependGap() { return this._attr('prepend-gap', ''); }
  get itemIndex() { return this._attr('index', ''); }
  get active() { return this._bool('active'); }
  set active(v) { v ? this.setAttribute('active', '') : this.removeAttribute('active'); }
  get disabled() { return this._bool('disabled'); }

  // `active` carries the caller's own active-class list alongside the marker.
  get _activeClass() {
    if (!this.active) return '';
    return ' active' + (this.activeClass ? ' ' + this._classList(this.activeClass) : '');
  }

  // `one` is the default line count, so it needs no modifier.
  get _linesClass() {
    return this.lines && this.lines !== 'one' ? ' w-list-item--' + this.lines + '-line' : '';
  }

  _classes() {
    return 'w-list-item' + this._activeClass
      + this._cls({ disabled: this.disabled })
      + this._linesClass
      + (this.density ? ' w-list-item--' + this.density : '')
      + (this.variant ? ' w-list-item--variant-' + this._classToken(this.variant) : '')
      + this._cls({
        'w-list-item--nav': this.nav,
        'w-list-item--slim': this.slim,
        'w-list-item--rounded': this.rounded,
        'w-list-item--border': this.border,
      })
      + (this.elevation ? ' w-list-item--elevation-' + this._classToken(this.elevation) : '');
  }

  _controlAttrs(tag) {
    if (tag === 'a') {
      return this._attrs({
        href: this.href,
        target: this.target,
        rel: this.rel,
        'aria-current': this.active && 'page',
        'aria-disabled': this.disabled && 'true',
      });
    }
    return this._attrs({
      type: 'button',
      disabled: this.disabled,
      'aria-pressed': this.active && 'true',
    });
  }

  // An avatar wins over an icon on the same side.
  _mediaMarkup(side) {
    const avatar = side === 'prepend' ? this.prependAvatar : this.appendAvatar;
    if (avatar) return this._avatar(avatar, side);
    const icon = side === 'prepend' ? this.prependIcon : this.appendIcon;
    return icon ? `<span class="w-list-item-icon" aria-hidden="true">${this._esc(icon)}</span>` : '';
  }

  // Without media or slotted content the adornment stays as an empty spacer.
  _adornment(side) {
    const media = this._mediaMarkup(side);
    if (media || this.querySelector(`[slot="${side}"]`)) {
      return `<span class="w-list-item-${side}">${media}<slot name="${side}"></slot></span>`;
    }
    return `<span class="w-list-item-${side}" aria-hidden="true"></span>`;
  }

  _contentMarkup() {
    if (!this.itemTitle && !this.subtitle) return '<span class="w-list-item-content"><slot></slot></span>';
    return `<span class="w-list-item-content">
          ${this.itemTitle ? `<span class="w-list-item-title">${this._esc(this.itemTitle)}</span>` : ''}
          ${this.subtitle ? `<span class="w-list-item-subtitle">${this._esc(this.subtitle)}</span>` : ''}
        </span>`;
  }

  _template() {
    const tag = this.href && !this.disabled ? 'a' : 'button';
    const attrs = this._controlAttrs(tag);
    const tabAttr = this._attrs({ tabindex: this.tabindex, 'aria-posinset': this.itemIndex });
    const role = this.link && tag !== 'a' ? ' role="link"' : '';

    return `<${tag} class="${this._classes()}"${attrs}${tabAttr}${role}${this._style()}>
      ${this._adornment('prepend')}${this._contentMarkup()}${this._adornment('append')}
    </${tag}>`;
  }

  _events() {
    const control = this._q('.w-list-item');
    if (!control || this.disabled) return;

    if (this.hasAttribute('ripple')) this._attachRipple(control);

    control.addEventListener('click', () => {
      this._emit('change', this._changeDetail());
    });

    control.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
      event.preventDefault();
      control.click();
    });
  }

  // `index` only rides along when the author set it, so the default payload
  // stays exactly { value, title }.
  _changeDetail() {
    const detail = { value: this.value, title: this.itemTitle };
    if (this.itemIndex !== '') detail.index = Number(this.itemIndex);
    return detail;
  }

  _avatar(value, position) {
    const text = String(value);
    const isImage = /^(https?:|\/|\.\/|\.\.\/|data:image\/)/.test(text);
    const label = position === 'prepend' ? this.itemTitle || 'Avatar' : 'Avatar';
    const content = isImage
      ? `<img class="w-avatar-image" src="${this._esc(text)}" alt="${this._esc(label)}">`
      : `<span class="w-avatar-text">${this._esc(text)}</span>`;
    return `<span class="w-avatar w-avatar-sm w-list-item-avatar" role="img" aria-label="${this._esc(label)}">${content}<span class="w-avatar-underlay" aria-hidden="true"></span></span>`;
  }

  _style() {
    const styles = [];
    if (this.hasAttribute('color')) styles.push(['--w-list-item-accent', 'var(--w-' + this._classToken(this._attr('color', '')) + ')']);
    if (this.hasAttribute('base-color')) styles.push(['--w-list-item-base', 'var(--w-' + this._classToken(this._attr('base-color', '')) + ')']);
    if (this.hasAttribute('active-color')) styles.push(['--w-list-item-active', 'var(--w-' + this._classToken(this._attr('active-color', '')) + ')']);
    if (this.prependGap) styles.push(['--w-list-prepend-gap', this.prependGap]);
    return styles.length ? ` style="${styles.map(([name, value]) => `${name}: ${this._esc(value)}`).join('; ')}"` : '';
  }

  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  }

  _classList(value) {
    return String(value).split(/\s+/).map((entry) => this._classToken(entry)).filter(Boolean).join(' ');
  }
}

customElements.define('w-list-item', WListItem);
