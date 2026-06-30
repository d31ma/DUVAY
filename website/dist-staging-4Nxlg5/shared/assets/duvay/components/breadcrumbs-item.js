/* <w-breadcrumbs-item> — alias for <w-breadcrumb>
 *
 * Attributes, events, and slots are identical to <w-breadcrumb>.
 */

import './breadcrumb.js';

class WBreadcrumbsItem extends customElements.get('w-breadcrumb') {}

if (!customElements.get('w-breadcrumbs-item')) {
  customElements.define('w-breadcrumbs-item', WBreadcrumbsItem);
}
