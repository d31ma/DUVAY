/* <w-send-status> — the send state of one message or list row that was
 * written on the device. See docs/offline-states.md, section 4.
 *
 * Attributes:
 *   state                - (empty) | waiting | sending | failed | sent;
 *                          empty shows nothing
 *   reason               - text shown after the failed text
 *   written-at           - ISO 8601 time; with `sent` shows the written text;
 *                          `sent` without it shows nothing
 *   announce             - on | off (default on); off stops the failure
 *                          announcement
 *   icon                 - replaces the state's icon; "false" hides it
 *   icon-set             - icon registry set used to resolve `icon`
 *   waiting-text         - default "Waiting to send"
 *   sending-text         - default "Sending…"
 *   failed-text          - default "Not sent"
 *   written-text         - default "Written offline at {time}"
 *   failed-announce-text - default "{count} not sent. Needs your attention."
 *
 * Slots:
 *   actions - the app's buttons (for example Edit, Retry, Discard)
 *
 * Events: none.
 *
 * The text is read with its row; it is not a live region. A change to
 * `failed` after the first render is counted through WLiveAnnouncer (key
 * "w-send-status", 1 second), so 20 rows failing at once make one polite
 * announcement. The element never takes focus.
 */

import WIcons from '../icons.js';
import { WOfflineText } from './offline-text.js';
import { WLiveAnnouncer } from './live-announcer.js';

export class WSendStatus extends WElement {
  static attrs = [
    'state',
    'reason',
    'written-at',
    'announce',
    'icon',
    'icon-set',
    'waiting-text',
    'sending-text',
    'failed-text',
    'written-text',
    'failed-announce-text',
  ];

  static states = ['waiting', 'sending', 'failed', 'sent'];
  static failedState = 'failed';
  static stateAttribute = 'state';
  static announceOff = 'off';
  static announcerKey = 'w-send-status';
  static announceDelayMs = 1000;
  static hiddenIconValues = ['false', '0', 'none', 'off'];
  static defaultTexts = {
    'waiting-text': 'Waiting to send',
    'sending-text': 'Sending…',
    'failed-text': 'Not sent',
    'written-text': 'Written offline at {time}',
    'failed-announce-text': '{count} not sent. Needs your attention.',
  };

  static iconShapes = {
    waiting: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>',
    still: '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="6 11 12 5 18 11"/>',
    failed: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="7.5" x2="12" y2="12.5"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    sent: '<circle cx="12" cy="12" r="9"/><polyline points="8 12.5 11 15.5 16 9.5"/>',
  };

  /** @param {string} name @param {string | null} oldValue @param {string | null} newValue @returns {void} */
  attributeChangedCallback(name, oldValue, newValue) {
    const wasRendered = this._rendered;
    super.attributeChangedCallback(name, oldValue, newValue);
    this._announceFailure(wasRendered, name, oldValue, newValue);
  }

  /** @returns {string} */
  _template() {
    const state = this._shownState();
    return `<span class="w-send-status w-send-status--${state || 'none'}"${this._hiddenAttribute(state)}>`
      + this._iconMarkup(state)
      + this._leadMarkup(state)
      + this._reasonMarkup(state)
      + '<span class="w-send-status-actions"><slot name="actions"></slot></span>'
      + '</span>';
  }

  /** @returns {string} */
  _shownState() {
    const state = this._knownState();
    return this._stateText(state) ? state : '';
  }

  /** @returns {string} */
  _knownState() {
    const state = this._attr(WSendStatus.stateAttribute, '');
    return WSendStatus.states.includes(state) ? state : '';
  }

  /** @param {string} state @returns {string} */
  _stateText(state) {
    const texts = {
      '': '',
      waiting: this._text('waiting-text'),
      sending: this._text('sending-text'),
      failed: this._text('failed-text'),
      sent: this._writtenText(this._writtenTime()),
    };
    return texts[state];
  }

