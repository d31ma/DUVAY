/* <w-toolbar-items> — Toolbar items container subcomponent
 *
 * Attributes:
 *   variant - flat | text | elevated | tonal | outlined | plain
 *             Applied to the container as a modifier class and pushed down onto
 *             slotted <w-btn> children that do not declare their own variant,
 *             matching Vuetify's "toolbar items share one button style".
 */

const TOOLBAR_ITEM_VARIANTS = ['flat', 'text', 'elevated', 'tonal', 'outlined', 'plain'];

class WToolbarItems extends WElement {
  static attrs = ['variant'];

  get variant() {
    const value = this._attr('variant', '');
    return TOOLBAR_ITEM_VARIANTS.includes(value) ? value : '';
  }

  _template() {
    const cls = 'w-toolbar-items' + this._cls({ ['w-toolbar-items--' + this.variant]: this.variant });
    return `<div class="${cls}"><slot></slot></div>`;
  }

  _events() {
    const variant = this.variant;
    if (!variant) return;
    this._qAll('w-btn').forEach((btn) => {
      if (!btn.hasAttribute('variant')) btn.setAttribute('variant', variant);
    });
  }
}

if (!customElements.get('w-toolbar-items')) {
  customElements.define('w-toolbar-items', WToolbarItems);
}
