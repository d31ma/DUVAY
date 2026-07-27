/* <w-counter> — character / item counter readout.
 *
 * Attributes:
 *   value      - current count
 *   max        - optional limit, rendered as "value / max"
 *   tween      - counts up from zero on render
 *   active     - `active="false"` hides the counter without unmounting it
 *   transition - named reveal transition; `none` / `false` turns it off
 */
import { wBoolAttr } from './utils.js';

export class WCounter extends WElement {
  static attrs = ['value', 'max', 'tween', 'active', 'transition'];

  get value() { return this._attr('value', '0'); }
  get max() { return this._attr('max', ''); }
  get tween() { return this._bool('tween'); }
  get active() { return wBoolAttr(this, 'active', true); }
  get transition() { return this._attr('transition', ''); }

  // `transition="none"` / `"false"` opts out; any other name selects the
  // matching modifier defined in messages.css.
  _transitionClass() {
    const value = String(this.transition).trim().toLowerCase();
    if (!value || value === 'none' || value === 'false') return '';
    return 'w-counter--transition-' + value.replace(/[^a-z0-9_-]+/g, '-');
  }

  _template() {
    const text = this.max ? `${this.value} / ${this.max}` : this.value;
    const classes = 'w-counter' + this._cls({
      'w-counter--inactive': !this.active,
      [this._transitionClass()]: true,
    });
    const attrs = this._attrs({ hidden: !this.active });
    return `<span class="${classes}"${attrs}>${this._esc(text)}</span>`;
  }

  _events() {
    if (!this.tween || !window.WMotion) return;
    const value = Number(this.value);
    if (!Number.isFinite(value)) return;
    const el = this._q('.w-counter');
    if (!el) return;
    window.WMotion.tween(el, {
      from: 0,
      to: value,
      duration: 700,
      suffix: this.max ? ` / ${this.max}` : '',
    });
  }
}

if (!customElements.get('w-counter')) customElements.define('w-counter', WCounter);
