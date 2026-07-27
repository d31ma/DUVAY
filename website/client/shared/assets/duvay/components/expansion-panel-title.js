/* <w-expansion-panel-title> — Expansion panel title subcomponent
 *
 * Attributes:
 *   static        - keeps the title at its collapsed size while expanded
 *   ripple        - press ripple on the title button
 *   hover         - highlight the title on pointer hover
 *   focusable     - keep the focus ring visible for pointer focus too
 *   hide-actions  - drop the expand/collapse icon
 *   expand-icon   - glyph shown while collapsed
 *   collapse-icon - glyph shown while expanded
 */

class WExpansionPanelTitle extends WElement {
  static attrs = ['static', 'ripple', 'hover', 'focusable', 'hide-actions', 'expand-icon', 'collapse-icon'];

  // A standalone title reads its state from the panel it sits in, so a custom
  // collapse-icon still swaps in at the right moment.
  get expanded() {
    const panel = this.closest('w-expansion-panel');
    return !!panel && panel.hasAttribute('open');
  }

  _classes() {
    return 'w-expand-header w-expansion-panel-title' + this._cls({
      'w-expand-header--static': this._bool('static'),
      'w-expansion-panel-title--hover': this._bool('hover'),
      'w-expansion-panel-title--focusable': this._bool('focusable'),
    });
  }

  _icon() {
    const custom = this.expanded ? this._attr('collapse-icon', '') : this._attr('expand-icon', '');
    if (custom) return `<span class="w-expand-chevron" aria-hidden="true">${this._esc(custom)}</span>`;
    return `<svg class="w-expand-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;
  }

  _template() {
    const actions = this._bool('hide-actions')
      ? ''
      : `<span class="w-expansion-panel-title__icon">${this._icon()}</span>`;
    return `<button class="${this._classes()}" type="button" aria-expanded="${this.expanded ? 'true' : 'false'}">
      <span class="w-flex-1"><slot></slot></span>
      ${actions}
    </button>`;
  }

  _events() {
    if (!this._bool('ripple')) return;
    this._attachRipple(this._q('.w-expansion-panel-title'));
  }
}

if (!customElements.get('w-expansion-panel-title')) {
  customElements.define('w-expansion-panel-title', WExpansionPanelTitle);
}
