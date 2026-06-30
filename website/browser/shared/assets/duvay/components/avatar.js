/* <w-avatar> - Avatar / user initials or image web component
 *
 * Attributes:
 *   image/src       - image URL
 *   alt             - alt text for image or text fallback
 *   text/initials   - text fallback when no image/icon/default slot is set
 *   icon            - icon text/glyph fallback
 *   size            - x-small | small | default | large | x-large | xs | sm | md | lg | xl | CSS length
 *   variant         - flat | tonal | outlined | text | plain | elevated
 *   color           - primary | secondary | tertiary | success | warning | error | danger
 *   badge           - true, color name, or status dot color
 *   badge-color     - primary | success | warning | error | danger
 *   badge-content   - text inside the badge
 *   badge-location  - top-end | top-start | bottom-end | bottom-start
 *   badge-floating  - offset badge outside the avatar edge
 *   status          - online | away | busy legacy status indicator
 *   start/end       - inline spacing helpers
 *
 * Slots:
 *   default - custom avatar content
 *   badge   - custom badge content
 */

class WAvatar extends WElement {

  static attrs = [
    'src',
    'image',
    'alt',
    'size',
    'initials',
    'text',
    'icon',
    'variant',
    'color',
    'badge',
    'badge-color',
    'badge-content',
    'badge-location',
    'badge-floating',
    'badge-dot',
    'status',
    'start',
    'end',
    'rounded',
    'border',
    'tile',
    'density',
    'elevation',
  ];

  static sizeAliases = {
    xs: 'x-small',
    sm: 'small',
    md: 'default',
    lg: 'large',
    xl: 'x-large',
  };

