/* <w-color-picker> — DuVay component module
 *
 * Vuetify-style HSV picker with saturation/value canvas, hue and alpha sliders,
 * value editing, preview, an EyeDropper trigger, and optional swatches.
 *
 * Attributes:
 *   value               - the colour (hex; the canonical/native value)
 *   swatches            - comma or JSON list of preset hex colours
 *   show-swatches       - show the swatch grid (implied when swatches given)
 *   show-alpha, alpha   - enable and set the alpha channel
 *   mode                - hex | hexa | rgb | rgba | hsl | hsla (edit field format)
 *   modes               - list of selectable modes; renders a mode switcher
 *   title               - header title text
 *   hide-header         - drop the header row
 *   hide-title          - drop the title inside the header
 *   divided             - render a divider between header and controls
 *   canvas-height       - height of the saturation/value canvas
 *   dot-size            - diameter of the canvas / slider thumbs
 *   hide-canvas         - hide the canvas (and its sliders)
 *   hide-sliders        - hide the hue / alpha sliders only
 *   hide-inputs         - hide the value edit field and mode switcher
 *   hide-input-labels   - hide the caption under the value edit field
 *   swatches-max-height - cap the swatch grid height and scroll it
 *   landscape           - two-column layout
 *   hide-eye-dropper    - hide the EyeDropper trigger
 *   eye-dropper-icon    - icon name for the EyeDropper trigger
 *   disabled
 *
 * Events:
 *   change      - colour changed (detail: { value } plus { alpha } when show-alpha)
 *   update:mode - the mode switcher changed (detail: { mode })
 */
import WIcons from '../icons.js';
import { wClamp, wSetValue, wValueList } from './utils.js';
const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const EYE_DROPPER_SVG = '<svg class="w-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M19.35 4.65a2.2 2.2 0 0 0-3.11 0l-2.2 2.2-1.06-1.06-1.41 1.41 1.06 1.06-6.36 6.36V18h3.38l6.36-6.36 1.06 1.06 1.41-1.41-1.06-1.06 2.2-2.2a2.2 2.2 0 0 0 0-3.11ZM8.83 16H7.29v-1.54l6.36-6.36 1.54 1.54Z"/></svg>';

function clamp01(value) {
  return wClamp(Number(value), 0, 1);
}

/* Bare numbers become pixels; anything with a unit passes straight through. */
function toLength(value) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  return /^-?\d*\.?\d+$/.test(text) ? `${text}px` : text;
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

/* Resolve any CSS colour string through the canvas. Returns null when the
   string is not a colour at all — two different sentinels must both be
   overwritten for the assignment to count as parsed. */
function cssToRgba(text) {
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#ff0000';
    ctx.fillStyle = text;
    const first = ctx.fillStyle;
    ctx.fillStyle = '#0000ff';
    ctx.fillStyle = text;
    if (first !== ctx.fillStyle) return null;
    if (String(first).startsWith('#')) return hexToRgba(first);
    const parts = String(first).match(/[\d.]+/g);
    if (!parts || parts.length < 3) return null;
    return { r: +parts[0], g: +parts[1], b: +parts[2], a: parts[3] === undefined ? 1 : +parts[3] };
  } catch (_) {
    return null;
  }
}

