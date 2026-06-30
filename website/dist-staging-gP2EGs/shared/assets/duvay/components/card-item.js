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
    const hasPrepend = this.prependAvatar || this.prependIcon || this._hasSlot('prepend');
    const hasAppend = this.appendAvatar || this.appendIcon || this._hasSlot('append');
    const hasTitle = this.title || this._hasSlot('title');
    const hasSubtitle = this.subtitle || this._hasSlot('subtitle');
    const densityClass = this.density ? ' w-card-item--' + this.density : '';

    return `<div class="w-card-item${densityClass}">
      ${hasPrepend ? `<span class="w-card-item__prepend">${this._mediaTemplate('prepend')}<slot name="prepend"></slot></span>` : ''}
      <span class="w-card-item__content">
        ${hasTitle ? `<span class="w-card-title">${this.title ? this._esc(this.title) + '<slot name="title" hidden></slot>' : '<slot name="title"></slot>'}</span>` : ''}
        ${hasSubtitle ? `<span class="w-card-subtitle">${this.subtitle ? this._esc(this.subtitle) + '<slot name="subtitle" hidden></slot>' : '<slot name="subtitle"></slot>'}</span>` : ''}
        <slot></slot>
      </span>
      ${hasAppend ? `<span class="w-card-item__append"><slot name="append"></slot>${this._mediaTemplate('append')}</span>` : ''}
    </div>`;
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
