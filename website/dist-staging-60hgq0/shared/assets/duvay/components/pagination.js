/* <w-pagination> — DuVay component module */

export class WPagination extends WElement {
  static attrs = ['page', 'length', 'disabled'];

  get page() { return parseInt(this._attr('page', '1'), 10) || 1; }
  set page(v) { this.setAttribute('page', String(v)); }
  get length() { return parseInt(this._attr('length', '1'), 10) || 1; }
  get disabled() { return this._bool('disabled'); }

  _template() {
    let html = '<nav class="w-pagination" aria-label="Pagination">';
    html += `<button class="w-page-item" type="button" data-page="${Math.max(1, this.page - 1)}"${this.page <= 1 || this.disabled ? ' disabled' : ''}>‹</button>`;
    for (let i = 1; i <= this.length; i++) {
      html += `<button class="w-page-item${i === this.page ? ' active' : ''}" type="button" data-page="${i}"${this.disabled ? ' disabled' : ''}>${i}</button>`;
    }
    html += `<button class="w-page-item" type="button" data-page="${Math.min(this.length, this.page + 1)}"${this.page >= this.length || this.disabled ? ' disabled' : ''}>›</button>`;
    html += '</nav>';
    return html;
  }

  _events() {
    this._qAll('[data-page]').forEach((button) => {
      button.addEventListener('click', () => {
        const page = Number(button.getAttribute('data-page'));
        if (!page || page === this.page) return;
        this.page = page;
        this._emit('w-change', { page });
      });
    });
  }
}

if (!customElements.get('w-pagination')) customElements.define('w-pagination', WPagination);
