/* <w-list> — List container web component
 *
 * Attributes:
 *   items         - JSON array of list items or a semicolon-delimited list
 *   item-title    - item object key for title (default: title)
 *   item-value    - item object key for value (default: value)
 *   item-children - item object key for nested children (default: children)
 *   density       - compact | comfortable (omit for default)
 *   lines         - one | two | three (omit for one-line default)
 *   variant       - text | plain | tonal | outlined
 *   nav           - applies navigation list styling
 *   selectable    - manages selected state for child w-list-item elements
 *   activatable   - manages active state without implying form selection
 *   selected      - selected value or JSON array
 *   activated     - activated value or JSON array
 *   opened        - JSON array of open group values
 *   disabled      - disables selection management
 *   mandatory     - keeps at least one item selected/activated
 *   active-class  - extra class applied to the active item's control
 *   filterable    - [space] never activates an item; it stays with the text input
 *   navigation-strategy - focus (default) moves DOM focus | track keeps focus outside
 *   navigation-index    - the tracked item index when navigation-strategy="track"
 *   items-registration  - render (default) | props skips collapsed group children
 *   active-strategy     - leaf | independent | single-leaf | single-independent
 *   select-strategy     - leaf | independent | classic | trunk | branch | single-*
 *   open-strategy       - multiple (default) | single | list
 *   return-object       - change events carry the source item object
 *
 * Slots:
 *   default - w-list-item elements, dividers, and subheaders
 *
 * Events:
 *   change - fires when selected, activated, or opened state changes
 *   update:navigationIndex - fires when the tracked navigation index moves
 */

class WList extends WElement {

  static attrs = [
    'items',
    'item-title',
    'item-value',
    'item-children',
    'item-type',
    'density',
    'lines',
    'variant',
    'nav',
    'selectable',
    'activatable',
    'multiple',
    'selected',
    'activated',
    'opened',
    'disabled',
    'slim',
    'prepend-gap',
    'indent',
    'expand-icon',
    'collapse-icon',
    'mandatory',
    'active-class',
    'filterable',
    'navigation-strategy',
    'navigation-index',
    'items-registration',
    'active-strategy',
    'select-strategy',
    'open-strategy',
    'return-object',
  ];

  get itemsAttr() { return this._attr('items', ''); }
  get itemTitleKey() { return this._attr('item-title', 'title'); }
  get itemValueKey() { return this._attr('item-value', 'value'); }
  get itemChildrenKey() { return this._attr('item-children', 'children'); }
  get itemTypeKey() { return this._attr('item-type', 'type'); }
  get density() { return this._attr('density', ''); }
  get lines() { return this._attr('lines', ''); }
  get variant() { return this._attr('variant', ''); }
  get nav() { return this._bool('nav'); }
  get selectable() { return this._bool('selectable'); }
  get activatable() { return this._bool('activatable'); }
  get disabled() { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get slim() { return this._bool('slim'); }
  get mandatory() { return this._bool('mandatory'); }
  get activeClass() { return this._attr('active-class', ''); }
  get filterable() { return this._bool('filterable'); }
  get returnObject() { return this._bool('return-object'); }
  get itemsRegistration() { return this._attr('items-registration', 'render'); }
  get openStrategy() { return this._attr('open-strategy', 'multiple'); }
  get navigationStrategy() { return this._attr('navigation-strategy', 'focus') === 'track' ? 'track' : 'focus'; }

  get navigationIndex() {
    const index = Number.parseInt(this._attr('navigation-index', ''), 10);
    return Number.isFinite(index) ? index : -1;
  }

  // Vuetify's nested strategies: only the `single-` prefixed ones are
  // single-selection. Selection is per-row here (group headers are their own
  // element), so leaf/independent already describe the same set of rows.
  get strategy() {
    return this.selectable ? this._attr('select-strategy', '') : this._attr('active-strategy', '');
  }

  get multiple() {
    const strategy = this.strategy;
    if (strategy) return !strategy.startsWith('single-');
    return this._bool('multiple');
  }

  get opened() { return this._readValues(this._attr('opened', '')); }
  get selectedValue() { return this._readValue(this._attr('selected', '')); }
  get activatedValue() { return this._readValue(this._attr('activated', '')); }

  _template() {
    const classes = 'w-list' + this._cls({
      ['w-list--' + this.density]: this.density,
      ['w-list--' + this.lines + '-line']: this.lines && this.lines !== 'one',
      'w-list--nav': this.nav,
      ['w-list--variant-' + this._classToken(this.variant)]: this.variant,
      'w-list--slim': this.slim,
      'w-list--track': this.navigationStrategy === 'track',
    });
    const attrs = this._attrs({
      role: this._listRole(),
      'aria-multiselectable': this.selectable && this.multiple && 'true',
      // Track mode keeps DOM focus on the container (or an outside input) and
      // points at the active row with aria-activedescendant instead.
      tabindex: this.navigationStrategy === 'track' && '0',
    });
    const generated = this.itemsAttr ? this._renderRoot() : '<slot></slot>';

    return `<div class="${classes}"${attrs}${this._style()}>${generated}</div>`;
  }

  _listRole() {
    if (this.selectable || this.activatable) return 'listbox';
    return this.navigationStrategy === 'track' ? 'listbox' : 'list';
  }

  // Generated items are indexed by value so `return-object` can hand the source
  // object back in the change event.
  _renderRoot() {
    this._itemIndex = {};
    return this._renderItems(this._parseItems(this.itemsAttr), 0);
  }

  _events() {
    const list = this._q('.w-list');
    if (!list) return;

    this._enforceMandatory();
    this._syncItemState();
    this._syncOpenedGroups();
    // Slotted rows render on their own microtask, so the first pass above runs
    // before their inner controls exist; catch up once they do.
    this._scheduleSync();

    // The host outlives every re-render, so its listeners are bound once.
    if (!this.__hostBound) {
      this.__hostBound = true;
      this.addEventListener('change', (event) => {
        if (event.target !== this) event.stopImmediatePropagation();
      });
      this.addEventListener('toggle', (event) => this._onGroupToggle(event));
    }

    // Capture phase: swallowing [space] here stops it reaching the item's own
    // handler, so an autocomplete's text input keeps the keystroke.
    if (this.filterable) list.addEventListener('keydown', (event) => this._onFilterableKeydown(event), true);

    list.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const item = target ? target.closest('w-list-item') : null;
      if (!item || item.disabled) return;
      if (!this.selectable && !this.activatable) return;
      if (this.disabled) return;

      this._chooseItem(item);
    });

