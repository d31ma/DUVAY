/* <w-infinite-scroll> — load content as the user reaches an edge, mirroring
 * Vuetify's <v-infinite-scroll>.
 *
 * Emits `load` with `{ side, done }`; call `done(status)` when the fetch
 * settles: "ok" (more available), "empty" (stop), or "error" (show retry).
 *
 * Attributes:
 *   mode            - "intersect" (default, auto-load) | "manual" (Load more button)
 *   side            - "end" (default) | "start" | "both"
 *   direction       - "vertical" (default) | "horizontal"
 *   color           - token / CSS color for the spinner and Load-more button
 *   height          - scroll-area size (max-height by default)
 *   margin          - intersection margin in px before the edge (default 96)
 *   disabled        - stop emitting load events
 *   status          - idle | loading | empty | error (reflected)
 *   load-more-text  - manual button label (default "Load more")
 *   loading-text    - loading label (default "Loading…")
 *   empty-text      - exhausted label (default "No more items")
 *   error-text      - error label (default "Something went wrong")
 *
 * Slot: default — the scrollable content.
 */
import { wBoolAttr, wNumberAttr } from './utils.js';

export class WInfiniteScroll extends WElement {
  static attrs = ['mode', 'side', 'direction', 'color', 'height', 'margin', 'threshold',
    'disabled', 'status', 'load-more-text', 'loading-text', 'empty-text', 'error-text'];

  get mode() { return this._attr('mode', 'intersect'); }
  get side() { return this._attr('side', 'end'); }
  get direction() { return this._attr('direction', 'vertical'); }
  get horizontal() { return this.direction === 'horizontal'; }
  get color() { return this._attr('color', ''); }
  get height() { return this._attr('height', '260px'); }
  get margin() { return wNumberAttr(this, 'margin', wNumberAttr(this, 'threshold', 96)); }
  get disabled() { return wBoolAttr(this, 'disabled'); }
  get status() { return this._attr('status', 'idle'); }
  get loadMoreText() { return this._attr('load-more-text', 'Load more'); }
  get loadingText() { return this._attr('loading-text', 'Loading…'); }
  get emptyText() { return this._attr('empty-text', 'No more items'); }
  get errorText() { return this._attr('error-text', 'Something went wrong'); }

  get sides() { return this.side === 'both' ? ['start', 'end'] : [this.side]; }

  _color(c) {
    c = String(c).trim();
    return /^[a-z][a-z0-9-]*$/i.test(c) ? `var(--w-${c}, ${c})` : c;
  }

  _template() {
    const cls = `w-infinite-scroll${this.horizontal ? ' w-infinite-scroll--horizontal' : ''}`;
    const sizeProp = this.horizontal ? 'max-width' : 'max-height';
    const colorVar = this.color ? `;--w-infinite-color:${this._color(this.color)}` : '';
    const trigger = (side) => `<div class="w-infinite-scroll-trigger" data-side="${side}" role="status">${this._triggerContent()}</div>`;
    return `<div class="${cls}" style="${sizeProp}:${this._esc(this.height)}${colorVar}" data-infinite-scroll>
      ${this.sides.includes('start') ? trigger('start') : ''}
      <div class="w-infinite-scroll-content"><slot></slot></div>
      ${this.sides.includes('end') ? trigger('end') : ''}
    </div>`;
  }

  _triggerContent() {
    const s = this.status;
    if (s === 'loading') return `<span class="w-infinite-scroll-spinner" aria-hidden="true"></span><span>${this._esc(this.loadingText)}</span>`;
    if (s === 'empty') return `<span class="w-infinite-scroll-empty">${this._esc(this.emptyText)}</span>`;
    if (s === 'error') return `<span class="w-infinite-scroll-error">${this._esc(this.errorText)}</span> <button type="button" class="w-btn w-btn-text" data-retry>Retry</button>`;
    if (this.mode === 'manual') return `<button type="button" class="w-btn w-btn-tonal" data-load-more>${this._esc(this.loadMoreText)}</button>`;
    return ''; // intersect sentinel — observed, no visible content
  }

  _events() {
    const scroller = this._q('[data-infinite-scroll]');
    if (!scroller) return;
    this._scroller = scroller;
    this._bindButtons();

    if (this.mode === 'manual') return;

    // Intersect mode — IntersectionObserver with a scroll fallback.
    if ('IntersectionObserver' in window) {
      this.__io?.disconnect();
      this.__io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this._requestLoad(entry.target.getAttribute('data-side') || 'end');
        });
      }, { root: scroller, rootMargin: `${this.margin}px` });
      this._observeTriggers();
    }

    this.__onScroll = () => this._checkScroll();
    scroller.addEventListener('scroll', this.__onScroll, { passive: true });
  }

  _bindButtons() {
    this._qAll('[data-load-more], [data-retry]').forEach((btn) => {
      const side = btn.closest('[data-side]')?.getAttribute('data-side') || 'end';
      btn.addEventListener('click', () => this._requestLoad(side));
    });
  }

  _observeTriggers() {
    if (!this.__io) return;
    this._qAll('.w-infinite-scroll-trigger').forEach((t) => { this.__io.unobserve(t); this.__io.observe(t); });
  }

  _checkScroll() {
    const el = this._scroller;
    if (!el) return;
    const nearStart = (this.horizontal ? el.scrollLeft : el.scrollTop) <= this.margin;
    const size = this.horizontal ? el.scrollWidth - el.clientWidth - el.scrollLeft : el.scrollHeight - el.clientHeight - el.scrollTop;
    const nearEnd = size <= this.margin;
    if (this.sides.includes('start') && nearStart) this._requestLoad('start');
    if (this.sides.includes('end') && nearEnd) this._requestLoad('end');
  }

  _requestLoad(side) {
    if (this.__loading || this.disabled || this.status === 'empty') return;
    this.__loading = true;
    this.__side = side;
    this._setStatus('loading');
    this._emit('load', { side, done: (status) => this._done(status) });
  }

  _done(status) {
    this.__loading = false;
    // 'ok' → idle (more available); pass through empty / error.
    this._setStatus(status === 'ok' || !status ? 'idle' : status);
    if (this.status === 'idle' && this.mode === 'intersect') {
      // Re-check in case the new content still leaves the sentinel in view.
      requestAnimationFrame(() => this._observeTriggers());
    }
  }

  // Update status + re-render the trigger content only (never the scroller, so
  // scroll position and slotted content are preserved across loads).
  _setStatus(status) {
    this._silentSet('status', status);
    this._qAll('.w-infinite-scroll-trigger').forEach((t) => { t.innerHTML = this._triggerContent(); });
    this._bindButtons();
  }

  // Public API.
  complete(status = 'empty') { this._done(status); }
  reset() { this.__loading = false; this._setStatus('idle'); this._observeTriggers(); }

  disconnectedCallback() {
    this.__io?.disconnect();
    if (this._scroller && this.__onScroll) this._scroller.removeEventListener('scroll', this.__onScroll);
  }
}

if (!customElements.get('w-infinite-scroll')) customElements.define('w-infinite-scroll', WInfiniteScroll);
