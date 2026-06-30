/* <w-color-picker> — DuVay component module
 *
 * Vuetify-style HSV picker with saturation/value canvas, hue and alpha sliders,
 * hex editing, preview, and optional swatches.
 */
import { wClamp, wValueList } from './utils.js';

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function clamp01(value) {
  return wClamp(Number(value), 0, 1);
}

function normalizeHex(value, fallback = '#6750a4') {
  const text = String(value || '').trim();
  const match = text.match(HEX_RE);
  if (!match) return fallback;
  let hex = match[1].toLowerCase();
  if (hex.length === 3) hex = hex.split('').map((char) => char + char).join('');
  return `#${hex}`;
}

function hexToRgba(value) {
  const hex = normalizeHex(value).slice(1);
  const rgb = hex.slice(0, 6);
  const alpha = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
  return {
    r: parseInt(rgb.slice(0, 2), 16),
    g: parseInt(rgb.slice(2, 4), 16),
    b: parseInt(rgb.slice(4, 6), 16),
    a: alpha,
  };
}

function toHexPart(value) {
  return Math.round(wClamp(value, 0, 255)).toString(16).padStart(2, '0');
}

function rgbaToHex({ r, g, b, a = 1 }, includeAlpha = false) {
  const hex = `#${toHexPart(r)}${toHexPart(g)}${toHexPart(b)}`;
  return includeAlpha && a < 1 ? `${hex}${toHexPart(a * 255)}` : hex;
}

function rgbToHsv({ r, g, b }) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;
  let h = 0;
  if (delta) {
    if (max === rr) h = 60 * (((gg - bb) / delta) % 6);
    else if (max === gg) h = 60 * ((bb - rr) / delta + 2);
    else h = 60 * ((rr - gg) / delta + 4);
  }
  if (h < 0) h += 360;
  return { h, s: max === 0 ? 0 : delta / max, v: max };
}

function hsvToRgb({ h, s, v }) {
  const hue = ((Number(h) % 360) + 360) % 360;
  const chroma = v * s;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = v - chroma;
  let rr = 0;
  let gg = 0;
  let bb = 0;
  if (hue < 60) [rr, gg, bb] = [chroma, x, 0];
  else if (hue < 120) [rr, gg, bb] = [x, chroma, 0];
  else if (hue < 180) [rr, gg, bb] = [0, chroma, x];
  else if (hue < 240) [rr, gg, bb] = [0, x, chroma];
  else if (hue < 300) [rr, gg, bb] = [x, 0, chroma];
  else [rr, gg, bb] = [chroma, 0, x];
  return {
    r: (rr + m) * 255,
    g: (gg + m) * 255,
    b: (bb + m) * 255,
  };
}

export class WColorPicker extends WElement {
  static attrs = ['value', 'swatches', 'show-swatches', 'hide-canvas', 'show-alpha', 'alpha', 'disabled'];

  get value() { return normalizeHex(this._attr('value', '#6750a4')); }
  get hideCanvas() { return this._bool('hide-canvas'); }
  get showAlpha() { return this._bool('show-alpha'); }
  get disabled() { return this._bool('disabled'); }
  get alpha() {
    if (this.hasAttribute('alpha')) {
      const fromAttr = Number(this.getAttribute('alpha'));
      if (Number.isFinite(fromAttr)) return clamp01(fromAttr);
    }
    return hexToRgba(this.value).a;
  }

  _swatches() { return wValueList(this.getAttribute('swatches')).map((color) => normalizeHex(color, '')).filter(Boolean); }
  get _showSwatches() { return this.hasAttribute('show-swatches') || this._swatches().length > 0; }

  _state() {
    const rgba = hexToRgba(this.value);
    const hsv = rgbToHsv(rgba);
    const alpha = this.alpha;
    const rgb = hsvToRgb(hsv);
    return {
      ...hsv,
      a: alpha,
      rgb,
      hex: rgbaToHex({ ...rgb, a: alpha }, this.showAlpha),
      solidHex: rgbaToHex({ ...rgb, a: 1 }),
      alphaCss: `rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${alpha.toFixed(3)})`,
    };
  }

  _template() {
    const state = this._state();
    const dis = this.disabled ? ' disabled' : '';
    const style = [
      `--w-color-picker-hue:${Math.round(state.h)}`,
      `--w-color-picker-hue-color:hsl(${Math.round(state.h)} 100% 50%)`,
      `--w-color-picker-current:${state.solidHex}`,
      `--w-color-picker-preview:${state.alphaCss}`,
    ].join(';');
    const swatches = this._showSwatches && this._swatches().length
      ? `<div class="w-color-picker-swatches" role="group" aria-label="Color swatches">${this._swatches().map((color) => `<button type="button" class="w-color-swatch${color.toLowerCase() === state.solidHex.toLowerCase() ? ' selected' : ''}" style="--w-color:${this._esc(color)}" data-color="${this._esc(color)}" aria-label="${this._esc(color)}"${dis}></button>`).join('')}</div>`
      : '';

    const canvas = this.hideCanvas ? '' : `<div class="w-color-picker-canvas" role="slider" tabindex="${this.disabled ? '-1' : '0'}" aria-label="Saturation and brightness" aria-valuetext="${Math.round(state.s * 100)}% saturation, ${Math.round(state.v * 100)}% brightness" data-color-canvas>
        <span class="w-color-picker-canvas-thumb" style="left:${state.s * 100}%;top:${(1 - state.v) * 100}%"></span>
      </div>
      <div class="w-color-picker-slider w-color-picker-hue" role="slider" tabindex="${this.disabled ? '-1' : '0'}" aria-label="Hue" aria-valuemin="0" aria-valuemax="360" aria-valuenow="${Math.round(state.h)}" data-color-hue>
        <span class="w-color-picker-slider-thumb" style="left:${(state.h / 360) * 100}%"></span>
      </div>
      ${this.showAlpha ? `<div class="w-color-picker-slider w-color-picker-alpha" role="slider" tabindex="${this.disabled ? '-1' : '0'}" aria-label="Alpha" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(state.a * 100)}" data-color-alpha>
        <span class="w-color-picker-slider-thumb" style="left:${state.a * 100}%"></span>
      </div>` : ''}`;

