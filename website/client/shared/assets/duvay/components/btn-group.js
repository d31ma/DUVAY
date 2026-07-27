/* <w-btn-group> — joined row (or column) of buttons
 *
 * Attributes:
 *   variant   - variant applied to child <w-btn>s that don't set their own
 *   divided   - draw a separator between the children
 *   direction - horizontal (default) | vertical; `vertical` works as a bare alias
 *
 * Slots:
 *   default - <w-btn> elements
 */

export class WBtnGroup extends WElement {
  static attrs = ['variant', 'divided', 'direction', 'vertical'];

  get variant() { return this._attr('variant', ''); }
  get divided() { return this._bool('divided'); }
  get vertical() { return this._attr('direction', '') === 'vertical' || this._bool('vertical'); }

  _template() {
    return `<div class="${this._classes()}" role="group"><slot></slot></div>`;
  }

  _classes() {
    return 'w-btn-group' + this._cls({
      'w-btn-group--divided': this.divided,
      'w-btn-group--vertical': this.vertical,
    });
  }

  // Children keep any variant they declare themselves; the group only fills the
  // gaps, the same way <w-btn-toggle> does.
  _events() {
    if (!this.variant) return;
    this.querySelectorAll('w-btn').forEach((btn) => {
      if (!btn.hasAttribute('variant')) btn.setAttribute('variant', this.variant);
    });
  }
}

if (!customElements.get('w-btn-group')) customElements.define('w-btn-group', WBtnGroup);
