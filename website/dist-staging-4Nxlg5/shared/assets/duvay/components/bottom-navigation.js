/* <w-bottom-navigation> — DuVay component module */

export class WBottomNavigation extends WElement {
  static attrs = ['value'];
  get value() { return this._attr('value', ''); }
  _template() { return `<nav class="w-bottom-navigation" aria-label="Bottom navigation"><slot></slot></nav>`; }
}

if (!customElements.get('w-bottom-navigation')) customElements.define('w-bottom-navigation', WBottomNavigation);
