/* <w-infinite-scroll-intersect> — Infinite scroll sentinel */

export class WInfiniteScrollIntersect extends WElement {
  static attrs = ['side'];

  get side() { return this._attr('side', 'end'); }

  _template() {
    return `<div class="w-infinite-scroll-intersect" data-side="${this._esc(this.side)}" aria-hidden="true"><slot></slot></div>`;
  }

  _events() {
    if (!('IntersectionObserver' in window)) return;
    this.__io?.disconnect();
    const target = this._q('.w-infinite-scroll-intersect');
    if (!target) return;
    this.__io = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) this._emit('w-intersect', { side: this.side });
    });
    this.__io.observe(target);
  }

  disconnectedCallback() {
    this.__io?.disconnect();
  }
}

if (!customElements.get('w-infinite-scroll-intersect')) {
  customElements.define('w-infinite-scroll-intersect', WInfiniteScrollIntersect);
}
