/* <w-command> — command palette
 *
 * Attributes:
 *   placeholder  - search input placeholder
 *   label        - accessible label for the palette
 *   empty        - "no results" message (no-data-text)
 *   items        - JSON array of command items / group rows (see below)
 *   hotkey       - global shortcut to open the overlay, e.g. "mod+k",
 *                  "ctrl+k", "ctrl+shift+p" ("mod" = meta on macOS, ctrl elsewhere)
 *   open         - boolean; overlay visibility (overlay mode only)
 *   filter-keys  - comma list restricting which fields the search matches
 *                  (title, subtitle, value); defaults to all visible text
 *
 * Item objects: { title|text, value, subtitle, icon|prepend-icon, shortcut|hotkey, disabled }
 * Group rows:   { type: "subheader", title }  ·  { type: "divider" }
 *
 * With `hotkey` (or `open`) the palette renders as a centered overlay opened by
 * the shortcut; otherwise it renders inline. Keyboard: ↑/↓ move, Enter selects,
 * Home/End jump, Escape closes the overlay.
 *
 * Events:
 *   input  - search query changed (detail: { value })
 *   change - an item was chosen (detail: { value })
 */

export class WCommand extends WElement {
  static attrs = ['placeholder', 'label', 'empty', 'items', 'hotkey', 'open', 'filter-keys'];

  get placeholder() { return this._attr('placeholder', 'Type a command or search...'); }
  get label() { return this._attr('label', 'Command menu'); }
  get empty() { return this._attr('empty', 'No results found.'); }
  get _overlay() { return this.hasAttribute('hotkey') || this.hasAttribute('open'); }

