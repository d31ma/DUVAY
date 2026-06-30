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
 */
import { wBoolAttr } from './utils.js';
import { WItemGroup } from './item-group.js';

export class WSlideGroup extends WItemGroup {
  static attrs = ['value', 'multiple', 'mandatory', 'selected-class', 'disabled', 'center-active', 'show-arrows', 'direction', 'prev-icon', 'next-icon'];

  get centerActive() { return wBoolAttr(this, 'center-active'); }
  get showArrows() { return wBoolAttr(this, 'show-arrows', true); }
  get arrowsAlways() { return this.getAttribute('show-arrows') === 'always'; }
  get direction() { return this._attr('direction', 'horizontal'); }
  get prevIcon() { return this._attr('prev-icon', '') || (this.direction === 'vertical' ? '↑' : '‹'); }
  get nextIcon() { return this._attr('next-icon', '') || (this.direction === 'vertical' ? '↓' : '›'); }

  connectedCallback() {
    super.connectedCallback();
    // Keep arrow state in sync as the container/content resizes.
    if (!this._resizeObserver && typeof ResizeObserver === 'function') {
      this._resizeObserver = new ResizeObserver(() => this._updateArrows());
      this._resizeObserver.observe(this);
    }
  }

  disconnectedCallback() {
    if (this._resizeObserver) { this._resizeObserver.disconnect(); this._resizeObserver = null; }
  }

  _template() {
    const vertical = this.direction === 'vertical';
    const alwaysClass = this.arrowsAlways ? ' w-slide-group-shell--arrows-always' : '';
    const prevArrow = this.showArrows
      ? `<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" data-slide-scroll="-1" aria-label="Previous items">${this._esc(this.prevIcon)}</button>`
      : '';
    const nextArrow = this.showArrows
      ? `<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" data-slide-scroll="1" aria-label="Next items">${this._esc(this.nextIcon)}</button>`
      : '';
    return `<div class="w-slide-group-shell${vertical ? ' w-slide-group-shell--vertical' : ''}${alwaysClass}">
      ${prevArrow}
      <div class="w-slide-group" role="group" tabindex="0"><slot></slot></div>
      ${nextArrow}
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
    active.scrollIntoView({
      behavior: 'smooth',
      block: this.centerActive ? 'center' : 'nearest',
      inline: this.centerActive ? 'center' : 'nearest',
    });
  }
}

if (!customElements.get('w-slide-group')) customElements.define('w-slide-group', WSlideGroup);
