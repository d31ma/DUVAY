/* <w-window> — DuVay component module
 *
 * Attributes (beyond the common ones):
 *   value           - active panel: an index, or a child item's `value`
 *   show-arrows     - render the prev/next arrows
 *   vertical-arrows - stack the arrows on one edge instead of pinning them to
 *                     the left/right sides. Bare (defaults to `right`), or
 *                     `left` / `right` to pick the edge.
 *   continuous      - wrap past the ends
 *   direction       - `horizontal` (default) | `vertical`
 *   crossfade       - fade between panels instead of sliding
 *   reverse         - reverse the slide direction
 *   mandatory       - keep a panel selected (default true)
 *   selected-class  - class applied to the active item
 *   touch           - swipe to change panels (default true)
 */
import { wPrimitiveBoolAttr, wPrimitiveValue } from './utils.js';
import { wApplyItemTransition } from './window-item.js';

export class WWindow extends WElement {
  static attrs = ['value', 'show-arrows', 'vertical-arrows', 'continuous', 'height', 'direction', 'mandatory', 'crossfade', 'reverse', 'prev-icon', 'next-icon', 'touch', 'disabled', 'selected-class'];

  // `value` accepts an index or a child item's `value`; both normalise to the
  // index the track is scrolled to.
  get value() {
    const raw = wPrimitiveValue(this, '');
    const named = this._indexOfValue(raw);
    return named >= 0 ? named : (parseInt(raw, 10) || 0);
  }

  // Writing back keeps whichever addressing the items opted into, so a window
  // driven by named items never rewrites itself to bare indexes.
  set value(v) { this.setAttribute('value', this._valueForIndex(v)); }

  get verticalArrows() { return this._attr('vertical-arrows', ''); }
  get showArrows() { return wPrimitiveBoolAttr(this, 'show-arrows'); }
  get continuous() { return wPrimitiveBoolAttr(this, 'continuous'); }
  get height() { return this._attr('height', ''); }
  get direction() { return this._attr('direction', 'horizontal'); }
  get mandatory() { return wPrimitiveBoolAttr(this, 'mandatory', true); }
  get crossfade() { return wPrimitiveBoolAttr(this, 'crossfade'); }
  get reverse() { return wPrimitiveBoolAttr(this, 'reverse'); }
  get touch() { return wPrimitiveBoolAttr(this, 'touch', true); }
  get disabled() { return wPrimitiveBoolAttr(this, 'disabled', false); }
  get selectedClass() { return this._attr('selected-class', ''); }
  get prevIcon() { return this._attr('prev-icon', ''); }
  get nextIcon() { return this._attr('next-icon', ''); }

  get _vertical() { return this.direction === 'vertical'; }

  _template() {
    const items = this._itemCount();
    const value = this._clampedValue(items);
    return `<div class="w-window${this._windowClasses()}" tabindex="0" role="group" aria-roledescription="carousel"${this._heightStyle()}>
      <div class="w-window-track" style="${this._trackTransform(value)}"><slot></slot></div>
      ${this._arrowsMarkup(items, value)}
      <div class="w-window-controls" role="tablist">${this._dotsMarkup(items, value)}</div>
    </div>`;
  }

  _windowClasses() {
    const edge = this.verticalArrows === 'left' ? 'left' : 'right';
    return this._cls({
      'w-window--vertical': this._vertical,
      'w-window--crossfade': this.crossfade,
      'w-window--disabled': this.disabled,
      'w-window--varrows': this.hasAttribute('vertical-arrows'),
      ['w-window--varrows-' + edge]: this.hasAttribute('vertical-arrows'),
    });
  }

  _heightStyle() {
    return this.height ? ` style="height: ${this._esc(this.height)};"` : '';
  }

  _arrowsMarkup(items, value) {
    if (!this.showArrows || items <= 1) return '';
    const prevDisabled = this._arrowDisabled(value <= 0);
    const nextDisabled = this._arrowDisabled(value >= items - 1);
    return `
      <button class="w-window-arrow w-window-arrow--prev" type="button" data-window-step="-1" aria-label="Previous item"${prevDisabled}>${this._arrowGlyph(this.prevIcon, '↑', '‹')}</button>
      <button class="w-window-arrow w-window-arrow--next" type="button" data-window-step="1" aria-label="Next item"${nextDisabled}>${this._arrowGlyph(this.nextIcon, '↓', '›')}</button>`;
  }

  // An arrow is disabled while the component is, or at the edge of a
  // non-continuous window.
  _arrowDisabled(atEdge) {
    return this.disabled || (!this.continuous && atEdge) ? ' disabled' : '';
  }

  _arrowGlyph(icon, verticalGlyph, horizontalGlyph) {
    if (icon) return this._esc(icon);
    return this._vertical ? verticalGlyph : horizontalGlyph;
  }

