/* <w-breadcrumb> — Individual breadcrumb for use inside <w-breadcrumbs>
 *
 * Attributes:
 *   href     - navigation target; renders an <a> (omit, or set active/disabled,
 *              for the non-link current page)
 *   active   - marks the current page (renders <span aria-current="page">)
 *   disabled - non-interactive crumb
 *   icon     - leading icon glyph
 *
 * Slots:
 *   default - crumb label
 *
 * The separator between crumbs is drawn by <w-breadcrumbs> via CSS, so a
 * breadcrumb carries no separator of its own.
 */

export class WBreadcrumb extends WElement {

  static attrs = ['href', 'active', 'disabled', 'icon'];

  get href() { return this._attr('href', ''); }
  get active() { return this._bool('active'); }
  get disabled() { return this._bool('disabled'); }
  get icon() { return this._attr('icon', ''); }

  _template() {
    const cls = `w-breadcrumb${this.active ? ' active' : ''}`;
    const icon = this.icon
      ? `<span class="w-breadcrumb-icon" aria-hidden="true">${this._esc(this.icon)}</span>`
      : '';

    if (this.href && !this.active && !this.disabled) {
      return `<a class="${cls}" href="${this._esc(this.href)}">${icon}<slot></slot></a>`;
    }
    const attrs = `${this.active ? ' aria-current="page"' : ''}${this.disabled ? ' aria-disabled="true"' : ''}`;
    return `<span class="${cls}"${attrs}>${icon}<slot></slot></span>`;
  }
}

if (!customElements.get('w-breadcrumb')) customElements.define('w-breadcrumb', WBreadcrumb);