  static sizes = ['x-small', 'small', 'default', 'large', 'x-large'];
  static variants = ['flat', 'tonal', 'outlined', 'text', 'plain', 'elevated'];
  static colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'danger', 'info'];
  static badgeLocations = {
    'top-end': 'top-end',
    'top end': 'top-end',
    'top-right': 'top-end',
    'top-start': 'top-start',
    'top start': 'top-start',
    'top-left': 'top-start',
    'bottom-end': 'bottom-end',
    'bottom end': 'bottom-end',
    'bottom-right': 'bottom-end',
    'bottom-start': 'bottom-start',
    'bottom start': 'bottom-start',
    'bottom-left': 'bottom-start',
  };

  get image()        { return this._attr('image', this._attr('src', '')); }
  get alt()          { return this._attr('alt', this.text || this.icon || 'Avatar'); }
  get text()         { return this._attr('text', this._attr('initials', '')); }
  get icon()         { return this._attr('icon', ''); }
  get size()         { return this._attr('size', 'default'); }
  get variant()      { return this._attr('variant', 'flat'); }
  get color()        { return this._normalizeColor(this._attr('color', 'primary')); }
  get badge()        { return this.getAttribute('badge'); }
  get badgeColor()   { return this._normalizeColor(this._attr('badge-color', this._badgeAttrColor())); }
  get badgeContent() { return this._attr('badge-content', ''); }
  get badgeLocation(){ return this._attr('badge-location', 'top-end'); }
  get status()       { return this._attr('status', ''); }
  get start()        { return this._bool('start'); }
  get end()          { return this._bool('end'); }

  _template() {
    const sizeClass = this._sizeClass();
    const customSize = this._customSize();
    const variant = this._variant();
    const classes = [
      'w-avatar',
      sizeClass,
      'w-avatar--variant-' + variant,
      'w-avatar--color-' + this.color,
      this.start ? 'w-avatar--start' : '',
      this.end ? 'w-avatar--end' : '',
      this.hasAttribute('rounded') ? this._roundedClass() : '',
      this.hasAttribute('border') ? 'w-avatar--border' : '',
      this.hasAttribute('tile') ? 'w-avatar--tile' : '',
      this.getAttribute('density') ? 'w-avatar--density-' + this.getAttribute('density') : '',
      this.getAttribute('elevation') ? 'w-avatar--elevation-' + this.getAttribute('elevation') : '',
    ].filter(Boolean).join(' ');
    const style = customSize ? ` style="--w-avatar-size: ${customSize}"` : '';
    const content = this._contentTemplate();
    const avatar = `<span class="${classes}" role="img" aria-label="${this._esc(this.alt)}"${style}>${content}<span class="w-avatar-underlay" aria-hidden="true"></span></span>`;

    if (!this._hasBadge()) return avatar;

    return `<span class="w-avatar-wrap${this._badgeFloatingClass()}">${avatar}${this._badgeTemplate()}</span>`;
  }

  _contentTemplate() {
    if (this._hasDefaultSlot()) return '<slot></slot>';
    const preserveDefaultSlot = '<slot hidden></slot>';
    if (this.image) return `<img class="w-avatar-image" src="${this._esc(this.image)}" alt="${this._esc(this.alt)}">${preserveDefaultSlot}`;
    if (this.icon) return `<span class="w-avatar-icon" aria-hidden="true">${this._esc(this.icon)}</span>${preserveDefaultSlot}`;
    if (this.text) return `<span class="w-avatar-text">${this._esc(this.text)}</span>${preserveDefaultSlot}`;
    return '<slot></slot>';
  }

  _badgeTemplate() {
    const location = this._badgeLocation();
    const dot = this._bool('badge-dot') || (!this.badgeContent && !this._hasSlot('badge'));
    const dotClass = dot ? ' w-avatar-badge--dot' : '';
    const content = this._hasSlot('badge') ? '<slot name="badge"></slot>' : this._esc(this.badgeContent);

    return `<span class="w-avatar-badge w-avatar-badge--${location} w-avatar-badge--${this.badgeColor}${dotClass}" aria-label="${this._esc(this.badgeContent || this.badgeColor + ' badge')}">${content}</span>`;
  }

  _hasBadge() {
    return this.hasAttribute('badge') || this.badgeContent || this.hasAttribute('badge-color') || this.status || this._hasSlot('badge');
  }

  _badgeFloatingClass() {
    return this._bool('badge-floating') ? ' w-avatar-wrap--floating' : '';
  }

  _badgeLocation() {
    return this.constructor.badgeLocations[String(this.badgeLocation || '').toLowerCase()] || 'top-end';
  }

  _badgeAttrColor() {
    const badge = this.badge;
    if (badge && badge !== '' && badge !== 'true') return badge;
    if (this.status === 'online') return 'success';
    if (this.status === 'away') return 'warning';
    if (this.status === 'busy') return 'error';
    return 'primary';
  }

  _sizeClass() {
    const normalized = this._normalizedSize();
    return this.constructor.sizes.includes(normalized) ? 'w-avatar--' + normalized : '';
  }

  _normalizedSize() {
    const size = String(this.size || 'default').toLowerCase();
    return this.constructor.sizeAliases[size] || size;
  }

  _customSize() {
    const size = String(this.size || '').trim();
    if (!size || this.constructor.sizes.includes(this._normalizedSize())) return '';
    if (/^\d+(\.\d+)?$/.test(size)) return size + 'px';
    if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(size)) return size;
    return '';
  }

  _variant() {
    return this.constructor.variants.includes(this.variant) ? this.variant : 'flat';
  }

  _roundedClass() {
    const value = this.getAttribute('rounded');
    if (!value || value === 'true') return 'w-avatar--rounded';
    return 'w-avatar--rounded-' + value;
  }

  _normalizeColor(value) {
    const token = String(value || '').toLowerCase();
    if (token === 'danger') return 'error';
    if (token === 'info') return 'primary';
    return this.constructor.colors.includes(token) ? token : 'primary';
  }

  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }

  _hasDefaultSlot() {
    const currentSlot = this.querySelector('slot:not([name])');
    if (currentSlot) return Array.from(currentSlot.childNodes).some((node) => this._hasMeaningfulNode(node));
    return Array.from(this.childNodes).some((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('slot')) return false;
      return this._hasMeaningfulNode(node);
    });
  }

  _hasMeaningfulNode(node) {
    return node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  }

}

if (!customElements.get('w-avatar')) {
  customElements.define('w-avatar', WAvatar);
}
