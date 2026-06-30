/* <w-bottom-sheet> — DuVay component module */

export class WBottomSheet extends WElement {
  static attrs = ['open'];
  get open() { return this._bool('open'); }
  _template() {
    return `<div class="w-bottom-sheet${this.open ? ' open' : ''}" role="dialog" aria-modal="true">
      <slot></slot>
    </div>`;
  }
}

if (!customElements.get('w-bottom-sheet')) customElements.define('w-bottom-sheet', WBottomSheet);
