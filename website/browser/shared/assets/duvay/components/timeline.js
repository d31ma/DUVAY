/* <w-timeline> — Vuetify v-timeline parity.
 *
 * Attributes:
 *   align          - start (left rail, default) | center (alternating)
 *   justify        - auto (default) | center (equal-width sides)
 *   side           - start | end  (force every item to one side)
 *   density        - default | compact (compact hides the opposite column)
 *   direction      - vertical (default) | horizontal
 *   dot-color      - default dot color for items (token / CSS color)
 *   icon-color     - default icon glyph color for items
 *   line-color     - color of the connecting line
 *   line-thickness - line width in px (default 2)
 *   line-inset     - gap between the dot and the line, in px
 *   truncate-line  - start | end | both (trim the line past the end dots)
 *   size           - default dot size (x-small … x-large | number)
 *   fill-dot       - solid dots by default
 *   hide-opposite  - hide every opposite column (single rail)
 *
 * Slot: default — w-timeline-item children.
 */

const TIMELINE_TOKENS = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info'];
const TIMELINE_SIZES = { 'x-small': '0.5rem', small: '0.75rem', default: '0.875rem', large: '1.25rem', 'x-large': '1.75rem' };

function wTimelineColor(value) {
  const t = String(value || '').trim().toLowerCase();
  if (!t) return '';
  return TIMELINE_TOKENS.includes(t) ? `var(--w-${t === 'info' ? 'primary' : t})` : value;
}

function wTimelineSize(value) {
  const t = String(value || '').trim().toLowerCase();
  if (!t) return '';
  if (TIMELINE_SIZES[t]) return TIMELINE_SIZES[t];
  return /^\d+(\.\d+)?$/.test(t) ? t + 'px' : t;
}

export class WTimeline extends WElement {
  static attrs = ['align', 'justify', 'side', 'density', 'direction', 'dot-color', 'icon-color', 'line-color', 'line-thickness', 'line-inset', 'truncate-line', 'size', 'fill-dot', 'hide-opposite'];

  _template() {
    const align = this._attr('align', 'start') === 'center' ? 'center' : 'start';
    const side = this._attr('side', '');
    const truncate = this._attr('truncate-line', '');
    const classes = [
      'w-timeline',
      'w-timeline--align-' + align,
      this._attr('justify', '') === 'center' ? 'w-timeline--justify-center' : '',
      this._attr('density', '') === 'compact' ? 'w-timeline--density-compact' : '',
      this._attr('direction', '') === 'horizontal' ? 'w-timeline--horizontal' : '',
      side === 'start' || side === 'end' ? 'w-timeline--side-' + side : '',
      truncate ? 'w-timeline--truncate-' + truncate : '',
      this._bool('fill-dot') ? 'w-timeline--fill-dot' : '',
      this._bool('hide-opposite') ? 'w-timeline--hide-opposite' : '',
    ].filter(Boolean).join(' ');

    const styles = [];
    const lineColor = wTimelineColor(this._attr('line-color', ''));
    if (lineColor) styles.push('--w-timeline-line-color: ' + lineColor);
    const thickness = this._attr('line-thickness', '');
    if (thickness) styles.push('--w-timeline-line-size: ' + (/^\d+(\.\d+)?$/.test(thickness) ? thickness + 'px' : thickness));
    const inset = this._attr('line-inset', '');
    if (inset) styles.push('--w-timeline-line-inset: ' + (/^\d+(\.\d+)?$/.test(inset) ? inset + 'px' : inset));
    const dotColor = wTimelineColor(this._attr('dot-color', ''));
    if (dotColor) styles.push('--w-timeline-dot-color: ' + dotColor);
    const iconColor = wTimelineColor(this._attr('icon-color', ''));
    if (iconColor) styles.push('--w-timeline-icon-color: ' + iconColor);
    const size = wTimelineSize(this._attr('size', ''));
    if (size) styles.push('--w-timeline-dot-size: ' + size);
    const style = styles.length ? ` style="${styles.join('; ')}"` : '';

    return `<div class="${classes}"${style} role="list"><slot></slot></div>`;
  }
}

if (!customElements.get('w-timeline')) customElements.define('w-timeline', WTimeline);

export { wTimelineColor, wTimelineSize };
