/* <w-command-item> — selectable command item
 *
 * Attributes:
 *   value         - value reported in the change event
 *   subtitle      - secondary line under the title
 *   icon / prepend-icon - leading icon glyph
 *   shortcut      - keyboard shortcut shown on the right (kbd)
 *   disabled      - non-selectable
 *
 * Selection is handled by the parent <w-command> (click + keyboard), so this
 * element only renders; it does not emit on its own.
 */

export class WCommandItem extends WElement {
  static attrs = ['value', 'subtitle', 'icon', 'prepend-icon', 'shortcut', 'disabled'];

  get value() { return this._attr('value', ''); }
  get subtitle() { return this._attr('subtitle', ''); }
  get icon() { return this._attr('icon', '') || this._attr('prepend-icon', ''); }
  get shortcut() { return this._attr('shortcut', ''); }
  get disabled() { return this._bool('disabled'); }

  _template() {
    const icon = this.icon
      ? `<span class="w-command-item-icon" aria-hidden="true">${this._esc(this.icon)}</span>`
      : '';
    const subtitle = this.subtitle
      ? `<span class="w-command-item-subtitle">${this._esc(this.subtitle)}</span>`
      : '';
    const shortcut = this.shortcut
      ? `<kbd class="w-kbd">${this._esc(this.shortcut)}</kbd>`
      : '';
    const dis = this.disabled ? ' disabled aria-disabled="true"' : '';
    return `<button class="w-command-item" role="option" type="button" value="${this._esc(this.value)}"${dis}>
      ${icon}
      <span class="w-command-item-content">
        <span class="w-command-item-title"><slot></slot></span>
        ${subtitle}
      </span>
      ${shortcut}
    </button>`;
  }
}

if (!customElements.get('w-command-item')) {
  customElements.define('w-command-item', WCommandItem);
}
