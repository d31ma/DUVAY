/* <w-speed-dial> — DuVay Speed Dial (Vuetify parity)
 *
 * A <w-fab>-surfaced trigger with an overlay of action FABs. The overlay props
 * are the shared ones from <w-overlay> and mean the same thing here.
 *
 * Attributes:
 *   icon                   - trigger icon name/glyph (default '+')
 *   icon-set               - icon set prefix
 *   open                   - controls visibility of the actions menu
 *   location               - top | bottom | left | right + start/end/center
 *   submenu                - open with ArrowRight / close with ArrowLeft
 *                            (mirrored for RTL); defaults location to "right start"
 *   transition             - scale (default) | slide | fade | none
 *   content-class          - extra class(es) for the actions container
 *   aria-label             - accessible label for the trigger button
 *
 *   open-on-click          - trigger click toggles the dial (default on)
 *   open-on-hover          - open on mouseenter, close on mouseleave
 *   open-on-focus          - open when the trigger takes focus
 *   open-delay/close-delay - hover/focus delays in ms (close defaults to 150)
 *   close-on-content-click - a click inside the actions closes the dial
 *   close-on-back          - the browser back button dismisses the dial
 *   persistent             - outside click / Escape bounce instead of closing
 *   no-click-animation     - suppress that bounce
 *   retain-focus /
 *   capture-focus          - keep Tab inside the actions (default on)
 *   disable-initial-focus  - deprecated alias for capture-focus="false"
 *
 *   scrim                  - true/false, or a colour for the backdrop
 *   opacity                - scrim opacity (only with scrim)
 *   z-index                - stacking order of the dial
 *   contained              - clip the dial and its scrim to the offset parent
 *   target                 - selector, "parent", or "x,y" to position against
 *   origin                 - anchor on the target the actions grow from
 *   offset                 - extra distance from the trigger / target
 *   stick-to-target        - let the actions travel off-screen with the target
 *   viewport-margin        - keep connected actions this far from the edges
 *
 * Events:
 *   toggle        - { open }
 *   update:open   - { open }
 *
 * Slots:
 *   default       - action items (w-fab or .w-fab elements)
 */

import WIcons from '../icons.js';
import {
  wBindCloseOnBack,
  wConnectedStyles,
  wOffsetPair,
  wOriginPercent,
  wOverlayFlag,
  wOverlayNumber,
  wPushBackState,
  wTargetBox,
  wTransitionClass,
  wTrapFocus,
  wUnbindCloseOnBack,
} from './overlay.js';

const W_SCRIM_FLAGS = ['true', 'false', '0', 'off', 'none'];

export class WSpeedDial extends WElement {
  static attrs = [
    'icon', 'icon-set', 'open', 'location', 'transition', 'aria-label', 'submenu',
    'content-class', 'open-on-click', 'open-on-hover', 'open-on-focus',
    'open-delay', 'close-delay', 'close-on-content-click', 'close-on-back',
    'persistent', 'no-click-animation', 'retain-focus', 'capture-focus',
    'disable-initial-focus', 'scrim', 'opacity', 'z-index', 'contained',
    'target', 'origin', 'offset', 'stick-to-target', 'viewport-margin',
  ];

  get icon()         { return this._attr('icon', '+'); }
  get iconSet()      { return this._attr('icon-set', ''); }
  get open()         { return this._bool('open'); }
  get openOnHover()  { return this._bool('open-on-hover'); }
  get submenu()      { return this._bool('submenu'); }
  get contained()    { return this._bool('contained'); }
  get persistent()   { return this._bool('persistent'); }
  get noClickAnimation() { return this._bool('no-click-animation'); }
  get contentClass() { return this._attr('content-class', ''); }
  get transition()   { return this._attr('transition', 'scale'); }
  get openDelay()    { return wOverlayNumber(this, 'open-delay', 0); }
  get closeDelay()   { return wOverlayNumber(this, 'close-delay', 150); }
  get hasScrim()     { return wOverlayFlag(this, 'scrim', false); }

  // `submenu` opens sideways, so it also moves the default anchor.
  get location() { return this._attr('location', this.submenu ? 'right start' : 'top center'); }

