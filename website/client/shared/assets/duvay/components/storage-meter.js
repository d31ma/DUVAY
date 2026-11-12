/* <w-storage-meter> — the space the app's copy uses on this device.
 * See docs/offline-states.md, section 5. Show one meter per domain row.
 *
 * Attributes:
 *   value      - bytes used (default 0)
 *   max        - the budget in bytes (default 0); 0 shows the value without
 *                a bar fill
 *   label      - visible label and accessible name
 *                (default "Space used on this device")
 *   warn-at    - share from 0 to 1 that shows the warn text and the warning
 *                colour (default 0.8)
 *   full-at    - share from 0 to 1 that shows the full text and the error
 *                colour (default 0.95)
 *   value-text - text with {used} and {max} (default "{used} of {max} used")
 *   warn-text  - default "Almost full"
 *   full-text  - default "Full"
 *
 * The rendered element has role="meter" with aria-valuemin, aria-valuemax,
 * aria-valuenow and aria-valuetext ("312 MB of 1 GB used, almost full"):
 * the state words follow the comma in lower case, unless their first word
 * is all capitals (such as "SSD").
 * It is not a live region and takes no focus. A value above max fills the
 * bar and counts as full. Byte sizes follow the closest [lang].
 */

import { WOfflineText } from './offline-text.js';

export class WStorageMeter extends WElement {
  static attrs = ['value', 'max', 'label', 'warn-at', 'full-at', 'value-text', 'warn-text', 'full-text'];
  static defaultLabel = 'Space used on this device';
  static defaultValueText = '{used} of {max} used';
  static defaultWarnText = 'Almost full';
  static defaultFullText = 'Full';
  static defaultWarnAt = 0.8;
  static defaultFullAt = 0.95;
  static fullPercent = 100;
  static spokenJoin = ', ';
  static labelPrefix = 'w-storage-meter-label-';
  static nextId = 0;
  static svgStart = '<svg class="w-storage-meter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">';
  static icons = {
    warn: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    full: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  };

  get value() { return WOfflineText.positiveNumber(this._attr('value', '0')); }
  set value(value) { this.setAttribute('value', String(value)); }
  get max() { return WOfflineText.positiveNumber(this._attr('max', '0')); }
  set max(value) { this.setAttribute('max', String(value)); }

  _template() {
    const level = this._level();
    const valueText = this._valueText();
    const stateText = this._stateText(level);
    return `<div class="w-storage-meter${this._levelClass(level)}" role="meter"${this._meterAttrs(valueText, stateText)}>
      ${this._headMarkup(level, stateText)}${this._barMarkup()}<div class="w-storage-meter-value">${this._esc(valueText)}</div>
    </div>`;
  }

  _meterAttrs(valueText, stateText) {
    return this._attrs({
      'aria-labelledby': this._labelId(),
      'aria-valuemin': '0',
      'aria-valuemax': String(this.max),
      'aria-valuenow': String(Math.min(this.value, this.max)),
      'aria-valuetext': this._spokenText(valueText, stateText),
    });
  }

  _headMarkup(level, stateText) {
    const label = this._esc(this._attr('label', WStorageMeter.defaultLabel));
    return `<div class="w-storage-meter-head"><span class="w-storage-meter-label" id="${this._labelId()}">${label}</span>${this._stateMarkup(level, stateText)}</div>`;
  }

  _stateMarkup(level, stateText) {
    if (!stateText) return '';
    const icon = WStorageMeter.svgStart + WStorageMeter.icons[level] + '</svg>';
    return `<span class="w-storage-meter-state">${icon}${this._esc(stateText)}</span>`;
  }

  _barMarkup() {
    return `<div class="w-progress w-progress--rounded w-storage-meter-track"><div class="w-progress-bar w-storage-meter-bar" style="inline-size: ${this._fillPercent()}%"></div></div>`;
  }

  _labelId() {
    this._storageLabelId ??= WStorageMeter.labelPrefix + (WStorageMeter.nextId += 1);
    return this._storageLabelId;
  }

  _share() {
    return this.max > 0 ? this.value / this.max : 0;
  }

  _fillPercent() {
    return Math.min(this._share(), 1) * WStorageMeter.fullPercent;
  }

  _level() {
    const share = this._share();
    if (share >= this._threshold('full-at', WStorageMeter.defaultFullAt)) return 'full';
    if (share >= this._threshold('warn-at', WStorageMeter.defaultWarnAt)) return 'warn';
    return '';
  }

  _threshold(name, fallback) {
    const raw = this.getAttribute(name);
    return this._isShare(raw) ? Number(raw) : fallback;
  }

  _isShare(raw) {
    const share = Number(raw);
    return raw !== null && raw.trim() !== '' && share >= 0 && share <= 1;
  }

  _levelClass(level) {
    return level ? ` w-storage-meter--${level}` : '';
  }

  _stateText(level) {
    const texts = {
      warn: this._attr('warn-text', WStorageMeter.defaultWarnText),
      full: this._attr('full-text', WStorageMeter.defaultFullText),
    };
    return texts[level] || '';
  }

  _valueText() {
    const locale = WOfflineText.locale(this);
    const used = WOfflineText.bytes(this.value, locale);
    return this.max > 0 ? this._filledValueText(used, WOfflineText.bytes(this.max, locale)) : used;
  }

  _filledValueText(used, max) {
    return WOfflineText.fill(this._attr('value-text', WStorageMeter.defaultValueText), { used, max });
  }

  _spokenText(valueText, stateText) {
    return stateText ? valueText + WStorageMeter.spokenJoin + this._spokenState(stateText) : valueText;
  }

  _spokenState(stateText) {
    if (WStorageMeter.startsWithCapitals(stateText)) return stateText;
    return stateText.charAt(0).toLocaleLowerCase(WOfflineText.locale(this)) + stateText.slice(1);
  }

  static startsWithCapitals(text) {
    const word = text.split(/\s/, 1)[0];
    return word.length > 1 && word === word.toLocaleUpperCase();
  }
}

if (!customElements.get('w-storage-meter')) {
  customElements.define('w-storage-meter', WStorageMeter);
}

export default WStorageMeter;
