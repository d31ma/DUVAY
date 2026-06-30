/* <w-pull-to-refresh> — DuVay component module */
import { wBoolAttr, wNumberAttr } from './utils.js';

export class WPullToRefresh extends WElement {
  static attrs = ['threshold', 'disabled'];

  get threshold() { return wNumberAttr(this, 'threshold', 72); }
  get disabled() { return wBoolAttr(this, 'disabled'); }

  _template() {
    return `<div class="w-pull-to-refresh" data-pull-root>
      <div class="w-pull-indicator" aria-hidden="true">Pull to refresh</div>
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
    this._emit('w-refresh', { done: () => this.complete() });
  }
}

if (!customElements.get('w-pull-to-refresh')) customElements.define('w-pull-to-refresh', WPullToRefresh);
