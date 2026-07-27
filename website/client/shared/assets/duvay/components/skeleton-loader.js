/* <w-skeleton-loader> — alias for <w-skeleton>
 *
 * Attributes, events, and slots are identical to <w-skeleton>, plus:
 *   loading-text - aria-label announced while the placeholder is showing
 *                  (default "Loading...")
 */

import './skeleton.js';

class WSkeletonLoader extends customElements.get('w-skeleton') {
  static attrs = ['loading-text'];

  // The bones already carry aria-busy / aria-live; `loading-text` names what is
  // loading. Applied after render so the shared template stays untouched.
  _events() {
    const root = this._q('.w-skeleton-loader');
    if (root) root.setAttribute('aria-label', this._attr('loading-text', 'Loading...'));
  }
}

if (!customElements.get('w-skeleton-loader')) {
  customElements.define('w-skeleton-loader', WSkeletonLoader);
}
