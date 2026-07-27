/* <w-slide-group> — DuVay component module
 *
 * Attributes (plus everything from <w-item-group>):
 *   center-active  - keep the selected item centered
 *   direction      - horizontal (default) | vertical
 *   show-arrows    - true (default) | false | always
 *                    `true`  shows arrows only when the content overflows,
 *                            disabling each at the reached end;
 *                    `always` keeps them visible (still disabled at the ends);
 *                    `false`  hides them entirely.
 *   prev-icon / next-icon - custom arrow glyphs (defaults ‹/› or ↑/↓ vertical)
 *   scroll-to-active - keep the selected item visible as the container resizes
 *   content-class  - extra classes applied to the scrolling content element
 *   mobile         - force the touch-first layout: no arrows, native scrolling
 *   mobile-breakpoint - xs…xxl or a px width below which `mobile` applies
 */
import { wBoolAttr } from './utils.js';
import { WItemGroup } from './item-group.js';

// Screen widths (px) behind the named `mobile-breakpoint` values.
const W_SLIDE_BREAKPOINTS = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 };

export class WSlideGroup extends WItemGroup {
  static attrs = ['value', 'multiple', 'mandatory', 'selected-class', 'disabled',
    'center-active', 'show-arrows', 'direction', 'prev-icon', 'next-icon',
    'scroll-to-active', 'content-class', 'mobile', 'mobile-breakpoint'];

  get centerActive() { return wBoolAttr(this, 'center-active'); }
  get scrollToActive() { return wBoolAttr(this, 'scroll-to-active'); }
  get contentClass() { return this._attr('content-class', ''); }
  // Arrows are pointer affordances; the touch-first layout drops them.
  get showArrows() { return wBoolAttr(this, 'show-arrows', true) && !this.mobile; }

  get mobile() {
    if (wBoolAttr(this, 'mobile')) return true;
    const query = this._mobileQuery();
    return !!query && typeof matchMedia === 'function' && matchMedia(query).matches;
  }

  _mobileQuery() {
    const raw = this._attr('mobile-breakpoint', '');
    if (!raw) return '';
    const px = raw in W_SLIDE_BREAKPOINTS ? W_SLIDE_BREAKPOINTS[raw] : Number(raw);
    return Number.isFinite(px) && px > 0 ? `(max-width: ${px - 0.02}px)` : '';
  }
  get arrowsAlways() { return this.getAttribute('show-arrows') === 'always'; }
  get direction() { return this._attr('direction', 'horizontal'); }
  get prevIcon() { return this._attr('prev-icon', '') || (this.direction === 'vertical' ? '↑' : '‹'); }
  get nextIcon() { return this._attr('next-icon', '') || (this.direction === 'vertical' ? '↓' : '›'); }

  connectedCallback() {
    super.connectedCallback();
    // Keep arrow state in sync as the container/content resizes, and — with
    // `scroll-to-active` — keep the selected item from scrolling out of view.
    if (!this._resizeObserver && typeof ResizeObserver === 'function') {
      this._resizeObserver = new ResizeObserver(() => this._onResize());
      this._resizeObserver.observe(this);
    }
    this._bindMobileQuery();
  }

  _onResize() {
    this._updateArrows();
    if (this.scrollToActive) this._scrollActiveIntoView();
  }

  // Re-render when the viewport crosses the mobile breakpoint.
  _bindMobileQuery() {
    const query = this._mobileQuery();
    if (!query || this._wMobileBound === query || typeof matchMedia !== 'function') return;
    this._wMobileBound = query;
    matchMedia(query).addEventListener('change', () => this._rerenderGroup());
  }

  _rerenderGroup() {
    if (!this.isConnected) return;
    this._render();
    this._events();
  }

  disconnectedCallback() {
    if (this._resizeObserver) { this._resizeObserver.disconnect(); this._resizeObserver = null; }
  }

  _shellClasses() {
    return 'w-slide-group-shell' + this._cls({
      'w-slide-group-shell--vertical': this.direction === 'vertical',
      'w-slide-group-shell--arrows-always': this.arrowsAlways,
      'w-slide-group-shell--mobile': this.mobile,
    });
  }

  _contentClasses() {
    const extra = this.contentClass.trim();
    return 'w-slide-group' + (extra ? ' ' + this._esc(extra) : '');
  }

  _arrow(direction, label, glyph) {
    if (!this.showArrows) return '';
    return `<button class="w-slide-group-arrow w-slide-group-arrow--${direction}" type="button" data-slide-scroll="${direction === 'prev' ? -1 : 1}" aria-label="${label}">${this._esc(glyph)}</button>`;
  }

