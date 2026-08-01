/* <w-command-palette> — Vuetify-compatible command palette facade. */

import { WCommand } from './command.js';

export class WCommandPalette extends WCommand {
  static attrs = [
    'search', 'disabled', 'placeholder', 'offset-top', 'items', 'model-value',
    'filter-mode', 'no-filter', 'filter-keys', 'no-data-text', 'input-icon',
    'hotkey', 'close-on-select', 'fullscreen', 'scrollable', 'absolute',
    'close-on-back', 'contained', 'content-class', 'opacity', 'no-click-animation',
    'persistent', 'scrim', 'z-index', 'target', 'open-on-click', 'open-on-hover',
    'open-on-focus', 'close-on-content-click', 'close-delay', 'open-delay',
    'origin', 'offset', 'stick-to-target', 'viewport-margin', 'retain-focus',
    'capture-focus', 'transition', 'max-height', 'max-width', 'min-height',
    'min-width', 'height', 'width', 'location', 'theme',
  ];

  get empty() { return this._attr('no-data-text', 'No results found.'); }
  get _overlay() { return true; }
  get _open() {
    const model = this.getAttribute('model-value');
    return this.hasAttribute('open') || (model != null && model !== 'false' && model !== '0');
  }
  get _expanded() { return this._open; }

  _template() {
    return `<div class="w-command-overlay${this._open ? ' open' : ''}${this._bool('fullscreen') ? ' w-command-overlay--fullscreen' : ''}${this._bool('contained') ? ' w-command-overlay--contained' : ''}">${this._panel()}</div>`;
  }

  _events() {
    super._events();
    const input = this._q('.w-command-input');
    if (input && this.hasAttribute('search')) {
      input.value = this._attr('search', '');
      this._filter();
    }
  }

  _applyOpen() {
    const overlay = this._q('.w-command-overlay');
    if (!overlay) return;
    overlay.classList.toggle('open', this._open);
    const input = this._q('.w-command-input');
    input?.setAttribute('aria-expanded', String(this._open));
    if (this._open) {
      this._lastFocus = document.activeElement;
      input?.focus();
    } else if (this._lastFocus && typeof this._lastFocus.focus === 'function') {
      this._lastFocus.focus();
    }
  }

  show() { this._silentSet('model-value', true); this._applyOpen(); this._emit('update:modelValue', { value: true }); }
  hide() {
    if (this._bool('persistent')) return;
    this._silentSet('model-value', false);
    this._silentSet('open', false);
    this._applyOpen();
    this._emit('update:modelValue', { value: false });
  }
  toggle() { this._open ? this.hide() : this.show(); }
}

if (!customElements.get('w-command-palette')) customElements.define('w-command-palette', WCommandPalette);
