/* <w-data-table-row> — Data table body row, mirroring Vuetify's <v-data-table-row>.
 *
 * Attributes:
 *   headers            - column labels (comma list or JSON array)
 *   item               - row data (JSON object/array, "a|b|c" pipe list, or [a,b,c])
 *   index              - zero-based row index; drives aria-rowindex / data-index
 *   active             - the row reads as selected
 *   show-select        - render a leading selection control
 *   select-row-label   - aria-label for that control (default "Select row")
 *   show-expand        - render a leading expand toggle
 *   expanded           - the expand toggle is open (reflected)
 *   expand-icon        - glyph shown while collapsed (default ▸)
 *   collapse-icon      - glyph shown while expanded (default ▾)
 *   mobile             - stack the cells, each labelled with its column
 *   mobile-breakpoint  - stack below this width: px number or xs|sm|md|lg|xl|xxl
 *
 * Events:
 *   update:selected  - { index, selected }
 *   update:expanded  - { index, expanded }
 */
import { wBoolAttr, wFields, wNumberAttr, wRecordValue, wValueList } from './utils.js';
import './grid.js';

/* Stacked-layout helpers, shared with <w-data-table-rows> and
   <w-data-table-headers> and matching <w-data-table>'s own breakpoint handling. */
const W_BREAKPOINTS = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 };

export function wMobileQuery(host) {
  const raw = host.getAttribute('mobile-breakpoint') || '';
  if (!raw) return '';
  const px = raw in W_BREAKPOINTS ? W_BREAKPOINTS[raw] : Number(raw);
  return Number.isFinite(px) && px > 0 ? `(max-width: ${px - 0.02}px)` : '';
}

/* Forced by `mobile`, or below `mobile-breakpoint`. */
export function wMobileMode(host) {
  if (wBoolAttr(host, 'mobile')) return true;
  const query = wMobileQuery(host);
  return !!query && typeof matchMedia === 'function' && matchMedia(query).matches;
}

/* Re-render when the viewport crosses the breakpoint. Bound once per host. */
export function wWatchMobile(host) {
  const query = wMobileQuery(host);
  if (!query || host._wMobileBound === query || typeof matchMedia !== 'function') return;
  host._wMobileBound = query;
  matchMedia(query).addEventListener('change', () => host._rerender());
}

export class WDataTableRow extends WElement {
  static attrs = ['headers', 'item', 'active', 'index', 'show-select', 'select-row-label',
    'show-expand', 'expanded', 'expand-icon', 'collapse-icon', 'mobile', 'mobile-breakpoint'];

  get headers() { return wValueList(this._attr('headers', '')); }
  get item() {
    const raw = this._attr('item', '');
    if (!raw) return [];
    if (raw.trim().startsWith('[')) {
      try { return JSON.parse(raw); } catch {
        const text = raw.trim();
        return text.endsWith(']') ? wFields(text.slice(1, -1).replaceAll(',', '|')) : [];
      }
    }
    if (raw.trim().startsWith('{')) {
      try { return JSON.parse(raw); } catch { return {}; }
    }
    return wFields(raw);
  }
  get active() { return this._bool('active'); }
  // getAttribute() returns null when absent, and Number(null) is 0, so the
  // presence check is what actually keeps an unset index out of the markup.
  get index() { return this.hasAttribute('index') ? wNumberAttr(this, 'index', -1) : -1; }
  get expanded() { return this._bool('expanded'); }
  get showSelect() { return this._bool('show-select'); }
  get showExpand() { return this._bool('show-expand'); }
  get selectRowLabel() { return this._attr('select-row-label', 'Select row'); }
  get expandIcon() { return this._attr('expand-icon', '▸'); }
  get collapseIcon() { return this._attr('collapse-icon', '▾'); }
  get mobile() { return wMobileMode(this); }

  _template() {
    const rowAttrs = this._rowAttrs();
    if (!this.headers.length) return `<w-row no-gutters${rowAttrs}><slot></slot></w-row>`;
    const cols = Math.max(1, Math.floor(12 / this.headers.length));
    return `<w-row no-gutters${rowAttrs}>${this._leadHtml()}`
      + this.headers.map((header, index) => this._cellHtml(header, index, cols)).join('')
      + `</w-row>`;
  }

  _rowAttrs() {
    const classes = this._cls({ selected: this.active, 'w-data-table-row--mobile': this.mobile }).trim();
    return ` class="${classes}"` + this._attrs({
      'aria-rowindex': this.index >= 0 ? String(this.index + 1) : '',
      'data-index': this.index >= 0 ? String(this.index) : '',
    });
  }

  _cellHtml(header, index, cols) {
    const label = this._attrs({ 'data-label': this.mobile ? header : '' });
    return `<w-col cols="${cols}" role="cell"${label}>${this._esc(wRecordValue(this.item, header, index))}</w-col>`;
  }

  _leadHtml() {
    let lead = '';
    if (this.showSelect) {
      lead += `<w-col cols="1" class="w-table-select"><input type="checkbox" data-select`
        + `${this.active ? ' checked' : ''} aria-label="${this._esc(this.selectRowLabel)}"></w-col>`;
    }
    if (this.showExpand) {
      lead += `<w-col cols="1" class="w-table-expand"><button class="w-table-expand-btn" type="button"`
        + ` data-expand aria-expanded="${this.expanded}" aria-label="Toggle details">`
        + `${this._esc(this.expanded ? this.collapseIcon : this.expandIcon)}</button></w-col>`;
    }
    return lead;
  }

  _events() {
    wWatchMobile(this);
    this._q('[data-select]')?.addEventListener('change', (event) => {
      event.stopPropagation();
      this._setSelected(event.target.checked);
    });
    this._q('[data-expand]')?.addEventListener('click', () => this._toggleExpand());
  }

  _rerender() { this._render(); this._events(); }

  _setSelected(selected) {
    this._silentSet('active', selected);
    this._q('w-row')?.classList.toggle('selected', selected);
    this._emit('update:selected', { index: this.index, selected });
  }

  _toggleExpand() {
    const expanded = !this.expanded;
    this._silentSet('expanded', expanded);
    this._rerender();
    this._emit('update:expanded', { index: this.index, expanded });
  }
}

if (!customElements.get('w-data-table-row')) {
  customElements.define('w-data-table-row', WDataTableRow);
}
