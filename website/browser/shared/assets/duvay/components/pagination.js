/* <w-pagination> — Pagination web component
 *
 * Vuetify-parity attributes:
 *   page, length, disabled, total-visible, start
 *   show-first-last-page, first-icon, last-icon, prev-icon, next-icon
 *   color, active-color, variant, rounded, size, density, border
 *   ellipsis
 *
 * Events:
 *   change               — { page }
 *   update:modelValue    — { page } (Vuetify-style colon alias also fires update-modelValue)
 *   first, prev, next, last — { page }
 *
 * A11y:
 *   <nav aria-label="Pagination">, buttons with aria-label, aria-current="page" on active.
 */

class WPagination extends WElement {
  static attrs = [
    'page',
    'length',
    'disabled',
    'total-visible',
    'start',
    'show-first-last-page',
    'first-icon',
    'last-icon',
    'prev-icon',
    'next-icon',
    'color',
    'active-color',
    'variant',
    'rounded',
    'size',
    'density',
    'border',
    'ellipsis',
  ];

  get page()  { return parseInt(this._attr('page', String(this.start)), 10) || this.start; }
  set page(v) { this.setAttribute('page', String(v)); }

  get length() { return parseInt(this._attr('length', '1'), 10) || 1; }
  get disabled() { return this._bool('disabled'); }
  get totalVisible() { return parseInt(this._attr('total-visible', '0'), 10) || 0; }
  get start() { return parseInt(this._attr('start', '1'), 10) || 1; }
  get showFirstLastPage() { return this._bool('show-first-last-page'); }

  get firstIcon() { return this._attr('first-icon', '«'); } // «
  get lastIcon()  { return this._attr('last-icon', '»'); }  // »
  get prevIcon()  { return this._attr('prev-icon', '‹'); } // ‹
  get nextIcon()  { return this._attr('next-icon', '›'); } // ›

  get color()       { return this._attr('color', ''); }
  get activeColor() { return this._attr('active-color', ''); }
  get variant()     { return this._attr('variant', 'text'); }
  get rounded()     { return this._attr('rounded', ''); }
  get size()        { return this._attr('size', ''); }
  get density()     { return this._attr('density', ''); }
  get border()      { return this._bool('border'); }
  get ellipsis()    { return this._attr('ellipsis', '…'); } // …

  /* ── Truncation logic (Vuetify parity) ─────────────────────────────────── */
  _range() {
    const length = this.length;
    const start = this.start;
    const page = this.page;
    const max = this.totalVisible;

    if (!max || length <= max) {
      const pages = [];
      for (let i = 0; i < length; i++) pages.push(start + i);
      return pages;
    }

    const even = max % 2 === 0;
    const middle = even ? max / 2 : Math.floor(max / 2);
    const left = even ? middle : middle + 1;
    const right = length - middle;

    const pages = [];

    if (left - (page - start) >= 0) {
      // Near start
      for (let i = 0; i < max - 1; i++) pages.push(start + i);
      pages.push('ellipsis');
      pages.push(start + length - 1);
    } else if ((page - start) - right >= (even ? 1 : 0)) {
      // Near end
      pages.push(start);
      pages.push('ellipsis');
      for (let i = 0; i < max - 1; i++) pages.push(start + length - (max - 1) + i);
    } else {
      // Middle
      pages.push(start);
      pages.push('ellipsis');
      const rangeStart = page - middle + 1;
      for (let i = 0; i < max - 2; i++) pages.push(rangeStart + i);
      pages.push('ellipsis');
      pages.push(start + length - 1);
    }

    return pages;
  }

