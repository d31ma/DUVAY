/* <w-treeview> — Hierarchical tree web component (DuVay equivalent of Vuetify v-treeview)
 *
 * Attributes:
 *   items           - JSON array of nodes, or a semicolon-list of `A>B>C` paths
 *   item-title      - node object key for the label (default: title)
 *   item-value      - node object key for the value (default: value)
 *   item-children   - node object key for nested children (default: children)
 *   activatable     - rows highlight + report an activated value
 *   activated       - activated value, or JSON array when multiple-active
 *   multiple-active - allow more than one activated row
 *   active-strategy - leaf | single-leaf | independent | single-independent
 *   active-class    - extra class applied to the active row
 *   mandatory       - never allow the last activated/selected value to be cleared
 *   selectable      - renders checkboxes and reports a selected array
 *   selected        - JSON array of selected values
 *   select-strategy - leaf (default) | independent | classic
 *   selected-color  - accent CSS color/var for the selection checkbox
 *   true-icon / false-icon / indeterminate-icon - checkbox glyph overrides
 *   opened          - JSON array of open node values
 *   open-all        - expand every branch
 *   open-on-click   - expand/collapse a branch by clicking its row
 *   return-object   - change events carry the source item instead of its key
 *   search          - filter rows by title (or by `filter-keys`)
 *   filter-keys     - comma/JSON list of item keys to search
 *   filter-mode     - some (default) | union | every | intersection
 *   no-filter       - disables all filtering
 *   no-data-text    - text rendered when the tree has no rows
 *   hide-no-data    - suppresses `no-data-text`
 *   filterable      - [space] is left to an external text input
 *   density         - compact | comfortable (omit for default)
 *   lines           - one | two | three row height
 *   slim            - tighter rows
 *   variant         - text | flat | elevated | tonal | outlined | plain
 *   hoverable       - rows highlight on hover
 *   rounded         - pill-rounded rows
 *   nav / fluid     - fluid removes the nested indentation
 *   indent          - nested indentation size (number = px)
 *   prepend-gap     - horizontal gap between the row adornments and the label
 *   indent-lines    - default | simple | false, draws guide lines
 *   indent-lines-color / indent-lines-opacity - guide line appearance
 *   separate-roots  - no guide lines between root-level branches
 *   hide-actions    - hide the expand toggle and loading indicator
 *   loading-icon    - glyph for a node whose item carries `loading: true`
 *   items-registration - render (default) | props, `props` skips collapsed rows
 *   navigation-strategy - focus (default) | track (virtual cursor, DOM focus stays put)
 *   navigation-index    - cursor position when navigation-strategy is `track`
 *   color           - accent CSS color/var for active + selected rows
 *   disabled        - disables activation and selection
 *   expand-icon / collapse-icon - override the branch toggle glyphs
 *
 * Slots:
 *   default - used only when no `items` attribute is supplied
 *
 * Events:
 *   change - fires when activated, selected, opened, or navigation-index changes
 */

const TREEVIEW_KEYS = {
  ArrowDown: '_keyNext',
  ArrowUp: '_keyPrevious',
  Home: '_keyFirst',
  End: '_keyLast',
  ArrowRight: '_keyExpand',
  ArrowLeft: '_keyCollapse',
  Enter: '_keyActivate',
  ' ': '_keyActivate',
};

const TREEVIEW_ACTIVE_STRATEGIES = ['leaf', 'single-leaf', 'independent', 'single-independent'];
const TREEVIEW_FILTER_MODES = ['some', 'every', 'union', 'intersection'];
const TREEVIEW_ALL_MODES = ['every', 'intersection'];

export class WTreeview extends WElement {

  static attrs = [
    'items', 'item-title', 'item-value', 'item-children',
    'activatable', 'activated', 'multiple-active', 'active-strategy', 'active-class', 'mandatory',
    'selectable', 'selected', 'select-strategy', 'selected-color',
    'true-icon', 'false-icon', 'indeterminate-icon',
    'opened', 'open-all', 'open-on-click', 'return-object',
    'search', 'filter-keys', 'filter-mode', 'no-filter', 'no-data-text', 'hide-no-data', 'filterable',
    'density', 'lines', 'slim', 'variant', 'hoverable', 'rounded', 'color', 'disabled',
    'fluid', 'indent', 'prepend-gap',
    'indent-lines', 'indent-lines-color', 'indent-lines-opacity', 'separate-roots',
    'hide-actions', 'loading-icon', 'items-registration',
    'navigation-strategy', 'navigation-index',
    'expand-icon', 'collapse-icon',
  ];

