/* <w-divider> — a rule between sections (Vuetify VDivider parity).
 *
 * Attributes:
 *   vertical       - draw the rule down the cross axis instead of across
 *   inset          - indent the rule from the leading edge
 *   length         - length of the rule (width when horizontal, height when
 *                    vertical); a bare number is px
 *   thickness      - thickness of the rule; a bare number is px (default 1px)
 *   variant        - solid (default) | dashed | dotted | double border style
 *   opacity        - 0–1 opacity for the rule
 *   gradient       - fade the rule out towards both ends
 *   content-offset - spacing between the slotted content and the rules. A second
 *                    value shifts the content down (or right, when vertical).
 *
 * Slot:
 *   default - optional label drawn between two rule segments
 */

import { wValueList } from './utils.js';

const DIVIDER_VARIANTS = ['solid', 'dashed', 'dotted', 'double'];

/* A bare number is px; anything else is already a CSS length. */
export function wDividerLength(value) {
  const raw = String(value == null ? '' : value).trim();
  if (!raw) return '';
  return /^-?\d+(\.\d+)?$/.test(raw) ? raw + 'px' : raw;
}

/* `content-offset` is one value, or two ("8,4" / "[8,4]") where the second
   shifts the content across the rule. Returns [gap, shift] as CSS lengths. */
export function wDividerOffset(value) {
  const parts = wValueList(value).map(wDividerLength).filter(Boolean);
  return [parts[0] || '', parts[1] || ''];
}

export class WDivider extends WElement {
  static attrs = ['vertical', 'inset', 'length', 'variant', 'opacity', 'gradient',
    'thickness', 'content-offset'];

  get vertical() { return this._bool('vertical'); }
  get inset() { return this._bool('inset'); }
  get thickness() { return wDividerLength(this._attr('thickness', '')) || '1px'; }
  get variant() {
    const value = this._attr('variant', '');
    return DIVIDER_VARIANTS.includes(value) && value !== 'solid' ? value : '';
  }

  // A drawn rule is either a background block or, for the dashed / dotted /
  // double variants, a zero-size box with a border — border-style is the only
  // way CSS expresses those.
  _ruleStyles() {
    const side = this.vertical ? 'inline-start' : 'block-start';
    const axis = this.vertical ? 'width' : 'height';
    if (!this.variant) return [`${axis}:${this.thickness}`];
    return [`${axis}:0`, 'background:none', `border-${side}:${this.thickness} ${this.variant} var(--w-divider)`];
  }

  _decorStyles() {
    const styles = [];
    const raw = this._attr('opacity', '');
    if (raw && Number.isFinite(Number(raw))) styles.push(`opacity:${Number(raw)}`);
    if (this._bool('gradient')) {
      const to = this.vertical ? 'bottom' : 'right';
      const fade = `linear-gradient(to ${to}, transparent, #000 15%, #000 85%, transparent)`;
      styles.push(`-webkit-mask-image:${fade}`, `mask-image:${fade}`);
    }
    return styles;
  }

  _lengthStyles() {
    const length = wDividerLength(this._attr('length', ''));
    if (!length) return [];
    return this.vertical ? [`height:${length}`, 'align-self:auto'] : [`width:${length}`];
  }

  // After the first render the host's children are generated markup, so the
  // authored content lives inside the <slot> — and its absence means there was
  // none to begin with.
  _contentNodes() {
    const slot = this.querySelector('slot:not([name])');
    if (slot) return Array.from(slot.childNodes);
    return this._rendered ? [] : Array.from(this.childNodes);
  }

  _hasContent() {
    return this._contentNodes().some((node) => (
      node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
    ));
  }

  _rootClass() {
    return 'w-divider' + this._cls({
      'w-divider--vertical': this.vertical,
      'w-divider--inset': this.inset,
      'w-divider--content': this._hasContent(),
    });
  }

  _orientation() { return this.vertical ? 'vertical' : 'horizontal'; }

  _styleAttr(styles) {
    return styles.length ? ` style="${this._esc(styles.join(';'))}"` : '';
  }

  _openTag(styles) {
    return `<div class="${this._rootClass()}" role="separator"`
      + ` aria-orientation="${this._orientation()}"${this._styleAttr(styles)}>`;
  }

  _plainTemplate() {
    const styles = this._ruleStyles().concat(this._lengthStyles(), this._decorStyles());
    return this._openTag(styles) + '</div>';
  }

  // With content the divider becomes a flex track: rule, label, rule.
  _contentTemplate() {
    const [gap, shift] = wDividerOffset(this._attr('content-offset', ''));
    const root = ['display:flex', 'align-items:center', 'background:none',
      this.vertical ? 'width:auto' : 'height:auto']
      .concat(this.vertical ? ['flex-direction:column'] : [])
      .concat(gap ? [`gap:${gap}`] : [])
      .concat(this._lengthStyles(), this._decorStyles());

    const rule = this._styleAttr(['flex:1 1 0'].concat(this._ruleStyles()));
    const shiftSide = this.vertical ? 'margin-inline-start' : 'margin-block-start';
    const label = this._styleAttr(['flex:0 0 auto'].concat(shift ? [`${shiftSide}:${shift}`] : []));

    return this._openTag(root)
      + `<span class="w-divider__line"${rule}></span>`
      + `<span class="w-divider__content"${label}><slot></slot></span>`
      + `<span class="w-divider__line"${rule}></span></div>`;
  }

  _template() {
    return this._hasContent() ? this._contentTemplate() : this._plainTemplate();
  }
}

if (!customElements.get('w-divider')) customElements.define('w-divider', WDivider);
