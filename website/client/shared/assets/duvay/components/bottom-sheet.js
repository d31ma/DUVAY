/* <w-bottom-sheet> — sheet that slides up from the bottom edge.
 *
 * Vuetify's VBottomSheet is VDialog with a different transition, so this is
 * <w-overlay> with bottom-anchored content: every overlay attribute (scrim,
 * persistent, close-on-back, target/origin/offset, open-on-hover, the Tab
 * trap, …) works here unchanged.
 *
 * Own attributes:
 *   inset       - narrows the sheet to 70% of the viewport
 *   fullscreen  - fills the viewport instead of hugging the bottom edge
 *   scrollable  - the sheet body scrolls inside a capped height
 *
 * Slots: activator, default
 * Events: toggle, close
 */

import { WOverlay } from './overlay.js';

export class WBottomSheet extends WOverlay {
  static attrs = ['inset', 'fullscreen', 'scrollable'];

  get inset() { return this._bool('inset'); }
  get fullscreen() { return this._bool('fullscreen'); }
  get scrollable() { return this._bool('scrollable'); }

  _contentSel() { return '.w-bottom-sheet'; }

  // No implicit "Open overlay" button — a bottom sheet is opened by its own
  // activator or programmatically.
  _activatorMarkup() {
    if (!this.querySelector('[slot="activator"]')) return '';
    return `<span class="w-overlay-activator" role="button" tabindex="${this.disabled ? '-1' : '0'}" aria-haspopup="dialog" aria-expanded="${this.open ? 'true' : 'false'}" aria-controls="${this.__wUid}-content"><slot name="activator"></slot></span>`;
  }

  _overlayClass() {
    return super._overlayClass() + ' w-bottom-sheet-overlay';
  }

  _sheetClass() {
    return 'w-bottom-sheet' + this._cls({
      open: this.open,
      'w-bottom-sheet--inset': this.inset,
      'w-bottom-sheet--fullscreen': this.fullscreen,
      'w-bottom-sheet--scrollable': this.scrollable,
      [this.contentClass]: this.contentClass,
    });
  }

  _template() {
    return `${this._activatorMarkup()}
      <div class="${this._overlayClass()}"${this._overlayStyle()} ${this.open ? '' : 'hidden'} role="presentation">
        ${this.hasScrim ? '<div class="w-overlay-scrim" aria-hidden="true"></div>' : ''}
        <div id="${this.__wUid}-content" class="${this._esc(this._sheetClass())}" role="dialog" aria-modal="${this.contained ? 'false' : 'true'}" tabindex="-1"${this._contentStyle()}>
          <slot></slot>
        </div>
      </div>`;
  }
}

if (!customElements.get('w-bottom-sheet')) customElements.define('w-bottom-sheet', WBottomSheet);
