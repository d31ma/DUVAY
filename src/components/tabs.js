/* <w-tabs> — Tab container web component
 *
 * Manages activation of child <w-tab> elements. Only one tab is active at a
 * time. Pairs with <w-tabs-window> / <w-tabs-window-item> for panel content.
 *
 * Attributes:
 *   value         - the currently active tab value
 *   variant       - `pills` for the pill style (omit for the underline style)
 *   align-tabs    - `start` (default) | `center` | `end`
 *   fixed-tabs    - boolean; equal-width tabs capped at --w-tab-max-width
 *   grow          - boolean; equal-width tabs filling the strip (no cap)
 *   direction     - `horizontal` (default) | `vertical`
 *   stacked       - boolean; icon stacked above label
 *   center-active - boolean; keep the active tab scrolled to center
 *   hide-slider   - boolean; remove the active indicator entirely
 *   slider-color  - palette token name for the indicator (e.g. `primary`)
 *   color         - palette token name for the active tab text + default slider
 *   bg-color      - palette token name for the strip background
 *   density       - `comfortable` | `compact`
 *   disabled      - boolean; disable the whole strip
 *   show-arrows   - boolean; overflow pagination arrows
 *   prev-icon / next-icon - custom glyphs for the pagination arrows
 *
 * Events:
 *   change - fires when the active tab changes (detail: { value })
 *
 * Usage:
 *   <w-tabs value="inbox" align-tabs="center" slider-color="primary">
 *     <w-tab value="inbox">Inbox</w-tab>
 *     <w-tab value="drafts">Drafts</w-tab>
 *     <w-tab value="sent">Sent</w-tab>
 *   </w-tabs>
 *
 * The active indicator is progressively enhanced: hand-authored markup shows a
 * static underline, while the web component renders an animated slider that
 * glides between tabs (and falls back to the underline when JS is absent).
 */

class WTabs extends WElement {

  static attrs = [
    'value', 'variant', 'align-tabs', 'fixed-tabs', 'grow', 'direction',
    'stacked', 'center-active', 'hide-slider', 'slider-color', 'show-arrows',
    'prev-icon', 'next-icon',
  ];

  get value()  { return this._attr('value', ''); }
  set value(v) { this.setAttribute('value', v); }
  get variant() { return this._attr('variant', ''); }
  get alignTabs() { return this._attr('align-tabs', 'start'); }
  get direction() { return this._attr('direction', 'horizontal'); }
  get fixedTabs() { return this.hasAttribute('fixed-tabs'); }
  get grow() { return this.hasAttribute('grow'); }
  get stacked() { return this.hasAttribute('stacked'); }
  get centerActive() { return this.hasAttribute('center-active'); }
  get showArrows() { return this.hasAttribute('show-arrows'); }
  get hideSlider() { return this.hasAttribute('hide-slider'); }
  get prevIcon() { return this._attr('prev-icon', ''); }
  get nextIcon() { return this._attr('next-icon', ''); }

  get _vertical() { return this.direction === 'vertical'; }
  // Pills carry their own active background, so the sliding bar is suppressed.
  get _hasSlider() { return !this.hideSlider && this.variant !== 'pills'; }

  connectedCallback() {
    super.connectedCallback();
    // Re-sync when child tabs are added/removed.
    if (!this._observer) {
      this._observer = new MutationObserver(() => {
        this._syncTabs();
        this._positionSlider();
      });
      this._observer.observe(this, { childList: true, subtree: false });
    }
    // Keep the slider aligned through reflows (resize, font swap, zoom).
    if (!this._resizeObserver && typeof ResizeObserver === 'function') {
      this._resizeObserver = new ResizeObserver(() => this._positionSlider());
      this._resizeObserver.observe(this);
    }
  }

