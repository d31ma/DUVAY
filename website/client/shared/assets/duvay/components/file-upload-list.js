/* <w-file-upload-list> — the list of uploaded files.
 *
 * With no `files` / `items` it is a plain shell around authored
 * <w-file-upload-item> children. Given either attribute it renders the rows
 * itself and takes over selection, activation, and group expansion — the
 * <v-list> surface Vuetify's VFileUploadList inherits.
 *
 * Attributes:
 *   files / items - JSON array of file records or titles; an entry with a
 *                   `children` array becomes an expandable group
 *   show-size, clearable - forwarded to every generated row
 *   selectable    - rows can be selected (role="option" + aria-selected)
 *   activatable   - rows can be activated without implying form selection
 *   multiple      - more than one row at a time
 *   mandatory     - never give up the last chosen row
 *   selected / activated - chosen values (JSON array or CSV)
 *   opened        - values of the expanded groups
 *   select-strategy  - single-leaf | leaf | independent | single-independent |
 *                      classic | trunk | branch
 *   active-strategy  - single-independent | independent | leaf | single-leaf
 *   open-strategy    - multiple | single | list
 *   return-object    - `change` reports the item records instead of the values
 *   items-registration - `props` skips rendering the rows of a collapsed group
 *   expand-icon / collapse-icon - group expander icons
 *   navigation-strategy - focus (default) moves DOM focus; track keeps focus
 *                         outside and drives aria-activedescendant instead
 *   navigation-index - the row highlighted under `track`
 *   filterable    - hand the [space] key back to an external text input
 *   nav, slim, lines, variant, active-class, prepend-gap, indent - presentation
 *
 * Events:
 *   change - selection, activation, or expansion changed
 *            (detail: { value, name, id })
 */
import { wCssLength, wIconHtml } from './file-input.js';
import { wParseRecords, wValueList } from './utils.js';
import './file-upload-item.js';

let listUid = 0;

export class WFileUploadList extends WElement {
  static attrs = [
    'files', 'items', 'show-size', 'clearable', 'nav', 'slim', 'lines', 'variant',
    'active-class', 'activatable', 'selectable', 'multiple', 'mandatory',
    'selected', 'activated', 'opened', 'return-object', 'filterable',
    'expand-icon', 'collapse-icon', 'prepend-gap', 'indent',
    'navigation-strategy', 'navigation-index', 'items-registration',
    'active-strategy', 'select-strategy', 'open-strategy', 'icon-set',
  ];

  // Strategies that push a group's choice down onto its children.
  static cascading = ['classic', 'trunk', 'branch'];
  static arrowKeys = { ArrowDown: 1, ArrowUp: -1 };

  get selectable() { return this._bool('selectable'); }
  get activatable() { return this._bool('activatable'); }
  get multiple() { return this._bool('multiple'); }
  get lines() { return this._attr('lines', ''); }
  get variant() { return this._attr('variant', ''); }

  // `track` keeps DOM focus outside the list and moves a visual highlight.
  get _track() { return this._attr('navigation-strategy', 'focus') === 'track'; }
  get _navigationIndex() { return parseInt(this._attr('navigation-index', '0'), 10) || 0; }
  get _skipCollapsed() { return this._attr('items-registration', 'render') === 'props'; }
  get _uid() { return this.__uid || (this.__uid = `w-fu-list-${++listUid}`); }
  get _generated() { return this.hasAttribute('files') || this.hasAttribute('items'); }

  _token(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  }

  /* ── Items ─────────────────────────────────────────────────────────────── */

  _entries() {
    const raw = this._attr('files', null) ?? this._attr('items', '');
    return wParseRecords(raw).map((record, index) => this._entry(record, index));
  }

  _plainEntry(record, index) {
    const text = String(record ?? '');
    return { title: text, value: text, index, file: null, children: [], record };
  }

  _entry(record, index) {
    if (!record || typeof record !== 'object') return this._plainEntry(record, index);
    const title = String(record.title ?? record.name ?? '');
    const children = Array.isArray(record.children) ? record.children : [];
    return {
      title,
      index,
      record,
      value: String(record.value ?? title),
      file: record.name ? record : null,
      children: children.map((child, i) => this._entry(child, i)),
    };
  }

  _flat(entries) {
    return (entries || this._entries()).flatMap((entry) => [entry, ...this._flat(entry.children)]);
  }

  _entryByValue(value) {
    return this._flat().find((entry) => entry.value === value) || null;
  }

  _entryFor(host) {
    return this._entryByValue(host.getAttribute('value') || '');
  }

  /* ── Template ──────────────────────────────────────────────────────────── */

  _classes() {
    return 'w-file-upload-list' + this._cls({
      'w-file-upload-list--nav': this._bool('nav'),
      'w-file-upload-list--slim': this._bool('slim'),
      [`w-file-upload-list--${this._token(this.lines)}-line`]: this.lines && this.lines !== 'one',
      [`w-file-upload-list--variant-${this._token(this.variant)}`]: this.variant,
    });
  }

