/* <w-stepper-vertical> — interactive vertical stepper (DuVay equivalent of
 * Vuetify v-stepper-vertical). Each w-stepper-vertical-item shows its content
 * inline only while it is the active step. Shares the active-step model with
 * <w-stepper>.
 *
 * Attributes: everything <w-stepper> accepts (value, editable, non-linear,
 * alt-labels, flat, multiple, max, items, mobile, mobile-breakpoint,
 * hide-actions, selected-class, complete/edit/error-icon, prev-text, next-text,
 * ripple, focusable, hover) plus the expansion-panel surface:
 *
 *   mandatory     - with `multiple`, always keep one item open
 *
 *   variant       - default | inset | accordion | popout
 *   gap           - spacing between items; also hides the connectors
 *   no-divider    - hide the connectors between adjacent items
 *   expand-icon   - glyph on a collapsed item, mirrored onto every item
 *   collapse-icon - glyph on the expanded item, mirrored onto every item
 */

import { WStepper } from './stepper.js';
import { wBoolAttr } from './utils.js';

const W_STEPPER_VARIANTS = ['default', 'inset', 'accordion', 'popout'];

class WStepperVertical extends WStepper {
  static attrs = ['variant', 'gap', 'no-divider', 'expand-icon', 'collapse-icon'];

  static stepProps = WStepper.stepProps.concat(['expand-icon', 'collapse-icon']);

  get vertical() { return true; }

  // `mandatory` (including Vuetify's 'force') keeps one item open at all times.
  get mandatory() { return wBoolAttr(this, 'mandatory'); }

  get variant() {
    const value = this._attr('variant', 'default');
    return W_STEPPER_VARIANTS.includes(value) ? value : 'default';
  }

  get noDivider() { return this._bool('no-divider') || !!this._attr('gap', ''); }

  _stepSelector() { return 'w-stepper-vertical-item'; }
  _itemTag() { return 'w-stepper-vertical-item'; }

  _rootClasses() {
    return super._rootClasses() + this._cls({
      [`w-stepper--variant-${this.variant}`]: true,
      'w-stepper--no-divider': this.noDivider,
    });
  }

  // With `multiple` nothing is open until an item is picked; `mandatory` seeds
  // the first one instead.
  _activeValues() {
    const values = super._activeValues();
    if (values.length || !this.mandatory) return values;
    const steps = this._steps();
    return steps.length ? [this._stepValue(steps[0], 0)] : [];
  }

  // …and refuses to close the last open item.
  _toggled(value) {
    const next = super._toggled(value);
    if (next.length || !this.mandatory) return next;
    return this._activeValues();
  }
}

if (!customElements.get('w-stepper-vertical')) {
  customElements.define('w-stepper-vertical', WStepperVertical);
}