  // Vuetify spells the Tab trap two ways and deprecates a third; all default on
  // and any of them can opt out.
  get retainFocus() {
    if (this.hasAttribute('disable-initial-focus')) return false;
    return wOverlayFlag(this, 'retain-focus', true) && wOverlayFlag(this, 'capture-focus', true);
  }

  _locationParts() {
    const parts = this.location.split(/[-\s]+/);
    return [parts[0] || 'top', parts[1] || 'center'];
  }

  _classes() {
    const [vPos, hPos] = this._locationParts();
    return `w-speed-dial w-speed-dial--${vPos} w-speed-dial--${hPos}`
      + this._cls({
        'w-speed-dial--open': this.open,
        'w-speed-dial--submenu': this.submenu,
        'w-speed-dial--contained': this.contained,
        'w-speed-dial--persistent': this.persistent,
        'w-speed-dial--scrim': this.hasScrim,
        'w-speed-dial--connected': !!wTargetBox(this),
        'w-speed-dial--stuck': this.hasAttribute('stick-to-target'),
      })
      + this._cls({ [wTransitionClass(this.transition, 'w-speed-dial')]: true });
  }

  _rootStyle() {
    const styles = [];
    const zIndex = this.getAttribute('z-index');
    const opacity = this.getAttribute('opacity');
    const scrim = this.getAttribute('scrim');
    if (zIndex) styles.push('z-index: ' + this._esc(zIndex));
    if (opacity) styles.push('--w-speed-dial-opacity: ' + this._esc(opacity));
    if (this.contained) styles.push('position: absolute');
    if (scrim && !W_SCRIM_FLAGS.includes(scrim.toLowerCase())) {
      styles.push('--w-speed-dial-scrim: ' + this._scrimColor(scrim));
    }
    return styles.length ? ` style="${styles.join('; ')}"` : '';
  }

  _scrimColor(value) {
    const raw = String(value).trim();
    return /^[a-z][a-z0-9-]*$/i.test(raw) ? `var(--w-${raw.toLowerCase()}, ${raw})` : this._esc(raw);
  }

  // Connected placement wins; otherwise `origin` still sets the transform
  // origin so the enter animation grows from the right corner, and `offset`
  // widens the gap between the trigger and its actions.
  _actionsStyle() {
    const styles = wConnectedStyles(this);
    const origin = this.getAttribute('origin');
    if (!styles.length && origin) styles.push('transform-origin: ' + wOriginPercent(origin));
    const [distance] = wOffsetPair(this.getAttribute('offset'));
    if (distance) styles.push('--w-speed-dial-offset: ' + distance + 'px');
    return styles.length ? ` style="${styles.join('; ')}"` : '';
  }

  _actionsClass() {
    return 'w-speed-dial__actions' + this._cls({ [this.contentClass]: this.contentClass });
  }

  _template() {
    const value = this.iconSet ? `${this.iconSet}:${this.icon}` : this.icon;
    const icon = WIcons.resolve(value, { iconClass: 'w-icon' });
    const aria = this.getAttribute('aria-label') || 'Open actions';
    const scrim = this.hasScrim ? '<div class="w-speed-dial__scrim" aria-hidden="true"></div>' : '';

    return `<div class="${this._classes()}"${this._rootStyle()}>
      ${scrim}
      <button class="w-fab w-speed-dial__trigger" type="button" aria-expanded="${this.open ? 'true' : 'false'}" aria-haspopup="true" aria-label="${this._esc(aria)}">
        ${icon}
      </button>
      <div class="${this._actionsClass()}"${this._actionsStyle()}><slot></slot></div>
    </div>`;
  }

  _events() {
    const trigger = this._q('.w-speed-dial__trigger');
    const actions = this._q('.w-speed-dial__actions');
    if (!trigger || !actions) return;

    this._bindTrigger(trigger);
    this._bindActions(actions);
    this._bindHover();
    this._bindDocument();
    wBindCloseOnBack(this);
  }