  /* ── Template ──────────────────────────────────────────────────────────── */
  _template() {
    const length = this.length;
    const start = this.start;
    const page = this.page;
    const disabled = this.disabled;
    const range = this._range();

    const rootClasses = [
      'w-pagination',
      this.size ? 'w-pagination--' + this._size() : '',
      this.density ? 'w-pagination--density-' + this.density : '',
      this.rounded ? 'w-pagination--rounded' : '',
      this.border ? 'w-pagination--border' : '',
    ].filter(Boolean).join(' ');

    let html = `<nav class="${rootClasses}" aria-label="Pagination">`;

    // First
    if (this.showFirstLastPage) {
      html += this._btnTemplate({
        pageVal: start,
        label: this.firstIcon,
        ariaLabel: 'First page',
        disabled: disabled || page <= start,
        isNav: true,
      });
    }

    // Previous
    html += this._btnTemplate({
      pageVal: Math.max(start, page - 1),
      label: this.prevIcon,
      ariaLabel: 'Previous page',
      disabled: disabled || page <= start,
      isNav: true,
    });

    // Page numbers / ellipsis
    for (const item of range) {
      if (item === 'ellipsis') {
        html += `<span class="w-page-ellipsis" aria-hidden="true">${this._esc(this.ellipsis)}</span>`;
      } else {
        const isActive = item === page;
        html += this._btnTemplate({
          pageVal: item,
          label: String(item),
          ariaLabel: isActive ? `Current page, page ${item}` : `Go to page ${item}`,
          disabled: disabled,
          isActive: isActive,
        });
      }
    }

    // Next
    html += this._btnTemplate({
      pageVal: Math.min(start + length - 1, page + 1),
      label: this.nextIcon,
      ariaLabel: 'Next page',
      disabled: disabled || page >= start + length - 1,
      isNav: true,
    });

    // Last
    if (this.showFirstLastPage) {
      html += this._btnTemplate({
        pageVal: start + length - 1,
        label: this.lastIcon,
        ariaLabel: 'Last page',
        disabled: disabled || page >= start + length - 1,
        isNav: true,
      });
    }

    html += '</nav>';
    return html;
  }

  _btnTemplate({ pageVal, label, ariaLabel, disabled, isActive, isNav }) {
    const classes = ['w-page-item'];

    if (isActive) classes.push('active');
    if (isNav) classes.push('w-page-nav');

    const variant = this.variant;
    if (variant && variant !== 'text') classes.push('w-page-item--' + variant);

    const color = this.color;
    if (color) classes.push('w-page-item--color-' + this._normalizeColor(color));

    if (isActive) {
      const activeColor = this.activeColor;
      if (activeColor) classes.push('w-page-item--active-color-' + this._normalizeColor(activeColor));
      else if (color) classes.push('w-page-item--active-color-' + this._normalizeColor(color));
    }

    const rounded = this.rounded;
    if (rounded) {
      if (rounded === 'circle' || rounded === 'pill') classes.push('w-page-item--pill');
      else classes.push('w-page-item--rounded');
    }

    const size = this._size();
    if (size && size !== 'default') classes.push('w-page-item--' + size);

    const density = this.density;
    if (density) classes.push('w-page-item--density-' + density);

    if (this.border) classes.push('w-page-item--border');
    if (disabled) classes.push('w-page-item--disabled');

    const cls = classes.join(' ');
    const dis = disabled ? ' disabled' : '';
    const current = isActive ? ' aria-current="page"' : '';
    const aria = ` aria-label="${this._esc(ariaLabel)}"`;

    return `<button class="${cls}" type="button" data-page="${pageVal}"${dis}${current}${aria}>${this._esc(label)}</button>`;
  }

  _size() {
    const aliases = { xs: 'x-small', sm: 'small', md: 'default', lg: 'large', xl: 'x-large' };
    const size = aliases[this.size] || this.size;
    const valid = ['x-small', 'small', 'default', 'large', 'x-large'];
    return valid.includes(size) ? size : 'default';
  }

  _normalizeColor(value) {
    const token = String(value || '').toLowerCase();
    if (!token) return '';
    if (token === 'danger') return 'error';
    if (token === 'info') return 'primary';
    const valid = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error'];
    return valid.includes(token) ? token : 'primary';
  }

  /* ── Events ───────────────────────────────────────────────────────────── */
  _events() {
    const buttons = this._qAll('[data-page]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const pageVal = Number(btn.getAttribute('data-page'));
        if (!pageVal || pageVal === this.page) return;

        const oldPage = this.page;
        this.page = pageVal;

        this._emit('change', { page: pageVal });
        this._emit('update:modelValue', { page: pageVal });

        if (pageVal === this.start) this._emit('first', { page: pageVal });
        else if (pageVal === this.start + this.length - 1) this._emit('last', { page: pageVal });
        else if (pageVal < oldPage) this._emit('prev', { page: pageVal });
        else if (pageVal > oldPage) this._emit('next', { page: pageVal });
      });
    });
  }
}

if (!customElements.get('w-pagination')) {
  customElements.define('w-pagination', WPagination);
}