  _dotsMarkup(items, value) {
    let dots = '';
    for (let i = 0; i < items; i++) {
      dots += `<button class="w-window-dot${i === value ? ' active' : ''}" type="button" role="tab" aria-selected="${i === value}" data-window-index="${i}" aria-label="Show item ${i + 1}"${this.disabled ? ' disabled' : ''}></button>`;
    }
    return dots;
  }

  _events() {
    this._syncItems();
    // Child items upgrade after the window does, so their inner boxes only
    // exist on the next tick — re-sync so the item classes land on them.
    queueMicrotask(() => { if (this.isConnected) this._syncItems(); });
    this._qAll('[data-window-index]').forEach((button) => {
      button.addEventListener('click', () => {
        if (this.disabled) return;
        this._setValue(Number(button.getAttribute('data-window-index')));
      });
    });
    this._qAll('[data-window-step]').forEach((button) => {
      button.addEventListener('click', () => { if (!this.disabled) this._step(Number(button.getAttribute('data-window-step'))); });
    });
    this._q('.w-window')?.addEventListener('keydown', (event) => {
      if (this.disabled) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        this._step(-1);
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        this._step(1);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        this._setValue(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        this._setValue(this._itemCount() - 1);
      }
    });
    this._bindTouch();
  }

  _bindTouch() {
    const win = this._q('.w-window');
    if (!win || !this.touch) return;
    let startX = 0;
    let startY = 0;
    let tracking = false;
    win.addEventListener('pointerdown', (event) => {
      if (this.disabled || event.pointerType === 'mouse' && event.button !== 0) return;
      tracking = true; startX = event.clientX; startY = event.clientY;
    });
    win.addEventListener('pointerup', (event) => {
      if (!tracking) return;
      tracking = false;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      const vertical = this.direction === 'vertical';
      const delta = vertical ? dy : dx;
      if (Math.abs(delta) < 40) return;
      this._step(delta < 0 ? 1 : -1);
    });
  }

  // Match both the base item and the <w-tabs-window-item> alias so the
  // tabs-window pairing finds its panels (the alias is a distinct tag name).
  get _itemSelector() { return 'w-window-item, w-tabs-window-item, w-stepper-window-item'; }

  _itemElements() {
    return Array.from(this.querySelectorAll(this._itemSelector));
  }

  _itemCount() {
    return this.querySelectorAll(this._itemSelector).length;
  }

  // Named addressing only kicks in for non-numeric values, so a plain index
  // never has to scan the items.
  _indexOfValue(raw) {
    if (!raw || /^-?\d+$/.test(raw)) return -1;
    return this._itemElements().findIndex((item) => item.getAttribute('value') === raw);
  }

  _valueForIndex(index) {
    const item = this._itemElements()[index];
    return (item && item.getAttribute('value')) || String(index);
  }

  _clampedValue(items) {
    if (!items) return 0;
    return Math.max(0, Math.min(this.value, items - 1));
  }

  _step(delta) {
    const items = this._itemCount();
    if (!items) return;
    let next = this.value + delta;
    if (this.continuous) next = (next + items) % items;
    else next = Math.max(0, Math.min(next, items - 1));
    this._setValue(next);
  }

  _setValue(value) {
    const items = this._itemCount();
    const next = Math.max(0, Math.min(value, Math.max(0, items - 1)));
    if (next === this.value && this.mandatory) return;
    // Remembered so the incoming panel can pick `reverse-transition` when the
    // window moves backwards.
    this._forward = next >= this.value;
    this.value = next;
    this._syncItems();
    this._emit('change', { value: next });
  }

  _trackTransform(value) {
    if (this.direction === 'vertical') return `transform: translateY(-${value * 100}%);`;
    const direction = this.reverse ? 1 : -1;
    return `transform: translateX(${direction * value * 100}%);`;
  }

  _syncItems() {
    const value = this._clampedValue(this._itemCount());
    const track = this._q('.w-window-track');
    if (track) track.style.cssText = this._trackTransform(value);
    this._itemElements().forEach((item, index) => this._syncItem(item, index === value));
    this._qAll('[data-window-index]').forEach((button) => {
      const active = Number(button.getAttribute('data-window-index')) === value;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
  }

  // An item's own `selected-class` beats the window's, so a single panel can
  // opt into a different highlight.
  _syncItem(item, active) {
    item.classList.toggle('active', active);
    const selectedClass = item.getAttribute('selected-class') || this.selectedClass;
    if (selectedClass) item.classList.toggle(selectedClass, active);
    item.toggleAttribute('selected', active);
    item.setAttribute('aria-hidden', String(!active));
    wApplyItemTransition(item.querySelector('.w-window-item') || item, item, active, this._forward);
  }
}

if (!customElements.get('w-window')) customElements.define('w-window', WWindow);
