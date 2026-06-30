/* <w-item> - generic action/list item */

export class WItem extends WElement {
  static attrs = ['title', 'description', 'icon', 'shortcut', 'disabled'];

  get title() { return this._attr('title', ''); }
  get description() { return this._attr('description', ''); }
  get icon() { return this._attr('icon', ''); }
  get shortcut() { return this._attr('shortcut', ''); }
  get disabled() { return this._bool('disabled'); }

  _template() {
    const generated = this.title || this.description || this.icon || this.shortcut;
    const content = generated
      ? `${this.icon ? `<span class="w-item-icon" aria-hidden="true">${this._esc(this.icon)}</span>` : '<span class="w-item-icon" aria-hidden="true"></span>'}
        <span class="w-item-content">
          ${this.title ? `<span class="w-item-title">${this._esc(this.title)}</span>` : ''}
          ${this.description ? `<span class="w-item-description">${this._esc(this.description)}</span>` : ''}
        </span>
        ${this.shortcut ? `<kbd class="w-kbd">${this._esc(this.shortcut)}</kbd>` : '<slot name="append"></slot>'}`
      : '<slot></slot>';

    return `<button class="w-item" type="button"${this.disabled ? ' disabled' : ''}>${content}</button>`;
  }
}

if (!customElements.get('w-item')) {
  customElements.define('w-item', WItem);
}
