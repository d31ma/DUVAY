/* <w-pull-to-refresh> — pull a scroll region past a threshold to refresh (Vuetify VPullToRefresh).
 *
 * Attributes:
 *   pull-down-threshold / threshold - pull distance (px) to trigger (default 64).
 *   refreshing / model-value        - externally control the refreshing state.
 *   disabled                        - disable the gesture.
 *
 * Events (fired when the threshold is crossed; both carry a `done` callback to
 * end the refreshing state, or call complete()):
 *   load   - Vuetify-style refresh event.
 *   change - back-compatible alias.
 *
 * Slot: default — the scrollable content.
 */
import { wBoolAttr, wNumberAttr } from './utils.js';

export class WPullToRefresh extends WElement {
  static attrs = ['threshold', 'pull-down-threshold', 'refreshing', 'model-value', 'disabled'];

  get threshold() {
    if (this.hasAttribute('pull-down-threshold')) return wNumberAttr(this, 'pull-down-threshold', 64);
    return wNumberAttr(this, 'threshold', 64);
  }
  get disabled() { return wBoolAttr(this, 'disabled'); }

  connectedCallback() {
    super.connectedCallback();
    if (wBoolAttr(this, 'refreshing') || wBoolAttr(this, 'model-value')) this.__refreshing = true;
  }

  _template() {
    const refreshing = this.__refreshing ? ' is-refreshing' : '';
    return `<div class="w-pull-to-refresh${refreshing}" data-pull-root>
      <div class="w-pull-indicator" aria-hidden="true"><span class="w-pull-spinner"></span>Pull to refresh</div>
      <slot></slot>
    </div>`;
  }

  _events() {
    const root = this._q('[data-pull-root]');
    if (!root || this.disabled) return;
    let startY = 0;
    let pulling = false;
    const reset = () => {
      pulling = false;
      root.style.setProperty('--w-pull-distance', '0px');
      root.classList.remove('is-pulling');
    };
    root.addEventListener('pointerdown', (event) => {
      if (root.scrollTop > 0 || this.__refreshing) return;
      startY = event.clientY;
      pulling = true;
      root.setPointerCapture?.(event.pointerId);
    });
    root.addEventListener('pointermove', (event) => {
      if (!pulling) return;
      const distance = Math.max(0, event.clientY - startY);
      if (!distance) return;
      root.classList.add('is-pulling');
      root.style.setProperty('--w-pull-distance', `${Math.min(distance, this.threshold * 1.35)}px`);
      event.preventDefault();
    });
    root.addEventListener('pointerup', () => {
      if (!pulling) return;
      const distance = parseFloat(root.style.getPropertyValue('--w-pull-distance')) || 0;
      if (distance >= this.threshold) this._refresh();
      reset();
    });
    root.addEventListener('pointercancel', reset);
  }

  complete() {
    this.__refreshing = false;
    this._q('[data-pull-root]')?.classList.remove('is-refreshing');
  }

  _refresh() {
    if (this.__refreshing) return;
    this.__refreshing = true;
    this._q('[data-pull-root]')?.classList.add('is-refreshing');
    const detail = { done: () => this.complete() };
    this._emit('load', detail);
    this._emit('change', detail);
  }
}

if (!customElements.get('w-pull-to-refresh')) customElements.define('w-pull-to-refresh', WPullToRefresh);
