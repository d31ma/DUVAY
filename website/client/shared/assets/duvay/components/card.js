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
 *   ripple             - press-ripple visual on a clickable card
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
    'ripple',
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
  get isAction()      { return this._bool('link') && !this.isDisabled; }
  get isClickable()   { return this.isLink || this.isAction; }

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

  _events() {
    const card = this._q('.w-card');
    if (this.isAction) {
      card.addEventListener('keydown', (event) => this._activateActionFromKeyboard(event, card));
    }
    if (this.hasAttribute('ripple') && !this.isDisabled) this._attachRipple(card);
  }

  _activateActionFromKeyboard(event, card) {
    if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return;
    event.preventDefault();
    card.click();
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
    return 'w-card w-card--variant-' + this._variant() + this._cls({
      ['w-card--color-' + this.color]: this.color,
      'w-card--hover': this._bool('hover'),
      'w-card--link': this._bool('link') || this.isLink,
      'w-card--disabled': this.isDisabled,
      [this._roundedClass()]: this.hasAttribute('rounded'),
      'w-card--border': this.hasAttribute('border'),
      'w-card--tile': this.hasAttribute('tile'),
      ['w-card--density-' + this.getAttribute('density')]: this.getAttribute('density'),
      ['w-card--elevation-' + this.getAttribute('elevation')]: this.getAttribute('elevation'),
      'w-card--loading': this.hasAttribute('loading'),
    });
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

  _itemPrependTemplate() {
    if (!this.prependAvatar && !this.prependIcon && !this._hasSlot('prepend')) return '';
    return `<span class="w-card-item__prepend">${this._mediaTemplate('prepend')}<slot name="prepend"></slot></span>`;
  }

  _itemAppendTemplate() {
    if (!this.appendAvatar && !this.appendIcon && !this._hasSlot('append')) return '';
    return `<span class="w-card-item__append"><slot name="append"></slot>${this._mediaTemplate('append')}</span>`;
  }

  _itemTitleTemplate() {
    if (!this.title && !this._hasSlot('title')) return '';
    const inner = this.title ? this._esc(this.title) + '<slot name="title" hidden></slot>' : '<slot name="title"></slot>';
    return `<span class="w-card-title">${inner}</span>`;
  }

  _itemSubtitleTemplate() {
    if (!this.subtitle && !this._hasSlot('subtitle')) return '';
    const inner = this.subtitle ? this._esc(this.subtitle) + '<slot name="subtitle" hidden></slot>' : '<slot name="subtitle"></slot>';
    return `<span class="w-card-subtitle">${inner}</span>`;
  }

  _itemTemplate() {
    if (this._hasSlot('item')) return '<div class="w-card-item"><slot name="item"></slot></div>';
    const prepend = this._itemPrependTemplate();
    const title = this._itemTitleTemplate();
    const subtitle = this._itemSubtitleTemplate();
    const append = this._itemAppendTemplate();
    if (!prepend && !title && !subtitle && !append) return '';

    return `<div class="w-card-item">
      ${prepend}
      <span class="w-card-item__content">
        ${title}
        ${subtitle}
      </span>
      ${append}
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
