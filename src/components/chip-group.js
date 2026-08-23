/* <w-chip-group> — selectable chip group (DuVay equivalent of Vuetify v-chip-group)
 *
 * Attributes:
 *   value / multiple / mandatory / max / disabled / selected-class
 *   column / filter / variant / color
 *   direction         - horizontal (default) | vertical
 *   show-arrows       - render paging arrows around the scrolling chip row
 *   prev-icon / next-icon - custom arrow glyphs (defaults ‹/› or ↑/↓ vertical)
 *   center-active     - keep the selected chip centred in the scroll area
 *   scroll-to-active  - keep the selected chip visible as the container resizes
 *   content-class     - extra classes applied to the scrolling content element
 *   mobile            - force the touch-first layout: no arrows, native scrolling
 *   mobile-breakpoint - xs…xxl or a px width below which `mobile` applies
 */
import { wBoolAttr, wSetValue } from './utils.js';
// Screen widths (px) behind the named `mobile-breakpoint` values.
const W_CHIP_BREAKPOINTS = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 };

export class WChipGroup extends WElement {
  static attrs = ['value', 'multiple', 'mandatory', 'max', 'disabled', 'selected-class', 'column', 'filter', 'variant', 'color',
    'direction', 'show-arrows', 'prev-icon', 'next-icon', 'center-active', 'scroll-to-active',
    'content-class', 'mobile', 'mobile-breakpoint'];

  set value(v) { wSetValue(this, v); }
  get value() { return this._attr('value', ''); }
  get multiple() { return this._bool('multiple'); }
  get mandatory() { return this._bool('mandatory'); }
  get max() { return Math.max(0, parseInt(this._attr('max', '0'), 10) || 0); }
  get disabled() { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get column() { return this._bool('column'); }
  get filter() { return this._bool('filter'); }
  get variant() { return this._attr('variant', ''); }
  get color() { return this._attr('color', ''); }
  get selectedClass() { return this._attr('selected-class', 'selected'); }
  get direction() { return this._attr('direction', 'horizontal'); }
  get vertical() { return this.direction === 'vertical'; }
  get centerActive() { return wBoolAttr(this, 'center-active'); }
  get scrollToActive() { return wBoolAttr(this, 'scroll-to-active'); }
  get contentClass() { return this._attr('content-class', ''); }
  get prevIcon() { return this._attr('prev-icon', '') || (this.vertical ? '↑' : '‹'); }
  get nextIcon() { return this._attr('next-icon', '') || (this.vertical ? '↓' : '›'); }
  // Arrows are pointer affordances; the touch-first layout drops them.
  get showArrows() { return wBoolAttr(this, 'show-arrows') && !this.mobile; }

  get mobile() {
    if (wBoolAttr(this, 'mobile')) return true;
    const query = this._mobileQuery();
    return !!query && typeof matchMedia === 'function' && matchMedia(query).matches;
  }

  _mobileQuery() {
    const raw = this._attr('mobile-breakpoint', '');
    if (!raw) return '';
    const px = raw in W_CHIP_BREAKPOINTS ? W_CHIP_BREAKPOINTS[raw] : Number(raw);
    return Number.isFinite(px) && px > 0 ? `(max-width: ${px - 0.02}px)` : '';
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._resizeObserver && typeof ResizeObserver === 'function') {
      this._resizeObserver = new ResizeObserver(() => this._scrollActiveIntoView());
      this._resizeObserver.observe(this);
    }
  }

  disconnectedCallback() {
    if (this._resizeObserver) { this._resizeObserver.disconnect(); this._resizeObserver = null; }
  }

  _groupClass() {
    return 'w-chip-group' + this._cls({
      'w-chip-group--column': this.column,
      'w-chip-group--filter': this.filter,
      'w-chip-group--vertical': this.vertical,
      'w-chip-group--mobile': this.mobile,
      'w-chip-group--scrollable': this.showArrows,
      [this.contentClass]: this.contentClass,
    });
  }

  _template() {
    const group = `<div class="${this._groupClass()}" role="group" aria-disabled="${this.disabled ? 'true' : 'false'}"><slot></slot></div>`;
    if (!this.showArrows) return group;
    return `<div class="w-chip-group-shell${this.vertical ? ' w-chip-group-shell--vertical' : ''}">`
      + this._arrow('prev') + group + this._arrow('next')
      + `</div>`;
  }

