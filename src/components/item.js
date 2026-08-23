import { wSetValue } from './utils.js';
/* <w-item> - generic action/list item
 *
 * Attributes:
 *   value          - the value a surrounding <w-item-group> selects on; it is
 *                    also forwarded to the rendered button
 *   selected-class - extra class on the button while the item is selected
 */

export class WItem extends WElement {
  static attrs = ['title', 'description', 'icon', 'shortcut', 'disabled', 'value', 'selected', 'selected-class'];

  get title() { return this._attr('title', ''); }
  get description() { return this._attr('description', ''); }
  get icon() { return this._attr('icon', ''); }
  get shortcut() { return this._attr('shortcut', ''); }
  get disabled() { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  set value(v) { wSetValue(this, v); }
  get value() { return this._attr('value', ''); }
  set selected(v) { this.toggleAttribute('selected', !!v); }
  get selected() { return this._bool('selected'); }
  get selectedClass() { return this._attr('selected-class', ''); }

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

    const classes = 'w-item' + this._cls({ [this.selectedClass]: this.selected && this.selectedClass });
    const attrs = this._attrs({
      type: 'button',
      value: this.value,
      disabled: this.disabled,
      'aria-pressed': this.selected && 'true',
    });
    return `<button class="${classes}"${attrs}>${content}</button>`;
  }
}

if (!customElements.get('w-item')) {
  customElements.define('w-item', WItem);
}
