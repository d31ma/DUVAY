/* <w-defaults-provider> — applies default attributes to descendant components
 * (Vuetify VDefaultsProvider analogue for the attribute-driven DuVay API).
 *
 * Attributes:
 *   defaults  - JSON object mapping a tag selector to default attributes, e.g.
 *               '{"w-btn":{"variant":"outlined","color":"primary"}}'.
 *               A value of `true` sets a boolean attribute; `false`/null skips it.
 *   disabled  - skip applying defaults entirely.
 *
 * Rules:
 *   - Defaults only fill in attributes a consumer hasn't set — they never
 *     override an explicit value.
 *   - Defaults merge across nesting per attribute: a nested provider overrides
 *     the keys it specifies, while keys it omits still inherit from outer
 *     providers (the nearest provider that defines a given key wins).
 *
 * Slot: default.
 *
 * ponytail: covers `defaults` + `disabled`; Vuetify's `reset`/`root`/`scoped`
 * are Vue provide/inject internals with no attribute-layer equivalent — add only
 * if a real need appears.
 */

export class WDefaultsProvider extends WElement {
  static attrs = ['defaults', 'disabled'];

  _template() { return `<div class="w-defaults-provider"><slot></slot></div>`; }

  _parse(raw) {
    try {
      const parsed = JSON.parse(raw || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  get _defaults() { return this._parse(this.getAttribute('defaults')); }

  _events() {
    this._applyDefaults();
    // Apply to descendants added after the initial render.
    if (!this._observer) {
      this._observer = new MutationObserver(() => this._applyDefaults());
      this._observer.observe(this, { childList: true, subtree: true });
    }
  }

  disconnectedCallback() {
    if (this._observer) { this._observer.disconnect(); this._observer = null; }
  }

  // The nearest enabled defaults provider that defines `key` for an element
  // matching one of its selectors owns that key — giving per-attribute merge
  // across nested providers.
  _ownerFor(el, key) {
    let node = el.parentElement;
    while (node) {
      if (node.tagName && node.tagName.toLowerCase() === 'w-defaults-provider' && !node.hasAttribute('disabled')) {
        const defs = this._parse(node.getAttribute('defaults'));
        const governs = Object.keys(defs).some((sel) => {
          try { return el.matches(sel) && Object.prototype.hasOwnProperty.call(defs[sel] || {}, key); }
          catch (_) { return false; }
        });
        if (governs) return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  _applyDefaults() {
    if (this._bool('disabled')) return;
    const defaults = this._defaults;
    Object.keys(defaults).forEach((selector) => {
      const attrs = defaults[selector] || {};
      let nodes;
      try { nodes = this.querySelectorAll(selector); } catch (_) { return; }
      nodes.forEach((el) => {
        Object.keys(attrs).forEach((name) => {
          if (el.hasAttribute(name)) return;            // never override explicit / already-applied
          if (this._ownerFor(el, name) !== this) return; // a closer provider owns this key
          const value = attrs[name];
          if (value === false || value == null) return;
          el.setAttribute(name, value === true ? '' : String(value));
        });
      });
    });
  }
}

if (!customElements.get('w-defaults-provider')) customElements.define('w-defaults-provider', WDefaultsProvider);
