/* <w-list-group> — expandable list group */

export class WListGroup extends WElement {
  static attrs = [
    'open',
    'title',
    'value',
    'raw-id',
    'prepend-icon',
    'append-icon',
    'expand-icon',
    'collapse-icon',
    'subgroup',
    'fluid',
    'disabled',
    'color',
    'base-color',
    'active-color',
  ];

  get open() { return this._bool('open'); }
  get title() { return this._attr('title', ''); }
  get value() { return this._attr('value', this.title); }
  get rawId() { return this._attr('raw-id', this.value || this.title || 'group'); }
  get prependIcon() { return this._attr('prepend-icon', ''); }
  get expandIcon() { return this._attr('expand-icon', '⌄'); }
  get collapseIcon() { return this._attr('collapse-icon', '⌃'); }
  get toggleIcon() { return this.open ? this.collapseIcon : this.expandIcon; }
  get appendIcon() { return this._attr('append-icon', this.subgroup ? '' : this.toggleIcon); }
  get subgroup() { return this._bool('subgroup'); }
  get fluid() { return this._bool('fluid'); }
  get disabled() { return this._bool('disabled'); }

  _template() {
    const hasActivator = !!this.querySelector('[slot="activator"]');
    const id = 'w-list-group-' + this._classToken(this.rawId);
    const classes = [
      'w-list-group',
      this.open ? 'open' : '',
      this.subgroup ? 'w-list-group--subgroup' : '',
      this.fluid ? 'w-list-group--fluid' : '',
    ].filter(Boolean).join(' ');
    const prependIcon = this.prependIcon || (this.subgroup ? this.toggleIcon : '');
    const activator = hasActivator
      ? `<w-list-group-activator expanded="${this.open}" controls="${id}"${this.disabled ? ' disabled' : ''}><slot name="activator"></slot></w-list-group-activator>`
      : `<w-list-group-activator
          title="${this._esc(this.title)}"
          prepend-icon="${this._esc(prependIcon)}"
          append-icon="${this._esc(this.appendIcon)}"
          expanded="${this.open}"
          controls="${id}"
          ${this.disabled ? 'disabled' : ''}
        ></w-list-group-activator>`;
    return `<div class="${classes}">
      ${activator}
      <div id="${this._esc(id)}" class="w-list-group-items"${this.open ? '' : ' hidden'}><slot></slot></div>
    </div>`;
  }

  _events() {
    const activator = this._q('w-list-group-activator') || this._q('.w-list-group-activator');
    if (!activator || this.disabled) return;
    activator.addEventListener('click', () => {
      const open = !this.open;
      this._silentSet('open', open ? 'true' : null);
      this._render();
      this._events();
      this._emit('w-toggle', { open, value: this.value });
    });
  }

  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'group';
  }
}

if (!customElements.get('w-list-group')) {
  customElements.define('w-list-group', WListGroup);
}
