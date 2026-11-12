/* <w-sync-status> — whether the app is online and how fresh the device copy
 * is, for example "Offline · updated 08:12 · 3 waiting to send".
 * See docs/offline-states.md, section 3.
 *
 * Attributes:
 *   state            - online | syncing | offline | locked | sending | sent
 *                      (default online)
 *   updated-at       - ISO 8601 time of the last successful sync
 *   pending          - items waiting to send (default 0)
 *   attention        - items that need the user (default 0)
 *   sent             - items sent in this round (default 0); with `sending`
 *                      gives "3 of 4", with `sent` gives "4 sent"
 *   progress         - 0 to 1; a thin line along the bottom while syncing or
 *                      sending
 *   sent-timeout     - ms the `sent` summary stays (default 4000; 0 keeps it)
 *   hour-cycle       - h11 | h12 | h23 | h24 (default: the locale's habit)
 *   variant          - bar | chip (default bar)
 *   sticky           - pins the bar to the top of its scroll container
 *   show-online      - also shows the bar when online with nothing waiting
 *   icon, icon-set   - replaces the built-in icon; icon="false" hides it
 *   offline-text, syncing-text, sending-text, online-text, locked-text - the
 *                      state words (`sent` uses online-text); "" leaves it out
 *   updated-text     - "updated {time}"; left out when updated-at is empty
 *   syncing-updated-text - the time text while syncing (default updated-text)
 *   pending-text     - "{count} waiting to send"; left out at 0
 *   attention-text   - "Needs your attention: {count}"; left out at 0
 *   queue-text       - "{current} of {total}" while sending
 *   sent-text        - "{count} sent" in the `sent` state
 *   others-sent-text - "{count} others sent" in the `sent` state with attention
 *   <count text>-zero|one|two|few|many|other - plural forms of the five count
 *                      texts and of sent-announce-text (Intl.PluralRules)
 *   offline-announce-text, locked-announce-text - announced instead of the
 *                      state words; {time} is the last sync
 *   sent-announce-text - "Up to date. {count} sent."
 *   back-online-text - announced when offline or locked turns online, syncing
 *                      or sending
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
  static countTexts = ['pending', 'attention', 'queue', 'sent', 'others-sent', 'sent-announce'];
  static attrs = [
    'state', 'updated-at', 'pending', 'attention', 'sent', 'progress', 'sent-timeout', 'hour-cycle', 'variant',
    'sticky', 'show-online', 'icon', 'icon-set', 'offline-text', 'syncing-text', 'sending-text', 'online-text',
    'locked-text', 'updated-text', 'syncing-updated-text', 'pending-text', 'attention-text', 'queue-text',
    'sent-text', 'others-sent-text', 'back-online-text', 'offline-announce-text', 'locked-announce-text',
    'sent-announce-text', ...WOfflineText.pluralAttributes(WSyncStatus.countTexts),
  ];

  static states = ['online', 'syncing', 'offline', 'locked', 'sending', 'sent'];
  static variants = ['bar', 'chip'];
  static awayStates = ['offline', 'locked'];
  static busyStates = ['syncing', 'sending'];
  static sameLook = { sent: 'online' };
  static hiddenIconValues = ['false', '0', 'none', 'off'];
  static announceWindowMs = 2000;
  static clearGapMs = 50;
  static sentTimeoutMs = 4000;
  static fullPercent = 100;
  static timePlaceholder = '{time}';
  static separator = '<span class="w-sync-status__separator" aria-hidden="true">·</span>';
  static texts = {
    offline: 'Offline',
    syncing: 'Updating…',
    sending: 'Sending…',
    online: 'Up to date',
    locked: 'Locked. Sign in to open the copy on this device.',
    updated: 'updated {time}',
    pending: '{count} waiting to send',
    attention: 'Needs your attention: {count}',
    queue: '{current} of {total}',
    sent: '{count} sent',
    'others-sent': '{count} others sent',
    'sent-announce': 'Up to date. {count} sent.',
    'back-online': 'Back online',
  };
  static svg = '<svg class="w-sync-status__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  static icons = {
    offline: '<path d="M22.6 17A5 5 0 0 0 18 10h-1.3A8 8 0 0 0 9.7 4M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"/><path d="M1 1l22 22"/>',
    syncing: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/>',
    sending: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    locked: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    online: '<path d="M20 6L9 17l-5-5"/>',
  };

  get state()      { return this._oneOf(this._attr('state', ''), WSyncStatus.states); }
  get variant()    { return this._oneOf(this._attr('variant', ''), WSyncStatus.variants); }
  get pending()    { return this._count('pending'); }
  get attention()  { return this._count('attention'); }
  get sent()       { return this._count('sent'); }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    this._noticeState(name);
  }

  _render() {
    const line = this._liveLine();
    this._keepSummary();
    super._render();
    this.appendChild(line);
    this._planSummaryEnd();
  }

  _template() {
    const state = this._shownState();
    const classes = `w-sync-status w-sync-status--${this.variant} w-sync-status--${state}${this._cls({ 'w-sync-status--sticky': this._bool('sticky') })}`;
    const text = this._parts(state).filter(Boolean).join(WSyncStatus.separator);
    return `<div class="${classes}"${this._attrs({ hidden: this._isHidden(state) })}>${this._prepend(state)}<span class="w-sync-status__text">${text}</span>${this._actions()}${this._progressLine(state)}</div>`;
  }

  _parts(state) {
    return [
      this._stateWords(state),
      this._updatedWords(state),
      this._queueWords(state),
      this._pendingWords(state),
      this._countWords('attention', this.attention),
      this._sentWords(state),
    ];
  }

  _shownState() {
    const state = this.state;
    return state === 'sent' && this._summaryDone ? 'online' : state;
  }

  _keepSummary() {
    if (this.state !== 'sent') this._endSummaryTimer(false);
  }

  _planSummaryEnd() {
    if (this._summaryTimer || this._summaryDone || this.state !== 'sent') return;
    const timeout = this._sentTimeout();
    if (timeout) this._summaryTimer = setTimeout(() => this._endSummary(), timeout);
  }

  _endSummary() {
    this._summaryTimer = 0;
    if (this.attention || this.state !== 'sent') return;
    this._summaryDone = true;
    this._render();
  }

  _endSummaryTimer(done) {
    clearTimeout(this._summaryTimer);
    this._summaryTimer = 0;
    this._summaryDone = done;
  }

  _sentTimeout() {
    const timeout = this._numberAttr('sent-timeout');
    return timeout >= 0 ? timeout : WSyncStatus.sentTimeoutMs;
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
    if (to === 'sent' && this.sent) return this._sentAnnouncement();
    if (WSyncStatus.awayStates.includes(to)) return this._awayAnnouncement(to);
    return this._backOnlineText(from);
  }

  _sentAnnouncement() {
    const template = WOfflineText.countText(this, 'sent-announce', this.sent, WSyncStatus.texts['sent-announce']);
    return WOfflineText.fill(template, { count: this._number(this.sent) });
  }

  _awayAnnouncement(state) {
    const template = this._attr(`${state}-announce-text`, '');
    const time = this._time();
    const needsTime = template.includes(WSyncStatus.timePlaceholder) && !time;
    return template && !needsTime ? WOfflineText.fill(template, { time }) : this._text(state);
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
    const words = this._text(WSyncStatus.sameLook[state] || state);
    return words ? `<span class="w-sync-status__state">${this._esc(words)}</span>` : '';
  }

  _updatedWords(state) {
    const time = this._time();
    const template = state === 'syncing' ? this._attr('syncing-updated-text', this._text('updated')) : this._text('updated');
    return time ? this._part(WOfflineText.fill(template, { time })) : '';
  }

  _queueWords(state) {
    const queue = WOfflineText.queueParts(this.sent, this.pending);
    if (state !== 'sending' || !queue) return '';
    const template = WOfflineText.countText(this, 'queue', queue.total, WSyncStatus.texts.queue);
    return this._part(WOfflineText.fill(template, { current: this._number(queue.current), total: this._number(queue.total) }));
  }

  _pendingWords(state) {
    return state === 'sending' ? '' : this._countWords('pending', this.pending);
  }

  _sentWords(state) {
    if (state !== 'sent') return '';
    return this._countWords(this.attention ? 'others-sent' : 'sent', this.sent);
  }

  _countWords(name, count) {
    if (!count) return '';
    const template = WOfflineText.countText(this, name, count, WSyncStatus.texts[name]);
    return this._part(WOfflineText.fill(template, { count: this._number(count) }));
  }

  _part(words) {
    return `<span class="w-sync-status__part">${this._esc(words)}</span>`;
  }

  _progressLine(state) {
    const share = this._numberAttr('progress');
    if (!WSyncStatus.busyStates.includes(state) || Number.isNaN(share)) return '';
    const percent = Math.min(Math.max(share, 0), 1) * WSyncStatus.fullPercent;
    return `<span class="w-sync-status__progress" aria-hidden="true"><span class="w-sync-status__progress-bar" style="inline-size: ${percent}%"></span></span>`;
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
    if (icon === null) return this._builtInIcon(WSyncStatus.sameLook[state] || state);
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
    if (!WSyncStatus.busyStates.includes(state)) return still;
    return `<span class="w-sync-status__spinner"></span><span class="w-sync-status__still">${still}</span>`;
  }

  _actions() {
    return this._hasSlot('actions') ? '<span class="w-sync-status__actions"><slot name="actions"></slot></span>' : '';
  }

  _text(name) {
    return this._attr(`${name}-text`, WSyncStatus.texts[name]);
  }

  _time() {
    const hourCycle = this._attr('hour-cycle', '');
    return WOfflineText.time(this._attr('updated-at', ''), WOfflineText.locale(this), new Date(), hourCycle);
  }

  _number(count) {
    return WOfflineText.number(count, WOfflineText.locale(this));
  }

  _numberAttr(name) {
    const raw = this._attr(name, '').trim();
    const value = Number(raw);
    return raw && Number.isFinite(value) ? value : NaN;
  }

  _count(name) {
    return WOfflineText.wholeNumber(this._attr(name, '0'));
  }

  _oneOf(value, allowed) {
    return allowed.includes(value) ? value : allowed[0];
  }

  _hasSlot(name) {
    return !!this.querySelector(`[slot="${name}"]`);
  }
}

if (!customElements.get('w-sync-status')) customElements.define('w-sync-status', WSyncStatus);
