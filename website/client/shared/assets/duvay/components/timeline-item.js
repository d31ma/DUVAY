/* <w-timeline-item> — a single timeline entry.
 *
 * Attributes:
 *   title      - bold heading
 *   time       - opposite-side label (or use the `opposite` slot)
 *   dot        - filled | outlined  (legacy dot fill)
 *   fill-dot   - solid dot
 *   hide-dot   - render the entry without a dot
 *   icon       - glyph/text rendered inside the dot
 *   dot-color  - dot color (token / CSS color)
 *   icon-color - icon glyph color (token / CSS color)
 *   size       - dot size (x-small … x-large | number)
 *   side       - start | end  (force this item to one side, align="center")
 *   hide-opposite - hide this item's opposite column
 *   line-inset - gap between this item's dot and the connecting line, in px
 *                (overrides the timeline-wide `line-inset` for this entry)
 *
 * Slots:
 *   default  - entry body
 *   opposite - content shown on the opposite side of the line
 */

import { wTimelineColor, wTimelineSize } from './timeline.js';

export class WTimelineItem extends WElement {
  static attrs = ['time', 'title', 'dot', 'fill-dot', 'hide-dot', 'icon', 'dot-color', 'icon-color', 'size', 'side', 'hide-opposite', 'line-inset'];

  get itemTitle() { return this._attr('title', ''); }
  get time() { return this._attr('time', ''); }

  // Bare numbers are px, matching <w-timeline>'s own `line-inset`.
  _itemStyle() {
    const inset = this._attr('line-inset', '');
    if (!inset) return '';
    const length = /^\d+(\.\d+)?$/.test(inset) ? inset + 'px' : inset;
    return ` style="--w-timeline-line-inset:${this._esc(length)}"`;
  }

  _itemClasses() {
    const side = this._attr('side', '');
    return this._cls({
      ['w-timeline-item--' + side]: side === 'start' || side === 'end',
      'w-timeline-item--hide-opposite': this._bool('hide-opposite'),
    });
  }

  _dotStyle() {
    const dotStyles = [];
    const color = wTimelineColor(this._attr('dot-color', ''));
    if (color) dotStyles.push('--w-timeline-dot-color: ' + color);
    const iconColor = wTimelineColor(this._attr('icon-color', ''));
    if (iconColor) dotStyles.push('--w-timeline-icon-color: ' + iconColor);
    const size = wTimelineSize(this._attr('size', ''));
    if (size) dotStyles.push('--w-timeline-dot-size: ' + size);
    return dotStyles.length ? ` style="${dotStyles.join('; ')}"` : '';
  }

  _dotTemplate() {
    if (this._bool('hide-dot')) return '';
    const fill = this._bool('fill-dot') || this._attr('dot', 'filled') !== 'outlined';
    const icon = this._attr('icon', '');
    const glyph = icon ? `<span class="w-timeline-dot__icon" aria-hidden="true">${this._esc(icon)}</span>` : '';
    return `<span class="w-timeline-dot w-timeline-dot--${fill ? 'filled' : 'outlined'}"${this._dotStyle()}>${glyph}</span>`;
  }

  _oppositeTemplate() {
    if (this._bool('hide-opposite')) return '';
    if (this._hasSlot('opposite')) return '<div class="w-timeline-opposite"><slot name="opposite"></slot></div>';
    if (this.time) return `<div class="w-timeline-opposite">${this._esc(this.time)}</div>`;
    return '<div class="w-timeline-opposite" aria-hidden="true"></div>';
  }

  _titleTemplate() {
    return this.itemTitle ? `<div class="w-timeline-title">${this._esc(this.itemTitle)}</div>` : '';
  }

  _template() {
    return `<div class="w-timeline-item${this._itemClasses()}" role="listitem"${this._itemStyle()}>
      ${this._oppositeTemplate()}
      <div class="w-timeline-divider-col">${this._dotTemplate()}</div>
      <div class="w-timeline-content">${this._titleTemplate()}<div class="w-timeline-body"><slot></slot></div></div>
    </div>`;
  }

  _hasSlot(name) { return !!this.querySelector('[slot="' + name + '"]'); }
}

if (!customElements.get('w-timeline-item')) customElements.define('w-timeline-item', WTimelineItem);
