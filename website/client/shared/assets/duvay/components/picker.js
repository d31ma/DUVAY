/* <w-picker> — card shell shared by the date / time pickers
 * (DuVay equivalent of Vuetify v-picker).
 *
 * Attributes:
 *   title       - header text
 *   hide-title  - drop the title text; authored header content stays
 *   hide-header - drop the header row entirely
 *   divided     - rule between the header and the body
 *   landscape   - header beside the body instead of above it
 *
 * Slots:
 *   default - picker body
 *   header  - extra header content, rendered after the title
 */

export class WPicker extends WElement {
  static attrs = ['title', 'hide-title', 'hide-header', 'divided', 'landscape'];

  get title() { return this._attr('title', ''); }
  get hideTitle() { return this._bool('hide-title'); }
  get hideHeader() { return this._bool('hide-header'); }
  get divided() { return this._bool('divided'); }
  get landscape() { return this._bool('landscape'); }

  _rootClass() {
    return 'w-picker w-card' + this._cls({
      'w-picker--landscape': this.landscape,
      'w-picker--divided': this.divided,
    });
  }

  // Authored header content outlives `hide-title`, so the two flags stay
  // independently observable.
  _hasHeaderSlot() {
    return !!this.querySelector('[slot="header"], slot[name="header"]');
  }

  _headerVisible() {
    if (this.hideHeader) return false;
    return (!!this.title && !this.hideTitle) || this._hasHeaderSlot();
  }

  // The slot is always rendered — a hidden header keeps its children alive so
  // toggling the flag back restores them.
  _headerHtml(visible) {
    const title = this.hideTitle ? '' : this._esc(this.title);
    const shell = visible ? 'class="w-card-header"' : 'class="w-picker-header" hidden';
    return `<div ${shell}>${title}<slot name="header"></slot></div>`;
  }

  _dividerHtml() {
    return `<div class="w-divider${this.landscape ? ' w-divider--vertical' : ''}"></div>`;
  }

  _template() {
    const visible = this._headerVisible();
    const divider = visible && this.divided ? this._dividerHtml() : '';
    // `.w-card` owns `display`, so the landscape axis lives on an inner wrapper.
    const layout = this.landscape ? 'w-picker-layout d-flex' : 'w-picker-layout';
    return `<div class="${this._rootClass()}">
      <div class="${layout}">
        ${this._headerHtml(visible)}${divider}
        <div class="w-card-body"><slot></slot></div>
      </div>
    </div>`;
  }
}

if (!customElements.get('w-picker')) customElements.define('w-picker', WPicker);
