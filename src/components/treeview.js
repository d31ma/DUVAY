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
 *   selectable      - renders checkboxes and reports a selected array
 *   selected        - JSON array of selected values
 *   select-strategy - leaf (default) | independent | classic
 *   opened          - JSON array of open node values
 *   open-all        - expand every branch
 *   open-on-click   - expand/collapse a branch by clicking its row
 *   density         - compact | comfortable (omit for default)
 *   hoverable       - rows highlight on hover
 *   rounded         - pill-rounded rows
 *   color           - accent CSS color/var for active + selected rows
 *   disabled        - disables activation and selection
 *   expand-icon / collapse-icon - override the branch toggle glyphs
 *
 * Slots:
 *   default - used only when no `items` attribute is supplied
 *
 * Events:
 *   change - fires when activated, selected, or opened state changes
 */

export class WTreeview extends WElement {

  static attrs = [
    'items', 'item-title', 'item-value', 'item-children',
    'activatable', 'activated', 'multiple-active',
    'selectable', 'selected', 'select-strategy',
    'opened', 'open-all', 'open-on-click',
    'density', 'hoverable', 'rounded', 'color', 'disabled',
    'expand-icon', 'collapse-icon',
  ];

  get itemsAttr() { return this._attr('items', ''); }
  get itemTitleKey() { return this._attr('item-title', 'title'); }
  get itemValueKey() { return this._attr('item-value', 'value'); }
  get itemChildrenKey() { return this._attr('item-children', 'children'); }
  get activatable() { return this._bool('activatable'); }
  get multipleActive() { return this._bool('multiple-active'); }
  get selectable() { return this._bool('selectable'); }
  get selectStrategy() {
    const value = this._attr('select-strategy', 'leaf');
    return ['leaf', 'independent', 'classic'].includes(value) ? value : 'leaf';
  }
  get openAll() { return this._bool('open-all'); }
  get openOnClick() { return this._bool('open-on-click'); }
  get density() { return this._attr('density', ''); }
  get hoverable() { return this._bool('hoverable'); }
  get rounded() { return this._bool('rounded'); }
  get disabled() { return this._bool('disabled'); }
  get expandIcon() { return this._attr('expand-icon', '›'); }

  get openedValues() { return this._readValues(this._attr('opened', '')); }
  get selectedValues() { return this._readValues(this._attr('selected', '')); }
  get activatedValues() { return this._readValues(this._attr('activated', '')); }

  _template() {
    this._tree = this._parseItems(this.itemsAttr);
    if (!this._tree.length) return '<div class="w-treeview" role="tree"><slot></slot></div>';

    const classes = ['w-treeview'];
    if (this.density) classes.push('w-treeview--' + this.density);
    if (this.hoverable) classes.push('w-treeview--hoverable');
    if (this.rounded) classes.push('w-treeview--rounded');
    if (this.selectable) classes.push('w-treeview--selectable');
    if (this.activatable) classes.push('w-treeview--activatable');
    if (this.disabled) classes.push('w-treeview--disabled');
    const color = this._attr('color', '');
    const style = color ? ` style="--w-treeview-accent: ${this._esc(color)};"` : '';

    const opened = new Set(this.openedValues);
    const selected = new Set(this.selectedValues);
    const activated = new Set(this.activatedValues);
    const html = this._treeHtml(this._tree, opened, selected, activated, true);
    return `<div class="${classes.join(' ')}" role="tree"${style}>${html}</div>`;
  }

  _treeHtml(nodes, opened, selected, activated, root) {
    const groupRole = root ? ' role="presentation"' : ' role="group"';
    return `<ul class="w-treeview-list"${groupRole}>${nodes.map((node) => {
      const hasChildren = node.children.length > 0;
      const open = this.openAll || opened.has(node.value);
      const active = activated.has(node.value);
      const value = this._esc(node.value);

      const toggle = hasChildren
        ? `<button class="w-treeview-toggle" type="button" tabindex="-1" aria-label="Toggle ${this._esc(node.title)}">${this._esc(this.expandIcon)}</button>`
        : '<span class="w-treeview-leaf" aria-hidden="true"></span>';

      let checkbox = '';
      let selectedAttr = active ? ' aria-selected="true"' : '';
      if (this.selectable) {
        const state = this._nodeState(node, selected);
        checkbox = `<span class="w-treeview-checkbox" role="checkbox" tabindex="-1" aria-checked="${state}"></span>`;
        selectedAttr = ` aria-selected="${state === 'true'}"`;
      }

      return `<li class="w-treeview-node${open ? ' open' : ''}" role="treeitem" data-value="${value}"`
        + `${hasChildren ? ` aria-expanded="${open}"` : ''}${selectedAttr}>`
        + `<div class="w-treeview-row${active ? ' active' : ''}"${node.disabled ? ' aria-disabled="true"' : ''} tabindex="-1">`
        + `${toggle}${checkbox}<span class="w-treeview-label">${this._esc(node.title)}</span>`
        + '</div>'
        + `${hasChildren ? this._treeHtml(node.children, opened, selected, activated, false) : ''}`
        + '</li>';
    }).join('')}</ul>`;
  }

