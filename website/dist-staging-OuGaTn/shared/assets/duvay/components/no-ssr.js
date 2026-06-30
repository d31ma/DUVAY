/* <w-no-ssr> — render content only after the client mounts (Vuetify VNoSsr).
 *
 * Until the component connects it shows the `placeholder` slot (if any); on the
 * next frame it reveals the default slot. Useful for browser-only widgets that
 * must not render during server-side rendering / static prerender.
 *
 * Slots:
 *   default     - client-only content.
 *   placeholder - shown until the client mounts.
 */

export class WNoSsr extends WElement {
  _hasSlot(name) { return !!this.querySelector('[slot="' + name + '"]'); }

  _template() {
    const mounted = this._mounted;
    const placeholder = this._hasSlot('placeholder')
      ? `<slot name="placeholder"${mounted ? ' hidden' : ''}></slot>`
      : '';
    return `<div class="w-no-ssr">${placeholder}<slot${mounted ? '' : ' hidden'}></slot></div>`;
  }

  _events() {
    if (this._mounted) return;
    this.__raf = requestAnimationFrame(() => {
      this._mounted = true;
      this._render();
      if (typeof this._events === 'function') this._events();
    });
  }

  disconnectedCallback() {
    if (this.__raf) cancelAnimationFrame(this.__raf);
  }
}

if (!customElements.get('w-no-ssr')) customElements.define('w-no-ssr', WNoSsr);
