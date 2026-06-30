/* <w-breadcrumbs-divider> — Explicit divider for manual breadcrumb composition
 *
 * Place between two <w-breadcrumb>/<w-breadcrumbs-item> elements to override
 * the automatic separator with custom content:
 *   <w-breadcrumbs-divider>»</w-breadcrumbs-divider>
 *
 * The divider content is provided as the child. When omitted, <w-breadcrumbs>
 * draws its own separator between adjacent crumbs, so this element is only needed
 * for a custom one.
 */

class WBreadcrumbsDivider extends WElement {
  _template() {
    return `<span class="w-breadcrumb-sep" aria-hidden="true"><slot></slot></span>`;
  }
}

if (!customElements.get('w-breadcrumbs-divider')) {
  customElements.define('w-breadcrumbs-divider', WBreadcrumbsDivider);
}
