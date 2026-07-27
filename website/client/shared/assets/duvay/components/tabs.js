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
 *   multiple      - boolean; allow several tabs to be active at once. `value`
 *                   then reads/writes a JSON array and `change` carries one.
 *   max           - with `multiple`, the maximum number of active tabs
 *   mandatory     - keep one tab active (default). `mandatory="false"` lets a
 *                   click on the active tab deselect it.
 *   items         - JSON array of strings or { text, value, disabled } records
 *                   that generates the <w-tab> children
 *   selected-class - extra class applied to the active <w-tab> host
 *   content-class  - extra classes applied to every <w-tab> host
 *   inset          - inset strip: full-height slider, spacing and rounding
 *   inset-padding  - spacing between tabs in inset mode
 *   inset-radius   - corner radius of the inset strip
 *   spaced         - start | end | both; propagated to every tab
 *   mobile / mobile-breakpoint - compact, scroll-first layout
 *   scroll-to-active - keep the active tab visible when the strip resizes
 *   slider-transition          - shift | grow | fade
 *   slider-transition-duration - ms number or any CSS duration
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

import { wNumberAttr, wParseRecords, wValueList } from './utils.js';

// Screen widths (px) behind the named `mobile-breakpoint` values.
const W_TABS_BREAKPOINTS = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 };

// Slider animation presets; every one is a CSS class on the slider element.
const W_SLIDER_TRANSITIONS = ['shift', 'grow', 'fade'];

const W_TABS_SPACING = ['start', 'end', 'both'];

class WTabs extends WElement {

  static attrs = [
    'value', 'variant', 'align-tabs', 'fixed-tabs', 'grow', 'direction',
    'stacked', 'center-active', 'hide-slider', 'slider-color', 'show-arrows',
    'prev-icon', 'next-icon', 'multiple', 'max', 'mandatory', 'items',
    'selected-class', 'content-class', 'inset', 'inset-padding', 'inset-radius',
    'spaced', 'mobile', 'mobile-breakpoint', 'scroll-to-active',
    'slider-transition', 'slider-transition-duration',
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

  get multiple() { return this.hasAttribute('multiple'); }
  get max() { return this.hasAttribute('max') ? wNumberAttr(this, 'max', Infinity) : Infinity; }
  // Mandatory is the DuVay default (a tab strip with nothing selected is a
  // dead end); `mandatory="false"` opts into click-to-deselect.
  get mandatory() { return this._attr('mandatory', 'force') !== 'false'; }
  get items() { return wParseRecords(this._attr('items', '')); }
  get inset() { return this.hasAttribute('inset'); }
  get spaced() { return this._attr('spaced', ''); }
  get selectedClass() { return this._attr('selected-class', ''); }
  get contentClass() { return this._attr('content-class', ''); }
  get scrollToActive() { return this.hasAttribute('scroll-to-active'); }

  get mobile() {
    if (this.hasAttribute('mobile') && this.getAttribute('mobile') !== 'false') return true;
    const query = this._mobileQuery();
    return !!query && typeof matchMedia === 'function' && matchMedia(query).matches;
  }

  _mobileQuery() {
    const raw = this._attr('mobile-breakpoint', '');
    if (!raw) return '';
    const px = raw in W_TABS_BREAKPOINTS ? W_TABS_BREAKPOINTS[raw] : Number(raw);
    return Number.isFinite(px) && px > 0 ? `(max-width: ${px - 0.02}px)` : '';
  }

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
    // Keep the slider aligned through reflows (resize, font swap, zoom), and —
    // with `scroll-to-active` — keep the active tab from being scrolled out of
    // view as the strip narrows.
    if (!this._resizeObserver && typeof ResizeObserver === 'function') {
      this._resizeObserver = new ResizeObserver(() => this._onResize());
      this._resizeObserver.observe(this);
    }
    this._bindMobileQuery();
  }

  _onResize() {
    this._positionSlider();
    if (this.scrollToActive) this._scrollActiveIntoView();
  }

