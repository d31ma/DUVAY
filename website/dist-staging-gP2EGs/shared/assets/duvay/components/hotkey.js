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

export class WHotkey extends WElement {
  static attrs = ['keys', 'platform', 'display-mode', 'variant', 'disabled'];

  get keys() { return this._attr('keys', ''); }
  get displayMode() { return this._attr('display-mode', 'icon'); }
  get variant() { return this._attr('variant', 'contained'); }
  get disabled() { return this._bool('disabled'); }

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
    const def = KEYS[token.toLowerCase()];
    if (def) {
      if (this.displayMode === 'symbol') return def.symbol;
      if (this.displayMode === 'text') return def.text;
      return this.platform === 'mac' ? def.mac : def.pc; // icon (platform-aware)
    }
    return token.length === 1 ? token.toUpperCase() : token.charAt(0).toUpperCase() + token.slice(1);
  }

  _ariaLabel() {
    return this._sequence
      .map((combo) => combo.map((k) => (KEYS[k.toLowerCase()] || {}).text || this._label(k)).join(' + '))
      .join(', then ');
  }

  _template() {
    const cls = [
      'w-hotkey',
      'w-hotkey--' + this._esc(this.variant),
      this.disabled ? 'w-hotkey--disabled' : '',
    ].filter(Boolean).join(' ');

    const steps = this._sequence.map((combo) =>
      combo.map((key) => `<kbd class="w-kbd w-hotkey-key">${this._esc(this._label(key))}</kbd>`).join('')
    );

    const inner = steps.join('<span class="w-hotkey-then">then</span>');
    const disabled = this.disabled ? ' aria-disabled="true"' : '';
    return `<span class="${cls}" role="img" aria-label="${this._esc(this._ariaLabel())}"${disabled}>${inner}</span>`;
  }
}

if (!customElements.get('w-hotkey')) customElements.define('w-hotkey', WHotkey);
