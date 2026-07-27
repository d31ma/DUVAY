/* <w-card-subtitle> — Card subtitle subcomponent
 *
 * Attributes:
 *   opacity - subtitle opacity (0–1)
 */

/* Shared by <w-card-subtitle> and <w-card-text>: Vuetify's `opacity` prop is a
   plain number, so anything that is not a finite 0–1 value is ignored rather
   than injected into the style attribute. */
export function wCardOpacityStyle(host) {
  const raw = host.getAttribute('opacity');
  if (raw == null || raw === '') return '';
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0 || value > 1) return '';
  return ` style="opacity:${value}"`;
}

class WCardSubtitle extends WElement {
  static attrs = ['opacity'];

  _template() {
    return `<div class="w-card-subtitle"${wCardOpacityStyle(this)}><slot></slot></div>`;
  }
}

if (!customElements.get('w-card-subtitle')) {
  customElements.define('w-card-subtitle', WCardSubtitle);
}
