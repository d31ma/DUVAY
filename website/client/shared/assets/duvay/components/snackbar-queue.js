/* <w-snackbar-queue> — stack of snackbars fed from a message list.
 *
 * Attributes:
 *   messages        - comma/semicolon list or JSON array of messages
 *   text            - single message used when `messages` is empty
 *   duration/timeout- auto-dismiss ms handed to every queued snackbar
 *   total-visible   - how many snackbars are on screen at once
 *   display-strategy- "hold" (default) queues extras, "overflow" drops the oldest
 *   gap             - pixels between stacked snackbars
 *   collapsed       - stack the snackbars behind each other, expand on hover
 *
 * Every remaining attribute is a <w-snackbar> prop forwarded to each queued
 * item: title, color, location, variant, vertical, timer, timer-color,
 * reverse-timer, closable, close-text, prepend-icon, prepend-avatar,
 * transition, origin, target, absolute, contained, content-class, opacity,
 * z-index, close-on-back, open-on-click/-hover/-focus, open-delay,
 * close-delay and close-on-content-click.
 *
 * Methods: push(message)
 */
import { wNumberAttr, wRows } from './utils.js';
import { wOverlayFlag, wOverlayNumber } from './overlay.js';
import './snackbar.js';

// <w-snackbar> props the queue passes straight through to every item.
const FORWARDED = [
  'color', 'location', 'variant', 'title', 'vertical', 'timer', 'timer-color',
  'reverse-timer', 'closable', 'close-text', 'prepend-icon', 'prepend-avatar',
  'transition', 'origin', 'target', 'absolute', 'contained', 'content-class',
  'opacity', 'z-index', 'close-on-back', 'open-on-click', 'open-on-hover',
  'open-on-focus', 'open-delay', 'close-delay', 'close-on-content-click',
  'collapsed',
];

let wQueueSeq = 0;
const wQueueId = () => 'wq' + (wQueueSeq += 1) + Math.random().toString(36).slice(2, 6);

export class WSnackbarQueue extends WElement {
  static attrs = [
    'messages', 'text', 'duration', 'timeout', 'color', 'location', 'variant',
    'title', 'vertical', 'timer', 'timer-color', 'reverse-timer', 'closable',
    'close-text', 'prepend-icon', 'prepend-avatar', 'transition', 'origin',
    'target', 'absolute', 'contained', 'content-class', 'opacity', 'z-index',
    'close-on-back', 'open-on-click', 'open-on-hover', 'open-on-focus',
    'open-delay', 'close-delay', 'close-on-content-click', 'collapsed',
    'gap', 'total-visible', 'display-strategy',
  ];

  get messages() { return wRows(this._attr('messages', '')); }
  get duration() { return this.hasAttribute('timeout') ? wNumberAttr(this, 'timeout', 5000) : wNumberAttr(this, 'duration', 5000); }
  get totalVisible() { return wOverlayNumber(this, 'total-visible', 0); }
  get collapsed() { return wOverlayFlag(this, 'collapsed', false); }

  // Common snackbar props forwarded to every queued item.
  _forwarded() {
    return FORWARDED
      .filter((a) => this.hasAttribute(a))
      .map((a) => `${a}="${this._esc(this.getAttribute(a))}"`)
      .join(' ');
  }

  // `text` seeds a single message when no list was given.
  _initialQueue() {
    const listed = this.messages;
    const fallback = this._attr('text', '');
    const source = listed.length ? listed : [fallback].filter(Boolean);
    return source.map((message) => ({ message, id: wQueueId() }));
  }

  // `total-visible` caps how many are on screen; the rest wait their turn.
  _visible() {
    const items = this.__queue || [];
    return this.totalVisible > 0 ? items.slice(0, this.totalVisible) : items;
  }

  _queueClass() {
    return 'w-snackbar-queue' + this._cls({ 'w-snackbar-queue--collapsed': this.collapsed });
  }

  _item(item, index, forwarded, gap) {
    const stacked = gap ? ` queue-gap="${this._esc(gap)}"` : '';
    return `<w-snackbar open message="${this._esc(item.message)}" timeout="${this.duration}"`
      + ` data-id="${this._esc(item.id)}" queue-index="${index}"${stacked} ${forwarded}></w-snackbar>`;
  }

  _template() {
    if (!this.__queue) this.__queue = this._initialQueue();
    const forwarded = this._forwarded();
    const gap = this.getAttribute('gap');
    const items = this._visible().map((item, index) => this._item(item, index, forwarded, gap));
    return `<div class="${this._queueClass()}" aria-live="polite">
      ${items.join('')}
      <slot></slot>
    </div>`;
  }

  _events() {
    this.querySelectorAll('w-snackbar[data-id]').forEach((snackbar) => {
      snackbar.addEventListener('close', () => this._remove(snackbar.getAttribute('data-id')));
    });
  }

  push(message, options = {}) {
    if (!this.__queue) this.__queue = this._initialQueue();
    this._makeRoom();
    this.__queue.push({
      id: wQueueId(),
      message: String(message || ''),
      ...options,
    });
    this._render();
    this._events();
  }

  // display-strategy="overflow" dismisses the oldest snackbar so a new one can
  // show immediately; the default "hold" leaves it queued behind the visible.
  _makeRoom() {
    const limit = this.totalVisible;
    if (limit <= 0 || this.__queue.length < limit) return;
    if (String(this._attr('display-strategy', 'hold')).toLowerCase() !== 'overflow') return;
    this.__queue.shift();
  }

  _remove(id) {
    this.__queue = (this.__queue || []).filter((item) => item.id !== id);
    this._render();
    this._events();
  }
}

if (!customElements.get('w-snackbar-queue')) customElements.define('w-snackbar-queue', WSnackbarQueue);
