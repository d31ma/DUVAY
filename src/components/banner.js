/* <w-banner> — Vuetify-style banner: a prominent message surface with an
 * optional leading icon/avatar, text, and trailing actions.
 *
 * Attributes:
 *   text       - banner message text (or use the default slot / text slot)
 *   icon       - leading icon glyph/text
 *   avatar     - leading avatar image URL
 *   lines      - one | two | three  (clamps the text and sets min-height)
 *   sticky     - pins the banner to the top of its scroll container
 *   mobile     - stacks the actions below the text (alias: stacked)
 *   stacked    - stacks the actions below the text
 *   color      - token color for the leading icon accent
 *   bg-color   - token color for the banner surface (primary | success | …)
 *   rounded / border / elevation / density — common surface props
 *
 * Slots:
 *   default / text - banner message
 *   prepend        - custom leading media (overrides icon/avatar)
 *   actions        - trailing action buttons
 */

class WBanner extends WElement {
  static attrs = ['text', 'icon', 'avatar', 'lines', 'sticky', 'mobile', 'stacked', 'color', 'bg-color'];

  static lines = ['one', 'two', 'three'];
  static tokens = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info', 'surface'];

  get text()    { return this._attr('text', ''); }
  get icon()    { return this._attr('icon', ''); }
  get avatar()  { return this._attr('avatar', ''); }
  get lines()   { return this.constructor.lines.includes(this._attr('lines', '')) ? this._attr('lines', '') : ''; }
  get sticky()  { return this._bool('sticky'); }
  get stacked() { return this._bool('stacked') || this._bool('mobile'); }

  _template() {
    const classes = [
      'w-banner',
      this.sticky ? 'w-banner--sticky' : '',
      this.stacked ? 'w-banner--stacked' : '',
      this.lines ? 'w-banner--lines-' + this.lines : '',
    ].filter(Boolean).join(' ');

    let prepend = '';
    if (this._hasSlot('prepend')) {
      prepend = '<div class="w-banner__prepend"><slot name="prepend"></slot></div>';
    } else if (this.avatar) {
      prepend = `<div class="w-banner__prepend"><span class="w-avatar w-banner__avatar"><img src="${this._esc(this.avatar)}" alt=""></span></div>`;
    } else if (this.icon) {
      prepend = `<div class="w-banner__prepend"><span class="w-banner__icon" aria-hidden="true">${this._esc(this.icon)}</span></div>`;
    }

    const textInner = this._hasSlot('text') ? '<slot name="text"></slot>'
      : this.text ? this._esc(this.text)
      : '<slot></slot>';
    const content = `<div class="w-banner__content"><div class="w-banner-text">${textInner}</div></div>`;

    const actions = this._hasSlot('actions')
      ? '<div class="w-banner-actions"><slot name="actions"></slot></div>'
      : '';

    return `<div class="${classes}" role="region" aria-label="Banner"${this._surfaceStyle()}>${prepend}${content}${actions}</div>`;
  }

  // Resolve color / bg-color to CSS custom properties on the inner surface.
  // Named tokens use the *-container / on-*-container pair so contrast holds
  // (mirrors the alert component); raw values (hex/rgb) pass straight through.
  _surfaceStyle() {
    const styles = [];
    const accent = this._token(this._attr('color', ''));
    if (accent) styles.push('--w-banner-accent: ' + accent.fg);

    const bg = this._attr('bg-color', '');
    if (bg) {
      const t = this._token(bg);
      if (t) { styles.push('--w-banner-bg: ' + t.bg); styles.push('--w-banner-fg: ' + t.fg); }
      else { styles.push('--w-banner-bg: ' + bg); }
    }
    return styles.length ? ` style="${styles.join('; ')}"` : '';
  }

  _token(value) {
    const t = String(value || '').trim().toLowerCase();
    if (!t) return null;
    if (t === 'surface') return { bg: 'var(--w-surface)', fg: 'var(--w-text)' };
    const name = t === 'info' ? 'primary' : t;
    if (!this.constructor.tokens.includes(t)) return null;
    return { bg: `var(--w-${name}-container)`, fg: `var(--w-on-${name}-container)` };
  }

  _hasSlot(name) { return !!this.querySelector('[slot="' + name + '"]'); }
}

if (!customElements.get('w-banner')) customElements.define('w-banner', WBanner);
