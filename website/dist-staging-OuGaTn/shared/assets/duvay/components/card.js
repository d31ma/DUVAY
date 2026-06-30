/* <w-card> - Card container web component
 *
 * Attributes:
 *   title/subtitle/text - generated card item and body text
 *   image              - top image URL
 *   prepend-avatar     - leading avatar URL
 *   prepend-icon       - leading icon text/glyph
 *   append-avatar      - trailing avatar URL
 *   append-icon        - trailing icon text/glyph
 *   href               - render card root as a link
 *   target/rel         - link attributes
 *   link               - force clickable/card link styling
 *   hover              - hover elevation treatment
 *   disabled           - disables link/click affordance
 *   flat               - alias for variant="flat"
 *   variant            - elevated | flat | tonal | outlined | text | plain
 *   color              - primary | secondary | tertiary | success | warning | error | danger
 *   loading            - true or color token for top loader
 *   header/footer      - legacy generated header/footer support
 *
 * Slots:
 *   default, image, item, prepend, title, subtitle, append, text, actions, header, footer, loader
 */

class WCard extends WElement {

  static attrs = [
    'header',
    'footer',
    'title',
    'subtitle',
    'text',
    'image',
    'prepend-avatar',
    'prepend-icon',
    'append-avatar',
    'append-icon',
    'href',
    'target',
    'rel',
    'link',
    'hover',
    'disabled',
    'flat',
    'variant',
    'color',
    'loading',
    'rounded',
    'border',
    'tile',
    'density',
    'elevation',
    'width',
    'height',
    'min-width',
    'max-width',
    'position',
    'location',
  ];

