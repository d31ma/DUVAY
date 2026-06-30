/* <w-app-bar-nav-icon> — App bar navigation icon subcomponent
 *
 * Attributes:
 *   aria-label - accessible label (default: "Open navigation")
 *   for        - id of a <w-navigation-drawer> to toggle
 */

class WAppBarNavIcon extends WElement {
  static attrs = ['aria-label', 'for'];

  get ariaLabel() { return this._attr('aria-label', 'Open navigation'); }
  get targetId() { return this._attr('for', ''); }

  _template() {
    const drawer = this._targetDrawer();
    const expanded = !!drawer?.open;
    return `<button class="w-app-bar-nav-icon w-btn w-btn-icon" type="button" aria-label="${this._esc(expanded ? 'Close navigation' : this.ariaLabel)}"${this.targetId ? ` aria-controls="${this._esc(this.targetId)}"` : ''} aria-expanded="${expanded}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
        <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
      </svg>
    </button>`;
  }

  _events() {
    const button = this._q('button');
    const drawer = this._targetDrawer();
    if (button && drawer && typeof drawer.toggle === 'function') {
      button.addEventListener('click', () => {
        drawer.toggle();
        this._syncExpanded();
      });
    }

    if (this.__wDrawerTarget !== drawer) {
      if (this.__wDrawerTarget && this.__wDrawerSync) {
        this.__wDrawerTarget.removeEventListener('toggle', this.__wDrawerSync);
        this.__wDrawerTarget.removeEventListener('close', this.__wDrawerSync);
      }
      this.__wDrawerTarget = drawer;
      this.__wDrawerSync = () => this._syncExpanded();
      if (drawer) {
        drawer.addEventListener('toggle', this.__wDrawerSync);
        drawer.addEventListener('close', this.__wDrawerSync);
      }
    }
  }

  disconnectedCallback() {
    if (this.__wDrawerTarget && this.__wDrawerSync) {
      this.__wDrawerTarget.removeEventListener('toggle', this.__wDrawerSync);
      this.__wDrawerTarget.removeEventListener('close', this.__wDrawerSync);
    }
  }

  _targetDrawer() {
    return this.targetId ? document.getElementById(this.targetId) : null;
  }

  _syncExpanded() {
    const button = this._q('button');
    const expanded = !!this._targetDrawer()?.open;
    if (!button) return;
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Close navigation' : this.ariaLabel);
  }
}

if (!customElements.get('w-app-bar-nav-icon')) {
  customElements.define('w-app-bar-nav-icon', WAppBarNavIcon);
}
