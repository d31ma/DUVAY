/* <w-list-group-activator> — List group activator slot */

export class WListGroupActivator extends WElement {
  static attrs = ['title', 'prepend-icon', 'append-icon', 'expanded', 'controls', 'disabled'];

  get title() { return this._attr('title', ''); }
  get prependIcon() { return this._attr('prepend-icon', ''); }
  get appendIcon() { return this._attr('append-icon', ''); }
  get expanded() {
    const value = this._attr('expanded', 'false');
    return value === 'true' || value === '' || this.hasAttribute('open');
  }
  get controls() { return this._attr('controls', ''); }
  get disabled() { return this._bool('disabled'); }

  _template() {
    const hasCustomContent = this.childNodes.length > 0;
    const content = hasCustomContent
      ? '<slot></slot>'
      : `${this.prependIcon ? `<span class="w-list-item-prepend">${this._esc(this.prependIcon)}</span>` : '<span class="w-list-item-prepend" aria-hidden="true"></span>'}
        <span class="w-list-item-content"><span class="w-list-item-title">${this._esc(this.title)}</span></span>
        <span class="w-list-item-append">${this._esc(this.appendIcon)}</span>`;

    return `<button class="w-list-group-activator w-list-item" type="button" aria-expanded="${this.expanded}"${this.controls ? ` aria-controls="${this._esc(this.controls)}"` : ''}${this.disabled ? ' disabled' : ''}>${content}</button>`;
  }
}

if (!customElements.get('w-list-group-activator')) {
  customElements.define('w-list-group-activator', WListGroupActivator);
}
