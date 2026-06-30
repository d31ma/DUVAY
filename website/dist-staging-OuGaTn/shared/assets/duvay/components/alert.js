/* <w-alert> - Alert banner web component
 *
 * Attributes:
 *   type          - success | info | warning | error
 *   variant       - flat | tonal | outlined | text | plain | elevated
 *                   Legacy contextual values still work: info | success | warning | error.
 *   color         - primary | secondary | tertiary | success | warning | error | danger
 *   title         - title text
 *   text          - body text
 *   closable      - if set, shows a close button
 *   dismissible   - legacy alias for closable
 *   close-label   - accessible close label
 *   close-icon    - close button text/icon fallback
 *   model-value   - v-model visibility; "false" hides the alert (emits update:model-value)
 *   icon          - custom icon text, or "false" to hide the icon
 *   icon-size     - CSS length for the contextual/custom icon
 *   prominent     - larger icon and roomier layout
 *   border        - true | start | end | top | bottom | left | right
 *   border-color  - token color for the accent border
 *   hidden        - hides the alert
 *
 * Slots:
 *   default, prepend, title, text, append, close
 *
 * Events:
 *   close
 */

class WAlert extends WElement {

  static attrs = [
    'type',
    'variant',
    'color',
    'title',
    'text',
    'closable',
    'dismissible',
    'close-label',
    'close-icon',
    'icon',
    'icon-size',
    'prominent',
    'border',
    'border-color',
    'model-value',
    'hidden',
  ];

