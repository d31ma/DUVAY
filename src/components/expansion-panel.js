/* <w-expansion-panel> — Vuetify VExpansionPanel equivalent
 *
 * Attributes:
 *   header/title - text for the title button
 *   text         - generated body copy
 *   value        - group value
 *   open         - whether this item is expanded
 *   disabled     - disables the toggle
 *   readonly     - keeps the panel focusable but not toggleable
 *
 * Slots:
 *   default  - body content shown when expanded
 *   title/header - custom title content
 *   text     - text body content
 */

export class WExpansionPanel extends WElement {

  static attrs = [
    'header',
    'title',
    'text',
    'value',
    'open',
    'disabled',
    'readonly',
    'static',
    'hide-actions',
    'expand-icon',
    'collapse-icon',
    'color',
    'bg-color',
    'elevation',
    'rounded',
    'tile',
  ];

  get header() { return this._attr('title', this._attr('header', '')); }
  get panelText() { return this._attr('text', ''); }
  get value() { return this._attr('value', ''); }
  get open() { return this._bool('open'); }
  set open(v) { v ? this.setAttribute('open', '') : this.removeAttribute('open'); }
  get disabled() { return !!(this._bool('disabled') || this.closest('w-expansion-panels')?._bool?.('disabled')); }
  get readonly() { return !!(this._bool('readonly') || this.closest('w-expansion-panels')?._bool?.('readonly')); }
  get isStatic() { return this._bool('static'); }
  get hideActions() { return this._bool('hide-actions'); }

  _template() {
    const isOpen = this.open ? ' open' : '';
    const dis = this.disabled ? ' disabled' : '';
    const headerAttr = this.header;
    const bodyId = this._bodyId || (this._bodyId = 'w-expansion-panel-' + Math.random().toString(36).slice(2, 8));
    const icon = this.open ? this._attr('collapse-icon', '') : this._attr('expand-icon', '');
    const chevron = icon
      ? `<span class="w-expand-chevron" aria-hidden="true">${this._esc(icon)}</span>`
      : `<svg class="w-expand-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;
    const classes = [
      'w-expand',
      isOpen.trim(),
      this.disabled ? 'w-expand--disabled' : '',
      this.readonly ? 'w-expand--readonly' : '',
      this.isStatic ? 'w-expand--static' : '',
      this.hideActions ? 'w-expand--hide-actions' : '',
      this._bool('tile') ? 'w-expand--tile' : '',
    ].filter(Boolean).join(' ');

    let html = `<div class="${classes}">`;
    html += `<button class="w-expand-header${this.isStatic ? ' w-expand-header--static' : ''}"${dis} type="button" aria-expanded="${this.open ? 'true' : 'false'}" aria-controls="${bodyId}"${this.readonly ? ' aria-readonly="true"' : ''}>`;
    html += `<span class="w-expand-title">`;
    if (headerAttr) html += this._esc(headerAttr);
    html += `<slot name="title"></slot>`;
    html += `<slot name="header"></slot>`;
    html += `</span>`;
    if (!this.hideActions) html += `<span class="w-expansion-panel-title__icon">${chevron}</span>`;
    html += `</button>`;
    html += `<div class="w-expand-body w-expansion-panel-text" id="${bodyId}" role="region">`;
    html += `<div class="w-expansion-panel-text__wrapper">`;
    if (this.panelText) html += `<p>${this._esc(this.panelText)}</p>`;
    html += `<slot name="text"></slot><slot></slot>`;
    html += `</div></div>`;
    html += `</div>`;
    return html;
  }

  _events() {
    const btn = this._q('.w-expand-header');
    if (!btn || this.disabled) return;

    btn.addEventListener('click', () => {
      if (this.readonly || this.isStatic) return;
      const newOpen = !this.open;
      this.setOpen(newOpen);

      const panels = this.closest('w-expansion-panels');
      if (panels) panels._onItemToggle(this);
    });
  }

  setOpen(open, silent) {
    const next = !!open;
    const btn = this._q('.w-expand-header');
    const wrap = this._q('.w-expand');
    this._silentSet('open', next);
    if (btn) btn.setAttribute('aria-expanded', String(next));

    const done = () => {
      if (!silent) this._dispatch('toggle', { open: next, value: this._groupValue() });
    };

    if (wrap && window.WMotion && typeof window.WMotion.setExpand === 'function') {
      window.WMotion.setExpand(wrap, next).then(done);
    } else {
      if (wrap) wrap.classList.toggle('open', next);
      done();
    }
  }

  _groupValue() {
    if (this.hasAttribute('value')) return this.getAttribute('value');
    const panels = this.closest('w-expansion-panels');
    if (!panels) return '';
    return String(Array.from(panels.querySelectorAll('w-expansion-panel')).indexOf(this));
  }

  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

}

if (!customElements.get('w-expansion-panel')) {
  customElements.define('w-expansion-panel', WExpansionPanel);
}
