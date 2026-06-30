/* <w-badge> - Badge / status pill web component
 *
 * Attributes:
 *   content      - badge bubble text
 *   icon         - badge bubble icon text / glyph
 *   dot          - renders a dot badge
 *   dot-size     - CSS length or number for dot badges
 *   max          - caps numeric content as "max+"
 *   model-value  - false hides only the badge bubble
 *   color        - primary | success | danger | warning | info | secondary | tertiary
 *   text-color   - token color for badge text
 *   bordered     - adds a surface outline around the badge
 *   inline       - renders as an inline badge instead of wrapping content
 *   floating     - offsets the badge outside wrapped content
 *   location     - top-end | top-start | bottom-end | bottom-start
 *   offset-x/y   - extra badge offset
 *   rounded      - true | pill | sm | md | lg | xl | 0 | none
 *   label        - aria label text, or boolean uppercase label styling
 *
 * Slots:
 *   default - wrapped content, or inline badge text when content is omitted
 *   badge   - custom badge bubble content
 */

class WBadge extends WElement {

  static attrs = [
    'variant',
    'color',
    'text-color',
    'content',
    'icon',
    'dot',
    'dot-size',
    'max',
    'model-value',
    'value',
    'inline',
    'floating',
    'location',
    'offset-x',
    'offset-y',
    'bordered',
    'rounded',
    'label',
  ];

  static colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'danger', 'info'];
  static variants = ['filled', 'outlined', 'text', 'plain', 'tonal'];
  static locations = {
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

  get variant()    { return this._attr('variant', 'filled'); }
  get color()      { return this._normalizeColor(this._attr('color', 'error')); }
  get textColor()  { return this._normalizeColor(this._attr('text-color', '')); }
  get content()    { return this._attr('content', ''); }
  get icon()       { return this._attr('icon', ''); }
  get max()        { return this._attr('max', ''); }
  get dot()        { return this._bool('dot') || this.variant === 'dot'; }
  get dotSize()    { return this._attr('dot-size', ''); }
  get inline()     { return this._bool('inline'); }
  get floating()   { return this._bool('floating'); }
  get location()   { return this._attr('location', 'top-end'); }
  get offsetX()    { return this._attr('offset-x', ''); }
  get offsetY()    { return this._attr('offset-y', ''); }
  get bordered()   { return this._bool('bordered'); }
  get labelStyle() { return this.hasAttribute('label') && ['', 'true'].includes(this.getAttribute('label')); }

  get active() {
    const state = this.getAttribute('model-value') ?? this.getAttribute('value');
    if (state == null) return true;
    return !['false', '0', 'off', 'hidden'].includes(String(state).toLowerCase());
  }

  _template() {
    const hasBubble = this._hasBubble();
    const inline = this.inline || !hasBubble;

    if (inline) {
      if (!this.active && hasBubble) return '<span class="w-badge w-badge--hidden" hidden><slot></slot><slot name="badge"></slot></span>';
      const content = this._badgeContent();
      return `<span class="${this._badgeClass()}${this.labelStyle ? ' w-badge-label' : ''}"${this._badgeAttrs()}${this._badgeStyle()}>${content || '<slot></slot>'}${content ? '<slot hidden></slot>' : ''}</span>`;
    }

    const locationClass = ' w-badge-wrap--' + this._location();
    const floatingClass = this.floating ? ' w-badge-wrap--floating' : '';
    return `<span class="w-badge-wrap${locationClass}${floatingClass}">
      <slot></slot>
      ${this.active ? `<span class="w-badge-content ${this._badgeClass()}"${this._badgeAttrs()}${this._badgeStyle()}>${this._badgeContent()}</span>` : '<slot name="badge" hidden></slot>'}
    </span>`;
  }

  _hasBubble() {
    return this.content || this.icon || this.dot || this._hasSlot('badge') || this.hasAttribute('color') || this.hasAttribute('bordered') || this.hasAttribute('max');
  }

  _badgeContent() {
    if (this.dot) return '';
    if (this._hasSlot('badge')) return '<slot name="badge"></slot>';
    if (this.icon) return `<span class="w-badge-icon" aria-hidden="true">${this._esc(this.icon)}</span>`;
    return this._esc(this._cappedContent());
  }

  _cappedContent() {
    if (!this.max) return this.content;
    const value = Number(this.content);
    const max = Number(this.max);
    if (!Number.isFinite(value) || !Number.isFinite(max)) return this.content;
    return value <= max ? String(value) : String(max) + '+';
  }

  _badgeClass() {
    const variant = this._variant();
    return [
      'w-badge',
      'w-badge-' + variant,
      'w-badge-' + this.color,
      this.textColor ? 'w-badge-text-' + this.textColor : '',
      this.dot ? 'w-badge-dot' : '',
      this.bordered ? 'w-badge-bordered' : '',
      this.hasAttribute('rounded') ? this._roundedClass() : '',
    ].filter(Boolean).join(' ');
  }

  _badgeAttrs() {
    const label = this._labelText();
    const aria = label ? ` aria-label="${this._esc(label)}"` : '';
    const liveAttrs = this.active ? ' role="status" aria-live="polite" aria-atomic="true"' : '';
    return aria + liveAttrs;
  }

  _badgeStyle() {
    const styles = [];
    const dotSize = this._cssLength(this.dotSize);
    const offsetX = this._cssLength(this.offsetX);
    const offsetY = this._cssLength(this.offsetY);
    if (dotSize) styles.push('--w-badge-dot-size: ' + dotSize);
    if (offsetX) styles.push('--w-badge-offset-x: ' + offsetX);
    if (offsetY) styles.push('--w-badge-offset-y: ' + offsetY);
    return styles.length ? ` style="${styles.join('; ')}"` : '';
  }

  _labelText() {
    const label = this.getAttribute('label');
    if (label && label !== 'true') return label;
    return this.content || this.icon || (this.dot ? 'Badge' : '');
  }

  _location() {
    return this.constructor.locations[String(this.location || '').toLowerCase()] || 'top-end';
  }

  _variant() {
    const variant = this.dot ? 'filled' : this.variant;
    return this.constructor.variants.includes(variant) ? variant : 'filled';
  }

  _roundedClass() {
    const value = this.getAttribute('rounded');
    if (!value || value === 'true') return 'w-badge-rounded';
    return 'w-badge-rounded-' + value;
  }

  _cssLength(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^\d+(\.\d+)?$/.test(raw)) return raw + 'px';
    if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(raw)) return raw;
    return '';
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

}

if (!customElements.get('w-badge')) {
  customElements.define('w-badge', WBadge);
}
