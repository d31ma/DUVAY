/* <w-app-bar-nav-icon> — App bar navigation icon subcomponent
 *
 * Extends <w-btn>, so the whole button surface is available here: text, icon,
 * prepend-icon, append-icon, variant, size, value, active, selected-class,
 * block, slim, stacked, flat, ripple and href all behave as they do on
 * <w-btn>. The hamburger glyph is the default content.
 *
 * Own attributes:
 *   aria-label - accessible label (default: "Open navigation")
 *   for        - id of a <w-navigation-drawer> to toggle
 */

import { WBtn } from './btn.js';

const W_NAV_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" aria-hidden="true">'
  + '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>'
  + '</svg>';

class WAppBarNavIcon extends WBtn {
  static attrs = ['for'];

  get ariaLabel() { return this._attr('aria-label', 'Open navigation'); }
  get targetId() { return this._attr('for', ''); }
  get expanded() { return !!this._targetDrawer()?.open; }

  _extraClasses() { return ' w-app-bar-nav-icon w-btn-icon'; }

  _extraAttrs(link) {
    const expanded = this.expanded;
    return {
      type: link ? '' : 'button',
      'aria-label': expanded ? 'Close navigation' : this.ariaLabel,
      'aria-controls': this.targetId,
      'aria-expanded': String(expanded),
    };
  }

  // The hamburger is the default glyph; an authored `icon` or `text` wins.
  _contentMarkup() {
    const inner = super._contentMarkup();
    return this.icon || this.text ? inner : W_NAV_ICON_SVG + inner;
  }

  _events() {
    super._events();
    const drawer = this._targetDrawer();
    this._bindToggle(drawer);
    this._watchDrawer(drawer);
  }

  _bindToggle(drawer) {
    const button = this._q('button, a');
    if (!button || !drawer) return;
    button.addEventListener('click', () => {
      drawer.toggle?.();
      this._syncExpanded();
    });
  }

  // Re-renders replace the control, but the drawer is external — subscribe once
  // per target so the expanded state keeps mirroring it.
  _watchDrawer(drawer) {
    if (this.__wDrawerTarget === drawer) return;
    this._unwatchDrawer();
    this.__wDrawerTarget = drawer;
    this.__wDrawerSync = () => this._syncExpanded();
    if (!drawer) return;
    drawer.addEventListener('toggle', this.__wDrawerSync);
    drawer.addEventListener('close', this.__wDrawerSync);
  }

  _unwatchDrawer() {
    if (!this.__wDrawerTarget || !this.__wDrawerSync) return;
    this.__wDrawerTarget.removeEventListener('toggle', this.__wDrawerSync);
    this.__wDrawerTarget.removeEventListener('close', this.__wDrawerSync);
  }

  disconnectedCallback() {
    this._unwatchDrawer();
  }

  _targetDrawer() {
    return this.targetId ? document.getElementById(this.targetId) : null;
  }

  _syncExpanded() {
    const button = this._q('button, a');
    if (!button) return;
    const expanded = this.expanded;
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Close navigation' : this.ariaLabel);
  }
}

if (!customElements.get('w-app-bar-nav-icon')) {
  customElements.define('w-app-bar-nav-icon', WAppBarNavIcon);
}
