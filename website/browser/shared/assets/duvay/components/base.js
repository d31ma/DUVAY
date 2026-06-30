/* DuVay — Web Component Base
 *
 * Light-DOM base class for all w-* custom elements.
 * Components render their template into `this.innerHTML` on connect
 * and whenever an observed attribute changes. The existing duvay.css
 * stylesheet handles all visual presentation via class names.
 *
 * Subclasses override:
 *   static attrs        — array of attribute names to observe
 *   static props        — { attrName: propertyName } for camelCase reflection
 *   _template()         — must return an HTML string (use `<slot>` for children)
 *   _events()           — optional, bind event listeners after render
 */

class WElement extends HTMLElement {
  static attrs = [
    'color',
    'bg-color',
    'base-color',
    'active-color',
    'density',
    'elevation',
    'rounded',
    'border',
    'tile',
    'width',
    'height',
    'min-width',
    'max-width',
    'location',
    'position',
    'loading',
    'disabled',
    'readonly',
  ];

  static get observedAttributes() {
    // Collect from the class hierarchy
    const attrs = [];
    let proto = this;
    while (proto && proto.attrs) {
      if (Array.isArray(proto.attrs)) attrs.push(...proto.attrs);
      proto = Object.getPrototypeOf(proto);
    }
    return [...new Set(attrs)];
  }

  constructor() {
    super();
    this._rendered = false;
    this._renderScheduled = false;
  }

  connectedCallback() {
    if (this._rendered || this._renderScheduled) return;

    this._renderScheduled = true;
    const schedule = typeof queueMicrotask === 'function'
      ? queueMicrotask
      : (fn) => Promise.resolve().then(fn);

    schedule(() => {
      this._renderScheduled = false;
      if (!this.isConnected || this._rendered) return;

      this._render();
      this._rendered = true;
      if (typeof this._events === 'function') this._events();
      this._applyCommonProps();
      this._bindShorthandEvents();
    });
  }

  // Wire inline event handlers (same `this`/`event` scope as native on*),
  // bound once on the host so they survive re-renders (events bubble up from
  // inner controls). Two equivalent forms are supported:
  //   @event="…"   — always wired here (e.g. @input, @save, @update:selected)
  //   onevent="…"  — wired here ONLY for the framework's custom events. Standard
  //                  events (onclick, oninput, onload, … all GlobalEventHandlers)
  //                  are already wired by the browser and fire on dispatched
  //                  CustomEvents, so we skip them to avoid double execution.
  // ponytail: inline-handler eval, identical trust model to native on* attributes.
  _bindShorthandEvents() {
    // Yield `@event` to a host template framework that owns that syntax and
    // leaves the attribute on the live DOM (e.g. Tac). It binds the handler
    // itself, so claiming it here would double-handle and try to eval the
    // framework's generated value. Frameworks that strip `@` before render
    // (Vue, Alpine) never reach here, so no detection is needed for them.
    // `on<event>` is never claimed by these frameworks, so it stays universal.
    const frameworkOwnsAt = typeof window !== 'undefined' && !!window.Tac;
    Array.from(this.attributes).forEach((attr) => {
      const name = attr.name;
      let type;
      if (name[0] === '@') {
        if (frameworkOwnsAt) return;
        type = name.slice(1);
      } else if (name.length > 2 && name.startsWith('on') && !(name in this)) {
        // `on<custom>` for an event the browser doesn't natively handle.
        type = name.slice(2);
      } else {
        return;
      }
      const handler = new Function('event', attr.value);
      this.addEventListener(type, (event) => handler.call(this, event));
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._rendered) return;
    if (oldVal === newVal) return;

    // _silentSet bypasses re-render — used when the component is mirroring
    // its own DOM state (e.g. a checkbox echoing input.checked into the
    // `checked` attribute). Re-rendering there would blow away the input
    // mid-interaction.
    if (this._skipRender) return;

    // Reflect attribute to camelCase property if in props
    const props = this.constructor.props || {};
    const prop = props[name];
    if (prop && this[prop] !== newVal) {
      this[prop] = newVal;
    }

    this._render();
    if (typeof this._events === 'function') this._events();
    this._applyCommonProps();
  }

  _render() {
    if (typeof this._template !== 'function') return;

    const defaultChildren = [];
    const namedChildren = {};

    // Save original children for Light-DOM slot distribution. On re-render,
    // the host's top-level children are generated wrappers; the authored
    // children live inside the current <slot> nodes.
    const currentSlots = this._rendered ? Array.from(this.querySelectorAll('slot')).filter((slot) => {
      var parent = slot.parentElement;
      while (parent && parent !== this) {
        if (parent.tagName && parent.tagName.toLowerCase().indexOf('w-') === 0) return false;
        parent = parent.parentElement;
      }
      return true;
    }) : [];
    if (currentSlots.length) {
      currentSlots.forEach(function (slot) {
        var name = slot.getAttribute('name');
        var source = Array.from(slot.childNodes);
        if (name) (namedChildren[name] || (namedChildren[name] = [])).push(...source);
        else defaultChildren.push(...source);
      });
    } else {
      Array.from(this.childNodes).forEach(function (node) {
        if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('slot')) {
          var name = node.getAttribute('slot');
          (namedChildren[name] || (namedChildren[name] = [])).push(node);
        } else {
          defaultChildren.push(node);
        }
      });
    }

    this.innerHTML = this._template();

    // Distribute saved children into <slot> elements
    var slots = this.querySelectorAll('slot');
    if (slots.length > 0) {
      slots.forEach(function (slot) {
        var name = slot.getAttribute('name');
        var source = name ? (namedChildren[name] || []) : defaultChildren;
        source.forEach(function (node) {
          slot.appendChild(node);
        });
      });
    }
  }

