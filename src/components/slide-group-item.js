/* <w-slide-group-item> — DuVay component module
 *
 * Attributes:
 *   value          - identifier used by the parent <w-slide-group>
 *   disabled       - blocks selection and focus
 *   selected-class - class applied to this item while it is selected, on top
 *                    of the group's own `selected-class`
 */
import { wBoolAttr } from './utils.js';

export class WSlideGroupItem extends WElement {
  static attrs = ['value', 'disabled', 'selected-class'];

  get disabled() { return wBoolAttr(this, 'disabled'); }

  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get selectedClass() { return this._attr('selected-class', ''); }

  _template() {
    return `<div class="w-slide-group-item"${this.disabled ? ' aria-disabled="true"' : ''}><slot></slot></div>`;
  }

  // The group toggles this class as selection changes; applying it here covers
  // an item that is already selected when it upgrades, or used standalone.
  _events() {
    const name = this.selectedClass;
    if (name) this.classList.toggle(name, this.hasAttribute('selected'));
  }
}

if (!customElements.get('w-slide-group-item')) customElements.define('w-slide-group-item', WSlideGroupItem);
