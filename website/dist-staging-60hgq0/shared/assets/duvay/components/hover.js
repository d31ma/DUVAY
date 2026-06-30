/* <w-hover> — DuVay component module */
import { wBoolAttr, wNumberAttr } from './utils.js';

export class WHover extends WElement {
  static attrs = ['model-value', 'disabled', 'open-delay', 'close-delay'];

  get active() { return wBoolAttr(this, 'model-value'); }
  get disabled() { return wBoolAttr(this, 'disabled'); }
  get openDelay() { return wNumberAttr(this, 'open-delay', 0); }
  get closeDelay() { return wNumberAttr(this, 'close-delay', 0); }

  _template() {
    return `<div class="w-hover${this.active ? ' is-hovering' : ''}" data-hover-root data-hovering="${this.active}">
      <slot></slot>
    </div>`;
  }

  _events() {
    const root = this._q('[data-hover-root]');
    if (!root) return;
    root.addEventListener('mouseenter', () => this._setHover(true));
    root.addEventListener('mouseleave', () => this._setHover(false));
    root.addEventListener('focusin', () => this._setHover(true));
    root.addEventListener('focusout', () => this._setHover(false));
  }

  _setHover(value) {
    clearTimeout(this.__hoverTimer);
    const delay = value ? this.openDelay : this.closeDelay;
    this.__hoverTimer = setTimeout(() => {
      const root = this._q('[data-hover-root]');
      root?.classList.toggle('is-hovering', value);
      root?.setAttribute('data-hovering', String(value));
      if (!this.disabled) {
        this._silentSet('model-value', value ? 'true' : null);
        this._emit('w-change', { value });
      }
    }, delay);
  }
}

if (!customElements.get('w-hover')) customElements.define('w-hover', WHover);