/* Hex first (the canonical form), then any CSS colour, then the current value. */
function parseColor(text, fallbackHex) {
  const raw = String(text || '').trim();
  if (HEX_RE.test(raw)) return hexToRgba(normalizeHex(raw, fallbackHex));
  return cssToRgba(raw) || hexToRgba(fallbackHex);
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

/* HSV → HSL, rounded to the integers the CSS notation uses. */
function hsvToHsl({ h, s, v }) {
  const l = v * (1 - s / 2);
  const edge = l === 0 || l === 1;
  const sl = edge ? 0 : (v - l) / Math.min(l, 1 - l);
  return [Math.round(h), Math.round(sl * 100), Math.round(l * 100)];
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
  static attrs = [
    'value', 'swatches', 'show-swatches', 'hide-canvas', 'show-alpha', 'alpha', 'disabled',
    'mode', 'modes', 'title', 'hide-header', 'hide-title', 'divided',
    'canvas-height', 'dot-size', 'hide-sliders', 'hide-inputs', 'hide-input-labels',
    'swatches-max-height', 'landscape', 'hide-eye-dropper', 'eye-dropper-icon',
  ];

  set value(v) { wSetValue(this, v); }
  get value() { return normalizeHex(this._attr('value', '#6750a4')); }
  get hideCanvas() { return this._bool('hide-canvas'); }
  get showAlpha() { return this._bool('show-alpha'); }
  get disabled() { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get hideSliders() { return this._bool('hide-sliders'); }
  get hideInputs() { return this._bool('hide-inputs'); }
  get hideInputLabels() { return this._bool('hide-input-labels'); }
  get hideHeader() { return this._bool('hide-header'); }
  get hideTitle() { return this._bool('hide-title'); }
  get hideEyeDropper() { return this._bool('hide-eye-dropper'); }
  get divided() { return this._bool('divided'); }
  get landscape() { return this._bool('landscape'); }
  get mode() { return this._attr('mode', this.showAlpha ? 'hexa' : 'hex'); }
  get modes() { return wValueList(this.getAttribute('modes')); }
  get alpha() {
    if (this.hasAttribute('alpha')) {
      const fromAttr = Number(this.getAttribute('alpha'));
      if (Number.isFinite(fromAttr)) return clamp01(fromAttr);
    }
    return hexToRgba(this.value).a;
  }

  _swatches() { return wValueList(this.getAttribute('swatches')).map((color) => normalizeHex(color, '')).filter(Boolean); }
  get _showSwatches() { return this.hasAttribute('show-swatches') || this._swatches().length > 0; }

  _dis() { return this.disabled ? ' disabled' : ''; }
  _tabindex() { return this.disabled ? '-1' : '0'; }

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

  /* The canonical value stays hex; `mode` only changes how it is written out. */
  _formatValue(state, mode) {
    const rgb = [Math.round(state.rgb.r), Math.round(state.rgb.g), Math.round(state.rgb.b)];
    const a = Number(state.a.toFixed(3));
    const hsl = hsvToHsl(state);
    return {
      rgb: `rgb(${rgb.join(', ')})`,
      rgba: `rgba(${rgb.join(', ')}, ${a})`,
      hsl: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`,
      hsla: `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, ${a})`,
      hexa: state.hex,
      hex: state.solidHex,
    }[mode] || state.hex;
  }

  _rootStyle(state) {
    return [
      `--w-color-picker-hue:${Math.round(state.h)}`,
      `--w-color-picker-hue-color:hsl(${Math.round(state.h)} 100% 50%)`,
      `--w-color-picker-current:${state.solidHex}`,
      `--w-color-picker-preview:${state.alphaCss}`,
      this._lengthVar('--w-color-picker-canvas-height', 'canvas-height'),
      this._lengthVar('--w-color-picker-dot-size', 'dot-size'),
      this._lengthVar('--w-color-picker-swatches-max-height', 'swatches-max-height'),
    ].filter(Boolean).join(';');
  }

  _lengthVar(prop, attr) {
    const length = toLength(this._attr(attr, ''));
    return length ? `${prop}:${length}` : '';
  }

  _template() {
    const state = this._state();
    const cls = this._cls({
      'w-color-picker--swatches-only': this.hideCanvas,
      'w-color-picker--landscape': this.landscape,
      'w-color-picker--scroll-swatches': this._attr('swatches-max-height', ''),
    });
    return `<div class="w-color-picker${cls}" style="${this._esc(this._rootStyle(state))}">
      ${this._headerHtml()}
      ${this._dividerHtml()}
      ${this._previewRowHtml(state)}
      ${this._valueCodeHtml(state)}
      ${this._canvasHtml(state)}
      ${this._slidersHtml(state)}
      ${this._swatchesHtml(state)}
    </div>`;
  }

  _headerHtml() {
    const title = this._attr('title', '');
    if (this.hideHeader || this.hideTitle || !title) return '';
    return `<div class="w-color-picker-header"><span class="w-color-picker-title">${this._esc(title)}</span></div>`;
  }

  _dividerHtml() {
    return this.divided ? '<hr class="w-color-picker-divider">' : '';
  }

  _previewRowHtml(state) {
    return `<div class="w-color-picker-preview-row">
        <span class="w-color-preview" style="background:${this._esc(state.alphaCss)}"></span>
        ${this._editHtml(state)}
        ${this._eyeDropperHtml()}
      </div>`;
  }

  _editHtml(state) {
    if (this.hideInputs) return '';
    const caption = this.hideInputLabels
      ? ''
      : `<span class="w-color-picker-input-label">${this._esc(this.mode)}</span>`;
    return `<label class="w-color-picker-edit">
        <input class="w-color-picker-input" type="text" spellcheck="false" aria-label="Color value" value="${this._esc(this._formatValue(state, this.mode))}"${this._dis()}>
        ${caption}
      </label>${this._modeSelectHtml()}`;
  }

  _modeSelectHtml() {
    const modes = this.modes;
    if (modes.length < 2) return '';
    const current = this.mode;
    const options = modes
      .map((name) => `<option value="${this._esc(name)}"${name === current ? ' selected' : ''}>${this._esc(name.toUpperCase())}</option>`)
      .join('');
    return `<select class="w-color-picker-mode" aria-label="Color mode"${this._dis()} data-color-mode>${options}</select>`;
  }

  _eyeDropperHtml() {
    if (this.hideEyeDropper || typeof window === 'undefined' || typeof window.EyeDropper !== 'function') return '';
    const name = this._attr('eye-dropper-icon', '');
    const icon = name ? WIcons.resolve(name, { iconClass: 'w-icon' }) : EYE_DROPPER_SVG;
    return `<button type="button" class="w-color-picker-eye-dropper" aria-label="Pick a color from the screen"${this._dis()} data-eye-dropper>${icon}</button>`;
  }

  _valueCodeHtml(state) {
    if (!this.hideCanvas) return '';
    return `<code class="w-color-picker-value">${this._esc(this._formatValue(state, this.mode))}</code>`;
  }

  _canvasHtml(state) {
    if (this.hideCanvas) return '';
    return `<div class="w-color-picker-canvas" role="slider" tabindex="${this._tabindex()}" aria-label="Saturation and brightness" aria-valuetext="${Math.round(state.s * 100)}% saturation, ${Math.round(state.v * 100)}% brightness" data-color-canvas>
        <span class="w-color-picker-canvas-thumb" style="left:${state.s * 100}%;top:${(1 - state.v) * 100}%"></span>
      </div>`;
  }

  _slidersHtml(state) {
    if (this.hideCanvas || this.hideSliders) return '';
    const hue = `<div class="w-color-picker-slider w-color-picker-hue" role="slider" tabindex="${this._tabindex()}" aria-label="Hue" aria-valuemin="0" aria-valuemax="360" aria-valuenow="${Math.round(state.h)}" data-color-hue>
        <span class="w-color-picker-slider-thumb" style="left:${(state.h / 360) * 100}%"></span>
      </div>`;
    if (!this.showAlpha) return hue;
    return `${hue}<div class="w-color-picker-slider w-color-picker-alpha" role="slider" tabindex="${this._tabindex()}" aria-label="Alpha" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(state.a * 100)}" data-color-alpha>
        <span class="w-color-picker-slider-thumb" style="left:${state.a * 100}%"></span>
      </div>`;
  }

  _swatchesHtml(state) {
    const swatches = this._swatches();
    if (!this._showSwatches || !swatches.length) return '';
    const buttons = swatches.map((color) => this._swatchHtml(color, state.solidHex)).join('');
    return `<div class="w-color-picker-swatches" role="group" aria-label="Color swatches">${buttons}</div>`;
  }

  _swatchHtml(color, current) {
    const cls = this._cls({ selected: color.toLowerCase() === current.toLowerCase() });
    return `<button type="button" class="w-color-swatch${cls}" style="--w-color:${this._esc(color)}" data-color="${this._esc(color)}" aria-label="${this._esc(color)}"${this._dis()}></button>`;
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

    this._bindCanvas(state, commit);
    this._bindSliders(state, commit);
    this._bindEdit(commit);
    this._bindSwatches(commit);
  }

  _trackPointer(target, handler) {
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
  }

  _bindCanvas(state, commit) {
    const canvas = this._q('[data-color-canvas]');
    if (!canvas) return;
    this._trackPointer(canvas, (event) => {
      const rect = canvas.getBoundingClientRect();
      const s = wClamp((event.clientX - rect.left) / rect.width, 0, 1);
      const v = 1 - wClamp((event.clientY - rect.top) / rect.height, 0, 1);
      commit({ ...state(), s, v });
    });
    canvas.addEventListener('keydown', (event) => this._onCanvasKey(event, commit));
  }

  _bindSliders(state, commit) {
    this._bindSlider('[data-color-hue]', 'h', 360, state, commit);
    this._bindSlider('[data-color-alpha]', 'a', 1, state, commit);
  }

  _bindSlider(selector, key, scale, state, commit) {
    const track = this._q(selector);
    if (!track) return;
    this._trackPointer(track, (event) => {
      const rect = track.getBoundingClientRect();
      commit({ ...state(), [key]: wClamp((event.clientX - rect.left) / rect.width, 0, 1) * scale });
    });
    track.addEventListener('keydown', (event) => this._onLinearKey(event, key, scale, commit));
  }

  _bindEdit(commit) {
    this._q('.w-color-picker-input')?.addEventListener('change', (event) => {
      event.stopPropagation();
      if (this.disabled) return;
      const rgba = parseColor(event.target.value, this.value);
      commit({ ...rgbToHsv(rgba), a: rgba.a });
    });

    this._q('[data-color-mode]')?.addEventListener('change', (event) => {
      event.stopPropagation();
      const mode = event.target.value;
      this.setAttribute('mode', mode);
      this._emit('update:mode', { mode });
    });

    this._q('[data-eye-dropper]')?.addEventListener('click', () => this._pickFromScreen(commit));
  }

  async _pickFromScreen(commit) {
    if (this.disabled) return;
    try {
      const result = await new window.EyeDropper().open();
      const rgba = hexToRgba(normalizeHex(result?.sRGBHex, this.value));
      commit({ ...rgbToHsv(rgba), a: this.alpha });
    } catch (_) {
      /* the user dismissed the eyedropper */
    }
  }

  _bindSwatches(commit) {
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