  _style() {
    const props = [
      ['--w-file-upload-list-indent', wCssLength(this._attr('indent', ''))],
      ['--w-file-upload-list-prepend-gap', wCssLength(this._attr('prepend-gap', ''))],
    ].filter((pair) => pair[1]).map((pair) => `${pair[0]}:${pair[1]}`);
    return props.length ? ` style="${this._esc(props.join(';'))}"` : '';
  }

  _listAttrs() {
    return this._attrs({
      role: this.selectable || this.activatable ? 'listbox' : 'list',
      'aria-multiselectable': this.selectable && this.multiple ? 'true' : '',
      tabindex: this._track ? '0' : '',
    });
  }

  _itemMarkup(entry, depth) {
    const attrs = this._attrs({
      value: entry.value,
      title: entry.title,
      index: String(entry.index),
      file: entry.file ? JSON.stringify(entry.file) : '',
      'show-size': this._bool('show-size'),
      clearable: this._bool('clearable'),
      'active-class': this._attr('active-class', ''),
      nav: this._bool('nav'),
      slim: this._bool('slim'),
      lines: this._attr('lines', ''),
      variant: this._attr('variant', ''),
      'prepend-gap': this._attr('prepend-gap', ''),
      style: depth ? `--w-file-upload-item-depth:${depth}` : '',
    });
    return `<w-file-upload-item${attrs}></w-file-upload-item>`;
  }

  _groupIcon(open) {
    if (open) return wIconHtml(this, 'collapse-icon', 'w-file-upload-list-icon') || '▾';
    return wIconHtml(this, 'expand-icon', 'w-file-upload-list-icon') || '▸';
  }

  _groupMarkup(entry, depth) {
    const open = this._values('opened').includes(entry.value);
    const skip = !open && this._skipCollapsed;
    const children = skip ? '' : this._entriesMarkup(entry.children, depth + 1);
    return `<details class="w-file-upload-list-group" data-value="${this._esc(entry.value)}"${open ? ' open' : ''}>
        <summary class="w-file-upload-list-group-header">
          <span class="w-file-upload-list-group-icon" aria-hidden="true">${this._groupIcon(open)}</span>
          <span class="w-file-upload-list-group-title">${this._esc(entry.title)}</span>
        </summary>
        <div class="w-file-upload-list w-file-upload-list--nested">${children}</div>
      </details>`;
  }

  _entriesMarkup(entries, depth) {
    return entries.map((entry) => (
      entry.children.length ? this._groupMarkup(entry, depth) : this._itemMarkup(entry, depth)
    )).join('');
  }

  _template() {
    if (!this._generated) {
      return `<div class="${this._classes()}"${this._style()}><slot></slot></div>`;
    }
    const body = this._entriesMarkup(this._entries(), 0);
    return `<div class="${this._classes()}"${this._style()}${this._listAttrs()}>${body}</div>`;
  }

  /* ── Selection and activation ──────────────────────────────────────────── */

  _values(name) {
    const raw = this._attr(name, '');
    if (!raw) return [];
    return wValueList(raw).map(String);
  }

  _activeValues() {
    if (this.selectable) return this._values('selected');
    if (this.activatable) return this._values('activated');
    return [];
  }

  _strategy(name) {
    if (name === 'selected') return this._attr('select-strategy', 'single-leaf');
    return this._attr('active-strategy', 'single-independent');
  }

  // `leaf` strategies only let childless rows take part.
  _canChoose(strategy, entry) {
    return !strategy.includes('leaf') || !entry.children.length;
  }

  // classic / trunk / branch cascade a group's choice onto its children;
  // classic keeps only the leaves in the model, the others keep the parent too.
  _family(strategy, entry) {
    const children = entry.children.map((child) => child.value);
    if (!children.length || !WFileUploadList.cascading.includes(strategy)) return [entry.value];
    return strategy === 'classic' ? children : [entry.value, ...children];
  }

  // `single-…` strategies hold one value at a time; `mandatory` refuses to give
  // up the last one.
  _nextValues(current, family, strategy) {
    const chosen = family.every((value) => current.includes(value));
    if (!chosen) return strategy.startsWith('single') ? family : [...new Set([...current, ...family])];
    const next = current.filter((value) => !family.includes(value));
    return next.length || !this._bool('mandatory') ? next : current;
  }

  _detailValue(values) {
    if (!this._bool('return-object')) return values;
    const flat = this._flat();
    return values.map((value) => (flat.find((entry) => entry.value === value) || {}).record);
  }

  _choose(entry) {
    if (this.selectable) this._commit('selected', entry);
    else if (this.activatable) this._commit('activated', entry);
  }

  _commit(name, entry) {
    const strategy = this._strategy(name);
    if (!this._canChoose(strategy, entry)) return;
    const next = this._nextValues(this._values(name), this._family(strategy, entry), strategy);
    this._silentSet(name, JSON.stringify(next));
    this._syncState();
    this._emit('change', { value: this._detailValue(next), name, id: entry.value });
  }