  _items() {
    const raw = this.getAttribute('items');
    if (!raw) return null;
    try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : null; }
    catch (_) { return null; }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hasAttribute('hotkey') && !this._hotkeyHandler) {
      this._hotkeyHandler = (event) => {
        if (this._matchHotkey(event)) { event.preventDefault(); this.toggle(); }
      };
      document.addEventListener('keydown', this._hotkeyHandler);
    }
  }

  disconnectedCallback() {
    if (this._hotkeyHandler) {
      document.removeEventListener('keydown', this._hotkeyHandler);
      this._hotkeyHandler = null;
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    // Toggle the overlay in place so the input value/caret survive open/close.
    if (name === 'open') {
      if (this._rendered) this._applyOpen();
      return;
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  _template() {
    const panel = this._panel();
    if (!this._overlay) return panel;
    const openClass = this.hasAttribute('open') ? ' open' : '';
    return `<div class="w-command-overlay${openClass}">${panel}</div>`;
  }

  _panel() {
    return `<div class="w-command" role="combobox" aria-haspopup="listbox" aria-expanded="true" aria-label="${this._esc(this.label)}">
      <div class="w-command-input-wrap">
        <span class="w-command-icon" aria-hidden="true">&#8981;</span>
        <input class="w-command-input" type="search" placeholder="${this._esc(this.placeholder)}" autocomplete="off" aria-controls="w-command-list" />
      </div>
      <div class="w-command-list" id="w-command-list" role="listbox">${this._listContent()}</div>
      <div class="w-command-empty" hidden>${this._esc(this.empty)}</div>
    </div>`;
  }

  _listContent() {
    const items = this._items();
    if (items && items.length) return items.map((item) => this._renderItem(item)).join('');
    return '<slot></slot>';
  }

  _renderItem(item) {
    if (!item || typeof item !== 'object') return '';
    if (item.type === 'divider') return '<div class="w-command-divider" role="separator"></div>';
    if (item.type === 'subheader') return `<div class="w-command-subheader">${this._esc(item.title || item.text || '')}</div>`;
    const title = item.title != null ? item.title : (item.text != null ? item.text : '');
    const icon = item.icon || item['prepend-icon'] || item.prependIcon;
    const shortcut = item.shortcut || item.hotkey;
    const attrs = [];
    if (item.value != null) attrs.push(`value="${this._esc(item.value)}"`);
    if (item.subtitle) attrs.push(`subtitle="${this._esc(item.subtitle)}"`);
    if (icon) attrs.push(`icon="${this._esc(icon)}"`);
    if (shortcut) attrs.push(`shortcut="${this._esc(shortcut)}"`);
    if (item.disabled) attrs.push('disabled');
    return `<w-command-item ${attrs.join(' ')}>${this._esc(title)}</w-command-item>`;
  }

  _events() {
    const input = this._q('.w-command-input');
    const list = this._q('.w-command-list');
    const overlay = this._q('.w-command-overlay');
    if (!input || !list) return;

    input.addEventListener('input', (event) => {
      event.stopPropagation();
      this._filter();
      this._emit('input', { value: input.value });
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') { event.preventDefault(); this._move(1); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); this._move(-1); }
      else if (event.key === 'Home') { event.preventDefault(); this._activate(this._visibleItems()[0] || null); }
      else if (event.key === 'End') { event.preventDefault(); const v = this._visibleItems(); this._activate(v[v.length - 1] || null); }
      else if (event.key === 'Enter') { event.preventDefault(); this._selectItem(this._activeEl); }
      else if (event.key === 'Escape' && overlay) { event.preventDefault(); this.hide(); }
    });

    list.addEventListener('click', (event) => {
      const item = event.target.closest('w-command-item');
      if (!item || item.hasAttribute('disabled')) return;
      this._selectItem(item);
    });

    list.addEventListener('pointermove', (event) => {
      const item = event.target.closest('w-command-item');
      if (item && !item.hidden && !item.hasAttribute('disabled')) this._activate(item);
    });

    if (overlay) overlay.addEventListener('click', (event) => { if (event.target === overlay) this.hide(); });

    this._filter();
    // Items may upgrade after this first pass — re-sync the active item.
    requestAnimationFrame(() => this._filter());
  }

  /* Filtering */

  _filter() {
    const input = this._q('.w-command-input');
    const empty = this._q('.w-command-empty');
    if (!input) return;
    const query = input.value.trim().toLowerCase();
    const keys = (this.getAttribute('filter-keys') || '').split(',').map((k) => k.trim()).filter(Boolean);
    let visible = 0;
    this.querySelectorAll('w-command-item').forEach((item) => {
      const match = !query || this._haystack(item, keys).includes(query);
      item.hidden = !match;
      if (match) visible += 1;
    });
    if (empty) empty.hidden = visible > 0;
    this._activate(this._visibleItems()[0] || null);
  }

  _haystack(item, keys) {
    if (keys.length) {
      return keys.map((key) => {
        if (key === 'title') return item.querySelector('.w-command-item-title')?.textContent || '';
        if (key === 'value') return item.getAttribute('value') || '';
        return item.getAttribute(key) || '';
      }).join(' ').toLowerCase();
    }
    return ((item.getAttribute('value') || '') + ' ' + (item.textContent || '')).toLowerCase();
  }

  /* Active item / keyboard navigation */

  _visibleItems() {
    return Array.from(this.querySelectorAll('w-command-item')).filter((item) => !item.hidden && !item.hasAttribute('disabled'));
  }

  _activate(itemEl) {
    this._activeEl = itemEl || null;
    const input = this._q('.w-command-input');
    this.querySelectorAll('w-command-item').forEach((item) => {
      item.querySelector('.w-command-item')?.classList.toggle('active', item === itemEl);
    });
    if (input) {
      const btn = itemEl && itemEl.querySelector('.w-command-item');
      if (btn) {
        if (!btn.id) btn.id = 'hecmd-' + Math.random().toString(36).slice(2, 9);
        input.setAttribute('aria-activedescendant', btn.id);
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }
    if (itemEl) itemEl.scrollIntoView({ block: 'nearest' });
  }

  _move(delta) {
    const items = this._visibleItems();
    if (!items.length) return this._activate(null);
    let index = items.indexOf(this._activeEl);
    index = index < 0 ? (delta > 0 ? 0 : items.length - 1) : (index + delta + items.length) % items.length;
    this._activate(items[index]);
  }

  _selectItem(itemEl) {
    if (!itemEl || itemEl.hasAttribute('disabled')) return;
    const value = itemEl.getAttribute('value')
      || itemEl.querySelector('.w-command-item-title')?.textContent.trim()
      || itemEl.textContent.trim();
    this._emit('change', { value });
    if (this._q('.w-command-overlay')) this.hide();
  }

  /* Overlay open/close */

  show() { this.setAttribute('open', ''); }
  hide() { this.removeAttribute('open'); }
  toggle() { this.hasAttribute('open') ? this.hide() : this.show(); }

  _applyOpen() {
    const overlay = this._q('.w-command-overlay');
    if (!overlay) return;
    const open = this.hasAttribute('open');
    overlay.classList.toggle('open', open);
    const input = this._q('.w-command-input');
    if (open) {
      this._lastFocus = document.activeElement;
      if (input) { input.value = ''; this._filter(); input.focus(); }
    } else if (this._lastFocus && typeof this._lastFocus.focus === 'function') {
      this._lastFocus.focus();
    }
  }

  /* Hotkey parsing */

  _matchHotkey(event) {
    const spec = this.getAttribute('hotkey');
    if (!spec) return false;
    const parts = spec.toLowerCase().split('+').map((p) => p.trim()).filter(Boolean);
    const key = parts[parts.length - 1];
    const mods = parts.slice(0, -1);
    const mod = event.metaKey || event.ctrlKey;
    if (mods.includes('mod') && !mod) return false;
    if (mods.includes('ctrl') && !event.ctrlKey) return false;
    if ((mods.includes('meta') || mods.includes('cmd')) && !event.metaKey) return false;
    if (mods.includes('shift') && !event.shiftKey) return false;
    if (mods.includes('alt') && !event.altKey) return false;
    return event.key.toLowerCase() === key;
  }
}

if (!customElements.get('w-command')) {
  customElements.define('w-command', WCommand);
}
