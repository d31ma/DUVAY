/* <w-virtual-scroll> — Virtualised list web component (DuVay equivalent of Vuetify v-virtual-scroll)
 *
 * Renders only the items in (and near) the viewport, offsetting the rest with
 * container padding so the scrollbar stays accurate. Pair `height` with a
 * uniform `item-height` for the fast path, or omit `item-height` to have each
 * item measured individually (dynamic heights).
 *
 * Attributes:
 *   items        - JSON/comma array of strings or objects to virtualise
 *   item-height  - fixed row height in px; omit for dynamic per-item heights
 *   height       - scroll-area height (px number or any CSS length, default 240px)
 *   item-title   - object key used for each item's text (default: title)
 *   item-key     - object key holding a unique id per item; rows carry it as
 *                  `data-key` and an unchanged window is left in the DOM
 *                  instead of being re-rendered
 *   overscan     - extra rows rendered above/below the viewport (default: 3)
 *   renderless   - drop the scroll container and virtualise against the parent
 *                  element's scrolling (the parent must be positioned)
 *
 * Methods:
 *   scrollToIndex(index)     - scroll so item `index` sits at the top
 *   calculateVisibleItems()  - recompute and re-render the visible window
 *
 * Slots:
 *   default - rendered (un-virtualised) only when no `items` attribute is set
 *
 * Events:
 *   scroll - fires on scroll with detail { start, end } (the rendered range)
 */
import { wNumberAttr, wParseRecords, wRecordValue, wClamp } from './utils.js';

export class WVirtualScroll extends WElement {
  static attrs = ['height', 'items', 'item-height', 'item-title', 'item-key',
    'overscan', 'renderless'];

  get itemList() {
    const raw = this._attr('items', '');
    const parsed = this._parseStructured(raw);
    return Array.isArray(parsed) ? parsed : wParseRecords(raw);
  }
  get dynamic() { return !this.hasAttribute('item-height'); }
  get itemHeight() { return Math.max(1, wNumberAttr(this, 'item-height', 48)); }
  get overscan() { return Math.max(0, wNumberAttr(this, 'overscan', 3)); }
  get itemTitleKey() { return this._attr('item-title', 'title'); }
  get itemKey() { return this._attr('item-key', ''); }
  get renderless() { return this._bool('renderless'); }
  get height() { return this._attr('height', '240px'); }
  get _estimate() { return 48; }

  _heightStyle() {
    const value = this.height;
    return /^\d+(\.\d+)?$/.test(value) ? value + 'px' : value;
  }

  _numHeight() { return parseFloat(this.height) || 240; }

  _template() {
    this._items = this.itemList;
    this._keys = null;
    if (!this._items.length) {
      // tabindex so a keyboard-only user can scroll the region; without it the
      // content below the fold is unreachable without a pointer.
      return `<div class="w-virtual-scroll" tabindex="0" style="max-height:${this._esc(this._heightStyle())}"><slot></slot></div>`;
    }
    this._initSizes();
    // `renderless` drops the scroll box: the parent element scrolls instead.
    if (this.renderless) {
      return `<div class="w-virtual-scroll-container" data-virtual-container role="list"></div>`;
    }
    return `<div class="w-virtual-scroll" tabindex="0" style="height:${this._esc(this._heightStyle())}" data-virtual-scroll role="list">
      <div class="w-virtual-scroll-container" data-virtual-container></div>
    </div>`;
  }

  // The element whose scrolling drives the window.
  _scroller() {
    return this._q('[data-virtual-scroll]') || (this.renderless ? this.parentElement : null);
  }

  _events() {
    const scroller = this._scroller();
    if (!scroller) return;
    // A renderless scroller outlives the render, so it is only bound once.
    if (this._boundScroller !== scroller) {
      this._boundScroller = scroller;
      scroller.addEventListener('scroll', () => this._renderWindow(), { passive: true });
    }
    this._renderWindow();
  }

  /* ── Size / offset model ──────────────────────────────────────────────── */
  _initSizes() {
    const len = this._items.length;
    if (this._sizes && this._sizes.length === len
      && this._sizesKey === this.itemHeight && this._sizesDyn === this.dynamic) return;
    const base = this.dynamic ? this._estimate : this.itemHeight;
    this._sizes = new Array(len).fill(base);
    this._sizesKey = this.itemHeight;
    this._sizesDyn = this.dynamic;
    this._buildOffsets();
  }