  disconnectedCallback() {
    if (this._observer) { this._observer.disconnect(); this._observer = null; }
    if (this._resizeObserver) { this._resizeObserver.disconnect(); this._resizeObserver = null; }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    // Activating a tab must not rebuild the strip — otherwise the slider can't
    // animate. Reflect value by syncing active state in place.
    if (name === 'value') {
      if (this._rendered && oldVal !== newVal && !this._skipRender) {
        this._syncTabs();
        this._positionSlider();
        if (this.centerActive) this._scrollActiveIntoView();
      }
      return;
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  _template() {
    const strip = ['w-tabs'];
    if (this.variant === 'pills') strip.push('w-tabs-pills');
    if (this.alignTabs === 'center') strip.push('w-tabs--align-center');
    else if (this.alignTabs === 'end') strip.push('w-tabs--align-end');
    if (this.fixedTabs) strip.push('w-tabs--fixed');
    if (this.grow) strip.push('w-tabs--grow');
    if (this.stacked) strip.push('w-tabs--stacked');
    if (this._vertical) strip.push('w-tabs--vertical');
    if (this._hasSlider) strip.push('w-tabs--js-slider');
    else if (this.hideSlider) strip.push('w-tabs--no-slider');

    const slider = this._hasSlider ? '<span class="w-tabs-slider" aria-hidden="true"></span>' : '';
    const orientation = this._vertical ? ' aria-orientation="vertical"' : '';
    const stripEl = `<div class="${strip.join(' ')}" role="tablist"${orientation}><slot></slot>${slider}</div>`;

    if (!this.showArrows) return stripEl;

    const vert = this._vertical;
    const prevGlyph = this._esc(this.prevIcon || (vert ? '↑' : '‹'));
    const nextGlyph = this._esc(this.nextIcon || (vert ? '↓' : '›'));
    const prev = `<button class="w-tabs-arrow w-tabs-arrow--prev" type="button" data-tabs-scroll="-1" aria-label="Previous tabs">${prevGlyph}</button>`;
    const next = `<button class="w-tabs-arrow w-tabs-arrow--next" type="button" data-tabs-scroll="1" aria-label="Next tabs">${nextGlyph}</button>`;
    return `<div class="w-tabs-shell${vert ? ' w-tabs-shell--vertical' : ''}">${prev}${stripEl}${next}</div>`;
  }

  _events() {
    const container = this._q('.w-tabs');
    if (!container) return;

    // Delegate clicks from child tab buttons / links.
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.w-tab');
      if (!btn) return;
      const tabEl = btn.closest('w-tab');
      if (!tabEl || tabEl.disabled) return;
      this._activateTab(tabEl);
      // Link tabs keep their default navigation.
    });

    // Keyboard navigation (orientation-aware).
    container.addEventListener('keydown', (e) => {
      const nextKey = this._vertical ? 'ArrowDown' : 'ArrowRight';
      const prevKey = this._vertical ? 'ArrowUp' : 'ArrowLeft';
      let move;
      if (e.key === nextKey) move = 1;
      else if (e.key === prevKey) move = -1;
      else if (e.key === 'Home') move = 'home';
      else if (e.key === 'End') move = 'end';
      else return;
      e.preventDefault();
      this._moveFocus(move);
    });

    // Overflow pagination arrows.
    this._qAll('[data-tabs-scroll]').forEach((button) => {
      button.addEventListener('click', () => this._scrollByPage(Number(button.getAttribute('data-tabs-scroll'))));
    });
    if (this.showArrows) {
      container.addEventListener('scroll', () => this._updateArrows(), { passive: true });
    }

    this._syncTabs();
    requestAnimationFrame(() => {
      this._positionSlider();
      this._updateArrows();
      if (this.centerActive) this._scrollActiveIntoView();
    });
    // Web fonts can change tab widths after first paint — realign once ready.
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this._positionSlider());
    }
  }

  _getTabElements() {
    return Array.from(this.querySelectorAll('w-tab'));
  }

  _moveFocus(move) {
    const tabs = this._getTabElements().filter((t) => !t.disabled);
    if (!tabs.length) return;
    const activeIndex = tabs.findIndex((t) => t.active);
    let nextIndex;
    if (move === 'home') nextIndex = 0;
    else if (move === 'end') nextIndex = tabs.length - 1;
    else {
      const start = activeIndex < 0 ? 0 : activeIndex;
      nextIndex = (start + move + tabs.length) % tabs.length;
    }
    const nextTab = tabs[nextIndex];
    if (!nextTab) return;
    this._activateTab(nextTab);
    const focusTarget = nextTab.querySelector('.w-tab');
    if (focusTarget) focusTarget.focus();
  }

  _syncTabs() {
    const currentValue = this.value;
    this._getTabElements().forEach((tab) => {
      const shouldBeActive = tab.value === currentValue;
      if (tab.active !== shouldBeActive) tab.active = shouldBeActive;
    });
  }

  _activateTab(tabEl) {
    if (!tabEl || tabEl.disabled) return;
    const newValue = tabEl.value;
    if (this.value === newValue) return;
    this.value = newValue; // → attributeChangedCallback → _syncTabs + _positionSlider
    this._emit('change', { value: newValue });
  }

  _activeButton() {
    const active = this._getTabElements().find((t) => t.active);
    return active ? active.querySelector('.w-tab') : null;
  }

  _positionSlider() {
    if (!this._hasSlider) return;
    const slider = this._q('.w-tabs-slider');
    const strip = this._q('.w-tabs');
    if (!slider || !strip) return;
    const btn = this._activeButton();
    if (!btn) { slider.style.width = '0'; slider.style.height = '0'; return; }
    if (this._vertical) {
      slider.style.width = '';
      slider.style.height = btn.offsetHeight + 'px';
      slider.style.transform = `translateY(${btn.offsetTop}px)`;
    } else {
      slider.style.height = '';
      slider.style.width = btn.offsetWidth + 'px';
      slider.style.transform = `translateX(${btn.offsetLeft}px)`;
    }
  }

  _scrollByPage(direction) {
    const strip = this._q('.w-tabs');
    if (!strip) return;
    if (this._vertical) strip.scrollBy({ top: direction * strip.clientHeight * 0.8, behavior: 'smooth' });
    else strip.scrollBy({ left: direction * strip.clientWidth * 0.8, behavior: 'smooth' });
  }

  _scrollActiveIntoView() {
    const btn = this._activeButton();
    if (!btn) return;
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  _updateArrows() {
    if (!this.showArrows) return;
    const strip = this._q('.w-tabs');
    if (!strip) return;
    const prev = this._q('.w-tabs-arrow--prev');
    const next = this._q('.w-tabs-arrow--next');
    const pos = this._vertical ? strip.scrollTop : strip.scrollLeft;
    const max = this._vertical
      ? strip.scrollHeight - strip.clientHeight
      : strip.scrollWidth - strip.clientWidth;
    if (prev) prev.disabled = pos <= 1;
    if (next) next.disabled = pos >= max - 1;
  }

  _applyCommonProps() {
    super._applyCommonProps();
    // Map palette-token attribute values to the strip's local custom properties.
    const setVar = (prop, attr) => {
      const v = this.getAttribute(attr);
      if (v) this.style.setProperty(prop, `var(--w-${v})`);
      else this.style.removeProperty(prop);
    };
    setVar('--w-tabs-color', 'color');
    setVar('--w-tabs-slider-color', 'slider-color');
    setVar('--w-tabs-bg', 'bg-color');
  }
}

customElements.define('w-tabs', WTabs);
