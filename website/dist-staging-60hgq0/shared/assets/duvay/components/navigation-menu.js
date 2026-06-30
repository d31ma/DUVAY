/* <w-navigation-menu> - horizontal navigation */

export class WNavigationMenu extends WElement {
  static attrs = ['label', 'value', 'model-value'];

  get label() { return this._attr('label', 'Primary'); }
  get value() { return this._attr('value', this._attr('model-value', '')); }

  _template() {
    return `<nav class="w-navigation-menu" aria-label="${this._esc(this.label)}"><slot></slot></nav>`;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    const shouldSyncValue = !this._skipRender && oldVal !== newVal && (name === 'value' || name === 'model-value');
    super.attributeChangedCallback(name, oldVal, newVal);
    if (!shouldSyncValue) return;

    this._silentSet(name === 'value' ? 'model-value' : 'value', newVal);
    if (this._rendered) this._syncItems();
  }

  _events() {
    this._syncItems();
    this._items().forEach((item) => {
      if (item.__wNavigationMenu === this) return;
      item.__wNavigationMenu = this;
      item.addEventListener('click', (event) => {
        if (item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true') return;

        const value = this._itemValue(item);
        if (!value) return;

        this._setSelected(value);

        const href = item.getAttribute('href');
        if (!href || href === '#') event.preventDefault();
      });
    });
  }

  _items() {
    const nav = this._q('.w-navigation-menu') || this;
    const slot = nav.querySelector(':scope > slot');
    const children = slot ? Array.from(slot.children) : Array.from(nav.children);
    return children.filter((item) => item.nodeType === Node.ELEMENT_NODE);
  }

  _itemValue(item) {
    return item.getAttribute('value')
      || item.getAttribute('data-value')
      || item.getAttribute('href')
      || item.getAttribute('label')
      || item.textContent.trim();
  }

  _setSelected(value) {
    this._silentSet('value', value);
    this._silentSet('model-value', value);
    this._syncItems();
    this._emit('w-change', { value });
  }

  _syncItems() {
    let selected = this.value;
    if (!selected) {
      const activeItem = this._items().find((item) => item.hasAttribute('active') || item.classList.contains('active'));
      selected = activeItem ? this._itemValue(activeItem) : '';
      if (selected) {
        this._silentSet('value', selected);
        this._silentSet('model-value', selected);
      }
    }

    this._items().forEach((item) => {
      const active = !!selected && this._itemValue(item) === selected;
      item.classList.toggle('active', active);
      item.toggleAttribute('active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
  }
}

if (!customElements.get('w-navigation-menu')) {
  customElements.define('w-navigation-menu', WNavigationMenu);
}
