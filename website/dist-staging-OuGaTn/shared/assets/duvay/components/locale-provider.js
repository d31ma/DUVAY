/* <w-locale-provider> — sets locale and text direction for descendants (Vuetify VLocaleProvider).
 *
 * Attributes:
 *   locale          - BCP-47 language tag, applied as `lang` on the scope.
 *   fallback-locale - fallback language tag (reflected as data-fallback-locale).
 *   rtl             - force right-to-left layout (sets dir="rtl"; otherwise ltr).
 *
 * Slot: default — content rendered within the locale scope. Descendants inherit
 * `lang` and `dir`, so RTL-aware layout (logical properties, :dir()) flips.
 */

export class WLocaleProvider extends WElement {
  static attrs = ['locale', 'fallback-locale', 'rtl'];

  get locale() { return this._attr('locale', ''); }
  get rtl() { return this._bool('rtl'); }

  _template() {
    const dir = this.rtl ? 'rtl' : 'ltr';
    const lang = this.locale ? ` lang="${this._esc(this.locale)}"` : '';
    const fallback = this.getAttribute('fallback-locale');
    const fallbackAttr = fallback ? ` data-fallback-locale="${this._esc(fallback)}"` : '';
    return `<div class="w-locale-provider" dir="${dir}"${lang}${fallbackAttr}><slot></slot></div>`;
  }
}

if (!customElements.get('w-locale-provider')) customElements.define('w-locale-provider', WLocaleProvider);