    return `<div class="w-color-picker${this.hideCanvas ? ' w-color-picker--swatches-only' : ''}" style="${this._esc(style)}">
      <div class="w-color-picker-preview-row">
        <span class="w-color-preview" style="background:${this._esc(state.alphaCss)}"></span>
        <label class="w-color-picker-edit">
          <span class="w-sr-only">Hex color</span>
          <input class="w-color-picker-input" type="text" spellcheck="false" value="${this._esc(state.hex)}"${dis}>
        </label>
      </div>
      ${this.hideCanvas ? `<code class="w-color-picker-value">${this._esc(state.hex)}</code>` : ''}
      ${canvas}
      ${swatches}
    </div>`;
  }

  _events() {
    const state = () => this._state();
    const commit = (next, emit = true) => {
      const alpha = next.a ?? state().a;
      const rgb = hsvToRgb(next);
      const value = rgbaToHex({ ...rgb, a: alpha }, this.showAlpha);
      this._silentSet('value', value);
      if (this.showAlpha) this._silentSet('alpha', alpha.toFixed(3).replace(/0+$/, '').replace(/\.$/, ''));
      this._render();
      this._events();
      if (emit) this._emit('change', this.showAlpha ? { value, alpha } : { value });
    };

    const trackPointer = (target, handler) => {
      target.addEventListener('pointerdown', (event) => {
        if (this.disabled) return;
        event.preventDefault();
        target.setPointerCapture?.(event.pointerId);
        const move = (nextEvent) => handler(nextEvent);
        const up = () => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
        };
        handler(event);
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up, { once: true });
      });
    };

    const canvas = this._q('[data-color-canvas]');
    if (canvas) {
      const setCanvas = (event) => {
        const rect = canvas.getBoundingClientRect();
        const s = wClamp((event.clientX - rect.left) / rect.width, 0, 1);
        const v = 1 - wClamp((event.clientY - rect.top) / rect.height, 0, 1);
        commit({ ...state(), s, v });
      };
      trackPointer(canvas, setCanvas);
      canvas.addEventListener('keydown', (event) => this._onCanvasKey(event, commit));
    }

    const hue = this._q('[data-color-hue]');
    if (hue) {
      trackPointer(hue, (event) => {
        const rect = hue.getBoundingClientRect();
        commit({ ...state(), h: wClamp((event.clientX - rect.left) / rect.width, 0, 1) * 360 });
      });
      hue.addEventListener('keydown', (event) => this._onLinearKey(event, 'h', 360, commit));
    }

    const alpha = this._q('[data-color-alpha]');
    if (alpha) {
      trackPointer(alpha, (event) => {
        const rect = alpha.getBoundingClientRect();
        commit({ ...state(), a: wClamp((event.clientX - rect.left) / rect.width, 0, 1) });
      });
      alpha.addEventListener('keydown', (event) => this._onLinearKey(event, 'a', 1, commit));
    }

    this._q('.w-color-picker-input')?.addEventListener('change', (event) => {
      event.stopPropagation();
      if (this.disabled) return;
      const value = normalizeHex(event.target.value, this.value);
      const rgba = hexToRgba(value);
      commit({ ...rgbToHsv(rgba), a: rgba.a });
    });

    this._qAll('.w-color-swatch').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.disabled) return;
        const rgba = hexToRgba(btn.getAttribute('data-color'));
        commit({ ...rgbToHsv(rgba), a: this.alpha });
      });
    });
  }

  _onCanvasKey(event, commit) {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const state = this._state();
    const step = event.shiftKey ? 0.1 : 0.02;
    if (event.key === 'ArrowLeft') state.s = wClamp(state.s - step, 0, 1);
    if (event.key === 'ArrowRight') state.s = wClamp(state.s + step, 0, 1);
    if (event.key === 'ArrowUp') state.v = wClamp(state.v + step, 0, 1);
    if (event.key === 'ArrowDown') state.v = wClamp(state.v - step, 0, 1);
    commit(state);
  }

  _onLinearKey(event, key, scale, commit) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const state = this._state();
    const step = event.shiftKey ? 0.1 : 0.02;
    if (event.key === 'Home') state[key] = 0;
    if (event.key === 'End') state[key] = scale;
    if (event.key === 'ArrowLeft') state[key] = wClamp(state[key] - step * scale, 0, scale);
    if (event.key === 'ArrowRight') state[key] = wClamp(state[key] + step * scale, 0, scale);
    commit(state);
  }
}

if (!customElements.get('w-color-picker')) customElements.define('w-color-picker', WColorPicker);
