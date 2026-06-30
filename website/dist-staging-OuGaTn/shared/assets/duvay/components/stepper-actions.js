/* <w-stepper-actions> — Back / Next buttons for a w-stepper.
 *
 * Renders two buttons carrying data-stepper-action="prev|next"; the parent
 * w-stepper wires their clicks and toggles their disabled state. Provide your
 * own [data-stepper-action] children to override.
 *
 * Attributes:
 *   prev-text - label for the back button (default "Back")
 *   next-text - label for the next button (default "Next")
 */

export class WStepperActions extends WElement {
  static attrs = ['prev-text', 'next-text'];

  get prevText() { return this._attr('prev-text', 'Back'); }
  get nextText() { return this._attr('next-text', 'Next'); }

  _template() {
    if (this.querySelector('[data-stepper-action]')) {
      return `<div class="w-stepper-actions"><slot></slot></div>`;
    }
    return `<div class="w-stepper-actions">
      <button class="w-btn w-btn-text" type="button" data-stepper-action="prev">${this._esc(this.prevText)}</button>
      <button class="w-btn w-btn-filled" type="button" data-stepper-action="next">${this._esc(this.nextText)}</button>
    </div>`;
  }
}

if (!customElements.get('w-stepper-actions')) {
  customElements.define('w-stepper-actions', WStepperActions);
}
