/* <w-infinite-scroll> — DuVay component module */
import { wBoolAttr, wNumberAttr } from './utils.js';

export class WInfiniteScroll extends WElement {
  static attrs = ['height', 'disabled', 'threshold', 'status'];

  get height() { return this._attr('height', '260px'); }
  get disabled() { return wBoolAttr(this, 'disabled'); }
  get threshold() { return wNumberAttr(this, 'threshold', 96); }
  get status() { return this._attr('status', 'idle'); }

  _template() {
    const status = this.status === 'empty' ? 'No more content' : this.status === 'loading' ? 'Loading...' : 'Scroll for more';
    return `<div class="w-infinite-scroll" style="max-height:${this._esc(this.height)}" data-infinite-scroll>
      <slot></slot>
      <div class="w-infinite-scroll-trigger" role="status">${this._esc(status)}</div>
    </div>`;
  }

  _events() {
    const scroller = this._q('[data-infinite-scroll]');
    const trigger = this._q('.w-infinite-scroll-trigger');
    if (!scroller || !trigger || this.disabled) return;
    const requestLoad = () => this._requestLoad();
    scroller.addEventListener('scroll', () => {
      const remaining = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
      if (remaining <= this.threshold) requestLoad();
    });
    if ('IntersectionObserver' in window) {
      this.__io?.disconnect();
      this.__io = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) requestLoad();
      }, { root: scroller, rootMargin: `${this.threshold}px` });
      this.__io.observe(trigger);
    }
  }

  disconnectedCallback() {
    this.__io?.disconnect();
  }

  complete(status = 'idle') {
    this.__loading = false;
    this._silentSet('status', status);
    const trigger = this._q('.w-infinite-scroll-trigger');
    if (trigger) trigger.textContent = status === 'empty' ? 'No more content' : 'Scroll for more';
  }

  _requestLoad() {
    if (this.__loading || this.disabled || this.status === 'empty') return;
    this.__loading = true;
    this._silentSet('status', 'loading');
    const trigger = this._q('.w-infinite-scroll-trigger');
    if (trigger) trigger.textContent = 'Loading...';
    this._emit('w-load', { done: (status) => this.complete(status) });
  }
}

if (!customElements.get('w-infinite-scroll')) customElements.define('w-infinite-scroll', WInfiniteScroll);
