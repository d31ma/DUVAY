/* <w-resizable> - pane layout shell */

export class WResizable extends WElement {
  static attrs = ['direction'];

  get direction() { return this._attr('direction', 'horizontal'); }

  _template() {
    const vertical = this.direction === 'vertical';
    const panels = Array.from(this.querySelectorAll('w-resizable-panel'));
    const tracks = panels.map((panel) => {
      const min = panel.getAttribute('min') || '10rem';
      const size = panel.getAttribute('size') || '1fr';
      return `minmax(${this._esc(min)}, ${this._esc(size)})`;
    }).join(' ');
    const style = tracks ? `${vertical ? 'grid-template-rows' : 'grid-template-columns'}: ${tracks};` : '';
    return `<div class="w-resizable w-resizable--${vertical ? 'vertical' : 'horizontal'}" style="${style}"><slot></slot></div>`;
  }
}

if (!customElements.get('w-resizable')) {
  customElements.define('w-resizable', WResizable);
}