  _bindTrigger(trigger) {
    trigger.addEventListener('pointerdown', () => {
      this.__wDialPointerFocus = true;
      setTimeout(() => { this.__wDialPointerFocus = false; }, 0);
    });
    if (wOverlayFlag(this, 'open-on-click', true)) {
      trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        this._toggle(!this.open);
      });
    }
    trigger.addEventListener('keydown', (event) => this._onTriggerKeydown(event));
    if (wOverlayFlag(this, 'open-on-focus', false)) {
      trigger.addEventListener('focus', () => {
        if (!this.__wDialPointerFocus) this._delayToggle(true, this.openDelay);
      });
    }
  }

  _bindActions(actions) {
    if (wOverlayFlag(this, 'close-on-content-click', false)) {
      actions.addEventListener('click', () => this._toggle(false));
    }
    actions.addEventListener('keydown', (event) => {
      if (this.retainFocus) wTrapFocus(event, actions);
    });
  }

  // The host survives re-renders, so hover is wired exactly once.
  _bindHover() {
    if (!this.openOnHover || this.__wHoverBound) return;
    this.__wHoverBound = true;
    this.addEventListener('mouseenter', () => this._delayToggle(true, this.openDelay));
    this.addEventListener('mouseleave', () => this._delayToggle(false, this.closeDelay));
  }

  _bindDocument() {
    if (this.__wKeydown) return;
    this.__wKeydown = (event) => this._onEscape(event);
    this.__wOutside = (event) => this._onOutside(event);
    document.addEventListener('keydown', this.__wKeydown);
    document.addEventListener('click', this.__wOutside);
  }

  // `submenu` swaps the open/close keys from Down/Up to Right/Left, and the
  // pair flips again under RTL.
  _keyIntent(key) {
    if (!this.submenu) return this._arrowIntent(key, 'ArrowDown', 'ArrowUp');
    const rtl = getComputedStyle(this).direction === 'rtl';
    return this._arrowIntent(key, rtl ? 'ArrowLeft' : 'ArrowRight', rtl ? 'ArrowRight' : 'ArrowLeft');
  }

  _arrowIntent(key, openKey, closeKey) {
    if (key === openKey) return true;
    if (key === closeKey) return false;
    return null;
  }

  _onTriggerKeydown(event) {
    const intent = this._keyIntent(event.key);
    if (intent === null) return;
    event.preventDefault();
    this._toggle(intent);
  }

  _delayToggle(nextOpen, delay) {
    clearTimeout(this.__wDialTimer);
    if (nextOpen === this.open) return;
    if (delay > 0) this.__wDialTimer = setTimeout(() => this._toggle(nextOpen), delay);
    else this._toggle(nextOpen);
  }

  _onEscape(event) {
    if (event.key !== 'Escape' || !this.open) return;
    event.preventDefault();
    if (this.persistent) return this._bounce();
    this._toggle(false);
    this._q('.w-speed-dial__trigger')?.focus();
  }

  _onOutside(event) {
    if (!this.open || this.contains(event.target)) return;
    if (this.persistent) return this._bounce();
    this._toggle(false);
  }

  // `persistent` refuses to close; the bounce says so, unless it is suppressed.
  _bounce() {
    const actions = this._q('.w-speed-dial__actions');
    if (!actions || this.noClickAnimation) return;
    actions.classList.remove('w-speed-dial__actions--bounce');
    actions.getBoundingClientRect();
    actions.classList.add('w-speed-dial__actions--bounce');
    setTimeout(() => actions.classList.remove('w-speed-dial__actions--bounce'), 180);
  }

  show() { this._toggle(true); }
  close() { this._toggle(false); }

  _toggle(nextOpen) {
    if (this.open === nextOpen) return;
    if (nextOpen) wPushBackState(this);
    else this.__wBackPushed = false;
    this._silentSet('open', nextOpen);
    this._emit('toggle', { open: nextOpen });
    this._emit('update:open', { open: nextOpen });
    // Re-render to update aria-expanded and classes
    this._render();
    this._events();
  }

  disconnectedCallback() {
    if (this.__wKeydown) {
      document.removeEventListener('keydown', this.__wKeydown);
      document.removeEventListener('click', this.__wOutside);
      this.__wKeydown = null;
      this.__wOutside = null;
    }
    clearTimeout(this.__wDialTimer);
    wUnbindCloseOnBack(this);
  }
}

if (!customElements.get('w-speed-dial')) customElements.define('w-speed-dial', WSpeedDial);