  static seq = 0;

  get itemsAttr() { return this._attr('items', ''); }
  get itemTitleKey() { return this._attr('item-title', 'title'); }
  get itemValueKey() { return this._attr('item-value', 'value'); }
  get itemChildrenKey() { return this._attr('item-children', 'children'); }
  get activatable() { return this._bool('activatable'); }
  get multipleActive() { return this._bool('multiple-active'); }
  get mandatory() { return this._bool('mandatory'); }
  get activeClass() { return this._attr('active-class', ''); }
  get selectable() { return this._bool('selectable'); }
  get selectStrategy() {
    const value = this._attr('select-strategy', 'leaf');
    return ['leaf', 'independent', 'classic'].includes(value) ? value : 'leaf';
  }

  get activeStrategy() {
    const value = this._attr('active-strategy', '');
    return TREEVIEW_ACTIVE_STRATEGIES.includes(value) ? value : '';
  }

  get openAll() { return this._bool('open-all'); }
  get openOnClick() { return this._bool('open-on-click'); }
  get returnObject() { return this._bool('return-object'); }
  get density() { return this._attr('density', ''); }
  get lines() { return this._attr('lines', ''); }
  get slim() { return this._bool('slim'); }
  get variant() { return this._attr('variant', ''); }
  get fluid() { return this._bool('fluid'); }
  get separateRoots() { return this._bool('separate-roots'); }
  get hideActions() { return this._bool('hide-actions'); }
  get filterable() { return this._bool('filterable'); }
  get noFilter() { return this._bool('no-filter'); }
  get hoverable() { return this._bool('hoverable'); }
  get rounded() { return this._bool('rounded'); }
  get disabled() { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get expandIcon() { return this._attr('expand-icon', '›'); }
  get loadingIcon() { return this._attr('loading-icon', '⟳'); }
  get search() { return this._attr('search', ''); }
  get filterKeys() { return this._readValues(this._attr('filter-keys', '')); }

  get filterMode() {
    const value = this._attr('filter-mode', 'some');
    return TREEVIEW_FILTER_MODES.includes(value) ? value : 'some';
  }

  // `props` registration keeps collapsed branches out of the DOM entirely.
  get skipCollapsed() { return this._attr('items-registration', 'render') === 'props'; }

  // `track` keeps DOM focus wherever it is and moves a virtual cursor instead.
  get trackMode() { return this._attr('navigation-strategy', 'focus') === 'track'; }
  get navigationIndex() {
    const value = Math.trunc(Number(this._attr('navigation-index', 0)));
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  get indentLines() {
    if (!this.hasAttribute('indent-lines')) return '';
    const value = this.getAttribute('indent-lines');
    if (value === 'false') return '';
    return value === 'simple' ? 'simple' : 'default';
  }

  get openedValues() { return this._readValues(this._attr('opened', '')); }
  get selectedValues() { return this._readValues(this._attr('selected', '')); }
  get activatedValues() { return this._readValues(this._attr('activated', '')); }

  _template() {
    this._tree = this._applyFilter(this._parseItems(this.itemsAttr));
    if (!this._tree.length) return this._emptyHtml();

    const ctx = {
      opened: new Set(this.openedValues),
      selected: new Set(this.selectedValues),
      activated: new Set(this.activatedValues),
    };
    const attrs = this.trackMode ? ' tabindex="0"' : '';
    return `<div class="${this._treeClasses()}" role="tree"${attrs}${this._styleAttr()}>`
      + `${this._treeHtml(this._tree, ctx, 1)}</div>`;
  }

  _emptyHtml() {
    const text = this._attr('no-data-text', '');
    const body = text && !this._bool('hide-no-data')
      ? `<div class="w-treeview-no-data" role="status">${this._esc(text)}</div>`
      : '';
    return `<div class="${this._treeClasses()}" role="tree">${body}<slot></slot></div>`;
  }

  _treeClasses() {
    return 'w-treeview' + this._cls({
      ['w-treeview--' + this.density]: this.density,
      ['w-treeview--variant-' + this._classToken(this.variant)]: this.variant,
      ['w-treeview--' + this.lines + '-line']: this.lines && this.lines !== 'one',
      ['w-treeview--indent-lines-' + this.indentLines]: this.indentLines,
      'w-treeview--indent-lines': this.indentLines,
      'w-treeview--hoverable': this.hoverable,
      'w-treeview--rounded': this.rounded,
      'w-treeview--selectable': this.selectable,
      'w-treeview--activatable': this.activatable,
      'w-treeview--disabled': this.disabled,
      'w-treeview--slim': this.slim,
      'w-treeview--fluid': this.fluid,
      'w-treeview--separate-roots': this.separateRoots,
      'w-treeview--track': this.trackMode,
    });
  }

  // Every knob that is a pure CSS value rides in on a custom property.
  _styleAttr() {
    const vars = [
      ['--w-treeview-accent', this._attr('color', '')],
      ['--w-treeview-selected', this._attr('selected-color', '')],
      ['--w-treeview-indent', this._size(this._attr('indent', ''))],
      ['--w-treeview-prepend-gap', this._size(this._attr('prepend-gap', ''))],
      ['--w-treeview-line-color', this._attr('indent-lines-color', '')],
      ['--w-treeview-line-opacity', this._attr('indent-lines-opacity', '')],
    ].filter((entry) => entry[1]);
    if (!vars.length) return '';
    return ` style="${vars.map(([name, value]) => `${name}: ${this._esc(value)}`).join('; ')}"`;
  }

  _size(value) {
    if (!value) return '';
    return /^-?\d+(\.\d+)?$/.test(String(value)) ? String(value) + 'px' : String(value);
  }

  /* ── Markup ───────────────────────────────────────────────────────────── */
  _treeHtml(nodes, ctx, level) {
    const groupRole = level === 1 ? ' role="presentation"' : ' role="group"';
    const rows = nodes.map((node) => this._nodeHtml(node, ctx, level)).join('');
    return `<ul class="w-treeview-list"${groupRole}>${rows}</ul>`;
  }

  _nodeHtml(node, ctx, level) {
    const open = this._isOpen(node, ctx.opened);
    const active = ctx.activated.has(node.value);
    const hasChildren = node.children.length > 0;
    const render = hasChildren && (open || !this.skipCollapsed);
    return `<li class="w-treeview-node${open ? ' open' : ''}" role="treeitem"`
      + ` data-value="${this._esc(node.value)}" aria-level="${level}"`
      + `${hasChildren ? ` aria-expanded="${open}"` : ''}${this._selectedAttr(node, ctx, active)}>`
      + this._rowHtml(node, ctx, active, hasChildren)
      + (render ? this._treeHtml(node.children, ctx, level + 1) : '')
      + '</li>';
  }

  _isOpen(node, opened) {
    return this.openAll || this._filtering || opened.has(node.value);
  }

  _selectedAttr(node, ctx, active) {
    if (!this.selectable) return active ? ' aria-selected="true"' : '';
    return ` aria-selected="${this._nodeState(node, ctx.selected) === 'true'}"`;
  }

  _rowHtml(node, ctx, active, hasChildren) {
    const disabled = node.disabled ? ' aria-disabled="true"' : '';
    return `<div class="${this._rowClass(active)}"${disabled} tabindex="-1">`
      + this._toggleHtml(node, hasChildren)
      + this._checkboxHtml(node, ctx.selected)
      + `<span class="w-treeview-label">${this._esc(node.title)}</span>`
      + '</div>';
  }

  _rowClass(active) {
    if (!active) return 'w-treeview-row';
    return 'w-treeview-row active' + (this.activeClass ? ' ' + this._classList(this.activeClass) : '');
  }

  _toggleHtml(node, hasChildren) {
    if (this.hideActions) return '<span class="w-treeview-leaf" aria-hidden="true"></span>';
    if (node.loading) {
      return `<span class="w-treeview-loading" role="status" aria-label="Loading">${this._esc(this.loadingIcon)}</span>`;
    }
    if (!hasChildren) return '<span class="w-treeview-leaf" aria-hidden="true"></span>';
    return `<button class="w-treeview-toggle" type="button" tabindex="-1" aria-label="Toggle ${this._esc(node.title)}">${this._esc(this.expandIcon)}</button>`;
  }

  _checkboxHtml(node, selected) {
    if (!this.selectable) return '';
    const state = this._nodeState(node, selected);
    return `<span class="w-treeview-checkbox" role="checkbox" tabindex="-1" aria-checked="${state}">`
      + `${this._esc(this._stateIcon(state))}</span>`;
  }

  _stateIcon(state) {
    if (state === 'true') return this._attr('true-icon', '');
    if (state === 'mixed') return this._attr('indeterminate-icon', '');
    return this._attr('false-icon', '');
  }

  /* ── Filtering ────────────────────────────────────────────────────────── */
  _applyFilter(nodes) {
    const needle = this.noFilter ? '' : String(this.search || '').trim().toLowerCase();
    this._filtering = !!needle;
    if (!needle) return nodes;
    return nodes.map((node) => this._filterNode(node, needle)).filter(Boolean);
  }

  // A hit keeps the whole branch; a miss survives only through matching children.
  _filterNode(node, needle) {
    if (this._matches(node, needle)) return node;
    const kids = node.children.map((child) => this._filterNode(child, needle)).filter(Boolean);
    return kids.length ? { ...node, children: kids } : null;
  }

  _matches(node, needle) {
    const keys = this.filterKeys;
    if (!keys.length) return String(node.title).toLowerCase().includes(needle);
    const hits = keys.map((key) => this._fieldHit(node, key, needle));
    return TREEVIEW_ALL_MODES.includes(this.filterMode) ? hits.every(Boolean) : hits.some(Boolean);
  }

  _fieldHit(node, key, needle) {
    const source = node.raw && typeof node.raw === 'object' ? node.raw : null;
    const raw = source ? source[key] : null;
    const value = raw ?? (key === this.itemTitleKey ? node.title : '');
    return String(value ?? '').toLowerCase().includes(needle);
  }

  _events() {
    const tree = this._q('.w-treeview');
    if (!tree || !this._tree || !this._tree.length) return;

    // Stop nested treeviews from double-handling a bubbled change.
    if (!this._changeGuard) {
      this._changeGuard = true;
      this.addEventListener('change', (event) => {
        if (event.target !== this) event.stopImmediatePropagation();
      });
    }

    tree.addEventListener('click', (event) => this._onClick(event, tree));

    tree.addEventListener('keydown', (event) => this._onKeydown(event, tree));
    this._roveTabIndex(tree);
  }

  _clickedRow(event, tree) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return null;
    const li = target.closest('.w-treeview-node');
    if (!li || !tree.contains(li)) return null;
    const node = this._nodeByValue(li.getAttribute('data-value'));
    return node ? { target, li, node } : null;
  }

  _onClick(event, tree) {
    const row = this._clickedRow(event, tree);
    if (!row) return;
    const { target, li, node } = row;

    if (target.closest('.w-treeview-toggle')) { this._toggleOpen(li, node); return; }
    if (this.disabled || node.disabled) return;
    if (target.closest('.w-treeview-checkbox')) { this._toggleSelect(node); return; }

    if (this.openOnClick && node.children.length) this._toggleOpen(li, node);
    if (this.activatable && this._canActivate(node)) this._activate(node);
  }

  /* ── Open / collapse ──────────────────────────────────────────────────── */
  _toggleOpen(li, node) {
    const open = !li.classList.contains('open');
    li.classList.toggle('open', open);
    li.setAttribute('aria-expanded', String(open));
    const next = new Set(this.openedValues);
    if (open) next.add(node.value); else next.delete(node.value);
    const opened = Array.from(next);
    this._silentSet('opened', JSON.stringify(opened));
    if (this.skipCollapsed) this._refresh(node);
    this._emit('change', { value: this._outList(opened), name: 'opened' });
  }

  // `items-registration="props"` mounts/unmounts branches, so the row markup has
  // to be rebuilt; focus is restored onto the row the user was standing on.
  _refresh(node) {
    const hadFocus = this.contains(document.activeElement);
    this._render();
    this._events();
    if (!hadFocus) return;
    const row = this._rowFor(node.value);
    if (row) { this._roveTo(row); row.focus(); }
  }

  _rowFor(value) {
    const li = Array.from(this.querySelectorAll('.w-treeview-node'))
      .find((el) => el.getAttribute('data-value') === value);
    return li ? li.querySelector(':scope > .w-treeview-row') : null;
  }

  /* ── Activation ───────────────────────────────────────────────────────── */
  _multiActive() {
    const strategy = this.activeStrategy;
    if (strategy) return strategy === 'leaf' || strategy === 'independent';
    return this.multipleActive;
  }

  // The `leaf` strategies refuse to activate a branch row.
  _canActivate(node) {
    const strategy = this.activeStrategy;
    if (strategy !== 'leaf' && strategy !== 'single-leaf') return true;
    return node.children.length === 0;
  }

  _nextActivated(node) {
    const current = this.activatedValues;
    const next = this._multiActive()
      ? this._toggleArray(current, node.value)
      : (current.includes(node.value) ? [] : [node.value]);
    if (this.mandatory && !next.length) return null;
    return next;
  }

  _activate(node) {
    const activated = this._nextActivated(node);
    if (!activated) return;
    this._silentSet('activated', JSON.stringify(activated));
    this._syncActivated(new Set(activated));
    this._emit('change', {
      value: this._multiActive() ? this._outList(activated) : this._out(activated[0] || ''),
      name: 'activated',
      id: node.value,
    });
  }

  _syncActivated(activated) {
    const extra = this.activeClass ? this._classList(this.activeClass).split(' ') : [];
    this.querySelectorAll('.w-treeview-node').forEach((li) => {
      const on = activated.has(li.getAttribute('data-value'));
      const row = li.querySelector(':scope > .w-treeview-row');
      row.classList.toggle('active', on);
      extra.forEach((name) => row.classList.toggle(name, on));
      if (!this.selectable) li.setAttribute('aria-selected', String(on));
    });
  }

  /* ── Selection (with cascade + indeterminate) ─────────────────────────── */
  _nextSelected(node) {
    const selected = new Set(this.selectedValues);
    if (this.selectStrategy === 'independent') {
      selected.has(node.value) ? selected.delete(node.value) : selected.add(node.value);
      return selected;
    }
    const targets = this.selectStrategy === 'classic' ? this._descendants(node) : this._leaves(node);
    const allOn = targets.every((value) => selected.has(value));
    targets.forEach((value) => (allOn ? selected.delete(value) : selected.add(value)));
    if (this.selectStrategy === 'classic') this._normalizeClassic(this._tree, selected);
    return selected;
  }

  _toggleSelect(node) {
    const selected = this._nextSelected(node);
    if (this.mandatory && !selected.size) return;
    const list = Array.from(selected);
    this._silentSet('selected', JSON.stringify(list));
    this._syncSelected(selected);
    this._emit('change', { value: this._outList(list), name: 'selected', id: node.value });
  }

  _syncSelected(selected) {
    this.querySelectorAll('.w-treeview-node').forEach((li) => {
      const node = this._nodeByValue(li.getAttribute('data-value'));
      if (!node) return;
      const state = this._nodeState(node, selected);
      const box = li.querySelector(':scope > .w-treeview-row > .w-treeview-checkbox');
      if (box) {
        box.setAttribute('aria-checked', state);
        box.textContent = this._stateIcon(state);
      }
      li.setAttribute('aria-selected', String(state === 'true'));
    });
  }

  _nodeState(node, selected) {
    if (this.selectStrategy === 'independent') return selected.has(node.value) ? 'true' : 'false';
    const leaves = this._leaves(node);
    const on = leaves.filter((value) => selected.has(value)).length;
    if (on === 0) return 'false';
    return on === leaves.length ? 'true' : 'mixed';
  }

  _normalizeClassic(nodes, selected) {
    nodes.forEach((node) => {
      if (!node.children.length) return;
      this._normalizeClassic(node.children, selected);
      const allOn = node.children.every((child) => selected.has(child.value));
      allOn ? selected.add(node.value) : selected.delete(node.value);
    });
  }

  _leaves(node, out = []) {
    if (!node.children.length) out.push(node.value);
    else node.children.forEach((child) => this._leaves(child, out));
    return out;
  }

  _descendants(node, out = []) {
    out.push(node.value);
    node.children.forEach((child) => this._descendants(child, out));
    return out;
  }

  /* ── Emitted payloads ─────────────────────────────────────────────────── */
  _out(value) {
    if (!this.returnObject) return value;
    const node = this._nodeByValue(value);
    return node ? node.raw : value;
  }

  _outList(values) {
    return values.map((value) => this._out(value));
  }

  /* ── Keyboard navigation ──────────────────────────────────────────────── */
  _onKeydown(event, tree) {
    const action = TREEVIEW_KEYS[event.key];
    if (!action) return;
    const rows = this._visibleRows(tree);
    if (!rows.length) return;
    const li = this._focusedNode(rows);
    this[action](event, {
      tree,
      rows,
      index: this._cursorIndex(rows),
      li,
      node: li ? this._nodeByValue(li.getAttribute('data-value')) : null,
    });
  }

  _cursorIndex(rows) {
    if (this.trackMode) return Math.min(this.navigationIndex, rows.length - 1);
    return rows.indexOf(document.activeElement);
  }

  _focusedNode(rows) {
    if (this.trackMode) {
      const row = rows[this._cursorIndex(rows)];
      return row ? row.closest('.w-treeview-node') : null;
    }
    const active = document.activeElement;
    return active && active.closest ? active.closest('.w-treeview-node') : null;
  }

  _keyNext(event, { rows, index }) {
    event.preventDefault();
    this._focusRow(rows, index < 0 ? 0 : Math.min(index + 1, rows.length - 1));
  }

  _keyPrevious(event, { rows, index }) {
    event.preventDefault();
    this._focusRow(rows, index <= 0 ? 0 : index - 1);
  }

  _keyFirst(event, { rows }) {
    event.preventDefault();
    this._focusRow(rows, 0);
  }

  _keyLast(event, { rows }) {
    event.preventDefault();
    this._focusRow(rows, rows.length - 1);
  }

  _keyExpand(event, { tree, li, node }) {
    if (!li || !node || !node.children.length) return;
    event.preventDefault();
    if (!li.classList.contains('open')) { this._toggleOpen(li, node); return; }
    const rows = this._visibleRows(tree);
    this._focusRow(rows, rows.indexOf(li.querySelector(':scope > .w-treeview-row')) + 1);
  }

  _keyCollapse(event, { tree, li, node }) {
    if (!li || !node) return;
    event.preventDefault();
    if (li.classList.contains('open') && node.children.length) { this._toggleOpen(li, node); return; }
    const parent = li.parentElement ? li.parentElement.closest('.w-treeview-node') : null;
    if (!parent) return;
    const rows = this._visibleRows(tree);
    this._focusRow(rows, rows.indexOf(parent.querySelector(':scope > .w-treeview-row')));
  }

  _keyActivate(event, { li, node }) {
    if (!node || this.disabled || node.disabled) return;
    // `filterable` hands [space] back to the text input that owns the tree.
    if (event.key === ' ' && this.filterable) return;
    event.preventDefault();
    if (this.selectable) this._toggleSelect(node);
    else if (this.activatable && this._canActivate(node)) this._activate(node);
    else if (node.children.length) this._toggleOpen(li, node);
  }

  _visibleRows(tree) {
    return Array.from(tree.querySelectorAll('.w-treeview-row')).filter((row) =>
      row.offsetParent !== null || row.getClientRects().length > 0);
  }

  _focusRow(rows, index) {
    const bounded = Math.max(0, Math.min(index, rows.length - 1));
    const row = rows[bounded];
    if (!row) return;
    if (this.trackMode) { this._trackTo(bounded, row); return; }
    this._roveTo(row);
    row.focus();
  }

  // Track mode: the cursor is a class + aria-activedescendant, never DOM focus.
  _trackTo(index, row) {
    const tree = this._q('.w-treeview');
    this._clearTrack();
    row.classList.add('w-treeview-row--focused');
    if (tree) tree.setAttribute('aria-activedescendant', row.id);
    if (typeof row.scrollIntoView === 'function') row.scrollIntoView({ block: 'nearest' });
    this._silentSet('navigation-index', String(index));
    this._emit('change', { value: index, name: 'navigation-index' });
  }

  _clearTrack() {
    this.querySelectorAll('.w-treeview-row--focused')
      .forEach((el) => el.classList.remove('w-treeview-row--focused'));
  }

  _roveTabIndex(tree) {
    if (this.trackMode) { this._syncTrack(tree); return; }
    const first = tree.querySelector('.w-treeview-row');
    if (first) this._roveTo(first);
  }

  _syncTrack(tree) {
    const rows = this._visibleRows(tree);
    rows.forEach((row, index) => { row.id = `${this._uid()}-row-${index}`; });
    this._clearTrack();
    const row = rows[this._cursorIndex(rows)];
    if (!row) { tree.removeAttribute('aria-activedescendant'); return; }
    row.classList.add('w-treeview-row--focused');
    tree.setAttribute('aria-activedescendant', row.id);
  }

  _uid() {
    if (!this._wUid) {
      WTreeview.seq += 1;
      this._wUid = this.id || 'w-treeview-' + WTreeview.seq;
    }
    return this._wUid;
  }

  _roveTo(row) {
    this.querySelectorAll('.w-treeview-row').forEach((el) => el.setAttribute('tabindex', '-1'));
    row.setAttribute('tabindex', '0');
  }

  /* ── Parsing ──────────────────────────────────────────────────────────── */
  _nodeByValue(value) {
    if (value == null) return null;
    const walk = (nodes) => {
      for (const node of nodes) {
        if (node.value === value) return node;
        const found = walk(node.children);
        if (found) return found;
      }
      return null;
    };
    return walk(this._tree || []);
  }

  _parseItems(raw) {
    if (!raw) return [];
    const text = String(raw).trim();
    const parsed = this._parseStructuredValue(text);
    if (Array.isArray(parsed)) {
      // An array of path strings ("A>B>C") still builds a tree.
      if (parsed.length && parsed.every((item) => typeof item === 'string' && item.includes('>'))) {
        return this._fromPaths(parsed);
      }
      return parsed.map((item) => this._normalize(item)).filter(Boolean);
    }
    const list = text.replace(/^\[|\]$/g, '').split(text.includes(';') ? ';' : ',').map((part) => part.trim()).filter(Boolean);
    if (list.some((item) => item.includes('>'))) return this._fromPaths(list);
    return list.map((item) => this._normalize(item)).filter(Boolean);
  }

  _normalize(item) {
    if (item == null) return null;
    if (typeof item !== 'object') {
      const label = String(item).trim();
      return label ? this._node(label, label, [], item) : null;
    }
    const title = item[this.itemTitleKey] ?? item.title ?? '';
    const value = String(item[this.itemValueKey] ?? item.value ?? title);
    const rawChildren = item[this.itemChildrenKey] || item.children || [];
    const children = Array.isArray(rawChildren) ? rawChildren.map((child) => this._normalize(child)).filter(Boolean) : [];
    return this._node(String(title), value, children, item);
  }

  // `raw` is what `return-object` hands back; `loading` drives the busy glyph.
  _node(title, value, children, raw) {
    const source = raw && typeof raw === 'object' ? raw : null;
    return {
      title,
      value,
      children,
      raw: raw === undefined ? null : raw,
      disabled: !!(source && source.disabled),
      loading: !!(source && source.loading),
    };
  }

  _fromPaths(paths) {
    const root = [];
    paths.forEach((path) => {
      const parts = String(path).split('>').map((part) => part.trim()).filter(Boolean);
      let level = root;
      let prefix = '';
      parts.forEach((label) => {
        prefix = prefix ? prefix + '>' + label : label;
        let node = level.find((entry) => entry.title === label);
        if (!node) { node = this._node(label, prefix, [], null); level.push(node); }
        level = node.children;
      });
    });
    return root;
  }

  _readValues(value) {
    if (!value) return [];
    const text = String(value).trim();
    if (!text) return [];
    const parsed = this._parseStructuredValue(text);
    if (Array.isArray(parsed)) return parsed.map(String);
    if (parsed != null) return [String(parsed)];
    return text.split(',').map((part) => part.trim()).filter(Boolean);
  }

  _toggleArray(values, value) {
    return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
  }

  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  }

  _classList(value) {
    return String(value).split(/\s+/).map((entry) => this._classToken(entry)).filter(Boolean).join(' ');
  }

  _parseStructuredValue(text) {
    try {
      return JSON.parse(text);
    } catch (_) {
      if (!text.includes("'")) return null;
      try {
        const normalized = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, value) => JSON.stringify(value.replace(/\\'/g, "'")));
        return JSON.parse(normalized);
      } catch (_) {
        return null;
      }
    }
  }
}

if (!customElements.get('w-treeview')) customElements.define('w-treeview', WTreeview);