  _template() {
    return `<div class="${this._shellClasses()}">
      ${this._arrow('prev', 'Previous items', this.prevIcon)}
      <div class="${this._contentClasses()}" role="group" tabindex="0"><slot></slot></div>
      ${this._arrow('next', 'Next items', this.nextIcon)}
    </div>`;
  }

  _events() {
    super._events();
    const scroller = this._q('.w-slide-group');
    if (!scroller) return;
    this._qAll('[data-slide-scroll]').forEach((button) => {
      button.addEventListener('click', () => this._scrollByPage(Number(button.getAttribute('data-slide-scroll'))));
    });
    scroller.addEventListener('scroll', () => this._updateArrows(), { passive: true });
    scroller.addEventListener('keydown', (event) => {
      const horizontal = this.direction !== 'vertical';
      if ((horizontal && event.key === 'ArrowRight') || (!horizontal && event.key === 'ArrowDown')) {
        event.preventDefault();
        this._focusSibling(1);
      }
      if ((horizontal && event.key === 'ArrowLeft') || (!horizontal && event.key === 'ArrowUp')) {
        event.preventDefault();
        this._focusSibling(-1);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        this._focusItem(this._items()[0]);
      }
      if (event.key === 'End') {
        event.preventDefault();
        this._focusItem(this._items().at(-1));
      }
    });
    this._scrollActiveIntoView();
    requestAnimationFrame(() => this._updateArrows());
  }

  _setSelected(selected) {
    super._setSelected(selected);
    this._scrollActiveIntoView();
    this._updateArrows();
  }

  // An item's own `selected-class` is applied on top of the group's, so one
  // slide can carry a different highlight from the rest.
  _syncGroupItems() {
    super._syncGroupItems();
    this._items().forEach((item) => {
      const name = item.getAttribute('selected-class');
      if (name) item.classList.toggle(name, item.hasAttribute('selected'));
    });
  }

  _updateArrows() {
    const shell = this._q('.w-slide-group-shell');
    const scroller = this._q('.w-slide-group');
    if (!shell || !scroller) return;
    const horizontal = this.direction !== 'vertical';
    const pos = horizontal ? scroller.scrollLeft : scroller.scrollTop;
    const size = horizontal ? scroller.scrollWidth : scroller.scrollHeight;
    const client = horizontal ? scroller.clientWidth : scroller.clientHeight;
    const max = size - client;
    shell.classList.toggle('w-slide-group-shell--overflow', max > 1);
    // Tolerance absorbs the scroller's scroll-axis padding + scroll-snap rest
    // position (which can leave the top/bottom a few px from 0/max).
    const edge = 4;
    const prev = this._q('.w-slide-group-arrow--prev');
    const next = this._q('.w-slide-group-arrow--next');
    if (prev) prev.disabled = pos <= edge;
    if (next) next.disabled = pos >= max - edge;
  }

  _scrollByPage(direction) {
    const scroller = this._q('.w-slide-group');
    if (!scroller) return;
    const horizontal = this.direction !== 'vertical';
    scroller.scrollBy({
      left: horizontal ? direction * scroller.clientWidth * 0.8 : 0,
      top: horizontal ? 0 : direction * scroller.clientHeight * 0.8,
      behavior: 'smooth',
    });
  }

  _focusSibling(direction) {
    const items = this._items().filter((item) => !item.hasAttribute('disabled'));
    const current = document.activeElement;
    const currentIndex = items.findIndex((item) => item === current || item.contains(current));
    const index = Math.max(0, currentIndex);
    const next = items[Math.max(0, Math.min(items.length - 1, index + direction))];
    this._focusItem(next);
  }

  _focusItem(item) {
    if (!item) return;
    const focusTarget = item.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || item;
    focusTarget.focus({ preventScroll: true });
    item.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  _scrollActiveIntoView() {
    const active = this._items().find((item) => item.classList.contains(this.selectedClass) || item.hasAttribute('selected'));
    if (!active) return;
    // The item host is display:contents and so has no box of its own — scroll
    // the box it rendered instead, or nothing moves.
    const target = active.querySelector('.w-slide-group-item') || active;
    target.scrollIntoView({
      behavior: 'smooth',
      block: this.centerActive ? 'center' : 'nearest',
      inline: this.centerActive ? 'center' : 'nearest',
    });
  }
}

if (!customElements.get('w-slide-group')) customElements.define('w-slide-group', WSlideGroup);
