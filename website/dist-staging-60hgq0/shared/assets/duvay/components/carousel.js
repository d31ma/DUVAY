/* <w-carousel> — DuVay component module
 *
 * Attributes:
 *   value / model-value       - active slide index
 *   cycle                     - auto-advance
 *   interval                  - ms between auto-advances (default 6000)
 *   height                    - carousel height
 *   continuous                - loop past the ends (default true)
 *   show-arrows               - `true` (default) | `false` | `hover`
 *   prev-icon / next-icon     - custom arrow glyphs (default ‹ / ›)
 *   hide-delimiters           - hide the slide delimiters
 *   delimiter-icon            - custom delimiter glyph instead of the dot
 *   hide-delimiter-background - drop the delimiter scrim
 *   vertical-delimiters       - `left` | `right` (stack delimiters on a side)
 *   progress                  - show the linear progress bar
 *   color                     - palette token for delimiter/progress accent
 *   touch                     - enable swipe to change slides (default true)
 *   transition                - `slide` (default) | `fade`
 *
 * Events:
 *   w-change - fires when the active slide changes (detail: { value })
 */
import { wBoolAttr, wNumberAttr, wModelValue } from './utils.js';

export class WCarousel extends WElement {
  static attrs = [
    'value', 'model-value', 'cycle', 'interval', 'height', 'hide-delimiters',
    'progress', 'show-arrows', 'continuous', 'prev-icon', 'next-icon',
    'delimiter-icon', 'hide-delimiter-background', 'vertical-delimiters',
    'color', 'touch', 'transition',
  ];

  get value() { return parseInt(wModelValue(this, '0'), 10) || 0; }
  get cycle() { return wBoolAttr(this, 'cycle'); }
  get interval() { return Math.max(250, wNumberAttr(this, 'interval', 6000)); }
  get height() { return this._attr('height', ''); }
  get hideDelimiters() { return wBoolAttr(this, 'hide-delimiters'); }
  get progress() { return wBoolAttr(this, 'progress'); }
  get showArrows() { return wBoolAttr(this, 'show-arrows', true); }
  get arrowsHover() { return this.getAttribute('show-arrows') === 'hover'; }
  get continuous() { return wBoolAttr(this, 'continuous', true); }
  get prevIcon() { return this._attr('prev-icon', '‹'); }
  get nextIcon() { return this._attr('next-icon', '›'); }
  get delimiterIcon() { return this._attr('delimiter-icon', ''); }
  get hideDelimiterBackground() { return wBoolAttr(this, 'hide-delimiter-background'); }
  get verticalDelimiters() { return this._attr('vertical-delimiters', ''); }
  get color() { return this._attr('color', ''); }
  get touch() { return wBoolAttr(this, 'touch', true); }
  get transition() { return this._attr('transition', 'slide'); }
  get _fade() { return this.transition === 'fade'; }

  _applyCommonProps() {
    super._applyCommonProps();
    // `color` themes the delimiters/progress via --w-carousel-color (set in the
    // template); strip the host text-color class the base adds so it doesn't
    // tint slide content.
    [...this.classList].forEach((cls) => { if (cls.startsWith('w-color-')) this.classList.remove(cls); });
  }

  _template() {
    const count = this._itemCount();
    const value = this._normalizedValue(count);
    const fade = this._fade;

    const classes = ['w-carousel'];
    if (fade) classes.push('w-carousel--fade');
    if (this.arrowsHover) classes.push('w-carousel--arrows-hover');
    if (this.verticalDelimiters === 'left') classes.push('w-carousel--vdelim-left');
    else if (this.verticalDelimiters === 'right') classes.push('w-carousel--vdelim-right');
    if (this.hideDelimiterBackground) classes.push('w-carousel--no-delim-bg');

    const styles = [];
    if (this.height) styles.push(`height:${this._esc(this.height)}`);
    if (this.color) styles.push(`--w-carousel-color:var(--w-${this._esc(this.color)})`);
    const style = styles.length ? ` style="${styles.join(';')}"` : '';

    const prevDisabled = !this.continuous && value <= 0 ? ' disabled' : '';
    const nextDisabled = !this.continuous && value >= count - 1 ? ' disabled' : '';
    const arrows = this.showArrows && count > 1 ? `
      <button class="w-carousel-control prev" type="button" aria-label="Previous slide" data-carousel-step="-1"${prevDisabled}>${this._esc(this.prevIcon)}</button>
      <button class="w-carousel-control next" type="button" aria-label="Next slide" data-carousel-step="1"${nextDisabled}>${this._esc(this.nextIcon)}</button>` : '';

    const dIcon = this.delimiterIcon;
    const dIconClass = dIcon ? ' w-carousel-delimiter--icon' : '';
    const dIconText = dIcon ? this._esc(dIcon) : '';
    const controls = this.hideDelimiters || count <= 1 ? '' : `
      <div class="w-carousel-delimiters" role="tablist" aria-label="Carousel slides">
        ${Array.from({ length: count }, (_, index) => `<button class="w-carousel-delimiter${dIconClass}${index === value ? ' active' : ''}" type="button" role="tab" aria-selected="${index === value}" aria-label="Show slide ${index + 1}" data-carousel-index="${index}">${dIconText}</button>`).join('')}
      </div>`;

    const progress = this.progress && count > 1 ? `<div class="w-carousel-progress" aria-hidden="true"><span style="width:${((value + 1) / count) * 100}%"></span></div>` : '';
    const transform = fade ? '' : ` style="transform:translateX(-${value * 100}%)"`;
    return `<div class="${classes.join(' ')}" tabindex="0" aria-roledescription="carousel"${style}>
      <div class="w-carousel-track"${transform}><slot></slot></div>
      ${arrows}
      ${controls}
      ${progress}
    </div>`;
  }

