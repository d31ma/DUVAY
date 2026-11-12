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
 *   textNames(name, category) - the attributes to look up for a count text,
 *                            in order: "<name>-text-<category>",
 *                            "<name>-text-other", "<name>-text"
 *   queueParts(sent, pending) - { current, total } while sending a queue
 *                            ("3 of 4"); null when nothing waits
 *   hourCycle(value)       - "h11", "h12", "h23" or "h24"; "" (the locale's
 *                            habit) for anything else
 *
 * Text (formatted by the platform for a locale):
 *   locale(element)        - the closest [lang], else the page's lang, else "en"
 *   time(iso, locale, now?, hourCycle?) - "08:12", "Mon 08:12",
 *                            "3 Nov at 08:12", "3 Nov 2025 at 08:12"; the
 *                            locale decides the order, the words and 12 or 24
 *                            hours unless hourCycle is given; "" when the time
 *                            is empty or invalid
 *   number(count, locale)  - "1,234"
 *   countText(element, name, count, fallback) - the template for a count: the
 *                            first of textNames() set on the element, chosen
 *                            with Intl.PluralRules, else fallback
 *   pluralAttributes(names) - every "<name>-text-<category>" to observe
 *   bytes(count, locale)   - "0 kB", "1.5 kB", "312 MB", "1.2 GB"
 */

export class WOfflineText {
  static fallbackLocale = 'en';
  static weekDays = 6;
  static dayMs = 86400000;
  static byteBase = 1000;
  static byteUnits = ['kilobyte', 'megabyte', 'gigabyte', 'terabyte'];
  static oneDecimalBelow = 10;
  static pluralCategories = ['zero', 'one', 'two', 'few', 'many', 'other'];
  static otherCategory = 'other';
  static hourCycles = ['h11', 'h12', 'h23', 'h24'];

  /** @param {Element | null} element @returns {string} */
  static locale(element) {
    const owner = element?.closest?.('[lang]');
    return WOfflineText.firstLocale([owner?.getAttribute('lang'), document.documentElement.lang]);
  }

  /** @param {string} iso @param {string} locale @param {Date} [now] @param {string} [hourCycle] @returns {string} */
  static time(iso, locale, now = new Date(), hourCycle = '') {
    const date = new Date(iso || '');
    const parts = WOfflineText.partsFor(WOfflineText.timeStyle(date, now), WOfflineText.hourCycle(hourCycle));
    return WOfflineText.formatTime(date, locale, parts);
  }

  /** @param {number} count @param {string} locale @returns {string} */
  static number(count, locale) {
    return new Intl.NumberFormat(WOfflineText.safeLocale(locale)).format(count);
  }

  /** @param {Element} element @param {string} name @param {number} count @param {string} fallback @returns {string} */
  static countText(element, name, count, fallback) {
    const category = WOfflineText.pluralCategory(count, WOfflineText.locale(element));
    const found = WOfflineText.textNames(name, category).find((attribute) => element.hasAttribute(attribute));
    return found ? element.getAttribute(found) : fallback;
  }

  /** @param {string[]} names @returns {string[]} */
  static pluralAttributes(names) {
    return names.flatMap((name) => WOfflineText.pluralCategories.map((category) => `${name}-text-${category}`));
  }

  /** @param {string} name @param {string} category @returns {string[]} */
  static textNames(name, category) {
    const names = [`${name}-text-${category}`, `${name}-text-${WOfflineText.otherCategory}`, `${name}-text`];
    return [...new Set(names)];
  }

  /** @param {number} sent @param {number} pending @returns {{current: number, total: number} | null} */
  static queueParts(sent, pending) {
    const done = WOfflineText.wholeNumber(sent);
    const waiting = WOfflineText.wholeNumber(pending);
    return waiting > 0 ? { current: done + 1, total: done + waiting } : null;
  }

  /** @param {unknown} value @returns {string} */
  static hourCycle(value) {
    return WOfflineText.hourCycles.includes(value) ? value : '';
  }

  /** @param {number} count @param {string} locale @returns {string} */
  static pluralCategory(count, locale) {
    return new Intl.PluralRules(WOfflineText.safeLocale(locale)).select(count);
  }

  /** @param {unknown} value @returns {number} */
  static wholeNumber(value) {
    return Math.floor(WOfflineText.positiveNumber(value));
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

  /** @param {string} style @param {string} [hourCycle] @returns {Intl.DateTimeFormatOptions | null} */
  static partsFor(style, hourCycle = '') {
    const clock = { hour: '2-digit', minute: '2-digit', ...WOfflineText.cycleOption(hourCycle) };
    const date = { day: 'numeric', month: 'short', ...clock };
    const styles = { clock, weekday: { weekday: 'short', ...clock }, date, 'date-year': { ...date, year: 'numeric' } };
    return styles[style] || null;
  }

  /** @param {string} hourCycle @returns {{hourCycle?: string}} */
  static cycleOption(hourCycle) {
    return hourCycle ? { hourCycle } : {};
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