  /* ── Groups ────────────────────────────────────────────────────────────── */

  _nextOpened(current, value, open, strategy) {
    if (!open) return current.filter((entry) => entry !== value);
    if (strategy === 'single' || strategy === 'list') return [value];
    return [...new Set([...current, value])];
  }

  _toggleGroup(group) {
    const value = group.getAttribute('data-value') || '';
    const strategy = this._attr('open-strategy', 'multiple');
    const next = this._nextOpened(this._values('opened'), value, !group.open, strategy);
    this._silentSet('opened', JSON.stringify(next));
    this._refresh();
    this._emit('change', { value: next, name: 'opened' });
  }

  /* ── Behaviour ─────────────────────────────────────────────────────────── */

  _events() {
    const root = this._q('.w-file-upload-list');
    if (!root) return;
    root.addEventListener('click', (event) => this._onClick(event));
    root.addEventListener('keydown', (event) => this._onKeydown(event));
    this._guardRowEvents();
    // The generated rows render in their own microtask, so their state is
    // applied once they exist.
    queueMicrotask(() => this._syncState());
  }

  // A row's own `change` stops at the list — the list reports the selection.
  // Bound once on the host so it survives re-renders and stays ahead of any
  // listener a caller adds.
  _guardRowEvents() {
    if (this.__guarded) return;
    this.__guarded = true;
    this.addEventListener('change', (event) => {
      if (event.target !== this) event.stopImmediatePropagation();
    });
  }

  _onClick(event) {
    const summary = event.target.closest('summary.w-file-upload-list-group-header');
    if (summary && this.contains(summary)) {
      this._onGroupClick(event, summary.parentElement);
      return;
    }
    if (event.target.closest('.w-file-upload-item-remove')) return;
    this._chooseFrom(event.target);
  }

  // The expander icon always toggles. The rest of the header chooses the group
  // when the list is selectable or activatable, and toggles otherwise.
  _onGroupClick(event, group) {
    event.preventDefault();
    const onIcon = !!event.target.closest('.w-file-upload-list-group-icon');
    if (onIcon || !(this.selectable || this.activatable)) {
      this._toggleGroup(group);
      return;
    }
    const entry = this._entryByValue(group.getAttribute('data-value') || '');
    if (entry) this._choose(entry);
  }

  _chooseFrom(target) {
    const host = target.closest('w-file-upload-item');
    if (!host || !this.contains(host)) return;
    const entry = this._entryFor(host);
    if (entry) this._choose(entry);
  }

  _onKeydown(event) {
    // `filterable` hands [space] back to the text input that owns the list.
    if (event.key === ' ' && this._bool('filterable')) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this._chooseFrom(event.target);
      return;
    }
    const delta = WFileUploadList.arrowKeys[event.key];
    if (!delta || this._track) return;
    event.preventDefault();
    this._moveFocus(delta);
  }

  _controls() {
    return Array.from(this._qAll('w-file-upload-item .w-file-upload-item'));
  }

  _moveFocus(delta) {
    const controls = this._controls();
    if (!controls.length) return;
    const index = controls.indexOf(document.activeElement);
    const next = index === -1 ? 0 : (index + delta + controls.length) % controls.length;
    controls[next].focus();
  }

  _syncItem(host, values, choosable) {
    const value = host.getAttribute('value') || '';
    const active = values.includes(value);
    host.active = active;
    const control = host.querySelector('.w-file-upload-item');
    if (!control || !choosable) return;
    control.setAttribute('role', 'option');
    control.setAttribute('aria-selected', active ? 'true' : 'false');
  }

  _syncState() {
    if (!this._generated) return;
    const values = this._activeValues();
    const choosable = this.selectable || this.activatable;
    this._qAll('w-file-upload-item').forEach((host) => this._syncItem(host, values, choosable));
    this._syncNavigation();
  }

  _prepareControl(control, index, track) {
    if (!control.id) control.id = `${this._uid}-item-${index}`;
    control.setAttribute('tabindex', track ? '-1' : '0');
  }

  // Under `track` the list keeps focus and points at the highlighted row
  // instead; under `focus` the rows themselves are tab stops.
  _syncNavigation() {
    const track = this._track;
    const controls = this._controls();
    controls.forEach((control, i) => this._prepareControl(control, i, track));
    const root = this._q('.w-file-upload-list');
    if (!root || !track) return;
    const target = controls[this._navigationIndex];
    controls.forEach((control) => control.classList.toggle('w-file-upload-item--focused', control === target));
    if (target) root.setAttribute('aria-activedescendant', target.id);
  }

  _refresh() {
    this._render();
    this._events();
    this._applyCommonProps();
  }
}

if (!customElements.get('w-file-upload-list')) {
  customElements.define('w-file-upload-list', WFileUploadList);
}
