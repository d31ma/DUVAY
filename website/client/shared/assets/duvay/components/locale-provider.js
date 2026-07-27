/* <w-locale-provider> — sets locale and text direction for descendants (Vuetify VLocaleProvider).
 *
 * Attributes:
 *   locale          - BCP-47 language tag, applied as `lang` on the scope.
 *   fallback-locale - fallback language tag (reflected as data-fallback-locale).
 *   rtl             - force right-to-left layout (sets dir="rtl"; otherwise ltr).
 *   messages        - JSON translation dictionary. It may be a direct nested
 *                     dictionary or keyed first by locale.
 *
 * Slot: default — content rendered within the locale scope. Descendants inherit
 * `lang` and `dir`, so RTL-aware layout (logical properties, :dir()) flips.
 */

export class WLocaleProvider extends WElement {
  static attrs = ['locale', 'fallback-locale', 'rtl', 'messages'];

  get locale() { return this._attr('locale', ''); }
  get fallbackLocale() { return this._attr('fallback-locale', ''); }
  get rtl() { return this._bool('rtl'); }
  get messages() {
    try {
      const value = JSON.parse(this._attr('messages', '{}'));
      return value && typeof value === 'object' ? value : {};
    } catch (_) {
      return {};
    }
  }

  // Descendants can resolve provider-owned messages without a framework
  // runtime: `element.closest('w-locale-provider').translate('actions.save')`.
  translate(path, replacements = {}) {
    const messages = this.messages;
    const localeMessages = this._dictionaryFor(messages, this.locale)
      || this._dictionaryFor(messages, this.fallbackLocale)
      || messages;
    const value = String(path).split('.').reduce((current, part) => (
      current && typeof current === 'object' ? current[part] : undefined
    ), localeMessages);
    if (value == null || typeof value === 'object') return String(path);
    return String(value).replace(/\{(\w+)\}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(replacements, key) ? String(replacements[key]) : match
    ));
  }

  _dictionaryFor(messages, locale) {
    if (!locale || !messages || typeof messages !== 'object') return null;
    const dictionary = messages[locale];
    return dictionary && typeof dictionary === 'object' ? dictionary : null;
  }

  _template() {
    const dir = this.rtl ? 'rtl' : 'ltr';
    const lang = this.locale ? ` lang="${this._esc(this.locale)}"` : '';
    const fallback = this.fallbackLocale;
    const fallbackAttr = fallback ? ` data-fallback-locale="${this._esc(fallback)}"` : '';
    return `<div class="w-locale-provider" dir="${dir}"${lang}${fallbackAttr}><slot></slot></div>`;
  }
}

if (!customElements.get('w-locale-provider')) customElements.define('w-locale-provider', WLocaleProvider);
