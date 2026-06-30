/* <w-context-menu> - right-click menu */

export class WContextMenu extends WElement {
  static attrs = ['open', 'label'];

  get open() { return this._bool('open'); }
  get label() { return this._attr('label', 'Context menu'); }

  disconnectedCallback() {
    if (this._wDocumentClick) document.removeEventListener('click', this._wDocumentClick);
    if (this._wDocumentKeydown) document.removeEventListener('keydown', this._wDocumentKeydown);
  }

  _template() {
    const x = Number.isFinite(this._menuX) ? this._menuX : 0;
    const y = Number.isFinite(this._menuY) ? this._menuY : 0;
    return `<div class="w-context-menu">
      <div class="w-context-menu-target"><slot></slot></div>
      <div class="w-menu-content w-context-menu-content${this.open ? ' open' : ''}" role="menu" aria-label="${this._esc(this.label)}" style="--w-menu-x: ${x}px; --w-menu-y: ${y}px;">
        <slot name="content"></slot>
      </div>
    </div>`;
  }

  _events() {
    const target = this._q('.w-context-menu-target');
    if (!target) return;
    target.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      this._setOpen(true, { x: event.clientX, y: event.clientY });
    });

    if (this._wDocumentClick) document.removeEventListener('click', this._wDocumentClick);
    this._wDocumentClick = (event) => {
      if (!this.contains(event.target) && this.open) this._setOpen(false);
    };
    document.addEventListener('click', this._wDocumentClick);

    if (this._wDocumentKeydown) document.removeEventListener('keydown', this._wDocumentKeydown);
    this._wDocumentKeydown = (event) => {
      if (event.key === 'Escape' && this.open) this._setOpen(false);
    };
    document.addEventListener('keydown', this._wDocumentKeydown);

    this._q('.w-context-menu-content')?.addEventListener('click', (event) => {
      const item = event.target.closest('button, a, [role="menuitem"]');
      if (item) this._setOpen(false);
    });
  }

  _setOpen(open, position) {
    if (position) {
      this._menuX = Math.max(0, position.x);
      this._menuY = Math.max(0, position.y);
    }
    this._silentSet('open', open ? '' : null);
    this._render();
    this._events();
    if (open) this._clampToViewport();
    this._emit(open ? 'w-open' : 'w-close', {});
  }

  _clampToViewport() {
    const menu = this._q('.w-context-menu-content');
    if (!menu) return;
    const rect = menu.getBoundingClientRect();
    const margin = 8;
    const x = Math.max(margin, Math.min(this._menuX, window.innerWidth - rect.width - margin));
    const y = Math.max(margin, Math.min(this._menuY, window.innerHeight - rect.height - margin));
    menu.style.setProperty('--w-menu-x', `${x}px`);
    menu.style.setProperty('--w-menu-y', `${y}px`);
  }
}

if (!customElements.get('w-context-menu')) {
  customElements.define('w-context-menu', WContextMenu);
}
