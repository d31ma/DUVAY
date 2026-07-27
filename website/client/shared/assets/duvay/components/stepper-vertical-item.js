/* <w-stepper-vertical-item> — a step in a vertical stepper (header + inline content)
 *
 * Extends <w-step>, so the whole header surface (icon, complete/edit/error
 * icons, selected-class, ripple, focusable, hover) is shared.
 *
 * Attributes:
 *   value              - step value (defaults to its position)
 *   title / label      - step title
 *   subtitle / caption - secondary helper text
 *   text               - body copy rendered above the slotted content
 *   state              - active | done | error (driven by w-stepper-vertical)
 *   complete           - mark complete (✓)
 *   error              - mark in error (!)
 *   editable           - header is clickable (driven by the parent)
 *   static             - keep the title at its resting size while active
 *   hide-actions       - hide the expand / collapse chevron
 *   expand-icon        - chevron shown while collapsed (default ▸)
 *   collapse-icon      - chevron shown while expanded (default ▾)
 *   focusable          - header is keyboard reachable and the revealed content
 *                        panel becomes a tab stop
 *
 * Slots:
 *   default - the step's panel content (shown when the step is active)
 */

import { WStep } from './step.js';

export class WStepperVerticalItem extends WStep {
  static attrs = ['text', 'static', 'hide-actions', 'expand-icon', 'collapse-icon'];

  get title() { return this.label; }
  get text() { return this._attr('text', ''); }
  get isStatic() { return this._bool('static'); }
  get hideActions() { return this._bool('hide-actions'); }

  // The default slot belongs to the content panel, not the header label.
  _labelSlot() { return ''; }

  _headerExtra() {
    if (this.hideActions) return '';
    const active = this._isActive();
    const icon = this._attr(active ? 'collapse-icon' : 'expand-icon', '');
    const glyph = this._glyph(icon, active ? '▾' : '▸');
    return `<span class="w-stepper-vertical-chevron" aria-hidden="true">${glyph}</span>`;
  }

  _itemClass() {
    return 'w-stepper-vertical-item' + this._cls({
      active: this._isActive(),
      done: this._isDone(),
      error: this._isError(),
      'w-stepper-vertical-item--static': this.isStatic,
    });
  }

  _textMarkup() {
    return this.text ? `<p class="w-stepper-vertical-text">${this._esc(this.text)}</p>` : '';
  }

  // `focusable` makes the header a control (w-step) and the revealed panel a
  // tab stop, so a keyboard reader lands on the content it just opened.
  _contentAttrs() {
    return this._attrs({
      hidden: !this._isActive(),
      tabindex: this.focusable ? '0' : '',
    });
  }

  _template() {
    return `<div class="${this._itemClass()}">${this._headerMarkup()}
      <div class="w-stepper-vertical-content"${this._contentAttrs()}>${this._textMarkup()}<slot></slot></div>
    </div>`;
  }
}

if (!customElements.get('w-stepper-vertical-item')) {
  customElements.define('w-stepper-vertical-item', WStepperVerticalItem);
}
