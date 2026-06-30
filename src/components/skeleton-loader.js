/* <w-skeleton-loader> — alias for <w-skeleton>
 *
 * Attributes, events, and slots are identical to <w-skeleton>.
 */

import './skeleton.js';

class WSkeletonLoader extends customElements.get('w-skeleton') {}

if (!customElements.get('w-skeleton-loader')) {
  customElements.define('w-skeleton-loader', WSkeletonLoader);
}
