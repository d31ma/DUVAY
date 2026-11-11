/* WOfflineText — text helpers shared by the offline-state elements
 * (w-sync-status, w-send-status, w-storage-meter). See docs/offline-states.md.
 *
 * Decisions (the same on every platform; spec/fixtures/offline.json):
 *   timeStyle(date, now)   - "clock" (the same day), "weekday" (1 to 6 days
 *                            before), "date" (any other day this year),
 *                            "date-year" (another year), "none" (no date)
 *   byteParts(count)       - { value, unit, fractionDigits }: decimal units
 *                            (1 kB = 1000 bytes), kilobyte at least, one
 *                            decimal below 10, no decimals from 10
 *   fill(template, values) - replaces {name} with values.name; unknown names
 *                            stay as they are
 *
 * Text (formatted by the platform for a locale):
 *   locale(element)        - the closest [lang], else the page's lang, else "en"
 *   time(iso, locale, now?)- "08:12", "Mon 08:12", "3 Nov at 08:12",
 *                            "3 Nov 2025 at 08:12"; the locale decides the
 *                            order, the words and 12 or 24 hours; "" when the
 *                            time is empty or invalid
 *   bytes(count, locale)   - "0 kB", "1.5 kB", "312 MB", "1.2 GB"
 */

export class WOfflineText {
  static fallbackLocale = 'en';
  static weekDays = 6;
  static dayMs = 86400000;
  static byteBase = 1000;
  static byteUnits = ['kilobyte', 'megabyte', 'gigabyte', 'terabyte'];
  static oneDecimalBelow = 10;

  /** @param {Element | null} element @returns {string} */
  static locale(element) {
    const owner = element?.closest?.('[lang]');
    return WOfflineText.firstLocale([owner?.getAttribute('lang'), document.documentElement.lang]);
  }

  /** @param {string} iso @param {string} locale @param {Date} [now] @returns {string} */
  static time(iso, locale, now = new Date()) {
    const date = new Date(iso || '');
    const parts = WOfflineText.partsFor(WOfflineText.timeStyle(date, now));
    return WOfflineText.formatTime(date, locale, parts);
  }

  /** @param {number} count @param {string} locale @returns {string} */
  static bytes(count, locale) {
    const parts = WOfflineText.byteParts(count);
    return WOfflineText.formatBytes(parts, locale);
  }

  /** @param {Date} date @param {Date} now @returns {'none' | 'clock' | 'weekday' | 'date' | 'date-year'} */
  static timeStyle(date, now) {
    if (!WOfflineText.isDate(date)) return 'none';
    const days = WOfflineText.daysBetween(date, now);
    if (days === 0) return 'clock';
    if (days > 0 && days <= WOfflineText.weekDays) return 'weekday';
    return WOfflineText.dateStyle(date, now);
  }

  /** @param {number} count @returns {{value: number, unit: string, fractionDigits: number}} */
  static byteParts(count) {
    const safeCount = WOfflineText.positiveNumber(count);
    const power = WOfflineText.unitPower(safeCount);
    const value = safeCount / WOfflineText.byteBase ** (power + 1);
    return { value, unit: WOfflineText.byteUnits[power], fractionDigits: WOfflineText.fractionDigits(value) };
  }

  /** @param {string} template @param {Record<string, string | number>} values @returns {string} */
  static fill(template, values) {
    return String(template ?? '').replace(/\{(\w+)\}/g, (match, name) => WOfflineText.valueFor(values, name, match));
  }

  /** @param {Array<string | null | undefined>} candidates @returns {string} */
  static firstLocale(candidates) {
    return candidates.find((candidate) => Boolean(candidate)) || WOfflineText.fallbackLocale;
  }

  /** @param {unknown} date @returns {boolean} */
  static isDate(date) {
    return date instanceof Date && !Number.isNaN(date.getTime());
  }

  /** @param {Date} date @param {Date} now @returns {'date' | 'date-year'} */
  static dateStyle(date, now) {
    return date.getFullYear() === now.getFullYear() ? 'date' : 'date-year';
  }

  /** @param {Date} date @param {Date} now @returns {number} */
  static daysBetween(date, now) {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((end.getTime() - start.getTime()) / WOfflineText.dayMs);
  }

  /** @param {string} style @returns {Intl.DateTimeFormatOptions | null} */
  static partsFor(style) {
    const clock = { hour: '2-digit', minute: '2-digit' };
    const date = { day: 'numeric', month: 'short', ...clock };
    const styles = { clock, weekday: { weekday: 'short', ...clock }, date, 'date-year': { ...date, year: 'numeric' } };
    return styles[style] || null;
  }

  /** @param {Date} date @param {string} locale @param {Intl.DateTimeFormatOptions | null} parts @returns {string} */
  static formatTime(date, locale, parts) {
    if (!parts) return '';
    return new Intl.DateTimeFormat(WOfflineText.safeLocale(locale), parts).format(date);
  }

  /** @param {{value: number, unit: string, fractionDigits: number}} parts @param {string} locale @returns {string} */
  static formatBytes(parts, locale) {
    return new Intl.NumberFormat(WOfflineText.safeLocale(locale), {
      style: 'unit',
      unit: parts.unit,
      unitDisplay: 'short',
      maximumFractionDigits: parts.fractionDigits,
    }).format(parts.value);
  }

  /** @param {number} value @returns {number} */
  static fractionDigits(value) {
    return value < WOfflineText.oneDecimalBelow ? 1 : 0;
  }

  /** @param {number} count @returns {number} */
  static unitPower(count) {
    const lastUnit = WOfflineText.byteUnits.length - 1;
    let power = 0;
    while (power < lastUnit && count >= WOfflineText.byteBase ** (power + 2)) power += 1;
    return power;
  }

  /** @param {unknown} value @returns {number} */
  static positiveNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  }

  /** @param {string} locale @returns {string} */
  static safeLocale(locale) {
    try {
      return Intl.getCanonicalLocales(locale || WOfflineText.fallbackLocale)[0];
    } catch (_) {
      return WOfflineText.fallbackLocale;
    }
  }

  /** @param {Record<string, string | number> | undefined} values @param {string} name @param {string} placeholder @returns {string} */
  static valueFor(values, name, placeholder) {
    const value = values?.[name];
    return value === undefined || value === null ? placeholder : String(value);
  }
}

export default WOfflineText;
