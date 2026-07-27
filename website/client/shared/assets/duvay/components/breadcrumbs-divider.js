/* <w-breadcrumbs-divider> — Explicit divider for manual breadcrumb composition
 *
 * Place between two <w-breadcrumb>/<w-breadcrumbs-item> elements to override
 * the automatic separator with custom content:
 *   <w-breadcrumbs-divider>»</w-breadcrumbs-divider>
 *
 * The divider content is provided as the child, or via the `divider` attribute:
 *   <w-breadcrumbs-divider divider="-"></w-breadcrumbs-divider>
 *
 * When omitted, <w-breadcrumbs>
 * draws its own separator between adjacent crumbs, so this element is only needed
 * for a custom one.
 */

class WBreadcrumbsDivider extends WElement {
  static attrs = ['divider'];

  get divider() { return this._attr('divider', ''); }

  _template() {
    const inner = this.divider ? this._esc(this.divider) + '<slot hidden></slot>' : '<slot></slot>';
    return `<span class="w-breadcrumb-sep" aria-hidden="true">${inner}</span>`;
  }
}

if (!customElements.get('w-breadcrumbs-divider')) {
  customElements.define('w-breadcrumbs-divider', WBreadcrumbsDivider);
}
