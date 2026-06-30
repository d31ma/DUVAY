/* <w-snackbar-queue> — DuVay component module */
import { wNumberAttr, wRows } from './utils.js';
import './snackbar.js';

export class WSnackbarQueue extends WElement {
  static attrs = ['messages', 'duration', 'timeout', 'color', 'location', 'variant'];

  get messages() { return wRows(this._attr('messages', '')); }
  get duration() { return this.hasAttribute('timeout') ? wNumberAttr(this, 'timeout', 5000) : wNumberAttr(this, 'duration', 5000); }

  // Common snackbar props forwarded to every queued item.
  _forwarded() {
    return ['color', 'location', 'variant']
      .filter((a) => this.hasAttribute(a))
      .map((a) => `${a}="${this._esc(this.getAttribute(a))}"`)
      .join(' ');
  }

  _template() {
    if (!this.__queue) this.__queue = this.messages.map((message) => ({ message, id: Math.random().toString(36).slice(2) }));
    const fwd = this._forwarded();
    return `<div class="w-snackbar-queue" aria-live="polite">
      ${this.__queue.map((item) => `<w-snackbar open message="${this._esc(item.message)}" timeout="${this.duration}" data-id="${this._esc(item.id)}" ${fwd}></w-snackbar>`).join('')}
      <slot></slot>
    </div>`;
  }

  _events() {
    this.querySelectorAll('w-snackbar[data-id]').forEach((snackbar) => {
      snackbar.addEventListener('close', () => this._remove(snackbar.getAttribute('data-id')));
    });
  }

  push(message, options = {}) {
    if (!this.__queue) this.__queue = [];
    this.__queue.push({
      id: Math.random().toString(36).slice(2),
      message: String(message || ''),
      ...options,
    });
    this._render();
    this._events();
  }

  _remove(id) {
    this.__queue = (this.__queue || []).filter((item) => item.id !== id);
    this._render();
    this._events();
  }
}

if (!customElements.get('w-snackbar-queue')) customElements.define('w-snackbar-queue', WSnackbarQueue);
