/* <w-card-item> - Card item subcomponent
 *
 * Attributes:
 *   title/subtitle - generated title/subtitle text
 *   prepend-avatar/prepend-icon - leading media
 *   append-avatar/append-icon - trailing media
 *
 * Slots:
 *   default, prepend, title, subtitle, append
 */

class WCardItem extends WElement {

  static attrs = ['title', 'subtitle', 'prepend-avatar', 'prepend-icon', 'append-avatar', 'append-icon', 'density'];

  get title()         { return this._attr('title', ''); }
  get subtitle()      { return this._attr('subtitle', ''); }
  get prependAvatar() { return this._attr('prepend-avatar', ''); }
  get prependIcon()   { return this._attr('prepend-icon', ''); }
  get appendAvatar()  { return this._attr('append-avatar', ''); }
  get appendIcon()    { return this._attr('append-icon', ''); }
  get density()       { return this._attr('density', ''); }

  _template() {
    const densityClass = this._cls({ ['w-card-item--' + this.density]: this.density });

    return `<div class="w-card-item${densityClass}">
      ${this._sideTemplate('prepend')}
      <span class="w-card-item__content">
        ${this._lineTemplate('title', 'w-card-title', this.title)}
        ${this._lineTemplate('subtitle', 'w-card-subtitle', this.subtitle)}
        <slot></slot>
      </span>
      ${this._sideTemplate('append')}
    </div>`;
  }

  _sideTemplate(side) {
    const media = this._mediaTemplate(side);
    if (!media && !this._hasSlot(side)) return '';
    const slot = `<slot name="${side}"></slot>`;
    const content = side === 'prepend' ? media + slot : slot + media;
    return `<span class="w-card-item__${side}">${content}</span>`;
  }

  _lineTemplate(name, className, text) {
    if (!text && !this._hasSlot(name)) return '';
    const content = text
      ? this._esc(text) + `<slot name="${name}" hidden></slot>`
      : `<slot name="${name}"></slot>`;
    return `<span class="${className}">${content}</span>`;
  }

  _mediaTemplate(side) {
    const avatar = side === 'prepend' ? this.prependAvatar : this.appendAvatar;
    const icon = side === 'prepend' ? this.prependIcon : this.appendIcon;
    if (avatar) return `<span class="w-avatar w-avatar--small"><img src="${this._esc(avatar)}" alt=""></span>`;
    if (icon) return `<span class="w-card-icon" aria-hidden="true">${this._esc(icon)}</span>`;
    return '';
  }

  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }

}

if (!customElements.get('w-card-item')) {
  customElements.define('w-card-item', WCardItem);
}