    list.addEventListener('keydown', (event) => this._onListKeydown(event));

  }

  _onGroupToggle(event) {
    const group = event.target instanceof Element ? event.target.closest('w-list-group') : null;
    if (!group || group === this || !this.contains(group)) return;
    const value = group.getAttribute('value') || group.getAttribute('title') || '';
    if (!value) return;
    const opened = this._nextOpened(value, group.open);
    this._silentSet('opened', JSON.stringify(opened));
    // Under items-registration="props" a group's children only exist while it
    // is open, so opening one has to go back through the template.
    if (this.itemsAttr && this.itemsRegistration === 'props') this._rerender();
    else this._syncOpenedGroups();
    this._emit('change', { value: opened, name: 'opened' });
  }

  _rerender() {
    this._render();
    this._events();
  }

  // `single` keeps one group open at a time; `multiple` (and `list`) let any
  // number stay open — `list` differs only in closing everything on selection.
  _nextOpened(value, isOpen) {
    const next = new Set(this.opened);
    if (!isOpen) {
      next.delete(value);
      return Array.from(next);
    }
    if (this.openStrategy === 'single') return [value];
    next.add(value);
    return Array.from(next);
  }

  _closeAllGroups() {
    if (!this.opened.length) return;
    this._silentSet('opened', '[]');
    this._syncOpenedGroups();
  }

  // preventDefault as well as stopPropagation: the rows are <button>s, which the
  // browser would otherwise activate on [space] all by itself.
  _onFilterableKeydown(event) {
    if (event.key !== ' ' && event.key !== 'Spacebar') return;
    event.preventDefault();
    event.stopPropagation();
  }

  _onListKeydown(event) {
    const direction = this._navigationDirection(event.key);
    if (!direction) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

    const focusables = this._focusableItems();
    if (!focusables.length) return;
    event.preventDefault();
    const index = this._stepIndex(this._currentIndex(focusables), focusables.length, direction);
    if (this.navigationStrategy === 'track') this._setNavigationIndex(index, focusables);
    else focusables[index].focus();
  }

  _currentIndex(focusables) {
    if (this.navigationStrategy === 'track') return this.navigationIndex;
    return focusables.indexOf(document.activeElement);
  }

  _stepIndex(index, length, direction) {
    if (direction === 'first') return 0;
    if (direction === 'last') return length - 1;
    if (index < 0) return 0;
    return (index + (direction === 'next' ? 1 : -1) + length) % length;
  }

  _setNavigationIndex(index, focusables) {
    this._silentSet('navigation-index', String(index));
    this._syncNavigation(focusables);
    this._emit('update:navigationIndex', { value: index });
  }

  // Track mode: the rows never take DOM focus, so the visual cue and the
  // listbox's aria-activedescendant have to be maintained by hand.
  _syncNavigation(focusables = this._focusableItems()) {
    const list = this._q('.w-list');
    if (!list || this.navigationStrategy !== 'track') return;
    const current = focusables[this.navigationIndex];
    focusables.forEach((el, position) => {
      el.setAttribute('tabindex', '-1');
      el.classList.toggle('w-list-item--focused', el === current);
      if (el === current && !el.id) el.id = this._uid() + '-item-' + position;
    });
    if (!current) {
      list.removeAttribute('aria-activedescendant');
      return;
    }
    list.setAttribute('aria-activedescendant', current.id);
    if (typeof current.scrollIntoView === 'function') current.scrollIntoView({ block: 'nearest' });
  }

  _uid() {
    if (!this.__uid) this.__uid = 'w-list-' + Math.random().toString(36).slice(2, 8);
    return this.__uid;
  }

  // `mandatory` seeds the first enabled row when nothing is picked yet.
  _enforceMandatory() {
    if (!this.mandatory || (!this.selectable && !this.activatable)) return;
    const name = this.selectable ? 'selected' : 'activated';
    if (this._readValues(this._attr(name, '')).length) return;
    const first = this.querySelector('w-list-item:not([disabled])');
    const value = first ? String(first.value ?? '') : '';
    if (!value) return;
    this._silentSet(name, this.multiple ? JSON.stringify([value]) : value);
  }

  _chooseItem(item) {
    const rawValue = item.value;
    const value = rawValue == null ? '' : String(rawValue);
    const name = this.selectable ? 'selected' : 'activated';
    const next = this.multiple
      ? this._toggleArray(this._readValues(this._attr(name, '')), value)
      : value;
    this._silentSet(name, Array.isArray(next) ? JSON.stringify(next) : next);
    if (this.openStrategy === 'list') this._closeAllGroups();
    this._syncItemState();
    this._emit('change', { value: this._emitValue(next), name, id: value });
  }

  // `return-object` swaps the flat value for the source item it came from.
  _emitValue(value) {
    if (!this.returnObject) return value;
    const index = this._itemIndex || {};
    if (Array.isArray(value)) return value.map((entry) => index[entry] ?? entry);
    return index[value] ?? value;
  }

  _scheduleSync() {
    const schedule = typeof queueMicrotask === 'function'
      ? queueMicrotask
      : (callback) => Promise.resolve().then(callback);
    schedule(() => {
      if (this.isConnected) this._syncItemState();
    });
  }

  _syncItemState() {
    const selected = this._readValues(this._attr('selected', ''));
    const activated = this._readValues(this._attr('activated', ''));
    this.querySelectorAll('w-list-item').forEach((el) => {
      // The row already knows how to render an active-class; hand it down
      // rather than reaching into its markup.
      if (this.activeClass && !el.hasAttribute('active-class')) el.setAttribute('active-class', this.activeClass);
      const active = this._isItemActive(el, selected, activated);
      el.active = active;
      this._syncItemControl(el, active);
    });
    this._syncNavigation();
  }

  _isItemActive(el, selected, activated) {
    const value = String(el.value);
    if (this.selectable) return selected.includes(value);
    if (this.activatable) return activated.includes(value);
    return el.hasAttribute('active');
  }

  _syncItemControl(el, active) {
    const control = el.querySelector('.w-list-item');
    if (!control) return;
    if (!this.selectable && !this.activatable) return;
    control.setAttribute('role', 'option');
    control.setAttribute('aria-selected', active ? 'true' : 'false');
  }

  _syncOpenedGroups() {
    if (!this.hasAttribute('opened')) return;
    const opened = new Set(this.opened);
    this.querySelectorAll('w-list-group').forEach((group) => {
      const value = group.getAttribute('value') || group.getAttribute('title') || '';
      if (!value) return;
      const shouldOpen = opened.has(value);
      if (group.open === shouldOpen) return;
      group._silentSet('open', shouldOpen ? 'true' : null);
      if (typeof group._render === 'function') {
        group._render();
        if (typeof group._events === 'function') group._events();
      }
    });
  }

  _renderItems(items, depth) {
    return items.map((item) => this._renderItem(item, depth)).join('');
  }

  _renderItem(item, depth) {
    if (typeof item === 'string') return `<w-list-item title="${this._esc(item)}" value="${this._esc(item)}"></w-list-item>`;
    if (!item || typeof item !== 'object') return '';

    const block = this._renderItemBlock(item);
    if (block) return block;

    return this._renderObjectItem(item, depth);
  }

  // Non-interactive entries: dividers and subheaders. Returns '' for a
  // regular item so the caller falls through to the item renderers.
  _renderItemBlock(item) {
    const type = item[this.itemTypeKey] || item.type || 'item';
    if (type === 'divider') return '<div class="w-list-divider" role="separator"></div>';
    if (type === 'subheader') return `<div class="w-list-subheader">${this._esc(item[this.itemTitleKey] || item.title || '')}</div>`;
    return '';
  }

  _renderObjectItem(item, depth) {
    const title = item[this.itemTitleKey] ?? item.title ?? '';
    const value = item[this.itemValueKey] ?? item.value ?? title;
    if (this._itemIndex) this._itemIndex[String(value)] = item;
    const children = item[this.itemChildrenKey] || item.children;
    if (Array.isArray(children) && children.length) {
      return this._renderGroup(item, title, value, children, depth);
    }

    return this._renderGeneratedItem(item, title, value);
  }

  _renderGroup(item, title, value, children, depth) {
    const open = this.opened.includes(String(value)) || item.open ? ' open' : '';
    const prepend = item.prependIcon || item['prepend-icon'] || '';
    // items-registration="props" trades DOM for speed: a collapsed group's
    // children are never rendered until it opens.
    const body = !open && this.itemsRegistration === 'props' ? '' : this._renderItems(children, depth + 1);
    return `<w-list-group title="${this._esc(title)}" value="${this._esc(value)}"${prepend ? ` prepend-icon="${this._esc(prepend)}"` : ''}${open}>${body}</w-list-group>`;
  }

  _renderGeneratedItem(item, title, value) {
    const attrs = [
      ['title', title],
      ['value', value],
      ['subtitle', item.subtitle],
      ['href', item.href || item.to],
      ['prepend-icon', item.prependIcon || item['prepend-icon']],
      ['append-icon', item.appendIcon || item['append-icon']],
      ['prepend-avatar', item.prependAvatar || item['prepend-avatar']],
      ['append-avatar', item.appendAvatar || item['append-avatar']],
      ['lines', item.lines],
      ['density', item.density],
      ['variant', item.variant],
    ].filter((entry) => entry[1] != null && entry[1] !== '').map(([name, value]) => ` ${name}="${this._esc(value)}"`).join('');
    return `<w-list-item${attrs}${item.disabled ? ' disabled' : ''}${item.active ? ' active' : ''}></w-list-item>`;
  }

  _parseItems(value) {
    if (!value) return [];
    const text = String(value).trim();
    const parsed = this._parseStructuredValue(text);
    if (Array.isArray(parsed)) return parsed;
    return text.replace(/^\[|\]$/g, '').split(';').map((part) => part.trim()).filter(Boolean);
  }

  _readValue(value) {
    const values = this._readValues(value);
    return this.multiple ? values : values[0] || '';
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
    if (!values.includes(value)) return [...values, value];
    if (this.mandatory && values.length <= 1) return values;
    return values.filter((entry) => entry !== value);
  }

  _navigationDirection(key) {
    if (key === 'ArrowDown') return 'next';
    if (key === 'ArrowUp') return 'prev';
    if (key === 'Home') return 'first';
    if (key === 'End') return 'last';
    return '';
  }

  _focusableItems() {
    return Array.from(this.querySelectorAll('.w-list-item')).filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return false;
      return el.offsetParent !== null || el.getClientRects().length > 0;
    });
  }

  _style() {
    const pairs = [];
    if (this.hasAttribute('indent')) pairs.push(['--w-list-indent', this._attr('indent', '')]);
    if (this.hasAttribute('prepend-gap')) pairs.push(['--w-list-prepend-gap', this._attr('prepend-gap', '')]);
    return pairs.length ? ` style="${pairs.map(([name, value]) => `${name}: ${this._esc(value)}`).join('; ')}"` : '';
  }

  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
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

customElements.define('w-list', WList);