  _events() {
    const tree = this._q('.w-treeview');
    if (!tree || !this._tree || !this._tree.length) return;

    // Stop nested treeviews from double-handling a bubbled change.
    this.addEventListener('change', (event) => {
      if (event.target !== this) event.stopImmediatePropagation();
    });

    tree.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      const li = target.closest('.w-treeview-node');
      if (!li || !tree.contains(li)) return;
      const node = this._nodeByValue(li.getAttribute('data-value'));
      if (!node) return;

      if (target.closest('.w-treeview-toggle')) { this._toggleOpen(li, node); return; }
      if (this.disabled || node.disabled) return;
      if (target.closest('.w-treeview-checkbox')) { this._toggleSelect(node); return; }

      if (this.openOnClick && node.children.length) this._toggleOpen(li, node);
      if (this.activatable) this._activate(node);
    });

    tree.addEventListener('keydown', (event) => this._onKeydown(event, tree));
    this._roveTabIndex(tree);
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
    this._emit('change', { value: opened, name: 'opened' });
  }

  /* ── Activation ───────────────────────────────────────────────────────── */
  _activate(node) {
    let activated;
    if (this.multipleActive) {
      activated = this._toggleArray(this.activatedValues, node.value);
    } else {
      activated = this.activatedValues.includes(node.value) ? [] : [node.value];
    }
    this._silentSet('activated', JSON.stringify(activated));
    this._syncActivated(new Set(activated));
    this._emit('change', {
      value: this.multipleActive ? activated : (activated[0] || ''),
      name: 'activated',
      id: node.value,
    });
  }

  _syncActivated(activated) {
    this.querySelectorAll('.w-treeview-node').forEach((li) => {
      const on = activated.has(li.getAttribute('data-value'));
      li.querySelector(':scope > .w-treeview-row').classList.toggle('active', on);
      if (!this.selectable) li.setAttribute('aria-selected', String(on));
    });
  }

  /* ── Selection (with cascade + indeterminate) ─────────────────────────── */
  _toggleSelect(node) {
    const selected = new Set(this.selectedValues);
    if (this.selectStrategy === 'independent') {
      selected.has(node.value) ? selected.delete(node.value) : selected.add(node.value);
    } else {
      const targets = this.selectStrategy === 'classic' ? this._descendants(node) : this._leaves(node);
      const allOn = targets.every((value) => selected.has(value));
      targets.forEach((value) => (allOn ? selected.delete(value) : selected.add(value)));
      if (this.selectStrategy === 'classic') this._normalizeClassic(this._tree, selected);
    }
    const list = Array.from(selected);
    this._silentSet('selected', JSON.stringify(list));
    this._syncSelected(selected);
    this._emit('change', { value: list, name: 'selected', id: node.value });
  }

  _syncSelected(selected) {
    this.querySelectorAll('.w-treeview-node').forEach((li) => {
      const node = this._nodeByValue(li.getAttribute('data-value'));
      if (!node) return;
      const state = this._nodeState(node, selected);
      const box = li.querySelector(':scope > .w-treeview-row > .w-treeview-checkbox');
      if (box) box.setAttribute('aria-checked', state);
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

  /* ── Keyboard navigation ──────────────────────────────────────────────── */
  _onKeydown(event, tree) {
    const rows = this._visibleRows(tree);
    if (!rows.length) return;
    const current = rows.indexOf(document.activeElement);
    const li = document.activeElement && document.activeElement.closest
      ? document.activeElement.closest('.w-treeview-node')
      : null;
    const node = li ? this._nodeByValue(li.getAttribute('data-value')) : null;

    switch (event.key) {
      case 'ArrowDown': event.preventDefault(); this._focusRow(rows, current < 0 ? 0 : Math.min(current + 1, rows.length - 1)); break;
      case 'ArrowUp': event.preventDefault(); this._focusRow(rows, current <= 0 ? 0 : current - 1); break;
      case 'Home': event.preventDefault(); this._focusRow(rows, 0); break;
      case 'End': event.preventDefault(); this._focusRow(rows, rows.length - 1); break;
      case 'ArrowRight':
        if (!li || !node || !node.children.length) break;
        event.preventDefault();
        if (!li.classList.contains('open')) this._toggleOpen(li, node);
        else { const next = this._visibleRows(tree); this._focusRow(next, next.indexOf(li.querySelector(':scope > .w-treeview-row')) + 1); }
        break;
      case 'ArrowLeft':
        if (!li || !node) break;
        event.preventDefault();
        if (li.classList.contains('open') && node.children.length) this._toggleOpen(li, node);
        else {
          const parent = li.parentElement ? li.parentElement.closest('.w-treeview-node') : null;
          if (parent) { const row = parent.querySelector(':scope > .w-treeview-row'); this._roveTo(row); row.focus(); }
        }
        break;
      case 'Enter':
      case ' ':
        if (!node || this.disabled || node.disabled) break;
        event.preventDefault();
        if (this.selectable) this._toggleSelect(node);
        else if (this.activatable) this._activate(node);
        else if (node.children.length) this._toggleOpen(li, node);
        break;
      default: return;
    }
  }

  _visibleRows(tree) {
    return Array.from(tree.querySelectorAll('.w-treeview-row')).filter((row) =>
      row.offsetParent !== null || row.getClientRects().length > 0);
  }

  _focusRow(rows, index) {
    const row = rows[Math.max(0, Math.min(index, rows.length - 1))];
    if (!row) return;
    this._roveTo(row);
    row.focus();
  }

  _roveTabIndex(tree) {
    const first = tree.querySelector('.w-treeview-row');
    if (first) this._roveTo(first);
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
      return label ? { title: label, value: label, children: [], disabled: false } : null;
    }
    const title = item[this.itemTitleKey] ?? item.title ?? '';
    const value = String(item[this.itemValueKey] ?? item.value ?? title);
    const rawChildren = item[this.itemChildrenKey] || item.children || [];
    const children = Array.isArray(rawChildren) ? rawChildren.map((child) => this._normalize(child)).filter(Boolean) : [];
    return { title: String(title), value, children, disabled: !!item.disabled };
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
        if (!node) { node = { title: label, value: prefix, children: [], disabled: false }; level.push(node); }
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
