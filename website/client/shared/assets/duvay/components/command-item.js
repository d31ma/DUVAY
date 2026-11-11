import { wSetValue } from './utils.js';
/* <w-command-item> — selectable command item
 *
 * Attributes:
 *   value         - value reported in the change event
 *   subtitle      - secondary line under the title
 *   snippet       - extra secondary line (e.g. a matched text snippet) under the subtitle
 *   icon / prepend-icon - leading icon glyph
 *   prepend-avatar / avatar - leading avatar image URL (wins over icon)
 *   tag           - short badge text shown after the content (e.g. "New", "Draft")
 *   tag-color     - badge color: primary (default) | secondary | tertiary | success |
 *                   warning | error | info
 *   shortcut      - keyboard shortcut shown on the right (kbd)
 *   disabled      - non-selectable
 *
 * Slots:
 *   default - the title
 *   prepend - custom leading content (rendered before the avatar/icon)
 *   append  - custom trailing content (rendered after the tag)
 *
 * Accessibility: the option's accessible name is its title only
 * (aria-labelledby); subtitle, snippet, tag, append content and shortcut are
 * its description (aria-describedby).
 *
 * Selection is handled by the parent <w-command> (click + keyboard), so this
 * element only renders; it does not emit on its own.
 */

export class WCommandItem extends WElement {
  static attrs = [
    'value', 'subtitle', 'snippet', 'icon', 'prepend-icon', 'prepend-avatar', 'avatar',
    'tag', 'tag-color', 'shortcut', 'disabled',
  ];

  static tagColors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info'];

  static count = 0;

  set value(v) { wSetValue(this, v); }
  get value() { return this._attr('value', ''); }
  get subtitle() { return this._attr('subtitle', ''); }
  get snippet() { return this._attr('snippet', ''); }
  get icon() { return this._attr('icon', '') || this._attr('prepend-icon', ''); }
  get avatar() { return this._attr('prepend-avatar', '') || this._attr('avatar', ''); }
  get tag() { return this._attr('tag', ''); }
  get tagColor() { return this._tagColor(this._attr('tag-color', '')); }
  get shortcut() { return this._attr('shortcut', ''); }
  get disabled() { return this._bool('disabled'); }

  set disabled(value) { this.toggleAttribute('disabled', !!value); }

  _template() {
    return this._rowMarkup({
      value: this.value,
      title: '<slot></slot>',
      subtitle: this.subtitle,
      snippet: this.snippet,
      icon: this.icon,
      avatar: this.avatar,
      tag: this.tag,
      tagColor: this.tagColor,
      shortcut: this.shortcut,
      disabled: this.disabled,
    });
  }

  // `fields.title` is markup (a slot or escaped text); every other field is raw text.
  _rowMarkup(fields) {
    const id = this._rowId();
    const disabled = fields.disabled ? ' disabled aria-disabled="true"' : '';
    return `<button class="w-command-item" role="option" type="button" value="${this._esc(fields.value)}" aria-labelledby="${id}-title"${this._describedBy(fields, id)}${disabled}>
      ${this._slotMarkup('prepend', id)}
      ${this._leadingMarkup(fields)}
      <span class="w-command-item-content">
        <span class="w-command-item-title" id="${id}-title">${fields.title}</span>
        ${this._lineMarkup(fields.subtitle, 'w-command-item-subtitle', id + '-subtitle')}
        ${this._lineMarkup(fields.snippet, 'w-command-item-subtitle w-command-item-snippet', id + '-snippet')}
      </span>
      ${this._lineMarkup(fields.tag, 'w-badge w-badge-' + fields.tagColor + ' w-command-item-tag', id + '-tag')}
      ${this._slotMarkup('append', id)}
      ${this._lineMarkup(fields.shortcut, 'w-kbd', id + '-shortcut', 'kbd')}
    </button>`;
  }

  _rowId() {
    if (!this._uid) this._uid = 'w-command-item-' + (++WCommandItem.count);
    return this._uid;
  }

  _describedBy(fields, id) {
    const parts = [
      fields.subtitle && id + '-subtitle',
      fields.snippet && id + '-snippet',
      fields.tag && id + '-tag',
      this._hasSlotted('append') && id + '-append',
      fields.shortcut && id + '-shortcut',
    ].filter(Boolean);
    return parts.length ? ` aria-describedby="${parts.join(' ')}"` : '';
  }

  _leadingMarkup(fields) {
    if (fields.avatar) {
      return `<span class="w-command-item-avatar" aria-hidden="true"><w-avatar image="${this._esc(fields.avatar)}" size="small"></w-avatar></span>`;
    }
    return fields.icon ? `<span class="w-command-item-icon" aria-hidden="true">${this._esc(fields.icon)}</span>` : '';
  }

  _lineMarkup(text, className, id, tag = 'span') {
    if (!text) return '';
    return `<${tag} class="${className}" id="${id}">${this._esc(text)}</${tag}>`;
  }

  _slotMarkup(name, id) {
    if (!this._hasSlotted(name)) return '';
    return `<span class="w-command-item-${name}" id="${id}-${name}"><slot name="${name}"></slot></span>`;
  }

  // Slotted children sit on the host before the first render and inside this
  // item's own <slot> after it; nested items keep theirs.
  _hasSlotted(name) {
    const nodes = Array.from(this.querySelectorAll('[slot="' + name + '"]'));
    return nodes.some((node) => node.parentElement.closest(this.localName) === this);
  }

  _tagColor(value) {
    return this.constructor.tagColors.includes(value) ? value : 'primary';
  }
}

if (!customElements.get('w-command-item')) {
  customElements.define('w-command-item', WCommandItem);
}
