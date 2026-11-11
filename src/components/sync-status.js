/* <w-sync-status> — whether the app is online and how fresh the device copy
 * is, for example "Offline · updated 08:12 · 3 waiting to send".
 * See docs/offline-states.md, section 3.
 *
 * Attributes:
 *   state            - online | syncing | offline | locked (default online)
 *   updated-at       - ISO 8601 time of the last successful sync
 *   pending          - items waiting to send (default 0)
 *   attention        - items that need the user (default 0)
 *   variant          - bar | chip (default bar)
 *   sticky           - pins the bar to the top of its scroll container
 *   show-online      - also shows the bar when online with nothing waiting
 *   icon, icon-set   - replaces the built-in icon; icon="false" hides it
 *   offline-text, syncing-text, online-text, locked-text - the state words
 *   updated-text     - "updated {time}"; left out when updated-at is empty
 *   pending-text     - "{count} waiting to send"; left out at 0
 *   attention-text   - "Needs your attention: {count}"; left out at 0
 *   back-online-text - announced when offline or locked turns online or syncing
 *
 * Slots: actions (the app's buttons), prepend (a custom icon).
 * Events: none.
 *
 * The visible text is not a live region. One hidden role="status" line speaks
 * only state changes, politely; changes within 2 seconds make one message,
 * or none when the state ends where it started. The first render is silent.
 */

import WIcons from '../icons.js';
import { WOfflineText } from './offline-text.js';

class WSyncStatus extends WElement {
  static attrs = [
    'state', 'updated-at', 'pending', 'attention', 'variant', 'sticky', 'show-online', 'icon', 'icon-set',
    'offline-text', 'syncing-text', 'online-text', 'locked-text', 'updated-text', 'pending-text',
    'attention-text', 'back-online-text',
  ];

