/* <w-hotkey> — display a keyboard shortcut, mirroring Vuetify's <v-hotkey>.
 *
 * Renders a key combination as styled <kbd> chips with platform-aware labels
 * (⌘ on macOS, "Ctrl" on Windows/Linux) and support for key sequences.
 *
 * Attributes:
 *   keys          - the combination. Join simultaneous keys with "+", and
 *                   separate sequential steps with "-".
 *                   e.g. "cmd+k", "ctrl+shift+p", "ctrl+k-ctrl+s" (… then …)
 *   platform      - "mac" | "pc"; auto-detected from the browser when omitted
 *   display-mode  - "icon" (default, platform-aware) | "symbol" (always glyphs)
 *                   | "text" (always words, e.g. "Control")
 *   variant       - "contained" (default, boxed) | "plain" (no chip box)
 *   disabled      - dim and mark the shortcut unavailable
 *   prefix        - text shown before the keys (e.g. "Press")
 *   suffix        - text shown after the keys (e.g. "to search")
 *   inline        - compact styling for use inside running text: baseline
 *                   alignment, one-line height, and inherited typography
 *   key-map       - JSON object overriding or extending the built-in key table,
 *                   in Vuetify's shape:
 *                     {"save": {"default": {"text": "Save", "symbol": "S"},
 *                               "mac": {"text": "Save", "symbol": "⌘S"}}}
 *
 * No events — this is a presentational component.
 */

// token → { mac glyph, pc label, glyph (platform-agnostic symbol), full word }
const KEYS = {
  cmd:     { mac: '⌘', pc: 'Ctrl',  symbol: '⌘', text: 'Command' },
  meta:    { mac: '⌘', pc: 'Ctrl',  symbol: '⌘', text: 'Command' },
  command: { mac: '⌘', pc: 'Ctrl',  symbol: '⌘', text: 'Command' },
  super:   { mac: '⌘', pc: 'Win',   symbol: '⌘', text: 'Super' },
  win:     { mac: '⌘', pc: 'Win',   symbol: '⊞', text: 'Windows' },
  ctrl:    { mac: '⌃', pc: 'Ctrl',  symbol: '⌃', text: 'Control' },
  control: { mac: '⌃', pc: 'Ctrl',  symbol: '⌃', text: 'Control' },
  alt:     { mac: '⌥', pc: 'Alt',   symbol: '⌥', text: 'Alt' },
  option:  { mac: '⌥', pc: 'Alt',   symbol: '⌥', text: 'Option' },
  opt:     { mac: '⌥', pc: 'Alt',   symbol: '⌥', text: 'Option' },
  shift:   { mac: '⇧', pc: 'Shift', symbol: '⇧', text: 'Shift' },
  enter:   { mac: '↵', pc: 'Enter', symbol: '↵', text: 'Enter' },
  return:  { mac: '↵', pc: 'Enter', symbol: '↵', text: 'Enter' },
  backspace: { mac: '⌫', pc: 'Backspace', symbol: '⌫', text: 'Backspace' },
  delete:  { mac: '⌦', pc: 'Delete', symbol: '⌦', text: 'Delete' },
  del:     { mac: '⌦', pc: 'Delete', symbol: '⌦', text: 'Delete' },
  escape:  { mac: '⎋', pc: 'Esc', symbol: '⎋', text: 'Escape' },
  esc:     { mac: '⎋', pc: 'Esc', symbol: '⎋', text: 'Escape' },
  tab:     { mac: '⇥', pc: 'Tab',   symbol: '⇥', text: 'Tab' },
  space:   { mac: 'Space', pc: 'Space', symbol: '␣', text: 'Space' },
  up:      { mac: '↑', pc: '↑', symbol: '↑', text: 'Up' },
  down:    { mac: '↓', pc: '↓', symbol: '↓', text: 'Down' },
  left:    { mac: '←', pc: '←', symbol: '←', text: 'Left' },
  right:   { mac: '→', pc: '→', symbol: '→', text: 'Right' },
  arrowup:    { mac: '↑', pc: '↑', symbol: '↑', text: 'Up' },
  arrowdown:  { mac: '↓', pc: '↓', symbol: '↓', text: 'Down' },
  arrowleft:  { mac: '←', pc: '←', symbol: '←', text: 'Left' },
  arrowright: { mac: '→', pc: '→', symbol: '→', text: 'Right' },
};

function wHotkeyObject(value) {
  return value && typeof value === 'object' ? value : {};
}

function wHotkeyFirst(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null) return value;
  }
  return '';
}

/* Vuetify's key-map entries are { mac?: {symbol,text}, default: {symbol,text} }.
   Flattened here into the internal { mac, pc, symbol, text } shape, with each
   field falling back to whatever the entry does provide. */
