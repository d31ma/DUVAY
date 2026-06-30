/* <w-empty> — Empty state web component
 *
 * Attributes:
 *   title    - bold title text
 *   subtitle - secondary description text
 *
 * Slots:
 *   default  - custom icon SVG (overrides default icon)
 *   action   - optional action button or link
 */

class WEmpty extends WElement {

  static attrs = ['title', 'subtitle'];

  get title()    { return this._attr('title', ''); }
  get subtitle() { return this._attr('subtitle', ''); }

  _template() {
    const titleAttr = this.title;
    const subtitleAttr = this.subtitle;

    const defaultIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>`;

    let html = `<div class="w-empty">`;

    const hasSlotIcon = this.querySelector('[slot="icon"]') || this.querySelector('svg');
    // Check if there's slotted content that isn't in a named slot
    const childNodes = Array.from(this.childNodes);
    const hasDefaultSlot = childNodes.some(n => {
      if (n.nodeType === Node.ELEMENT_NODE && n.hasAttribute('slot')) return false;
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      return n.nodeType === Node.ELEMENT_NODE;
    });

    if (hasDefaultSlot) {
      html += `<slot></slot>`;
    } else {
      html += defaultIcon;
    }

    if (titleAttr) html += `<p class="w-empty-title">${this._esc(titleAttr)}</p>`;
    if (subtitleAttr) html += `<p class="w-empty-subtitle">${this._esc(subtitleAttr)}</p>`;

    html += `<slot name="action"></slot>`;
    html += `</div>`;
    return html;
  }
}

customElements.define('w-empty', WEmpty);
