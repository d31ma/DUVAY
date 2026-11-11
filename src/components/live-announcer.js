/* WLiveAnnouncer — one shared, polite screen-reader message line per page,
 * for elements that must not each own a live region (a list of 100 rows
 * must never make 100 announcements). See docs/offline-states.md.
 *
 * The line is a visually hidden <div id="w-live-announcer" role="status"
 * aria-live="polite" aria-atomic="true">, added to <body> on first use.
 *
 * Static methods:
 *   announce(key, text, delayMs?) - says `text` once after `delayMs`
 *                                   (default 0). Later calls with the same key
 *                                   inside that time replace the text.
 *   tally(key, template, delayMs?) - counts calls with the same key inside
 *                                   `delayMs` (default 1000), then says
 *                                   `template` with {count} filled in once.
 *   cancel(key)                   - drops a waiting message
 *
 * The window starts at the first call and is never extended, so a steady
 * stream of changes still speaks once per window. Messages from several keys
 * that become due together are joined into one announcement.
 */

import { WOfflineText } from './offline-text.js';

export class WLiveAnnouncer {
  static regionId = 'w-live-announcer';
  static tallyDelayMs = 1000;
  static clearGapMs = 50;
  static waiting = new Map();
  static due = [];
  static writeTimer = 0;

  /** @param {string} key @param {string} text @param {number} [delayMs] @returns {void} */
  static announce(key, text, delayMs = 0) {
    const entry = WLiveAnnouncer.entryFor(key, delayMs);
    entry.render = () => String(text ?? '');
  }

  /** @param {string} key @param {string} template @param {number} [delayMs] @returns {void} */
  static tally(key, template, delayMs = WLiveAnnouncer.tallyDelayMs) {
    const entry = WLiveAnnouncer.entryFor(key, delayMs);
    entry.count += 1;
    entry.render = () => WOfflineText.fill(template, { count: entry.count });
  }

  /** @param {string} key @returns {void} */
  static cancel(key) {
    clearTimeout(WLiveAnnouncer.waiting.get(key)?.timer);
    WLiveAnnouncer.waiting.delete(key);
  }

  /** @param {string} key @param {number} delayMs @returns {{count: number, render: () => string, timer: number}} */
  static entryFor(key, delayMs) {
    const existing = WLiveAnnouncer.waiting.get(key);
    if (existing) return existing;
    const entry = { count: 0, render: () => '', timer: 0 };
    entry.timer = setTimeout(() => WLiveAnnouncer.release(key), Math.max(0, Number(delayMs) || 0));
    WLiveAnnouncer.waiting.set(key, entry);
    return entry;
  }

  /** @param {string} key @returns {void} */
  static release(key) {
    const entry = WLiveAnnouncer.waiting.get(key);
    WLiveAnnouncer.waiting.delete(key);
    WLiveAnnouncer.queue(entry?.render() || '');
  }

  /** @param {string} text @returns {void} */
  static queue(text) {
    if (!text) return;
    WLiveAnnouncer.due.push(text);
    WLiveAnnouncer.scheduleWrite();
  }

  /** @returns {void} */
  static scheduleWrite() {
    if (WLiveAnnouncer.writeTimer) return;
    WLiveAnnouncer.region().textContent = '';
    WLiveAnnouncer.writeTimer = setTimeout(() => WLiveAnnouncer.write(), WLiveAnnouncer.clearGapMs);
  }

  /** @returns {void} */
  static write() {
    WLiveAnnouncer.writeTimer = 0;
    WLiveAnnouncer.region().textContent = WLiveAnnouncer.due.join(' ');
    WLiveAnnouncer.due = [];
  }

  /** @returns {HTMLElement} */
  static region() {
    const existing = document.getElementById(WLiveAnnouncer.regionId);
    if (existing) return existing;
    const region = WLiveAnnouncer.createRegion();
    document.body.appendChild(region);
    return region;
  }

  /** @returns {HTMLElement} */
  static createRegion() {
    const region = document.createElement('div');
    region.id = WLiveAnnouncer.regionId;
    region.className = 'w-sr-only';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    return region;
  }
}

export default WLiveAnnouncer;
