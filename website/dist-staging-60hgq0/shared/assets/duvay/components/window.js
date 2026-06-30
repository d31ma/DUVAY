/* <w-window> — DuVay component module */
import { wPrimitiveBoolAttr, wPrimitiveModelValue } from './utils.js';

export class WWindow extends WElement {
  static attrs = ['value', 'model-value', 'show-arrows', 'continuous', 'height', 'direction', 'mandatory', 'crossfade', 'reverse'];

  get value() { return parseInt(wPrimitiveModelValue(this, '0'), 10) || 0; }
  set value(v) { this.setAttribute('value', String(v)); }
  get showArrows() { return wPrimitiveBoolAttr(this, 'show-arrows'); }
  get continuous() { return wPrimitiveBoolAttr(this, 'continuous'); }
  get height() { return this._attr('height', ''); }
  get direction() { return this._attr('direction', 'horizontal'); }
  get mandatory() { return wPrimitiveBoolAttr(this, 'mandatory', true); }
  get crossfade() { return wPrimitiveBoolAttr(this, 'crossfade'); }
  get reverse() { return wPrimitiveBoolAttr(this, 'reverse'); }

  attributeChangedCallback(name, oldVal, newVal) {
    const shouldSyncValue = !this._skipRender && oldVal !== newVal && (name === 'value' || name === 'model-value');
    super.attributeChangedCallback(name, oldVal, newVal);
    if (!shouldSyncValue) return;

    this._silentSet(name === 'value' ? 'model-value' : 'value', newVal);
    if (this._rendered) this._syncItems();
  }

  _template() {
    const items = this._itemCount();
    const value = this._clampedValue(items);
    const height = this.height ? ` style="height: ${this._esc(this.height)};"` : '';
    const prevDisabled = !this.continuous && value <= 0 ? ' disabled' : '';
    const nextDisabled = !this.continuous && value >= items - 1 ? ' disabled' : '';
    const vertical = this.direction === 'vertical';
    const axisClass = vertical ? ' w-window--vertical' : '';
    const crossfadeClass = this.crossfade ? ' w-window--crossfade' : '';
    const arrows = this.showArrows && items > 1 ? `
      <button class="w-window-arrow w-window-arrow--prev" type="button" data-window-step="-1" aria-label="Previous item"${prevDisabled}>${vertical ? '↑' : '‹'}</button>
      <button class="w-window-arrow w-window-arrow--next" type="button" data-window-step="1" aria-label="Next item"${nextDisabled}>${vertical ? '↓' : '›'}</button>` : '';
    let dots = '';
    for (let i = 0; i < items; i++) {
      dots += `<button class="w-window-dot${i === value ? ' active' : ''}" type="button" role="tab" aria-selected="${i === value}" data-window-index="${i}" aria-label="Show item ${i + 1}"></button>`;
    }
    return `<div class="w-window${axisClass}${crossfadeClass}" tabindex="0" role="group" aria-roledescription="carousel"${height}>
      <div class="w-window-track" style="${this._trackTransform(value)}"><slot></slot></div>
      ${arrows}
      <div class="w-window-controls" role="tablist">${dots}</div>
    </div>`;
  }

  _events() {
    this._syncItems();
    this._qAll('[data-window-index]').forEach((button) => {
      button.addEventListener('click', () => {
        this._setValue(Number(button.getAttribute('data-window-index')));
      });
    });
    this._qAll('[data-window-step]').forEach((button) => {
      button.addEventListener('click', () => this._step(Number(button.getAttribute('data-window-step'))));
    });
    this._q('.w-window')?.addEventListener('keydown', (event) => {
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
  }

  // Match both the base item and the <w-tabs-window-item> alias so the
  // tabs-window pairing finds its panels (the alias is a distinct tag name).
  get _itemSelector() { return 'w-window-item, w-tabs-window-item, w-stepper-window-item'; }

  _itemCount() {
    return this.querySelectorAll(this._itemSelector).length;
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
    this.value = next;
    this._silentSet('model-value', next);
    this._syncItems();
    this._emit('w-change', { value: next });
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
    this.querySelectorAll(this._itemSelector).forEach((item, index) => {
      const active = index === value;
      item.classList.toggle('active', active);
      item.toggleAttribute('selected', active);
      item.setAttribute('aria-hidden', String(!active));
    });
    this._qAll('[data-window-index]').forEach((button) => {
      const active = Number(button.getAttribute('data-window-index')) === value;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
  }
}

if (!customElements.get('w-window')) customElements.define('w-window', WWindow);