  _arrow(side) {
    const icon = side === 'prev' ? this.prevIcon : this.nextIcon;
    const label = side === 'prev' ? 'Previous chips' : 'Next chips';
    return `<button class="w-chip-group-arrow w-chip-group-arrow--${side}" type="button"`
      + ` data-chip-scroll="${side === 'prev' ? -1 : 1}" aria-label="${label}">${this._esc(icon)}</button>`;
  }

  _bindArrows() {
    this._qAll('[data-chip-scroll]').forEach((button) => {
      button.addEventListener('click', () => this._scrollByPage(Number(button.getAttribute('data-chip-scroll'))));
    });
  }

  _scrollByPage(direction) {
    const scroller = this._q('.w-chip-group');
    if (!scroller) return;
    scroller.scrollBy({
      left: this.vertical ? 0 : direction * scroller.clientWidth * 0.8,
      top: this.vertical ? direction * scroller.clientHeight * 0.8 : 0,
      behavior: 'smooth',
    });
  }

  // `center-active` recentres the selection; `scroll-to-active` only guarantees
  // it stays on screen (including after a resize).
  _scrollActiveIntoView() {
    if (!this.centerActive && !this.scrollToActive) return;
    const chip = this._chips().find((entry) => entry.hasAttribute('selected'));
    if (!chip) return;
    chip.scrollIntoView({
      block: this.centerActive ? 'center' : 'nearest',
      inline: this.centerActive ? 'center' : 'nearest',
    });
  }

  _events() {
    this._decorate();
    this._syncChildren();
    this._bindArrows();
    this._scrollActiveIntoView();
    const schedule = typeof queueMicrotask === 'function'
      ? queueMicrotask
      : (callback) => Promise.resolve().then(callback);
    schedule(() => this.isConnected && this._syncChildren());
    if (this.__wChipGroupChange) return;
    this.__wChipGroupChange = (event) => {
      const chip = event.target?.closest?.('w-chip');
      if (!chip || !this.contains(chip) || chip.hasAttribute('disabled') || this.disabled) return;
      event.stopImmediatePropagation();
      this._selectChip(chip, event.detail?.selected !== false);
    };
    this.addEventListener('change', this.__wChipGroupChange);
  }

  _decorate() {
    this._chips().forEach((chip) => {
      if (this.variant && !chip.hasAttribute('variant')) chip.setAttribute('variant', this.variant);
      if (this.color && !chip.hasAttribute('color')) chip.setAttribute('color', this.color);
    });
  }

  _selectChip(chip, selected) {
    const chipValue = this._chipValue(chip);
    if (!chipValue) return;

    if (this.multiple) {
      const values = new Set(this._values());
      if (selected) {
        if (this.max && values.size >= this.max) return;
        values.add(chipValue);
      } else if (!this.mandatory || values.size > 1) {
        values.delete(chipValue);
      }
      this._commit(Array.from(values));
      return;
    }

    if (!selected && this.mandatory) {
      this._commit([chipValue]);
      return;
    }
    this._commit(selected ? [chipValue] : []);
  }

  _commit(values) {
    const next = this.multiple ? values.join(',') : (values[0] || '');
    this._silentSet('value', next || null);
    this._syncChildren(values);
    this._scrollActiveIntoView();
    this._emit('change', { value: this.multiple ? values : next });
  }

  _syncChildren(values = this._values()) {
    const selected = new Set(values);
    this._chips().forEach((chip) => {
      const isSelected = selected.has(this._chipValue(chip));
      chip._silentSet?.('selected', isSelected ? '' : null);
      chip.querySelector('.w-chip')?.classList.toggle(this.selectedClass, isSelected);
      chip.querySelector('.w-chip')?.classList.toggle('w-chip--selected', isSelected);
      chip.querySelector('.w-chip')?.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      if (this.disabled) chip.setAttribute('disabled', '');
    });
  }

  _values() {
    return String(this.value || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }

  _chips() {
    return Array.from(this.querySelectorAll('w-chip'));
  }

  _chipValue(chip) {
    return chip.getAttribute('value') || chip.textContent.trim();
  }
}

if (!customElements.get('w-chip-group')) customElements.define('w-chip-group', WChipGroup);
