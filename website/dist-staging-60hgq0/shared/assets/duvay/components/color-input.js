/* <w-color-input> — DuVay component module
 *
 * Attributes:
 *   value          - the colour (hex; the canonical/native value)
 *   label          - field label
 *   swatches       - comma or JSON list of preset hex colours
 *   show-swatches  - boolean; show the swatch row (implied when swatches given)
 *   mode           - hex (default) | rgb | hsl (text field display + w-change)
 *   disabled       - boolean
 *
 * Events:
 *   w-change - fires when the colour changes (detail: { value } in the mode format)
 */
import { wValueList } from './utils.js';

export class WColorInput extends WElement {
  static attrs = ['value', 'label', 'swatches', 'show-swatches', 'mode', 'disabled'];

  get value() { return this._attr('value', '#6750a4'); }
  get label() { return this._attr('label', 'Color'); }
  get mode() { return this._attr('mode', 'hex'); }
  get disabled() { return this._bool('disabled'); }
  _swatches() { return wValueList(this.getAttribute('swatches')); }
  get _showSwatches() { return this.hasAttribute('show-swatches') || this._swatches().length > 0; }

  _template() {
    const hex = this.value;
    const dis = this.disabled ? ' disabled' : '';
    const swatches = this._showSwatches && this._swatches().length
      ? `<span class="w-color-input-swatches" role="group" aria-label="Color swatches">${this._swatchButtons(hex, dis)}</span>`
      : '';
    return `<label class="w-field w-color-input">
      <span class="w-label">${this._esc(this.label)}</span>
      <span><input type="color" value="${this._esc(hex)}"${dis}><input class="w-input" value="${this._esc(this._format(hex))}"${dis}></span>
      ${swatches}
    </label>`;
  }

  _swatchButtons(hex, dis) {
    return this._swatches().map((c) => `<button type="button" class="w-color-swatch${c.toLowerCase() === hex.toLowerCase() ? ' selected' : ''}" style="--w-color:${this._esc(c)}" data-color="${this._esc(c)}" aria-label="${this._esc(c)}"${dis}></button>`).join('');
  }

  _events() {
    const color = this.querySelector('input[type="color"]');
    const text = this.querySelector('.w-input');
    const sync = (hex) => {
      if (!hex) return;
      if (color) color.value = hex;
      if (text) text.value = this._format(hex);
      this._silentSet('value', hex);
      this.querySelectorAll('.w-color-swatch').forEach((b) => b.classList.toggle('selected', b.getAttribute('data-color').toLowerCase() === hex.toLowerCase()));
      this._emit('w-change', { value: this._format(hex) });
    };
    color?.addEventListener('input', () => sync(color.value));
    text?.addEventListener('change', () => sync(this._toHex(text.value)));
    this.querySelectorAll('.w-color-swatch').forEach((btn) => {
      btn.addEventListener('click', () => { if (!this.disabled) sync(btn.getAttribute('data-color')); });
    });
  }

  /* hex → mode-formatted string (rgb/hsl); the native input always stays hex */
  _format(hex) {
    const mode = this.mode;
    if (mode !== 'rgb' && mode !== 'hsl') return hex;
    const h = String(hex).replace('#', '');
    if (h.length < 6) return hex;
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    if (mode === 'rgb') return `rgb(${r}, ${g}, ${b})`;
    const [hh, ss, ll] = this._rgbToHsl(r, g, b);
    return `hsl(${hh}, ${ss}%, ${ll}%)`;
  }

  _rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  /* Normalise any CSS colour the user types into a hex string via the canvas. */
  _toHex(input) {
    if (!input) return '';
    try {
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillStyle = String(input).trim();
      return ctx.fillStyle.startsWith('#') ? ctx.fillStyle : this.value;
    } catch (_) {
      return this.value;
    }
  }
}

if (!customElements.get('w-color-input')) customElements.define('w-color-input', WColorInput);
