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
  get active() { return this._bool('active'); }
  set active(v) { v ? this.setAttribute('active', '') : this.removeAttribute('active'); }
  get disabled() { return this._bool('disabled'); }

  _template() {
    const tag = this.href && !this.disabled ? 'a' : 'button';
    const activeClass = this.active ? ' active' + (this.activeClass ? ' ' + this._classList(this.activeClass) : '') : '';
    const disabledClass = this.disabled ? ' disabled' : '';
    const linesClass = this.lines && this.lines !== 'one' ? ' w-list-item--' + this.lines + '-line' : '';
    const densityClass = this.density ? ' w-list-item--' + this.density : '';
    const variantClass = this.variant ? ' w-list-item--variant-' + this._classToken(this.variant) : '';
    const navClass = this.nav ? ' w-list-item--nav' : '';
    const slimClass = this.slim ? ' w-list-item--slim' : '';
    const roundedClass = this.rounded ? ' w-list-item--rounded' : '';
    const borderClass = this.border ? ' w-list-item--border' : '';
    const elevationClass = this.elevation ? ' w-list-item--elevation-' + this._classToken(this.elevation) : '';
    const style = this._style();
    const attrs = tag === 'a'
      ? ` href="${this._esc(this.href)}"${this.target ? ` target="${this._esc(this.target)}"` : ''}${this.rel ? ` rel="${this._esc(this.rel)}"` : ''}${this.active ? ' aria-current="page"' : ''}${this.disabled ? ' aria-disabled="true"' : ''}`
      : ` type="button"${this.disabled ? ' disabled' : ''}${this.active ? ' aria-pressed="true"' : ''}`;
    const tabAttr = this.tabindex ? ` tabindex="${this._esc(this.tabindex)}"` : '';
    const role = this.link && tag !== 'a' ? ' role="link"' : '';
    const prependMedia = this.prependAvatar ? this._avatar(this.prependAvatar, 'prepend') : this.prependIcon ? `<span class="w-list-item-icon" aria-hidden="true">${this._esc(this.prependIcon)}</span>` : '';
    const appendMedia = this.appendAvatar ? this._avatar(this.appendAvatar, 'append') : this.appendIcon ? `<span class="w-list-item-icon" aria-hidden="true">${this._esc(this.appendIcon)}</span>` : '';
    const prepend = prependMedia || this.querySelector('[slot="prepend"]')
      ? `<span class="w-list-item-prepend">${prependMedia}<slot name="prepend"></slot></span>`
      : '<span class="w-list-item-prepend" aria-hidden="true"></span>';
    const append = appendMedia || this.querySelector('[slot="append"]')
      ? `<span class="w-list-item-append">${appendMedia}<slot name="append"></slot></span>`
      : '<span class="w-list-item-append" aria-hidden="true"></span>';
    const content = this.itemTitle || this.subtitle
      ? `<span class="w-list-item-content">
          ${this.itemTitle ? `<span class="w-list-item-title">${this._esc(this.itemTitle)}</span>` : ''}
          ${this.subtitle ? `<span class="w-list-item-subtitle">${this._esc(this.subtitle)}</span>` : ''}
        </span>`
      : '<span class="w-list-item-content"><slot></slot></span>';

    return `<${tag} class="w-list-item${activeClass}${disabledClass}${linesClass}${densityClass}${variantClass}${navClass}${slimClass}${roundedClass}${borderClass}${elevationClass}"${attrs}${tabAttr}${role}${style}>
      ${prepend}${content}${append}
    </${tag}>`;
  }

  _events() {
    const control = this._q('.w-list-item');
    if (!control || this.disabled) return;

    control.addEventListener('click', () => {
      this._emit('change', { value: this.value, title: this.itemTitle });
    });

    control.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
      event.preventDefault();
      control.click();
    });
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