  /* Helpers */

  // Read attribute with a fallback
  _attr(name, fallback) {
    const v = this.getAttribute(name);
    if (v != null) return v;

    if (name === 'color') {
      const base = this.getAttribute('base-color');
      if (base != null) return base;
    }

    return fallback;
  }

  // Read boolean attribute
  _bool(name) {
    if (this.hasAttribute(name)) return true;
    return false;
  }

  // Emit a standards-named DOM event with optional component metadata.
  // `bubbles: true, composed: true` is the cross-framework contract — Vue
  // (@evt), Angular ((evt)), Svelte (on:evt), Solid/Lit/React 19 (onEvt) and
  // vanilla addEventListener all bind to it. For Vue-style colon names
  // (update:selected) we ALSO dispatch a colon-free alias (update-selected) so
  // Angular / Svelte / plain `on*` — which can't bind a name with a colon — work
  // too.
  _emit(name, detail) {
    const fire = (n) => this.dispatchEvent(new CustomEvent(n, { detail, bubbles: true, composed: true }));
    fire(name);
    if (name.includes(':')) fire(name.replace(/:/g, '-'));
  }

  // Mirror DOM state into an observed attribute WITHOUT triggering a re-render.
  // Pass `true`/`false` for boolean attributes; any other value sets the attr
  // to its string form, and `null`/`undefined` removes it.
  _silentSet(name, value) {
    this._skipRender = true;
    try {
      if (value === null || value === undefined || value === false) {
        this.removeAttribute(name);
      } else {
        this.setAttribute(name, value === true ? '' : String(value));
      }
    } finally {
      this._skipRender = false;
    }
  }

  // Query within this element's light DOM
  _q(selector) {
    return this.querySelector(selector);
  }

  _qAll(selector) {
    return this.querySelectorAll(selector);
  }

  // Attach the press-ripple visual to an inner element (opt-in via a component's
  // `ripple` attribute). Self-contained: reuses ripple.css shipped in duvay.css,
  // so it does NOT depend on the duvay-directives.js add-on. Idempotent per node.
  _attachRipple(el) {
    if (!el || el._wRippleBound) return;
    el._wRippleBound = true;
    el.classList.add('w-ripple-host');
    const show = (e) => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      let x, y;
      if (e.type === 'keydown' || e.clientX == null) { x = rect.width / 2; y = rect.height / 2; }
      else { x = e.clientX - rect.left; y = e.clientY - rect.top; }
      const ink = document.createElement('span');
      ink.className = 'w-ripple-ink';
      ink.style.width = ink.style.height = size + 'px';
      ink.style.left = (x - size / 2) + 'px';
      ink.style.top = (y - size / 2) + 'px';
      el.appendChild(ink);
      ink.addEventListener('animationend', () => ink.remove());
    };
    el.addEventListener('pointerdown', show);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') show(e);
    });
  }

  _esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Render the standard HTML5 validation attributes that are present on the
  // host as an attribute string for the contained native control, so the field
  // participates in <w-form> / native constraint validation. List the names a
  // given control supports; defaults cover text-like inputs.
  _validationAttrs(names = ['required', 'pattern', 'minlength', 'maxlength', 'min', 'max', 'step']) {
    return names.map((name) => {
      if (!this.hasAttribute(name)) return '';
      const value = this.getAttribute(name);
      return value === '' ? ` ${name}` : ` ${name}="${this._esc(value)}"`;
    }).join('');
  }

  _applyCommonProps() {
    const classes = [];
    const classAttrs = [
      ['color', 'text-'],
      ['bg-color', 'bg-'],
      ['base-color', 'w-base-color-'],
      ['active-color', 'w-active-color-'],
      ['density', 'w-density-'],
      ['elevation', 'elevation-'],
      ['location', 'w-location-'],
      ['position', 'w-position-'],
    ];

    classAttrs.forEach(([attr, prefix]) => {
      const value = this.getAttribute(attr);
      if (value) classes.push(this._commonClass(prefix, value));
    });

    if (this.hasAttribute('rounded')) {
      const value = this.getAttribute('rounded');
      classes.push(value && value !== 'true' ? 'rounded-' + value : 'rounded');
    }
    if (this.hasAttribute('border')) classes.push('w-border');
    if (this.hasAttribute('tile')) classes.push('rounded-0');
    if (this.hasAttribute('loading')) classes.push('w-common-loading');
    if (this.hasAttribute('readonly')) classes.push('w-common-readonly');
    if (this.hasAttribute('disabled')) classes.push('w-common-disabled');

    (this._wCommonClasses || []).forEach((name) => this.classList.remove(name));
    classes.forEach((name) => this.classList.add(name));
    this._wCommonClasses = classes;

    ['width', 'height', 'min-width', 'max-width'].forEach((name) => {
      const value = this.getAttribute(name);
      const prop = '--w-prop-' + name;
      if (value) this.style.setProperty(prop, value);
      else this.style.removeProperty(prop);
    });
    this.classList.toggle('w-has-width', this.hasAttribute('width'));
    this.classList.toggle('w-has-height', this.hasAttribute('height'));
    this.classList.toggle('w-has-min-width', this.hasAttribute('min-width'));
    this.classList.toggle('w-has-max-width', this.hasAttribute('max-width'));

    const disabled = this.hasAttribute('disabled');
    if (disabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');
    if ('inert' in this) this.inert = disabled;
  }

  _commonClass(prefix, value) {
    return prefix + String(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

// Make available globally for component modules
if (typeof window !== 'undefined') {
  window.WElement = WElement;
}
