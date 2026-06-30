/* <w-empty> — Empty state web component (Vuetify v-empty-state parity)
 *
 * Attributes:
 *   headline     - large display text (e.g. "404") shown above the media
 *   title        - bold title text
 *   text         - body description text
 *   subtitle     - legacy alias for text
 *   icon         - icon glyph/text for the media slot
 *   image        - image URL for the media slot (overrides icon)
 *   size         - CSS length / number for the icon or image
 *   color        - token color for the icon / headline accent
 *   bg-color     - token color for the empty-state surface
 *   justify      - start | center | end  (alignment, default center)
 *   action-text  - label for a built-in action button
 *   href         - turns the action button into a link
 *   text-width   - max width (CSS length / number) of the title + text block
 *
 * Slots:
 *   media   - custom icon / illustration (also the default slot)
 *   default - custom illustration (legacy; same as media)
 *   headline, title, text - override the matching attribute
 *   actions - action buttons (legacy alias: action)
 *
 * Events:
 *   click:action - fired when the built-in action button is activated
 */

const W_EMPTY_DEFAULT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>`;

class WEmpty extends WElement {

  static attrs = ['headline', 'title', 'text', 'subtitle', 'icon', 'image', 'size', 'color', 'bg-color', 'justify', 'action-text', 'href', 'text-width'];
  static justify = ['start', 'center', 'end'];
  static tokens = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info', 'surface'];

  get headline()   { return this._attr('headline', ''); }
  get title()      { return this._attr('title', ''); }
  get text()       { return this._attr('text', '') || this._attr('subtitle', ''); }
  get icon()       { return this._attr('icon', ''); }
  get image()      { return this._attr('image', ''); }
  get justify()    { const j = this._attr('justify', ''); return this.constructor.justify.includes(j) ? j : 'center'; }
  get actionText() { return this._attr('action-text', ''); }
  get href()       { return this._attr('href', ''); }

  _template() {
    const html = [
      `<div class="w-empty w-empty--${this.justify}"${this._style()}>`,
      this._media(),
      this._headline(),
      this._content(),
      this._actions(),
      `</div>`,
    ];
    return html.join('');
  }

  _events() {
    const action = this._q('[data-w-empty-action]');
    if (action && !this.href) action.addEventListener('click', () => this._emit('click:action', { value: true }));
  }

  _media() {
    if (this._hasSlot('media')) return '<div class="w-empty-media"><slot name="media"></slot></div>';
    if (this.image) return `<div class="w-empty-media"><img class="w-empty-image" src="${this._esc(this.image)}" alt=""></div>`;
    if (this.icon) return `<div class="w-empty-media w-empty-icon" aria-hidden="true">${this._esc(this.icon)}</div>`;
    if (this._hasDefaultSlot()) return '<div class="w-empty-media"><slot></slot></div>';
    return `<div class="w-empty-media" aria-hidden="true">${W_EMPTY_DEFAULT_ICON}</div>`;
  }

  _headline() {
    if (this._hasSlot('headline')) return '<div class="w-empty-headline"><slot name="headline"></slot></div>';
    if (this.headline) return `<div class="w-empty-headline">${this._esc(this.headline)}</div>`;
    return '';
  }

  _content() {
    const hasTitle = this._hasSlot('title') || this.title;
    const hasText = this._hasSlot('text') || this.text;
    if (!hasTitle && !hasText) return '';
    let html = '<div class="w-empty-content">';
    if (this._hasSlot('title')) html += '<p class="w-empty-title"><slot name="title"></slot></p>';
    else if (this.title) html += `<p class="w-empty-title">${this._esc(this.title)}</p>`;
    if (this._hasSlot('text')) html += '<p class="w-empty-subtitle"><slot name="text"></slot></p>';
    else if (this.text) html += `<p class="w-empty-subtitle">${this._esc(this.text)}</p>`;
    return html + '</div>';
  }

  _actions() {
    if (this._hasSlot('actions')) return '<div class="w-empty-actions"><slot name="actions"></slot></div>';
    if (this._hasSlot('action')) return '<div class="w-empty-actions"><slot name="action"></slot></div>';
    if (this.actionText) {
      const tag = this.href ? 'a' : 'button';
      const attrs = this.href ? ` href="${this._esc(this.href)}"` : ' type="button"';
      return `<div class="w-empty-actions"><${tag} class="w-btn w-btn--tonal" data-w-empty-action${attrs}>${this._esc(this.actionText)}</${tag}></div>`;
    }
    return '';
  }

  // Resolve color / bg-color to CSS custom properties. Named tokens map to the
  // theme palette (bg uses the *-container / on-*-container pair for contrast);
  // raw values (hex/rgb) pass straight through.
  _style() {
    const s = [];
    const size = this._cssLength(this._attr('size', ''));
    const tw = this._cssLength(this._attr('text-width', ''));
    if (size) s.push('--w-empty-size: ' + size);
    if (tw) s.push('--w-empty-text-width: ' + tw);

    const c = this._token(this._attr('color', ''));
    if (c) s.push('--w-empty-accent: ' + c.solid);

    const bg = this._token(this._attr('bg-color', ''));
    if (bg) {
      s.push('--w-empty-bg: ' + (bg.bg || bg.solid));
      if (bg.fg) s.push('--w-empty-fg: ' + bg.fg);
    }
    return s.length ? ` style="${s.join('; ')}"` : '';
  }

  _token(value) {
    const t = String(value || '').trim().toLowerCase();
    if (!t) return null;
    if (t === 'surface') return { solid: 'var(--w-surface)', bg: 'var(--w-surface)', fg: 'var(--w-text)' };
    if (!this.constructor.tokens.includes(t)) return { solid: value };
    const n = t === 'info' ? 'primary' : t;
    return { solid: `var(--w-${n})`, bg: `var(--w-${n}-container)`, fg: `var(--w-on-${n}-container)` };
  }

  _cssLength(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    return /^\d+(\.\d+)?$/.test(raw) ? raw + 'px' : raw;
  }

  _hasSlot(name) { return !!this.querySelector('[slot="' + name + '"]'); }

  _hasDefaultSlot() {
    return Array.from(this.childNodes).some((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return !n.hasAttribute('slot');
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      return false;
    });
  }
}

customElements.define('w-empty', WEmpty);