  _buildOffsets() {
    const len = this._sizes.length;
    const offsets = new Array(len + 1);
    offsets[0] = 0;
    for (let i = 0; i < len; i++) offsets[i + 1] = offsets[i] + this._sizes[i];
    this._offsets = offsets;
  }

  /* Index of the item containing offset `y` (binary search over offsets). */
  _indexAt(y) {
    const offsets = this._offsets;
    const last = offsets.length - 1;
    if (y <= 0) return 0;
    if (y >= offsets[last]) return Math.max(0, last - 1);
    let lo = 0;
    let hi = last;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (offsets[mid] <= y) lo = mid + 1;
      else hi = mid;
    }
    return Math.max(0, lo - 1);
  }

  /* ── Windowing ────────────────────────────────────────────────────────── */
  _renderWindow() {
    const scroller = this._scroller();
    const container = this._q('[data-virtual-container]');
    if (!scroller || !container) return;

    const len = this._items.length;
    const viewport = scroller.clientHeight || this._numHeight();
    const top = scroller.scrollTop;
    const start = Math.max(0, this._indexAt(top) - this.overscan);
    const end = Math.min(len, this._indexAt(top + viewport) + 1 + this.overscan);

    container.style.paddingTop = this._offsets[start] + 'px';
    container.style.paddingBottom = (this._offsets[len] - this._offsets[end]) + 'px';
    if (this._keysChanged(start, end)) container.innerHTML = this._rows(start, end);
    if (this.dynamic) this._measure(container, start);

    this._range = { start, end };
    this._emit('scroll', { start, end });
  }

  // With `item-key`, a window holding exactly the same items keeps its nodes.
  _keysChanged(start, end) {
    if (!this.itemKey) return true;
    const keys = [];
    for (let i = start; i < end; i++) keys.push(this._key(i));
    const same = this._keys && this._keys.join('\0') === keys.join('\0');
    this._keys = keys;
    return !same;
  }

  _key(index) {
    const item = this._items[index];
    if (!this.itemKey || item == null || typeof item !== 'object') return String(index);
    return String(wRecordValue(item, this.itemKey, index));
  }

  _rows(start, end) {
    let html = '';
    for (let i = start; i < end; i++) {
      const style = this.dynamic ? '' : ` style="height:${this.itemHeight}px"`;
      const key = this.itemKey ? ` data-key="${this._esc(this._key(i))}"` : '';
      html += `<div class="w-virtual-scroll-item" role="listitem" data-index="${i}"${key}${style}>${this._esc(this._display(this._items[i]))}</div>`;
    }
    return html;
  }

  /* Measure real heights of the rendered window and reconcile offsets. */
  _measure(container, start) {
    let changed = false;
    container.querySelectorAll('.w-virtual-scroll-item').forEach((el) => {
      const i = Number(el.dataset.index);
      const h = el.offsetHeight;
      if (h && this._sizes[i] !== h) { this._sizes[i] = h; changed = true; }
    });
    if (!changed) return;
    this._buildOffsets();
    const len = this._items.length;
    const end = start + container.children.length;
    container.style.paddingTop = this._offsets[start] + 'px';
    container.style.paddingBottom = (this._offsets[len] - this._offsets[end]) + 'px';
  }

  _display(item) {
    if (item == null) return '';
    if (typeof item === 'object') return String(wRecordValue(item, this.itemTitleKey));
    return String(item);
  }

  /* ── Public API ───────────────────────────────────────────────────────── */
  scrollToIndex(index) {
    const scroller = this._q('[data-virtual-scroll]');
    if (!scroller || !this._offsets) return;
    const i = wClamp(Math.floor(Number(index) || 0), 0, this._items.length);
    scroller.scrollTop = this._offsets[i];
    this._renderWindow();
  }

  calculateVisibleItems() { this._renderWindow(); }

  /* Parse a JSON array, tolerating single-quoted keys/strings (HTML-safe attrs). */
  _parseStructured(text) {
    text = String(text || '').trim();
    if (!text.startsWith('[')) return null;
    try { return JSON.parse(text); } catch (_) { /* fall through */ }
    if (!text.includes("'")) return null;
    try {
      const normalized = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, value) => JSON.stringify(value.replace(/\\'/g, "'")));
      return JSON.parse(normalized);
    } catch (_) {
      return null;
    }
  }
}

if (!customElements.get('w-virtual-scroll')) customElements.define('w-virtual-scroll', WVirtualScroll);
