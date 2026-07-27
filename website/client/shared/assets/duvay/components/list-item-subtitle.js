/* <w-list-item-subtitle> — List item subtitle subcomponent
 *
 * Attributes:
 *   opacity - CSS opacity for the subtitle text (0–1)
 */

class WListItemSubtitle extends WElement {
  static attrs = ['opacity'];

  _template() {
    const opacity = this._attr('opacity', '');
    const style = this._attrs({ style: opacity && `opacity: ${opacity}` });
    return `<div class="w-list-item-subtitle"${style}><slot></slot></div>`;
  }
}

if (!customElements.get('w-list-item-subtitle')) {
  customElements.define('w-list-item-subtitle', WListItemSubtitle);
}
