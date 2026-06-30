/* <w-snackbar-queue> — DuVay component module */
import { wNumberAttr, wRows } from './utils.js';
import './snackbar.js';

export class WSnackbarQueue extends WElement {
  static attrs = ['messages', 'duration'];

  get messages() { return wRows(this._attr('messages', '')); }
  get duration() { return wNumberAttr(this, 'duration', 5000); }

  _template() {
    if (!this.__queue) this.__queue = this.messages.map((message) => ({ message, id: Math.random().toString(36).slice(2) }));
    return `<div class="w-snackbar-queue" aria-live="polite">
      ${this.__queue.map((item) => `<w-snackbar open message="${this._esc(item.message)}" duration="${this.duration}" data-id="${this._esc(item.id)}"></w-snackbar>`).join('')}
      <slot></slot>
    </div>`;
  }

  _events() {
    this.querySelectorAll('w-snackbar[data-id]').forEach((snackbar) => {
      snackbar.addEventListener('w-close', () => this._remove(snackbar.getAttribute('data-id')));
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