  // Re-render when the viewport crosses the mobile breakpoint.
  _bindMobileQuery() {
    const query = this._mobileQuery();
    if (!query || this._wMobileBound === query || typeof matchMedia !== 'function') return;
    this._wMobileBound = query;
    matchMedia(query).addEventListener('change', () => this._rerenderStrip());
  }

  _rerenderStrip() {
    if (!this.isConnected) return;
    this._render();
    this._events();
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
        if (this.centerActive || this.scrollToActive) this._scrollActiveIntoView();
      }
      return;
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  // `_hasSlider` is false whenever `hide-slider` is set, so the two slider
  // modifiers stay mutually exclusive.
  _stripClasses() {
    return 'w-tabs' + this._cls({
      'w-tabs-pills': this.variant === 'pills',
      'w-tabs--align-center': this.alignTabs === 'center',
      'w-tabs--align-end': this.alignTabs === 'end',
      'w-tabs--fixed': this.fixedTabs,
      'w-tabs--grow': this.grow,
      'w-tabs--stacked': this.stacked,
      'w-tabs--vertical': this._vertical,
      'w-tabs--js-slider': this._hasSlider,
      'w-tabs--no-slider': this.hideSlider,
      'w-tabs--inset': this.inset,
      'w-tabs--mobile': this.mobile,
      ['w-tabs--spaced-' + this.spaced]: W_TABS_SPACING.includes(this.spaced),
    });
  }

  // Inset spacing/rounding are per-instance, so they ride on custom properties
  // rather than on a class each.
  _stripStyle() {
    const styles = [];
    const padding = this._length(this._attr('inset-padding', ''));
    const radius = this._length(this._attr('inset-radius', ''));
    if (padding) styles.push(`--w-tabs-inset-padding:${padding}`);
    if (radius) styles.push(`--w-tabs-inset-radius:${radius}`);
    return styles.length ? ` style="${styles.join(';')}"` : '';
  }

  _length(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    return /^\d+(\.\d+)?$/.test(raw) ? raw + 'px' : this._esc(raw);
  }

  // `items` generates the tab children, so a strip can be driven from data
  // alone; authored <w-tab>s still arrive through the slot alongside them.
  _itemsMarkup() {
    return this.items.map((item, index) => this._itemMarkup(item, index)).join('');
  }

  _itemMarkup(item, index) {
    const record = this._itemRecord(item);
    const text = String(record.text ?? record.title ?? '');
    const attrs = this._attrs({
      value: String(record.value ?? text ?? index),
      disabled: record.disabled === true,
    });
    return `<w-tab${attrs}>${this._esc(text)}</w-tab>`;
  }

  _itemRecord(item) {
    if (typeof item === 'string') return { text: item };
    if (Array.isArray(item)) return { text: item[0], value: item[1] };
    return item || {};
  }

  _shellTemplate(stripEl) {
    const vert = this._vertical;
    const prevGlyph = this._esc(this.prevIcon || (vert ? '↑' : '‹'));
    const nextGlyph = this._esc(this.nextIcon || (vert ? '↓' : '›'));
    const prev = `<button class="w-tabs-arrow w-tabs-arrow--prev" type="button" data-tabs-scroll="-1" aria-label="Previous tabs">${prevGlyph}</button>`;
    const next = `<button class="w-tabs-arrow w-tabs-arrow--next" type="button" data-tabs-scroll="1" aria-label="Next tabs">${nextGlyph}</button>`;
    return `<div class="w-tabs-shell${vert ? ' w-tabs-shell--vertical' : ''}">${prev}${stripEl}${next}</div>`;
  }