export function wHotkeyDef(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const base = wHotkeyObject(entry.default);
  const mac = Object.keys(wHotkeyObject(entry.mac)).length ? entry.mac : base;
  const text = String(wHotkeyFirst(base.text, mac.text, base.symbol, mac.symbol));
  if (!text) return null;
  return {
    mac: String(wHotkeyFirst(mac.symbol, mac.text, text)),
    pc: String(wHotkeyFirst(base.text, base.symbol, text)),
    symbol: String(wHotkeyFirst(base.symbol, mac.symbol, text)),
    text,
  };
}

export class WHotkey extends WElement {
  static attrs = ['keys', 'platform', 'display-mode', 'variant', 'disabled',
    'prefix', 'suffix', 'inline', 'key-map'];

  get keys() { return this._attr('keys', ''); }
  get displayMode() { return this._attr('display-mode', 'icon'); }
  get variant() { return this._attr('variant', 'contained'); }
  get disabled() { return this._bool('disabled'); }
  get prefix() { return this._attr('prefix', ''); }
  get suffix() { return this._attr('suffix', ''); }
  get inline() { return this._bool('inline'); }

  // `key-map` extends (and can override) the built-in table.
  get keyMap() {
    const raw = this.getAttribute('key-map');
    if (!raw) return {};
    let parsed;
    try { parsed = JSON.parse(raw); } catch (_) { return {}; }
    if (!parsed || typeof parsed !== 'object') return {};
    return Object.keys(parsed).reduce((map, key) => {
      const def = wHotkeyDef(parsed[key]);
      if (def) map[String(key).toLowerCase()] = def;
      return map;
    }, {});
  }

  _def(token) {
    const key = token.toLowerCase();
    return this.keyMap[key] || KEYS[key];
  }

  get platform() {
    const p = this._attr('platform', '');
    if (p) return p;
    const ua = (typeof navigator !== 'undefined'
      && ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '')).toLowerCase();
    return ua.includes('mac') ? 'mac' : 'pc';
  }

  // Steps (sequences) of combos (simultaneous keys).
  get _sequence() {
    return this.keys.split('-').map((step) => step.trim()).filter(Boolean)
      .map((step) => step.split('+').map((k) => k.trim()).filter(Boolean));
  }

  _label(token) {
    const def = this._def(token);
    if (def) {
      if (this.displayMode === 'symbol') return def.symbol;
      if (this.displayMode === 'text') return def.text;
      return this.platform === 'mac' ? def.mac : def.pc; // icon (platform-aware)
    }
    return token.length === 1 ? token.toUpperCase() : token.charAt(0).toUpperCase() + token.slice(1);
  }

  // Screen readers get the spelled-out key names, wrapped in the same prefix /
  // suffix wording sighted users read around the chips.
  _ariaLabel() {
    const combo = this._sequence
      .map((step) => step.map((k) => (this._def(k) || {}).text || this._label(k)).join(' + '))
      .join(', then ');
    return [this.prefix, combo, this.suffix].filter(Boolean).join(' ');
  }

  // `inline` has no chrome of its own: it borrows the surrounding typography and
  // caps each chip at one line box so wrapped text does not jump.
  _inlineStyle(part) {
    if (!this.inline) return '';
    if (part === 'root') return ' style="vertical-align:baseline;font-size:inherit;line-height:1"';
    return ' style="height:1lh;min-height:0;padding-block:0;font-size:inherit"';
  }

  _affix(side, text) {
    if (!text) return '';
    return `<span class="w-hotkey-${side}">${this._esc(text)}</span>`;
  }

  _template() {
    const cls = [
      'w-hotkey',
      'w-hotkey--' + this._esc(this.variant),
      this.disabled ? 'w-hotkey--disabled' : '',
      this.inline ? 'w-hotkey--inline' : '',
    ].filter(Boolean).join(' ');

    const keyStyle = this._inlineStyle('key');
    const steps = this._sequence.map((combo) =>
      combo.map((key) => `<kbd class="w-kbd w-hotkey-key"${keyStyle}>${this._esc(this._label(key))}</kbd>`).join('')
    );

    const inner = this._affix('prefix', this.prefix)
      + steps.join('<span class="w-hotkey-then">then</span>')
      + this._affix('suffix', this.suffix);
    const disabled = this.disabled ? ' aria-disabled="true"' : '';
    return `<span class="${cls}" role="img" aria-label="${this._esc(this._ariaLabel())}"${disabled}`
      + `${this._inlineStyle('root')}>${inner}</span>`;
  }
}

if (!customElements.get('w-hotkey')) customElements.define('w-hotkey', WHotkey);