  static states = ['online', 'syncing', 'offline', 'locked'];
  static variants = ['bar', 'chip'];
  static awayStates = ['offline', 'locked'];
  static hiddenIconValues = ['false', '0', 'none', 'off'];
  static announceWindowMs = 2000;
  static clearGapMs = 50;
  static separator = '<span class="w-sync-status__separator" aria-hidden="true">·</span>';
  static texts = {
    offline: 'Offline',
    syncing: 'Updating…',
    online: 'Up to date',
    locked: 'Locked. Sign in to open the copy on this device.',
    updated: 'updated {time}',
    pending: '{count} waiting to send',
    attention: 'Needs your attention: {count}',
    'back-online': 'Back online',
  };
  static svg = '<svg class="w-sync-status__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  static icons = {
    offline: '<path d="M22.6 17A5 5 0 0 0 18 10h-1.3A8 8 0 0 0 9.7 4M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"/><path d="M1 1l22 22"/>',
    syncing: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/>',
    locked: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    online: '<path d="M20 6L9 17l-5-5"/>',
  };

  get state()      { return this._oneOf(this._attr('state', ''), WSyncStatus.states); }
  get variant()    { return this._oneOf(this._attr('variant', ''), WSyncStatus.variants); }
  get pending()    { return this._count('pending'); }
  get attention()  { return this._count('attention'); }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    this._noticeState(name);
  }

  _render() {
    const line = this._liveLine();
    super._render();
    this.appendChild(line);
  }

  _template() {
    const state = this.state;
    const classes = `w-sync-status w-sync-status--${this.variant} w-sync-status--${state}${this._cls({ 'w-sync-status--sticky': this._bool('sticky') })}`;
    const parts = [this._stateWords(state), this._updatedWords(), this._countWords('pending'), this._countWords('attention')];
    const text = parts.filter(Boolean).join(WSyncStatus.separator);
    return `<div class="${classes}"${this._attrs({ hidden: this._isHidden(state) })}>${this._prepend(state)}<span class="w-sync-status__text">${text}</span>${this._actions()}</div>`;
  }

  _liveLine() {
    if (!this._line) this._line = this._newLiveLine();
    return this._line;
  }

  _newLiveLine() {
    const line = document.createElement('span');
    line.className = 'w-sr-only w-sync-status__live';
    line.setAttribute('role', 'status');
    line.setAttribute('aria-live', 'polite');
    line.setAttribute('aria-atomic', 'true');
    this._heardState = this.state;
    return line;
  }

  _noticeState(name) {
    if (name !== 'state' || !this._rendered || this._windowTimer) return;
    this._windowTimer = setTimeout(() => this._closeWindow(), WSyncStatus.announceWindowMs);
  }

  _closeWindow() {
    const message = this._messageFor(this._heardState, this.state);
    this._windowTimer = 0;
    this._heardState = this.state;
    this._speak(message);
  }

  _messageFor(from, to) {
    if (from === to) return '';
    if (WSyncStatus.awayStates.includes(to)) return this._text(to);
    return this._backOnlineText(from);
  }

  _backOnlineText(from) {
    return WSyncStatus.awayStates.includes(from) ? this._text('back-online') : '';
  }

  _speak(message) {
    if (!message) return;
    this._line.textContent = '';
    setTimeout(() => { this._line.textContent = message; }, WSyncStatus.clearGapMs);
  }

  _isHidden(state) {
    return state === 'online' && this.pending === 0 && this.attention === 0 && !this._bool('show-online');
  }

  _stateWords(state) {
    return `<span class="w-sync-status__state">${this._esc(this._text(state))}</span>`;
  }

  _updatedWords() {
    const time = WOfflineText.time(this._attr('updated-at', ''), WOfflineText.locale(this));
    return time ? this._part(WOfflineText.fill(this._text('updated'), { time })) : '';
  }

  _countWords(name) {
    const count = this._count(name);
    return count ? this._part(WOfflineText.fill(this._text(name), { count: this._number(count) })) : '';
  }

  _part(words) {
    return `<span class="w-sync-status__part">${this._esc(words)}</span>`;
  }

  _prepend(state) {
    if (this._hasSlot('prepend')) return '<span class="w-sync-status__icon"><slot name="prepend"></slot></span>';
    return this._iconBox(this._iconMarkup(state));
  }

  _iconBox(markup) {
    return markup ? `<span class="w-sync-status__icon" aria-hidden="true">${markup}</span>` : '';
  }

  _iconMarkup(state) {
    const icon = this.getAttribute('icon');
    if (icon === null) return this._builtInIcon(state);
    return this._customIcon(icon);
  }

  _customIcon(icon) {
    if (WSyncStatus.hiddenIconValues.includes(icon.toLowerCase())) return '';
    return WIcons.resolve(this._iconName(icon), { iconClass: 'w-icon' });
  }

  _iconName(icon) {
    const iconSet = this.getAttribute('icon-set');
    return iconSet ? `${iconSet}:${icon}` : icon;
  }

  _builtInIcon(state) {
    const still = `${WSyncStatus.svg}${WSyncStatus.icons[state]}</svg>`;
    if (state !== 'syncing') return still;
    return `<span class="w-sync-status__spinner"></span><span class="w-sync-status__still">${still}</span>`;
  }

  _actions() {
    return this._hasSlot('actions') ? '<span class="w-sync-status__actions"><slot name="actions"></slot></span>' : '';
  }

  _text(name) {
    return this._attr(`${name}-text`, WSyncStatus.texts[name]);
  }

  _number(count) {
    return new Intl.NumberFormat(WOfflineText.safeLocale(WOfflineText.locale(this))).format(count);
  }

  _count(name) {
    return Math.floor(WOfflineText.positiveNumber(this._attr(name, '0')));
  }

  _oneOf(value, allowed) {
    return allowed.includes(value) ? value : allowed[0];
  }

  _hasSlot(name) {
    return !!this.querySelector(`[slot="${name}"]`);
  }
}

if (!customElements.get('w-sync-status')) customElements.define('w-sync-status', WSyncStatus);
