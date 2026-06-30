/* <w-tab> — Individual tab button for use inside <w-tabs>
 *
 * Attributes:
 *   value    - identifier value for this tab
 *   active   - whether this tab is selected
 *   disabled - disables the tab
 *   stacked  - stack icon above label (column layout)
 *   href     - render a link tab (<a>) instead of a <button>
 *   ripple   - opt-in press-ripple visual (off by default)
 *
 * Slots:
 *   default - tab label content (icon + text, etc.)
 */

class WTab extends WElement {

  static attrs = ['value', 'active', 'disabled', 'stacked', 'href', 'ripple'];

  get value()    { return this._attr('value', ''); }
  get active()   { return this._bool('active'); }
  set active(v)  { v ? this.setAttribute('active', '') : this.removeAttribute('active'); }
  get disabled() { return this._bool('disabled'); }
  get stacked()  { return this.hasAttribute('stacked'); }
  get href()     { return this._attr('href', ''); }

  _template() {
    const cls = `w-tab${this.active ? ' active' : ''}${this.stacked ? ' w-tab--stacked' : ''}`;
    const selected = this.active ? 'true' : 'false';

    // Link tabs render an anchor so they participate in normal navigation.
    // A disabled link is downgraded to a disabled button.
    if (this.href && !this.disabled) {
      return `<a class="${cls}" href="${this._esc(this.href)}" role="tab" aria-selected="${selected}">
      <slot></slot>
    </a>`;
    }

    const dis = this.disabled ? ' disabled aria-disabled="true"' : '';
    return `<button class="${cls}"${dis} type="button" role="tab" aria-selected="${selected}">
      <slot></slot>
    </button>`;
  }

  _events() {
    if (this.hasAttribute('ripple')) this._attachRipple(this._q('button, a'));
  }
}

customElements.define('w-tab', WTab);
