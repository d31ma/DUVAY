/* <w-timeline-item> — DuVay component module */

export class WTimelineItem extends WElement {
  static attrs = ['time', 'title', 'dot'];

  get time() { return this._attr('time', ''); }
  get itemTitle() { return this._attr('title', ''); }
  get dot() { return this._attr('dot', 'filled'); }

  _template() {
    return `<div class="w-timeline-item">
      <div class="w-timeline-dot w-timeline-dot--${this._esc(this.dot)}"></div>
      ${this.time ? `<div class="w-timeline-time">${this._esc(this.time)}</div>` : ''}
      ${this.itemTitle ? `<div class="w-timeline-title">${this._esc(this.itemTitle)}</div>` : ''}
      <div class="w-timeline-body"><slot></slot></div>
    </div>`;
  }
}

if (!customElements.get('w-timeline-item')) customElements.define('w-timeline-item', WTimelineItem);
