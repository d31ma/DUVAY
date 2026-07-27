/* <w-breadcrumbs-item> — Vuetify-named crumb, built on <w-breadcrumb>
 *
 * Everything <w-breadcrumb> accepts, plus the two Vuetify-only props:
 *   title        - crumb label (alternative to the default slot)
 *   active-class - extra class(es) applied while the crumb is active.
 *                  <w-breadcrumbs active-class="…"> pushes its own value down
 *                  onto items that do not set one.
 */

import './breadcrumb.js';

class WBreadcrumbsItem extends customElements.get('w-breadcrumb') {
  static attrs = ['title', 'active-class'];

  get crumbTitle() { return this._attr('title', ''); }
  get activeClass() { return this._attr('active-class', ''); }

  _crumbClass() {
    if (!this.active) return 'w-breadcrumb';
    return 'w-breadcrumb active' + (this.activeClass ? ' ' + this.activeClass : '');
  }

  _labelMarkup() {
    return this.crumbTitle ? this._esc(this.crumbTitle) + '<slot hidden></slot>' : '<slot></slot>';
  }

  _template() {
    const cls = this._esc(this._crumbClass());
    const icon = this.icon
      ? `<span class="w-breadcrumb-icon" aria-hidden="true">${this._esc(this.icon)}</span>`
      : '';
    const label = this._labelMarkup();

    if (this.href && !this.active && !this.disabled) {
      return `<a class="${cls}" href="${this._esc(this.href)}">${icon}${label}</a>`;
    }
    const attrs = `${this.active ? ' aria-current="page"' : ''}${this.disabled ? ' aria-disabled="true"' : ''}`;
    return `<span class="${cls}"${attrs}>${icon}${label}</span>`;
  }
}

if (!customElements.get('w-breadcrumbs-item')) {
  customElements.define('w-breadcrumbs-item', WBreadcrumbsItem);
}
