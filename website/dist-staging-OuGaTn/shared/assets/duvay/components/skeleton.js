/* <w-skeleton> — Loading placeholder (Vuetify v-skeleton-loader parity).
 *
 * Attributes:
 *   type        - comma list of bone presets, e.g. "card", "list-item-avatar-two-line",
 *                 "article, actions". Supports @n repeats ("text@3").
 *   boilerplate - render the shapes without the shimmer animation
 *   loading     - when a default slot is present, show the skeleton while true
 *   color       - base bone color (token or raw CSS color)
 *   width       - CSS width of the loader root
 *   height      - CSS height of the loader root
 *
 *   variant / lines - legacy API (text | avatar | block + line count)
 *
 * Slots:
 *   default - real content; shown instead of the skeleton when not loading
 *
 * Bone presets: text, heading, subtitle, avatar, image, button, chip, icon,
 * divider, table-cell, sentences, paragraph, article, actions, card,
 * card-avatar, list-item[-avatar][-two-line|-three-line].
 */

const SKELETON_BASIC = {
  text: '<div class="w-skeleton w-skeleton-text"></div>',
  heading: '<div class="w-skeleton w-skeleton-heading"></div>',
  subtitle: '<div class="w-skeleton w-skeleton-subtitle"></div>',
  avatar: '<div class="w-skeleton w-skeleton-avatar"></div>',
  image: '<div class="w-skeleton w-skeleton-image"></div>',
  button: '<div class="w-skeleton w-skeleton-button"></div>',
  chip: '<div class="w-skeleton w-skeleton-chip"></div>',
  icon: '<div class="w-skeleton w-skeleton-icon"></div>',
  divider: '<div class="w-skeleton w-skeleton-divider"></div>',
  'table-cell': '<div class="w-skeleton w-skeleton-table-cell"></div>',
  block: '<div class="w-skeleton w-skeleton-block"></div>',
};

const SKELETON_COMPOSITE = {
  sentences: 'text@2',
  paragraph: 'text@3',
  article: 'heading, paragraph',
  actions: 'button@2',
  card: 'image, article',
  'card-avatar': 'image, list-item-avatar',
};

// [hasAvatar, textLines]
const SKELETON_LIST = {
  'list-item': [false, 1],
  'list-item-two-line': [false, 2],
  'list-item-three-line': [false, 3],
  'list-item-avatar': [true, 1],
  'list-item-avatar-two-line': [true, 2],
  'list-item-avatar-three-line': [true, 3],
};

class WSkeleton extends WElement {

  static attrs = ['type', 'boilerplate', 'loading', 'color', 'width', 'height', 'variant', 'lines'];
  static tokens = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info'];

  get type()  { return this._attr('type', ''); }

  _template() {
    // Default slot present → toggle between skeleton (loading) and real content.
    if (this._hasDefaultSlot() && !this._bool('loading')) {
      return '<slot></slot>';
    }

    const bones = this.type ? this._resolveList(this.type) : this._legacyBones();

    const styles = [];
    const w = this._cssLength(this._attr('width', ''));
    const h = this._cssLength(this._attr('height', ''));
    if (w) styles.push('width: ' + w);
    if (h) styles.push('height: ' + h);
    const color = this._color(this._attr('color', ''));
    if (color) styles.push('--w-skeleton-color: ' + color);
    const style = styles.length ? ` style="${styles.join('; ')}"` : '';

    const cls = 'w-skeleton-loader' + (this._bool('boilerplate') ? ' w-skeleton--boilerplate' : '');
    return `<div class="${cls}" aria-busy="true" aria-live="polite"${style}>${bones}</div>`;
  }

  /* ── Bone resolution ──────────────────────────────────────────────────── */
  _resolveList(list) {
    return String(list).split(',').map((t) => this._resolveToken(t.trim())).join('');
  }

  _resolveToken(token) {
    if (!token) return '';
    const at = token.indexOf('@');
    if (at !== -1) {
      const base = token.slice(0, at);
      const count = Math.max(1, parseInt(token.slice(at + 1), 10) || 1);
      return Array.from({ length: count }, () => this._resolveToken(base)).join('');
    }
    if (SKELETON_LIST[token]) return this._listItem(...SKELETON_LIST[token]);
    if (SKELETON_COMPOSITE[token]) {
      const inner = this._resolveList(SKELETON_COMPOSITE[token]);
      if (token === 'card' || token === 'card-avatar') return `<div class="w-skeleton-card">${inner}</div>`;
      return inner;
    }
    return SKELETON_BASIC[token] || SKELETON_BASIC.text;
  }

  _listItem(hasAvatar, lines) {
    const avatar = hasAvatar ? SKELETON_BASIC.avatar : '';
    const text = Array.from({ length: lines }, () => SKELETON_BASIC.text).join('');
    return `<div class="w-skeleton-list-item">${avatar}<div class="w-skeleton-list-item__content">${text}</div></div>`;
  }

  /* ── Legacy variant / lines API ───────────────────────────────────────── */
  _legacyBones() {
    const v = this._attr('variant', 'text');
    if (v === 'avatar') return SKELETON_BASIC.avatar;
    if (v === 'block') return SKELETON_BASIC.block;
    const count = Math.max(1, parseInt(this._attr('lines', '1'), 10) || 1);
    return Array.from({ length: count }, () => SKELETON_BASIC.text).join('');
  }

  /* ── Helpers ──────────────────────────────────────────────────────────── */
  _color(value) {
    const t = String(value || '').trim().toLowerCase();
    if (!t) return '';
    if (this.constructor.tokens.includes(t)) return `var(--w-${t === 'info' ? 'primary' : t})`;
    return value;
  }

  _cssLength(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    return /^\d+(\.\d+)?$/.test(raw) ? raw + 'px' : raw;
  }

  _hasDefaultSlot() {
    return Array.from(this.childNodes).some((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return !n.hasAttribute('slot');
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      return false;
    });
  }
}

customElements.define('w-skeleton', WSkeleton);
