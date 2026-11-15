/* WRenderState — keeps what the user is doing across a re-render (DUVAY-8).
 *
 * A re-render replaces the element's inner controls. Created just before the
 * new template goes in, this records the focused control (with its caret,
 * selection, scroll and active option) and every input or textarea whose
 * value the user changed. `restore()` then puts them back on the new
 * controls:
 *
 *   - a control that survived (authored, slotted content) keeps its identity
 *     and only gets focus back;
 *   - a replaced control is matched to its new copy by id, or else by its
 *     position among the controls with the same tag, type, name and role;
 *   - a typed value or checked state comes back only when the new template
 *     kept the same default, so an attribute that sets a new value still wins;
 *   - focus, blur, focusin and focusout events caused by the swap are stopped
 *     at the host, so neither the component nor the page sees a fake blur;
 *   - an active option (aria-activedescendant) is restored after the
 *     component re-binds, through its `_activate(option)` method if it has
 *     one.
 *
 * Typed values are kept only when `keepValues` is true: for a re-render caused
 * by an attribute or data property. A component's own `_render()` call may
 * reset a control on purpose (a rejected value), so there only focus, caret
 * and selection come back.
 *
 * A control that the new template disables or removes does not get focus
 * back, as with native controls.
 */

export class WRenderState {
  static controlSelector = 'input, textarea';
  static skippedTypes = new Set(['button', 'file', 'hidden', 'image', 'reset', 'submit']);
  static checkedTypes = new Set(['checkbox', 'radio']);
  static focusEvents = ['focus', 'blur', 'focusin', 'focusout'];

  constructor(host, keepValues) {
    this.host = host;
    this.focused = this._focusedRecord();
    this.controls = keepValues ? this._dirtyControls() : [];
    this.guard = (event) => event.stopImmediatePropagation();
    this._setGuard(true);
  }

  restore() {
    this.controls.forEach((record) => this._restoreValue(record));
    this._restoreFocus();
  }

  release() {
    this._setGuard(false);
  }

  /* ── Capture ──────────────────────────────────────────────────────────── */

  _focusedRecord() {
    const active = document.activeElement;
    if (!active || active === this.host || !this.host.contains(active)) return null;
    return this._record(active);
  }

  _dirtyControls() {
    const controls = Array.from(this.host.querySelectorAll(WRenderState.controlSelector));
    return controls.filter((control) => this._isDirty(control)).map((control) => this._record(control));
  }

  _isDirty(control) {
    if (WRenderState.skippedTypes.has(control.type)) return false;
    if (WRenderState.checkedTypes.has(control.type)) return control.checked !== control.defaultChecked;
    return control.value !== control.defaultValue;
  }

  _record(node) {
    return {
      node,
      peers: this._peers(node),
      value: node.value,
      checked: node.checked,
      defaultValue: node.defaultValue,
      defaultChecked: node.defaultChecked,
      selection: this._selection(node),
      scrollTop: node.scrollTop,
      scrollLeft: node.scrollLeft,
      activeDescendant: node.getAttribute('aria-activedescendant'),
    };
  }

  _selection(node) {
    try {
      if (typeof node.selectionStart !== 'number') return null;
      return [node.selectionStart, node.selectionEnd, node.selectionDirection];
    } catch {
      return null;
    }
  }

  _peers(node) {
    const key = this._key(node);
    const all = Array.from(this.host.getElementsByTagName(node.localName));
    return all.filter((peer) => this._key(peer) === key);
  }

  _key(node) {
    return [node.getAttribute('type'), node.getAttribute('name'), node.getAttribute('role')].join('|');
  }

  _setGuard(on) {
    if (!this.focused) return;
    const method = on ? 'addEventListener' : 'removeEventListener';
    WRenderState.focusEvents.forEach((type) => this.host[method](type, this.guard, true));
  }

  /* ── Restore ──────────────────────────────────────────────────────────── */

  // The node itself when it survived the render, else its new copy.
  _target(record) {
    if (record.node.isConnected && this.host.contains(record.node)) return record.node;
    return this._byId(record) || this._byPosition(record);
  }

  _byId(record) {
    const id = record.node.id;
    if (!id) return null;
    const match = this.host.querySelector('#' + CSS.escape(id));
    return match && match.localName === record.node.localName ? match : null;
  }

  // Matches the n-th replaced peer to the n-th new peer, only when the counts
  // agree, so a template that adds or drops a control never shifts focus.
  _byPosition(record) {
    const gone = record.peers.filter((peer) => !peer.isConnected || !this.host.contains(peer));
    const fresh = this._peers(record.node).filter((peer) => !record.peers.includes(peer));
    if (gone.length !== fresh.length) return null;
    return fresh[gone.indexOf(record.node)] || null;
  }

  _restoreValue(record) {
    const target = this._target(record);
    if (!target || target === record.node) return;
    if (WRenderState.checkedTypes.has(target.type)) this._restoreChecked(target, record);
    else this._restoreText(target, record);
  }

  _restoreChecked(target, record) {
    if (target.defaultChecked !== record.defaultChecked) return;
    target.checked = record.checked;
  }

  _restoreText(target, record) {
    if (target.defaultValue !== record.defaultValue) return;
    target.value = record.value;
  }

  _restoreFocus() {
    if (!this.focused) return;
    const target = this._target(this.focused);
    if (!target) return;
    target.focus({ preventScroll: true });
    if (document.activeElement !== target) return;
    this._restoreSelection(target, this.focused.selection);
    target.scrollTop = this.focused.scrollTop;
    target.scrollLeft = this.focused.scrollLeft;
    this._scheduleActiveOption(target, this.focused.activeDescendant);
  }

  _restoreSelection(target, selection) {
    if (!selection || typeof target.setSelectionRange !== 'function') return;
    try {
      target.setSelectionRange(selection[0], selection[1], selection[2]);
    } catch {
      return;
    }
  }

  // The component's `_events()` runs after the render and may move the active
  // option back to the first one; a microtask runs after it.
  _scheduleActiveOption(target, id) {
    if (!id) return;
    queueMicrotask(() => this._restoreActiveOption(target, id));
  }

  _restoreActiveOption(target, id) {
    if (target.getAttribute('aria-activedescendant') === id) return;
    const option = this.host.querySelector('#' + CSS.escape(id));
    if (!option || typeof this.host._activate !== 'function') return;
    this.host._activate(option);
  }
}
