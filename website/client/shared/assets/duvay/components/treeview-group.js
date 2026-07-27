/* <w-treeview-group> — an expandable branch (DuVay equivalent of Vuetify v-treeview-group)
 *
 * Attributes:
 *   title         - branch label
 *   value         - branch key, reported by the `toggle` event
 *   open          - expanded state (DuVay spelling, mirrors v-model)
 *   expand-icon   - glyph shown while collapsed (default: ›)
 *   collapse-icon - glyph shown while expanded (default: ⌄)
 *   prepend-icon  - leading glyph on the activator
 *   append-icon   - trailing glyph on the activator
 *   raw-id        - seeds the root id as `w-treeview-group--id-<rawId>`
 *   fluid         - removes the indentation of nested items
 *   disabled      - freezes the activator
 *
 * Slots:
 *   default - the branch children
 *
 * Events:
 *   toggle - fires when the branch opens or closes (detail: { open, value })
 */

export class WTreeviewGroup extends WElement {

  static attrs = [
    'title', 'value', 'open', 'raw-id',
    'expand-icon', 'collapse-icon', 'prepend-icon', 'append-icon',
    'fluid', 'disabled',
  ];

  static seq = 0;

  get groupTitle() { return this._attr('title', ''); }
  get value() { return this._attr('value', this.groupTitle); }
  get open() { return this._bool('open'); }
  get rawId() { return this._attr('raw-id', ''); }
  get expandIcon() { return this._attr('expand-icon', '›'); }
  get collapseIcon() { return this._attr('collapse-icon', '⌄'); }
  get toggleIcon() { return this.open ? this.collapseIcon : this.expandIcon; }
  get prependIcon() { return this._attr('prepend-icon', ''); }
  get appendIcon() { return this._attr('append-icon', ''); }
  get fluid() { return this._bool('fluid'); }
  get disabled() { return this._bool('disabled'); }

  // Vuetify derives the root id from `raw-id`; without one we still need a
  // stable handle for aria-controls, so fall back to a per-instance token.
  get rootId() {
    return this.rawId ? 'w-treeview-group--id-' + this._classToken(this.rawId) : '';
  }

  _template() {
    const base = this.rootId || this._uid();
    const panel = base + '-items';
    const rootAttrs = this._attrs({ id: this.rootId, 'data-value': this.value });
    return `<div class="${this._classes()}"${rootAttrs}>`
      + this._activatorHtml(panel)
      + `<div id="${this._esc(panel)}" class="w-treeview-group-items" role="group"`
      + `${this.open ? '' : ' hidden'}><slot></slot></div>`
      + '</div>';
  }

  _activatorHtml(panel) {
    return '<button class="w-treeview-group-activator" type="button"'
      + ` aria-expanded="${this.open}" aria-controls="${this._esc(panel)}"`
      + `${this.disabled ? ' disabled' : ''}>`
      + this._iconHtml('prepend', this.prependIcon)
      + `<span class="w-treeview-group-title">${this._esc(this.groupTitle)}</span>`
      + this._iconHtml('append', this.appendIcon)
      + `<span class="w-treeview-group-toggle" aria-hidden="true">${this._esc(this.toggleIcon)}</span>`
      + '</button>';
  }

  _iconHtml(side, icon) {
    if (!icon) return '';
    return `<span class="w-treeview-group-icon w-treeview-group-icon--${side}" aria-hidden="true">${this._esc(icon)}</span>`;
  }

  _classes() {
    return 'w-treeview-group' + this._cls({
      open: this.open,
      'w-treeview-group--fluid': this.fluid,
      'w-treeview-group--disabled': this.disabled,
    });
  }

  _events() {
    const activator = this._q('.w-treeview-group-activator');
    if (!activator || this.disabled) return;
    activator.addEventListener('click', () => {
      const open = !this.open;
      this._silentSet('open', open ? 'true' : null);
      this._render();
      this._events();
      this._emit('toggle', { open, value: this.value });
    });
  }

  _uid() {
    if (!this._wUid) {
      WTreeviewGroup.seq += 1;
      this._wUid = 'w-treeview-group-' + WTreeviewGroup.seq;
    }
    return this._wUid;
  }

  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'group';
  }
}

if (!customElements.get('w-treeview-group')) {
  customElements.define('w-treeview-group', WTreeviewGroup);
}