  _template() {
    const slider = this._hasSlider ? '<span class="w-tabs-slider" aria-hidden="true"></span>' : '';
    const orientation = this._vertical ? ' aria-orientation="vertical"' : '';
    const multi = this.multiple ? ' aria-multiselectable="true"' : '';
    const stripEl = `<div class="${this._stripClasses()}"${this._stripStyle()} role="tablist"${orientation}${multi}>`
      + `${this._itemsMarkup()}<slot></slot>${slider}</div>`;

    // Mobile mode drops the pagination arrows in favour of native scrolling.
    if (!this.showArrows || this.mobile) return stripEl;

    return this._shellTemplate(stripEl);
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
      if (this.centerActive || this.scrollToActive) this._scrollActiveIntoView();
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

  // Single-select keeps `value` a plain string; `multiple` widens it to a
  // list, which `wValueList` reads from JSON or a comma-separated string.
  _selectedValues() {
    return this.multiple ? wValueList(this.value) : [this.value];
  }

  _classNames(value) {
    return String(value || '').split(/\s+/).filter(Boolean);
  }

  // Presentation attributes the strip owns on behalf of its tabs. An attribute
  // written on a tab directly always wins.
  static tabProps = ['inset', 'spaced', 'direction'];

  _mirrorProps(tab) {
    WTabs.tabProps.forEach((name) => {
      const value = this.getAttribute(name);
      if (value == null || tab.hasAttribute(name)) return;
      tab.setAttribute(name, value);
    });
  }

  _syncTabs() {
    const selected = this._selectedValues();
    const contentClasses = this._classNames(this.contentClass);
    const selectedClass = this.selectedClass;
    this._getTabElements().forEach((tab) => {
      const shouldBeActive = selected.includes(tab.value);
      if (tab.active !== shouldBeActive) tab.active = shouldBeActive;
      if (selectedClass) tab.classList.toggle(selectedClass, shouldBeActive);
      contentClasses.forEach((name) => tab.classList.add(name));
      this._mirrorProps(tab);
    });
  }

  _activateTab(tabEl) {
    if (!tabEl || tabEl.disabled) return;
    const next = this._nextSelection(tabEl.value);
    if (!next) return; // the click was a no-op (mandatory or max held it back)
    this._setSelection(next);
  }

  _nextSelection(value) {
    const selected = this._selectedValues();
    const has = selected.includes(value);
    if (this.multiple) return this._nextMultiple(selected, value, has);
    if (has) return this.mandatory ? null : [];
    return [value];
  }

  _nextMultiple(selected, value, has) {
    if (!has) return selected.length >= this.max ? null : selected.concat(value);
    if (this.mandatory && selected.length <= 1) return null;
    return selected.filter((item) => item !== value);
  }

  _setSelection(selected) {
    const value = this.multiple ? JSON.stringify(selected) : (selected[0] || '');
    if (value === this.value) return;
    this.value = value; // → attributeChangedCallback → _syncTabs + _positionSlider
    this._emit('change', { value: this.multiple ? selected : value });
  }

  _activeButton() {
    const active = this._getTabElements().find((t) => t.active);
    return active ? active.querySelector('.w-tab') : null;
  }

  // The active tab may restyle the shared indicator, so its slider-* attributes
  // win over the strip's own.
  _sliderSetting(active, name) {
    return (active && active.getAttribute(name)) || this._attr(name, '');
  }

  _duration(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    return /^\d+(\.\d+)?$/.test(raw) ? raw + 'ms' : raw;
  }

  _applySliderStyle(slider) {
    const active = this._getTabElements().find((tab) => tab.active);
    const color = this._sliderSetting(active, 'slider-color');
    slider.style.background = color ? `var(--w-${color})` : '';
    slider.style.transitionDuration = this._duration(this._sliderSetting(active, 'slider-transition-duration'));
    const transition = this._sliderSetting(active, 'slider-transition');
    W_SLIDER_TRANSITIONS.forEach((name) => {
      slider.classList.toggle('w-tabs-slider--' + name, name === transition);
    });
    slider.classList.toggle('w-tabs-slider--hidden', !!active && active.hasAttribute('hide-slider'));
  }

  _positionSlider() {
    if (!this._hasSlider) return;
    const slider = this._q('.w-tabs-slider');
    const strip = this._q('.w-tabs');
    if (!slider || !strip) return;
    this._applySliderStyle(slider);
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