  static contextualTypes = ['info', 'success', 'warning', 'error'];
  static styleVariants = ['flat', 'tonal', 'outlined', 'text', 'plain', 'elevated'];
  static borderSides = { true: 'start', start: 'start', left: 'start', end: 'end', right: 'end', top: 'top', bottom: 'bottom' };
  static colorTokens = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'danger', 'info'];

  get rawType()     { return this._attr('type', ''); }
  get rawVariant()  { return this._attr('variant', 'flat'); }
  get title()       { return this._attr('title', ''); }
  get text()        { return this._attr('text', ''); }
  get closeLabel()  { return this._attr('close-label', 'Close alert'); }
  get closeIcon()   { return this._attr('close-icon', ''); }
  get iconSize()    { return this._attr('icon-size', ''); }
  get prominent()   { return this._bool('prominent'); }
  get closable()    { return this._bool('closable') || this._bool('dismissible'); }

  get active() {
    // `model-value` (v-model parity) wins when present: falsy hides the alert.
    if (this.hasAttribute('model-value')) {
      const v = String(this.getAttribute('model-value')).toLowerCase();
      return !(v === 'false' || v === '0' || v === 'null');
    }
    return !this.hasAttribute('hidden');
  }

  get contextualType() {
    if (this._isContextual(this.rawType)) return this.rawType;
    if (!this.rawType && this._isContextual(this.rawVariant)) return this.rawVariant;
    return '';
  }

  get styleVariant() {
    const variant = this.rawVariant;
    if (!this.rawType && this._isContextual(variant)) return 'flat';
    return this.constructor.styleVariants.includes(variant) ? variant : 'flat';
  }

  get colorName() {
    const color = this._attr('color', '');
    if (color) return this._normalizeColor(color);
    return this.contextualType || 'info';
  }

  get borderSide() {
    if (!this.hasAttribute('border')) return '';
    const value = this.getAttribute('border');
    const key = !value || value === '' ? 'true' : String(value).toLowerCase();
    return this.constructor.borderSides[key] || 'start';
  }

  get borderColor() {
    return this._normalizeColor(this._attr('border-color', this.colorName));
  }

  _template() {
    if (!this.active) {
      return `<div class="w-alert w-alert--hidden" hidden aria-hidden="true">
        <slot name="prepend"></slot>
        <slot name="title"></slot>
        <slot name="text"></slot>
        <slot></slot>
        <slot name="append"></slot>
        <slot name="close"></slot>
      </div>`;
    }

    const type = this.contextualType;
    const color = this.colorName;
    const borderSide = this.borderSide;
    const live = type === 'error' ? 'assertive' : 'polite';
    const classes = [
      'w-alert',
      type ? 'w-alert-' + type : '',
      'w-alert--type-' + (type || 'custom'),
      'w-alert--variant-' + this.styleVariant,
      'w-alert--color-' + color,
      this.prominent ? 'w-alert--prominent' : '',
      borderSide ? 'w-alert--border w-alert--border-' + borderSide + ' w-alert--border-color-' + this.borderColor : '',
    ].filter(Boolean).join(' ');

    const styles = this.iconSize ? ` style="--w-alert-icon-size: ${this._esc(this.iconSize)}"` : '';
    let html = `<div class="${classes}" role="alert" aria-live="${live}"${styles}>`;
    if (borderSide) html += '<div class="w-alert-border" aria-hidden="true"></div>';
    html += this._renderPrepend();
    html += '<div class="w-alert-body w-alert-content">';
    if (this._hasSlot('title')) html += '<div class="w-alert-title"><slot name="title"></slot></div>';
    else if (this.title) html += `<div class="w-alert-title">${this._esc(this.title)}</div>`;
    if (this._hasSlot('text')) html += '<div class="w-alert-text"><slot name="text"></slot></div>';
    else if (this.text) html += `<div class="w-alert-text">${this._esc(this.text)}</div>`;
    html += '<slot></slot></div>';
    if (this._hasSlot('append')) html += '<div class="w-alert-append"><slot name="append"></slot></div>';
    html += this._renderClose();
    html += '</div>';
    return html;
  }

  _events() {
    const close = this._q('[data-w-alert-close]');
    if (!close) return;
    close.addEventListener('click', () => this._close());
  }

  _close() {
    if (this.hasAttribute('disabled')) return;

    this._silentSet('hidden', '');
    if (this.hasAttribute('model-value')) this._silentSet('model-value', 'false');
    this._render();
    if (typeof this._events === 'function') this._events();
    this._applyCommonProps();

    this._emit('update:model-value', false);
    this._emit('close', { value: false });
  }

  _renderPrepend() {
    if (this._hasSlot('prepend')) {
      return '<div class="w-alert-prepend"><slot name="prepend"></slot></div>';
    }

    const icon = this._iconMarkup();
    return icon ? `<div class="w-alert-prepend w-alert-icon" aria-hidden="true">${icon}</div>` : '';
  }

  _renderClose() {
    if (!this.closable && !this._hasSlot('close')) return '';
    const content = this._hasSlot('close')
      ? '<slot name="close"></slot>'
      : this.closeIcon
        ? `<span class="w-alert-close-icon" aria-hidden="true">${this._esc(this.closeIcon)}</span>`
        : '<svg class="w-alert-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    return `<button class="w-alert-dismiss w-alert-close" type="button" aria-label="${this._esc(this.closeLabel)}" data-w-alert-close>${content}</button>`;
  }

  _iconMarkup() {
    const icon = this.getAttribute('icon');
    if (icon != null) {
      if (['false', '0', 'none', 'off'].includes(String(icon).toLowerCase())) return '';
      return `<span class="w-alert-icon-text">${this._esc(icon)}</span>`;
    }

    const icons = {
      info: '<svg class="w-alert-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      success: '<svg class="w-alert-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      warning: '<svg class="w-alert-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      error: '<svg class="w-alert-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    };
    return icons[this.contextualType || 'info'];
  }

  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }

  _isContextual(value) {
    return this.constructor.contextualTypes.includes(value);
  }

  _normalizeColor(value) {
    const token = String(value || '').toLowerCase();
    if (token === 'danger') return 'error';
    if (token === 'info') return 'primary';
    return this.constructor.colorTokens.includes(token) ? token : 'primary';
  }

}

if (!customElements.get('w-alert')) {
  customElements.define('w-alert', WAlert);
}