  _events() {
    this._clearCycle();
    this._syncCarousel();
    // Re-sync once child <w-carousel-item>s have rendered their inner boxes
    // (their upgrade can race the carousel's first sync — matters for fade).
    requestAnimationFrame(() => this._syncCarousel());
    this.querySelectorAll('[data-carousel-step]').forEach((button) => button.addEventListener('click', () => {
      this._step(Number(button.getAttribute('data-carousel-step')));
    }));
    this.querySelectorAll('[data-carousel-index]').forEach((button) => button.addEventListener('click', () => {
      this._setValue(Number(button.getAttribute('data-carousel-index')));
    }));
    const root = this._q('.w-carousel');
    root?.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); this._step(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); this._step(1); }
      if (event.key === 'Home') { event.preventDefault(); this._setValue(0); }
      if (event.key === 'End') { event.preventDefault(); this._setValue(this._itemCount() - 1); }
    });

    // Pointer/touch swipe to change slides (threshold-based, so taps and clicks
    // on inner controls/links still work).
    if (root && this.touch) {
      let startX = 0, startY = 0, dragging = false;
      root.addEventListener('pointerdown', (event) => {
        if (event.target.closest('.w-carousel-control, .w-carousel-delimiter')) return;
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        startX = event.clientX; startY = event.clientY; dragging = true;
        this._clearCycle();
      });
      root.addEventListener('pointerup', (event) => {
        if (!dragging) return;
        dragging = false;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) this._step(dx < 0 ? 1 : -1);
        else this._startCycle();
      });
      root.addEventListener('pointercancel', () => { dragging = false; this._startCycle(); });
    }

    this.addEventListener('mouseenter', () => this._clearCycle());
    this.addEventListener('mouseleave', () => this._startCycle());
    this.addEventListener('focusin', () => this._clearCycle());
    this.addEventListener('focusout', () => this._startCycle());
    this._startCycle();
  }

  disconnectedCallback() {
    this._clearCycle();
  }

  _itemCount() {
    return this.querySelectorAll('w-carousel-item').length;
  }

  _normalizedValue(count = this._itemCount()) {
    if (!count) return 0;
    return Math.max(0, Math.min(this.value, count - 1));
  }

  _step(delta) {
    const count = this._itemCount();
    if (!count) return;
    let next = this.value + delta;
    if (this.continuous) next = (next + count) % count;
    else next = Math.max(0, Math.min(next, count - 1));
    this._setValue(next);
  }

  _setValue(value) {
    const count = this._itemCount();
    const next = this._normalizedValue.call({ value }, count);
    const current = this._normalizedValue(count);
    if (next === current) return;
    this._silentSet('value', next);
    this._silentSet('model-value', next);
    this._syncCarousel();
    this._emit('w-change', { value: next });
    this._restartCycle();
  }

  _syncCarousel() {
    const count = this._itemCount();
    const value = this._normalizedValue(count);
    const track = this._q('.w-carousel-track');
    if (track && !this._fade) track.style.transform = `translateX(-${value * 100}%)`;
    this.querySelectorAll('w-carousel-item').forEach((item, index) => {
      const active = index === value;
      item.classList.toggle('active', active);
      // The host is display:contents, so the inner box carries the active state
      // that the fade transition (opacity) and any item styling key off.
      item.querySelector('.w-carousel-item')?.classList.toggle('active', active);
      item.setAttribute('aria-hidden', String(!active));
    });
    this.querySelectorAll('[data-carousel-index]').forEach((button) => {
      const active = Number(button.getAttribute('data-carousel-index')) === value;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    const progress = this._q('.w-carousel-progress span');
    if (progress && count) progress.style.width = `${((value + 1) / count) * 100}%`;
    // Keep the end arrows' disabled state in sync when not looping.
    const prev = this._q('.w-carousel-control.prev');
    const next = this._q('.w-carousel-control.next');
    if (prev) prev.disabled = !this.continuous && value <= 0;
    if (next) next.disabled = !this.continuous && value >= count - 1;
  }

  _startCycle() {
    if (!this.cycle || this._itemCount() <= 1) return;
    this._cycleTimer = setTimeout(() => this._step(1), this.interval);
  }

  _clearCycle() {
    if (this._cycleTimer) clearTimeout(this._cycleTimer);
    this._cycleTimer = 0;
  }

  _restartCycle() {
    this._clearCycle();
    this._startCycle();
  }
}

if (!customElements.get('w-carousel')) customElements.define('w-carousel', WCarousel);
