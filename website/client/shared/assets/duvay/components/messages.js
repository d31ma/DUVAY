/* <w-messages> — hint / validation message line.
 *
 * Attributes:
 *   error      - renders the message in the error colour
 *   messages   - one message, or a comma-separated / JSON list of them
 *   active     - `active="false"` hides the line without unmounting it
 *   transition - named reveal transition; `none` / `false` turns it off
 */
import { wBoolAttr, wValueList } from './utils.js';

export class WMessages extends WElement {
  static attrs = ['error', 'messages', 'active', 'transition'];

  get error() { return this._bool('error'); }
  get active() { return wBoolAttr(this, 'active', true); }
  get messages() { return wValueList(this._attr('messages', '')); }
  get transition() { return this._attr('transition', ''); }

  // `transition="none"` / `"false"` opts out; any other name selects the
  // matching modifier defined in messages.css.
  _transitionClass() {
    const value = String(this.transition).trim().toLowerCase();
    if (!value || value === 'none' || value === 'false') return '';
    return 'w-messages--transition-' + value.replace(/[^a-z0-9_-]+/g, '-');
  }

  _template() {
    const classes = 'w-messages' + this._cls({
      error: this.error,
      'w-messages--inactive': !this.active,
      [this._transitionClass()]: true,
    });
    const items = this.messages.map((message) => (
      `<span class="w-messages-item">${this._esc(message)}</span>`
    )).join('');
    const attrs = this._attrs({ hidden: !this.active, 'aria-live': 'polite' });
    return `<p class="${classes}"${attrs}>${items}<slot></slot></p>`;
  }
}

if (!customElements.get('w-messages')) customElements.define('w-messages', WMessages);