  /** @param {string} name @returns {string} */
  _text(name) {
    return this._attr(name, WSendStatus.defaultTexts[name]);
  }

  /** @returns {string} */
  _writtenTime() {
    return WOfflineText.time(this._attr('written-at', ''), WOfflineText.locale(this));
  }

  /** @param {string} time @returns {string} */
  _writtenText(time) {
    if (!time) return '';
    return WOfflineText.fill(this._text('written-text'), { time });
  }

  /** @param {string} state @returns {string} */
  _hiddenAttribute(state) {
    return state ? '' : ' hidden';
  }

  /** @param {string} state @returns {string} */
  _iconMarkup(state) {
    const icon = this.getAttribute('icon');
    if (icon === null) return WSendStatus.builtInIcon(state);
    return this._customIcon(icon);
  }

  /** @param {string} icon @returns {string} */
  _customIcon(icon) {
    if (WSendStatus.hiddenIconValues.includes(icon.toLowerCase())) return '';
    const set = this._attr('icon-set', '');
    const name = set ? `${set}:${icon}` : icon;
    return `<span class="w-send-status-icon" aria-hidden="true">${WIcons.resolve(name, { iconClass: 'w-send-status-icon-text' })}</span>`;
  }

  /** @param {string} state @returns {string} */
  _leadMarkup(state) {
    return `<span class="w-send-status-lead"><span class="w-send-status-text">${this._esc(this._stateText(state))}</span>`
      + this._separatorMarkup(state)
      + '</span>';
  }

  /** @param {string} state @returns {string} */
  _separatorMarkup(state) {
    if (!this._shownReason(state)) return '';
    return '<span class="w-send-status-separator" aria-hidden="true">·</span>';
  }

  /** @param {string} state @returns {string} */
  _reasonMarkup(state) {
    const reason = this._shownReason(state);
    if (!reason) return '';
    return `<span class="w-send-status-detail"><span class="w-send-status-reason">${this._esc(reason)}</span></span>`;
  }

  /** @param {string} state @returns {string} */
  _shownReason(state) {
    if (state !== WSendStatus.failedState) return '';
    return this._attr('reason', '');
  }

  /** @param {boolean} wasRendered @param {string} name @param {string | null} oldValue @param {string | null} newValue @returns {void} */
  _announceFailure(wasRendered, name, oldValue, newValue) {
    if (!this._isNewFailure(wasRendered, name, oldValue, newValue)) return;
    WLiveAnnouncer.tally(WSendStatus.announcerKey, this._text('failed-announce-text'), WSendStatus.announceDelayMs);
  }

  /** @param {boolean} wasRendered @param {string} name @param {string | null} oldValue @param {string | null} newValue @returns {boolean} */
  _isNewFailure(wasRendered, name, oldValue, newValue) {
    return wasRendered
      && name === WSendStatus.stateAttribute
      && newValue === WSendStatus.failedState
      && oldValue !== WSendStatus.failedState
      && this._attr('announce', '') !== WSendStatus.announceOff;
  }

  /** @param {string} state @returns {string} */
  static builtInIcon(state) {
    if (!state) return '';
    const shape = state === 'sending' ? WSendStatus.spinner() : WSendStatus.svg(WSendStatus.iconShapes[state], '');
    return `<span class="w-send-status-icon" aria-hidden="true">${shape}</span>`;
  }

  /** @returns {string} */
  static spinner() {
    return '<span class="w-send-status-spinner"></span>' + WSendStatus.svg(WSendStatus.iconShapes.still, ' w-send-status-still');
  }

  /** @param {string} shape @param {string} extraClass @returns {string} */
  static svg(shape, extraClass) {
    return `<svg class="w-send-status-svg${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">${shape}</svg>`;
  }
}

if (!customElements.get('w-send-status')) {
  customElements.define('w-send-status', WSendStatus);
}

export default WSendStatus;
