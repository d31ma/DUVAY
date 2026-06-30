/* <w-chip> — Chip / filter pill web component
 *
 * Attributes:
 *   text/selected/value/hidden      - content, selection, and visibility state
 *   variant/color/base-color        - tonal | filled | outlined | text | plain
 *   prepend-icon/avatar, append-icon/avatar, filter, closable, removable
 *   label, pill, href, link, size, density, elevation, rounded, border
 *
 * Slots:
 *   default, prepend, append, filter, close
 *
 * Events:
 *   change, close
 */

class WChip extends WElement {

  static attrs = [
    'selected',
    'disabled',
    'value',
    'hidden',
    'text',
    'size',
    'density',
    'variant',
    'color',
    'base-color',
    'elevation',
    'rounded',
    'border',
    'label',
    'pill',
    'filter',
    'filter-icon',
    'prepend-icon',
    'prepend-avatar',
    'append-icon',
    'append-avatar',
    'closable',
    'removable',
    'close-icon',
    'close-label',
    'href',
    'target',
    'rel',
    'link',
    'draggable',
  ];

  static colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'danger', 'info'];
  static variants = ['tonal', 'filled', 'outlined', 'text', 'plain', 'elevated'];
  static sizes = ['x-small', 'small', 'default', 'large', 'x-large', 'xs', 'sm', 'md', 'lg', 'xl'];

  get selected()      { return this.hasAttribute('selected'); }
  set selected(value) { value ? this.setAttribute('selected', '') : this.removeAttribute('selected'); }
  get disabled()      { return this._bool('disabled'); }
  get value()         { return this._attr('value', ''); }
  get text()          { return this._attr('text', ''); }
  get size()          { return this._attr('size', ''); }
  get density()       { return this._attr('density', ''); }
  get variant()       { return this._attr('variant', 'tonal'); }
  get color()         { return this._normalizeColor(this._attr('color', this._attr('base-color', ''))); }
  get filterIcon()    { return this._attr('filter-icon', '✓'); }
  get prependIcon()   { return this._attr('prepend-icon', ''); }
  get prependAvatar() { return this._attr('prepend-avatar', ''); }
  get appendIcon()    { return this._attr('append-icon', ''); }
  get appendAvatar()  { return this._attr('append-avatar', ''); }
  get closeIcon()     { return this._attr('close-icon', '×'); }
  get closeLabel()    { return this._attr('close-label', 'Close'); }
  get href()          { return this._attr('href', ''); }
  get target()        { return this._attr('target', ''); }
  get rel()           { return this._attr('rel', ''); }
  get closable()      { return this._bool('closable') || this._bool('removable'); }
  get removable()     { return this._bool('removable'); }
  get active()        { return !this.hasAttribute('hidden'); }

  _template() {
    if (!this.active) return '<span class="w-chip-preserve" hidden><slot></slot><slot name="prepend"></slot><slot name="append"></slot><slot name="filter"></slot><slot name="close"></slot></span>';

    const tag = this.href && !this.disabled ? 'a' : 'button';
    const rootAttrs = this._rootAttrs(tag);

    return `<${tag} class="${this._chipClass()}"${rootAttrs}>
      <span class="w-chip__overlay" aria-hidden="true"></span>
      ${this._filterTemplate()}
      ${this._mediaTemplate('prepend')}
      <span class="w-chip__content">${this._contentTemplate()}</span>
      ${this._mediaTemplate('append')}
      ${this._closeTemplate()}
    </${tag}>`;
  }

  _rootAttrs(tag) {
    const attrs = [];
    if (tag === 'button') {
      attrs.push(' type="button"');
      if (this.disabled) attrs.push(' disabled');
    } else {
      attrs.push(` href="${this._esc(this.href)}"`);
      if (this.target) attrs.push(` target="${this._esc(this.target)}"`);
      if (this.rel) attrs.push(` rel="${this._esc(this.rel)}"`);
    }
    if (this.disabled) attrs.push(' aria-disabled="true"');
    if (!this.disabled && !this.href) attrs.push(` aria-pressed="${this.selected ? 'true' : 'false'}"`);
    if (this._bool('draggable')) attrs.push(' draggable="true"');
    return attrs.join('');
  }

  _chipClass() {
    return [
      'w-chip',
      'w-chip-' + this._variant(),
      this.color ? 'w-chip-' + this.color : '',
      this.selected ? 'selected w-chip--selected' : '',
      this.size ? 'w-chip--' + this._size() : '',
      this.density ? 'w-chip--density-' + this.density : '',
      this.closable ? 'w-chip-removable w-chip--closable' : '',
      this._bool('label') ? 'w-chip--label' : '',
      this._bool('pill') ? 'w-chip--pill' : '',
      this._bool('filter') ? 'w-chip--filter' : '',
      this.href || this._bool('link') ? 'w-chip--link' : '',
      this.disabled ? 'w-chip--disabled' : '',
      this.hasAttribute('rounded') ? this._roundedClass() : '',
      this.hasAttribute('border') ? 'w-chip--border' : '',
      this.getAttribute('elevation') ? 'w-chip--elevation-' + this.getAttribute('elevation') : '',
    ].filter(Boolean).join(' ');
  }

  _filterTemplate() {
    if (!this._bool('filter') && !this._hasSlot('filter')) return '';
    return `<span class="w-chip__filter" aria-hidden="true">${this._hasSlot('filter') ? '<slot name="filter"></slot>' : this._esc(this.filterIcon)}</span>`;
  }

  _mediaTemplate(side) {
    const avatar = side === 'prepend' ? this.prependAvatar : this.appendAvatar;
    const icon = side === 'prepend' ? this.prependIcon : this.appendIcon;
    const slot = this._hasSlot(side) ? `<slot name="${side}"></slot>` : '';
    if (!avatar && !icon && !slot) return '';
    const media = avatar
      ? `<span class="w-avatar w-avatar--x-small"><img src="${this._esc(avatar)}" alt=""></span>`
      : icon ? `<span class="w-chip__icon" aria-hidden="true">${this._esc(icon)}</span>` : '';
    return `<span class="w-chip__${side}">${media}${slot}</span>`;
  }

  _contentTemplate() {
    if (this.text) return `${this._esc(this.text)}<slot hidden></slot>`;
    return '<slot></slot>';
  }

  _closeTemplate() {
    if (!this.closable && !this._hasSlot('close')) return '';
    const content = this._hasSlot('close') ? '<slot name="close"></slot>' : this._esc(this.closeIcon);
    return `<span class="w-chip__close w-chip-close" role="button" tabindex="-1" aria-label="${this._esc(this.closeLabel)}">${content}</span>`;
  }

  _events() {
    const chip = this._q('.w-chip');
    if (!chip || this.disabled) return;

    chip.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('.w-chip__close')) {
        event.preventDefault();
        event.stopPropagation();
        this._close(event);
        return;
      }

      this._toggleSelected();
    });

    chip.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('.w-chip__close')) this._close(event);
      else this._toggleSelected();
    });
  }

  _toggleSelected() {
    const selected = !this.selected;
    this._silentSet('selected', selected ? '' : null);
    this._q('.w-chip')?.classList.toggle('selected', selected);
    this._q('.w-chip')?.classList.toggle('w-chip--selected', selected);
    this._q('.w-chip')?.setAttribute('aria-pressed', selected ? 'true' : 'false');
    this._dispatch('change', { selected, value: this.value });
  }

  _close(event) {
    this._dispatch('close', { value: this.value });
    if (this.removable) {
      this.remove();
      return;
    }
    this._silentSet('hidden', '');
    this._render();
    if (typeof this._events === 'function') this._events();
  }

  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  _variant() {
    return this.constructor.variants.includes(this.variant) ? this.variant : 'tonal';
  }

  _size() {
    const aliases = { xs: 'x-small', sm: 'small', md: 'default', lg: 'large', xl: 'x-large' };
    const size = aliases[this.size] || this.size;
    return this.constructor.sizes.includes(size) ? size : 'default';
  }

  _roundedClass() {
    const value = this.getAttribute('rounded');
    if (!value || value === 'true') return 'w-chip--rounded';
    return 'w-chip--rounded-' + value;
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

if (!customElements.get('w-chip')) {
  customElements.define('w-chip', WChip);
}
