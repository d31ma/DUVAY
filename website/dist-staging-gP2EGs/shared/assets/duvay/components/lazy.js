/* <w-lazy> — DuVay component module */
import { wBoolAttr, wNumberAttr } from './utils.js';

export class WLazy extends WElement {
  static attrs = ['active', 'height', 'min-height', 'root-margin', 'threshold'];

  get active() { return wBoolAttr(this, 'active'); }
  get height() { return this._attr('height', ''); }
  get minHeight() { return this._attr('min-height', '160px'); }
  get rootMargin() { return this._attr('root-margin', '0px'); }
  get threshold() { return wNumberAttr(this, 'threshold', 0); }

  _template() {
    const style = this.height
      ? ` style="height:${this._esc(this.height)}"`
      : ` style="min-height:${this._esc(this.minHeight)}"`;
    return `<div class="w-lazy${this.active ? ' is-active' : ''}"${style} data-lazy-root>
      <slot${this.active ? '' : ' hidden'}></slot>
      <div class="w-lazy-placeholder"${this.active ? ' hidden' : ''} aria-hidden="true"></div>
    </div>`;
  }

  _events() {
    if (this.active) return;
    const root = this._q('[data-lazy-root]');
    if (!root || !('IntersectionObserver' in window)) return;
    this.__io?.disconnect();
    this.__io = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      this.__io?.disconnect();
      this.setAttribute('active', '');
      this._emit('load', { value: true });
    }, { rootMargin: this.rootMargin, threshold: this.threshold });
    this.__io.observe(root);
  }

  disconnectedCallback() {
    this.__io?.disconnect();
  }
}

if (!customElements.get('w-lazy')) customElements.define('w-lazy', WLazy);