  static colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'danger', 'info'];
  static variants = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'];

  get header()        { return this._attr('header', ''); }
  get title()         { return this._attr('title', this.header); }
  get subtitle()      { return this._attr('subtitle', ''); }
  get text()          { return this._attr('text', ''); }
  get image()         { return this._attr('image', ''); }
  get prependAvatar() { return this._attr('prepend-avatar', ''); }
  get prependIcon()   { return this._attr('prepend-icon', ''); }
  get appendAvatar()  { return this._attr('append-avatar', ''); }
  get appendIcon()    { return this._attr('append-icon', ''); }
  get href()          { return this._attr('href', ''); }
  get target()        { return this._attr('target', ''); }
  get rel()           { return this._attr('rel', ''); }
  get color()         { return this._normalizeColor(this._attr('color', '')); }
  get loading()       { return this.getAttribute('loading'); }
  get isDisabled()    { return this._bool('disabled'); }
  get isLink()        { return !!this.href && !this.isDisabled; }
  get isClickable()   { return !this.isDisabled && (this._bool('link') || this._bool('hover') || !!this.href); }

  _template() {
    const tag = this.isLink ? 'a' : 'div';
    const attrs = this._rootAttrs();
    const classes = this._cardClass();
    return `<${tag} class="${classes}"${attrs}>
      ${this._loaderTemplate()}
      ${this._imageTemplate()}
      <div class="w-card__content">
        ${this._legacyHeaderTemplate()}
        ${this._itemTemplate()}
        ${this._textTemplate()}
        ${this._defaultTemplate()}
        ${this._actionsTemplate()}
        ${this._legacyFooterTemplate()}
      </div>
      <span class="w-card__overlay" aria-hidden="true"></span>
    </${tag}>`;
  }

  _rootAttrs() {
    const attrs = [];
    if (this.isLink) {
      attrs.push(` href="${this._esc(this.href)}"`);
      if (this.target) attrs.push(` target="${this._esc(this.target)}"`);
      if (this.rel) attrs.push(` rel="${this._esc(this.rel)}"`);
    }
    if (this.isClickable && !this.isLink) attrs.push(' role="button" tabindex="0"');
    if (this.isDisabled) attrs.push(' aria-disabled="true"');
    return attrs.join('');
  }

  _cardClass() {
    return [
      'w-card',
      'w-card--variant-' + this._variant(),
      this.color ? 'w-card--color-' + this.color : '',
      this._bool('hover') ? 'w-card--hover' : '',
      this._bool('link') || this.isLink ? 'w-card--link' : '',
      this.isDisabled ? 'w-card--disabled' : '',
      this.hasAttribute('rounded') ? this._roundedClass() : '',
      this.hasAttribute('border') ? 'w-card--border' : '',
      this.hasAttribute('tile') ? 'w-card--tile' : '',
      this.getAttribute('density') ? 'w-card--density-' + this.getAttribute('density') : '',
      this.getAttribute('elevation') ? 'w-card--elevation-' + this.getAttribute('elevation') : '',
      this.hasAttribute('loading') ? 'w-card--loading' : '',
    ].filter(Boolean).join(' ');
  }

  _loaderTemplate() {
    if (!this.hasAttribute('loading')) return '';
    if (this._hasSlot('loader')) return '<div class="w-card__loader"><slot name="loader"></slot></div>';
    const color = this.loading && this.loading !== 'true' ? this._normalizeColor(this.loading) : this.color;
    const colorClass = color ? ' w-card__loader-bar--' + color : '';
    return `<div class="w-card__loader" aria-hidden="true"><span class="w-card__loader-bar${colorClass}"></span></div>`;
  }

  _imageTemplate() {
    if (this._hasSlot('image')) return '<div class="w-card__image"><slot name="image"></slot></div>';
    if (!this.image) return '';
    return `<div class="w-card__image"><img src="${this._esc(this.image)}" alt=""></div>`;
  }

  _legacyHeaderTemplate() {
    if (!this._hasSlot('header')) return '';
    return '<div class="w-card-header"><slot name="header"></slot></div>';
  }

  _legacyFooterTemplate() {
    if (!this._hasSlot('footer') && !this.hasAttribute('footer')) return '';
    return '<div class="w-card-footer"><slot name="footer"></slot></div>';
  }

  _itemTemplate() {
    if (this._hasSlot('item')) return '<div class="w-card-item"><slot name="item"></slot></div>';
    const hasTitle = this.title || this._hasSlot('title');
    const hasSubtitle = this.subtitle || this._hasSlot('subtitle');
    const hasPrepend = this.prependAvatar || this.prependIcon || this._hasSlot('prepend');
    const hasAppend = this.appendAvatar || this.appendIcon || this._hasSlot('append');
    if (!hasTitle && !hasSubtitle && !hasPrepend && !hasAppend) return '';

    return `<div class="w-card-item">
      ${hasPrepend ? `<span class="w-card-item__prepend">${this._mediaTemplate('prepend')}<slot name="prepend"></slot></span>` : ''}
      <span class="w-card-item__content">
        ${hasTitle ? `<span class="w-card-title">${this.title ? this._esc(this.title) + '<slot name="title" hidden></slot>' : '<slot name="title"></slot>'}</span>` : ''}
        ${hasSubtitle ? `<span class="w-card-subtitle">${this.subtitle ? this._esc(this.subtitle) + '<slot name="subtitle" hidden></slot>' : '<slot name="subtitle"></slot>'}</span>` : ''}
      </span>
      ${hasAppend ? `<span class="w-card-item__append"><slot name="append"></slot>${this._mediaTemplate('append')}</span>` : ''}
    </div>`;
  }

  _mediaTemplate(side) {
    const avatar = side === 'prepend' ? this.prependAvatar : this.appendAvatar;
    const icon = side === 'prepend' ? this.prependIcon : this.appendIcon;
    if (avatar) return `<span class="w-avatar w-avatar--small"><img src="${this._esc(avatar)}" alt=""></span>`;
    if (icon) return `<span class="w-card-icon" aria-hidden="true">${this._esc(icon)}</span>`;
    return '';
  }

  _textTemplate() {
    if (this._hasSlot('text')) return '<div class="w-card-text"><slot name="text"></slot></div>';
    if (this.text) return `<div class="w-card-text">${this._esc(this.text)}<slot name="text" hidden></slot></div>`;
    return '';
  }

  _actionsTemplate() {
    return this._hasSlot('actions') ? '<div class="w-card-actions"><slot name="actions"></slot></div>' : '';
  }

  _defaultTemplate() {
    if (!this._hasDefaultSlot()) return '<slot hidden></slot>';
    return this._hasStructuredDefault()
      ? '<slot></slot>'
      : '<div class="w-card-body"><slot></slot></div>';
  }

  _variant() {
    if (this._bool('flat')) return 'flat';
    const variant = this._attr('variant', 'elevated');
    return this.constructor.variants.includes(variant) ? variant : 'elevated';
  }

  _roundedClass() {
    const value = this.getAttribute('rounded');
    if (!value || value === 'true') return 'w-card--rounded';
    return 'w-card--rounded-' + value;
  }

  _normalizeColor(value) {
    const token = String(value || '').toLowerCase();
    if (!token) return '';
    if (token === 'danger') return 'error';
    if (token === 'info') return 'primary';
    return this.constructor.colors.includes(token) ? token : 'primary';
  }

  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }

  _hasDefaultSlot() {
    return this._defaultNodes().some((node) => this._hasMeaningfulNode(node));
  }

  _hasStructuredDefault() {
    return this._defaultNodes().some((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE || node.hasAttribute('slot')) return false;
      const tag = node.tagName.toLowerCase();
      if (tag.indexOf('w-card-') === 0) return true;
      return Array.from(node.classList || []).some((name) => name.indexOf('w-card-') === 0);
    });
  }

  _defaultNodes() {
    const currentSlot = this.querySelector('slot:not([name])');
    if (currentSlot) return Array.from(currentSlot.childNodes);
    return Array.from(this.childNodes).filter((node) => {
      return !(node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('slot'));
    });
  }

  _hasMeaningfulNode(node) {
    return node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  }

}

if (!customElements.get('w-card')) {
  customElements.define('w-card', WCard);
}
