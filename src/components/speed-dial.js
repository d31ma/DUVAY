/* <w-speed-dial> — DuVay Speed Dial (Vuetify parity)
 *
 * Attributes:
 *   icon          - trigger icon name/glyph (default '+')
 *   icon-set      - icon set prefix
 *   open          - controls visibility of the actions menu
 *   open-on-hover - open on mouseenter, close on mouseleave (with delay)
 *   location      - top | bottom | left | right + start/end (e.g. "top start")
 *   transition    - slide | scale | fade (default scale)
 *   aria-label    - accessibility label for the trigger button
 *
 * Events:
 *   toggle        - { open }
 *   update:open   - { open }
 *
 * Slots:
 *   default       - action items (w-fab or .w-fab elements)
 */

import WIcons from '../icons.js';

export class WSpeedDial extends WElement {
  static attrs = ['icon', 'icon-set', 'open', 'open-on-hover', 'location', 'transition', 'aria-label'];

  get icon()         { return this._attr('icon', '+'); }
  get iconSet()      { return this._attr('icon-set', ''); }
  get open()         { return this._bool('open'); }
  get openOnHover()  { return this._bool('open-on-hover'); }
  get location()     { return this._attr('location', 'top center'); }
  get transition()   { return this._attr('transition', 'scale'); }

  _template() {
    const loc = this.location || 'top center';
    const locParts = loc.split(/[-\s]+/);
    const vPos = locParts[0] || 'top';
    const hPos = locParts[1] || 'center';
    const locClass = ` w-speed-dial--${vPos} w-speed-dial--${hPos}`;
    const openClass = this.open ? ' w-speed-dial--open' : '';
    const transitionClass = ` w-speed-dial--transition-${this.transition}`;
    const iconSet = this.iconSet;
    const value = iconSet ? `${iconSet}:${this.icon}` : this.icon;
    const icon = WIcons.resolve(value, { iconClass: 'w-icon' });
    const aria = this.getAttribute('aria-label') || 'Open actions';

    return `<div class="w-speed-dial${locClass}${openClass}${transitionClass}">
      <button class="w-fab w-speed-dial__trigger" type="button" aria-expanded="${this.open ? 'true' : 'false'}" aria-haspopup="true" aria-label="${this._esc(aria)}">
        ${icon}
      </button>
      <div class="w-speed-dial__actions"><slot></slot></div>
    </div>`;
  }

  _events() {
    const trigger = this._q('.w-speed-dial__trigger');
    const actions = this._q('.w-speed-dial__actions');
    if (!trigger || !actions) return;

    // Toggle on trigger click
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this._toggle(!this.open);
    });

    // Hover behavior
    if (this.openOnHover) {
      let leaveTimer;
      this.addEventListener('mouseenter', () => {
        clearTimeout(leaveTimer);
        if (!this.open) this._toggle(true);
      });
      this.addEventListener('mouseleave', () => {
        leaveTimer = setTimeout(() => this._toggle(false), 150);
      });
    }

    // Escape to close
    this._keydownHandler = (e) => {
      if (e.key === 'Escape' && this.open) {
        e.preventDefault();
        this._toggle(false);
        trigger.focus();
      }
    };
    document.addEventListener('keydown', this._keydownHandler);

    // Click outside to close
    this._outsideHandler = (e) => {
      if (this.open && !this.contains(e.target)) {
        this._toggle(false);
      }
    };
    document.addEventListener('click', this._outsideHandler);
  }

  _toggle(nextOpen) {
    if (this.open === nextOpen) return;
    this._silentSet('open', nextOpen);
    this._emit('toggle', { open: nextOpen });
    this._emit('update:open', { open: nextOpen });
    // Re-render to update aria-expanded and classes
    this._render();
    this._events();
  }

  disconnectedCallback() {
    if (this._keydownHandler) {
      document.removeEventListener('keydown', this._keydownHandler);
      this._keydownHandler = null;
    }
    if (this._outsideHandler) {
      document.removeEventListener('click', this._outsideHandler);
      this._outsideHandler = null;
    }
  }
}

if (!customElements.get('w-speed-dial')) customElements.define('w-speed-dial', WSpeedDial);
