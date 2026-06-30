/* <w-breadcrumbs> — Breadcrumb navigation container
 *
 * Attributes:
 *   items         - JSON array of { title|text, href, disabled, icon } to render
 *                   crumbs declaratively (the last item is the current page)
 *   divider       - separator string drawn between crumbs (default "/")
 *   icon          - leading (prepend) icon glyph
 *   color         - palette token for the link color
 *   active-color  - palette token for the current-page crumb
 *   bg-color      - palette token for the container background
 *   density       - comfortable | compact
 *   rounded       - boolean; rounded container (pairs with bg-color)
 *   disabled      - boolean; disable all crumbs
 *
 * Usage (declarative):
 *   <w-breadcrumbs divider="›" items='[
 *     {"title":"Home","href":"/"},
 *     {"title":"Library","href":"/library"},
 *     {"title":"Data"}
 *   ]'></w-breadcrumbs>
 *
 * Usage (composed):
 *   <w-breadcrumbs>
 *     <w-breadcrumb href="/">Home</w-breadcrumb>
 *     <w-breadcrumb active>Data</w-breadcrumb>
 *   </w-breadcrumbs>
 *
 * The separator is drawn by CSS between adjacent crumbs, so items carry none of
 * their own and an explicit <w-breadcrumbs-divider> suppresses the auto one.
 */

export class WBreadcrumbs extends WElement {

  static attrs = ['items', 'divider', 'icon', 'color', 'active-color', 'bg-color', 'density', 'rounded', 'disabled'];

  get items() {
    const raw = this.getAttribute('items');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (_) {
      return null;
    }
  }
  get divider() { return this._attr('divider', '/'); }
  get icon() { return this._attr('icon', ''); }
  get rounded() { return this.hasAttribute('rounded'); }

  _template() {
    const cls = ['w-breadcrumbs'];
    if (this.rounded) cls.push('w-breadcrumbs--rounded');
    const density = this.getAttribute('density');
    if (density === 'compact') cls.push('w-breadcrumbs--compact');
    else if (density === 'comfortable') cls.push('w-breadcrumbs--comfortable');

    const prepend = this.icon
      ? `<span class="w-breadcrumb-icon" aria-hidden="true">${this._esc(this.icon)}</span>`
      : '';

    const items = this.items;
    const body = (items && items.length)
      ? items.map((item, index) => this._crumb(item, index === items.length - 1)).join('')
      : '<slot></slot>';

    return `<nav class="${cls.join(' ')}" aria-label="Breadcrumb">${prepend}${body}</nav>`;
  }

  _crumb(item, isLast) {
    const label = item.title != null ? item.title : (item.text != null ? item.text : '');
    const icon = item.icon
      ? `<span class="w-breadcrumb-icon" aria-hidden="true">${this._esc(item.icon)}</span>`
      : '';
    const inner = `${icon}${this._esc(label)}`;
    const disabled = !!item.disabled;

    if (item.href && !isLast && !disabled) {
      return `<a class="w-breadcrumb" href="${this._esc(item.href)}">${inner}</a>`;
    }
    const cls = `w-breadcrumb${isLast ? ' active' : ''}`;
    const attrs = `${isLast ? ' aria-current="page"' : ''}${disabled ? ' aria-disabled="true"' : ''}`;
    return `<span class="${cls}"${attrs}>${inner}</span>`;
  }

  _applyCommonProps() {
    super._applyCommonProps();
    // Divider string → CSS custom property (quoted; escape " and \ for CSS).
    const divider = String(this.divider).replace(/[\\"]/g, '\\$&');
    this.style.setProperty('--w-breadcrumb-divider', `"${divider}"`);
    // Palette-token attributes → the strip's local custom properties.
    const setVar = (prop, attr) => {
      const v = this.getAttribute(attr);
      if (v) this.style.setProperty(prop, `var(--w-${v})`);
      else this.style.removeProperty(prop);
    };
    setVar('--w-breadcrumb-color', 'color');
    setVar('--w-breadcrumb-active-color', 'active-color');
    setVar('--w-breadcrumb-bg', 'bg-color');
  }
}

if (!customElements.get('w-breadcrumbs')) customElements.define('w-breadcrumbs', WBreadcrumbs);
