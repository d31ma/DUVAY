import WIcons from '../icons.js';
import { wSetValue } from './utils.js';
/* <w-chip> — Chip / filter pill web component
 *
 * Attributes:
 *   text/selected/value/hidden      - content, selection, and visibility state
 *   variant/color/base-color        - tonal | filled | outlined | text | plain
 *   prepend-icon/avatar, append-icon/avatar, filter, closable, removable
 *   filter-icon, close-icon, icon-set - icon names resolved through WIcons
 *                                       (like <w-btn>); `icon-set` picks the set
 *   close-label                     - accessible name of the close button
 *   label, pill, href, link, size, density, elevation, rounded, border
 *   static                          - display-only chip: a <span> with no
 *                                     button role and no selection toggle
 *
 * Roles: by default the chip is a toggle <button aria-pressed>; with `href` it
 * is a link; with `static` it is plain text; with host `aria-haspopup` it is a
 * plain button that opens a popup (no aria-pressed, no selection toggle).
 * Enter and Space act through the native button click.
 *
 * Forwarded ARIA — authored on the host, rendered on the inner button or link:
 *   aria-label, aria-labelledby, aria-describedby, aria-expanded,
 *   aria-controls, aria-current, aria-haspopup.
 *
 * Close: `closable`/`removable` render a real <button> named by `close-label`
 * that Tab reaches. When the chip also acts (toggle, link, popup), the pill is
 * a <span class="w-chip"> holding two siblings, `.w-chip__action` and
 * `.w-chip__close`, so no control is nested inside another.
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
    'ripple',
    'selected-class',
    'active-class',
    'static',
    'icon-set',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-expanded',
    'aria-controls',
    'aria-current',
    'aria-haspopup',
  ];

  static colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'danger', 'info'];
  static variants = ['tonal', 'filled', 'outlined', 'text', 'plain', 'elevated'];
  static sizes = ['x-small', 'small', 'default', 'large', 'x-large', 'xs', 'sm', 'md', 'lg', 'xl'];

  get selected()      { return this.hasAttribute('selected'); }
  set selected(value) { value ? this.setAttribute('selected', '') : this.removeAttribute('selected'); }
  get disabled()      { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  set value(v) { wSetValue(this, v); }
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
  get selectedClass() { return this._attr('selected-class', ''); }
  get activeClass()   { return this._attr('active-class', ''); }
  get closable()      { return this._bool('closable') || this._bool('removable'); }

  // A link chip is "active" when its href resolves to the page it is on — the
  // same rule vue-router's active-class follows.
  get routeActive() {
    if (!this.href) return false;
    try {
      return new URL(this.href, location.href).pathname === location.pathname;
    } catch (_) {
      return false;
    }
  }

  get removable()     { return this._bool('removable'); }
  get active()        { return !this.hasAttribute('hidden'); }

  // Host ARIA is forwarded to the element that carries the role. These names
  // are patched in place on change, so focus stays on the control while a
  // popup it opens toggles aria-expanded.
  static forwardedAria = ['aria-label', 'aria-labelledby', 'aria-describedby', 'aria-expanded', 'aria-controls', 'aria-current'];

  attributeChangedCallback(name, oldValue, newValue) {
    if (!WChip.forwardedAria.includes(name)) return super.attributeChangedCallback(name, oldValue, newValue);
    this._syncAria(name, newValue);
  }

  _syncAria(name, value) {
    const control = this._control();
    if (!control || control.localName === 'span') return;
    if (value) control.setAttribute(name, value);
    else control.removeAttribute(name);
  }

  _template() {
    if (!this.active) return '<span class="w-chip-preserve" hidden><slot></slot><slot name="prepend"></slot><slot name="append"></slot><slot name="filter"></slot><slot name="close"></slot></span>';
    if (this._split()) return this._splitTemplate();
    const tag = this._tag();
    const inner = this._overlay() + this._bodyTemplate() + this._closeTemplate();
    return this._element(tag, this._chipClass(), this._controlAttrs(tag) + this._dragAttr(), inner);
  }

  // A chip with both an action and a close button renders them side by side
  // inside a non-interactive pill, so neither control is nested in the other.
  _splitTemplate() {
    const tag = this._tag();
    const action = this._element(tag, 'w-chip__action', this._controlAttrs(tag), this._bodyTemplate());
    return this._element('span', this._chipClass(), this._dragAttr(), WChip.overlay + action + this._closeTemplate());
  }

  static overlay = '<span class="w-chip__overlay" aria-hidden="true"></span>';

  _overlay() {
    return this._mode() === 'static' ? '' : WChip.overlay;
  }

  _element(tag, className, attrs, inner) {
    return `<${tag} class="${className}"${attrs}>${inner}</${tag}>`;
  }

  _split() {
    return this._hasClose() && this._mode() !== 'static';
  }

  // static: non-interactive label; link: anchor; action: plain button that
  // opens a popup (host aria-haspopup); toggle: aria-pressed button.
  _mode() {
    if (this._bool('static')) return 'static';
    if (this.href && !this.disabled) return 'link';
    if (this.hasAttribute('aria-haspopup')) return 'action';
    return 'toggle';
  }

  _tag() {
    const tags = { static: 'span', link: 'a' };
    return tags[this._mode()] || 'button';
  }

  _controlAttrs(tag) {
    if (tag === 'span') return '';
    const own = tag === 'a' ? this._linkAttrs() : this._buttonAttrs();
    return this._attrs(Object.assign(own, this._ariaAttrs(WChip.forwardedAria.concat('aria-haspopup'))));
  }

  _linkAttrs() {
    return { href: this.href, target: this.target, rel: this.rel };
  }

  _buttonAttrs() {
    return {
      type: 'button',
      disabled: this.disabled,
      'aria-disabled': this.disabled && 'true',
      'aria-pressed': this._pressedState(),
    };
  }

  _pressedState() {
    if (this.disabled || this._mode() !== 'toggle') return '';
    return this.selected ? 'true' : 'false';
  }

  _dragAttr() {
    return this._bool('draggable') ? ' draggable="true"' : '';
  }

  _bodyTemplate() {
    return this._filterTemplate()
      + this._mediaTemplate('prepend')
      + `<span class="w-chip__content">${this._contentTemplate()}</span>`
      + this._mediaTemplate('append');
  }

  _chipClass() {
    return 'w-chip' + this._cls(this._chipModifiers());
  }

  // Modifier class → the condition that turns it on. Keys are unique, so no
  // two conditions can collapse into a single entry.
  _chipModifiers() {
    const elevation = this.getAttribute('elevation');
    return {
      ['w-chip-' + this._variant()]: true,
      ['w-chip-' + this.color]: this.color,
      'selected w-chip--selected': this.selected,
      ['w-chip--' + this._size()]: this.size,
      ['w-chip--density-' + this.density]: this.density,
      'w-chip-removable w-chip--closable': this.closable,
      'w-chip--label': this._bool('label'),
      'w-chip--pill': this._bool('pill'),
      'w-chip--filter': this._bool('filter'),
      'w-chip--link': this.href || this._bool('link'),
      'w-chip--disabled': this.disabled,
      'w-chip--static': this._mode() === 'static',
      [this._roundedClass()]: this.hasAttribute('rounded'),
      'w-chip--border': this.hasAttribute('border'),
      ['w-chip--elevation-' + elevation]: elevation,
      [this.selectedClass]: this.selected && this.selectedClass,
      [this.activeClass]: this.routeActive && this.activeClass,
    };
  }

  _filterTemplate() {
    if (!this._bool('filter') && !this._hasSlot('filter')) return '';
    return `<span class="w-chip__filter" aria-hidden="true">${this._hasSlot('filter') ? '<slot name="filter"></slot>' : this._glyph('filter-icon', '✓')}</span>`;
  }

  _mediaTemplate(side) {
    const media = this._mediaMarkup(side);
    const slot = this._hasSlot(side) ? `<slot name="${side}"></slot>` : '';
    if (!media && !slot) return '';
    return `<span class="w-chip__${side}">${media}${slot}</span>`;
  }

  _mediaMarkup(side) {
    const avatar = this.getAttribute(side + '-avatar');
    if (avatar) return `<span class="w-avatar w-avatar--x-small"><img src="${this._esc(avatar)}" alt=""></span>`;
    return this._iconMarkup(this.getAttribute(side + '-icon'));
  }

  // Icon names resolve through WIcons, like <w-btn>; the default text set
  // renders the same aria-hidden span as before.
  _iconMarkup(name) {
    if (!name) return '';
    const iconSet = this.getAttribute('icon-set') || '';
    return WIcons.resolve(iconSet ? `${iconSet}:${name}` : name, { iconClass: 'w-chip__icon' });
  }

  _glyph(name, fallback) {
    return this.hasAttribute(name) ? this._iconMarkup(this.getAttribute(name)) : this._esc(fallback);
  }

  _contentTemplate() {
    if (this.text) return `${this._esc(this.text)}<slot hidden></slot>`;
    return '<slot></slot>';
  }

  _hasClose() {
    return this.closable || this._hasSlot('close');
  }

  _closeTemplate() {
    if (!this._hasClose()) return '';
    const content = this._hasSlot('close') ? '<slot name="close"></slot>' : this._glyph('close-icon', '×');
    const attrs = this._attrs({ type: 'button', 'aria-label': this.closeLabel, disabled: this.disabled });
    return `<button class="w-chip__close w-chip-close"${attrs}>${content}</button>`;
  }

  _control() {
    return this._q('.w-chip__action') || this._q('.w-chip');
  }

  _events() {
    const chip = this._q('.w-chip');
    if (!chip || this.disabled) return;
    if (this.hasAttribute('ripple')) this._attachRipple(chip);
    chip.addEventListener('click', (event) => this._onClick(event));
  }

  // Enter and Space reach here as native button clicks, so the keyboard and
  // the pointer share one path.
  _onClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('.w-chip__close')) return this._onClose(event);
    if (this._selectable() && this._control()?.contains(target)) this._toggleSelected();
  }

  _selectable() {
    return this._mode() === 'toggle' || this._mode() === 'link';
  }

  _onClose(event) {
    event.preventDefault();
    event.stopPropagation();
    this._close(event);
  }

  _toggleSelected() {
    const selected = !this.selected;
    this._silentSet('selected', selected ? '' : null);
    const chip = this._q('.w-chip');
    chip?.classList.toggle('selected', selected);
    chip?.classList.toggle('w-chip--selected', selected);
    this._toggleTokens(chip, this.selectedClass, selected);
    this._syncPressed(selected);
    this._dispatch('change', { selected, value: this.value });
  }

  _syncPressed(selected) {
    const control = this._control();
    if (control?.hasAttribute('aria-pressed')) control.setAttribute('aria-pressed', selected ? 'true' : 'false');
  }

  _toggleTokens(el, value, on) {
    if (!el || !value) return;
    String(value).split(/\s+/).filter(Boolean).forEach((name) => el.classList.toggle(name, on));
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
