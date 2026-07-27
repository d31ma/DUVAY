/* <w-field-label> — Vuetify structural subcomponent
 *
 * Attributes:
 *   floating - elevate the label above the slotted content instead of
 *              stacking it inline (the shrunk "floating label" position)
 */

export class WFieldLabel extends WElement {
  static attrs = ['floating'];

  _template() {
    const cls = 'w-field-label' + this._cls({ 'w-field-label--floating': this._bool('floating') });
    return `<div class="${cls}"><slot></slot></div>`;
  }
}

if (!customElements.get('w-field-label')) {
  customElements.define('w-field-label', WFieldLabel);
}
