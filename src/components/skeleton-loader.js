/* <w-skeleton-loader> — alias for <w-skeleton>
 *
 * Attributes, events, and slots are identical to <w-skeleton>, including the
 * opt-in `announce` status and its `loading-text` message. The bones are
 * aria-hidden decoration and never a live region.
 */

import './skeleton.js';

class WSkeletonLoader extends customElements.get('w-skeleton') {}

if (!customElements.get('w-skeleton-loader')) {
  customElements.define('w-skeleton-loader', WSkeletonLoader);
}
