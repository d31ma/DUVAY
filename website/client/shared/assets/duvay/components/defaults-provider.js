/* <w-defaults-provider> — applies default attributes to descendant components
 * (Vuetify VDefaultsProvider analogue for the attribute-driven DuVay API).
 *
 * Attributes:
 *   defaults  - JSON object mapping a tag selector to default attributes, e.g.
 *               '{"w-btn":{"variant":"outlined","color":"primary"}}'.
 *               A value of `true` sets a boolean attribute; `false`/null skips it.
 *   disabled  - skip applying defaults entirely.
 *   reset     - ignore this provider and N enabled ancestor providers before
 *               resolving defaults; a bare value resets to the outermost scope.
 *   root      - resolve defaults from the outermost provider scope.
 *   scoped    - use only this provider's defaults; do not inherit omitted keys.
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
 * `reset`, `root`, and `scoped` mirror Vuetify's provider-chain behavior using
 * nested Light-DOM providers instead of Vue provide/inject.
 */

export class WDefaultsProvider extends WElement {
  static attrs = ['defaults', 'disabled', 'reset', 'root', 'scoped'];

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

  get _resetDepth() {
    if (!this.hasAttribute('reset')) return null;
    const raw = this.getAttribute('reset');
    if (raw == null || raw === '') return Infinity;
    const value = Number(raw);
    return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : Infinity;
  }

  get _rootScope() {
    return this.hasAttribute('root') && this.getAttribute('root') !== 'false';
  }

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
    const providers = [];
    let node = el.parentElement;
    while (node) {
      if (node.tagName?.toLowerCase() === 'w-defaults-provider' && !node.hasAttribute('disabled')) {
        providers.push(node);
      }
      node = node.parentElement;
    }

    for (let index = 0; index < providers.length;) {
      const provider = providers[index];
      const nextIndex = this._providerIndex(provider, index, providers.length);
      if (nextIndex < 0) return null;
      if (nextIndex !== index) {
        index = nextIndex;
        continue;
      }

      const defs = this._parse(provider.getAttribute('defaults'));
      const governs = Object.keys(defs).some((selector) => {
        try {
          return el.matches(selector)
            && Object.prototype.hasOwnProperty.call(defs[selector] || {}, key);
        } catch (_) {
          return false;
        }
      });
      if (governs) return provider;
      if (provider.hasAttribute('scoped')) return null;
      index += 1;
    }
    return null;
  }

  // Vuetify resolves reset/root from an earlier defaults scope, so a provider
  // carrying either flag intentionally skips its own map.
  _providerIndex(provider, index, length) {
    const outermost = length - 1;
    if (provider._rootScope) return index === outermost ? -1 : outermost;
    const reset = provider._resetDepth;
    if (reset == null) return index;
    if (reset === Infinity) return index === outermost ? -1 : outermost;
    return index + reset + 1;
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
