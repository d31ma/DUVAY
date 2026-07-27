/* <w-date-picker-header> — Date picker header */

export class WDatePickerHeader extends WElement {
  static attrs = ['header', 'append-icon', 'clickable', 'transition'];

  get header() { return this._attr('header', ''); }
  get appendIcon() { return this._attr('append-icon', ''); }
  get clickable() { return this._bool('clickable') || this.hasAttribute('onclick'); }
  // Named transition played when the header content changes, e.g. "fade".
  get transition() { return this._attr('transition', '').trim(); }

  _template() {
    const transition = this.transition;
    return `<div class="w-date-picker-header${this.clickable ? ' w-date-picker-header--clickable' : ''}${this._cls({ [`w-date-picker-header--transition-${transition}`]: transition })}"${this._attrs({ 'data-transition': transition })}>
      <span class="w-date-picker-header__prepend"><slot name="prepend"></slot></span>
      <span class="w-date-picker-header__content"><slot>${this._esc(this.header)}</slot></span>
      <span class="w-date-picker-header__append">${this.appendIcon ? `<button class="w-btn w-btn-text w-btn-icon" type="button" data-append aria-label="${this._esc(this.appendIcon)}">${this._esc(this.appendIcon)}</button>` : '<slot name="append"></slot>'}</span>
    </div>`;
  }

}

if (!customElements.get('w-date-picker-header')) {
  customElements.define('w-date-picker-header', WDatePickerHeader);
}
