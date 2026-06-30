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
 *
 * Slots:
 *   default  - entry body
 *   opposite - content shown on the opposite side of the line
 */

import { wTimelineColor, wTimelineSize } from './timeline.js';

export class WTimelineItem extends WElement {
  static attrs = ['time', 'title', 'dot', 'fill-dot', 'hide-dot', 'icon', 'dot-color', 'icon-color', 'size', 'side', 'hide-opposite'];

  get itemTitle() { return this._attr('title', ''); }
  get time() { return this._attr('time', ''); }

  _template() {
    const side = this._attr('side', '');
    const sideClass = side === 'start' ? ' w-timeline-item--start' : side === 'end' ? ' w-timeline-item--end' : '';
    const hideOppClass = this._bool('hide-opposite') ? ' w-timeline-item--hide-opposite' : '';
    const fill = this._bool('fill-dot') || this._attr('dot', 'filled') !== 'outlined';
    const icon = this._attr('icon', '');

    const dotStyles = [];
    const color = wTimelineColor(this._attr('dot-color', ''));
    if (color) dotStyles.push('--w-timeline-dot-color: ' + color);
    const iconColor = wTimelineColor(this._attr('icon-color', ''));
    if (iconColor) dotStyles.push('--w-timeline-icon-color: ' + iconColor);
    const size = wTimelineSize(this._attr('size', ''));
    if (size) dotStyles.push('--w-timeline-dot-size: ' + size);
    const dotStyle = dotStyles.length ? ` style="${dotStyles.join('; ')}"` : '';

    const dot = this._bool('hide-dot') ? ''
      : `<span class="w-timeline-dot w-timeline-dot--${fill ? 'filled' : 'outlined'}"${dotStyle}>${icon ? `<span class="w-timeline-dot__icon" aria-hidden="true">${this._esc(icon)}</span>` : ''}</span>`;

    const opposite = this._bool('hide-opposite')
      ? ''
      : this._hasSlot('opposite')
        ? '<div class="w-timeline-opposite"><slot name="opposite"></slot></div>'
        : this.time
          ? `<div class="w-timeline-opposite">${this._esc(this.time)}</div>`
          : '<div class="w-timeline-opposite" aria-hidden="true"></div>';

    const title = this.itemTitle ? `<div class="w-timeline-title">${this._esc(this.itemTitle)}</div>` : '';

    return `<div class="w-timeline-item${sideClass}${hideOppClass}" role="listitem">
      ${opposite}
      <div class="w-timeline-divider-col">${dot}</div>
      <div class="w-timeline-content">${title}<div class="w-timeline-body"><slot></slot></div></div>
    </div>`;
  }

  _hasSlot(name) { return !!this.querySelector('[slot="' + name + '"]'); }
}

if (!customElements.get('w-timeline-item')) customElements.define('w-timeline-item', WTimelineItem);
