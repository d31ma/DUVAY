/* <w-parallax> — scrolling parallax banner (Vuetify VParallax parity).
 *
 * Attributes:
 *   src    - background image URL
 *   alt    - alt text for the image
 *   height - banner height (CSS length; default from CSS = 400px)
 *   scale  - parallax intensity 0–1 (default 0.5; higher = more movement)
 *
 * Slot: default — content centered over the image (title, actions…).
 *
 * The image shifts on scroll via translateY. Disabled when the user
 * prefers reduced motion.
 */

export class WParallax extends WElement {
  static attrs = ['src', 'height', 'alt', 'scale'];

  get src() { return this._attr('src', ''); }
  get height() { return this._attr('height', ''); }
  get alt() { return this._attr('alt', ''); }
  get scale() {
    const s = parseFloat(this._attr('scale', '0.5'));
    return isNaN(s) ? 0.5 : Math.min(Math.max(s, 0), 1);
  }

  _template() {
    const style = this.height ? ` style="height: ${this._esc(this.height)};"` : '';
    return `<div class="w-parallax"${style}>
      <img class="w-parallax-img" src="${this._esc(this.src)}" alt="${this._esc(this.alt)}">
      <div class="w-parallax-content"><slot></slot></div>
    </div>`;
  }

  _events() {
    this._img = this._q('.w-parallax-img');
    this._root = this._q('.w-parallax');
    if (!this._img || this._reducedMotion()) return;
    this._onScroll = () => this._update();
    window.addEventListener('scroll', this._onScroll, { passive: true });
    window.addEventListener('resize', this._onScroll, { passive: true });
    this._update();
  }

  _reducedMotion() {
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  _update() {
    if (!this._root || !this._img) return;
    const rect = this._root.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom < 0 || rect.top > vh) return; // offscreen — skip
    // Offset of the element's center from the viewport center, damped by scale.
    // ponytail: fixed 0.3 damping keeps the image within its 130% overdraw; raise
    // the .w-parallax-img height in CSS if a larger scale needs more travel.
    const center = rect.top + rect.height / 2;
    const translate = -(center - vh / 2) * this.scale * 0.3;
    this._img.style.transform = `translateY(${translate.toFixed(1)}px)`;
  }

  disconnectedCallback() {
    if (this._onScroll) {
      window.removeEventListener('scroll', this._onScroll);
      window.removeEventListener('resize', this._onScroll);
    }
  }
}

if (!customElements.get('w-parallax')) customElements.define('w-parallax', WParallax);
