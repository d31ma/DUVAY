/* <w-lazy> — defer rendering of content until it scrolls into view (Vuetify VLazy).
 *
 * Attributes:
 *   active / model-value - force the content active (skip the observer).
 *   transition           - reveal transition name (default "fade"; "none" disables).
 *   height               - fixed height while inactive (placeholder sizing).
 *   min-height           - minimum placeholder height (default 160px).
 *   root-margin          - IntersectionObserver rootMargin (default 0px).
 *   threshold            - IntersectionObserver threshold (default 0).
 *
 * Events:
 *   load              - fired once when the content activates (detail: { value: true }).
 *   update:modelValue - fired with the new active boolean.
 *
 * Slot: default — content rendered once active.
 */
import { wBoolAttr, wNumberAttr } from './utils.js';

export class WLazy extends WElement {
  static attrs = ['active', 'model-value', 'transition', 'height', 'min-height', 'root-margin', 'threshold'];

  get active() { return wBoolAttr(this, 'active') || wBoolAttr(this, 'model-value'); }
  get transition() { return this._attr('transition', 'fade'); }
  get height() { return this._attr('height', ''); }
  get minHeight() { return this._attr('min-height', '160px'); }
  get rootMargin() { return this._attr('root-margin', '0px'); }
  get threshold() { return wNumberAttr(this, 'threshold', 0); }

  _template() {
    const active = this.active;
    const transition = this.transition && this.transition !== 'none' ? ` w-lazy--transition-${this._esc(this.transition)}` : '';
    const style = this.height
      ? ` style="height:${this._esc(this.height)}"`
      : ` style="min-height:${this._esc(this.minHeight)}"`;
    return `<div class="w-lazy${active ? ' is-active' : ''}${transition}"${style} data-lazy-root>
      <slot${active ? '' : ' hidden'}></slot>
      <div class="w-lazy-placeholder"${active ? ' hidden' : ''} aria-hidden="true"></div>
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
      this._emit('update:modelValue', { value: true });
    }, { rootMargin: this.rootMargin, threshold: this.threshold });
    this.__io.observe(root);
  }

  disconnectedCallback() {
    this.__io?.disconnect();
  }
}

if (!customElements.get('w-lazy')) customElements.define('w-lazy', WLazy);
