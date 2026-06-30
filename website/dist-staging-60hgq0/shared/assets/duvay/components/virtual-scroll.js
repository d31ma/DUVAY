/* <w-virtual-scroll> — DuVay component module */
import { wNumberAttr, wValueList } from './utils.js';

export class WVirtualScroll extends WElement {
  static attrs = ['height', 'items', 'item-height', 'overscan'];

  get height() { return this._attr('height', '240px'); }
  get items() { return wValueList(this._attr('items', '')); }
  get itemHeight() { return Math.max(1, wNumberAttr(this, 'item-height', 44)); }
  get overscan() { return Math.max(0, wNumberAttr(this, 'overscan', 3)); }

  _template() {
    if (!this.items.length) {
      return `<div class="w-virtual-scroll" style="max-height:${this._esc(this.height)}"><slot></slot></div>`;
    }
    const range = this._range();
    return `<div class="w-virtual-scroll" style="height:${this._esc(this.height)}" data-virtual-scroll>
      <div class="w-virtual-scroll-spacer" style="height:${this.items.length * this.itemHeight}px">
        <div class="w-virtual-scroll-window" style="transform:translateY(${range.start * this.itemHeight}px)">
          ${this._rows(range)}
        </div>
      </div>
    </div>`;
  }

  _events() {
    const scroller = this._q('[data-virtual-scroll]');
    if (!scroller) return;
    scroller.addEventListener('scroll', () => this._updateVirtualRange());
    this._updateVirtualRange();
  }

  _range(scrollTop = 0) {
    const height = parseFloat(this.height) || 240;
    const visible = Math.ceil(height / this.itemHeight);
    const start = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.overscan);
    const end = Math.min(this.items.length, start + visible + this.overscan * 2);
    return { start, end };
  }

  _rows(range) {
    return this.items.slice(range.start, range.end).map((item, offset) =>
      `<div class="w-virtual-scroll-item" style="height:${this.itemHeight}px" data-index="${range.start + offset}">${this._esc(item)}</div>`
    ).join('');
  }

  _updateVirtualRange() {
    const scroller = this._q('[data-virtual-scroll]');
    const win = this._q('.w-virtual-scroll-window');
    if (!scroller || !win) return;
    const range = this._range(scroller.scrollTop);
    win.style.transform = `translateY(${range.start * this.itemHeight}px)`;
    win.innerHTML = this._rows(range);
    this._emit('w-range', range);
  }
}

if (!customElements.get('w-virtual-scroll')) customElements.define('w-virtual-scroll', WVirtualScroll);
