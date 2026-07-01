// src/components/base.js
class WElement2 extends HTMLElement {
  static attrs = [
    "color",
    "bg-color",
    "base-color",
    "active-color",
    "density",
    "elevation",
    "rounded",
    "border",
    "tile",
    "width",
    "height",
    "min-width",
    "max-width",
    "location",
    "position",
    "loading",
    "disabled",
    "readonly"
  ];
  static get observedAttributes() {
    const attrs = [];
    let proto = this;
    while (proto && proto.attrs) {
      if (Array.isArray(proto.attrs))
        attrs.push(...proto.attrs);
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
    if (this._rendered || this._renderScheduled)
      return;
    this._renderScheduled = true;
    const schedule = typeof queueMicrotask === "function" ? queueMicrotask : (fn) => Promise.resolve().then(fn);
    schedule(() => {
      this._renderScheduled = false;
      if (!this.isConnected || this._rendered)
        return;
      this._render();
      this._rendered = true;
      if (typeof this._events === "function")
        this._events();
      this._applyCommonProps();
      this._bindShorthandEvents();
    });
  }
  _bindShorthandEvents() {
    const frameworkOwnsAt = typeof window !== "undefined" && !!window.Tac;
    Array.from(this.attributes).forEach((attr) => {
      const name = attr.name;
      let type;
      if (name[0] === "@") {
        if (frameworkOwnsAt)
          return;
        type = name.slice(1);
      } else if (name.length > 2 && name.startsWith("on") && !(name in this)) {
        type = name.slice(2);
      } else {
        return;
      }
      const handler = new Function("event", attr.value);
      this.addEventListener(type, (event) => handler.call(this, event));
    });
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._rendered)
      return;
    if (oldVal === newVal)
      return;
    if (this._skipRender)
      return;
    const props = this.constructor.props || {};
    const prop = props[name];
    if (prop && this[prop] !== newVal) {
      this[prop] = newVal;
    }
    this._render();
    if (typeof this._events === "function")
      this._events();
    this._applyCommonProps();
  }
  _render() {
    if (typeof this._template !== "function")
      return;
    const defaultChildren = [];
    const namedChildren = {};
    const currentSlots = this._rendered ? Array.from(this.querySelectorAll("slot")).filter((slot) => {
      var parent = slot.parentElement;
      while (parent && parent !== this) {
        if (parent.tagName && parent.tagName.toLowerCase().indexOf("w-") === 0)
          return false;
        parent = parent.parentElement;
      }
      return true;
    }) : [];
    if (currentSlots.length) {
      currentSlots.forEach(function(slot) {
        var name = slot.getAttribute("name");
        var source = Array.from(slot.childNodes);
        if (name)
          (namedChildren[name] || (namedChildren[name] = [])).push(...source);
        else
          defaultChildren.push(...source);
      });
    } else {
      Array.from(this.childNodes).forEach(function(node) {
        if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute("slot")) {
          var name = node.getAttribute("slot");
          (namedChildren[name] || (namedChildren[name] = [])).push(node);
        } else {
          defaultChildren.push(node);
        }
      });
    }
    this.innerHTML = this._template();
    var slots = this.querySelectorAll("slot");
    if (slots.length > 0) {
      slots.forEach(function(slot) {
        var name = slot.getAttribute("name");
        var source = name ? namedChildren[name] || [] : defaultChildren;
        source.forEach(function(node) {
          slot.appendChild(node);
        });
      });
    }
  }
  _attr(name, fallback) {
    const v = this.getAttribute(name);
    if (v != null)
      return v;
    if (name === "color") {
      const base = this.getAttribute("base-color");
      if (base != null)
        return base;
    }
    return fallback;
  }
  _bool(name) {
    if (this.hasAttribute(name))
      return true;
    return false;
  }
  _emit(name, detail) {
    const fire = (n) => this.dispatchEvent(new CustomEvent(n, { detail, bubbles: true, composed: true }));
    fire(name);
    if (name.includes(":"))
      fire(name.replace(/:/g, "-"));
  }
  _silentSet(name, value) {
    this._skipRender = true;
    try {
      if (value === null || value === undefined || value === false) {
        this.removeAttribute(name);
      } else {
        this.setAttribute(name, value === true ? "" : String(value));
      }
    } finally {
      this._skipRender = false;
    }
  }
  _q(selector) {
    return this.querySelector(selector);
  }
  _qAll(selector) {
    return this.querySelectorAll(selector);
  }
  _attachRipple(el) {
    if (!el || el._wRippleBound)
      return;
    el._wRippleBound = true;
    el.classList.add("w-ripple-host");
    const show = (e) => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      let x, y;
      if (e.type === "keydown" || e.clientX == null) {
        x = rect.width / 2;
        y = rect.height / 2;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      const ink = document.createElement("span");
      ink.className = "w-ripple-ink";
      ink.style.width = ink.style.height = size + "px";
      ink.style.left = x - size / 2 + "px";
      ink.style.top = y - size / 2 + "px";
      el.appendChild(ink);
      ink.addEventListener("animationend", () => ink.remove());
    };
    el.addEventListener("pointerdown", show);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar")
        show(e);
    });
  }
  _esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  _validationAttrs(names = ["required", "pattern", "minlength", "maxlength", "min", "max", "step"]) {
    return names.map((name) => {
      if (!this.hasAttribute(name))
        return "";
      const value = this.getAttribute(name);
      return value === "" ? ` ${name}` : ` ${name}="${this._esc(value)}"`;
    }).join("");
  }
  _applyCommonProps() {
    const classes = [];
    const classAttrs = [
      ["color", "text-"],
      ["bg-color", "bg-"],
      ["base-color", "w-base-color-"],
      ["active-color", "w-active-color-"],
      ["density", "w-density-"],
      ["elevation", "elevation-"],
      ["location", "w-location-"],
      ["position", "w-position-"]
    ];
    classAttrs.forEach(([attr, prefix]) => {
      const value = this.getAttribute(attr);
      if (value)
        classes.push(this._commonClass(prefix, value));
    });
    if (this.hasAttribute("rounded")) {
      const value = this.getAttribute("rounded");
      classes.push(value && value !== "true" ? "rounded-" + value : "rounded");
    }
    if (this.hasAttribute("border"))
      classes.push("w-border");
    if (this.hasAttribute("tile"))
      classes.push("rounded-0");
    if (this.hasAttribute("loading"))
      classes.push("w-common-loading");
    if (this.hasAttribute("readonly"))
      classes.push("w-common-readonly");
    if (this.hasAttribute("disabled"))
      classes.push("w-common-disabled");
    (this._wCommonClasses || []).forEach((name) => this.classList.remove(name));
    classes.forEach((name) => this.classList.add(name));
    this._wCommonClasses = classes;
    ["width", "height", "min-width", "max-width"].forEach((name) => {
      const value = this.getAttribute(name);
      const prop = "--w-prop-" + name;
      if (value)
        this.style.setProperty(prop, value);
      else
        this.style.removeProperty(prop);
    });
    this.classList.toggle("w-has-width", this.hasAttribute("width"));
    this.classList.toggle("w-has-height", this.hasAttribute("height"));
    this.classList.toggle("w-has-min-width", this.hasAttribute("min-width"));
    this.classList.toggle("w-has-max-width", this.hasAttribute("max-width"));
    const disabled = this.hasAttribute("disabled");
    if (disabled)
      this.setAttribute("aria-disabled", "true");
    else
      this.removeAttribute("aria-disabled");
    if ("inert" in this)
      this.inert = disabled;
  }
  _commonClass(prefix, value) {
    return prefix + String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  }
}
if (typeof window !== "undefined") {
  window.WElement = WElement2;
}

// src/components/duvay-motion.js
(function(root) {
  if (root.WMotion && root.WMotion.__wMotion) {
    if (typeof root.WMotion.init === "function")
      root.WMotion.init(document);
    return;
  }
  const TRANSITIONS = {
    fade: "w-fade-transition",
    scale: "w-scale-transition",
    "slide-x": "w-slide-x-transition",
    "slide-x-reverse": "w-slide-x-reverse-transition",
    "slide-y": "w-slide-y-transition",
    "slide-y-reverse": "w-slide-y-reverse-transition",
    "scroll-x": "w-scroll-x-transition",
    "scroll-x-reverse": "w-scroll-x-reverse-transition",
    "scroll-y": "w-scroll-y-transition",
    "scroll-y-reverse": "w-scroll-y-reverse-transition"
  };
  const flipState = new WeakMap;
  function prefersReducedMotion() {
    return !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  function duration(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  }
  function easing(value, fallback) {
    return value || fallback || "cubic-bezier(0.2, 0, 0, 1)";
  }
  function transitionClass(name) {
    return TRANSITIONS[name] || name || TRANSITIONS.fade;
  }
  function waitForTransition(el, ms, done) {
    let finished = false;
    const finish = () => {
      if (finished)
        return;
      finished = true;
      el.removeEventListener("transitionend", finish);
      done();
    };
    el.addEventListener("transitionend", finish, { once: true });
    root.setTimeout(finish, ms + 40);
  }
  function cleanTransition(el, cls) {
    el.classList.remove(cls, "w-enter-from", "w-enter-active", "w-leave-active", "w-leave-to");
    el.style.removeProperty("--w-motion-duration-local");
  }
  function enter(el, name, options) {
    if (!el)
      return Promise.resolve();
    const opts = options || {};
    const cls = transitionClass(name || el.getAttribute("data-w-transition") || "fade");
    const ms = duration(opts.duration || el.getAttribute("data-w-transition-duration"), 180);
    return new Promise((resolve) => {
      cleanTransition(el, cls);
      el.hidden = false;
      el.classList.remove("w-transition-hidden");
      el.classList.add(cls);
      if (prefersReducedMotion() || ms === 0) {
        cleanTransition(el, cls);
        resolve(el);
        return;
      }
      el.style.setProperty("--w-motion-duration-local", ms + "ms");
      el.classList.add("w-enter-from");
      el.offsetWidth;
      el.classList.add("w-enter-active");
      el.classList.remove("w-enter-from");
      waitForTransition(el, ms, () => {
        cleanTransition(el, cls);
        resolve(el);
      });
    });
  }
  function leave(el, name, options) {
    if (!el)
      return Promise.resolve();
    const opts = options || {};
    const cls = transitionClass(name || el.getAttribute("data-w-transition") || "fade");
    const ms = duration(opts.duration || el.getAttribute("data-w-transition-duration"), 180);
    return new Promise((resolve) => {
      cleanTransition(el, cls);
      el.classList.add(cls);
      if (prefersReducedMotion() || ms === 0) {
        el.hidden = opts.hide !== false;
        el.classList.toggle("w-transition-hidden", opts.hide !== false);
        cleanTransition(el, cls);
        resolve(el);
        return;
      }
      el.style.setProperty("--w-motion-duration-local", ms + "ms");
      el.classList.add("w-leave-active");
      el.offsetWidth;
      el.classList.add("w-leave-to");
      waitForTransition(el, ms, () => {
        if (opts.hide !== false) {
          el.hidden = true;
          el.classList.add("w-transition-hidden");
        }
        cleanTransition(el, cls);
        resolve(el);
      });
    });
  }
  function toggle(el, open, name, options) {
    const isOpen = open == null ? el.hidden || el.classList.contains("w-transition-hidden") || el.getAttribute("aria-hidden") === "true" : open;
    const run = isOpen ? enter : leave;
    return run(el, name, options).then(() => {
      if (el)
        el.setAttribute("aria-hidden", String(!isOpen));
      return el;
    });
  }
  function setExpand(panel, open, options) {
    if (!panel)
      return Promise.resolve();
    const body = panel.querySelector(".w-expand-body");
    if (!body) {
      panel.classList.toggle("open", !!open);
      return Promise.resolve(panel);
    }
    const next = open == null ? !panel.classList.contains("open") : !!open;
    const opts = options || {};
    const ms = duration(opts.duration || panel.getAttribute("data-w-expand-duration"), 180);
    const header = panel.querySelector(".w-expand-header, [data-w-expand-toggle]");
    if (header)
      header.setAttribute("aria-expanded", String(next));
    return new Promise((resolve) => {
      if (prefersReducedMotion() || ms === 0) {
        panel.classList.toggle("open", next);
        body.classList.remove("w-motion-expanding");
        body.style.height = "";
        body.style.opacity = "";
        resolve(panel);
        return;
      }
      body.classList.add("w-motion-expanding");
      body.style.overflow = "hidden";
      const start = panel.classList.contains("open") ? body.scrollHeight : 0;
      if (next)
        panel.classList.add("open");
      body.style.height = start + "px";
      body.style.opacity = next ? "0" : "1";
      body.style.transition = `height ${ms}ms ${easing(opts.easing, "cubic-bezier(0.2, 0, 0, 1)")}, opacity ${ms}ms ease`;
      body.offsetHeight;
      const end = next ? body.scrollHeight : 0;
      requestAnimationFrame(() => {
        body.style.height = end + "px";
        body.style.opacity = next ? "1" : "0";
      });
      waitForTransition(body, ms, () => {
        panel.classList.toggle("open", next);
        body.classList.remove("w-motion-expanding");
        body.style.height = "";
        body.style.opacity = "";
        body.style.overflow = "";
        body.style.transition = "";
        resolve(panel);
      });
    });
  }
  function flipItems(container, selector) {
    if (!container)
      return [];
    if (selector)
      return Array.from(container.querySelectorAll(selector));
    return Array.from(container.children).filter((el) => el.nodeType === 1);
  }
  function readRects(container, selector) {
    const rects = new Map;
    flipItems(container, selector).forEach((el) => {
      rects.set(el, el.getBoundingClientRect());
    });
    return rects;
  }
  function animateFlip(container, before, options) {
    const opts = options || {};
    const selector = opts.selector || container.getAttribute("data-w-flip-items");
    const ms = duration(opts.duration || container.getAttribute("data-w-flip-duration"), 260);
    const ease = easing(opts.easing, "cubic-bezier(0.2, 0, 0, 1)");
    const after = readRects(container, selector);
    if (prefersReducedMotion() || ms === 0) {
      flipState.set(container, after);
      return Promise.resolve(container);
    }
    const animations = [];
    after.forEach((newRect, el) => {
      const oldRect = before.get(el);
      if (!oldRect)
        return;
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5)
        return;
      animations.push(el.animate([
        { transform: `translate(${dx}px, ${dy}px)` },
        { transform: "translate(0, 0)" }
      ], { duration: ms, easing: ease }));
    });
    flipState.set(container, after);
    return Promise.all(animations.map((a) => a.finished.catch(() => {}))).then(() => container);
  }
  function flip(container, mutate, options) {
    if (!container)
      return Promise.resolve();
    const opts = options || {};
    const selector = opts.selector || container.getAttribute("data-w-flip-items");
    const before = readRects(container, selector);
    if (typeof mutate === "function")
      mutate();
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        animateFlip(container, before, Object.assign({}, opts, { selector })).then(resolve);
      });
    });
  }
  function watchFlip(container, options) {
    if (!container || flipState.has(container))
      return;
    const opts = options || {};
    const selector = opts.selector || container.getAttribute("data-w-flip-items");
    flipState.set(container, readRects(container, selector));
    const observer = new MutationObserver(() => {
      const before = flipState.get(container) || new Map;
      requestAnimationFrame(() => animateFlip(container, before, { selector }));
    });
    observer.observe(container, { childList: true });
  }
  function crossfade(from, to, options) {
    if (!from || !to)
      return Promise.resolve();
    const opts = options || {};
    const ms = duration(opts.duration, 260);
    const ease = easing(opts.easing, "cubic-bezier(0.2, 0, 0, 1)");
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const clone = from.cloneNode(true);
    clone.classList.add("w-motion-crossfade-clone");
    clone.removeAttribute("id");
    clone.style.left = a.left + "px";
    clone.style.top = a.top + "px";
    clone.style.width = a.width + "px";
    clone.style.height = a.height + "px";
    document.body.appendChild(clone);
    if (prefersReducedMotion() || ms === 0) {
      clone.remove();
      return Promise.resolve();
    }
    const sx = b.width && a.width ? b.width / a.width : 1;
    const sy = b.height && a.height ? b.height / a.height : 1;
    const animation = clone.animate([
      { opacity: 1, transform: "translate(0, 0) scale(1, 1)" },
      { opacity: 0.2, transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${sx}, ${sy})` }
    ], { duration: ms, easing: ease });
    return animation.finished.catch(() => {}).then(() => clone.remove());
  }
  function formatValue(value, options) {
    const opts = options || {};
    const format = opts.format || "integer";
    let text = format === "fixed-2" ? value.toFixed(2) : format === "fixed-1" ? value.toFixed(1) : format === "raw" ? String(value) : String(Math.round(value));
    return (opts.prefix || "") + text + (opts.suffix || "");
  }
  function applyValue(el, property, value, options) {
    const opts = options || {};
    const unit = opts.unit || "";
    if (!property || property === "text") {
      el.textContent = formatValue(value, opts);
    } else if (property === "width") {
      el.style.width = value + (unit || "%");
    } else if (property === "height") {
      el.style.height = value + (unit || "px");
    } else if (property === "opacity") {
      el.style.opacity = String(value);
    } else if (property === "scale") {
      el.style.transform = `scale(${value})`;
    } else if (property === "translateX") {
      el.style.transform = `translateX(${value}${unit || "px"})`;
    } else if (property === "translateY") {
      el.style.transform = `translateY(${value}${unit || "px"})`;
    } else if (property.indexOf("css:") === 0) {
      el.style.setProperty(property.slice(4), value + unit);
    } else if (property.indexOf("attr:") === 0) {
      el.setAttribute(property.slice(5), formatValue(value, opts));
    }
  }
  function tween(el, options) {
    if (!el)
      return Promise.resolve();
    const opts = options || {};
    const from = Number(opts.from != null ? opts.from : el.getAttribute("data-w-tween-from") || 0);
    const to = Number(opts.to != null ? opts.to : el.getAttribute("data-w-tween-to") || el.textContent || 0);
    const ms = duration(opts.duration || el.getAttribute("data-w-tween-duration"), 600);
    const property = opts.property || el.getAttribute("data-w-tween-property") || "text";
    const fmt = opts.format || el.getAttribute("data-w-tween-format") || "integer";
    const unit = opts.unit || el.getAttribute("data-w-tween-unit") || "";
    const prefix = opts.prefix || el.getAttribute("data-w-tween-prefix") || "";
    const suffix = opts.suffix || el.getAttribute("data-w-tween-suffix") || "";
    const ease = opts.easingFn || ((t) => 1 - Math.pow(1 - t, 3));
    return new Promise((resolve) => {
      if (prefersReducedMotion() || ms === 0 || !Number.isFinite(from) || !Number.isFinite(to)) {
        applyValue(el, property, to, { format: fmt, unit, prefix, suffix });
        resolve(el);
        return;
      }
      const start = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - start) / ms);
        const value = from + (to - from) * ease(t);
        applyValue(el, property, value, { format: fmt, unit, prefix, suffix });
        if (t < 1)
          requestAnimationFrame(frame);
        else
          resolve(el);
      }
      requestAnimationFrame(frame);
    });
  }
  function spring(el, options) {
    if (!el)
      return Promise.resolve();
    const opts = options || {};
    const from = Number(opts.from != null ? opts.from : el.getAttribute("data-w-spring-from") || 0);
    const to = Number(opts.to != null ? opts.to : el.getAttribute("data-w-spring-to") || 1);
    const property = opts.property || el.getAttribute("data-w-spring-property") || "scale";
    const unit = opts.unit || el.getAttribute("data-w-spring-unit") || "";
    const stiffness = Number(opts.stiffness || el.getAttribute("data-w-spring-stiffness") || 0.14);
    const damping = Number(opts.damping || el.getAttribute("data-w-spring-damping") || 0.76);
    return new Promise((resolve) => {
      if (prefersReducedMotion() || !Number.isFinite(from) || !Number.isFinite(to)) {
        applyValue(el, property, to, { unit, format: "raw" });
        resolve(el);
        return;
      }
      let value = from;
      let velocity = 0;
      let frames = 0;
      function frame() {
        const force = (to - value) * stiffness;
        velocity = (velocity + force) * damping;
        value += velocity;
        applyValue(el, property, value, { unit, format: "raw" });
        frames += 1;
        if (Math.abs(to - value) < 0.001 && Math.abs(velocity) < 0.001 || frames > 180) {
          applyValue(el, property, to, { unit, format: "raw" });
          resolve(el);
        } else {
          requestAnimationFrame(frame);
        }
      }
      requestAnimationFrame(frame);
    });
  }
  function targetById(value) {
    if (!value)
      return null;
    return document.getElementById(value) || document.querySelector(value);
  }
  function init(rootNode) {
    const scope = rootNode || document;
    scope.querySelectorAll("[data-w-flip]").forEach((el) => watchFlip(el));
    scope.querySelectorAll("[data-w-tween]").forEach((el) => {
      if (el.dataset.wTweenReady)
        return;
      el.dataset.wTweenReady = "1";
      if (el.getAttribute("data-w-tween-auto") !== "false")
        tween(el);
    });
    scope.querySelectorAll("[data-w-spring]").forEach((el) => {
      if (el.dataset.wSpringReady)
        return;
      el.dataset.wSpringReady = "1";
      if (el.getAttribute("data-w-spring-auto") !== "false")
        spring(el);
    });
  }
  document.addEventListener("click", function(event) {
    const transitionTrigger = event.target.closest("[data-w-transition-toggle]");
    if (transitionTrigger) {
      const target = targetById(transitionTrigger.getAttribute("data-w-transition-toggle"));
      const name = transitionTrigger.getAttribute("data-w-transition-name") || target?.getAttribute("data-w-transition") || "fade";
      if (target)
        toggle(target, null, name);
      return;
    }
    const flipTrigger = event.target.closest("[data-w-flip-reorder]");
    if (flipTrigger) {
      const container = targetById(flipTrigger.getAttribute("data-w-flip-reorder"));
      if (!container)
        return;
      const mode = flipTrigger.getAttribute("data-w-flip-mode") || "reverse";
      const selector = container.getAttribute("data-w-flip-items");
      flip(container, () => {
        const items = flipItems(container, selector);
        const parent = items[0] && items[0].parentElement ? items[0].parentElement : container;
        const ordered = mode === "rotate" ? items.slice(1).concat(items[0]) : items.reverse();
        ordered.forEach((item) => parent.appendChild(item));
      });
      return;
    }
    const crossTrigger = event.target.closest("[data-w-crossfade]");
    if (crossTrigger) {
      const parts = crossTrigger.getAttribute("data-w-crossfade").split(/[:,\s]+/).filter(Boolean);
      const first = document.querySelector('[data-w-crossfade-key="' + parts[0] + '"]');
      const second = document.querySelector('[data-w-crossfade-key="' + parts[1] + '"]');
      let from = first;
      let to = second;
      if (crossTrigger.hasAttribute("data-w-crossfade-toggle") && first && second) {
        const firstHidden = first.hidden || first.classList.contains("w-transition-hidden");
        from = firstHidden ? second : first;
        to = firstHidden ? first : second;
      }
      if (!from || !to)
        return;
      const toHidden = to.hidden || to.classList.contains("w-transition-hidden");
      if (toHidden) {
        to.hidden = false;
        to.classList.remove("w-transition-hidden");
      }
      crossfade(from, to).then(() => {
        if (crossTrigger.hasAttribute("data-w-crossfade-toggle")) {
          from.hidden = true;
          from.classList.add("w-transition-hidden");
        }
      });
      return;
    }
    const tweenTrigger = event.target.closest("[data-w-tween-start]");
    if (tweenTrigger) {
      const target = targetById(tweenTrigger.getAttribute("data-w-tween-start"));
      if (target)
        tween(target);
      return;
    }
    const springTrigger = event.target.closest("[data-w-spring-start]");
    if (springTrigger) {
      const target = targetById(springTrigger.getAttribute("data-w-spring-start"));
      if (target)
        spring(target);
    }
  });
  root.WMotion = {
    __wMotion: true,
    prefersReducedMotion,
    enter,
    leave,
    toggle,
    setExpand,
    flip,
    watchFlip,
    crossfade,
    tween,
    spring,
    init
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init(document), { once: true });
  } else {
    init(document);
  }
})(window);

// src/icons.js
function escClass(s) {
  return String(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
var DEFAULTS = {
  text: {
    type: "text",
    render(name, _set, { iconClass = "w-icon" } = {}) {
      return `<span class="${escClass(iconClass)}" aria-hidden="true">${name}</span>`;
    }
  },
  ligature: {
    type: "ligature",
    render(name, _set, { iconClass = "w-icon" } = {}) {
      return `<span class="${escClass(iconClass)}" aria-hidden="true">${name}</span>`;
    }
  },
  class: {
    type: "class",
    prefix: "",
    render(name, set, { iconClass = "w-icon" } = {}) {
      const cls = [iconClass, set.prefix, name].filter(Boolean).join(" ");
      return `<span class="${escClass(cls)}" aria-hidden="true"></span>`;
    }
  },
  svg: {
    type: "svg",
    viewBox: "0 0 24 24",
    paths: {},
    render(name, set, { iconClass = "w-icon" } = {}) {
      const path = set.paths?.[name];
      if (!path)
        return DEFAULTS.text.render(name, set, { iconClass });
      return `<svg class="${escClass(iconClass)}" viewBox="${set.viewBox}" aria-hidden="true">${path}</svg>`;
    }
  },
  component: {
    type: "component",
    render(name, _set, { iconClass = "w-icon" } = {}) {
      return `<${name} class="${escClass(iconClass)}" aria-hidden="true"></${name}>`;
    }
  }
};
var WIcons = {
  sets: { ...DEFAULTS },
  aliases: {},
  defaultSet: "text",
  set(name, config) {
    this.sets[name] = { ...DEFAULTS[config.type], ...config };
    return this;
  },
  alias(name, value) {
    this.aliases[name] = value;
    return this;
  },
  resolve(value, { iconClass = "w-icon" } = {}) {
    if (value == null)
      return "";
    let raw = String(value);
    if (raw.startsWith("$")) {
      const key = raw.slice(1);
      raw = this.aliases[key] ?? raw;
    }
    let setName = this.defaultSet;
    let iconName = raw;
    const idx = raw.indexOf(":");
    if (idx > 0) {
      setName = raw.slice(0, idx);
      iconName = raw.slice(idx + 1);
    }
    const set = this.sets[setName] || this.sets.text;
    return set.render(iconName, set, { iconClass });
  }
};
if (!globalThis.WIcons)
  globalThis.WIcons = WIcons;
var icons_default = WIcons;

// src/components/btn.js
class WBtn extends WElement {
  static attrs = ["variant", "color", "size", "disabled", "href", "loading", "icon", "icon-set", "prepend-icon", "append-icon", "block", "stacked", "active", "aria-label", "ripple"];
  static props = {
    variant: "variant",
    color: "color",
    size: "size",
    href: "href",
    icon: "icon",
    "prepend-icon": "prependIcon",
    "append-icon": "appendIcon"
  };
  get variant() {
    return this._attr("variant", "text");
  }
  set variant(v) {
    if (v)
      this.setAttribute("variant", v);
    else
      this.removeAttribute("variant");
  }
  get color() {
    return this._attr("color", "");
  }
  set color(v) {
    if (v)
      this.setAttribute("color", v);
    else
      this.removeAttribute("color");
  }
  get size() {
    return this._attr("size", "");
  }
  set size(v) {
    if (v)
      this.setAttribute("size", v);
    else
      this.removeAttribute("size");
  }
  get disabled() {
    return this._bool("disabled");
  }
  set disabled(v) {
    v ? this.setAttribute("disabled", "") : this.removeAttribute("disabled");
  }
  get href() {
    return this.getAttribute("href");
  }
  set href(v) {
    if (v)
      this.setAttribute("href", v);
    else
      this.removeAttribute("href");
  }
  get loading() {
    return this._bool("loading");
  }
  set loading(v) {
    v ? this.setAttribute("loading", "") : this.removeAttribute("loading");
  }
  get icon() {
    return this._attr("icon", "");
  }
  set icon(v) {
    if (v)
      this.setAttribute("icon", v);
    else
      this.removeAttribute("icon");
  }
  get prependIcon() {
    return this._attr("prepend-icon", "") || this._attr("icon", "");
  }
  set prependIcon(v) {
    if (v)
      this.setAttribute("prepend-icon", v);
    else
      this.removeAttribute("prepend-icon");
  }
  get appendIcon() {
    return this._attr("append-icon", "");
  }
  set appendIcon(v) {
    if (v)
      this.setAttribute("append-icon", v);
    else
      this.removeAttribute("append-icon");
  }
  get block() {
    return this._bool("block");
  }
  set block(v) {
    v ? this.setAttribute("block", "") : this.removeAttribute("block");
  }
  get stacked() {
    return this._bool("stacked");
  }
  set stacked(v) {
    v ? this.setAttribute("stacked", "") : this.removeAttribute("stacked");
  }
  get active() {
    return this._bool("active");
  }
  set active(v) {
    v ? this.setAttribute("active", "") : this.removeAttribute("active");
  }
  _template() {
    const v = this.variant;
    const c = this.color;
    const sz = this.size ? " w-btn--" + this.size : "";
    const ariaLabel = this.getAttribute("aria-label") || "";
    const isDisabled = this.disabled ? " disabled" : "";
    const isLoading = this.loading ? " w-loading" : "";
    const isActive = this.active ? " active" : "";
    const blockClass = this.block ? " w-btn-block" : "";
    const stackedClass = this.stacked ? " w-btn-stacked" : "";
    const ariaBusy = this.loading ? ' aria-busy="true"' : "";
    const href = this.href;
    const iconSet = this.getAttribute("icon-set") || "";
    const prependValue = this.prependIcon ? iconSet ? `${iconSet}:${this.prependIcon}` : this.prependIcon : "";
    const appendValue = this.appendIcon ? iconSet ? `${iconSet}:${this.appendIcon}` : this.appendIcon : "";
    const prependIcon = prependValue ? icons_default.resolve(prependValue, { iconClass: "w-icon w-btn-leading-icon" }) : "";
    const appendIcon = appendValue ? icons_default.resolve(appendValue, { iconClass: "w-icon w-btn-append-icon" }) : "";
    const variantClass = v === "danger" || v === "primary-text" || v === "icon" ? " w-btn-" + v : v !== "text" ? " w-btn-" + v : "";
    const colorClass = c ? " w-btn-" + c : "";
    const classes = `w-btn${variantClass}${colorClass}${sz}${isDisabled}${isLoading}${isActive}${blockClass}${stackedClass}`;
    if (href && !this.disabled) {
      return `<a class="${classes}" href="${href}"${ariaBusy}${ariaLabel ? ' aria-label="' + ariaLabel + '"' : ""}>
        ${prependIcon}<slot></slot>${appendIcon}
      </a>`;
    }
    return `<button class="${classes}"${isDisabled}${ariaBusy}${ariaLabel ? ' aria-label="' + ariaLabel + '"' : ""}>
      ${prependIcon}<slot></slot>${appendIcon}
    </button>`;
  }
  _events() {
    const btn = this._q("button, a");
    if (!btn)
      return;
    if (this.hasAttribute("ripple"))
      this._attachRipple(btn);
    btn.addEventListener("focus", () => this._emit("focus"));
    btn.addEventListener("blur", () => this._emit("blur"));
  }
}
customElements.define("w-btn", WBtn);

// src/components/input.js
class WInput extends WElement {
  static attrs = [
    "type",
    "placeholder",
    "value",
    "disabled",
    "readonly",
    "name",
    "label",
    "hint",
    "error",
    "size",
    "required",
    "pattern",
    "minlength",
    "maxlength",
    "min",
    "max",
    "step"
  ];
  get type() {
    return this._attr("type", "text");
  }
  get placeholder() {
    return this._attr("placeholder", "");
  }
  get value() {
    return this._value !== undefined ? this._value : this._attr("value", "");
  }
  set value(v) {
    this._value = v;
    const input = this._q("input");
    if (input)
      input.value = v;
    this._silentSet("value", v);
  }
  get disabled() {
    return this._bool("disabled");
  }
  get readonly() {
    return this._bool("readonly");
  }
  get name() {
    return this._attr("name", "");
  }
  get label() {
    return this._attr("label", "");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get error() {
    return this._attr("error", "");
  }
  get size() {
    return this._attr("size", "");
  }
  _template() {
    const t = this.type;
    const ph = this.placeholder ? ` placeholder="${this._esc(this.placeholder)}"` : "";
    const val = this.value ? ` value="${this._esc(this.value)}"` : "";
    const isDisabled = this.disabled ? " disabled" : "";
    const isReadonly = this.readonly ? " readonly" : "";
    const nameAttr = this.name ? ` name="${this._esc(this.name)}"` : "";
    const sizeClass = this.size ? " w-input--" + this.size : "";
    const input = `<input type="${t}"
      class="w-input${sizeClass}"
      ${ph}${val}${isDisabled}${isReadonly}${nameAttr}${this._validationAttrs()}
      data-w-input>`;
    const lbl = this.label;
    const hint = this.hint;
    const error = this.error;
    if (lbl || hint || error) {
      const fieldClass = error ? "w-field w-field-error" : "w-field";
      let html = `<div class="${fieldClass}">`;
      if (lbl)
        html += `<label class="w-field-label">${this._esc(lbl)}</label>`;
      html += input;
      if (error)
        html += `<span class="w-field-hint">${this._esc(error)}</span>`;
      else if (hint)
        html += `<span class="w-field-hint">${this._esc(hint)}</span>`;
      html += `</div>`;
      return html;
    }
    return input;
  }
  _events() {
    const inp = this._q("input");
    if (!inp)
      return;
    inp.addEventListener("input", (event) => {
      event.stopPropagation();
      this._emit("input", { value: inp.value, name: this.name });
    });
    inp.addEventListener("change", (event) => {
      event.stopPropagation();
      this._emit("change", { value: inp.value, name: this.name });
    });
  }
  focus() {
    const inp = this._q("input");
    if (inp)
      inp.focus();
  }
}
customElements.define("w-input", WInput);

// src/components/textarea.js
class WTextarea extends WElement {
  static attrs = [
    "label",
    "placeholder",
    "value",
    "name",
    "variant",
    "density",
    "size",
    "color",
    "rows",
    "auto-grow",
    "max-rows",
    "no-resize",
    "prefix",
    "suffix",
    "prepend-inner-icon",
    "append-inner-icon",
    "icon-set",
    "clearable",
    "counter",
    "loading",
    "hint",
    "persistent-hint",
    "error",
    "hide-details",
    "disabled",
    "readonly",
    "autofocus",
    "required",
    "minlength",
    "maxlength"
  ];
  get label() {
    return this._attr("label", "");
  }
  get placeholder() {
    return this._attr("placeholder", "");
  }
  get value() {
    return this._value !== undefined ? this._value : this._attr("value", "");
  }
  set value(v) {
    this._value = v == null ? "" : String(v);
    const ta = this._q("textarea");
    if (ta)
      ta.value = this._value;
    this._silentSet("value", this._value);
    this._sync();
  }
  get name() {
    return this._attr("name", "");
  }
  get variant() {
    return this._attr("variant", "outlined");
  }
  get density() {
    return this._attr("density", "default");
  }
  get size() {
    return this._attr("size", "");
  }
  get color() {
    return this._attr("color", "");
  }
  get rows() {
    return this._attr("rows", "4");
  }
  get autoGrow() {
    return this._bool("auto-grow");
  }
  get maxRows() {
    return this._attr("max-rows", "");
  }
  get noResize() {
    return this._bool("no-resize");
  }
  get prefix() {
    return this._attr("prefix", "");
  }
  get suffix() {
    return this._attr("suffix", "");
  }
  get clearable() {
    return this._bool("clearable");
  }
  get counter() {
    return this.hasAttribute("counter");
  }
  get loading() {
    return this._bool("loading");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get persistentHint() {
    return this._bool("persistent-hint");
  }
  get error() {
    return this._attr("error", "");
  }
  get hideDetails() {
    return this._bool("hide-details");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get readonly() {
    return this._bool("readonly");
  }
  get maxlength() {
    return this._attr("maxlength", "");
  }
  get prependInnerIcon() {
    return this._attr("prepend-inner-icon", "");
  }
  get appendInnerIcon() {
    return this._attr("append-inner-icon", "");
  }
  get iconSet() {
    return this._attr("icon-set", "");
  }
  _icon(name) {
    if (!name)
      return "";
    const value = this.iconSet ? `${this.iconSet}:${name}` : name;
    return icons_default.resolve(value, { iconClass: "w-icon w-text-field-icon" });
  }
  _innerHtml(side) {
    const icon = this._icon(side === "prepend" ? this.prependInnerIcon : this.appendInnerIcon);
    const slotName = side + "-inner";
    if (!icon && !this.querySelector('[slot="' + slotName + '"]'))
      return "";
    return `<span class="w-text-field-${slotName}">${icon}<slot name="${slotName}"></slot></span>`;
  }
  _template() {
    const cls = [
      "w-text-field",
      "w-text-field--textarea",
      "w-text-field--" + this._esc(this.variant),
      "w-text-field--density-" + this._esc(this.density),
      this.size ? "w-text-field--" + this._esc(this.size) : "",
      this.noResize || this.autoGrow ? "w-text-field--no-resize" : "",
      this.disabled ? "w-text-field--disabled" : "",
      this.readonly ? "w-text-field--readonly" : "",
      this.loading ? "w-text-field--loading" : "",
      this.error ? "w-text-field--error" : "",
      this.label ? "w-text-field--floating" : "",
      this.value !== "" ? "w-text-field--has-value" : ""
    ].filter(Boolean).join(" ");
    const style = this.color ? ` style="--w-tf-accent:var(--w-${this._esc(this.color)})"` : "";
    const ph = this.placeholder ? ` placeholder="${this._esc(this.placeholder)}"` : this.label ? ' placeholder=" "' : "";
    const dis = this.disabled ? " disabled" : "";
    const ro = this.readonly ? " readonly" : "";
    const af = this._bool("autofocus") ? " autofocus" : "";
    const nm = this.name ? ` name="${this._esc(this.name)}"` : "";
    const rows = ` rows="${this._esc(this.rows)}"`;
    const aria = !this.label && this.placeholder ? ` aria-label="${this._esc(this.placeholder)}"` : "";
    const invalid = this.error ? ' aria-invalid="true"' : "";
    const textarea = `<textarea class="w-text-field-input w-text-field-textarea"${ph}${dis}${ro}${af}${nm}${rows}${aria}${invalid}${this._validationAttrs(["required", "minlength", "maxlength"])} data-w-tf-input>${this._esc(this.value)}</textarea>`;
    const labelEl = this.label ? `<label class="w-text-field-label">${this._esc(this.label)}</label>` : "";
    const prefix = this.prefix ? `<span class="w-text-field-affix w-text-field-prefix">${this._esc(this.prefix)}</span>` : "";
    const suffix = this.suffix ? `<span class="w-text-field-affix w-text-field-suffix">${this._esc(this.suffix)}</span>` : "";
    const clear = this.clearable ? `<button type="button" class="w-text-field-clear" tabindex="-1" aria-label="Clear">&times;</button>` : "";
    const loader = this.loading ? `<span class="w-text-field-loader" aria-hidden="true"></span>` : "";
    return `<div class="${cls}"${style}>
      <div class="w-text-field-control">
        ${this._innerHtml("prepend")}
        ${prefix}
        <span class="w-text-field-field">
          ${textarea}
          ${labelEl}
        </span>
        ${suffix}
        ${clear}
        ${this._innerHtml("append")}
        ${loader}
      </div>
      ${this._detailsHtml()}
    </div>`;
  }
  _detailsHtml() {
    if (this.hideDetails)
      return "";
    const msg = this.error || this.hint;
    const counterEl = this.counter ? `<span class="w-text-field-counter">${this._counterText()}</span>` : "";
    if (!msg && !counterEl)
      return "";
    const msgEl = `<span class="w-text-field-messages">${this._esc(msg)}</span>`;
    return `<div class="w-text-field-details">${msgEl}${counterEl}</div>`;
  }
  _counterText() {
    const len = (this.value || "").length;
    return this.maxlength ? `${len} / ${this.maxlength}` : String(len);
  }
  _events() {
    const ta = this._q("textarea");
    if (!ta)
      return;
    ta.addEventListener("input", (event) => {
      event.stopPropagation();
      this._value = ta.value;
      this._silentSet("value", ta.value);
      this._sync();
      this._emit("input", { value: ta.value, name: this.name });
    });
    ta.addEventListener("change", (event) => {
      event.stopPropagation();
      this._emit("change", { value: ta.value, name: this.name });
    });
    const clearBtn = this._q(".w-text-field-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        ta.value = "";
        this._value = "";
        this._silentSet("value", "");
        this._sync();
        ta.focus();
        this._emit("input", { value: "", name: this.name });
        this._emit("clear", { name: this.name });
      });
    }
    this._sync();
  }
  _sync() {
    const root = this._q(".w-text-field");
    if (root)
      root.classList.toggle("w-text-field--has-value", (this.value || "") !== "");
    const counter = this._q(".w-text-field-counter");
    if (counter)
      counter.textContent = this._counterText();
    this._autoGrow();
  }
  _autoGrow() {
    if (!this.autoGrow)
      return;
    const ta = this._q("textarea");
    if (!ta)
      return;
    ta.style.height = "auto";
    let height = ta.scrollHeight;
    if (this.maxRows) {
      const cs = getComputedStyle(ta);
      const line = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
      const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      const max = line * Number(this.maxRows) + pad;
      if (height > max) {
        height = max;
        ta.style.overflowY = "auto";
      } else
        ta.style.overflowY = "hidden";
    } else {
      ta.style.overflowY = "hidden";
    }
    ta.style.height = height + "px";
  }
  focus() {
    const ta = this._q("textarea");
    if (ta)
      ta.focus();
  }
}
customElements.define("w-textarea", WTextarea);

// src/components/text-field.js
class WTextField extends WElement {
  static attrs = [
    "type",
    "label",
    "placeholder",
    "value",
    "name",
    "variant",
    "density",
    "size",
    "color",
    "prefix",
    "suffix",
    "clearable",
    "counter",
    "loading",
    "hint",
    "persistent-hint",
    "error",
    "rounded",
    "single-line",
    "hide-details",
    "prepend-inner-icon",
    "append-inner-icon",
    "icon-set",
    "disabled",
    "readonly",
    "autofocus",
    "required",
    "pattern",
    "minlength",
    "maxlength",
    "min",
    "max",
    "step"
  ];
  get type() {
    return this._attr("type", "text");
  }
  get label() {
    return this._attr("label", "");
  }
  get placeholder() {
    return this._attr("placeholder", "");
  }
  get value() {
    return this._value !== undefined ? this._value : this._attr("value", "");
  }
  set value(v) {
    this._value = v == null ? "" : String(v);
    const input = this._q("input");
    if (input)
      input.value = this._value;
    this._silentSet("value", this._value);
    this._sync();
  }
  get name() {
    return this._attr("name", "");
  }
  get variant() {
    return this._attr("variant", "outlined");
  }
  get density() {
    return this._attr("density", "default");
  }
  get size() {
    return this._attr("size", "");
  }
  get color() {
    return this._attr("color", "");
  }
  get prefix() {
    return this._attr("prefix", "");
  }
  get suffix() {
    return this._attr("suffix", "");
  }
  get clearable() {
    return this._bool("clearable");
  }
  get counter() {
    return this.hasAttribute("counter");
  }
  get loading() {
    return this._bool("loading");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get persistentHint() {
    return this._bool("persistent-hint");
  }
  get error() {
    return this._attr("error", "");
  }
  get rounded() {
    return this._bool("rounded");
  }
  get singleLine() {
    return this._bool("single-line");
  }
  get hideDetails() {
    return this._bool("hide-details");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get readonly() {
    return this._bool("readonly");
  }
  get maxlength() {
    return this._attr("maxlength", "");
  }
  get prependInnerIcon() {
    return this._attr("prepend-inner-icon", "");
  }
  get appendInnerIcon() {
    return this._attr("append-inner-icon", "");
  }
  get iconSet() {
    return this._attr("icon-set", "");
  }
  _icon(name) {
    if (!name)
      return "";
    const value = this.iconSet ? `${this.iconSet}:${name}` : name;
    return icons_default.resolve(value, { iconClass: "w-icon w-text-field-icon" });
  }
  _innerHtml(side) {
    const icon = this._icon(side === "prepend" ? this.prependInnerIcon : this.appendInnerIcon);
    const slotName = side + "-inner";
    const hasSlotted = !!this.querySelector('[slot="' + slotName + '"]');
    if (!icon && !hasSlotted)
      return "";
    return `<span class="w-text-field-${slotName}">${icon}<slot name="${slotName}"></slot></span>`;
  }
  get _floating() {
    return !!this.label && !this.singleLine && this.variant !== "solo";
  }
  _template() {
    const cls = [
      "w-text-field",
      "w-text-field--" + this._esc(this.variant),
      "w-text-field--density-" + this._esc(this.density),
      this.size ? "w-text-field--" + this._esc(this.size) : "",
      this.rounded ? "w-text-field--rounded" : "",
      this.disabled ? "w-text-field--disabled" : "",
      this.readonly ? "w-text-field--readonly" : "",
      this.loading ? "w-text-field--loading" : "",
      this.error ? "w-text-field--error" : "",
      this._floating ? "w-text-field--floating" : "",
      this.persistentHint ? "w-text-field--persistent-hint" : "",
      this.value !== "" ? "w-text-field--has-value" : ""
    ].filter(Boolean).join(" ");
    const style = this.color ? ` style="--w-tf-accent:var(--w-${this._esc(this.color)})"` : "";
    const floating = this._floating;
    const phText = floating ? this.placeholder || " " : this.placeholder || (this.label && (this.singleLine || this.variant === "solo") ? this.label : " ");
    const ph = ` placeholder="${this._esc(phText)}"`;
    const val = this.value !== "" ? ` value="${this._esc(this.value)}"` : "";
    const dis = this.disabled ? " disabled" : "";
    const ro = this.readonly ? " readonly" : "";
    const af = this._bool("autofocus") ? " autofocus" : "";
    const nm = this.name ? ` name="${this._esc(this.name)}"` : "";
    const ariaText = !floating && this.label ? this.label : !this.label ? this.placeholder : "";
    const aria = ariaText ? ` aria-label="${this._esc(ariaText)}"` : "";
    const invalid = this.error ? ' aria-invalid="true"' : "";
    const input = `<input class="w-text-field-input" type="${this._esc(this.type)}"${ph}${val}${dis}${ro}${af}${nm}${aria}${invalid}${this._validationAttrs()} data-w-tf-input>`;
    const labelEl = floating ? `<label class="w-text-field-label">${this._esc(this.label)}</label>` : "";
    const prefix = this.prefix ? `<span class="w-text-field-affix w-text-field-prefix">${this._esc(this.prefix)}</span>` : "";
    const suffix = this.suffix ? `<span class="w-text-field-affix w-text-field-suffix">${this._esc(this.suffix)}</span>` : "";
    const clear = this.clearable ? `<button type="button" class="w-text-field-clear" tabindex="-1" aria-label="Clear">&times;</button>` : "";
    const loader = this.loading ? `<span class="w-text-field-loader" aria-hidden="true"></span>` : "";
    const details = this._detailsHtml();
    return `<div class="${cls}"${style}>
      <div class="w-text-field-control">
        ${this._innerHtml("prepend")}
        ${prefix}
        <span class="w-text-field-field">
          ${input}
          ${labelEl}
        </span>
        ${suffix}
        ${clear}
        ${this._innerHtml("append")}
        ${loader}
      </div>
      ${details}
    </div>`;
  }
  _detailsHtml() {
    if (this.hideDetails)
      return "";
    const msg = this.error || this.hint;
    const msgEl = msg ? `<span class="w-text-field-messages">${this._esc(msg)}</span>` : '<span class="w-text-field-messages"></span>';
    const counterEl = this.counter ? `<span class="w-text-field-counter">${this._counterText()}</span>` : "";
    if (!msg && !counterEl)
      return "";
    return `<div class="w-text-field-details">${msgEl}${counterEl}</div>`;
  }
  _counterText() {
    const len = (this.value || "").length;
    return this.maxlength ? `${len} / ${this.maxlength}` : String(len);
  }
  _events() {
    const inp = this._q("input");
    if (!inp)
      return;
    inp.addEventListener("input", (event) => {
      event.stopPropagation();
      this._value = inp.value;
      this._silentSet("value", inp.value);
      this._sync();
      this._emit("input", { value: inp.value, name: this.name });
    });
    inp.addEventListener("change", (event) => {
      event.stopPropagation();
      this._emit("change", { value: inp.value, name: this.name });
    });
    const clearBtn = this._q(".w-text-field-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        inp.value = "";
        this._value = "";
        this._silentSet("value", "");
        this._sync();
        inp.focus();
        this._emit("input", { value: "", name: this.name });
        this._emit("clear", { name: this.name });
      });
    }
    this._sync();
  }
  _sync() {
    const root = this._q(".w-text-field");
    if (root)
      root.classList.toggle("w-text-field--has-value", (this.value || "") !== "");
    const counter = this._q(".w-text-field-counter");
    if (counter)
      counter.textContent = this._counterText();
  }
  focus() {
    const inp = this._q("input");
    if (inp)
      inp.focus();
  }
}
customElements.define("w-text-field", WTextField);

// src/components/checkbox.js
class WCheckbox extends WElement {
  static attrs = ["checked", "indeterminate", "disabled", "readonly", "name", "value", "label", "color", "size", "hint", "error", "hide-details"];
  get checked() {
    return this._deriveChecked();
  }
  set checked(v) {
    v ? this.setAttribute("checked", "") : this.removeAttribute("checked");
  }
  get indeterminate() {
    return this._bool("indeterminate");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get readonly() {
    return this._bool("readonly");
  }
  get name() {
    return this._attr("name", "");
  }
  get value() {
    return this._attr("value", "on");
  }
  get label() {
    return this._attr("label", "");
  }
  get color() {
    return this._attr("color", "");
  }
  get size() {
    return this._attr("size", "md");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get error() {
    return this._attr("error", "");
  }
  get hideDetails() {
    return this._bool("hide-details");
  }
  _deriveChecked() {
    return this.hasAttribute("checked");
  }
  _template() {
    const chk = this.checked ? " checked" : "";
    const dis = this.disabled ? " disabled" : "";
    const ro = this.readonly ? " readonly" : "";
    const nm = this.name ? ` name="${this._esc(this.name)}"` : "";
    const val = this.value ? ` value="${this._esc(this.value)}"` : "";
    const mixed = this.indeterminate ? ' aria-checked="mixed"' : "";
    const invalid = this.error ? ' aria-invalid="true"' : "";
    const colorClass = this.color ? ` w-checkbox--${this._esc(this.color)}` : "";
    const sizeClass = ` w-checkbox--${this._esc(this.size || "md")}`;
    const errorClass = this.error ? " w-checkbox--error" : "";
    const input = `<input class="w-checkbox-input" type="checkbox"${chk}${dis}${ro}${nm}${val}${mixed}${invalid}>`;
    let text = "";
    if (this.label) {
      text = `<span class="w-checkbox-label">${this._esc(this.label)}</span>`;
    } else {
      text = `<span class="w-checkbox-label"><slot></slot></span>`;
    }
    let details = "";
    if (!this.hideDetails) {
      if (this.error) {
        details += `<span class="w-checkbox-error">${this._esc(this.error)}</span>`;
      } else if (this.hint) {
        details += `<span class="w-checkbox-hint">${this._esc(this.hint)}</span>`;
      }
    }
    if (details) {
      text = `<span class="w-checkbox-text">${text}${details}</span>`;
    }
    return `<label class="w-checkbox${colorClass}${sizeClass}${errorClass}">${input}<span class="w-checkbox-box" aria-hidden="true"></span>${text}</label>`;
  }
  _events() {
    const inp = this._q('input[type="checkbox"]');
    if (!inp)
      return;
    inp.indeterminate = this.indeterminate;
    inp.addEventListener("click", (e) => {
      if (this.readonly || this.disabled) {
        e.preventDefault();
        return;
      }
    });
    inp.addEventListener("change", (event) => {
      event.stopPropagation();
      if (this.readonly || this.disabled)
        return;
      const checked = inp.checked;
      const value = this.value;
      this._silentSet("checked", checked);
      this._silentSet("indeterminate", false);
      this._emit("change", { checked, indeterminate: false, name: this.name, value });
    });
  }
}
customElements.define("w-checkbox", WCheckbox);

// src/components/radio.js
class WRadio extends WElement {
  static attrs = ["checked", "disabled", "name", "value", "label", "color", "size"];
  get checked() {
    return this._bool("checked");
  }
  set checked(v) {
    v ? this.setAttribute("checked", "") : this.removeAttribute("checked");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get name() {
    return this._attr("name", "");
  }
  get value() {
    return this._attr("value", "on");
  }
  get label() {
    return this._attr("label", "");
  }
  get color() {
    return this._attr("color", "");
  }
  get size() {
    return this._attr("size", "md");
  }
  _template() {
    const chk = this.checked ? " checked" : "";
    const dis = this.disabled ? " disabled" : "";
    const nm = this.name ? ` name="${this._esc(this.name)}"` : "";
    const val = this.value ? ` value="${this._esc(this.value)}"` : "";
    const colorClass = this.color ? ` w-checkbox--${this._esc(this.color)}` : "";
    const sizeClass = ` w-checkbox--${this._esc(this.size || "md")}`;
    const input = `<input class="w-checkbox-input" type="radio"${chk}${dis}${nm}${val}>`;
    const box = '<span class="w-checkbox-box" aria-hidden="true"></span>';
    let text = "";
    if (this.label) {
      text = `<span class="w-checkbox-label">${this._esc(this.label)}</span>`;
    } else {
      text = `<span class="w-checkbox-label"><slot></slot></span>`;
    }
    return `<label class="w-checkbox w-radio${colorClass}${sizeClass}">${input}${box}${text}</label>`;
  }
  _events() {
    const inp = this._q('input[type="radio"]');
    if (!inp)
      return;
    inp.addEventListener("change", (event) => {
      event.stopPropagation();
      if (inp.checked && this.name) {
        const root = this.getRootNode();
        root.querySelectorAll("w-radio").forEach((radio) => {
          if (radio === this || radio.getAttribute("name") !== this.name)
            return;
          radio._silentSet?.("checked", false);
          const otherInput = radio.querySelector('input[type="radio"]');
          if (otherInput)
            otherInput.checked = false;
        });
      }
      this._silentSet("checked", inp.checked);
      this._emit("change", { checked: inp.checked, name: this.name, value: this.value });
    });
  }
}
customElements.define("w-radio", WRadio);

// src/components/switch.js
class WSwitch extends WElement {
  static attrs = ["checked", "disabled", "readonly", "loading", "name", "value", "label", "color", "size", "inset", "flat", "hint", "error", "hide-details"];
  get checked() {
    return this.hasAttribute("checked");
  }
  set checked(v) {
    v ? this.setAttribute("checked", "") : this.removeAttribute("checked");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get readonly() {
    return this._bool("readonly");
  }
  get loading() {
    return this._bool("loading");
  }
  get name() {
    return this._attr("name", "");
  }
  get value() {
    return this._attr("value", "on");
  }
  get label() {
    return this._attr("label", "");
  }
  get color() {
    return this._attr("color", "");
  }
  get size() {
    return this._attr("size", "md");
  }
  get inset() {
    return this._bool("inset");
  }
  get flat() {
    return this._bool("flat");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get error() {
    return this._attr("error", "");
  }
  get hideDetails() {
    return this._bool("hide-details");
  }
  _template() {
    const chk = this.checked ? " checked" : "";
    const blocked = this.disabled || this.readonly || this.loading;
    const dis = this.disabled ? " disabled" : "";
    const ro = this.readonly ? " readonly" : "";
    const nm = this.name ? ` name="${this._esc(this.name)}"` : "";
    const val = this.value ? ` value="${this._esc(this.value)}"` : "";
    const invalid = this.error ? ' aria-invalid="true"' : "";
    const busy = this.loading ? ' aria-busy="true"' : "";
    const cls = [
      "w-switch",
      this.color ? "w-switch--" + this._esc(this.color) : "",
      "w-switch--" + this._esc(this.size || "md"),
      this.inset ? "w-switch--inset" : "",
      this.flat ? "w-switch--flat" : "",
      this.loading ? "w-switch--loading" : "",
      this.error ? "w-switch--error" : ""
    ].filter(Boolean).join(" ");
    const input = `<input class="w-switch-input" type="checkbox"${chk}${dis}${ro}${nm}${val}${invalid}${busy}>`;
    const track = `<span class="w-switch-track" aria-hidden="true"><span class="w-switch-thumb">${this.loading ? '<span class="w-switch-spinner"></span>' : ""}</span></span>`;
    let text = this.label ? `<span class="w-switch-label">${this._esc(this.label)}</span>` : `<span class="w-switch-label"><slot></slot></span>`;
    let details = "";
    if (!this.hideDetails) {
      if (this.error)
        details = `<span class="w-switch-error">${this._esc(this.error)}</span>`;
      else if (this.hint)
        details = `<span class="w-switch-hint">${this._esc(this.hint)}</span>`;
    }
    if (details)
      text = `<span class="w-switch-text">${text}${details}</span>`;
    return `<label class="${cls}">${input}${track}${text}</label>`;
  }
  _events() {
    const inp = this._q('input[type="checkbox"]');
    if (!inp)
      return;
    inp.addEventListener("click", (e) => {
      if (this.readonly || this.disabled || this.loading)
        e.preventDefault();
    });
    inp.addEventListener("change", (event) => {
      event.stopPropagation();
      if (this.readonly || this.disabled || this.loading)
        return;
      this._silentSet("checked", inp.checked);
      this._emit("change", { checked: inp.checked, name: this.name, value: this.value });
    });
  }
}
customElements.define("w-switch", WSwitch);

// src/components/utils.js
function wBoolAttr(host, name, fallback = false) {
  const value = host.getAttribute(name);
  if (value == null)
    return fallback;
  return value !== "false" && value !== "0";
}
function wNumberAttr(host, name, fallback) {
  const value = Number(host.getAttribute(name));
  return Number.isFinite(value) ? value : fallback;
}
function wValue(host, fallback = "") {
  return host.getAttribute("value") ?? fallback;
}
function wValueList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? "").trim()).filter(Boolean);
  }
  const text = String(value || "").trim();
  if (!text)
    return [];
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed.map((item) => String(item ?? "").trim()).filter(Boolean) : [];
    } catch {
      if (!text.endsWith("]"))
        return [];
      return text.slice(1, -1).split(",").map((item) => item.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    }
  }
  return text.split(",").map((item) => item.trim()).filter(Boolean);
}
function wNumberList(value, fallback = []) {
  const values = wValueList(value).map((item) => Number.parseFloat(item)).filter(Number.isFinite);
  return values.length ? values : fallback;
}
function wRows(value) {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (Array.isArray(item))
        return item.join("|");
      return String(item ?? "").trim();
    }).filter(Boolean);
  }
  const text = String(value || "").trim();
  if (!text)
    return [];
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? wRows(parsed) : [];
    } catch {
      if (!text.endsWith("]"))
        return [];
      return wRows(text.slice(1, -1));
    }
  }
  const separator = text.includes(";") ? ";" : ",";
  return text.split(separator).map((item) => item.trim()).filter(Boolean);
}
function wFields(row) {
  if (Array.isArray(row))
    return row.map((item) => String(item ?? "").trim());
  return String(row || "").split("|").map((item) => item.trim());
}
function wParseRecords(value, headers = []) {
  if (Array.isArray(value))
    return value;
  const text = String(value || "").trim();
  if (!text)
    return [];
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      if (!text.endsWith("]"))
        return [];
      const inner = text.slice(1, -1).trim();
      if (!inner)
        return [];
      return wRows(inner).map((row) => {
        const fields = wFields(row);
        if (!headers.length)
          return fields;
        return headers.reduce((record, header, index) => {
          record[header] = fields[index] ?? "";
          return record;
        }, {});
      });
    }
  }
  return wRows(text).map((row) => {
    const fields = wFields(row);
    if (!headers.length)
      return fields;
    return headers.reduce((record, header, index) => {
      record[header] = fields[index] ?? "";
      return record;
    }, {});
  });
}
function wRecordValue(record, key, index = 0) {
  if (Array.isArray(record))
    return record[index] ?? "";
  if (record && typeof record === "object")
    return record[key] ?? Object.values(record)[index] ?? "";
  return record ?? "";
}
function wIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function wParseIsoDate(value) {
  if (!value || typeof value !== "string")
    return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match)
    return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }
  return date;
}
function wFormatDate(date, format) {
  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime()))
    return "";
  const pad = (n) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return String(format || "yyyy-MM-dd").replace(/yyyy/g, String(year)).replace(/yy/g, String(year).slice(-2)).replace(/MM/g, pad(month)).replace(/M(?!M)/g, String(month)).replace(/dd/g, pad(day)).replace(/d(?!d)/g, String(day));
}
function wParseDateList(value) {
  if (!value)
    return [];
  return String(value).split(",").map((item) => wParseIsoDate(item.trim())).filter(Boolean);
}
function wIsSameDate(a, b) {
  if (!a || !b)
    return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function wDateInRange(date, min, max) {
  if (!date)
    return false;
  const time = date.getTime();
  if (min && time < min.getTime())
    return false;
  if (max && time > max.getTime())
    return false;
  return true;
}
function wDateBetween(date, start, end) {
  if (!date || !start || !end)
    return false;
  const time = date.getTime();
  const s = start.getTime();
  const e = end.getTime();
  return time >= Math.min(s, e) && time <= Math.max(s, e);
}
function wClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function wPrimitiveBoolAttr(host, name, fallback = false) {
  const value = host.getAttribute(name);
  if (value == null)
    return fallback;
  return value !== "false" && value !== "0";
}
function wPrimitiveValue(host, fallback = "") {
  return host.getAttribute("value") ?? fallback;
}

// src/components/select.js
var CHEVRON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>';
var CHECK = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
var selectUid = 0;

class WSelect extends WElement {
  static attrs = [
    "value",
    "disabled",
    "readonly",
    "name",
    "label",
    "hint",
    "error",
    "placeholder",
    "size",
    "multiple",
    "chips",
    "closable-chips",
    "clearable",
    "open"
  ];
  get value() {
    return this._attr("value", "");
  }
  set value(v) {
    this._silentSet("value", v == null ? "" : String(v));
    this._syncValue();
  }
  get disabled() {
    return this._bool("disabled");
  }
  get readonly() {
    return this._bool("readonly");
  }
  get name() {
    return this._attr("name", "");
  }
  get label() {
    return this._attr("label", "");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get error() {
    return this._attr("error", "");
  }
  get placeholder() {
    return this._attr("placeholder", "");
  }
  get size() {
    return this._attr("size", "");
  }
  get multiple() {
    return this._bool("multiple");
  }
  get chips() {
    return this._bool("chips") || this.multiple;
  }
  get closableChips() {
    return this._bool("closable-chips");
  }
  get clearable() {
    return this._bool("clearable");
  }
  get values() {
    return wValueList(this._attr("value", ""));
  }
  connectedCallback() {
    super.connectedCallback();
    this._observeOptions();
  }
  disconnectedCallback() {
    if (this._observer)
      this._observer.disconnect();
    this._removeOutsideListener();
  }
  _observeOptions() {
    if (!this._observer) {
      this._observer = new MutationObserver((mutations) => {
        if (!this._rendered)
          return;
        const touchesOptions = mutations.some((m) => [...m.addedNodes, ...m.removedNodes].some((n) => n.nodeType === 1 && n.tagName === "W-OPTION"));
        if (!touchesOptions)
          return;
        this._render();
        this._events();
        this._applyCommonProps?.();
      });
    }
    this._observer.observe(this, { childList: true, subtree: true });
  }
  _render() {
    if (this._observer)
      this._observer.disconnect();
    super._render();
    if (this.isConnected && this._observer)
      this._observeOptions();
  }
  _readOptions() {
    const authored = Array.from(this.querySelectorAll("w-option"));
    if (authored.length) {
      this._wOptions = authored.map((opt) => ({
        value: opt.getAttribute("value") ?? opt.textContent.trim(),
        label: opt.textContent.trim(),
        disabled: opt.hasAttribute("disabled")
      }));
    }
    return this._wOptions || [];
  }
  _labelFor(value) {
    const opt = (this._wOptions || []).find((o) => o.value === value);
    return opt ? opt.label : value;
  }
  _selectionHtml(values) {
    if (values.length && this.chips) {
      const closable = this.closableChips || this.clearable ? " closable" : "";
      return values.map((v) => `<w-chip class="w-select-chip" size="small" value="${this._esc(v)}"${closable}>${this._esc(this._labelFor(v))}</w-chip>`).join("");
    }
    if (values.length) {
      return `<span class="w-select-value">${this._esc(values.map((v) => this._labelFor(v)).join(", "))}</span>`;
    }
    return `<span class="w-select-placeholder">${this._esc(this.placeholder)}</span>`;
  }
  _template() {
    const options = this._readOptions();
    const values = this.values;
    const listId = this._listId || (this._listId = `w-select-list-${++selectUid}`);
    const sizeClass = this.size ? ` w-select--${this.size}` : "";
    const open = this.hasAttribute("open");
    const clearBtn = this.clearable && !this.disabled && !this.readonly ? `<button class="w-select-clear" type="button" aria-label="Clear" tabindex="-1"${values.length ? "" : " hidden"}>&#x2715;</button>` : "";
    const trigger = `<div class="w-select w-select-field${sizeClass}" role="combobox" tabindex="${this.disabled ? -1 : 0}"` + ` aria-haspopup="listbox" aria-expanded="${open ? "true" : "false"}" aria-controls="${listId}"` + `${this.disabled ? ' aria-disabled="true"' : ""}>` + `<span class="w-select-selection">${this._selectionHtml(values)}</span>` + clearBtn + `<span class="w-select-chevron" aria-hidden="true">${CHEVRON}</span>` + `</div>`;
    const items = options.map((opt) => {
      const selected = values.includes(opt.value);
      return `<button class="w-select-item" type="button" role="option" value="${this._esc(opt.value)}"` + ` aria-selected="${selected ? "true" : "false"}"${opt.disabled ? " disabled" : ""}>` + `<span class="w-select-item-label">${this._esc(opt.label)}</span>` + `<span class="w-select-item-check" aria-hidden="true">${CHECK}</span>` + `</button>`;
    }).join("");
    const list = `<div class="w-select-list" id="${listId}" role="listbox"${this.multiple ? ' aria-multiselectable="true"' : ""} hidden>${items}</div>`;
    const hidden = this.name ? `<input type="hidden" name="${this._esc(this.name)}" value="${this._esc(this.value)}">` : "";
    const control = `<div class="w-select-wrap">${trigger}${list}${hidden}</div>`;
    if (this.label || this.hint || this.error) {
      return `<div class="w-field${this.error ? " w-field-error" : ""}">
        ${this.label ? `<label class="w-field-label">${this._esc(this.label)}</label>` : ""}
        ${control}
        ${this.hint || this.error ? `<span class="w-field-hint">${this._esc(this.error || this.hint)}</span>` : ""}
      </div>`;
    }
    return control;
  }
  _events() {
    const trigger = this._q(".w-select-field");
    const list = this._q(".w-select-list");
    if (!trigger || !list)
      return;
    trigger.addEventListener("click", (event) => {
      if (event.target.closest(".w-select-clear"))
        return;
      if (this.disabled || this.readonly)
        return;
      this._setOpen(!this.hasAttribute("open"));
    });
    trigger.addEventListener("keydown", (event) => this._onKeydown(event));
    const clear = this._q(".w-select-clear");
    if (clear)
      clear.addEventListener("click", (event) => {
        event.stopPropagation();
        this._commit([]);
      });
    list.addEventListener("mousedown", (event) => event.preventDefault());
    list.addEventListener("click", (event) => {
      const item = event.target.closest(".w-select-item");
      if (item && !item.disabled)
        this._selectItem(item);
    });
    list.addEventListener("pointermove", (event) => {
      const item = event.target.closest(".w-select-item");
      if (item && !item.disabled)
        this._activate(item);
    });
    if (!this.__chipListeners) {
      this.__chipListeners = true;
      const onRemove = (event) => {
        const chip = event.target.closest?.("w-chip");
        if (!chip || !this.contains(chip))
          return;
        event.stopPropagation();
        this._removeValue(chip.getAttribute("value") || "");
      };
      this.addEventListener("close", onRemove);
    }
    this._applyOpen();
  }
  _onKeydown(event) {
    const open = this.hasAttribute("open");
    if (this.disabled || this.readonly)
      return;
    if (!open && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault();
      this._setOpen(true);
      return;
    }
    if (!open)
      return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this._move(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this._move(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      const i = this._items()[0];
      if (i)
        this._activate(i);
    } else if (event.key === "End") {
      event.preventDefault();
      const it = this._items();
      if (it.length)
        this._activate(it[it.length - 1]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (this._activeEl)
        this._selectItem(this._activeEl);
    } else if (event.key === "Escape") {
      event.preventDefault();
      this._setOpen(false);
    } else if (event.key === "Tab") {
      this._setOpen(false);
    }
  }
  _items() {
    return Array.from(this._qAll(".w-select-item")).filter((el) => !el.disabled);
  }
  _move(dir) {
    const items = this._items();
    if (!items.length)
      return;
    const idx = items.indexOf(this._activeEl);
    const next = idx === -1 ? dir > 0 ? 0 : items.length - 1 : (idx + dir + items.length) % items.length;
    this._activate(items[next]);
  }
  _activate(item) {
    this._activeEl = item || null;
    this._qAll(".w-select-item").forEach((el) => el.classList.toggle("active", el === item));
    if (item)
      item.scrollIntoView({ block: "nearest" });
  }
  _selectItem(item) {
    const value = item.getAttribute("value") || "";
    if (this.multiple) {
      const values = this.values;
      const idx = values.indexOf(value);
      if (idx === -1)
        values.push(value);
      else
        values.splice(idx, 1);
      this._commit(values, { keepOpen: true });
    } else {
      this._commit([value]);
    }
  }
  _removeValue(value) {
    this._commit(this.values.filter((v) => v !== value), { keepOpen: this.hasAttribute("open") });
  }
  _commit(values, { keepOpen = false } = {}) {
    const next = this.multiple ? values.join(",") : values[0] || "";
    this._silentSet("value", next);
    this._syncSelection();
    if (!keepOpen)
      this._setOpen(false);
    this._emit("change", { value: next, name: this.name });
  }
  _syncSelection() {
    const values = this.values;
    this._qAll(".w-select-item").forEach((el) => {
      el.setAttribute("aria-selected", values.includes(el.getAttribute("value")) ? "true" : "false");
    });
    const selection = this._q(".w-select-selection");
    if (selection)
      selection.innerHTML = this._selectionHtml(values);
    const clear = this._q(".w-select-clear");
    if (clear)
      clear.hidden = !values.length;
    this._syncValue();
  }
  _syncValue() {
    const hidden = this._q('input[type="hidden"]');
    if (hidden)
      hidden.value = this.value;
  }
  _setOpen(open) {
    if (this.disabled || this.readonly)
      return;
    if (open)
      this._silentSet("open", "");
    else
      this._silentSet("open", null);
    this._applyOpen();
  }
  _applyOpen() {
    const list = this._q(".w-select-list");
    const trigger = this._q(".w-select-field");
    if (!list || !trigger)
      return;
    const open = this.hasAttribute("open");
    list.hidden = !open;
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      this._addOutsideListener();
      const selected = this._items().find((el) => el.getAttribute("aria-selected") === "true");
      this._activate(selected || this._items()[0] || null);
    } else {
      this._removeOutsideListener();
      this._activate(null);
    }
  }
  _addOutsideListener() {
    if (this.__outside)
      return;
    this.__outside = (event) => {
      if (!this.contains(event.target))
        this._setOpen(false);
    };
    document.addEventListener("pointerdown", this.__outside);
  }
  _removeOutsideListener() {
    if (!this.__outside)
      return;
    document.removeEventListener("pointerdown", this.__outside);
    this.__outside = null;
  }
}
customElements.define("w-select", WSelect);

// src/components/native-select.js
class WNativeSelect extends WElement {
  static attrs = ["value", "name", "label", "hint", "error", "size", "disabled", "required"];
  get value() {
    return this._attr("value", "");
  }
  get name() {
    return this._attr("name", "");
  }
  get label() {
    return this._attr("label", "");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get error() {
    return this._attr("error", "");
  }
  get size() {
    return this._attr("size", "");
  }
  get disabled() {
    return this._bool("disabled");
  }
  _readOptions() {
    const options = Array.from(this.querySelectorAll("option")).map((option) => ({
      value: option.getAttribute("value") ?? option.textContent.trim(),
      label: option.textContent.trim(),
      selected: option.hasAttribute("selected"),
      disabled: option.disabled
    }));
    if (options.length)
      this._wNativeOptions = options;
    return this._wNativeOptions || [];
  }
  _template() {
    const options = this._readOptions();
    const selectedValue = this.value || options.find((option) => option.selected)?.value || "";
    const sizeClass = this.size ? " w-select--" + this.size : "";
    const select = `<select class="w-select${sizeClass}"${this.name ? ` name="${this._esc(this.name)}"` : ""}${this.disabled ? " disabled" : ""}${this._validationAttrs(["required"])}>
      ${options.map((option) => `<option value="${this._esc(option.value)}"${option.value === selectedValue ? " selected" : ""}${option.disabled ? " disabled" : ""}>${this._esc(option.label)}</option>`).join("")}
    </select>`;
    if (this.label || this.hint || this.error) {
      return `<div class="w-field${this.error ? " w-field-error" : ""}">
        ${this.label ? `<span class="w-field-label">${this._esc(this.label)}</span>` : ""}
        ${select}
        ${this.hint || this.error ? `<span class="w-field-hint">${this._esc(this.error || this.hint)}</span>` : ""}
      </div>`;
    }
    return select;
  }
  _events() {
    const select = this._q("select");
    if (!select)
      return;
    select.addEventListener("change", (event) => {
      event.stopPropagation();
      this._silentSet("value", select.value);
      this._emit("change", { value: select.value, name: this.name });
    });
  }
}
if (!customElements.get("w-native-select")) {
  customElements.define("w-native-select", WNativeSelect);
}

// src/components/input-group.js
class WInputGroup extends WElement {
  static attrs = ["label", "hint", "error"];
  get label() {
    return this._attr("label", "");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get error() {
    return this._attr("error", "");
  }
  _template() {
    return `<div class="w-field${this.error ? " w-field-error" : ""}">
      ${this.label ? `<span class="w-field-label">${this._esc(this.label)}</span>` : ""}
      <span class="w-input-group${this.error ? " error" : ""}"><slot></slot></span>
      ${this.hint || this.error ? `<span class="w-field-hint">${this._esc(this.error || this.hint)}</span>` : ""}
    </div>`;
  }
}
if (!customElements.get("w-input-group")) {
  customElements.define("w-input-group", WInputGroup);
}

// src/components/chip.js
class WChip extends WElement {
  static attrs = [
    "selected",
    "disabled",
    "value",
    "hidden",
    "text",
    "size",
    "density",
    "variant",
    "color",
    "base-color",
    "elevation",
    "rounded",
    "border",
    "label",
    "pill",
    "filter",
    "filter-icon",
    "prepend-icon",
    "prepend-avatar",
    "append-icon",
    "append-avatar",
    "closable",
    "removable",
    "close-icon",
    "close-label",
    "href",
    "target",
    "rel",
    "link",
    "draggable",
    "ripple"
  ];
  static colors = ["primary", "secondary", "tertiary", "success", "warning", "error", "danger", "info"];
  static variants = ["tonal", "filled", "outlined", "text", "plain", "elevated"];
  static sizes = ["x-small", "small", "default", "large", "x-large", "xs", "sm", "md", "lg", "xl"];
  get selected() {
    return this.hasAttribute("selected");
  }
  set selected(value) {
    value ? this.setAttribute("selected", "") : this.removeAttribute("selected");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get value() {
    return this._attr("value", "");
  }
  get text() {
    return this._attr("text", "");
  }
  get size() {
    return this._attr("size", "");
  }
  get density() {
    return this._attr("density", "");
  }
  get variant() {
    return this._attr("variant", "tonal");
  }
  get color() {
    return this._normalizeColor(this._attr("color", this._attr("base-color", "")));
  }
  get filterIcon() {
    return this._attr("filter-icon", "✓");
  }
  get prependIcon() {
    return this._attr("prepend-icon", "");
  }
  get prependAvatar() {
    return this._attr("prepend-avatar", "");
  }
  get appendIcon() {
    return this._attr("append-icon", "");
  }
  get appendAvatar() {
    return this._attr("append-avatar", "");
  }
  get closeIcon() {
    return this._attr("close-icon", "×");
  }
  get closeLabel() {
    return this._attr("close-label", "Close");
  }
  get href() {
    return this._attr("href", "");
  }
  get target() {
    return this._attr("target", "");
  }
  get rel() {
    return this._attr("rel", "");
  }
  get closable() {
    return this._bool("closable") || this._bool("removable");
  }
  get removable() {
    return this._bool("removable");
  }
  get active() {
    return !this.hasAttribute("hidden");
  }
  _template() {
    if (!this.active)
      return '<span class="w-chip-preserve" hidden><slot></slot><slot name="prepend"></slot><slot name="append"></slot><slot name="filter"></slot><slot name="close"></slot></span>';
    const tag = this.href && !this.disabled ? "a" : "button";
    const rootAttrs = this._rootAttrs(tag);
    return `<${tag} class="${this._chipClass()}"${rootAttrs}>
      <span class="w-chip__overlay" aria-hidden="true"></span>
      ${this._filterTemplate()}
      ${this._mediaTemplate("prepend")}
      <span class="w-chip__content">${this._contentTemplate()}</span>
      ${this._mediaTemplate("append")}
      ${this._closeTemplate()}
    </${tag}>`;
  }
  _rootAttrs(tag) {
    const attrs = [];
    if (tag === "button") {
      attrs.push(' type="button"');
      if (this.disabled)
        attrs.push(" disabled");
    } else {
      attrs.push(` href="${this._esc(this.href)}"`);
      if (this.target)
        attrs.push(` target="${this._esc(this.target)}"`);
      if (this.rel)
        attrs.push(` rel="${this._esc(this.rel)}"`);
    }
    if (this.disabled)
      attrs.push(' aria-disabled="true"');
    if (!this.disabled && !this.href)
      attrs.push(` aria-pressed="${this.selected ? "true" : "false"}"`);
    if (this._bool("draggable"))
      attrs.push(' draggable="true"');
    return attrs.join("");
  }
  _chipClass() {
    return [
      "w-chip",
      "w-chip-" + this._variant(),
      this.color ? "w-chip-" + this.color : "",
      this.selected ? "selected w-chip--selected" : "",
      this.size ? "w-chip--" + this._size() : "",
      this.density ? "w-chip--density-" + this.density : "",
      this.closable ? "w-chip-removable w-chip--closable" : "",
      this._bool("label") ? "w-chip--label" : "",
      this._bool("pill") ? "w-chip--pill" : "",
      this._bool("filter") ? "w-chip--filter" : "",
      this.href || this._bool("link") ? "w-chip--link" : "",
      this.disabled ? "w-chip--disabled" : "",
      this.hasAttribute("rounded") ? this._roundedClass() : "",
      this.hasAttribute("border") ? "w-chip--border" : "",
      this.getAttribute("elevation") ? "w-chip--elevation-" + this.getAttribute("elevation") : ""
    ].filter(Boolean).join(" ");
  }
  _filterTemplate() {
    if (!this._bool("filter") && !this._hasSlot("filter"))
      return "";
    return `<span class="w-chip__filter" aria-hidden="true">${this._hasSlot("filter") ? '<slot name="filter"></slot>' : this._esc(this.filterIcon)}</span>`;
  }
  _mediaTemplate(side) {
    const avatar = side === "prepend" ? this.prependAvatar : this.appendAvatar;
    const icon = side === "prepend" ? this.prependIcon : this.appendIcon;
    const slot = this._hasSlot(side) ? `<slot name="${side}"></slot>` : "";
    if (!avatar && !icon && !slot)
      return "";
    const media = avatar ? `<span class="w-avatar w-avatar--x-small"><img src="${this._esc(avatar)}" alt=""></span>` : icon ? `<span class="w-chip__icon" aria-hidden="true">${this._esc(icon)}</span>` : "";
    return `<span class="w-chip__${side}">${media}${slot}</span>`;
  }
  _contentTemplate() {
    if (this.text)
      return `${this._esc(this.text)}<slot hidden></slot>`;
    return "<slot></slot>";
  }
  _closeTemplate() {
    if (!this.closable && !this._hasSlot("close"))
      return "";
    const content = this._hasSlot("close") ? '<slot name="close"></slot>' : this._esc(this.closeIcon);
    return `<span class="w-chip__close w-chip-close" role="button" tabindex="-1" aria-label="${this._esc(this.closeLabel)}">${content}</span>`;
  }
  _events() {
    const chip = this._q(".w-chip");
    if (!chip || this.disabled)
      return;
    if (this.hasAttribute("ripple"))
      this._attachRipple(chip);
    chip.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(".w-chip__close")) {
        event.preventDefault();
        event.stopPropagation();
        this._close(event);
        return;
      }
      this._toggleSelected();
    });
    chip.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ")
        return;
      event.preventDefault();
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(".w-chip__close"))
        this._close(event);
      else
        this._toggleSelected();
    });
  }
  _toggleSelected() {
    const selected = !this.selected;
    this._silentSet("selected", selected ? "" : null);
    this._q(".w-chip")?.classList.toggle("selected", selected);
    this._q(".w-chip")?.classList.toggle("w-chip--selected", selected);
    this._q(".w-chip")?.setAttribute("aria-pressed", selected ? "true" : "false");
    this._dispatch("change", { selected, value: this.value });
  }
  _close(event) {
    this._dispatch("close", { value: this.value });
    if (this.removable) {
      this.remove();
      return;
    }
    this._silentSet("hidden", "");
    this._render();
    if (typeof this._events === "function")
      this._events();
  }
  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
  _variant() {
    return this.constructor.variants.includes(this.variant) ? this.variant : "tonal";
  }
  _size() {
    const aliases = { xs: "x-small", sm: "small", md: "default", lg: "large", xl: "x-large" };
    const size = aliases[this.size] || this.size;
    return this.constructor.sizes.includes(size) ? size : "default";
  }
  _roundedClass() {
    const value = this.getAttribute("rounded");
    if (!value || value === "true")
      return "w-chip--rounded";
    return "w-chip--rounded-" + value;
  }
  _normalizeColor(value) {
    const token = String(value || "").toLowerCase();
    if (!token)
      return "";
    if (token === "danger")
      return "error";
    if (token === "info")
      return "primary";
    return this.constructor.colors.includes(token) ? token : "primary";
  }
  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
}
if (!customElements.get("w-chip")) {
  customElements.define("w-chip", WChip);
}

// src/components/slider.js
class WSlider extends WElement {
  static attrs = [
    "min",
    "max",
    "value",
    "step",
    "label",
    "hint",
    "hide-details",
    "disabled",
    "readonly",
    "direction",
    "reverse",
    "thumb-label",
    "ticks",
    "tick-labels",
    "color",
    "track-color",
    "size",
    "name"
  ];
  get min() {
    return Number(this._attr("min", "0"));
  }
  get max() {
    return Number(this._attr("max", "100"));
  }
  get step() {
    return this._attr("step", "1");
  }
  get stepNum() {
    const s = Number(this.step);
    return s > 0 ? s : 1;
  }
  get value() {
    return this._value !== undefined ? this._value : this._attr("value", String(this.min));
  }
  set value(v) {
    this._value = String(v);
    const input = this._q("input");
    if (input)
      input.value = this._value;
    this._silentSet("value", this._value);
    this._update();
  }
  get valueNum() {
    const n = Number(this.value);
    return Number.isFinite(n) ? n : this.min;
  }
  get label() {
    return this._attr("label", "");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get hideDetails() {
    return this._bool("hide-details");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get readonly() {
    return this._bool("readonly");
  }
  get vertical() {
    return this._attr("direction", "") === "vertical" || this._bool("vertical");
  }
  get reverse() {
    return this._bool("reverse");
  }
  get size() {
    return this._attr("size", "");
  }
  get name() {
    return this._attr("name", "");
  }
  get color() {
    return this._attr("color", "");
  }
  get trackColor() {
    return this._attr("track-color", "");
  }
  get thumbLabel() {
    const v = this.getAttribute("thumb-label");
    if (v === null)
      return false;
    return v === "always" ? "always" : true;
  }
  get tickLabels() {
    const v = this.getAttribute("tick-labels");
    return v === null ? null : v.split("|");
  }
  get ticks() {
    if (this.tickLabels)
      return true;
    const v = this.getAttribute("ticks");
    if (v === null)
      return false;
    return true;
  }
  _pct(v) {
    const span = this.max - this.min;
    const raw = span === 0 ? 0 : (v - this.min) / span * 100;
    return this.reverse ? 100 - raw : raw;
  }
  _ticksHtml() {
    if (!this.ticks)
      return "";
    const span = this.max - this.min;
    const count = Math.round(span / this.stepNum);
    if (count < 1 || count > 100)
      return "";
    const labels = this.tickLabels;
    let marks = "";
    for (let i = 0;i <= count; i++) {
      const value = this.min + i * this.stepNum;
      const label = labels && labels[i] !== undefined ? `<span class="w-slider-tick-label">${this._esc(labels[i])}</span>` : "";
      marks += `<span class="w-slider-tick" style="--pos:${this._pct(value)}%">${label}</span>`;
    }
    return `<span class="w-slider-ticks${labels ? " w-slider-ticks--labelled" : ""}" aria-hidden="true">${marks}</span>`;
  }
  _thumbLabelHtml() {
    if (!this.thumbLabel)
      return "";
    return `<span class="w-slider-thumb-label" style="--pos:${this._pct(this.valueNum)}%">${this._esc(this.value)}</span>`;
  }
  _colorVars() {
    const vars = [`--value:${this._pct(this.valueNum)}%`];
    if (this.color)
      vars.push(`--w-slider-color:var(--w-${this._esc(this.color)})`);
    if (this.trackColor)
      vars.push(`--w-slider-track-color:var(--w-${this._esc(this.trackColor)})`);
    return vars.join(";");
  }
  _template() {
    const cls = [
      "w-field",
      "w-slider-field",
      this.size ? "w-slider-field--" + this.size : "",
      this.vertical ? "w-slider-field--vertical" : "",
      this.reverse ? "w-slider-field--reverse" : "",
      this.disabled ? "w-slider-field--disabled" : "",
      this.readonly ? "w-slider-field--readonly" : "",
      this.thumbLabel ? "w-slider-field--thumb-label" : "",
      this.thumbLabel === "always" ? "w-slider-field--thumb-label-always" : ""
    ].filter(Boolean).join(" ");
    const range = `min="${this.min}" max="${this.max}" step="${this._esc(this.step)}"`;
    const dis = this.disabled || this.readonly ? " disabled" : "";
    const nm = this.name ? ` name="${this._esc(this.name)}"` : "";
    const aria = this.label ? ` aria-label="${this._esc(this.label)}"` : "";
    const details = this.hideDetails ? "" : `<span class="w-messages">${this._esc(this.hint || this.value)}</span>`;
    return `<label class="${cls}">
      ${this.label ? `<span class="w-label">${this._esc(this.label)}</span>` : ""}
      <span class="w-slider-control" style="${this._colorVars()}">
        <span class="w-slider-rail" aria-hidden="true"><span class="w-slider-fill"></span></span>
        ${this._ticksHtml()}
        <input class="w-slider-input" type="range" ${range} value="${this._esc(this.value)}"${aria}${dis}${nm}>
        ${this._thumbLabelHtml()}
      </span>
      ${details}
    </label>`;
  }
  _events() {
    const input = this._q("input");
    if (!input)
      return;
    input.addEventListener("input", (event) => {
      event.stopPropagation();
      this._value = input.value;
      this._silentSet("value", input.value);
      this._update();
      this._emit("input", { value: input.value, name: this.name });
    });
    input.addEventListener("change", (event) => {
      event.stopPropagation();
      this._emit("change", { value: input.value, name: this.name });
    });
    this._update();
  }
  _update() {
    const control = this._q(".w-slider-control");
    if (control)
      control.style.setProperty("--value", `${this._pct(this.valueNum)}%`);
    const bubble = this._q(".w-slider-thumb-label");
    if (bubble) {
      bubble.textContent = this.value;
      bubble.style.setProperty("--pos", `${this._pct(this.valueNum)}%`);
    }
    if (!this.hideDetails && !this.hint) {
      const msg = this._q(".w-messages");
      if (msg)
        msg.textContent = this.value;
    }
  }
}
customElements.define("w-slider", WSlider);

// src/components/aspect-ratio.js
function wLen(v) {
  const s = String(v == null ? "" : v).trim();
  if (!s)
    return "";
  return /^-?\d+(\.\d+)?$/.test(s) ? s + "px" : s;
}

class WAspectRatio extends WElement {
  static attrs = ["ratio", "aspect-ratio", "width", "height", "max-width", "max-height", "min-width", "min-height", "content-class", "inline"];
  get ratio() {
    return this._attr("ratio", this._attr("aspect-ratio", "16 / 9"));
  }
  _template() {
    const styles = [`--w-aspect-ratio: ${this._esc(this.ratio)}`];
    [["width", "width"], ["height", "height"], ["max-width", "max-width"], ["max-height", "max-height"], ["min-width", "min-width"], ["min-height", "min-height"]].forEach(([attr, prop]) => {
      const v = wLen(this.getAttribute(attr));
      if (v)
        styles.push(`${prop}: ${v}`);
    });
    const cls = ["w-aspect-ratio", this._bool("inline") ? "w-aspect-ratio--inline" : ""].filter(Boolean).join(" ");
    const contentClass = ["w-aspect-ratio__content", this._attr("content-class", "")].filter(Boolean).join(" ");
    return `<div class="${cls}" style="${styles.join("; ")}"><div class="${this._esc(contentClass)}"><slot></slot></div></div>`;
  }
}
if (!customElements.get("w-aspect-ratio")) {
  customElements.define("w-aspect-ratio", WAspectRatio);
}

// src/components/container.js
class WContainer extends WElement {
  static attrs = ["fluid", "fill-height", "size"];
  get fluid() {
    return this._bool("fluid");
  }
  get fillHeight() {
    return this._bool("fill-height");
  }
  get size() {
    return this._attr("size", "");
  }
  _template() {
    return `<slot></slot>`;
  }
  _events() {
    const classes = ["w-container"];
    if (this.fluid)
      classes.push("w-container--fluid");
    if (this.fillHeight)
      classes.push("w-container--fill-height");
    if (this.size)
      classes.push("w-container--" + this.size);
    this._syncGridClasses(classes);
  }
  _syncGridClasses(classes) {
    (this._wGridClasses || []).forEach((name) => this.classList.remove(name));
    classes.forEach((name) => this.classList.add(name));
    this._wGridClasses = classes;
  }
}
if (!customElements.get("w-container")) {
  customElements.define("w-container", WContainer);
}

// src/components/row.js
var ROW_BREAKPOINTS = ["", "sm", "md", "lg", "xl", "xxl"];
var JUSTIFY_ALIASES = { between: "space-between", around: "space-around", evenly: "space-evenly" };

class WRow extends WElement {
  static attrs = [
    "no-gutters",
    "dense",
    "gutter",
    "align",
    "align-sm",
    "align-md",
    "align-lg",
    "align-xl",
    "align-xxl",
    "justify",
    "justify-sm",
    "justify-md",
    "justify-lg",
    "justify-xl",
    "justify-xxl",
    "align-content"
  ];
  get noGutters() {
    return this._bool("no-gutters");
  }
  get dense() {
    return this._bool("dense");
  }
  get gutter() {
    return this._attr("gutter", "");
  }
  _template() {
    return `<slot></slot>`;
  }
  _events() {
    const classes = ["w-grid-row"];
    if (this.noGutters)
      classes.push("w-grid-row--flush");
    else if (this.dense)
      classes.push("w-grid-row--tight");
    else if (this.gutter)
      classes.push("w-grid-row--custom");
    ROW_BREAKPOINTS.forEach((bp) => {
      const suffix = bp ? "-" + bp : "";
      this._alignClass(classes, bp, this._attr("align" + suffix, ""));
      this._justifyClass(classes, bp, this._attr("justify" + suffix, ""));
    });
    const alignContent = this._attr("align-content", "");
    if (alignContent)
      classes.push("w-grid-row--align-content-" + this._normJustify(alignContent));
    this._syncGridClasses(classes);
    this._syncGutter();
  }
  _normJustify(value) {
    return JUSTIFY_ALIASES[value] || value;
  }
  _alignClass(classes, bp, value) {
    if (!value)
      return;
    classes.push(bp ? `w-grid-row--align-${bp}-${value}` : `w-grid-row--align-${value}`);
  }
  _justifyClass(classes, bp, value) {
    if (!value)
      return;
    const v = this._normJustify(value);
    classes.push(bp ? `w-grid-row--justify-${bp}-${v}` : `w-grid-row--justify-${v}`);
  }
  _syncGutter() {
    if (!this.gutter || this.noGutters || this.dense) {
      if (this._wInlineGutter)
        this.style.removeProperty("--w-grid-gutter");
      this._wInlineGutter = false;
      return;
    }
    const map = {
      none: "0px",
      0: "0px",
      xs: "var(--w-space-1)",
      sm: "var(--w-space-2)",
      md: "var(--w-space-4)",
      lg: "var(--w-space-6)",
      xl: "var(--w-space-8)"
    };
    this.style.setProperty("--w-grid-gutter", map[this.gutter] || this.gutter);
    this._wInlineGutter = true;
  }
  _syncGridClasses(classes) {
    (this._wGridClasses || []).forEach((name) => this.classList.remove(name));
    classes.forEach((name) => this.classList.add(name));
    this._wGridClasses = classes;
  }
}
if (!customElements.get("w-row")) {
  customElements.define("w-row", WRow);
}

// src/components/col.js
var COL_BREAKPOINTS = ["", "sm", "md", "lg", "xl", "xxl"];

class WCol extends WElement {
  static attrs = [
    "cols",
    "sm",
    "md",
    "lg",
    "xl",
    "xxl",
    "offset",
    "offset-sm",
    "offset-md",
    "offset-lg",
    "offset-xl",
    "offset-xxl",
    "order",
    "order-sm",
    "order-md",
    "order-lg",
    "order-xl",
    "order-xxl",
    "align-self"
  ];
  _template() {
    return `<slot></slot>`;
  }
  _events() {
    const classes = ["w-grid-col"];
    COL_BREAKPOINTS.forEach((bp) => {
      const suffix = bp ? "-" + bp : "";
      this._colClass(classes, bp, this._attr(bp || "cols", ""));
      this._offsetClass(classes, bp, this._attr("offset" + suffix, ""));
      this._orderClass(classes, bp, this._attr("order" + suffix, ""));
    });
    const alignSelf = this._attr("align-self", "");
    if (alignSelf)
      classes.push("w-grid-col--align-self-" + alignSelf);
    this._syncGridClasses(classes);
  }
  _colClass(classes, bp, value) {
    if (value === "" || value == null)
      return;
    const suffix = bp ? "-" + bp : "";
    classes.push(value === "auto" ? `w-grid-col${suffix}-auto` : `w-grid-col${suffix}-${value}`);
  }
  _offsetClass(classes, bp, value) {
    if (value === "" || value == null)
      return;
    classes.push(bp ? `w-grid-offset-${bp}-${value}` : `w-grid-offset-${value}`);
  }
  _orderClass(classes, bp, value) {
    if (value === "" || value == null)
      return;
    classes.push(bp ? `w-grid-order-${bp}-${value}` : `w-grid-order-${value}`);
  }
  _syncGridClasses(classes) {
    (this._wGridClasses || []).forEach((name) => this.classList.remove(name));
    classes.forEach((name) => this.classList.add(name));
    this._wGridClasses = classes;
  }
}
if (!customElements.get("w-col")) {
  customElements.define("w-col", WCol);
}

// src/components/spacer.js
class WSpacer extends WElement {
  _template() {
    return `<div class="w-spacer"></div>`;
  }
}
if (!customElements.get("w-spacer")) {
  customElements.define("w-spacer", WSpacer);
}

// src/components/scroll-area.js
class WScrollArea extends WElement {
  static attrs = ["height", "orientation"];
  get height() {
    return this._attr("height", "16rem");
  }
  get orientation() {
    return this._attr("orientation", "vertical");
  }
  _template() {
    const horizontal = this.orientation === "horizontal";
    return `<div class="w-scroll-area${horizontal ? " w-scroll-area--horizontal" : ""}" style="--w-scroll-area-height: ${this._esc(this.height)};"><slot></slot></div>`;
  }
}
if (!customElements.get("w-scroll-area")) {
  customElements.define("w-scroll-area", WScrollArea);
}

// src/components/resizable.js
class WResizable extends WElement {
  static attrs = ["direction"];
  get direction() {
    return this._attr("direction", "horizontal");
  }
  _template() {
    const vertical = this.direction === "vertical";
    const panels = Array.from(this.querySelectorAll("w-resizable-panel"));
    const tracks = panels.map((panel) => {
      const min = panel.getAttribute("min") || "10rem";
      const size = panel.getAttribute("size") || "1fr";
      return `minmax(${this._esc(min)}, ${this._esc(size)})`;
    }).join(" ");
    const style = tracks ? `${vertical ? "grid-template-rows" : "grid-template-columns"}: ${tracks};` : "";
    return `<div class="w-resizable w-resizable--${vertical ? "vertical" : "horizontal"}" style="${style}"><slot></slot></div>`;
  }
}
if (!customElements.get("w-resizable")) {
  customElements.define("w-resizable", WResizable);
}

// src/components/resizable-panel.js
class WResizablePanel extends WElement {
  static attrs = ["size", "min"];
  get size() {
    return this._attr("size", "1fr");
  }
  get min() {
    return this._attr("min", "10rem");
  }
  _template() {
    return `<div class="w-resizable-panel" style="--w-resizable-size: ${this._esc(this.size)}; --w-resizable-min: ${this._esc(this.min)};"><slot></slot></div>`;
  }
}
if (!customElements.get("w-resizable-panel")) {
  customElements.define("w-resizable-panel", WResizablePanel);
}

// src/components/chart.js
class WChart extends WElement {
  static attrs = ["title", "values", "label"];
  get title() {
    return this._attr("title", "Chart");
  }
  get values() {
    return this._attr("values", "[24,42,36,58,50,72]");
  }
  get label() {
    return this._attr("label", this.title);
  }
  _template() {
    const values = wNumberList(this.values);
    const bars = values.length ? values : [24, 42, 36, 58, 50, 72];
    return `<figure class="w-chart" aria-label="${this._esc(this.label)}">
      <figcaption class="w-chart-title">${this._esc(this.title)}</figcaption>
      <div class="w-chart-bars">
        ${bars.map((value) => `<span class="w-chart-bar" style="--w-chart-value: ${Math.max(0, Math.min(100, value))}%;"></span>`).join("")}
      </div>
      <slot></slot>
    </figure>`;
  }
}
if (!customElements.get("w-chart")) {
  customElements.define("w-chart", WChart);
}

// src/components/direction.js
class WDirection extends WElement {
  static attrs = ["dir"];
  get dirValue() {
    return this._attr("dir", "ltr");
  }
  _template() {
    return `<div class="w-direction" dir="${this._esc(this.dirValue)}"><slot></slot></div>`;
  }
}
if (!customElements.get("w-direction")) {
  customElements.define("w-direction", WDirection);
}

// src/components/card.js
class WCard extends WElement {
  static attrs = [
    "header",
    "footer",
    "title",
    "subtitle",
    "text",
    "image",
    "prepend-avatar",
    "prepend-icon",
    "append-avatar",
    "append-icon",
    "href",
    "target",
    "rel",
    "link",
    "hover",
    "disabled",
    "flat",
    "variant",
    "color",
    "loading",
    "rounded",
    "border",
    "tile",
    "density",
    "elevation",
    "width",
    "height",
    "min-width",
    "max-width",
    "position",
    "location"
  ];
  static colors = ["primary", "secondary", "tertiary", "success", "warning", "error", "danger", "info"];
  static variants = ["elevated", "flat", "tonal", "outlined", "text", "plain"];
  get header() {
    return this._attr("header", "");
  }
  get title() {
    return this._attr("title", this.header);
  }
  get subtitle() {
    return this._attr("subtitle", "");
  }
  get text() {
    return this._attr("text", "");
  }
  get image() {
    return this._attr("image", "");
  }
  get prependAvatar() {
    return this._attr("prepend-avatar", "");
  }
  get prependIcon() {
    return this._attr("prepend-icon", "");
  }
  get appendAvatar() {
    return this._attr("append-avatar", "");
  }
  get appendIcon() {
    return this._attr("append-icon", "");
  }
  get href() {
    return this._attr("href", "");
  }
  get target() {
    return this._attr("target", "");
  }
  get rel() {
    return this._attr("rel", "");
  }
  get color() {
    return this._normalizeColor(this._attr("color", ""));
  }
  get loading() {
    return this.getAttribute("loading");
  }
  get isDisabled() {
    return this._bool("disabled");
  }
  get isLink() {
    return !!this.href && !this.isDisabled;
  }
  get isClickable() {
    return !this.isDisabled && (this._bool("link") || this._bool("hover") || !!this.href);
  }
  _template() {
    const tag = this.isLink ? "a" : "div";
    const attrs = this._rootAttrs();
    const classes = this._cardClass();
    return `<${tag} class="${classes}"${attrs}>
      ${this._loaderTemplate()}
      ${this._imageTemplate()}
      <div class="w-card__content">
        ${this._legacyHeaderTemplate()}
        ${this._itemTemplate()}
        ${this._textTemplate()}
        ${this._defaultTemplate()}
        ${this._actionsTemplate()}
        ${this._legacyFooterTemplate()}
      </div>
      <span class="w-card__overlay" aria-hidden="true"></span>
    </${tag}>`;
  }
  _rootAttrs() {
    const attrs = [];
    if (this.isLink) {
      attrs.push(` href="${this._esc(this.href)}"`);
      if (this.target)
        attrs.push(` target="${this._esc(this.target)}"`);
      if (this.rel)
        attrs.push(` rel="${this._esc(this.rel)}"`);
    }
    if (this.isClickable && !this.isLink)
      attrs.push(' role="button" tabindex="0"');
    if (this.isDisabled)
      attrs.push(' aria-disabled="true"');
    return attrs.join("");
  }
  _cardClass() {
    return [
      "w-card",
      "w-card--variant-" + this._variant(),
      this.color ? "w-card--color-" + this.color : "",
      this._bool("hover") ? "w-card--hover" : "",
      this._bool("link") || this.isLink ? "w-card--link" : "",
      this.isDisabled ? "w-card--disabled" : "",
      this.hasAttribute("rounded") ? this._roundedClass() : "",
      this.hasAttribute("border") ? "w-card--border" : "",
      this.hasAttribute("tile") ? "w-card--tile" : "",
      this.getAttribute("density") ? "w-card--density-" + this.getAttribute("density") : "",
      this.getAttribute("elevation") ? "w-card--elevation-" + this.getAttribute("elevation") : "",
      this.hasAttribute("loading") ? "w-card--loading" : ""
    ].filter(Boolean).join(" ");
  }
  _loaderTemplate() {
    if (!this.hasAttribute("loading"))
      return "";
    if (this._hasSlot("loader"))
      return '<div class="w-card__loader"><slot name="loader"></slot></div>';
    const color = this.loading && this.loading !== "true" ? this._normalizeColor(this.loading) : this.color;
    const colorClass = color ? " w-card__loader-bar--" + color : "";
    return `<div class="w-card__loader" aria-hidden="true"><span class="w-card__loader-bar${colorClass}"></span></div>`;
  }
  _imageTemplate() {
    if (this._hasSlot("image"))
      return '<div class="w-card__image"><slot name="image"></slot></div>';
    if (!this.image)
      return "";
    return `<div class="w-card__image"><img src="${this._esc(this.image)}" alt=""></div>`;
  }
  _legacyHeaderTemplate() {
    if (!this._hasSlot("header"))
      return "";
    return '<div class="w-card-header"><slot name="header"></slot></div>';
  }
  _legacyFooterTemplate() {
    if (!this._hasSlot("footer") && !this.hasAttribute("footer"))
      return "";
    return '<div class="w-card-footer"><slot name="footer"></slot></div>';
  }
  _itemTemplate() {
    if (this._hasSlot("item"))
      return '<div class="w-card-item"><slot name="item"></slot></div>';
    const hasTitle = this.title || this._hasSlot("title");
    const hasSubtitle = this.subtitle || this._hasSlot("subtitle");
    const hasPrepend = this.prependAvatar || this.prependIcon || this._hasSlot("prepend");
    const hasAppend = this.appendAvatar || this.appendIcon || this._hasSlot("append");
    if (!hasTitle && !hasSubtitle && !hasPrepend && !hasAppend)
      return "";
    return `<div class="w-card-item">
      ${hasPrepend ? `<span class="w-card-item__prepend">${this._mediaTemplate("prepend")}<slot name="prepend"></slot></span>` : ""}
      <span class="w-card-item__content">
        ${hasTitle ? `<span class="w-card-title">${this.title ? this._esc(this.title) + '<slot name="title" hidden></slot>' : '<slot name="title"></slot>'}</span>` : ""}
        ${hasSubtitle ? `<span class="w-card-subtitle">${this.subtitle ? this._esc(this.subtitle) + '<slot name="subtitle" hidden></slot>' : '<slot name="subtitle"></slot>'}</span>` : ""}
      </span>
      ${hasAppend ? `<span class="w-card-item__append"><slot name="append"></slot>${this._mediaTemplate("append")}</span>` : ""}
    </div>`;
  }
  _mediaTemplate(side) {
    const avatar = side === "prepend" ? this.prependAvatar : this.appendAvatar;
    const icon = side === "prepend" ? this.prependIcon : this.appendIcon;
    if (avatar)
      return `<span class="w-avatar w-avatar--small"><img src="${this._esc(avatar)}" alt=""></span>`;
    if (icon)
      return `<span class="w-card-icon" aria-hidden="true">${this._esc(icon)}</span>`;
    return "";
  }
  _textTemplate() {
    if (this._hasSlot("text"))
      return '<div class="w-card-text"><slot name="text"></slot></div>';
    if (this.text)
      return `<div class="w-card-text">${this._esc(this.text)}<slot name="text" hidden></slot></div>`;
    return "";
  }
  _actionsTemplate() {
    return this._hasSlot("actions") ? '<div class="w-card-actions"><slot name="actions"></slot></div>' : "";
  }
  _defaultTemplate() {
    if (!this._hasDefaultSlot())
      return "<slot hidden></slot>";
    return this._hasStructuredDefault() ? "<slot></slot>" : '<div class="w-card-body"><slot></slot></div>';
  }
  _variant() {
    if (this._bool("flat"))
      return "flat";
    const variant = this._attr("variant", "elevated");
    return this.constructor.variants.includes(variant) ? variant : "elevated";
  }
  _roundedClass() {
    const value = this.getAttribute("rounded");
    if (!value || value === "true")
      return "w-card--rounded";
    return "w-card--rounded-" + value;
  }
  _normalizeColor(value) {
    const token = String(value || "").toLowerCase();
    if (!token)
      return "";
    if (token === "danger")
      return "error";
    if (token === "info")
      return "primary";
    return this.constructor.colors.includes(token) ? token : "primary";
  }
  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
  _hasDefaultSlot() {
    return this._defaultNodes().some((node) => this._hasMeaningfulNode(node));
  }
  _hasStructuredDefault() {
    return this._defaultNodes().some((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE || node.hasAttribute("slot"))
        return false;
      const tag = node.tagName.toLowerCase();
      if (tag.indexOf("w-card-") === 0)
        return true;
      return Array.from(node.classList || []).some((name) => name.indexOf("w-card-") === 0);
    });
  }
  _defaultNodes() {
    const currentSlot = this.querySelector("slot:not([name])");
    if (currentSlot)
      return Array.from(currentSlot.childNodes);
    return Array.from(this.childNodes).filter((node) => {
      return !(node.nodeType === Node.ELEMENT_NODE && node.hasAttribute("slot"));
    });
  }
  _hasMeaningfulNode(node) {
    return node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE && node.textContent.trim();
  }
}
if (!customElements.get("w-card")) {
  customElements.define("w-card", WCard);
}

// src/components/card-title.js
class WCardTitle extends WElement {
  _template() {
    return `<div class="w-card-title"><slot></slot></div>`;
  }
}
if (!customElements.get("w-card-title")) {
  customElements.define("w-card-title", WCardTitle);
}

// src/components/card-subtitle.js
class WCardSubtitle extends WElement {
  _template() {
    return `<div class="w-card-subtitle"><slot></slot></div>`;
  }
}
if (!customElements.get("w-card-subtitle")) {
  customElements.define("w-card-subtitle", WCardSubtitle);
}

// src/components/card-text.js
class WCardText extends WElement {
  _template() {
    return `<div class="w-card-text"><slot></slot></div>`;
  }
}
if (!customElements.get("w-card-text")) {
  customElements.define("w-card-text", WCardText);
}

// src/components/card-actions.js
class WCardActions extends WElement {
  _template() {
    return `<div class="w-card-actions"><slot></slot></div>`;
  }
}
if (!customElements.get("w-card-actions")) {
  customElements.define("w-card-actions", WCardActions);
}

// src/components/card-item.js
class WCardItem extends WElement {
  static attrs = ["title", "subtitle", "prepend-avatar", "prepend-icon", "append-avatar", "append-icon", "density"];
  get title() {
    return this._attr("title", "");
  }
  get subtitle() {
    return this._attr("subtitle", "");
  }
  get prependAvatar() {
    return this._attr("prepend-avatar", "");
  }
  get prependIcon() {
    return this._attr("prepend-icon", "");
  }
  get appendAvatar() {
    return this._attr("append-avatar", "");
  }
  get appendIcon() {
    return this._attr("append-icon", "");
  }
  get density() {
    return this._attr("density", "");
  }
  _template() {
    const hasPrepend = this.prependAvatar || this.prependIcon || this._hasSlot("prepend");
    const hasAppend = this.appendAvatar || this.appendIcon || this._hasSlot("append");
    const hasTitle = this.title || this._hasSlot("title");
    const hasSubtitle = this.subtitle || this._hasSlot("subtitle");
    const densityClass = this.density ? " w-card-item--" + this.density : "";
    return `<div class="w-card-item${densityClass}">
      ${hasPrepend ? `<span class="w-card-item__prepend">${this._mediaTemplate("prepend")}<slot name="prepend"></slot></span>` : ""}
      <span class="w-card-item__content">
        ${hasTitle ? `<span class="w-card-title">${this.title ? this._esc(this.title) + '<slot name="title" hidden></slot>' : '<slot name="title"></slot>'}</span>` : ""}
        ${hasSubtitle ? `<span class="w-card-subtitle">${this.subtitle ? this._esc(this.subtitle) + '<slot name="subtitle" hidden></slot>' : '<slot name="subtitle"></slot>'}</span>` : ""}
        <slot></slot>
      </span>
      ${hasAppend ? `<span class="w-card-item__append"><slot name="append"></slot>${this._mediaTemplate("append")}</span>` : ""}
    </div>`;
  }
  _mediaTemplate(side) {
    const avatar = side === "prepend" ? this.prependAvatar : this.appendAvatar;
    const icon = side === "prepend" ? this.prependIcon : this.appendIcon;
    if (avatar)
      return `<span class="w-avatar w-avatar--small"><img src="${this._esc(avatar)}" alt=""></span>`;
    if (icon)
      return `<span class="w-card-icon" aria-hidden="true">${this._esc(icon)}</span>`;
    return "";
  }
  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
}
if (!customElements.get("w-card-item")) {
  customElements.define("w-card-item", WCardItem);
}

// src/components/badge.js
class WBadge extends WElement {
  static attrs = [
    "variant",
    "color",
    "text-color",
    "content",
    "icon",
    "dot",
    "dot-size",
    "max",
    "active",
    "model-value",
    "inline",
    "floating",
    "location",
    "offset-x",
    "offset-y",
    "bordered",
    "rounded",
    "label"
  ];
  static colors = ["primary", "secondary", "tertiary", "success", "warning", "error", "danger", "info"];
  static variants = ["filled", "outlined", "text", "plain", "tonal"];
  static locations = {
    "top-end": "top-end",
    "top end": "top-end",
    "top-right": "top-end",
    "top-start": "top-start",
    "top start": "top-start",
    "top-left": "top-start",
    "bottom-end": "bottom-end",
    "bottom end": "bottom-end",
    "bottom-right": "bottom-end",
    "bottom-start": "bottom-start",
    "bottom start": "bottom-start",
    "bottom-left": "bottom-start"
  };
  get variant() {
    return this._attr("variant", "filled");
  }
  get color() {
    return this._normalizeColor(this._attr("color", "error"));
  }
  get textColor() {
    return this._normalizeColor(this._attr("text-color", ""));
  }
  get content() {
    return this._attr("content", "");
  }
  get icon() {
    return this._attr("icon", "");
  }
  get max() {
    return this._attr("max", "");
  }
  get dot() {
    return this._bool("dot") || this.variant === "dot";
  }
  get dotSize() {
    return this._attr("dot-size", "");
  }
  get inline() {
    return this._bool("inline");
  }
  get floating() {
    return this._bool("floating");
  }
  get location() {
    return this._attr("location", "top-end");
  }
  get offsetX() {
    return this._attr("offset-x", "");
  }
  get offsetY() {
    return this._attr("offset-y", "");
  }
  get bordered() {
    return this._bool("bordered");
  }
  get labelStyle() {
    return this.hasAttribute("label") && ["", "true"].includes(this.getAttribute("label"));
  }
  get active() {
    const attr = this.hasAttribute("model-value") ? "model-value" : this.hasAttribute("active") ? "active" : "";
    if (!attr)
      return true;
    return !["false", "0", "off", "hidden"].includes(String(this.getAttribute(attr)).toLowerCase());
  }
  _template() {
    const hasBubble = this._hasBubble();
    const inline = this.inline || !hasBubble;
    if (inline) {
      if (!this.active && hasBubble)
        return '<span class="w-badge w-badge--hidden" hidden><slot></slot><slot name="badge"></slot></span>';
      const content = this._badgeContent();
      return `<span class="${this._badgeClass()}${this.labelStyle ? " w-badge-label" : ""}"${this._badgeAttrs()}${this._badgeStyle()}>${content || "<slot></slot>"}${content ? "<slot hidden></slot>" : ""}</span>`;
    }
    const locationClass = " w-badge-wrap--" + this._location();
    const floatingClass = this.floating ? " w-badge-wrap--floating" : "";
    return `<span class="w-badge-wrap${locationClass}${floatingClass}">
      <slot></slot>
      ${this.active ? `<span class="w-badge-content ${this._badgeClass()}"${this._badgeAttrs()}${this._badgeStyle()}>${this._badgeContent()}</span>` : '<slot name="badge" hidden></slot>'}
    </span>`;
  }
  _hasBubble() {
    return this.content || this.icon || this.dot || this._hasSlot("badge") || this.hasAttribute("color") || this.hasAttribute("bordered") || this.hasAttribute("max");
  }
  _badgeContent() {
    if (this.dot)
      return "";
    if (this._hasSlot("badge"))
      return '<slot name="badge"></slot>';
    if (this.icon)
      return `<span class="w-badge-icon" aria-hidden="true">${this._esc(this.icon)}</span>`;
    return this._esc(this._cappedContent());
  }
  _cappedContent() {
    if (!this.max)
      return this.content;
    const value = Number(this.content);
    const max = Number(this.max);
    if (!Number.isFinite(value) || !Number.isFinite(max))
      return this.content;
    return value <= max ? String(value) : String(max) + "+";
  }
  _badgeClass() {
    const variant = this._variant();
    return [
      "w-badge",
      "w-badge-" + variant,
      "w-badge-" + this.color,
      this.textColor ? "w-badge-text-" + this.textColor : "",
      this.dot ? "w-badge-dot" : "",
      this.bordered ? "w-badge-bordered" : "",
      this.hasAttribute("rounded") ? this._roundedClass() : ""
    ].filter(Boolean).join(" ");
  }
  _badgeAttrs() {
    const label = this._labelText();
    const aria = label ? ` aria-label="${this._esc(label)}"` : "";
    const liveAttrs = this.active ? ' role="status" aria-live="polite" aria-atomic="true"' : "";
    return aria + liveAttrs;
  }
  _badgeStyle() {
    const styles = [];
    const dotSize = this._cssLength(this.dotSize);
    const offsetX = this._cssLength(this.offsetX);
    const offsetY = this._cssLength(this.offsetY);
    if (dotSize)
      styles.push("--w-badge-dot-size: " + dotSize);
    if (offsetX)
      styles.push("--w-badge-offset-x: " + offsetX);
    if (offsetY)
      styles.push("--w-badge-offset-y: " + offsetY);
    return styles.length ? ` style="${styles.join("; ")}"` : "";
  }
  _labelText() {
    const label = this.getAttribute("label");
    if (label && label !== "true")
      return label;
    return this.content || this.icon || (this.dot ? "Badge" : "");
  }
  _location() {
    return this.constructor.locations[String(this.location || "").toLowerCase()] || "top-end";
  }
  _variant() {
    const variant = this.dot ? "filled" : this.variant;
    return this.constructor.variants.includes(variant) ? variant : "filled";
  }
  _roundedClass() {
    const value = this.getAttribute("rounded");
    if (!value || value === "true")
      return "w-badge-rounded";
    return "w-badge-rounded-" + value;
  }
  _cssLength(value) {
    const raw = String(value || "").trim();
    if (!raw)
      return "";
    if (/^\d+(\.\d+)?$/.test(raw))
      return raw + "px";
    if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(raw))
      return raw;
    return "";
  }
  _normalizeColor(value) {
    const token = String(value || "").toLowerCase();
    if (!token)
      return "";
    if (token === "danger")
      return "error";
    if (token === "info")
      return "primary";
    return this.constructor.colors.includes(token) ? token : "primary";
  }
  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
}
if (!customElements.get("w-badge")) {
  customElements.define("w-badge", WBadge);
}

// src/components/list-item.js
class WListItem extends WElement {
  static attrs = [
    "title",
    "subtitle",
    "value",
    "href",
    "to",
    "target",
    "rel",
    "link",
    "prepend-icon",
    "append-icon",
    "prepend-avatar",
    "append-avatar",
    "lines",
    "density",
    "variant",
    "active-class",
    "tabindex",
    "active",
    "disabled",
    "nav",
    "slim",
    "rounded",
    "border",
    "elevation",
    "ripple"
  ];
  get itemTitle() {
    return this._attr("title", "");
  }
  get subtitle() {
    return this._attr("subtitle", "");
  }
  get value() {
    return this._attr("value", this.itemTitle);
  }
  get href() {
    return this._attr("href", this._attr("to", ""));
  }
  get target() {
    return this._attr("target", "");
  }
  get rel() {
    return this._attr("rel", "");
  }
  get link() {
    return this._bool("link");
  }
  get prependIcon() {
    return this._attr("prepend-icon", "");
  }
  get appendIcon() {
    return this._attr("append-icon", "");
  }
  get prependAvatar() {
    return this._attr("prepend-avatar", "");
  }
  get appendAvatar() {
    return this._attr("append-avatar", "");
  }
  get lines() {
    return this._attr("lines", "");
  }
  get density() {
    return this._attr("density", "");
  }
  get variant() {
    return this._attr("variant", "text");
  }
  get activeClass() {
    return this._attr("active-class", "");
  }
  get tabindex() {
    return this._attr("tabindex", "");
  }
  get nav() {
    return this._bool("nav");
  }
  get slim() {
    return this._bool("slim");
  }
  get rounded() {
    return this.hasAttribute("rounded");
  }
  get border() {
    return this._bool("border");
  }
  get elevation() {
    return this._attr("elevation", "");
  }
  get active() {
    return this._bool("active");
  }
  set active(v) {
    v ? this.setAttribute("active", "") : this.removeAttribute("active");
  }
  get disabled() {
    return this._bool("disabled");
  }
  _template() {
    const tag = this.href && !this.disabled ? "a" : "button";
    const activeClass = this.active ? " active" + (this.activeClass ? " " + this._classList(this.activeClass) : "") : "";
    const disabledClass = this.disabled ? " disabled" : "";
    const linesClass = this.lines && this.lines !== "one" ? " w-list-item--" + this.lines + "-line" : "";
    const densityClass = this.density ? " w-list-item--" + this.density : "";
    const variantClass = this.variant ? " w-list-item--variant-" + this._classToken(this.variant) : "";
    const navClass = this.nav ? " w-list-item--nav" : "";
    const slimClass = this.slim ? " w-list-item--slim" : "";
    const roundedClass = this.rounded ? " w-list-item--rounded" : "";
    const borderClass = this.border ? " w-list-item--border" : "";
    const elevationClass = this.elevation ? " w-list-item--elevation-" + this._classToken(this.elevation) : "";
    const style = this._style();
    const attrs = tag === "a" ? ` href="${this._esc(this.href)}"${this.target ? ` target="${this._esc(this.target)}"` : ""}${this.rel ? ` rel="${this._esc(this.rel)}"` : ""}${this.active ? ' aria-current="page"' : ""}${this.disabled ? ' aria-disabled="true"' : ""}` : ` type="button"${this.disabled ? " disabled" : ""}${this.active ? ' aria-pressed="true"' : ""}`;
    const tabAttr = this.tabindex ? ` tabindex="${this._esc(this.tabindex)}"` : "";
    const role = this.link && tag !== "a" ? ' role="link"' : "";
    const prependMedia = this.prependAvatar ? this._avatar(this.prependAvatar, "prepend") : this.prependIcon ? `<span class="w-list-item-icon" aria-hidden="true">${this._esc(this.prependIcon)}</span>` : "";
    const appendMedia = this.appendAvatar ? this._avatar(this.appendAvatar, "append") : this.appendIcon ? `<span class="w-list-item-icon" aria-hidden="true">${this._esc(this.appendIcon)}</span>` : "";
    const prepend = prependMedia || this.querySelector('[slot="prepend"]') ? `<span class="w-list-item-prepend">${prependMedia}<slot name="prepend"></slot></span>` : '<span class="w-list-item-prepend" aria-hidden="true"></span>';
    const append = appendMedia || this.querySelector('[slot="append"]') ? `<span class="w-list-item-append">${appendMedia}<slot name="append"></slot></span>` : '<span class="w-list-item-append" aria-hidden="true"></span>';
    const content = this.itemTitle || this.subtitle ? `<span class="w-list-item-content">
          ${this.itemTitle ? `<span class="w-list-item-title">${this._esc(this.itemTitle)}</span>` : ""}
          ${this.subtitle ? `<span class="w-list-item-subtitle">${this._esc(this.subtitle)}</span>` : ""}
        </span>` : '<span class="w-list-item-content"><slot></slot></span>';
    return `<${tag} class="w-list-item${activeClass}${disabledClass}${linesClass}${densityClass}${variantClass}${navClass}${slimClass}${roundedClass}${borderClass}${elevationClass}"${attrs}${tabAttr}${role}${style}>
      ${prepend}${content}${append}
    </${tag}>`;
  }
  _events() {
    const control = this._q(".w-list-item");
    if (!control || this.disabled)
      return;
    if (this.hasAttribute("ripple"))
      this._attachRipple(control);
    control.addEventListener("click", () => {
      this._emit("change", { value: this.value, title: this.itemTitle });
    });
    control.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ")
        return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName))
        return;
      event.preventDefault();
      control.click();
    });
  }
  _avatar(value, position) {
    const text = String(value);
    const isImage = /^(https?:|\/|\.\/|\.\.\/|data:image\/)/.test(text);
    const label = position === "prepend" ? this.itemTitle || "Avatar" : "Avatar";
    const content = isImage ? `<img class="w-avatar-image" src="${this._esc(text)}" alt="${this._esc(label)}">` : `<span class="w-avatar-text">${this._esc(text)}</span>`;
    return `<span class="w-avatar w-avatar-sm w-list-item-avatar" role="img" aria-label="${this._esc(label)}">${content}<span class="w-avatar-underlay" aria-hidden="true"></span></span>`;
  }
  _style() {
    const styles = [];
    if (this.hasAttribute("color"))
      styles.push(["--w-list-item-accent", "var(--w-" + this._classToken(this._attr("color", "")) + ")"]);
    if (this.hasAttribute("base-color"))
      styles.push(["--w-list-item-base", "var(--w-" + this._classToken(this._attr("base-color", "")) + ")"]);
    if (this.hasAttribute("active-color"))
      styles.push(["--w-list-item-active", "var(--w-" + this._classToken(this._attr("active-color", "")) + ")"]);
    return styles.length ? ` style="${styles.map(([name, value]) => `${name}: ${this._esc(value)}`).join("; ")}"` : "";
  }
  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  }
  _classList(value) {
    return String(value).split(/\s+/).map((entry) => this._classToken(entry)).filter(Boolean).join(" ");
  }
}
customElements.define("w-list-item", WListItem);

// src/components/list.js
class WList extends WElement {
  static attrs = [
    "items",
    "item-title",
    "item-value",
    "item-children",
    "item-type",
    "density",
    "lines",
    "variant",
    "nav",
    "selectable",
    "activatable",
    "multiple",
    "selected",
    "activated",
    "opened",
    "disabled",
    "slim",
    "prepend-gap",
    "indent",
    "expand-icon",
    "collapse-icon"
  ];
  get itemsAttr() {
    return this._attr("items", "");
  }
  get itemTitleKey() {
    return this._attr("item-title", "title");
  }
  get itemValueKey() {
    return this._attr("item-value", "value");
  }
  get itemChildrenKey() {
    return this._attr("item-children", "children");
  }
  get itemTypeKey() {
    return this._attr("item-type", "type");
  }
  get density() {
    return this._attr("density", "");
  }
  get lines() {
    return this._attr("lines", "");
  }
  get variant() {
    return this._attr("variant", "");
  }
  get nav() {
    return this._bool("nav");
  }
  get selectable() {
    return this._bool("selectable");
  }
  get activatable() {
    return this._bool("activatable");
  }
  get multiple() {
    return this._bool("multiple");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get slim() {
    return this._bool("slim");
  }
  get opened() {
    return this._readValues(this._attr("opened", ""));
  }
  get selectedValue() {
    return this._readValue(this._attr("selected", ""));
  }
  get activatedValue() {
    return this._readValue(this._attr("activated", ""));
  }
  _template() {
    const densityClass = this.density ? " w-list--" + this.density : "";
    const linesClass = this.lines && this.lines !== "one" ? " w-list--" + this.lines + "-line" : "";
    const navClass = this.nav ? " w-list--nav" : "";
    const variantClass = this.variant ? " w-list--variant-" + this._classToken(this.variant) : "";
    const slimClass = this.slim ? " w-list--slim" : "";
    const style = this._style();
    const generated = this.itemsAttr ? this._renderItems(this._parseItems(this.itemsAttr), 0) : "<slot></slot>";
    const multiselect = this.selectable && this.multiple ? ' aria-multiselectable="true"' : "";
    return `<div class="w-list${densityClass}${linesClass}${navClass}${variantClass}${slimClass}" role="${this.selectable || this.activatable ? "listbox" : "list"}"${multiselect}${style}>${generated}</div>`;
  }
  _events() {
    const list = this._q(".w-list");
    if (!list)
      return;
    this._syncItemState();
    this._syncOpenedGroups();
    this.addEventListener("change", (event) => {
      if (event.target !== this)
        event.stopImmediatePropagation();
    });
    list.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const item = target ? target.closest("w-list-item") : null;
      if (!item || item.disabled)
        return;
      if (!this.selectable && !this.activatable)
        return;
      if (this.disabled)
        return;
      this._chooseItem(item);
    });
    list.addEventListener("keydown", (event) => {
      const direction = this._navigationDirection(event.key);
      if (!direction)
        return;
      const target = event.target instanceof Element ? event.target : null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
        return;
      const focusables = this._focusableItems();
      if (!focusables.length)
        return;
      event.preventDefault();
      const active = document.activeElement;
      let index = focusables.indexOf(active);
      if (direction === "first")
        index = 0;
      else if (direction === "last")
        index = focusables.length - 1;
      else
        index = index < 0 ? 0 : (index + (direction === "next" ? 1 : -1) + focusables.length) % focusables.length;
      focusables[index].focus();
    });
    this.addEventListener("toggle", (event) => {
      const group = event.target instanceof Element ? event.target.closest("w-list-group") : null;
      if (!group || group === this || !this.contains(group))
        return;
      const value = group.getAttribute("value") || group.getAttribute("title") || "";
      if (!value)
        return;
      const next = new Set(this.opened);
      if (group.open)
        next.add(value);
      else
        next.delete(value);
      const opened = Array.from(next);
      this._silentSet("opened", JSON.stringify(opened));
      this._emit("change", { value: opened, name: "opened" });
    });
  }
  _chooseItem(item) {
    const rawValue = item.value;
    const value = rawValue == null ? "" : String(rawValue);
    if (this.selectable) {
      const selected = this.multiple ? this._toggleArray(this._readValues(this._attr("selected", "")), value) : value;
      this._silentSet("selected", Array.isArray(selected) ? JSON.stringify(selected) : selected);
      this._syncItemState();
      this._emit("change", { value: selected, name: "selected", id: value });
      return;
    }
    const activated = this.multiple ? this._toggleArray(this._readValues(this._attr("activated", "")), value) : value;
    this._silentSet("activated", Array.isArray(activated) ? JSON.stringify(activated) : activated);
    this._syncItemState();
    this._emit("change", { value: activated, name: "activated", id: value });
  }
  _syncItemState() {
    const selected = this._readValues(this._attr("selected", ""));
    const activated = this._readValues(this._attr("activated", ""));
    this.querySelectorAll("w-list-item").forEach((el) => {
      const value = String(el.value);
      const active = this.selectable ? selected.includes(value) : this.activatable ? activated.includes(value) : el.hasAttribute("active");
      el.active = active;
      const control = el.querySelector(".w-list-item");
      if (control && (this.selectable || this.activatable)) {
        control.setAttribute("role", "option");
        control.setAttribute("aria-selected", active ? "true" : "false");
      }
    });
  }
  _syncOpenedGroups() {
    if (!this.hasAttribute("opened"))
      return;
    const opened = new Set(this.opened);
    this.querySelectorAll("w-list-group").forEach((group) => {
      const value = group.getAttribute("value") || group.getAttribute("title") || "";
      if (!value)
        return;
      const shouldOpen = opened.has(value);
      if (group.open === shouldOpen)
        return;
      group._silentSet("open", shouldOpen ? "true" : null);
      if (typeof group._render === "function") {
        group._render();
        if (typeof group._events === "function")
          group._events();
      }
    });
  }
  _renderItems(items, depth) {
    return items.map((item) => {
      if (typeof item === "string")
        return `<w-list-item title="${this._esc(item)}" value="${this._esc(item)}"></w-list-item>`;
      if (!item || typeof item !== "object")
        return "";
      const type = item[this.itemTypeKey] || item.type || "item";
      if (type === "divider")
        return '<div class="w-list-divider" role="separator"></div>';
      if (type === "subheader")
        return `<div class="w-list-subheader">${this._esc(item[this.itemTitleKey] || item.title || "")}</div>`;
      const title = item[this.itemTitleKey] ?? item.title ?? "";
      const value = item[this.itemValueKey] ?? item.value ?? title;
      const children = item[this.itemChildrenKey] || item.children;
      if (Array.isArray(children) && children.length) {
        const open = this.opened.includes(String(value)) || item.open ? " open" : "";
        const prepend = item.prependIcon || item["prepend-icon"] || "";
        return `<w-list-group title="${this._esc(title)}" value="${this._esc(value)}"${prepend ? ` prepend-icon="${this._esc(prepend)}"` : ""}${open}>${this._renderItems(children, depth + 1)}</w-list-group>`;
      }
      return this._renderGeneratedItem(item, title, value);
    }).join("");
  }
  _renderGeneratedItem(item, title, value) {
    const attrs = [
      ["title", title],
      ["value", value],
      ["subtitle", item.subtitle],
      ["href", item.href || item.to],
      ["prepend-icon", item.prependIcon || item["prepend-icon"]],
      ["append-icon", item.appendIcon || item["append-icon"]],
      ["prepend-avatar", item.prependAvatar || item["prepend-avatar"]],
      ["append-avatar", item.appendAvatar || item["append-avatar"]],
      ["lines", item.lines],
      ["density", item.density],
      ["variant", item.variant]
    ].filter((entry) => entry[1] != null && entry[1] !== "").map(([name, value2]) => ` ${name}="${this._esc(value2)}"`).join("");
    return `<w-list-item${attrs}${item.disabled ? " disabled" : ""}${item.active ? " active" : ""}></w-list-item>`;
  }
  _parseItems(value) {
    if (!value)
      return [];
    const text = String(value).trim();
    const parsed = this._parseStructuredValue(text);
    if (Array.isArray(parsed))
      return parsed;
    return text.replace(/^\[|\]$/g, "").split(";").map((part) => part.trim()).filter(Boolean);
  }
  _readValue(value) {
    const values = this._readValues(value);
    return this.multiple ? values : values[0] || "";
  }
  _readValues(value) {
    if (!value)
      return [];
    const text = String(value).trim();
    if (!text)
      return [];
    const parsed = this._parseStructuredValue(text);
    if (Array.isArray(parsed))
      return parsed.map(String);
    if (parsed != null)
      return [String(parsed)];
    return text.split(",").map((part) => part.trim()).filter(Boolean);
  }
  _toggleArray(values, value) {
    return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
  }
  _navigationDirection(key) {
    if (key === "ArrowDown")
      return "next";
    if (key === "ArrowUp")
      return "prev";
    if (key === "Home")
      return "first";
    if (key === "End")
      return "last";
    return "";
  }
  _focusableItems() {
    return Array.from(this.querySelectorAll(".w-list-item")).filter((el) => {
      if (!(el instanceof HTMLElement))
        return false;
      if (el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true")
        return false;
      return el.offsetParent !== null || el.getClientRects().length > 0;
    });
  }
  _style() {
    const pairs = [];
    if (this.hasAttribute("indent"))
      pairs.push(["--w-list-indent", this._attr("indent", "")]);
    if (this.hasAttribute("prepend-gap"))
      pairs.push(["--w-list-prepend-gap", this._attr("prepend-gap", "")]);
    return pairs.length ? ` style="${pairs.map(([name, value]) => `${name}: ${this._esc(value)}`).join("; ")}"` : "";
  }
  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  }
  _parseStructuredValue(text) {
    try {
      return JSON.parse(text);
    } catch (_) {
      if (!text.includes("'"))
        return null;
      try {
        const normalized = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_2, value) => JSON.stringify(value.replace(/\\'/g, "'")));
        return JSON.parse(normalized);
      } catch (_2) {
        return null;
      }
    }
  }
}
customElements.define("w-list", WList);

// src/components/list-item-title.js
class WListItemTitle extends WElement {
  _template() {
    return `<div class="w-list-item-title"><slot></slot></div>`;
  }
}
if (!customElements.get("w-list-item-title")) {
  customElements.define("w-list-item-title", WListItemTitle);
}

// src/components/list-item-subtitle.js
class WListItemSubtitle extends WElement {
  _template() {
    return `<div class="w-list-item-subtitle"><slot></slot></div>`;
  }
}
if (!customElements.get("w-list-item-subtitle")) {
  customElements.define("w-list-item-subtitle", WListItemSubtitle);
}

// src/components/list-subheader.js
class WListSubheader extends WElement {
  _template() {
    return `<div class="w-list-subheader"><slot></slot></div>`;
  }
}
if (!customElements.get("w-list-subheader")) {
  customElements.define("w-list-subheader", WListSubheader);
}

// src/components/table.js
class WTable extends WElement {
  static attrs = [
    "density",
    "striped",
    "hover",
    "gridlines",
    "grid",
    "responsive",
    "fixed-header",
    "fixed-footer",
    "height"
  ];
  get density() {
    return this._attr("density", "");
  }
  get striped() {
    const value = this._attr("striped", null);
    if (value === null)
      return "";
    return value === "odd" ? "odd" : "even";
  }
  get hover() {
    return this._bool("hover");
  }
  get grid() {
    return this._bool("grid");
  }
  get gridlines() {
    const value = this._attr("gridlines", "horizontal");
    if (["horizontal", "vertical", "all", "none"].includes(value))
      return value;
    return value === "" ? "all" : "horizontal";
  }
  get responsive() {
    const value = this._attr("responsive", "auto");
    return ["auto", "stack", "scroll"].includes(value) ? value : "auto";
  }
  get fixedHeader() {
    return this._bool("fixed-header");
  }
  get fixedFooter() {
    return this._bool("fixed-footer");
  }
  get height() {
    return this._attr("height", "");
  }
  _hasSlotted(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
  _template() {
    const wrap = ["w-table-wrap", "w-table-wrap--responsive-" + this.responsive];
    if (this.fixedHeader)
      wrap.push("w-table-wrap--fixed-header");
    if (this.fixedFooter)
      wrap.push("w-table-wrap--fixed-footer");
    const style = this.height ? ` style="max-height: ${this._esc(this.height)};"` : "";
    const top = this._hasSlotted("top") ? '<div class="w-table-top"><slot name="top"></slot></div>' : "";
    const bottom = this._hasSlotted("bottom") ? '<div class="w-table-bottom"><slot name="bottom"></slot></div>' : "";
    return `${top}<div class="${wrap.join(" ")}"${style}>
      <div class="w-table-grid" role="table"><slot></slot></div>
    </div>${bottom}`;
  }
  _events() {
    const table = this.querySelector("table");
    const grid = this._q(".w-table-grid");
    if (table) {
      table.classList.add("w-table");
      table.classList.remove("w-table--responsive-auto", "w-table--responsive-stack");
      if (this.responsive !== "scroll")
        table.classList.add("w-table--responsive-" + this.responsive);
      table.classList.remove("w-table--striped", "w-table--striped-odd");
      if (this.striped === "even")
        table.classList.add("w-table--striped");
      else if (this.striped === "odd")
        table.classList.add("w-table--striped-odd");
      ["horizontal", "vertical", "all", "none"].forEach((line) => {
        table.classList.toggle("w-table--gridlines-" + line, this.gridlines === line);
      });
      table.classList.toggle("w-table--no-hover", !this.hover);
      ["dense", "comfortable"].forEach((density) => {
        table.classList.toggle("w-table--" + density, this.density === density || density === "dense" && this.density === "compact");
      });
      this._labelNativeCells(table);
      return;
    }
    if (!grid)
      return;
    grid.classList.remove("w-table-grid--responsive-auto", "w-table-grid--responsive-stack");
    if (this.responsive !== "scroll")
      grid.classList.add("w-table-grid--responsive-" + this.responsive);
    grid.classList.remove("w-table-grid--striped", "w-table-grid--striped-odd");
    if (this.striped === "even")
      grid.classList.add("w-table-grid--striped");
    else if (this.striped === "odd")
      grid.classList.add("w-table-grid--striped-odd");
    grid.classList.toggle("w-table-grid--no-hover", !this.hover);
    grid.classList.toggle("w-table-grid--dense", this.density === "compact" || this.density === "dense");
    grid.classList.toggle("w-table-grid--comfortable", this.density === "comfortable");
    this.querySelectorAll("w-row, .w-grid-row").forEach((row) => {
      row.setAttribute("role", "row");
      if (row.hasAttribute("header"))
        row.classList.add("w-table-header");
    });
    this.querySelectorAll('w-col, .w-grid-col, [class*="w-grid-col-"]').forEach((cell) => {
      const row = cell.closest("w-row, .w-grid-row");
      cell.setAttribute("role", row && (row.classList.contains("w-table-header") || row.hasAttribute("header")) ? "columnheader" : "cell");
    });
    this._labelGridCells(grid);
  }
  _labelNativeCells(table) {
    const labels = Array.from(table.querySelectorAll("thead th")).map((cell) => cell.textContent.trim());
    if (!labels.length)
      return;
    table.querySelectorAll("tbody tr").forEach((row) => {
      Array.from(row.cells).forEach((cell, index) => {
        if (!cell.hasAttribute("data-label") && labels[index])
          cell.setAttribute("data-label", labels[index]);
      });
    });
  }
  _labelGridCells(grid) {
    const slot = grid.querySelector(":scope > slot");
    const rows = Array.from(slot ? slot.children : grid.children).filter((row) => row.matches("w-row, .w-grid-row"));
    const header = rows.find((row) => row.hasAttribute("header") || row.classList.contains("w-table-header"));
    if (!header)
      return;
    const labels = Array.from(header.children).map((cell) => cell.textContent.trim());
    rows.filter((row) => row !== header).forEach((row) => {
      Array.from(row.children).forEach((cell, index) => {
        if (!cell.hasAttribute("data-label") && labels[index])
          cell.setAttribute("data-label", labels[index]);
      });
    });
  }
}
customElements.define("w-table", WTable);

// src/components/alert.js
class WAlert extends WElement {
  static attrs = [
    "type",
    "variant",
    "color",
    "title",
    "text",
    "closable",
    "dismissible",
    "close-label",
    "close-icon",
    "icon",
    "icon-size",
    "prominent",
    "border",
    "border-color",
    "model-value",
    "hidden"
  ];
  static contextualTypes = ["info", "success", "warning", "error"];
  static styleVariants = ["flat", "tonal", "outlined", "text", "plain", "elevated"];
  static borderSides = { true: "start", start: "start", left: "start", end: "end", right: "end", top: "top", bottom: "bottom" };
  static colorTokens = ["primary", "secondary", "tertiary", "success", "warning", "error", "danger", "info"];
  get rawType() {
    return this._attr("type", "");
  }
  get rawVariant() {
    return this._attr("variant", "flat");
  }
  get title() {
    return this._attr("title", "");
  }
  get text() {
    return this._attr("text", "");
  }
  get closeLabel() {
    return this._attr("close-label", "Close alert");
  }
  get closeIcon() {
    return this._attr("close-icon", "");
  }
  get iconSize() {
    return this._attr("icon-size", "");
  }
  get prominent() {
    return this._bool("prominent");
  }
  get closable() {
    return this._bool("closable") || this._bool("dismissible");
  }
  get active() {
    if (this.hasAttribute("model-value")) {
      const v = String(this.getAttribute("model-value")).toLowerCase();
      return !(v === "false" || v === "0" || v === "null");
    }
    return !this.hasAttribute("hidden");
  }
  get contextualType() {
    if (this._isContextual(this.rawType))
      return this.rawType;
    if (!this.rawType && this._isContextual(this.rawVariant))
      return this.rawVariant;
    return "";
  }
  get styleVariant() {
    const variant = this.rawVariant;
    if (!this.rawType && this._isContextual(variant))
      return "flat";
    return this.constructor.styleVariants.includes(variant) ? variant : "flat";
  }
  get colorName() {
    const color = this._attr("color", "");
    if (color)
      return this._normalizeColor(color);
    return this.contextualType || "info";
  }
  get borderSide() {
    if (!this.hasAttribute("border"))
      return "";
    const value = this.getAttribute("border");
    const key = !value || value === "" ? "true" : String(value).toLowerCase();
    return this.constructor.borderSides[key] || "start";
  }
  get borderColor() {
    return this._normalizeColor(this._attr("border-color", this.colorName));
  }
  _template() {
    if (!this.active) {
      return `<div class="w-alert w-alert--hidden" hidden aria-hidden="true">
        <slot name="prepend"></slot>
        <slot name="title"></slot>
        <slot name="text"></slot>
        <slot></slot>
        <slot name="append"></slot>
        <slot name="close"></slot>
      </div>`;
    }
    const type = this.contextualType;
    const color = this.colorName;
    const borderSide = this.borderSide;
    const live = type === "error" ? "assertive" : "polite";
    const classes = [
      "w-alert",
      type ? "w-alert-" + type : "",
      "w-alert--type-" + (type || "custom"),
      "w-alert--variant-" + this.styleVariant,
      "w-alert--color-" + color,
      this.prominent ? "w-alert--prominent" : "",
      borderSide ? "w-alert--border w-alert--border-" + borderSide + " w-alert--border-color-" + this.borderColor : ""
    ].filter(Boolean).join(" ");
    const styles = this.iconSize ? ` style="--w-alert-icon-size: ${this._esc(this.iconSize)}"` : "";
    let html = `<div class="${classes}" role="alert" aria-live="${live}"${styles}>`;
    if (borderSide)
      html += '<div class="w-alert-border" aria-hidden="true"></div>';
    html += this._renderPrepend();
    html += '<div class="w-alert-body w-alert-content">';
    if (this._hasSlot("title"))
      html += '<div class="w-alert-title"><slot name="title"></slot></div>';
    else if (this.title)
      html += `<div class="w-alert-title">${this._esc(this.title)}</div>`;
    if (this._hasSlot("text"))
      html += '<div class="w-alert-text"><slot name="text"></slot></div>';
    else if (this.text)
      html += `<div class="w-alert-text">${this._esc(this.text)}</div>`;
    html += "<slot></slot></div>";
    if (this._hasSlot("append"))
      html += '<div class="w-alert-append"><slot name="append"></slot></div>';
    html += this._renderClose();
    html += "</div>";
    return html;
  }
  _events() {
    const close = this._q("[data-w-alert-close]");
    if (!close)
      return;
    close.addEventListener("click", () => this._close());
  }
  _close() {
    if (this.hasAttribute("disabled"))
      return;
    this._silentSet("hidden", "");
    if (this.hasAttribute("model-value"))
      this._silentSet("model-value", "false");
    this._render();
    if (typeof this._events === "function")
      this._events();
    this._applyCommonProps();
    this._emit("update:model-value", false);
    this._emit("close", { value: false });
  }
  _renderPrepend() {
    if (this._hasSlot("prepend")) {
      return '<div class="w-alert-prepend"><slot name="prepend"></slot></div>';
    }
    const icon = this._iconMarkup();
    return icon ? `<div class="w-alert-prepend w-alert-icon" aria-hidden="true">${icon}</div>` : "";
  }
  _renderClose() {
    if (!this.closable && !this._hasSlot("close"))
      return "";
    const content = this._hasSlot("close") ? '<slot name="close"></slot>' : this.closeIcon ? `<span class="w-alert-close-icon" aria-hidden="true">${this._esc(this.closeIcon)}</span>` : '<svg class="w-alert-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    return `<button class="w-alert-dismiss w-alert-close" type="button" aria-label="${this._esc(this.closeLabel)}" data-w-alert-close>${content}</button>`;
  }
  _iconMarkup() {
    const icon = this.getAttribute("icon");
    if (icon != null) {
      if (["false", "0", "none", "off"].includes(String(icon).toLowerCase()))
        return "";
      return `<span class="w-alert-icon-text">${this._esc(icon)}</span>`;
    }
    const icons = {
      info: '<svg class="w-alert-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      success: '<svg class="w-alert-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      warning: '<svg class="w-alert-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      error: '<svg class="w-alert-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
    };
    return icons[this.contextualType || "info"];
  }
  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
  _isContextual(value) {
    return this.constructor.contextualTypes.includes(value);
  }
  _normalizeColor(value) {
    const token = String(value || "").toLowerCase();
    if (token === "danger")
      return "error";
    if (token === "info")
      return "primary";
    return this.constructor.colorTokens.includes(token) ? token : "primary";
  }
}
if (!customElements.get("w-alert")) {
  customElements.define("w-alert", WAlert);
}

// src/components/alert-title.js
class WAlertTitle extends WElement {
  _template() {
    return `<div class="w-alert-title"><slot></slot></div>`;
  }
}
if (!customElements.get("w-alert-title")) {
  customElements.define("w-alert-title", WAlertTitle);
}

// src/components/alert-dialog.js
class WAlertDialog extends WElement {
  static attrs = ["open", "title", "description", "action", "cancel", "destructive"];
  get open() {
    return this._bool("open");
  }
  get title() {
    return this._attr("title", "Confirm action");
  }
  get description() {
    return this._attr("description", "");
  }
  get action() {
    return this._attr("action", "Continue");
  }
  get cancel() {
    return this._attr("cancel", "Cancel");
  }
  get destructive() {
    return this._bool("destructive");
  }
  show() {
    this._setOpen(true, "show");
  }
  close(reason = "programmatic") {
    this._setOpen(false, reason);
  }
  _template() {
    const hasTrigger = !!this.querySelector('[slot="trigger"]');
    const trigger = hasTrigger ? `<span class="w-alert-dialog-trigger"><slot name="trigger"></slot></span>` : `<button class="w-btn w-btn-filled w-alert-dialog-trigger" type="button">${this._esc(this.action)}</button>`;
    const dialog = this.open ? `<div class="w-overlay open"></div>
        <div class="w-dialog-wrapper open" role="alertdialog" aria-modal="true">
          <div class="w-dialog w-alert-dialog">
            <div class="w-dialog-header"><h3 class="w-dialog-title">${this._esc(this.title)}</h3></div>
            <div class="w-dialog-body">
              ${this.description ? `<p class="w-alert-dialog-description">${this._esc(this.description)}</p>` : ""}
              <slot></slot>
            </div>
            <div class="w-dialog-footer">
              <slot name="footer">
                <button class="w-btn w-btn-text" type="button" data-w-alert-cancel>${this._esc(this.cancel)}</button>
                <button class="w-btn w-btn-filled${this.destructive ? " w-btn-danger" : ""}" type="button" data-w-alert-action>${this._esc(this.action)}</button>
              </slot>
            </div>
          </div>
        </div>` : "";
    return `${trigger}${dialog}`;
  }
  _events() {
    const trigger = this._q(".w-alert-dialog-trigger");
    if (trigger)
      trigger.addEventListener("click", () => this.show());
    const cancel = this._q("[data-w-alert-cancel]");
    const action = this._q("[data-w-alert-action]");
    if (cancel)
      cancel.addEventListener("click", () => {
        this._emit("cancel", {});
        this.close("cancel");
      });
    if (action)
      action.addEventListener("click", () => {
        this.close("action");
      });
  }
  _setOpen(open, reason) {
    this._silentSet("open", open ? "" : null);
    this._render();
    this._events();
    if (!open)
      this._emit("close", { reason });
  }
}
if (!customElements.get("w-alert-dialog")) {
  customElements.define("w-alert-dialog", WAlertDialog);
}

// src/components/dialog.js
class WDialog extends WElement {
  static attrs = [
    "open",
    "title",
    "fullscreen",
    "scrollable",
    "persistent",
    "scrim",
    "width",
    "max-width",
    "close-label",
    "hide-close",
    "disabled"
  ];
  get open() {
    return this._bool("open");
  }
  set open(v) {
    v ? this.show() : this.close("programmatic");
  }
  get dialogTitle() {
    return this._attr("title", "");
  }
  get fullscreen() {
    return this._bool("fullscreen");
  }
  get scrollable() {
    return this._bool("scrollable");
  }
  get persistent() {
    return this._bool("persistent");
  }
  get closeLabel() {
    return this._attr("close-label", "Close");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get hasScrim() {
    const scrim = this.getAttribute("scrim");
    return scrim == null || !["false", "0", "none", "off"].includes(String(scrim).toLowerCase());
  }
  _template() {
    if (!this._id)
      this._id = "w-dialog-" + Math.random().toString(36).slice(2, 8);
    const titleAttr = this.dialogTitle;
    const isOpen = this.open ? " open" : "";
    const overlayId = this._id + "-overlay";
    const titleId = this._id + "-title";
    const hasTitle = titleAttr || this._hasSlot("title");
    const classes = [
      "w-dialog-wrapper",
      isOpen.trim(),
      this.fullscreen ? "w-dialog-wrapper--fullscreen" : "",
      this.scrollable ? "w-dialog-wrapper--scrollable" : "",
      this.persistent ? "w-dialog-wrapper--persistent" : ""
    ].filter(Boolean).join(" ");
    const dialogClasses = [
      "w-dialog",
      this.fullscreen ? "w-dialog--fullscreen" : "",
      this.scrollable ? "w-dialog--scrollable" : ""
    ].filter(Boolean).join(" ");
    const style = this._dialogStyle();
    const activator = this._hasSlot("activator") ? '<span class="w-dialog-activator"><slot name="activator"></slot></span>' : '<slot name="activator" hidden></slot>';
    return `${activator}
      <div class="w-overlay${isOpen}${this.hasScrim ? " w-overlay--scrim" : ""}" id="${overlayId}" aria-hidden="true"${this.open ? "" : " hidden"}></div>
      <div class="${classes}" id="${this._id}" data-w-dialog role="dialog" aria-modal="true" aria-hidden="${!this.open}"${hasTitle ? ` aria-labelledby="${titleId}"` : ""}>
        <div class="${dialogClasses}" tabindex="-1"${style}>
          <div class="w-dialog-header">
            <h3 class="w-dialog-title" id="${titleId}">${titleAttr ? this._esc(titleAttr) + '<slot name="title" hidden></slot>' : '<slot name="title"></slot>'}</h3>
            ${this._bool("hide-close") ? "" : `<button class="w-btn w-btn-icon w-btn--sm w-dialog-close" data-w-dialog-close aria-label="${this._esc(this.closeLabel)}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>`}
          </div>
          <div class="w-dialog-body" role="document"><slot></slot></div>
          <div class="w-dialog-footer"><slot name="footer"></slot></div>
        </div>
      </div>`;
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this._keyHandler) {
      this._keyHandler = (event) => this._onDocumentKeydown(event);
      document.addEventListener("keydown", this._keyHandler);
    }
  }
  _events() {
    this._qAll("[data-w-dialog-close]").forEach((close) => {
      close.addEventListener("click", () => this.close("action"));
      close.querySelectorAll?.("button, a").forEach((control) => {
        control.addEventListener("click", () => this.close("action"));
      });
    });
    const overlay = this._q(".w-overlay");
    if (overlay)
      overlay.addEventListener("click", (event) => this._onOutside(event));
    const activator = this._q(".w-dialog-activator");
    if (activator) {
      activator.addEventListener("click", (event) => this._activate(event));
      activator.querySelectorAll("button, a, w-btn").forEach((control) => {
        control.addEventListener("click", (event) => this._activate(event));
      });
    }
    const wrapper = this._q(".w-dialog-wrapper");
    if (wrapper) {
      wrapper.addEventListener("click", (event) => {
        if (event.target === wrapper)
          this._onOutside(event);
      });
      wrapper.addEventListener("keydown", (event) => this._trapFocus(event));
    }
    if (this.open)
      this._afterOpenRender();
  }
  _activate(event) {
    if (this.disabled)
      return;
    this._opener = event?.target instanceof HTMLElement ? event.target : document.activeElement;
    this.show();
  }
  disconnectedCallback() {
    if (this._keyHandler)
      document.removeEventListener("keydown", this._keyHandler);
    this._releaseScrollBlock();
  }
  close(reason = "programmatic") {
    if (!this.open)
      return;
    this._silentSet("open", null);
    this._render();
    this._events();
    this._releaseScrollBlock();
    this._dispatch("toggle", { open: false, reason });
    this._dispatch("close", { open: false, reason });
    this._restoreFocus();
  }
  show() {
    if (this.disabled || this.open)
      return;
    this._opener = document.activeElement;
    this._silentSet("open", "");
    this._render();
    this._events();
    this._blockScroll();
    this._dispatch("toggle", { open: true });
  }
  _onOutside(event) {
    if (!this.open)
      return;
    if (this.persistent) {
      this._animateClick();
      return;
    }
    this.close("outside");
  }
  _onDocumentKeydown(event) {
    if (!this.open)
      return;
    if (event.key === "Escape") {
      event.preventDefault();
      if (this.persistent)
        this._animateClick();
      else
        this.close("escape");
    }
  }
  _trapFocus(event) {
    if (event.key !== "Tab")
      return;
    const focusable = this._focusable();
    if (!focusable.length)
      return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  _afterOpenRender() {
    this._blockScroll();
    requestAnimationFrame(() => {
      const target = this._focusable()[0] || this._q(".w-dialog");
      target?.focus?.({ preventScroll: true });
    });
  }
  _focusable() {
    return Array.from(this.querySelectorAll('.w-dialog button:not([disabled]), .w-dialog [href], .w-dialog input:not([disabled]), .w-dialog select:not([disabled]), .w-dialog textarea:not([disabled]), .w-dialog [tabindex]:not([tabindex="-1"])')).filter((el) => el instanceof HTMLElement && !el.hidden && el.offsetParent !== null);
  }
  _restoreFocus() {
    if (this._opener && typeof this._opener.focus === "function" && this._opener.isConnected) {
      this._opener.focus({ preventScroll: true });
    }
    this._opener = null;
  }
  _animateClick() {
    const dialog = this._q(".w-dialog");
    if (!dialog)
      return;
    dialog.classList.remove("w-dialog--shake");
    dialog.offsetWidth;
    dialog.classList.add("w-dialog--shake");
  }
  _blockScroll() {
    if (this._scrollBlocked)
      return;
    this._scrollBlocked = true;
    document.documentElement.classList.add("w-dialog-scroll-lock");
  }
  _releaseScrollBlock() {
    if (!this._scrollBlocked)
      return;
    this._scrollBlocked = false;
    document.documentElement.classList.remove("w-dialog-scroll-lock");
  }
  _dialogStyle() {
    const styles = [];
    const width = this._cssLength(this.getAttribute("width"));
    const maxWidth = this._cssLength(this.getAttribute("max-width"));
    if (width)
      styles.push("--w-dialog-width: " + width);
    if (maxWidth)
      styles.push("--w-dialog-max-width: " + maxWidth);
    return styles.length ? ` style="${styles.join("; ")}"` : "";
  }
  _cssLength(value) {
    const raw = String(value || "").trim();
    if (!raw)
      return "";
    if (/^\d+(\.\d+)?$/.test(raw))
      return raw + "px";
    if (/^\d+(\.\d+)?(px|rem|em|vh|vw|dvh|dvw|%)$/.test(raw))
      return raw;
    return "";
  }
  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}
if (!customElements.get("w-dialog")) {
  customElements.define("w-dialog", WDialog);
}

// src/components/avatar.js
class WAvatar extends WElement {
  static attrs = [
    "src",
    "image",
    "alt",
    "size",
    "initials",
    "text",
    "icon",
    "variant",
    "color",
    "badge",
    "badge-color",
    "badge-content",
    "badge-location",
    "badge-floating",
    "badge-dot",
    "status",
    "start",
    "end",
    "rounded",
    "border",
    "tile",
    "density",
    "elevation"
  ];
  static sizeAliases = {
    xs: "x-small",
    sm: "small",
    md: "default",
    lg: "large",
    xl: "x-large"
  };
  static sizes = ["x-small", "small", "default", "large", "x-large"];
  static variants = ["flat", "tonal", "outlined", "text", "plain", "elevated"];
  static colors = ["primary", "secondary", "tertiary", "success", "warning", "error", "danger", "info"];
  static badgeLocations = {
    "top-end": "top-end",
    "top end": "top-end",
    "top-right": "top-end",
    "top-start": "top-start",
    "top start": "top-start",
    "top-left": "top-start",
    "bottom-end": "bottom-end",
    "bottom end": "bottom-end",
    "bottom-right": "bottom-end",
    "bottom-start": "bottom-start",
    "bottom start": "bottom-start",
    "bottom-left": "bottom-start"
  };
  get image() {
    return this._attr("image", this._attr("src", ""));
  }
  get alt() {
    return this._attr("alt", this.text || this.icon || "Avatar");
  }
  get text() {
    return this._attr("text", this._attr("initials", ""));
  }
  get icon() {
    return this._attr("icon", "");
  }
  get size() {
    return this._attr("size", "default");
  }
  get variant() {
    return this._attr("variant", "flat");
  }
  get color() {
    return this._normalizeColor(this._attr("color", "primary"));
  }
  get badge() {
    return this.getAttribute("badge");
  }
  get badgeColor() {
    return this._normalizeColor(this._attr("badge-color", this._badgeAttrColor()));
  }
  get badgeContent() {
    return this._attr("badge-content", "");
  }
  get badgeLocation() {
    return this._attr("badge-location", "top-end");
  }
  get status() {
    return this._attr("status", "");
  }
  get start() {
    return this._bool("start");
  }
  get end() {
    return this._bool("end");
  }
  _template() {
    const sizeClass = this._sizeClass();
    const customSize = this._customSize();
    const variant = this._variant();
    const classes = [
      "w-avatar",
      sizeClass,
      "w-avatar--variant-" + variant,
      "w-avatar--color-" + this.color,
      this.start ? "w-avatar--start" : "",
      this.end ? "w-avatar--end" : "",
      this.hasAttribute("rounded") ? this._roundedClass() : "",
      this.hasAttribute("border") ? "w-avatar--border" : "",
      this.hasAttribute("tile") ? "w-avatar--tile" : "",
      this.getAttribute("density") ? "w-avatar--density-" + this.getAttribute("density") : "",
      this.getAttribute("elevation") ? "w-avatar--elevation-" + this.getAttribute("elevation") : ""
    ].filter(Boolean).join(" ");
    const style = customSize ? ` style="--w-avatar-size: ${customSize}"` : "";
    const content = this._contentTemplate();
    const avatar = `<span class="${classes}" role="img" aria-label="${this._esc(this.alt)}"${style}>${content}<span class="w-avatar-underlay" aria-hidden="true"></span></span>`;
    if (!this._hasBadge())
      return avatar;
    return `<span class="w-avatar-wrap${this._badgeFloatingClass()}">${avatar}${this._badgeTemplate()}</span>`;
  }
  _contentTemplate() {
    if (this._hasDefaultSlot())
      return "<slot></slot>";
    const preserveDefaultSlot = "<slot hidden></slot>";
    if (this.image)
      return `<img class="w-avatar-image" src="${this._esc(this.image)}" alt="${this._esc(this.alt)}">${preserveDefaultSlot}`;
    if (this.icon)
      return `<span class="w-avatar-icon" aria-hidden="true">${this._esc(this.icon)}</span>${preserveDefaultSlot}`;
    if (this.text)
      return `<span class="w-avatar-text">${this._esc(this.text)}</span>${preserveDefaultSlot}`;
    return "<slot></slot>";
  }
  _badgeTemplate() {
    const location = this._badgeLocation();
    const dot = this._bool("badge-dot") || !this.badgeContent && !this._hasSlot("badge");
    const dotClass = dot ? " w-avatar-badge--dot" : "";
    const content = this._hasSlot("badge") ? '<slot name="badge"></slot>' : this._esc(this.badgeContent);
    return `<span class="w-avatar-badge w-avatar-badge--${location} w-avatar-badge--${this.badgeColor}${dotClass}" aria-label="${this._esc(this.badgeContent || this.badgeColor + " badge")}">${content}</span>`;
  }
  _hasBadge() {
    return this.hasAttribute("badge") || this.badgeContent || this.hasAttribute("badge-color") || this.status || this._hasSlot("badge");
  }
  _badgeFloatingClass() {
    return this._bool("badge-floating") ? " w-avatar-wrap--floating" : "";
  }
  _badgeLocation() {
    return this.constructor.badgeLocations[String(this.badgeLocation || "").toLowerCase()] || "top-end";
  }
  _badgeAttrColor() {
    const badge = this.badge;
    if (badge && badge !== "" && badge !== "true")
      return badge;
    if (this.status === "online")
      return "success";
    if (this.status === "away")
      return "warning";
    if (this.status === "busy")
      return "error";
    return "primary";
  }
  _sizeClass() {
    const normalized = this._normalizedSize();
    return this.constructor.sizes.includes(normalized) ? "w-avatar--" + normalized : "";
  }
  _normalizedSize() {
    const size = String(this.size || "default").toLowerCase();
    return this.constructor.sizeAliases[size] || size;
  }
  _customSize() {
    const size = String(this.size || "").trim();
    if (!size || this.constructor.sizes.includes(this._normalizedSize()))
      return "";
    if (/^\d+(\.\d+)?$/.test(size))
      return size + "px";
    if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(size))
      return size;
    return "";
  }
  _variant() {
    return this.constructor.variants.includes(this.variant) ? this.variant : "flat";
  }
  _roundedClass() {
    const value = this.getAttribute("rounded");
    if (!value || value === "true")
      return "w-avatar--rounded";
    return "w-avatar--rounded-" + value;
  }
  _normalizeColor(value) {
    const token = String(value || "").toLowerCase();
    if (token === "danger")
      return "error";
    if (token === "info")
      return "primary";
    return this.constructor.colors.includes(token) ? token : "primary";
  }
  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
  _hasDefaultSlot() {
    const currentSlot = this.querySelector("slot:not([name])");
    if (currentSlot)
      return Array.from(currentSlot.childNodes).some((node) => this._hasMeaningfulNode(node));
    return Array.from(this.childNodes).some((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute("slot"))
        return false;
      return this._hasMeaningfulNode(node);
    });
  }
  _hasMeaningfulNode(node) {
    return node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE && node.textContent.trim();
  }
}
if (!customElements.get("w-avatar")) {
  customElements.define("w-avatar", WAvatar);
}

// src/components/tooltip.js
class WTooltip extends WElement {
  static attrs = [
    "open",
    "tooltip-id",
    "text",
    "position",
    "location",
    "color",
    "offset",
    "open-delay",
    "close-delay",
    "open-on-click",
    "open-on-hover",
    "open-on-focus",
    "interactive",
    "target",
    "content-class",
    "disabled",
    "close-on-content-click"
  ];
  constructor() {
    super();
    this.__wUid = "w-tooltip-" + Math.random().toString(36).slice(2, 9);
    this.__wCursor = null;
  }
  get open() {
    return this._bool("open");
  }
  get text() {
    return this._attr("text", "");
  }
  get tooltipId() {
    return this._attr("tooltip-id", this.id ? this.id + "-content" : this.__wUid);
  }
  get location() {
    return this._attr("location", this._attr("position", "top"));
  }
  get color() {
    return this._attr("color", "");
  }
  get offset() {
    return this._attr("offset", "0.625rem");
  }
  get openDelay() {
    return this._numberAttr("open-delay", 0);
  }
  get closeDelay() {
    return this._numberAttr("close-delay", 0);
  }
  get openOnClick() {
    return this._enabledAttr("open-on-click", false);
  }
  get openOnHover() {
    return this._enabledAttr("open-on-hover", true);
  }
  get openOnFocus() {
    return this._enabledAttr("open-on-focus", !this.openOnClick);
  }
  get interactive() {
    return this._enabledAttr("interactive", false);
  }
  get disabled() {
    return this._enabledAttr("disabled", false);
  }
  get cursorTarget() {
    return this._attr("target", "") === "cursor";
  }
  get closeOnContentClick() {
    return this._enabledAttr("close-on-content-click", false);
  }
  get contentClass() {
    return this._attr("content-class", "");
  }
  _render() {
    const children = this._takeChildren();
    const activatorChildren = children.activator.length ? children.activator : children.default;
    const hasContent = children.content.length > 0;
    this.innerHTML = this._shellTemplate(this._hasFocusableNodes(activatorChildren), hasContent);
    const activator = this._q(".w-tooltip-activator");
    const content = this._q(".w-tooltip-content");
    activatorChildren.forEach((node) => {
      this._normalizeSlotNode(node, "activator");
      activator.appendChild(node);
    });
    if (hasContent) {
      children.content.forEach((node) => {
        this._normalizeSlotNode(node, "content");
        content.appendChild(node);
      });
    }
    if (this.open && this.cursorTarget && !this.__wCursor)
      this._rememberCursor();
  }
  _shellTemplate(hasFocusableActivator, hasContent) {
    const location = this._classToken(this.location);
    const classes = [
      "w-tooltip",
      "w-tooltip--" + location,
      this.open ? "open w-tooltip--open" : "",
      this.interactive ? "w-tooltip--interactive" : "",
      this.cursorTarget ? "w-tooltip--target-cursor" : "",
      this.cursorTarget && this.__wCursor ? "w-tooltip--cursor-ready" : "",
      this.disabled ? "w-tooltip--disabled" : ""
    ].filter(Boolean).join(" ");
    const triggerAttrs = [
      'class="w-tooltip-activator"',
      `aria-describedby="${this._esc(this.tooltipId)}"`,
      this.disabled ? 'aria-disabled="true"' : "",
      hasFocusableActivator ? "" : 'tabindex="0"'
    ].filter(Boolean).join(" ");
    const contentClass = ["w-tooltip-content", this.contentClass].filter(Boolean).join(" ");
    const fallback = hasContent ? "" : `<span data-w-tooltip-generated>${this._esc(this.text)}</span>`;
    return `<span class="${this._esc(classes)}"${this._style()}>
      <span ${triggerAttrs}></span>
      <span id="${this._esc(this.tooltipId)}" class="${this._esc(contentClass)}" role="tooltip"${this.open ? "" : " hidden"}>${fallback}</span>
    </span>`;
  }
  _events() {
    const root = this._q(".w-tooltip");
    const trigger = this._q(".w-tooltip-activator");
    const content = this._q(".w-tooltip-content");
    if (!root || !trigger || this.disabled)
      return;
    if (this.openOnHover) {
      root.addEventListener("mouseenter", (event) => this._show("hover", event));
      root.addEventListener("mouseleave", () => this._hide("hover"));
      root.addEventListener("pointermove", (event) => this._rememberCursor(event));
    }
    if (this.openOnFocus) {
      root.addEventListener("focusin", (event) => this._show("focus", event));
      root.addEventListener("focusout", (event) => {
        if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget))
          return;
        this._hide("focus");
      });
    }
    if (this.openOnClick) {
      trigger.addEventListener("click", (event) => {
        this._rememberCursor(event);
        this.open ? this._hide("click") : this._show("click", event);
      });
      trigger.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ")
          return;
        event.preventDefault();
        this.open ? this._hide("keyboard") : this._show("keyboard", event);
      });
    }
    if (content && this.closeOnContentClick) {
      content.addEventListener("click", () => this._hide("content"));
    }
    if (!this.__wTooltipKeydown) {
      this.__wTooltipKeydown = (event) => {
        if (event.key === "Escape" && this.open)
          this._hide("escape");
      };
      document.addEventListener("keydown", this.__wTooltipKeydown);
    }
  }
  disconnectedCallback() {
    if (this.__wTooltipKeydown)
      document.removeEventListener("keydown", this.__wTooltipKeydown);
    this._clearTimers();
  }
  show() {
    this._show("programmatic");
  }
  close() {
    this._hide("programmatic");
  }
  _show(reason, event) {
    if (this.disabled)
      return;
    if (event)
      this._rememberCursor(event);
    this._clearTimers();
    this.__wOpenTimer = setTimeout(() => this._setOpen(true, reason), this.openDelay);
  }
  _hide(reason) {
    this._clearTimers();
    this.__wCloseTimer = setTimeout(() => this._setOpen(false, reason), this.closeDelay);
  }
  _setOpen(open, reason) {
    if (open === this.open)
      return;
    this._silentSet("open", open ? "" : null);
    this._render();
    this._events();
    this._dispatch("toggle", { open, reason });
    if (!open)
      this._dispatch("close", { open, reason });
  }
  _style() {
    const styles = [];
    if (this.offset)
      styles.push("--w-tooltip-offset: " + this._cssValue(this.offset));
    if (this.color) {
      const token = this._classToken(this.color);
      styles.push("--w-tooltip-bg: var(--w-" + token + ", " + this._esc(this.color) + ")");
      styles.push("--w-tooltip-fg: var(--w-on-" + token + ", var(--w-inverse-on-surface))");
    }
    if (this.cursorTarget && this.__wCursor) {
      styles.push("--w-tooltip-cursor-x: " + Math.round(this.__wCursor.x || 0) + "px");
      styles.push("--w-tooltip-cursor-y: " + Math.round(this.__wCursor.y || 0) + "px");
    }
    return styles.length ? ` style="${styles.join("; ")}"` : "";
  }
  _rememberCursor(event) {
    let x = typeof event?.clientX === "number" ? event.clientX : null;
    let y = typeof event?.clientY === "number" ? event.clientY : null;
    if (x === null || y === null) {
      const activator = this._q(".w-tooltip-activator");
      const rect = activator?.getBoundingClientRect?.();
      if (!rect)
        return;
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
    this.__wCursor = { x, y };
    const root = this._q(".w-tooltip");
    if (!root || !this.cursorTarget)
      return;
    root.classList.add("w-tooltip--cursor-ready");
    root.style.setProperty("--w-tooltip-cursor-x", Math.round(x) + "px");
    root.style.setProperty("--w-tooltip-cursor-y", Math.round(y) + "px");
  }
  _clearTimers() {
    clearTimeout(this.__wOpenTimer);
    clearTimeout(this.__wCloseTimer);
  }
  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
  _enabledAttr(name, fallback) {
    if (!this.hasAttribute(name))
      return fallback;
    const value = String(this.getAttribute(name) || "").trim().toLowerCase();
    return !["false", "0", "off", "no"].includes(value);
  }
  _numberAttr(name, fallback) {
    const value = Number(this.getAttribute(name));
    return Number.isFinite(value) && value >= 0 ? value : fallback;
  }
  _cssValue(value) {
    const raw = String(value || "").trim();
    if (/^-?\d+(\.\d+)?$/.test(raw))
      return raw + "px";
    return this._esc(raw);
  }
  _classToken(value) {
    return String(value || "").trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "top";
  }
  _takeChildren() {
    const groups = { activator: [], content: [], default: [] };
    if (this._rendered) {
      const activator = this._q(".w-tooltip-activator");
      const content = this._q(".w-tooltip-content");
      if (activator) {
        Array.from(activator.childNodes).forEach((node) => {
          const slot = this._nodeSlot(node);
          if (slot === "activator")
            groups.activator.push(node);
          else
            groups.default.push(node);
        });
      }
      if (content) {
        Array.from(content.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute("data-w-tooltip-generated"))
            return;
          groups.content.push(node);
        });
      }
      return groups;
    }
    Array.from(this.childNodes).forEach((node) => {
      const slot = this._nodeSlot(node);
      if (slot === "activator")
        groups.activator.push(node);
      else if (slot === "content")
        groups.content.push(node);
      else
        groups.default.push(node);
    });
    return groups;
  }
  _nodeSlot(node) {
    if (node.nodeType !== Node.ELEMENT_NODE)
      return null;
    return node.getAttribute("data-w-slot") || node.getAttribute("slot");
  }
  _normalizeSlotNode(node, slot) {
    if (node.nodeType !== Node.ELEMENT_NODE)
      return;
    if (node.getAttribute("slot") === slot) {
      node.setAttribute("data-w-slot", slot);
      node.removeAttribute("slot");
    }
  }
  _hasFocusableNodes(nodes) {
    return nodes.some((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE)
        return false;
      if (node.matches('button, a[href], input, select, textarea, w-btn, [tabindex], [slot="activator"]'))
        return true;
      return !!node.querySelector("button, a[href], input, select, textarea, w-btn, [tabindex]");
    });
  }
}
if (!customElements.get("w-tooltip"))
  customElements.define("w-tooltip", WTooltip);

// src/components/command.js
class WCommand extends WElement {
  static attrs = ["placeholder", "label", "empty", "items", "hotkey", "open", "filter-keys"];
  get placeholder() {
    return this._attr("placeholder", "Type a command or search...");
  }
  get label() {
    return this._attr("label", "Command menu");
  }
  get empty() {
    return this._attr("empty", "No results found.");
  }
  get _overlay() {
    return this.hasAttribute("hotkey") || this.hasAttribute("open");
  }
  _items() {
    const raw = this.getAttribute("items");
    if (!raw)
      return null;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (_) {
      return null;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.hasAttribute("hotkey") && !this._hotkeyHandler) {
      this._hotkeyHandler = (event) => {
        if (this._matchHotkey(event)) {
          event.preventDefault();
          this.toggle();
        }
      };
      document.addEventListener("keydown", this._hotkeyHandler);
    }
  }
  disconnectedCallback() {
    if (this._hotkeyHandler) {
      document.removeEventListener("keydown", this._hotkeyHandler);
      this._hotkeyHandler = null;
    }
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "open") {
      if (this._rendered)
        this._applyOpen();
      return;
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }
  _template() {
    const panel = this._panel();
    if (!this._overlay)
      return panel;
    const openClass = this.hasAttribute("open") ? " open" : "";
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
    if (items && items.length)
      return items.map((item) => this._renderItem(item)).join("");
    return "<slot></slot>";
  }
  _renderItem(item) {
    if (!item || typeof item !== "object")
      return "";
    if (item.type === "divider")
      return '<div class="w-command-divider" role="separator"></div>';
    if (item.type === "subheader")
      return `<div class="w-command-subheader">${this._esc(item.title || item.text || "")}</div>`;
    const title = item.title != null ? item.title : item.text != null ? item.text : "";
    const icon = item.icon || item["prepend-icon"] || item.prependIcon;
    const shortcut = item.shortcut || item.hotkey;
    const attrs = [];
    if (item.value != null)
      attrs.push(`value="${this._esc(item.value)}"`);
    if (item.subtitle)
      attrs.push(`subtitle="${this._esc(item.subtitle)}"`);
    if (icon)
      attrs.push(`icon="${this._esc(icon)}"`);
    if (shortcut)
      attrs.push(`shortcut="${this._esc(shortcut)}"`);
    if (item.disabled)
      attrs.push("disabled");
    return `<w-command-item ${attrs.join(" ")}>${this._esc(title)}</w-command-item>`;
  }
  _events() {
    const input = this._q(".w-command-input");
    const list = this._q(".w-command-list");
    const overlay = this._q(".w-command-overlay");
    if (!input || !list)
      return;
    input.addEventListener("input", (event) => {
      event.stopPropagation();
      this._filter();
      this._emit("input", { value: input.value });
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        this._move(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        this._move(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        this._activate(this._visibleItems()[0] || null);
      } else if (event.key === "End") {
        event.preventDefault();
        const v = this._visibleItems();
        this._activate(v[v.length - 1] || null);
      } else if (event.key === "Enter") {
        event.preventDefault();
        this._selectItem(this._activeEl);
      } else if (event.key === "Escape" && overlay) {
        event.preventDefault();
        this.hide();
      }
    });
    list.addEventListener("click", (event) => {
      const item = event.target.closest("w-command-item");
      if (!item || item.hasAttribute("disabled"))
        return;
      this._selectItem(item);
    });
    list.addEventListener("pointermove", (event) => {
      const item = event.target.closest("w-command-item");
      if (item && !item.hidden && !item.hasAttribute("disabled"))
        this._activate(item);
    });
    if (overlay)
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay)
          this.hide();
      });
    this._filter();
    requestAnimationFrame(() => this._filter());
  }
  _filter() {
    const input = this._q(".w-command-input");
    const empty = this._q(".w-command-empty");
    if (!input)
      return;
    const query = input.value.trim().toLowerCase();
    const keys = (this.getAttribute("filter-keys") || "").split(",").map((k) => k.trim()).filter(Boolean);
    let visible = 0;
    this.querySelectorAll("w-command-item").forEach((item) => {
      const match = !query || this._haystack(item, keys).includes(query);
      item.hidden = !match;
      if (match)
        visible += 1;
    });
    if (empty)
      empty.hidden = visible > 0;
    this._activate(this._visibleItems()[0] || null);
  }
  _haystack(item, keys) {
    if (keys.length) {
      return keys.map((key) => {
        if (key === "title")
          return item.querySelector(".w-command-item-title")?.textContent || "";
        if (key === "value")
          return item.getAttribute("value") || "";
        return item.getAttribute(key) || "";
      }).join(" ").toLowerCase();
    }
    return ((item.getAttribute("value") || "") + " " + (item.textContent || "")).toLowerCase();
  }
  _visibleItems() {
    return Array.from(this.querySelectorAll("w-command-item")).filter((item) => !item.hidden && !item.hasAttribute("disabled"));
  }
  _activate(itemEl) {
    this._activeEl = itemEl || null;
    const input = this._q(".w-command-input");
    this.querySelectorAll("w-command-item").forEach((item) => {
      item.querySelector(".w-command-item")?.classList.toggle("active", item === itemEl);
    });
    if (input) {
      const btn = itemEl && itemEl.querySelector(".w-command-item");
      if (btn) {
        if (!btn.id)
          btn.id = "hecmd-" + Math.random().toString(36).slice(2, 9);
        input.setAttribute("aria-activedescendant", btn.id);
      } else {
        input.removeAttribute("aria-activedescendant");
      }
    }
    if (itemEl)
      itemEl.scrollIntoView({ block: "nearest" });
  }
  _move(delta) {
    const items = this._visibleItems();
    if (!items.length)
      return this._activate(null);
    let index = items.indexOf(this._activeEl);
    index = index < 0 ? delta > 0 ? 0 : items.length - 1 : (index + delta + items.length) % items.length;
    this._activate(items[index]);
  }
  _selectItem(itemEl) {
    if (!itemEl || itemEl.hasAttribute("disabled"))
      return;
    const value = itemEl.getAttribute("value") || itemEl.querySelector(".w-command-item-title")?.textContent.trim() || itemEl.textContent.trim();
    this._emit("change", { value });
    if (this._q(".w-command-overlay"))
      this.hide();
  }
  show() {
    this.setAttribute("open", "");
  }
  hide() {
    this.removeAttribute("open");
  }
  toggle() {
    this.hasAttribute("open") ? this.hide() : this.show();
  }
  _applyOpen() {
    const overlay = this._q(".w-command-overlay");
    if (!overlay)
      return;
    const open = this.hasAttribute("open");
    overlay.classList.toggle("open", open);
    const input = this._q(".w-command-input");
    if (open) {
      this._lastFocus = document.activeElement;
      if (input) {
        input.value = "";
        this._filter();
        input.focus();
      }
    } else if (this._lastFocus && typeof this._lastFocus.focus === "function") {
      this._lastFocus.focus();
    }
  }
  _matchHotkey(event) {
    const spec = this.getAttribute("hotkey");
    if (!spec)
      return false;
    const parts = spec.toLowerCase().split("+").map((p) => p.trim()).filter(Boolean);
    const key = parts[parts.length - 1];
    const mods = parts.slice(0, -1);
    const mod = event.metaKey || event.ctrlKey;
    if (mods.includes("mod") && !mod)
      return false;
    if (mods.includes("ctrl") && !event.ctrlKey)
      return false;
    if ((mods.includes("meta") || mods.includes("cmd")) && !event.metaKey)
      return false;
    if (mods.includes("shift") && !event.shiftKey)
      return false;
    if (mods.includes("alt") && !event.altKey)
      return false;
    return event.key.toLowerCase() === key;
  }
}
if (!customElements.get("w-command")) {
  customElements.define("w-command", WCommand);
}

// src/components/command-item.js
class WCommandItem extends WElement {
  static attrs = ["value", "subtitle", "icon", "prepend-icon", "shortcut", "disabled"];
  get value() {
    return this._attr("value", "");
  }
  get subtitle() {
    return this._attr("subtitle", "");
  }
  get icon() {
    return this._attr("icon", "") || this._attr("prepend-icon", "");
  }
  get shortcut() {
    return this._attr("shortcut", "");
  }
  get disabled() {
    return this._bool("disabled");
  }
  _template() {
    const icon = this.icon ? `<span class="w-command-item-icon" aria-hidden="true">${this._esc(this.icon)}</span>` : "";
    const subtitle = this.subtitle ? `<span class="w-command-item-subtitle">${this._esc(this.subtitle)}</span>` : "";
    const shortcut = this.shortcut ? `<kbd class="w-kbd">${this._esc(this.shortcut)}</kbd>` : "";
    const dis = this.disabled ? ' disabled aria-disabled="true"' : "";
    return `<button class="w-command-item" role="option" type="button" value="${this._esc(this.value)}"${dis}>
      ${icon}
      <span class="w-command-item-content">
        <span class="w-command-item-title"><slot></slot></span>
        ${subtitle}
      </span>
      ${shortcut}
    </button>`;
  }
}
if (!customElements.get("w-command-item")) {
  customElements.define("w-command-item", WCommandItem);
}

// src/components/collapsible.js
class WCollapsible extends WElement {
  static attrs = ["open", "header", "disabled"];
  get open() {
    return this._bool("open");
  }
  get header() {
    return this._attr("header", "Details");
  }
  get disabled() {
    return this._bool("disabled");
  }
  _template() {
    return `<div class="w-collapsible${this.open ? " open" : ""}">
      <button class="w-collapsible-trigger" type="button" aria-expanded="${this.open}"${this.disabled ? " disabled" : ""}>
        <span>${this._esc(this.header)}</span>
        <svg class="w-collapsible-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="w-collapsible-content"${this.open ? "" : " hidden"}><slot></slot></div>
    </div>`;
  }
  _events() {
    const trigger = this._q(".w-collapsible-trigger");
    if (!trigger || this.disabled)
      return;
    trigger.addEventListener("click", () => {
      const open = !this.open;
      this._silentSet("open", open ? "" : null);
      this._render();
      this._events();
      this._emit("toggle", { open });
    });
  }
}
if (!customElements.get("w-collapsible")) {
  customElements.define("w-collapsible", WCollapsible);
}

// src/components/dropdown-menu.js
class WDropdownMenu extends WElement {
  static attrs = [
    "open",
    "label",
    "side",
    "location",
    "disabled",
    "inline",
    "persistent",
    "close-on-content-click",
    "open-delay",
    "close-delay",
    "submenu"
  ];
  get open() {
    return this._bool("open");
  }
  get label() {
    return this._attr("label", "Menu");
  }
  get side() {
    return this._attr("side", this._attr("location", this.submenu ? "end" : "bottom-start"));
  }
  get disabled() {
    return this._bool("disabled");
  }
  get inline() {
    return this._bool("inline");
  }
  get persistent() {
    return this._bool("persistent");
  }
  get closeOnContentClick() {
    return this._attr("close-on-content-click", "true") !== "false";
  }
  get openDelay() {
    return this._numberAttr("open-delay", 0);
  }
  get closeDelay() {
    return this._numberAttr("close-delay", 0);
  }
  get submenu() {
    return this._bool("submenu");
  }
  disconnectedCallback() {
    this._removeGlobalListeners();
    this._clearTimers();
  }
  _template() {
    const hasTrigger = !!this.querySelector('[slot="trigger"]');
    const trigger = hasTrigger ? `<span class="w-dropdown-menu-trigger" role="button" tabindex="${this.disabled ? "-1" : "0"}" aria-haspopup="menu" aria-expanded="${this.open}"><slot name="trigger"></slot></span>` : `<button class="w-btn w-btn-outlined w-dropdown-menu-trigger" type="button" aria-haspopup="menu" aria-expanded="${this.open}"${this.disabled ? " disabled" : ""}>${this._esc(this.label)}</button>`;
    const classes = [
      "w-dropdown-menu",
      `w-dropdown-menu--${this.side}`,
      this.open ? "open" : "",
      this.inline ? "w-dropdown-menu--inline" : "",
      this.submenu ? "w-dropdown-menu--submenu" : ""
    ].filter(Boolean).map((name) => this._esc(name)).join(" ");
    return `<span class="${classes}">
      ${trigger}
      <span class="w-menu-content w-dropdown-menu-content" role="menu"><slot></slot></span>
    </span>`;
  }
  _events() {
    const trigger = this._q(".w-dropdown-menu-trigger");
    const content = this._q(".w-dropdown-menu-content");
    if (!trigger || !content || this.disabled)
      return;
    const toggle = () => this._scheduleOpen(!this.open, this.open ? this.closeDelay : this.openDelay);
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      toggle();
    });
    trigger.addEventListener("mouseenter", () => {
      if (this.openDelay > 0 || this.submenu)
        this._scheduleOpen(true, this.openDelay);
    });
    this.addEventListener("mouseleave", () => {
      if (this.closeDelay > 0 || this.submenu)
        this._scheduleOpen(false, this.closeDelay);
    });
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        this._setOpen(true);
        this._focusItem(event.key === "ArrowUp" ? "last" : "first");
        return;
      }
      if (this.submenu && event.key === "ArrowRight") {
        event.preventDefault();
        this._setOpen(true);
        this._focusItem("first");
        return;
      }
      if (event.key !== "Enter" && event.key !== " ")
        return;
      event.preventDefault();
      toggle();
    });
    content.addEventListener("keydown", (event) => this._onContentKeydown(event));
    content.addEventListener("click", (event) => {
      const item = event.target instanceof Element ? event.target.closest('button, a, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]') : null;
      if (item && this.closeOnContentClick)
        this._setOpen(false);
    });
    this._addGlobalListeners();
  }
  _setOpen(open) {
    if (this.disabled || open === this.open)
      return;
    this._silentSet("open", open ? "" : null);
    this._render();
    this._events();
    this._emit("toggle", { open });
    if (!open)
      this._emit("close", { open });
  }
  _onContentKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      this._setOpen(false);
      this._q(".w-dropdown-menu-trigger")?.focus();
      return;
    }
    if (event.key === "Tab") {
      this._setOpen(false);
      return;
    }
    if (this.submenu && event.key === "ArrowLeft") {
      event.preventDefault();
      this._setOpen(false);
      this._q(".w-dropdown-menu-trigger")?.focus();
      return;
    }
    const direction = event.key === "ArrowDown" ? "next" : event.key === "ArrowUp" ? "prev" : event.key === "Home" ? "first" : event.key === "End" ? "last" : "";
    if (!direction)
      return;
    event.preventDefault();
    this._focusItem(direction);
  }
  _focusItem(direction) {
    const items = this._items();
    if (!items.length)
      return;
    const active = document.activeElement;
    let index = items.indexOf(active);
    if (direction === "first")
      index = 0;
    else if (direction === "last")
      index = items.length - 1;
    else
      index = index < 0 ? 0 : (index + (direction === "next" ? 1 : -1) + items.length) % items.length;
    items[index]?.focus();
  }
  _items() {
    const content = this._q(".w-dropdown-menu-content");
    if (!content)
      return [];
    return Array.from(content.querySelectorAll('button, a, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')).filter((item) => {
      if (!(item instanceof HTMLElement))
        return false;
      if (item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true")
        return false;
      return item.offsetParent !== null || item.getClientRects().length > 0;
    });
  }
  _addGlobalListeners() {
    this._removeGlobalListeners();
    this.__wDocumentPointerdown = (event) => {
      if (!this.open || this.persistent)
        return;
      if (this.contains(event.target))
        return;
      this._setOpen(false);
    };
    this.__wDocumentKeydown = (event) => {
      if (event.key === "Escape" && this.open && !this.persistent)
        this._setOpen(false);
    };
    document.addEventListener("pointerdown", this.__wDocumentPointerdown);
    document.addEventListener("keydown", this.__wDocumentKeydown);
  }
  _removeGlobalListeners() {
    if (this.__wDocumentPointerdown)
      document.removeEventListener("pointerdown", this.__wDocumentPointerdown);
    if (this.__wDocumentKeydown)
      document.removeEventListener("keydown", this.__wDocumentKeydown);
    this.__wDocumentPointerdown = null;
    this.__wDocumentKeydown = null;
  }
  _scheduleOpen(open, delay) {
    this._clearTimers();
    if (!delay) {
      this._setOpen(open);
      return;
    }
    this.__wTimer = setTimeout(() => this._setOpen(open), delay);
  }
  _clearTimers() {
    if (this.__wTimer)
      clearTimeout(this.__wTimer);
    this.__wTimer = null;
  }
  _numberAttr(name, fallback) {
    const value = Number(this._attr(name, fallback));
    return Number.isFinite(value) ? Math.max(0, value) : fallback;
  }
}
if (!customElements.get("w-dropdown-menu")) {
  customElements.define("w-dropdown-menu", WDropdownMenu);
}

// src/components/context-menu.js
class WContextMenu extends WElement {
  static attrs = ["open", "label"];
  get open() {
    return this._bool("open");
  }
  get label() {
    return this._attr("label", "Context menu");
  }
  disconnectedCallback() {
    if (this._wDocumentClick)
      document.removeEventListener("click", this._wDocumentClick);
    if (this._wDocumentKeydown)
      document.removeEventListener("keydown", this._wDocumentKeydown);
  }
  _template() {
    const x = Number.isFinite(this._menuX) ? this._menuX : 0;
    const y = Number.isFinite(this._menuY) ? this._menuY : 0;
    return `<div class="w-context-menu">
      <div class="w-context-menu-target"><slot></slot></div>
      <div class="w-menu-content w-context-menu-content${this.open ? " open" : ""}" role="menu" aria-label="${this._esc(this.label)}" style="--w-menu-x: ${x}px; --w-menu-y: ${y}px;">
        <slot name="content"></slot>
      </div>
    </div>`;
  }
  _events() {
    const target = this._q(".w-context-menu-target");
    if (!target)
      return;
    target.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this._setOpen(true, { x: event.clientX, y: event.clientY });
    });
    if (this._wDocumentClick)
      document.removeEventListener("click", this._wDocumentClick);
    this._wDocumentClick = (event) => {
      if (!this.contains(event.target) && this.open)
        this._setOpen(false);
    };
    document.addEventListener("click", this._wDocumentClick);
    if (this._wDocumentKeydown)
      document.removeEventListener("keydown", this._wDocumentKeydown);
    this._wDocumentKeydown = (event) => {
      if (event.key === "Escape" && this.open)
        this._setOpen(false);
    };
    document.addEventListener("keydown", this._wDocumentKeydown);
    this._q(".w-context-menu-content")?.addEventListener("click", (event) => {
      const item = event.target.closest('button, a, [role="menuitem"]');
      if (item)
        this._setOpen(false);
    });
  }
  _setOpen(open, position) {
    if (position) {
      this._menuX = Math.max(0, position.x);
      this._menuY = Math.max(0, position.y);
    }
    this._silentSet("open", open ? "" : null);
    this._render();
    this._events();
    if (open)
      this._clampToViewport();
    this._emit(open ? "toggle" : "close", {});
  }
  _clampToViewport() {
    const menu = this._q(".w-context-menu-content");
    if (!menu)
      return;
    const rect = menu.getBoundingClientRect();
    const margin = 8;
    const x = Math.max(margin, Math.min(this._menuX, window.innerWidth - rect.width - margin));
    const y = Math.max(margin, Math.min(this._menuY, window.innerHeight - rect.height - margin));
    menu.style.setProperty("--w-menu-x", `${x}px`);
    menu.style.setProperty("--w-menu-y", `${y}px`);
  }
}
if (!customElements.get("w-context-menu")) {
  customElements.define("w-context-menu", WContextMenu);
}

// src/components/menubar.js
class WMenubar extends WElement {
  _template() {
    return `<nav class="w-menubar" role="menubar"><slot></slot></nav>`;
  }
}
if (!customElements.get("w-menubar")) {
  customElements.define("w-menubar", WMenubar);
}

// src/components/menubar-item.js
class WMenubarItem extends WElement {
  static attrs = ["label", "open", "inline"];
  get label() {
    return this._attr("label", "Menu");
  }
  get open() {
    return this._bool("open");
  }
  get inline() {
    return this._bool("inline");
  }
  _template() {
    const classes = [
      "w-menubar-item",
      this.open ? "open" : "",
      this.inline ? "w-menubar-item--inline" : ""
    ].filter(Boolean).join(" ");
    return `<span class="${classes}">
      <button class="w-menubar-trigger" role="menuitem" type="button" aria-haspopup="menu" aria-expanded="${this.open}">${this._esc(this.label)}</button>
      <span class="w-menu-content w-menubar-content" role="menu"><slot></slot></span>
    </span>`;
  }
  _events() {
    if (!this.__wMenubarHostKeydown) {
      this.__wMenubarHostKeydown = (event) => {
        if (!event.target?.closest?.(".w-menubar-trigger"))
          return;
        if (!this.contains(event.target))
          return;
        this._onKeydown(event);
      };
      this.addEventListener("keydown", this.__wMenubarHostKeydown);
    }
    const trigger = this._q(".w-menubar-trigger");
    if (!trigger)
      return;
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      this._setOpen(!this.open);
      this._q(".w-menubar-trigger")?.focus();
    });
    trigger.addEventListener("mouseenter", () => {
      const menubar = this.closest("w-menubar");
      if (menubar?.__wMenubarKeyboardNavUntil && Date.now() < menubar.__wMenubarKeyboardNavUntil)
        return;
      if (this.parentElement?.querySelector("w-menubar-item[open]"))
        this._setOpen(true);
    });
    trigger.addEventListener("keydown", (event) => this._onKeydown(event));
    this._qAll('[role="menuitem"]').forEach((item) => {
      if (item === trigger)
        return;
      item.addEventListener("keydown", (event) => {
        if (event.key !== "Escape")
          return;
        event.preventDefault();
        this._setOpen(false);
        trigger.focus();
      });
    });
    if (!this.__wMenubarDocumentClick) {
      this.__wMenubarDocumentClick = (event) => {
        if (this.open && !this.contains(event.target))
          this._setOpen(false);
      };
      document.addEventListener("click", this.__wMenubarDocumentClick);
    }
  }
  _onKeydown(event) {
    if (event.__wMenubarHandled)
      return;
    event.__wMenubarHandled = true;
    const trigger = this._q(".w-menubar-trigger");
    if (!trigger)
      return;
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._setOpen(true);
      this._q('.w-menubar-content [role="menuitem"]')?.focus();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      this._setOpen(false);
      trigger.focus();
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const items = this._items();
      const index = items.indexOf(this);
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = items[(index + delta + items.length) % items.length];
      if (!next)
        return;
      const menubar = this.closest("w-menubar");
      if (menubar)
        menubar.__wMenubarKeyboardNavUntil = Date.now() + 400;
      if (typeof next._setOpen === "function")
        next._setOpen(true);
      else {
        this._setOpen(false, false);
        next.setAttribute("open", "");
      }
      next.querySelector(".w-menubar-trigger")?.focus();
    }
  }
  _setOpen(open, emit = true) {
    if (open === this.open)
      return;
    if (open)
      this._closeSiblings();
    this._silentSet("open", open ? "" : null);
    this._render();
    this._events();
    if (emit)
      this._emit(open ? "toggle" : "close", {});
  }
  _closeSiblings() {
    this._items().filter((item) => item.hasAttribute("open")).forEach((item) => {
      if (item === this)
        return;
      if (typeof item._setOpen === "function")
        item._setOpen(false, false);
      else
        item.removeAttribute("open");
    });
  }
  _items() {
    const menubar = this.closest("w-menubar");
    return Array.from((menubar || this.parentElement)?.querySelectorAll("w-menubar-item") || []);
  }
}
if (!customElements.get("w-menubar-item")) {
  customElements.define("w-menubar-item", WMenubarItem);
}

// src/components/navigation-menu.js
class WNavigationMenu extends WElement {
  static attrs = ["label", "value"];
  get label() {
    return this._attr("label", "Primary");
  }
  get value() {
    return this._attr("value", "");
  }
  _template() {
    return `<nav class="w-navigation-menu" aria-label="${this._esc(this.label)}"><slot></slot></nav>`;
  }
  _events() {
    this._syncItems();
    this._items().forEach((item) => {
      if (item.__wNavigationMenu === this)
        return;
      item.__wNavigationMenu = this;
      item.addEventListener("click", (event) => {
        if (item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true")
          return;
        const value = this._itemValue(item);
        if (!value)
          return;
        this._setSelected(value);
        const href = item.getAttribute("href");
        if (!href || href === "#")
          event.preventDefault();
      });
    });
  }
  _items() {
    const nav = this._q(".w-navigation-menu") || this;
    const slot = nav.querySelector(":scope > slot");
    const children = slot ? Array.from(slot.children) : Array.from(nav.children);
    return children.filter((item) => item.nodeType === Node.ELEMENT_NODE);
  }
  _itemValue(item) {
    return item.getAttribute("value") || item.getAttribute("data-value") || item.getAttribute("href") || item.getAttribute("label") || item.textContent.trim();
  }
  _setSelected(value) {
    this._silentSet("value", value);
    this._syncItems();
    this._emit("change", { value });
  }
  _syncItems() {
    let selected = this.value;
    if (!selected) {
      const activeItem = this._items().find((item) => item.hasAttribute("active") || item.classList.contains("active"));
      selected = activeItem ? this._itemValue(activeItem) : "";
      if (selected) {
        this._silentSet("value", selected);
      }
    }
    this._items().forEach((item) => {
      const active = !!selected && this._itemValue(item) === selected;
      item.classList.toggle("active", active);
      item.toggleAttribute("active", active);
      if (active)
        item.setAttribute("aria-current", "page");
      else
        item.removeAttribute("aria-current");
    });
  }
}
if (!customElements.get("w-navigation-menu")) {
  customElements.define("w-navigation-menu", WNavigationMenu);
}

// src/components/navigation-menu-item.js
class WNavigationMenuItem extends WElement {
  static attrs = ["href", "label", "value", "active", "disabled"];
  get href() {
    return this._attr("href", "");
  }
  get label() {
    return this._attr("label", "");
  }
  get value() {
    return this._attr("value", this.href || this.label);
  }
  get active() {
    return this._bool("active");
  }
  get disabled() {
    return this._bool("disabled");
  }
  _template() {
    const disabled = this.disabled ? ' aria-disabled="true"' : "";
    const current = this.active ? ' aria-current="page"' : "";
    const value = this.value ? ` data-value="${this._esc(this.value)}"` : "";
    const attrs = `class="w-navigation-menu-item${this.active ? " active" : ""}"${current}${disabled}${value}`;
    const content = this.label ? this._esc(this.label) : "<slot></slot>";
    return this.href && !this.disabled ? `<a ${attrs} href="${this._esc(this.href)}">${content}</a>` : `<button ${attrs} type="button"${this.disabled ? " disabled" : ""}>${content}</button>`;
  }
}
if (!customElements.get("w-navigation-menu-item")) {
  customElements.define("w-navigation-menu-item", WNavigationMenuItem);
}

// src/components/popover.js
class WPopover extends WElement {
  static attrs = ["open", "label", "side", "inline"];
  get open() {
    return this._bool("open");
  }
  get label() {
    return this._attr("label", "Open");
  }
  get side() {
    return this._attr("side", "bottom-start");
  }
  get inline() {
    return this._bool("inline");
  }
  _template() {
    const hasTrigger = !!this.querySelector('[slot="trigger"]');
    const trigger = hasTrigger ? `<span class="w-popover-trigger" role="button" tabindex="0" aria-expanded="${this.open}"><slot name="trigger"></slot></span>` : `<button class="w-btn w-btn-outlined w-popover-trigger" type="button" aria-expanded="${this.open}">${this._esc(this.label)}</button>`;
    const classes = [
      "w-popover",
      `w-popover--${this.side}`,
      this.open ? "open" : "",
      this.inline ? "w-popover--inline" : ""
    ].filter(Boolean).map((name) => this._esc(name)).join(" ");
    return `<span class="${classes}">
      ${trigger}
      <span class="w-popover-content" role="dialog"><slot></slot></span>
    </span>`;
  }
  _events() {
    const trigger = this._q(".w-popover-trigger");
    if (!trigger)
      return;
    const toggle = () => this._setOpen(!this.open);
    trigger.addEventListener("click", toggle);
    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ")
        return;
      event.preventDefault();
      toggle();
    });
  }
  _setOpen(open) {
    this._silentSet("open", open ? "" : null);
    this._render();
    this._events();
    this._emit(open ? "toggle" : "close", {});
  }
}
if (!customElements.get("w-popover")) {
  customElements.define("w-popover", WPopover);
}

// src/components/hover-card.js
class WHoverCard extends WElement {
  static attrs = ["open", "side", "inline"];
  get open() {
    return this._bool("open");
  }
  get side() {
    return this._attr("side", "top");
  }
  get inline() {
    return this._bool("inline");
  }
  _template() {
    const classes = [
      "w-hover-card",
      `w-hover-card--${this.side}`,
      this.open ? "open" : "",
      this.inline ? "w-hover-card--inline" : ""
    ].filter(Boolean).map((name) => this._esc(name)).join(" ");
    return `<span class="${classes}">
      <span class="w-hover-card-trigger" tabindex="0"><slot></slot></span>
      <span class="w-hover-card-content" role="tooltip"><slot name="content"></slot></span>
    </span>`;
  }
  _events() {
    const trigger = this._q(".w-hover-card-trigger");
    if (!trigger)
      return;
    trigger.addEventListener("mouseenter", () => this._setOpen(true));
    trigger.addEventListener("mouseleave", () => this._setOpen(false));
    trigger.addEventListener("focusin", () => this._setOpen(true));
    trigger.addEventListener("focusout", () => this._setOpen(false));
    if (!this.__wHoverCardFocusEvents) {
      this.__wHoverCardFocusEvents = true;
      this.addEventListener("focusin", () => this._setOpen(true));
      this.addEventListener("focusout", () => this._setOpen(false));
    }
  }
  _setOpen(open) {
    if (open === this.open)
      return;
    this._silentSet("open", open ? "" : null);
    this._render();
    this._events();
  }
}
if (!customElements.get("w-hover-card")) {
  customElements.define("w-hover-card", WHoverCard);
}

// src/components/sonner.js
class WSonner extends WElement {
  static attrs = ["position"];
  get position() {
    return this._attr("position", "bottom-center");
  }
  _template() {
    return `<div class="w-sonner w-sonner--${this._esc(this.position)}" role="status" aria-live="polite"><slot></slot></div>`;
  }
}
if (!customElements.get("w-sonner")) {
  customElements.define("w-sonner", WSonner);
}

// src/components/sidebar.js
class WSidebar extends WElement {
  static attrs = ["side", "rail", "sticky", "label"];
  get side() {
    return this._attr("side", "left");
  }
  get rail() {
    return this._bool("rail");
  }
  get sticky() {
    return this._bool("sticky");
  }
  get label() {
    return this._attr("label", "Sidebar");
  }
  _template() {
    const classes = [
      "w-sidebar-component",
      this.rail ? "w-sidebar--rail" : "",
      this.sticky ? "w-sidebar--sticky" : "",
      this.side === "right" ? "w-sidebar--right" : ""
    ].filter(Boolean).join(" ");
    return `<aside class="${classes}" aria-label="${this._esc(this.label)}"><slot></slot></aside>`;
  }
}
if (!customElements.get("w-sidebar")) {
  customElements.define("w-sidebar", WSidebar);
}

// src/components/app.js
class WApp extends WElement {
  static attrs = ["theme", "full-height"];
  get theme() {
    return this._attr("theme", "");
  }
  get fullHeight() {
    const v = this.getAttribute("full-height");
    return v == null || !["false", "0", "off"].includes(v.toLowerCase());
  }
  _template() {
    const cls = ["w-app", this.fullHeight ? "w-app--full-height" : ""].filter(Boolean).join(" ");
    const themeAttr = this.theme ? ` data-w-theme="${this._esc(this.theme)}"` : "";
    return `<div class="${cls}"${themeAttr}><slot></slot></div>`;
  }
}
if (!customElements.get("w-app"))
  customElements.define("w-app", WApp);

// src/components/app-bar.js
class WAppBar extends WElement {
  static attrs = [
    "title",
    "sticky",
    "color",
    "bg-color",
    "density",
    "flat",
    "extended",
    "extension-height",
    "elevation",
    "image",
    "collapse",
    "rounded",
    "border",
    "height",
    "location",
    "scroll-behavior",
    "scroll-threshold"
  ];
  get title() {
    return this._attr("title", "");
  }
  get sticky() {
    return this._bool("sticky");
  }
  get color() {
    return this._attr("color", "");
  }
  get bgColor() {
    return this._attr("bg-color", "");
  }
  get density() {
    return this._attr("density", "");
  }
  get flat() {
    return this._bool("flat");
  }
  get extended() {
    return this._bool("extended");
  }
  get extensionHeight() {
    return this._attr("extension-height", "48");
  }
  get elevation() {
    return this._attr("elevation", "");
  }
  get image() {
    return this._attr("image", "");
  }
  get collapse() {
    return this._bool("collapse");
  }
  get rounded() {
    return this._attr("rounded", "");
  }
  get border() {
    return this._bool("border");
  }
  get height() {
    return this._attr("height", "");
  }
  get location() {
    return this._attr("location", "top");
  }
  get scrollBehavior() {
    return this._attr("scroll-behavior", "");
  }
  get scrollThreshold() {
    return this._attr("scroll-threshold", "4");
  }
  _template() {
    const classes = ["w-app-bar"];
    if (this.sticky)
      classes.push("w-app-bar--sticky");
    if (this.density)
      classes.push("w-app-bar--" + this.density);
    if (this.flat)
      classes.push("w-app-bar--flat");
    if (this.collapse)
      classes.push("w-app-bar--collapse");
    if (this.border)
      classes.push("w-app-bar--border");
    if (this.location === "bottom")
      classes.push("w-app-bar--bottom");
    if (this.image)
      classes.push("w-app-bar--image");
    if (!this.flat && this.elevation) {
      classes.push("elevation-" + this.elevation);
    }
    if (this.rounded) {
      classes.push(this.rounded === "true" || this.rounded === "" ? "rounded" : "rounded-" + this.rounded);
    }
    const styles = [];
    if (this.color)
      styles.push("--w-app-bar-color: var(--w-" + this.color + ");");
    if (this.bgColor)
      styles.push("--w-app-bar-bg: var(--w-" + this.bgColor + ");");
    if (this.height)
      styles.push("--w-app-bar-height: " + (isNaN(this.height) ? this.height : this.height + "px") + ";");
    if (this.image)
      styles.push("--w-app-bar-image: url(" + this._esc(this.image) + ");");
    if (this.extensionHeight)
      styles.push("--w-app-bar-extension-height: " + (isNaN(this.extensionHeight) ? this.extensionHeight : this.extensionHeight + "px") + ";");
    const styleAttr = styles.length ? ' style="' + styles.join(" ") + '"' : "";
    const titleHtml = this.title ? `<strong class="w-app-bar-title">${this._esc(this.title)}</strong>` : "";
    const extension = this.extended ? `<div class="w-app-bar-extension"><slot name="extension"></slot></div>` : "";
    return `<header class="${classes.join(" ")}"${styleAttr}>
      ${titleHtml}
      <slot></slot>
    </header>${extension}`;
  }
  _events() {
    this._removeScrollListener();
    if (this.scrollBehavior || this.sticky) {
      this.__wAppBarScroll = () => this._syncScrolledState();
      window.addEventListener("scroll", this.__wAppBarScroll, { passive: true });
      this._syncScrolledState();
    }
  }
  disconnectedCallback() {
    this._removeScrollListener();
  }
  _syncScrolledState() {
    const threshold = parseInt(this.scrollThreshold, 10) || 4;
    const scrolled = window.scrollY > threshold;
    const bar = this._q(".w-app-bar");
    if (!bar)
      return;
    const wasScrolled = bar.classList.contains("w-app-bar--scrolled");
    const behavior = this.scrollBehavior;
    if (behavior) {
      switch (behavior) {
        case "hide":
          bar.classList.toggle("w-app-bar--hidden", scrolled);
          break;
        case "elevate":
          bar.classList.toggle("w-app-bar--scrolled", scrolled);
          break;
        case "collapse":
          bar.classList.toggle("w-app-bar--collapsed", scrolled);
          break;
        case "fade-image":
          if (this.image) {
            bar.classList.toggle("w-app-bar--image-faded", scrolled);
          }
          break;
      }
    }
    if (this.sticky) {
      this.toggleAttribute("data-scrolled", scrolled);
      bar.classList.toggle("w-app-bar--scrolled", scrolled);
    }
    if (wasScrolled !== scrolled) {
      this._emit("scroll", { scrolled, behavior, scrollY: window.scrollY });
    }
  }
  _removeScrollListener() {
    if (!this.__wAppBarScroll)
      return;
    window.removeEventListener("scroll", this.__wAppBarScroll);
    this.__wAppBarScroll = null;
  }
}
if (!customElements.get("w-app-bar"))
  customElements.define("w-app-bar", WAppBar);

// src/components/app-bar-title.js
class WAppBarTitle extends WElement {
  static attrs = ["color"];
  get color() {
    return this._attr("color", "");
  }
  _template() {
    const classes = ["w-app-bar-title"];
    if (this.color)
      classes.push("w-app-bar-title--" + this.color);
    const style = this.color ? ' style="--w-app-bar-title-color: var(--w-' + this._esc(this.color) + ');"' : "";
    return `<div class="${classes.join(" ")}"${style}><slot></slot></div>`;
  }
}
if (!customElements.get("w-app-bar-title")) {
  customElements.define("w-app-bar-title", WAppBarTitle);
}

// src/components/app-bar-nav-icon.js
class WAppBarNavIcon extends WElement {
  static attrs = ["aria-label", "for"];
  get ariaLabel() {
    return this._attr("aria-label", "Open navigation");
  }
  get targetId() {
    return this._attr("for", "");
  }
  _template() {
    const drawer = this._targetDrawer();
    const expanded = !!drawer?.open;
    return `<button class="w-app-bar-nav-icon w-btn w-btn-icon" type="button" aria-label="${this._esc(expanded ? "Close navigation" : this.ariaLabel)}"${this.targetId ? ` aria-controls="${this._esc(this.targetId)}"` : ""} aria-expanded="${expanded}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
        <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
      </svg>
    </button>`;
  }
  _events() {
    const button = this._q("button");
    const drawer = this._targetDrawer();
    if (button && drawer && typeof drawer.toggle === "function") {
      button.addEventListener("click", () => {
        drawer.toggle();
        this._syncExpanded();
      });
    }
    if (this.__wDrawerTarget !== drawer) {
      if (this.__wDrawerTarget && this.__wDrawerSync) {
        this.__wDrawerTarget.removeEventListener("toggle", this.__wDrawerSync);
        this.__wDrawerTarget.removeEventListener("close", this.__wDrawerSync);
      }
      this.__wDrawerTarget = drawer;
      this.__wDrawerSync = () => this._syncExpanded();
      if (drawer) {
        drawer.addEventListener("toggle", this.__wDrawerSync);
        drawer.addEventListener("close", this.__wDrawerSync);
      }
    }
  }
  disconnectedCallback() {
    if (this.__wDrawerTarget && this.__wDrawerSync) {
      this.__wDrawerTarget.removeEventListener("toggle", this.__wDrawerSync);
      this.__wDrawerTarget.removeEventListener("close", this.__wDrawerSync);
    }
  }
  _targetDrawer() {
    return this.targetId ? document.getElementById(this.targetId) : null;
  }
  _syncExpanded() {
    const button = this._q("button");
    const expanded = !!this._targetDrawer()?.open;
    if (!button)
      return;
    button.setAttribute("aria-expanded", String(expanded));
    button.setAttribute("aria-label", expanded ? "Close navigation" : this.ariaLabel);
  }
}
if (!customElements.get("w-app-bar-nav-icon")) {
  customElements.define("w-app-bar-nav-icon", WAppBarNavIcon);
}

// src/components/autocomplete.js
class WAutocomplete extends WElement {
  static attrs = [
    "label",
    "items",
    "item-title",
    "item-value",
    "value",
    "placeholder",
    "disabled",
    "readonly",
    "name",
    "hint",
    "error",
    "size",
    "multiple",
    "chips",
    "closable-chips",
    "clearable",
    "loading",
    "no-filter",
    "auto-select-first",
    "no-data-text",
    "hide-no-data",
    "hide-selected",
    "open"
  ];
  get label() {
    return this._attr("label", "");
  }
  get itemTitle() {
    return this._attr("item-title", "title");
  }
  get itemValue() {
    return this._attr("item-value", "value");
  }
  get placeholder() {
    return this._attr("placeholder", "");
  }
  get name() {
    return this._attr("name", "");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get error() {
    return this._attr("error", "");
  }
  get size() {
    return this._attr("size", "");
  }
  get noDataText() {
    return this._attr("no-data-text", "No data available");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get readonly() {
    return this._bool("readonly");
  }
  get multiple() {
    return this._bool("multiple");
  }
  get chips() {
    return this._bool("chips");
  }
  get closableChips() {
    return this._bool("closable-chips");
  }
  get clearable() {
    return this._bool("clearable");
  }
  get loading() {
    return this._bool("loading");
  }
  get noFilter() {
    return this._bool("no-filter");
  }
  get autoSelectFirst() {
    return this._bool("auto-select-first");
  }
  get hideNoData() {
    return this._bool("hide-no-data");
  }
  get hideSelected() {
    return this._bool("hide-selected");
  }
  get open() {
    return this._bool("open");
  }
  get _isCombobox() {
    return false;
  }
  _uid() {
    if (!this.__uid)
      this.__uid = "w-ac-" + Math.random().toString(36).slice(2, 8);
    return this.__uid;
  }
  get value() {
    return this._value !== undefined ? this._value : this._attr("value", "");
  }
  set value(v) {
    this._value = v;
    this._silentSet("value", v);
    if (this._rendered)
      this._syncValue();
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._rendered)
      return;
    if (oldVal === newVal)
      return;
    if (name === "open") {
      this._applyOpen();
      return;
    }
    if (name === "loading") {
      this._applyLoading();
      return;
    }
    if (name === "value") {
      if (this._value !== newVal)
        this._value = newVal;
      this._syncValue();
      return;
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }
  _template() {
    const hasField = this.label || this.hint || this.error;
    const inputId = this._uid() + "-input";
    const listId = this._uid() + "-list";
    const sizeClass = this.size ? " w-input--" + this.size : "";
    const dis = this.disabled ? " disabled" : "";
    const ro = this.readonly ? " readonly" : "";
    const loadingClass = this.loading ? " w-autocomplete-loading" : "";
    const wrap = `<div class="w-autocomplete-wrap${loadingClass}">
      <div class="w-autocomplete-chips">${this._renderChips()}</div>
      <input id="${inputId}" class="w-input w-autocomplete-input${sizeClass}" type="text"
        role="combobox" aria-expanded="false" aria-controls="${listId}" aria-autocomplete="list"
        autocomplete="off" placeholder="${this._esc(this.placeholder)}"${dis}${ro}>
      ${this.clearable ? `<button class="w-autocomplete-clear" type="button" aria-label="Clear" hidden>&#x2715;</button>` : ""}
    </div>`;
    const list = `<div class="w-autocomplete-list" id="${listId}" role="listbox" hidden>
      <div class="w-autocomplete-empty" hidden>${this._esc(this.noDataText)}</div>
      ${this._renderItems()}
    </div>`;
    const hidden = this.name ? `<input type="hidden" name="${this._esc(this.name)}" value="${this._esc(this.value)}">` : "";
    const root = `<div class="w-autocomplete">${wrap}${list}${hidden}</div>`;
    if (hasField) {
      return `<div class="w-field${this.error ? " w-field-error" : ""}">
        ${this.label ? `<label class="w-field-label" for="${inputId}">${this._esc(this.label)}</label>` : ""}
        ${root}
        ${this.hint || this.error ? `<span class="w-field-hint">${this._esc(this.error || this.hint)}</span>` : ""}
      </div>`;
    }
    return root;
  }
  _events() {
    const input = this._q(".w-autocomplete-input");
    const list = this._q(".w-autocomplete-list");
    if (!input || !list)
      return;
    input.addEventListener("input", (event) => {
      event.stopPropagation();
      this._setOpen(true);
      this._filter();
      this._syncClear();
      this._emit("input", { value: input.value, name: this.name });
    });
    input.addEventListener("keydown", (event) => this._onKeydown(event));
    input.addEventListener("click", () => {
      if (!this.disabled && !this.readonly)
        this._setOpen(true);
    });
    const clearBtn = this._q(".w-autocomplete-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        this._clear();
      });
    }
    list.addEventListener("click", (event) => {
      const item = event.target.closest(".w-autocomplete-item");
      if (!item || item.disabled)
        return;
      this._selectItem(item);
    });
    list.addEventListener("pointermove", (event) => {
      const item = event.target.closest(".w-autocomplete-item");
      if (item && !item.hidden && !item.disabled)
        this._activate(item);
    });
    list.addEventListener("mousedown", (event) => event.preventDefault());
    this.addEventListener("close", (event) => {
      const chip = event.target.closest?.("w-chip");
      if (!chip || !this.contains(chip))
        return;
      event.stopPropagation();
      this._removeValue(chip.getAttribute("value") || "");
    });
    if (this.hasAttribute("open"))
      this._applyOpen();
    this._syncValue();
    this._syncClear();
  }
  _parseItems() {
    const raw = this.getAttribute("items");
    const parsed = wParseRecords(raw);
    if (!Array.isArray(parsed))
      return [];
    return parsed.map((item) => this._normalizeItem(item));
  }
  _normalizeItem(item) {
    if (item && typeof item === "object") {
      const title = String(item[this.itemTitle] ?? item.title ?? Object.values(item)[0] ?? "");
      const value = String(item[this.itemValue] ?? item.value ?? Object.values(item)[0] ?? "");
      return {
        title,
        value,
        subtitle: item.subtitle ? String(item.subtitle) : "",
        disabled: !!item.disabled
      };
    }
    const text = String(item ?? "");
    return { title: text, value: text, subtitle: "", disabled: false };
  }
  _findItem(value) {
    return this._parseItems().find((item) => item.value === value);
  }
  _renderItems() {
    const items = this._parseItems();
    if (!items.length)
      return "<slot></slot>";
    return items.map((item, index) => {
      const id = `${this._uid()}-opt-${index}`;
      const selected = this._hasValue(item.value);
      const disabled = item.disabled ? " disabled" : "";
      const subtitle = item.subtitle ? `<span class="w-autocomplete-item-subtitle">${this._esc(item.subtitle)}</span>` : "";
      const content = subtitle ? `<span class="w-autocomplete-item-content"><span class="w-autocomplete-item-title">${this._esc(item.title)}</span>${subtitle}</span>` : this._esc(item.title);
      return `<button type="button" class="w-autocomplete-item" id="${id}" value="${this._esc(item.value)}" title="${this._esc(item.title)}" role="option" aria-selected="${selected ? "true" : "false"}"${disabled}>${content}</button>`;
    }).join("");
  }
  _valueArray() {
    return wValueList(this.value);
  }
  _hasValue(value) {
    return this._valueArray().includes(value);
  }
  _renderChips() {
    if (!this.chips)
      return "";
    const values = this._valueArray();
    if (!values.length)
      return "";
    return values.map((value) => {
      const item = this._findItem(value);
      const text = item ? item.title : value;
      const closable = this.closableChips || this.clearable ? " closable" : "";
      return `<w-chip class="w-autocomplete-chip" text="${this._esc(text)}" value="${this._esc(value)}" size="small"${closable}></w-chip>`;
    }).join("");
  }
  _syncValue() {
    const hidden = this._q('input[type="hidden"]');
    if (hidden)
      hidden.value = this.value;
    const chipsEl = this._q(".w-autocomplete-chips");
    if (chipsEl)
      chipsEl.innerHTML = this._renderChips();
    const input = this._q(".w-autocomplete-input");
    if (input && !this.multiple && document.activeElement !== input) {
      const item = this._findItem(this.value);
      input.value = item ? item.title : this.value || "";
    }
    this._qAll(".w-autocomplete-item").forEach((btn) => {
      const selected = this._hasValue(btn.getAttribute("value"));
      btn.setAttribute("aria-selected", selected ? "true" : "false");
    });
    this._syncClear();
  }
  _commit(values) {
    const next = this.multiple ? values.join(",") : values[0] || "";
    this.value = next;
  }
  _removeValue(value) {
    const values = this._valueArray().filter((v) => v !== value);
    this._commit(values);
    if (this.hasAttribute("open"))
      this._filter();
  }
  _clear() {
    this.value = "";
    const input = this._q(".w-autocomplete-input");
    if (input)
      input.value = "";
    this._filter();
    this._closeList();
    this._emit("change", { value: "", name: this.name });
    this._emit("input", { name: this.name });
    if (input)
      input.focus();
  }
  _filter() {
    const input = this._q(".w-autocomplete-input");
    const empty = this._q(".w-autocomplete-empty");
    const items = this._qAll(".w-autocomplete-item");
    if (!input)
      return;
    const query = input.value.trim().toLowerCase();
    let visible = 0;
    items.forEach((item) => {
      const matchesQuery = this.noFilter || !query || this._matchItem(item, query);
      const selectedAndHidden = this.hideSelected && this._hasValue(item.getAttribute("value") || "");
      const match = matchesQuery && !selectedAndHidden;
      item.hidden = !match;
      if (match)
        visible += 1;
    });
    if (empty) {
      const itemsExist = items.length > 0;
      empty.hidden = this.hideNoData || visible > 0 || !query && itemsExist;
    }
    if (this.autoSelectFirst && visible > 0) {
      this._activate(Array.from(items).find((item) => !item.hidden));
    } else if (!this.autoSelectFirst) {
      this._activate(null);
    }
  }
  _matchItem(item, query) {
    const title = item.getAttribute("title") || "";
    const value = item.getAttribute("value") || "";
    const subtitle = item.querySelector(".w-autocomplete-item-subtitle")?.textContent || "";
    return (title + " " + subtitle + " " + value).toLowerCase().includes(query);
  }
  _onKeydown(event) {
    const input = this._q(".w-autocomplete-input");
    if (!input)
      return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this._setOpen(true);
      this._move(1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      this._move(-1);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      const items = this._visibleItems();
      if (items.length)
        this._activate(items[0]);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      const items = this._visibleItems();
      if (items.length)
        this._activate(items[items.length - 1]);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (this._activeEl && !this._activeEl.hidden) {
        this._selectItem(this._activeEl);
      } else if (this._isCombobox && input.value.trim()) {
        this._commitFreeText(input.value.trim());
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      this._closeList();
      return;
    }
    if (event.key === "Tab") {
      this._closeList();
    }
  }
  _visibleItems() {
    return Array.from(this._qAll(".w-autocomplete-item")).filter((item) => !item.hidden && !item.disabled);
  }
  _move(delta) {
    const items = this._visibleItems();
    if (!items.length)
      return this._activate(null);
    let index = items.indexOf(this._activeEl);
    index = index < 0 ? delta > 0 ? 0 : items.length - 1 : (index + delta + items.length) % items.length;
    this._activate(items[index]);
  }
  _activate(item) {
    this._activeEl = item || null;
    const input = this._q(".w-autocomplete-input");
    this._qAll(".w-autocomplete-item").forEach((btn) => {
      btn.classList.toggle("active", btn === item);
    });
    if (input) {
      if (item && item.id)
        input.setAttribute("aria-activedescendant", item.id);
      else
        input.removeAttribute("aria-activedescendant");
    }
    if (item)
      item.scrollIntoView({ block: "nearest" });
  }
  _selectItem(item) {
    const value = item.getAttribute("value") || "";
    const title = item.getAttribute("title") || value;
    const input = this._q(".w-autocomplete-input");
    if (this.multiple) {
      const values = this._valueArray();
      if (!values.includes(value))
        values.push(value);
      this._commit(values);
      if (input) {
        input.value = "";
        input.focus();
      }
      this._filter();
    } else {
      this._commit([value]);
      this._closeList();
      if (input)
        input.value = title;
    }
    this._emit("change", { value: this.value, title, name: this.name });
  }
  _commitFreeText(text) {
    const input = this._q(".w-autocomplete-input");
    if (this.multiple) {
      const values = this._valueArray();
      if (!values.includes(text))
        values.push(text);
      this._commit(values);
      if (input) {
        input.value = "";
        input.focus();
      }
      this._filter();
    } else {
      this._commit([text]);
      this._closeList();
    }
    this._emit("change", { value: this.value, title: text, name: this.name });
  }
  _setOpen(open) {
    if (this.disabled || this.readonly)
      return;
    if (open)
      this._silentSet("open", "");
    else
      this._silentSet("open", null);
  }
  _applyOpen() {
    const list = this._q(".w-autocomplete-list");
    const input = this._q(".w-autocomplete-input");
    if (!list || !input)
      return;
    const open = this.hasAttribute("open");
    list.hidden = !open;
    input.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      this._addOutsideListener();
      this._filter();
    } else {
      this._removeOutsideListener();
      this._activate(null);
    }
  }
  _closeList() {
    this._setOpen(false);
  }
  _addOutsideListener() {
    if (this.__outsideListener)
      return;
    this.__outsideListener = (event) => {
      if (!this.contains(event.target))
        this._closeList();
    };
    document.addEventListener("pointerdown", this.__outsideListener);
  }
  _removeOutsideListener() {
    if (!this.__outsideListener)
      return;
    document.removeEventListener("pointerdown", this.__outsideListener);
    this.__outsideListener = null;
  }
  _applyLoading() {
    const wrap = this._q(".w-autocomplete-wrap");
    if (wrap)
      wrap.classList.toggle("w-autocomplete-loading", this.loading);
  }
  _syncClear() {
    const clear = this._q(".w-autocomplete-clear");
    const input = this._q(".w-autocomplete-input");
    if (!clear)
      return;
    const hasValue = !!this.value || !!(input && input.value);
    clear.hidden = !hasValue;
  }
  disconnectedCallback() {
    this._removeOutsideListener();
  }
  focus() {
    const input = this._q(".w-autocomplete-input");
    if (input)
      input.focus();
  }
}
if (!customElements.get("w-autocomplete")) {
  customElements.define("w-autocomplete", WAutocomplete);
}

// src/components/banner.js
class WBanner extends WElement {
  static attrs = ["text", "icon", "avatar", "lines", "sticky", "mobile", "stacked", "color", "bg-color"];
  static lines = ["one", "two", "three"];
  static tokens = ["primary", "secondary", "tertiary", "success", "warning", "error", "info", "surface"];
  get text() {
    return this._attr("text", "");
  }
  get icon() {
    return this._attr("icon", "");
  }
  get avatar() {
    return this._attr("avatar", "");
  }
  get lines() {
    return this.constructor.lines.includes(this._attr("lines", "")) ? this._attr("lines", "") : "";
  }
  get sticky() {
    return this._bool("sticky");
  }
  get stacked() {
    return this._bool("stacked") || this._bool("mobile");
  }
  _template() {
    const classes = [
      "w-banner",
      this.sticky ? "w-banner--sticky" : "",
      this.stacked ? "w-banner--stacked" : "",
      this.lines ? "w-banner--lines-" + this.lines : ""
    ].filter(Boolean).join(" ");
    let prepend = "";
    if (this._hasSlot("prepend")) {
      prepend = '<div class="w-banner__prepend"><slot name="prepend"></slot></div>';
    } else if (this.avatar) {
      prepend = `<div class="w-banner__prepend"><span class="w-avatar w-banner__avatar"><img src="${this._esc(this.avatar)}" alt=""></span></div>`;
    } else if (this.icon) {
      prepend = `<div class="w-banner__prepend"><span class="w-banner__icon" aria-hidden="true">${this._esc(this.icon)}</span></div>`;
    }
    const textInner = this._hasSlot("text") ? '<slot name="text"></slot>' : this.text ? this._esc(this.text) : "<slot></slot>";
    const content = `<div class="w-banner__content"><div class="w-banner-text">${textInner}</div></div>`;
    const actions = this._hasSlot("actions") ? '<div class="w-banner-actions"><slot name="actions"></slot></div>' : "";
    return `<div class="${classes}" role="region" aria-label="Banner"${this._surfaceStyle()}>${prepend}${content}${actions}</div>`;
  }
  _surfaceStyle() {
    const styles = [];
    const accent = this._token(this._attr("color", ""));
    if (accent)
      styles.push("--w-banner-accent: " + accent.fg);
    const bg = this._attr("bg-color", "");
    if (bg) {
      const t = this._token(bg);
      if (t) {
        styles.push("--w-banner-bg: " + t.bg);
        styles.push("--w-banner-fg: " + t.fg);
      } else {
        styles.push("--w-banner-bg: " + bg);
      }
    }
    return styles.length ? ` style="${styles.join("; ")}"` : "";
  }
  _token(value) {
    const t = String(value || "").trim().toLowerCase();
    if (!t)
      return null;
    if (t === "surface")
      return { bg: "var(--w-surface)", fg: "var(--w-text)" };
    const name = t === "info" ? "primary" : t;
    if (!this.constructor.tokens.includes(t))
      return null;
    return { bg: `var(--w-${name}-container)`, fg: `var(--w-on-${name}-container)` };
  }
  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
}
if (!customElements.get("w-banner"))
  customElements.define("w-banner", WBanner);

// src/components/banner-actions.js
class WBannerActions extends WElement {
  _template() {
    return `<span class="w-banner-actions"><slot></slot></span>`;
  }
}
if (!customElements.get("w-banner-actions")) {
  customElements.define("w-banner-actions", WBannerActions);
}

// src/components/banner-text.js
class WBannerText extends WElement {
  _template() {
    return `<span class="w-banner-text"><slot></slot></span>`;
  }
}
if (!customElements.get("w-banner-text")) {
  customElements.define("w-banner-text", WBannerText);
}

// src/components/bottom-nav-item.js
class WBottomNavItem extends WElement {
  static attrs = ["value", "href", "icon", "label", "active", "disabled", "color"];
  get value() {
    return this._attr("value", "");
  }
  get href() {
    return this._attr("href", "");
  }
  get icon() {
    return this._attr("icon", "");
  }
  get label() {
    return this._attr("label", "");
  }
  get active() {
    return this._bool("active");
  }
  set active(v) {
    if (v)
      this.setAttribute("active", "");
    else
      this.removeAttribute("active");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get color() {
    return this._attr("color", "");
  }
  _template() {
    const tag = this.href ? "a" : "button";
    const href = this.href ? ` href="${this._esc(this.href)}"` : ' type="button"';
    const disabled = this.disabled ? " disabled" : "";
    const ariaCurrent = this.active ? ' aria-current="true"' : "";
    const classes = ["w-bottom-nav-item"];
    if (this.active)
      classes.push("w-bottom-nav-item--active");
    if (this.disabled)
      classes.push("w-bottom-nav-item--disabled");
    const styles = [];
    if (this.color)
      styles.push("--w-bottom-nav-item-color: var(--w-" + this.color + ");");
    const styleAttr = styles.length ? ' style="' + styles.join(" ") + '"' : "";
    return `<${tag} class="${classes.join(" ")}"${href}${disabled}${ariaCurrent}${styleAttr}>
      ${this.icon ? `<span class="w-bottom-nav-item__icon" aria-hidden="true">${this._esc(this.icon)}</span>` : ""}
      <span class="w-bottom-nav-item__label">${this._esc(this.label)}<slot></slot></span>
    </${tag}>`;
  }
  _events() {
    const el = this._q(".w-bottom-nav-item");
    if (!el)
      return;
    if (this.disabled) {
      el.addEventListener("click", (e) => e.preventDefault());
    }
  }
}
if (!customElements.get("w-bottom-nav-item"))
  customElements.define("w-bottom-nav-item", WBottomNavItem);

// src/components/bottom-navigation.js
class WBottomNavigation extends WElement {
  static attrs = [
    "value",
    "color",
    "bg-color",
    "grow",
    "mode",
    "density",
    "elevation",
    "height"
  ];
  get value() {
    return this._attr("value", "");
  }
  set value(v) {
    this.setAttribute("value", v);
  }
  get color() {
    return this._attr("color", "");
  }
  get bgColor() {
    return this._attr("bg-color", "");
  }
  get grow() {
    return this._bool("grow");
  }
  get mode() {
    return this._attr("mode", "");
  }
  get density() {
    return this._attr("density", "");
  }
  get elevation() {
    return this._attr("elevation", "");
  }
  get height() {
    return this._attr("height", "");
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this._observer) {
      this._observer = new MutationObserver(() => this._syncItems());
      this._observer.observe(this, { childList: true, subtree: false });
    }
  }
  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._rendered)
      return;
    if (oldVal === newVal)
      return;
    if (name === "value") {
      this._syncItems();
      return;
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }
  _template() {
    const classes = ["w-bottom-navigation"];
    if (this.grow)
      classes.push("w-bottom-navigation--grow");
    if (this.mode === "shift")
      classes.push("w-bottom-navigation--shift");
    if (this.density)
      classes.push("w-bottom-navigation--" + this.density);
    if (this.elevation)
      classes.push("elevation-" + this.elevation);
    const styles = [];
    if (this.color)
      styles.push("--w-bottom-nav-color: var(--w-" + this.color + ");");
    if (this.bgColor)
      styles.push("--w-bottom-nav-bg: var(--w-" + this.bgColor + ");");
    if (this.height)
      styles.push("--w-bottom-nav-height: " + (isNaN(this.height) ? this.height : this.height + "px") + ";");
    const styleAttr = styles.length ? ' style="' + styles.join(" ") + '"' : "";
    return `<nav class="${classes.join(" ")}" role="navigation" aria-label="Bottom navigation"${styleAttr}><slot></slot></nav>`;
  }
  _events() {
    const nav = this._q(".w-bottom-navigation");
    if (!nav)
      return;
    nav.addEventListener("click", (e) => {
      const item = e.target.closest("w-bottom-nav-item");
      if (!item || item.disabled)
        return;
      this._activateItem(item);
    });
    this._syncItems();
  }
  _getItemElements() {
    return Array.from(this.querySelectorAll("w-bottom-nav-item"));
  }
  _syncItems() {
    const currentValue = this.value;
    this._getItemElements().forEach((item) => {
      const shouldBeActive = item.value === currentValue;
      if (item.active !== shouldBeActive) {
        item.active = shouldBeActive;
      }
    });
  }
  _activateItem(itemEl) {
    if (!itemEl || itemEl.disabled)
      return;
    const newValue = itemEl.value;
    if (this.value === newValue)
      return;
    this.value = newValue;
    this._syncItems();
    this._emit("change", { value: newValue });
  }
}
if (!customElements.get("w-bottom-navigation"))
  customElements.define("w-bottom-navigation", WBottomNavigation);

// src/components/bottom-sheet.js
class WBottomSheet extends WElement {
  static attrs = ["open"];
  get open() {
    return this._bool("open");
  }
  _template() {
    return `<div class="w-bottom-sheet${this.open ? " open" : ""}" role="dialog" aria-modal="true">
      <slot></slot>
    </div>`;
  }
}
if (!customElements.get("w-bottom-sheet"))
  customElements.define("w-bottom-sheet", WBottomSheet);

// src/components/breadcrumb.js
class WBreadcrumb extends WElement {
  static attrs = ["href", "active", "disabled", "icon"];
  get href() {
    return this._attr("href", "");
  }
  get active() {
    return this._bool("active");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get icon() {
    return this._attr("icon", "");
  }
  _template() {
    const cls = `w-breadcrumb${this.active ? " active" : ""}`;
    const icon = this.icon ? `<span class="w-breadcrumb-icon" aria-hidden="true">${this._esc(this.icon)}</span>` : "";
    if (this.href && !this.active && !this.disabled) {
      return `<a class="${cls}" href="${this._esc(this.href)}">${icon}<slot></slot></a>`;
    }
    const attrs = `${this.active ? ' aria-current="page"' : ""}${this.disabled ? ' aria-disabled="true"' : ""}`;
    return `<span class="${cls}"${attrs}>${icon}<slot></slot></span>`;
  }
}
if (!customElements.get("w-breadcrumb"))
  customElements.define("w-breadcrumb", WBreadcrumb);

// src/components/breadcrumbs.js
class WBreadcrumbs extends WElement {
  static attrs = ["items", "divider", "icon", "color", "active-color", "bg-color", "density", "rounded", "disabled"];
  get items() {
    const raw = this.getAttribute("items");
    if (!raw)
      return null;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (_) {
      return null;
    }
  }
  get divider() {
    return this._attr("divider", "/");
  }
  get icon() {
    return this._attr("icon", "");
  }
  get rounded() {
    return this.hasAttribute("rounded");
  }
  _template() {
    const cls = ["w-breadcrumbs"];
    if (this.rounded)
      cls.push("w-breadcrumbs--rounded");
    const density = this.getAttribute("density");
    if (density === "compact")
      cls.push("w-breadcrumbs--compact");
    else if (density === "comfortable")
      cls.push("w-breadcrumbs--comfortable");
    const prepend = this.icon ? `<span class="w-breadcrumb-icon" aria-hidden="true">${this._esc(this.icon)}</span>` : "";
    const items = this.items;
    const body = items && items.length ? items.map((item, index) => this._crumb(item, index === items.length - 1)).join("") : "<slot></slot>";
    return `<nav class="${cls.join(" ")}" aria-label="Breadcrumb">${prepend}${body}</nav>`;
  }
  _crumb(item, isLast) {
    const label = item.title != null ? item.title : item.text != null ? item.text : "";
    const icon = item.icon ? `<span class="w-breadcrumb-icon" aria-hidden="true">${this._esc(item.icon)}</span>` : "";
    const inner = `${icon}${this._esc(label)}`;
    const disabled = !!item.disabled;
    if (item.href && !isLast && !disabled) {
      return `<a class="w-breadcrumb" href="${this._esc(item.href)}">${inner}</a>`;
    }
    const cls = `w-breadcrumb${isLast ? " active" : ""}`;
    const attrs = `${isLast ? ' aria-current="page"' : ""}${disabled ? ' aria-disabled="true"' : ""}`;
    return `<span class="${cls}"${attrs}>${inner}</span>`;
  }
  _applyCommonProps() {
    super._applyCommonProps();
    const divider = String(this.divider).replace(/[\\"]/g, "\\$&");
    this.style.setProperty("--w-breadcrumb-divider", `"${divider}"`);
    const setVar = (prop, attr) => {
      const v = this.getAttribute(attr);
      if (v)
        this.style.setProperty(prop, `var(--w-${v})`);
      else
        this.style.removeProperty(prop);
    };
    setVar("--w-breadcrumb-color", "color");
    setVar("--w-breadcrumb-active-color", "active-color");
    setVar("--w-breadcrumb-bg", "bg-color");
  }
}
if (!customElements.get("w-breadcrumbs"))
  customElements.define("w-breadcrumbs", WBreadcrumbs);

// src/components/breadcrumbs-item.js
class WBreadcrumbsItem extends customElements.get("w-breadcrumb") {
}
if (!customElements.get("w-breadcrumbs-item")) {
  customElements.define("w-breadcrumbs-item", WBreadcrumbsItem);
}

// src/components/breadcrumbs-divider.js
class WBreadcrumbsDivider extends WElement {
  _template() {
    return `<span class="w-breadcrumb-sep" aria-hidden="true"><slot></slot></span>`;
  }
}
if (!customElements.get("w-breadcrumbs-divider")) {
  customElements.define("w-breadcrumbs-divider", WBreadcrumbsDivider);
}

// src/components/btn-group.js
class WBtnGroup extends WElement {
  _template() {
    return `<div class="w-btn-group" role="group"><slot></slot></div>`;
  }
}
if (!customElements.get("w-btn-group"))
  customElements.define("w-btn-group", WBtnGroup);

// src/components/btn-toggle.js
class WBtnToggle extends WElement {
  static attrs = ["value", "multiple", "mandatory", "max", "selected-class", "disabled", "divided", "variant", "color", "density"];
  get value() {
    return this._attr("value", "");
  }
  get multiple() {
    return this._bool("multiple");
  }
  get mandatory() {
    const value = this._attr("mandatory", null);
    if (value === null)
      return false;
    return value === "force" ? "force" : true;
  }
  get max() {
    return Math.max(0, wNumberAttr(this, "max", 0));
  }
  get selectedClass() {
    return this._attr("selected-class", "");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get divided() {
    return this._bool("divided");
  }
  get variant() {
    return this._attr("variant", "");
  }
  get density() {
    return this._attr("density", "");
  }
  _template() {
    const classes = ["w-btn-group", "w-btn-toggle"];
    if (this.divided)
      classes.push("w-btn-group--divided");
    return `<div class="${classes.join(" ")}" role="group" aria-disabled="${this.disabled ? "true" : "false"}"><slot></slot></div>`;
  }
  _events() {
    this._decorate();
    if (this.mandatory === "force" && !this._values().length) {
      const first = this._btns().find((btn) => !btn.hasAttribute("disabled"));
      if (first)
        this._silentSet("value", this._btnValue(first));
    }
    this._sync();
    if (this.__wToggleBound)
      return;
    this.__wToggleBound = true;
    this.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const btn = target ? target.closest("w-btn") : null;
      if (!btn || !this.contains(btn) || btn.hasAttribute("disabled") || this.disabled)
        return;
      this._toggle(btn);
    });
  }
  _toggle(btn) {
    const val = this._btnValue(btn);
    let values = this._values();
    if (this.multiple) {
      if (values.includes(val)) {
        if (this.mandatory && values.length <= 1)
          return;
        values = values.filter((v) => v !== val);
      } else {
        if (this.max && values.length >= this.max)
          return;
        values = values.concat(val);
      }
    } else if (values.includes(val)) {
      if (this.mandatory)
        return;
      values = [];
    } else {
      values = [val];
    }
    this._commit(values);
  }
  _commit(values) {
    const next = this.multiple ? values.join(",") : values[0] || "";
    this._silentSet("value", next || null);
    this._sync(values);
    this._emit("change", { value: this.multiple ? values : next });
  }
  _sync(values) {
    const selected = new Set(values || this._values());
    this._btns().forEach((btn) => {
      const on = selected.has(this._btnValue(btn));
      btn.toggleAttribute("active", on);
      if (this.selectedClass)
        btn.classList.toggle(this.selectedClass, on);
    });
    const apply = () => this._btns().forEach((btn) => {
      const inner = btn.querySelector("button, a");
      if (inner)
        inner.setAttribute("aria-pressed", selected.has(this._btnValue(btn)) ? "true" : "false");
    });
    apply();
    queueMicrotask(apply);
  }
  _decorate() {
    this._btns().forEach((btn) => {
      if (this.variant && !btn.hasAttribute("variant"))
        btn.setAttribute("variant", this.variant);
      if (this._attr("color", "") && !btn.hasAttribute("color"))
        btn.setAttribute("color", this._attr("color", ""));
      if (this.density && !btn.hasAttribute("density"))
        btn.setAttribute("density", this.density);
      if (this.disabled)
        btn.setAttribute("disabled", "");
    });
  }
  _values() {
    const raw = this.value;
    if (this.multiple)
      return wValueList(raw);
    return raw ? [raw] : [];
  }
  _btns() {
    return Array.from(this.querySelectorAll("w-btn"));
  }
  _btnValue(btn) {
    return btn.getAttribute("value") || btn.textContent.trim();
  }
}
if (!customElements.get("w-btn-toggle"))
  customElements.define("w-btn-toggle", WBtnToggle);

// src/components/calendar-utils.js
var ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
function wCalendarDate(value, fallback = null) {
  if (value instanceof Date && !Number.isNaN(value.getTime()))
    return new Date(value);
  if (typeof value === "number" && Number.isFinite(value))
    return new Date(value);
  if (typeof value !== "string")
    return fallback ? new Date(fallback) : null;
  const match = value.trim().match(ISO_DATE_RE);
  if (!match)
    return fallback ? new Date(fallback) : null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4] || 0), Number(match[5] || 0), Number(match[6] || 0));
  if (date.getFullYear() !== Number(match[1]) || date.getMonth() !== Number(match[2]) - 1 || date.getDate() !== Number(match[3]))
    return fallback ? new Date(fallback) : null;
  return date;
}
function wCalendarIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function wCalendarDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}
function wCalendarAddDays(date, amount) {
  const next = wCalendarDay(date);
  next.setDate(next.getDate() + amount);
  return next;
}
function wCalendarAddMonths(date, amount) {
  const day = date.getDate();
  const next = new Date(date.getFullYear(), date.getMonth() + amount, 1, 12);
  const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, last));
  return next;
}
function wCalendarStartOfWeek(date, firstDay = 0) {
  const start = wCalendarDay(date);
  const offset = (start.getDay() - firstDay + 7) % 7;
  return wCalendarAddDays(start, -offset);
}
function wCalendarEndOfWeek(date, firstDay = 0) {
  return wCalendarAddDays(wCalendarStartOfWeek(date, firstDay), 6);
}
function wCalendarDays(start, end, max = Number.MAX_SAFE_INTEGER) {
  const days = [];
  let cursor = wCalendarDay(start);
  const finish = wCalendarDay(end);
  while (cursor <= finish && days.length < max) {
    days.push(cursor);
    cursor = wCalendarAddDays(cursor, 1);
  }
  return days;
}
function wCalendarMinutes(date) {
  return date.getHours() * 60 + date.getMinutes();
}
function wCalendarHasTime(value) {
  return typeof value === "string" && /[ T]\d{1,2}:\d{2}/.test(value);
}
function wCalendarWeekNumber(date, firstDay = 1, firstDayOfYear = 4) {
  const target = wCalendarDay(date);
  const yearStart = new Date(target.getFullYear(), 0, firstDayOfYear, 12);
  const weekStart = wCalendarStartOfWeek(yearStart, firstDay);
  if (target < weekStart) {
    return wCalendarWeekNumber(new Date(target.getFullYear() - 1, 11, 31, 12), firstDay, firstDayOfYear);
  }
  return Math.floor((target - weekStart) / 86400000 / 7) + 1;
}
function wCalendarJson(value, fallback = []) {
  if (Array.isArray(value))
    return value;
  if (value && typeof value === "object")
    return value;
  const source = String(value || "").trim();
  if (!source)
    return fallback;
  try {
    const parsed = JSON.parse(source);
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
}
function wCalendarColor(value, fallback = "primary") {
  const color = String(value || fallback).trim();
  if (!color)
    return `var(--w-${fallback})`;
  if (color.startsWith("#") || color.startsWith("rgb") || color.startsWith("hsl") || color.startsWith("oklch") || color.startsWith("var(") || color === "transparent" || color === "currentColor")
    return color;
  return `var(--w-${color})`;
}

// src/components/calendar.js
var VIEW_TYPES = new Set([
  "month",
  "week",
  "day",
  "4day",
  "custom-weekly",
  "custom-daily",
  "category"
]);

class WCalendar extends WElement {
  static attrs = [
    "value",
    "type",
    "start",
    "end",
    "month",
    "year",
    "min",
    "max",
    "weekdays",
    "first-day-of-week",
    "first-day-of-year",
    "locale",
    "now",
    "format",
    "short-weekdays",
    "short-months",
    "show-month-on-first",
    "show-week",
    "hide-header",
    "min-weeks",
    "max-days",
    "events",
    "event-start",
    "event-end",
    "event-timed",
    "event-category",
    "event-height",
    "event-color",
    "event-text-color",
    "event-name",
    "event-overlap-threshold",
    "event-overlap-mode",
    "event-more",
    "event-more-text",
    "event-ripple",
    "event-margin-bottom",
    "event-draggable",
    "interval-height",
    "interval-width",
    "interval-minutes",
    "first-interval",
    "first-time",
    "interval-count",
    "interval-highlight",
    "short-intervals",
    "categories",
    "category-days",
    "category-text",
    "category-hide-dynamic",
    "category-show-all",
    "category-for-invalid"
  ];
  get value() {
    return this._attr("value", "");
  }
  set value(next) {
    const parsed = wCalendarDate(next);
    if (!parsed)
      return;
    this._silentSet("value", wCalendarIso(parsed));
    this._refresh();
  }
  get type() {
    const value = this._attr("type", "month");
    return VIEW_TYPES.has(value) ? value : "month";
  }
  get events() {
    if (this._eventsInput !== undefined)
      return Array.isArray(this._eventsInput) ? this._eventsInput : [];
    const parsed = wCalendarJson(this.getAttribute("events"), []);
    return Array.isArray(parsed) ? parsed : [];
  }
  set events(value) {
    this._eventsInput = value;
    this._refresh();
  }
  get categories() {
    if (this._categoriesInput !== undefined)
      return this._categoriesInput;
    const value = this.getAttribute("categories");
    if (!value)
      return [];
    const parsed = wCalendarJson(value, null);
    return Array.isArray(parsed) ? parsed : wValueList(value);
  }
  set categories(value) {
    this._categoriesInput = Array.isArray(value) ? value : [];
    this._refresh();
  }
  get weekdays() {
    if (this._weekdaysInput !== undefined)
      return this._normalizeWeekdays(this._weekdaysInput);
    const value = this.getAttribute("weekdays");
    if (!value)
      return this._orderedWeekdays([0, 1, 2, 3, 4, 5, 6]);
    const parsed = wCalendarJson(value, null);
    return this._normalizeWeekdays(Array.isArray(parsed) ? parsed : wValueList(value));
  }
  set weekdays(value) {
    this._weekdaysInput = value;
    this._refresh();
  }
  get dayFormat() {
    return this._dayFormatInput;
  }
  set dayFormat(value) {
    this._dayFormatInput = value;
    this._refresh();
  }
  get weekdayFormat() {
    return this._weekdayFormatInput;
  }
  set weekdayFormat(value) {
    this._weekdayFormatInput = value;
    this._refresh();
  }
  get monthFormat() {
    return this._monthFormatInput;
  }
  set monthFormat(value) {
    this._monthFormatInput = value;
    this._refresh();
  }
  get intervalFormat() {
    return this._intervalFormatInput;
  }
  set intervalFormat(value) {
    this._intervalFormatInput = value;
    this._refresh();
  }
  get intervalStyle() {
    return this._intervalStyleInput;
  }
  set intervalStyle(value) {
    this._intervalStyleInput = value;
    this._refresh();
  }
  get showIntervalLabel() {
    return this._showIntervalLabelInput;
  }
  set showIntervalLabel(value) {
    this._showIntervalLabelInput = value;
    this._refresh();
  }
  get firstTime() {
    return this._firstTimeInput ?? this.getAttribute("first-time");
  }
  set firstTime(value) {
    this._firstTimeInput = value;
    this._refresh();
  }
  get start() {
    return this._startInput ?? this.getAttribute("start");
  }
  set start(value) {
    this._startInput = value;
    this._refresh();
  }
  get end() {
    return this._endInput ?? this.getAttribute("end");
  }
  set end(value) {
    this._endInput = value;
    this._refresh();
  }
  get categoryText() {
    return this._categoryTextInput ?? this._attr("category-text", "name");
  }
  set categoryText(value) {
    this._categoryTextInput = value;
    this._refresh();
  }
  get eventName() {
    return this._eventNameInput ?? this._attr("event-name", "name");
  }
  set eventName(value) {
    this._eventNameInput = value;
    this._refresh();
  }
  get eventColor() {
    return this._eventColorInput ?? this._attr("event-color", "primary");
  }
  set eventColor(value) {
    this._eventColorInput = value;
    this._refresh();
  }
  get eventTextColor() {
    return this._eventTextColorInput ?? this._attr("event-text-color", "");
  }
  set eventTextColor(value) {
    this._eventTextColorInput = value;
    this._refresh();
  }
  get eventTimed() {
    return this._eventTimedInput ?? this._attr("event-timed", "timed");
  }
  set eventTimed(value) {
    this._eventTimedInput = value;
    this._refresh();
  }
  get eventCategory() {
    return this._eventCategoryInput ?? this._attr("event-category", "category");
  }
  set eventCategory(value) {
    this._eventCategoryInput = value;
    this._refresh();
  }
  get eventRipple() {
    if (this._eventRippleInput !== undefined)
      return this._eventRippleInput;
    return wBoolAttr(this, "event-ripple", false);
  }
  set eventRipple(value) {
    this._eventRippleInput = value;
    this._refresh();
  }
  get eventDraggable() {
    return wBoolAttr(this, "event-draggable", false);
  }
  get eventOverlapMode() {
    if (typeof this._eventOverlapModeInput === "function")
      return this._eventOverlapModeInput;
    return this._attr("event-overlap-mode", "stack") === "column" ? "column" : "stack";
  }
  set eventOverlapMode(value) {
    this._eventOverlapModeInput = value;
    this._refresh();
  }
  get dayContent() {
    return this._dayContentInput;
  }
  set dayContent(value) {
    this._dayContentInput = value;
    this._refresh();
  }
  get dayBodyContent() {
    return this._dayBodyContentInput;
  }
  set dayBodyContent(value) {
    this._dayBodyContentInput = value;
    this._refresh();
  }
  get dayHeaderContent() {
    return this._dayHeaderContentInput;
  }
  set dayHeaderContent(value) {
    this._dayHeaderContentInput = value;
    this._refresh();
  }
  get eventContent() {
    return this._eventContentInput;
  }
  set eventContent(value) {
    this._eventContentInput = value;
    this._refresh();
  }
  get intervalContent() {
    return this._intervalContentInput;
  }
  set intervalContent(value) {
    this._intervalContentInput = value;
    this._refresh();
  }
  get intervalHeaderContent() {
    return this._intervalHeaderContentInput;
  }
  set intervalHeaderContent(value) {
    this._intervalHeaderContentInput = value;
    this._refresh();
  }
  get categoryContent() {
    return this._categoryContentInput;
  }
  set categoryContent(value) {
    this._categoryContentInput = value;
    this._refresh();
  }
  get locale() {
    return this._attr("locale", document.documentElement.lang || "en-US");
  }
  get title() {
    return this._title(this._range());
  }
  get times() {
    const now = this._now();
    return {
      now: { ...this._dayScope(now), hour: now.getHours(), minute: now.getMinutes() },
      today: wCalendarIso(now)
    };
  }
  get firstDayOfWeek() {
    return this._boundedInt("first-day-of-week", 0, 0, 6);
  }
  get firstDayOfYear() {
    return this._boundedInt("first-day-of-year", 4, 1, 7);
  }
  get minWeeks() {
    return this._boundedInt("min-weeks", 1, 1, 8);
  }
  get maxDays() {
    return this._boundedInt("max-days", 7, 1, 366);
  }
  get categoryDays() {
    return this._boundedInt("category-days", 1, 1, 31);
  }
  get intervalHeight() {
    return Math.max(24, this._numberAttr("interval-height", 48));
  }
  get intervalWidth() {
    return Math.max(44, this._numberAttr("interval-width", 60));
  }
  get intervalMinutes() {
    return Math.max(1, this._numberAttr("interval-minutes", 60));
  }
  get firstInterval() {
    return Math.max(0, this._numberAttr("first-interval", 0));
  }
  get intervalCount() {
    return Math.max(1, Math.floor(this._numberAttr("interval-count", 24)));
  }
  get eventHeight() {
    return Math.max(16, this._numberAttr("event-height", 20));
  }
  get eventMarginBottom() {
    return Math.max(0, this._numberAttr("event-margin-bottom", 1));
  }
  get eventOverlapThreshold() {
    return Math.max(0, this._numberAttr("event-overlap-threshold", 60));
  }
  get shortWeekdays() {
    return wBoolAttr(this, "short-weekdays", true);
  }
  get shortMonths() {
    return wBoolAttr(this, "short-months", true);
  }
  get showMonthOnFirst() {
    return wBoolAttr(this, "show-month-on-first", true);
  }
  get showWeek() {
    return wBoolAttr(this, "show-week", false);
  }
  get hideHeader() {
    return wBoolAttr(this, "hide-header", false);
  }
  get eventMore() {
    return wBoolAttr(this, "event-more", true);
  }
  get intervalHighlight() {
    return wBoolAttr(this, "interval-highlight", false);
  }
  get shortIntervals() {
    return wBoolAttr(this, "short-intervals", true);
  }
  get categoryHideDynamic() {
    return wBoolAttr(this, "category-hide-dynamic", false);
  }
  get categoryShowAll() {
    return wBoolAttr(this, "category-show-all", false);
  }
  _numberAttr(name, fallback) {
    const raw = this.getAttribute(name);
    if (raw == null || raw === "")
      return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  _boundedInt(name, fallback, min, max) {
    return Math.min(max, Math.max(min, Math.floor(this._numberAttr(name, fallback))));
  }
  _normalizeWeekdays(values) {
    const normalized = [...new Set((Array.isArray(values) ? values : []).map(Number).filter((value) => Number.isInteger(value) && value >= 0 && value <= 6))];
    return this._orderedWeekdays(normalized.length ? normalized : [0, 1, 2, 3, 4, 5, 6]);
  }
  _orderedWeekdays(values) {
    return [...values].sort((a, b) => (a - this.firstDayOfWeek + 7) % 7 - (b - this.firstDayOfWeek + 7) % 7);
  }
  _now() {
    return wCalendarDate(this._attr("now", ""), new Date) || new Date;
  }
  _anchor() {
    const fallback = wCalendarDate(this.start, this._now()) || this._now();
    const selected = wCalendarDate(this.value, fallback) || fallback;
    const month = this.hasAttribute("month") ? this._boundedInt("month", selected.getMonth() + 1, 1, 12) : selected.getMonth() + 1;
    const year = this.hasAttribute("year") ? this._boundedInt("year", selected.getFullYear(), 1, 9999) : selected.getFullYear();
    const lastDay = new Date(year, month, 0).getDate();
    return new Date(year, month - 1, Math.min(selected.getDate(), lastDay), 12);
  }
  _range() {
    const anchor = this._anchor();
    if (this.type === "month") {
      return {
        start: new Date(anchor.getFullYear(), anchor.getMonth(), 1, 12),
        end: new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0, 12)
      };
    }
    if (this.type === "week") {
      return {
        start: wCalendarStartOfWeek(anchor, this.firstDayOfWeek),
        end: wCalendarEndOfWeek(anchor, this.firstDayOfWeek)
      };
    }
    if (this.type === "day")
      return { start: anchor, end: anchor };
    if (this.type === "4day")
      return { start: anchor, end: wCalendarAddDays(anchor, 3) };
    if (this.type === "category")
      return { start: anchor, end: wCalendarAddDays(anchor, this.categoryDays - 1) };
    const start = wCalendarDate(this.start, anchor) || anchor;
    const fallbackEnd = wCalendarAddDays(start, this.maxDays - 1);
    const end = wCalendarDate(this.end, fallbackEnd) || fallbackEnd;
    return { start, end: end < start ? start : end };
  }
  _title(range) {
    const month = (date, style = "long") => new Intl.DateTimeFormat(this.locale, {
      month: style,
      timeZone: "UTC"
    }).format(new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1)));
    if (range.start.getFullYear() === range.end.getFullYear() && range.start.getMonth() === range.end.getMonth()) {
      if (this.type === "month")
        return `${month(range.start)} ${range.start.getFullYear()}`;
      if (range.start.getDate() === range.end.getDate()) {
        return new Intl.DateTimeFormat(this.locale, {
          month: "long",
          day: "numeric",
          year: "numeric"
        }).format(range.start);
      }
      return `${month(range.start, "short")} ${range.start.getDate()}–${range.end.getDate()}, ${range.start.getFullYear()}`;
    }
    const start = `${month(range.start, "short")} ${range.start.getDate()}${range.start.getFullYear() !== range.end.getFullYear() ? `, ${range.start.getFullYear()}` : ""}`;
    const end = `${month(range.end, "short")} ${range.end.getDate()}, ${range.end.getFullYear()}`;
    return `${start} – ${end}`;
  }
  _template() {
    const range = this._range();
    const events = this._parsedEvents();
    const classes = [
      "w-calendar",
      `w-calendar--${this.type}`,
      this.showWeek ? "w-calendar--show-week" : "",
      events.length ? "w-calendar--with-events" : ""
    ].filter(Boolean).join(" ");
    const header = this.hideHeader ? "" : this._headerTemplate(range);
    let body;
    if (this.type === "month" || this.type === "custom-weekly") {
      body = this._monthTemplate(range, events);
    } else if (this.type === "category") {
      body = this._categoryTemplate(range, events);
    } else {
      body = this._scheduleTemplate(range, events);
    }
    return `<section class="${classes}" aria-label="${this._esc(this._title(range))}" data-view="${this.type}">
      ${header}
      ${body}
    </section>`;
  }
  _headerTemplate(range) {
    return `<header class="w-calendar-header">
      <div class="w-calendar-header__nav">
        <button class="w-calendar-nav" type="button" data-calendar-nav="prev" aria-label="Previous period">‹</button>
        <button class="w-calendar-today" type="button" data-calendar-nav="today">Today</button>
        <button class="w-calendar-nav" type="button" data-calendar-nav="next" aria-label="Next period">›</button>
      </div>
      <strong class="w-calendar-title" aria-live="polite">${this._esc(this._title(range))}</strong>
    </header>`;
  }
  _monthTemplate(range, events) {
    const weekdays = this.weekdays;
    const monthMode = this.type === "month";
    const monthStart = monthMode ? new Date(this._anchor().getFullYear(), this._anchor().getMonth(), 1, 12) : range.start;
    const monthEnd = monthMode ? new Date(this._anchor().getFullYear(), this._anchor().getMonth() + 1, 0, 12) : range.end;
    let cursor = wCalendarStartOfWeek(monthStart, this.firstDayOfWeek);
    let finish = wCalendarEndOfWeek(monthEnd, this.firstDayOfWeek);
    const weeks = [];
    while (cursor <= finish || weeks.length < this.minWeeks) {
      const fullWeek = wCalendarDays(cursor, wCalendarAddDays(cursor, 6));
      weeks.push(fullWeek.filter((date) => weekdays.includes(date.getDay())));
      cursor = wCalendarAddDays(cursor, 7);
      if (cursor > finish && weeks.length < this.minWeeks)
        finish = wCalendarAddDays(finish, 7);
    }
    const columns = weekdays.length + (this.showWeek ? 1 : 0);
    const weekdayHeader = weekdays.map((weekday) => `<div class="w-calendar-weekday" role="columnheader">${this._esc(this._formatWeekday(weekday))}</div>`).join("");
    const weekRows = weeks.map((week) => {
      const number = this.showWeek ? `<div class="w-calendar-week-number" aria-label="Week ${wCalendarWeekNumber(week[0], this.firstDayOfWeek, this.firstDayOfYear)}">${wCalendarWeekNumber(week[0], this.firstDayOfWeek, this.firstDayOfYear)}</div>` : "";
      return `<div class="w-calendar-week" role="row" style="--w-calendar-columns:${columns}">
        ${number}
        ${week.map((date) => this._monthDayTemplate(date, range, events)).join("")}
      </div>`;
    }).join("");
    return `<div class="w-calendar-month" role="grid" style="--w-calendar-columns:${columns}">
      <div class="w-calendar-weekdays" role="row" style="--w-calendar-columns:${columns}">
        ${this.showWeek ? '<div class="w-calendar-week-number w-calendar-week-number--head" aria-hidden="true">#</div>' : ""}
        ${weekdayHeader}
      </div>
      ${weekRows}
    </div>`;
  }
  _monthDayTemplate(date, range, events) {
    const iso = wCalendarIso(date);
    const selected = iso === wCalendarIso(this._anchor());
    const today = iso === wCalendarIso(this._now());
    const outside = date < range.start || date > range.end;
    const disabled = this._dateDisabled(iso);
    const dayEvents = events.filter((event) => this._eventOnDate(event, date));
    const visibleCount = this.eventMore ? Math.min(dayEvents.length, 3) : dayEvents.length;
    const hidden = dayEvents.length - visibleCount;
    const label = date.getDate() === 1 && this.showMonthOnFirst ? `${this._formatMonth(date)} ${this._formatDay(date)}` : this._formatDay(date);
    const classes = [
      "w-calendar-day",
      outside ? "outside" : "",
      selected ? "selected" : "",
      today ? "today" : "",
      disabled ? "disabled" : ""
    ].filter(Boolean).join(" ");
    const content = this._renderCallback(this.dayContent, {
      ...this._dayScope(date),
      outside,
      events: dayEvents.map((event) => event.source)
    });
    return `<div class="${classes}" role="gridcell" data-date-cell="${iso}">
      <button
        class="w-calendar-day-button"
        type="button"
        data-date="${iso}"
        aria-label="${this._esc(this._formatDateLabel(date))}"
        aria-selected="${selected}"
        tabindex="${selected ? "0" : "-1"}"
        ${disabled ? "disabled" : ""}
      >${this._esc(label)}</button>
      ${content ? `<div class="w-calendar-day-content">${content}</div>` : ""}
      <div class="w-calendar-day-events">
        ${dayEvents.slice(0, visibleCount).map((event) => this._eventTemplate(event, iso, false, "", event.timed)).join("")}
        ${hidden > 0 ? `<button class="w-calendar-more" type="button" data-more-date="${iso}" data-hidden="${hidden}">${this._esc(this._moreText(hidden))}</button>` : ""}
      </div>
    </div>`;
  }
  _scheduleTemplate(range, events) {
    const days = this._scheduleDays(range);
    const firstMinute = this._firstMinute();
    const intervalLabels = Array.from({ length: this.intervalCount }, (_, index) => {
      const minutes = firstMinute + index * this.intervalMinutes;
      const visible = typeof this.showIntervalLabel === "function" ? this.showIntervalLabel(this._intervalScope(days[0], minutes, index)) : true;
      return `<div class="w-calendar-time-label" style="height:${this.intervalHeight}px">${visible ? this._esc(this._formatTime(minutes)) : ""}</div>`;
    }).join("");
    const headers = days.map((date) => {
      const iso = wCalendarIso(date);
      const content = this._renderCallback(this.dayHeaderContent, this._dayScope(date));
      return `<div class="w-calendar-day-header" data-date="${iso}">
        <span>${this._esc(this._formatWeekday(date.getDay()))}</span>
        <button type="button" data-date="${iso}" aria-label="${this._esc(this._formatDateLabel(date))}">${this._esc(this._formatDay(date))}</button>
        ${content ? `<div class="w-calendar-day-header-content">${content}</div>` : ""}
      </div>`;
    }).join("");
    const allDay = days.map((date) => {
      const iso = wCalendarIso(date);
      const dayEvents = events.filter((event) => !event.timed && this._eventOnDate(event, date));
      return `<div class="w-calendar-all-day-cell" data-date-cell="${iso}">
        ${dayEvents.map((event) => this._eventTemplate(event, iso, false)).join("")}
      </div>`;
    }).join("");
    const columns = days.map((date) => this._dayColumnTemplate(date, events, firstMinute)).join("");
    const highlight = this.getAttribute("interval-highlight");
    const highlightColor = highlight && !["true", "false"].includes(highlight) ? wCalendarColor(highlight, "selected") : "var(--w-selected)";
    return `<div
      class="w-calendar-schedule"
      role="grid"
      style="--w-calendar-days:${Math.max(1, days.length)};--w-calendar-interval-height:${this.intervalHeight}px;--w-calendar-interval-width:${this.intervalWidth}px;--w-calendar-event-height:${this.eventHeight}px;--w-calendar-event-gap:${this.eventMarginBottom}px;--w-calendar-interval-highlight:${highlightColor}"
    >
      <div class="w-calendar-schedule-head">
        <div class="w-calendar-gutter-head">${this._renderCallback(this.intervalHeaderContent, { days: days.map((date) => this._dayScope(date)) })}</div>
        <div class="w-calendar-day-headers">${headers}</div>
      </div>
      <div class="w-calendar-all-day">
        <div class="w-calendar-all-day-label">All day</div>
        <div class="w-calendar-all-day-cells">${allDay}</div>
      </div>
      <div class="w-calendar-schedule-scroll">
        <div class="w-calendar-time-axis">${intervalLabels}</div>
        <div class="w-calendar-day-columns">${columns}</div>
      </div>
    </div>`;
  }
  _scheduleDays(range) {
    let days;
    if (this.type === "week") {
      days = wCalendarDays(wCalendarStartOfWeek(this._anchor(), this.firstDayOfWeek), wCalendarEndOfWeek(this._anchor(), this.firstDayOfWeek));
    } else if (this.type === "day") {
      days = [this._anchor()];
    } else if (this.type === "4day") {
      days = wCalendarDays(this._anchor(), wCalendarAddDays(this._anchor(), 3));
    } else {
      days = wCalendarDays(range.start, range.end, this.maxDays);
    }
    const allowed = this.weekdays;
    const filtered = days.filter((date) => allowed.includes(date.getDay()));
    return filtered.length ? filtered : days.slice(0, 1);
  }
  _dayColumnTemplate(date, events, firstMinute, category = "") {
    const iso = wCalendarIso(date);
    const intervals = Array.from({ length: this.intervalCount }, (_, index) => {
      const minutes = firstMinute + index * this.intervalMinutes;
      const scope = this._intervalScope(date, minutes, index);
      const customStyle = this._styleValue(typeof this.intervalStyle === "function" ? this.intervalStyle(scope) : "");
      const content = this._renderCallback(this.intervalContent, scope);
      return `<button
        class="w-calendar-interval${this.intervalHighlight ? " w-calendar-interval--highlight" : ""}"
        type="button"
        style="height:${this.intervalHeight}px;${customStyle}"
        data-interval="${iso} ${scope.time}"
        data-date="${iso}"
        data-time="${scope.time}"
        ${category ? `data-category="${this._esc(category)}"` : ""}
        aria-label="${this._esc(`${this._formatDateLabel(date)} ${this._formatTime(minutes)}`)}"
      >${content ? `<span class="w-calendar-interval-content">${content}</span>` : ""}</button>`;
    }).join("");
    const timed = events.filter((event) => event.timed && this._eventOnDate(event, date) && (!category || event.category === category));
    const layouts = this._eventLayouts(timed, firstMinute, date);
    const bodyContent = this._renderCallback(this.dayBodyContent, {
      ...this._dayScope(date),
      intervalRange: [firstMinute, firstMinute + this.intervalCount * this.intervalMinutes]
    });
    return `<div class="w-calendar-day-column" data-date-cell="${iso}">
      <div class="w-calendar-intervals">${intervals}</div>
      ${bodyContent ? `<div class="w-calendar-day-body-content">${bodyContent}</div>` : ""}
      <div class="w-calendar-timed-events">
        ${layouts.map(({ event, style }) => this._eventTemplate(event, iso, true, style)).join("")}
      </div>
    </div>`;
  }
  _categoryTemplate(range, events) {
    const days = wCalendarDays(range.start, range.end, this.categoryDays);
    const categories = this._parsedCategories(events);
    const firstMinute = this._firstMinute();
    const columns = [];
    days.forEach((date) => {
      categories.forEach((category) => columns.push({ date, category }));
    });
    const headers = columns.map(({ date, category }) => `<div class="w-calendar-category-header">
        ${days.length > 1 ? `<span>${this._esc(this._formatWeekday(date.getDay()))} ${this._esc(this._formatDay(date))}</span>` : ""}
        <strong>${this._renderCallback(this.categoryContent, { date: this._dayScope(date), category }, this._esc(this._categoryLabel(category)))}</strong>
      </div>`).join("");
    const labels = Array.from({ length: this.intervalCount }, (_, index) => `<div class="w-calendar-time-label" style="height:${this.intervalHeight}px">${this._esc(this._formatTime(firstMinute + index * this.intervalMinutes))}</div>`).join("");
    const allDay = columns.map(({ date, category }) => {
      const name = this._categoryValue(category);
      const dayEvents = events.filter((event) => !event.timed && event.category === name && this._eventOnDate(event, date));
      return `<div class="w-calendar-all-day-cell" data-category="${this._esc(name)}" data-date-cell="${wCalendarIso(date)}">
        ${dayEvents.map((event) => this._eventTemplate(event, wCalendarIso(date), false)).join("")}
      </div>`;
    }).join("");
    const bodies = columns.map(({ date, category }) => {
      const name = this._categoryValue(category);
      return `<div class="w-calendar-category-column" data-category="${this._esc(name)}" data-date="${wCalendarIso(date)}">
        ${this._dayColumnTemplate(date, events, firstMinute, name)}
      </div>`;
    }).join("");
    const highlight = this.getAttribute("interval-highlight");
    const highlightColor = highlight && !["true", "false"].includes(highlight) ? wCalendarColor(highlight, "selected") : "var(--w-selected)";
    return `<div
      class="w-calendar-schedule w-calendar-category"
      role="grid"
      style="--w-calendar-days:${Math.max(1, columns.length)};--w-calendar-interval-height:${this.intervalHeight}px;--w-calendar-interval-width:${this.intervalWidth}px;--w-calendar-event-height:${this.eventHeight}px;--w-calendar-event-gap:${this.eventMarginBottom}px;--w-calendar-interval-highlight:${highlightColor}"
    >
      <div class="w-calendar-schedule-head">
        <div class="w-calendar-gutter-head">${this._renderCallback(this.intervalHeaderContent, { days: days.map((date) => this._dayScope(date)), categories })}</div>
        <div class="w-calendar-category-headers">${headers}</div>
      </div>
      <div class="w-calendar-all-day">
        <div class="w-calendar-all-day-label">All day</div>
        <div class="w-calendar-all-day-cells">${allDay}</div>
      </div>
      <div class="w-calendar-schedule-scroll">
        <div class="w-calendar-time-axis">${labels}</div>
        <div class="w-calendar-category-columns">${bodies}</div>
      </div>
    </div>`;
  }
  _parsedCategories(events) {
    const categories = [...this.categories];
    const dynamic = events.map((event) => event.category).filter(Boolean);
    if (!this.categoryHideDynamic) {
      dynamic.forEach((category) => {
        if (!categories.some((item) => this._categoryValue(item) === category))
          categories.push(category);
      });
    }
    if (!events.length || this.categoryShowAll)
      return categories;
    return categories.filter((category) => dynamic.includes(this._categoryValue(category)));
  }
  _categoryValue(category) {
    if (typeof category === "string")
      return category;
    if (!category || typeof category !== "object")
      return this._attr("category-for-invalid", "");
    return String(category.categoryName ?? category.name ?? category.value ?? this._attr("category-for-invalid", ""));
  }
  _categoryLabel(category) {
    if (typeof this.categoryText === "function")
      return this.categoryText(category);
    if (typeof category === "string")
      return category;
    return String(category?.[this.categoryText] ?? category?.categoryName ?? this._categoryValue(category));
  }
  _parsedEvents() {
    return this.events.map((source, index) => {
      const startValue = source?.[this._attr("event-start", "start")];
      const endValue = source?.[this._attr("event-end", "end")] ?? startValue;
      const start = wCalendarDate(startValue);
      const parsedEnd = wCalendarDate(endValue, start);
      if (!start)
        return null;
      const end = parsedEnd && parsedEnd >= start ? parsedEnd : start;
      const timed = typeof this.eventTimed === "function" ? Boolean(this.eventTimed(source)) : source?.[this.eventTimed] != null ? Boolean(source[this.eventTimed]) : wCalendarHasTime(startValue) || wCalendarHasTime(endValue);
      const category = typeof this.eventCategory === "function" ? this.eventCategory(source) : source?.[this.eventCategory];
      const name = typeof this.eventName === "function" ? this.eventName(source, timed) : source?.[this.eventName] ?? "";
      const colorOption = typeof this.eventColor === "function" ? this.eventColor(source) : source?.[this.eventColor] ?? this.eventColor;
      const textColorOption = typeof this.eventTextColor === "function" ? this.eventTextColor(source) : source?.[this.eventTextColor] ?? this.eventTextColor;
      return {
        source,
        index,
        start,
        end,
        timed,
        category: category == null ? this._attr("category-for-invalid", "") : String(category),
        name: String(name),
        color: wCalendarColor(colorOption, "primary"),
        textColor: textColorOption ? wCalendarColor(textColorOption, "on-primary") : "var(--w-on-primary)"
      };
    }).filter(Boolean).sort((a, b) => a.start - b.start || a.end - b.end);
  }
  _eventOnDate(event, date) {
    const day = wCalendarDay(date);
    return day >= wCalendarDay(event.start) && day <= wCalendarDay(event.end);
  }
  _eventTemplate(event, date, timed, position = "", showTime = timed) {
    const time = showTime ? `${this._formatTime(wCalendarMinutes(event.start))} ` : "";
    const content = this._renderCallback(this.eventContent, {
      event: event.source,
      parsed: event,
      date,
      timed,
      time: showTime ? this._formatTime(wCalendarMinutes(event.start)) : ""
    }, this._esc(time + event.name));
    const classes = [
      "w-calendar-event",
      timed ? "w-calendar-event--timed" : "w-calendar-event--all-day",
      this.eventRipple ? "w-ripple" : ""
    ].filter(Boolean).join(" ");
    const style = `--w-calendar-event-color:${event.color};--w-calendar-event-text:${event.textColor};${position}`;
    return `<button
      class="${classes}"
      type="button"
      data-event-index="${event.index}"
      data-event-date="${date}"
      ${this.eventDraggable ? 'draggable="true"' : ""}
      style="${style}"
      title="${this._esc(event.name)}"
    >${content}</button>`;
  }
  _eventLayouts(events, firstMinute, date) {
    const visibleStart = firstMinute;
    const visibleEnd = firstMinute + this.intervalCount * this.intervalMinutes;
    const candidates = events.filter((event) => wCalendarMinutes(event.end) > visibleStart && wCalendarMinutes(event.start) < visibleEnd);
    let customVisuals = null;
    if (typeof this.eventOverlapMode === "function") {
      try {
        const handler = this.eventOverlapMode(candidates, this.firstDayOfWeek, this.eventOverlapThreshold);
        customVisuals = typeof handler === "function" ? handler(this._dayScope(date), candidates, true, true) : handler;
      } catch {
        customVisuals = null;
      }
    }
    return candidates.map((event) => {
      const start = Math.max(visibleStart, wCalendarMinutes(event.start));
      const end = Math.min(visibleEnd, wCalendarMinutes(event.end));
      const top = (start - visibleStart) / this.intervalMinutes * this.intervalHeight;
      const height = Math.max(this.eventHeight, (Math.max(end, start + 1) - start) / this.intervalMinutes * this.intervalHeight - this.eventMarginBottom);
      const overlaps = candidates.filter((candidate) => wCalendarMinutes(candidate.start) < wCalendarMinutes(event.end) + this.eventOverlapThreshold && wCalendarMinutes(candidate.end) > wCalendarMinutes(event.start) - this.eventOverlapThreshold);
      const rank = Math.max(0, overlaps.indexOf(event));
      let left = 0;
      let width = 100;
      const custom = Array.isArray(customVisuals) ? customVisuals.find((visual) => visual?.event === event || visual?.event?.index === event.index) : null;
      if (custom) {
        left = Number.isFinite(Number(custom.left)) ? Number(custom.left) : left;
        width = Number.isFinite(Number(custom.width)) ? Number(custom.width) : width;
      } else if (overlaps.length > 1 && this.eventOverlapMode === "column") {
        width = 100 / overlaps.length;
        left = rank * width;
      } else if (overlaps.length > 1) {
        left = rank * 4;
        width = 100 - left;
      }
      return {
        event,
        style: `top:${top}px;height:${height}px;left:${left}%;width:${width}%;z-index:${rank + 1};`
      };
    });
  }
  _firstMinute() {
    const value = this.firstTime;
    if (value && typeof value === "object") {
      const hour = Number(value.hour || 0);
      const minute = Number(value.minute || 0);
      if (Number.isFinite(hour) && Number.isFinite(minute)) {
        return Math.min(1440, Math.max(0, hour * 60 + minute));
      }
    }
    if (value != null && value !== "") {
      if (/^\d{1,2}:\d{2}$/.test(value)) {
        const [hour, minute] = value.split(":").map(Number);
        return Math.min(1440, Math.max(0, hour * 60 + minute));
      }
      const numeric = Number(value);
      if (Number.isFinite(numeric))
        return Math.min(1440, Math.max(0, numeric));
    }
    return this.firstInterval * this.intervalMinutes;
  }
  _intervalScope(date, minutes, index) {
    const normalized = (minutes % 1440 + 1440) % 1440;
    const hour = Math.floor(normalized / 60);
    const minute = normalized % 60;
    return {
      date: wCalendarIso(date),
      time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      hour,
      minute,
      index
    };
  }
  _formatTime(minutes) {
    const normalized = (minutes % 1440 + 1440) % 1440;
    const scope = this._intervalScope(this._anchor(), normalized, 0);
    if (typeof this.intervalFormat === "function")
      return this.intervalFormat(scope);
    const date = new Date(2000, 0, 1, scope.hour, scope.minute);
    return new Intl.DateTimeFormat(this.locale, {
      hour: this._attr("format", "") === "24hr" ? "2-digit" : "numeric",
      minute: !this.shortIntervals || scope.minute || this._attr("format", "") === "24hr" ? "2-digit" : undefined,
      hour12: this._attr("format", "") === "ampm" ? true : this._attr("format", "") === "24hr" ? false : undefined
    }).format(date);
  }
  _formatWeekday(weekday) {
    const date = new Date(2026, 5, 7 + weekday, 12);
    if (typeof this.weekdayFormat === "function")
      return this.weekdayFormat(this._dayScope(date), this.shortWeekdays);
    return new Intl.DateTimeFormat(this.locale, {
      weekday: this.shortWeekdays ? "short" : "long"
    }).format(date);
  }
  _formatDay(date) {
    if (typeof this.dayFormat === "function")
      return this.dayFormat(this._dayScope(date));
    return new Intl.DateTimeFormat(this.locale, { day: "numeric" }).format(date);
  }
  _formatMonth(date) {
    if (typeof this.monthFormat === "function")
      return this.monthFormat(this._dayScope(date), this.shortMonths);
    return new Intl.DateTimeFormat(this.locale, {
      month: this.shortMonths ? "short" : "long"
    }).format(date);
  }
  _formatDateLabel(date) {
    return new Intl.DateTimeFormat(this.locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(date);
  }
  _dayScope(date) {
    const iso = wCalendarIso(date);
    const today = wCalendarIso(this._now());
    return {
      date: iso,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      weekday: date.getDay(),
      present: iso === today,
      past: iso < today,
      future: iso > today
    };
  }
  _moreText(count) {
    const template = this._attr("event-more-text", "{count} more");
    return template.includes("{count}") ? template.replace(/\{count\}/g, String(count)) : `${count} ${template}`;
  }
  _dateDisabled(iso) {
    const min = this._attr("min", "");
    const max = this._attr("max", "");
    return Boolean(min && iso < min || max && iso > max);
  }
  _styleValue(value) {
    if (!value)
      return "";
    if (typeof value === "string")
      return value;
    if (typeof value !== "object")
      return "";
    return Object.entries(value).map(([name, entry]) => {
      const property = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      return `${property}:${String(entry)}`;
    }).join(";");
  }
  _renderCallback(renderer, scope, fallback = "") {
    if (typeof renderer !== "function")
      return fallback;
    try {
      const value = renderer(scope, this);
      return value == null ? fallback : String(value);
    } catch {
      return fallback;
    }
  }
  _events() {
    this.querySelectorAll("[data-calendar-nav]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const action = button.getAttribute("data-calendar-nav");
        if (action === "prev")
          this.prev();
        else if (action === "next")
          this.next();
        else
          this.today();
      });
    });
    this.querySelectorAll("[data-date]").forEach((button) => {
      button.addEventListener("click", (event) => {
        if (button.disabled)
          return;
        event.stopPropagation();
        this._selectDate(button.getAttribute("data-date"));
      });
      button.addEventListener("keydown", (event) => this._onDateKeydown(event, button));
    });
    this.querySelectorAll("[data-event-index]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const parsed = this._parsedEvents().find((item) => item.index === Number(button.getAttribute("data-event-index")));
        if (!parsed)
          return;
        this._emit("click", {
          kind: "event",
          date: button.getAttribute("data-event-date"),
          event: parsed.source
        });
      });
      if (this.eventDraggable) {
        button.addEventListener("dragstart", (event) => {
          this._dragEventIndex = Number(button.getAttribute("data-event-index"));
          button.classList.add("w-calendar-event--dragging");
          event.dataTransfer?.setData("text/plain", String(this._dragEventIndex));
          if (event.dataTransfer)
            event.dataTransfer.effectAllowed = "move";
        });
        button.addEventListener("dragend", () => {
          button.classList.remove("w-calendar-event--dragging");
          this._dragEventIndex = null;
        });
      }
    });
    this.querySelectorAll("[data-more-date]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const date = button.getAttribute("data-more-date");
        this._emit("click", {
          kind: "more",
          date,
          hidden: Number(button.getAttribute("data-hidden")),
          events: this._parsedEvents().filter((item) => this._eventOnDate(item, wCalendarDate(date)))
        });
      });
    });
    this.querySelectorAll("[data-interval]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        this._emit("click", {
          kind: button.hasAttribute("data-category") ? "timeCategory" : "time",
          date: button.getAttribute("data-date"),
          time: button.getAttribute("data-time"),
          category: button.getAttribute("data-category") || undefined
        });
      });
      if (this.eventDraggable) {
        button.addEventListener("dragover", (event) => {
          event.preventDefault();
          if (event.dataTransfer)
            event.dataTransfer.dropEffect = "move";
        });
        button.addEventListener("drop", (event) => {
          event.preventDefault();
          const raw = event.dataTransfer?.getData("text/plain");
          const transferred = raw ? Number(raw) : Number.NaN;
          const index = Number.isInteger(transferred) ? transferred : this._dragEventIndex;
          this._dropEvent(index, button);
        });
      }
    });
  }
  _dropEvent(index, target) {
    if (!Number.isInteger(index))
      return;
    const parsed = this._parsedEvents().find((event) => event.index === index);
    const date = target.getAttribute("data-date");
    const time = target.getAttribute("data-time");
    const start = wCalendarDate(`${date} ${time}`);
    if (!parsed || !start)
      return;
    const duration = Math.max(60000, parsed.end - parsed.start);
    const end = new Date(start.getTime() + duration);
    const startKey = this._attr("event-start", "start");
    const endKey = this._attr("event-end", "end");
    parsed.source[startKey] = this._dateTimeValue(start);
    parsed.source[endKey] = this._dateTimeValue(end);
    if (typeof this.eventTimed === "string")
      parsed.source[this.eventTimed] = true;
    const category = target.getAttribute("data-category");
    if (category && typeof this.eventCategory === "string")
      parsed.source[this.eventCategory] = category;
    if (this._eventsInput === undefined) {
      const events = this.events;
      events[index] = parsed.source;
      this._silentSet("events", JSON.stringify(events));
    }
    this._refresh();
    this._emit("change", {
      reason: "event-drop",
      value: this.value || wCalendarIso(this._anchor()),
      event: parsed.source,
      date,
      time,
      category: category || undefined,
      ...this._rangeDetail()
    });
  }
  _dateTimeValue(date) {
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${wCalendarIso(date)} ${hour}:${minute}`;
  }
  _onDateKeydown(event, button) {
    const date = wCalendarDate(button.getAttribute("data-date"));
    if (!date)
      return;
    let next = null;
    if (event.key === "ArrowLeft")
      next = wCalendarAddDays(date, -1);
    if (event.key === "ArrowRight")
      next = wCalendarAddDays(date, 1);
    if (event.key === "ArrowUp")
      next = wCalendarAddDays(date, -7);
    if (event.key === "ArrowDown")
      next = wCalendarAddDays(date, 7);
    if (event.key === "Home")
      next = wCalendarStartOfWeek(date, this.firstDayOfWeek);
    if (event.key === "End")
      next = wCalendarEndOfWeek(date, this.firstDayOfWeek);
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._selectDate(wCalendarIso(date));
      return;
    }
    if (!next)
      return;
    event.preventDefault();
    const target = this.querySelector(`[data-date="${wCalendarIso(next)}"]:not(:disabled)`);
    target?.focus();
  }
  _selectDate(value) {
    const date = wCalendarDate(value);
    if (!date || this._dateDisabled(value))
      return;
    const detail = { kind: "date", date: value, ...this._dayScope(date) };
    this._emit("click", detail);
    this._silentSet("value", value);
    if (this.hasAttribute("month"))
      this._silentSet("month", String(date.getMonth() + 1));
    if (this.hasAttribute("year"))
      this._silentSet("year", String(date.getFullYear()));
    this._refresh();
    this._emit("input", { value, ...detail });
    this._emit("change", { reason: "select", value, ...this._rangeDetail() });
  }
  _rangeDetail() {
    const range = this._range();
    return { start: wCalendarIso(range.start), end: wCalendarIso(range.end), type: this.type };
  }
  _refresh() {
    if (!this._rendered)
      return;
    this._render();
    this._events();
    this._applyCommonProps();
  }
  move(amount = 1) {
    const step = Number(amount) || 0;
    if (!step)
      return;
    let next;
    if (this.type === "month")
      next = wCalendarAddMonths(this._anchor(), step);
    else if (this.type === "week")
      next = wCalendarAddDays(this._anchor(), step * 7);
    else if (this.type === "4day")
      next = wCalendarAddDays(this._anchor(), step * 4);
    else if (this.type === "category")
      next = wCalendarAddDays(this._anchor(), step * this.categoryDays);
    else
      next = wCalendarAddDays(this._anchor(), step);
    this._moveTo(next, "move");
  }
  next(amount = 1) {
    this.move(Math.abs(Number(amount) || 1));
  }
  prev(amount = 1) {
    this.move(-Math.abs(Number(amount) || 1));
  }
  today() {
    this._moveTo(this._now(), "today");
  }
  _moveTo(date, reason) {
    const value = wCalendarIso(date);
    this._silentSet("value", value);
    if (this.hasAttribute("month"))
      this._silentSet("month", String(date.getMonth() + 1));
    if (this.hasAttribute("year"))
      this._silentSet("year", String(date.getFullYear()));
    this._refresh();
    const detail = { reason, value, ...this._rangeDetail() };
    this._emit("change", detail);
    this._emit("moved", detail);
  }
  checkChange() {
    const detail = { reason: "check", value: wCalendarIso(this._anchor()), ...this._rangeDetail() };
    this._emit("change", detail);
    return detail;
  }
  updateTimes() {
    this._refresh();
    return this.times;
  }
  minutesToPixels(minutes) {
    const value = Number(minutes);
    return Number.isFinite(value) ? value / this.intervalMinutes * this.intervalHeight : false;
  }
  timeDelta(value) {
    const minutes = this._timeMinutes(value);
    if (minutes === false)
      return false;
    return (minutes - this._firstMinute()) / (this.intervalCount * this.intervalMinutes);
  }
  timeToY(value, clamp = false) {
    const delta = this.timeDelta(value);
    if (delta === false)
      return false;
    const height = this.intervalCount * this.intervalHeight;
    const y = delta * height;
    return clamp ? Math.min(height, Math.max(0, y)) : y;
  }
  _timeMinutes(value) {
    if (value instanceof Date)
      return wCalendarMinutes(value);
    if (value && typeof value === "object") {
      const hour = Number(value.hour || 0);
      const minute = Number(value.minute || 0);
      return Number.isFinite(hour) && Number.isFinite(minute) ? hour * 60 + minute : false;
    }
    if (/^\d{1,2}:\d{2}$/.test(String(value || ""))) {
      const [hour, minute] = String(value).split(":").map(Number);
      return hour * 60 + minute;
    }
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : false;
  }
  scrollToTime(value) {
    const minutes = this._timeMinutes(value);
    const scroll = this._q(".w-calendar-schedule-scroll");
    if (!scroll || minutes === false)
      return false;
    scroll.scrollTop = Math.max(0, this.timeToY(minutes));
    return true;
  }
  getVisibleRange() {
    return this._rangeDetail();
  }
}
if (!customElements.get("w-calendar"))
  customElements.define("w-calendar", WCalendar);

// src/components/carousel.js
class WCarousel extends WElement {
  static attrs = [
    "value",
    "cycle",
    "interval",
    "height",
    "hide-delimiters",
    "progress",
    "show-arrows",
    "continuous",
    "prev-icon",
    "next-icon",
    "delimiter-icon",
    "hide-delimiter-background",
    "vertical-delimiters",
    "color",
    "touch",
    "transition"
  ];
  get value() {
    return parseInt(wValue(this, "0"), 10) || 0;
  }
  get cycle() {
    return wBoolAttr(this, "cycle");
  }
  get interval() {
    return Math.max(250, wNumberAttr(this, "interval", 6000));
  }
  get height() {
    return this._attr("height", "");
  }
  get hideDelimiters() {
    return wBoolAttr(this, "hide-delimiters");
  }
  get progress() {
    return wBoolAttr(this, "progress");
  }
  get showArrows() {
    return wBoolAttr(this, "show-arrows", true);
  }
  get arrowsHover() {
    return this.getAttribute("show-arrows") === "hover";
  }
  get continuous() {
    return wBoolAttr(this, "continuous", true);
  }
  get prevIcon() {
    return this._attr("prev-icon", "‹");
  }
  get nextIcon() {
    return this._attr("next-icon", "›");
  }
  get delimiterIcon() {
    return this._attr("delimiter-icon", "");
  }
  get hideDelimiterBackground() {
    return wBoolAttr(this, "hide-delimiter-background");
  }
  get verticalDelimiters() {
    return this._attr("vertical-delimiters", "");
  }
  get color() {
    return this._attr("color", "");
  }
  get touch() {
    return wBoolAttr(this, "touch", true);
  }
  get transition() {
    return this._attr("transition", "slide");
  }
  get _fade() {
    return this.transition === "fade";
  }
  _applyCommonProps() {
    super._applyCommonProps();
    [...this.classList].forEach((cls) => {
      if (cls.startsWith("w-color-"))
        this.classList.remove(cls);
    });
  }
  _template() {
    const count = this._itemCount();
    const value = this._normalizedValue(count);
    const fade = this._fade;
    const classes = ["w-carousel"];
    if (fade)
      classes.push("w-carousel--fade");
    if (this.arrowsHover)
      classes.push("w-carousel--arrows-hover");
    if (this.verticalDelimiters === "left")
      classes.push("w-carousel--vdelim-left");
    else if (this.verticalDelimiters === "right")
      classes.push("w-carousel--vdelim-right");
    if (this.hideDelimiterBackground)
      classes.push("w-carousel--no-delim-bg");
    const styles = [];
    if (this.height)
      styles.push(`height:${this._esc(this.height)}`);
    if (this.color)
      styles.push(`--w-carousel-color:var(--w-${this._esc(this.color)})`);
    const style = styles.length ? ` style="${styles.join(";")}"` : "";
    const prevDisabled = !this.continuous && value <= 0 ? " disabled" : "";
    const nextDisabled = !this.continuous && value >= count - 1 ? " disabled" : "";
    const arrows = this.showArrows && count > 1 ? `
      <button class="w-carousel-control prev" type="button" aria-label="Previous slide" data-carousel-step="-1"${prevDisabled}>${this._esc(this.prevIcon)}</button>
      <button class="w-carousel-control next" type="button" aria-label="Next slide" data-carousel-step="1"${nextDisabled}>${this._esc(this.nextIcon)}</button>` : "";
    const dIcon = this.delimiterIcon;
    const dIconClass = dIcon ? " w-carousel-delimiter--icon" : "";
    const dIconText = dIcon ? this._esc(dIcon) : "";
    const controls = this.hideDelimiters || count <= 1 ? "" : `
      <div class="w-carousel-delimiters" role="tablist" aria-label="Carousel slides">
        ${Array.from({ length: count }, (_, index) => `<button class="w-carousel-delimiter${dIconClass}${index === value ? " active" : ""}" type="button" role="tab" aria-selected="${index === value}" aria-label="Show slide ${index + 1}" data-carousel-index="${index}">${dIconText}</button>`).join("")}
      </div>`;
    const progress = this.progress && count > 1 ? `<div class="w-carousel-progress" aria-hidden="true"><span style="width:${(value + 1) / count * 100}%"></span></div>` : "";
    const transform = fade ? "" : ` style="transform:translateX(-${value * 100}%)"`;
    return `<div class="${classes.join(" ")}" tabindex="0" aria-roledescription="carousel"${style}>
      <div class="w-carousel-track"${transform}><slot></slot></div>
      ${arrows}
      ${controls}
      ${progress}
    </div>`;
  }
  _events() {
    this._clearCycle();
    this._syncCarousel();
    requestAnimationFrame(() => this._syncCarousel());
    this.querySelectorAll("[data-carousel-step]").forEach((button) => button.addEventListener("click", () => {
      this._step(Number(button.getAttribute("data-carousel-step")));
    }));
    this.querySelectorAll("[data-carousel-index]").forEach((button) => button.addEventListener("click", () => {
      this._setValue(Number(button.getAttribute("data-carousel-index")));
    }));
    const root = this._q(".w-carousel");
    root?.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        this._step(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        this._step(1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        this._setValue(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        this._setValue(this._itemCount() - 1);
      }
    });
    if (root && this.touch) {
      let startX = 0, startY = 0, dragging = false;
      root.addEventListener("pointerdown", (event) => {
        if (event.target.closest(".w-carousel-control, .w-carousel-delimiter"))
          return;
        if (event.pointerType === "mouse" && event.button !== 0)
          return;
        startX = event.clientX;
        startY = event.clientY;
        dragging = true;
        this._clearCycle();
      });
      root.addEventListener("pointerup", (event) => {
        if (!dragging)
          return;
        dragging = false;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy))
          this._step(dx < 0 ? 1 : -1);
        else
          this._startCycle();
      });
      root.addEventListener("pointercancel", () => {
        dragging = false;
        this._startCycle();
      });
    }
    this.addEventListener("mouseenter", () => this._clearCycle());
    this.addEventListener("mouseleave", () => this._startCycle());
    this.addEventListener("focusin", () => this._clearCycle());
    this.addEventListener("focusout", () => this._startCycle());
    this._startCycle();
  }
  disconnectedCallback() {
    this._clearCycle();
  }
  _itemCount() {
    return this.querySelectorAll("w-carousel-item").length;
  }
  _normalizedValue(count = this._itemCount()) {
    if (!count)
      return 0;
    return Math.max(0, Math.min(this.value, count - 1));
  }
  _step(delta) {
    const count = this._itemCount();
    if (!count)
      return;
    let next = this.value + delta;
    if (this.continuous)
      next = (next + count) % count;
    else
      next = Math.max(0, Math.min(next, count - 1));
    this._setValue(next);
  }
  _setValue(value) {
    const count = this._itemCount();
    const next = this._normalizedValue.call({ value }, count);
    const current = this._normalizedValue(count);
    if (next === current)
      return;
    this._silentSet("value", next);
    this._syncCarousel();
    this._emit("change", { value: next });
    this._restartCycle();
  }
  _syncCarousel() {
    const count = this._itemCount();
    const value = this._normalizedValue(count);
    const track = this._q(".w-carousel-track");
    if (track && !this._fade)
      track.style.transform = `translateX(-${value * 100}%)`;
    this.querySelectorAll("w-carousel-item").forEach((item, index) => {
      const active = index === value;
      item.classList.toggle("active", active);
      item.querySelector(".w-carousel-item")?.classList.toggle("active", active);
      item.setAttribute("aria-hidden", String(!active));
    });
    this.querySelectorAll("[data-carousel-index]").forEach((button) => {
      const active = Number(button.getAttribute("data-carousel-index")) === value;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    const progress = this._q(".w-carousel-progress span");
    if (progress && count)
      progress.style.width = `${(value + 1) / count * 100}%`;
    const prev = this._q(".w-carousel-control.prev");
    const next = this._q(".w-carousel-control.next");
    if (prev)
      prev.disabled = !this.continuous && value <= 0;
    if (next)
      next.disabled = !this.continuous && value >= count - 1;
  }
  _startCycle() {
    if (!this.cycle || this._itemCount() <= 1)
      return;
    this._cycleTimer = setTimeout(() => this._step(1), this.interval);
  }
  _clearCycle() {
    if (this._cycleTimer)
      clearTimeout(this._cycleTimer);
    this._cycleTimer = 0;
  }
  _restartCycle() {
    this._clearCycle();
    this._startCycle();
  }
}
if (!customElements.get("w-carousel"))
  customElements.define("w-carousel", WCarousel);

// src/components/carousel-item.js
class WCarouselItem extends WElement {
  static attrs = ["src", "alt", "cover"];
  get src() {
    return this._attr("src", "");
  }
  get alt() {
    return this._attr("alt", "");
  }
  get cover() {
    return wBoolAttr(this, "cover", true);
  }
  _template() {
    const image = this.src ? `<img class="w-carousel-img${this.cover ? " w-carousel-img--cover" : ""}" src="${this._esc(this.src)}" alt="${this._esc(this.alt)}">` : "";
    return `<div class="w-carousel-item">${image}<slot></slot></div>`;
  }
}
if (!customElements.get("w-carousel-item"))
  customElements.define("w-carousel-item", WCarouselItem);

// src/components/chip-group.js
class WChipGroup extends WElement {
  static attrs = ["value", "multiple", "mandatory", "max", "disabled", "selected-class", "column", "filter", "variant", "color"];
  get value() {
    return this._attr("value", "");
  }
  get multiple() {
    return this._bool("multiple");
  }
  get mandatory() {
    return this._bool("mandatory");
  }
  get max() {
    return Math.max(0, parseInt(this._attr("max", "0"), 10) || 0);
  }
  get disabled() {
    return this._bool("disabled");
  }
  get column() {
    return this._bool("column");
  }
  get filter() {
    return this._bool("filter");
  }
  get variant() {
    return this._attr("variant", "");
  }
  get color() {
    return this._attr("color", "");
  }
  get selectedClass() {
    return this._attr("selected-class", "selected");
  }
  _template() {
    const cls = ["w-chip-group"];
    if (this.column)
      cls.push("w-chip-group--column");
    if (this.filter)
      cls.push("w-chip-group--filter");
    return `<div class="${cls.join(" ")}" role="group" aria-disabled="${this.disabled ? "true" : "false"}"><slot></slot></div>`;
  }
  _events() {
    this._decorate();
    this._syncChildren();
    const schedule = typeof queueMicrotask === "function" ? queueMicrotask : (callback) => Promise.resolve().then(callback);
    schedule(() => this.isConnected && this._syncChildren());
    if (this.__wChipGroupChange)
      return;
    this.__wChipGroupChange = (event) => {
      const chip = event.target?.closest?.("w-chip");
      if (!chip || !this.contains(chip) || chip.hasAttribute("disabled") || this.disabled)
        return;
      event.stopImmediatePropagation();
      this._selectChip(chip, event.detail?.selected !== false);
    };
    this.addEventListener("change", this.__wChipGroupChange);
  }
  _decorate() {
    this._chips().forEach((chip) => {
      if (this.variant && !chip.hasAttribute("variant"))
        chip.setAttribute("variant", this.variant);
      if (this.color && !chip.hasAttribute("color"))
        chip.setAttribute("color", this.color);
    });
  }
  _selectChip(chip, selected) {
    const chipValue = this._chipValue(chip);
    if (!chipValue)
      return;
    if (this.multiple) {
      const values = new Set(this._values());
      if (selected) {
        if (this.max && values.size >= this.max)
          return;
        values.add(chipValue);
      } else if (!this.mandatory || values.size > 1) {
        values.delete(chipValue);
      }
      this._commit(Array.from(values));
      return;
    }
    if (!selected && this.mandatory) {
      this._commit([chipValue]);
      return;
    }
    this._commit(selected ? [chipValue] : []);
  }
  _commit(values) {
    const next = this.multiple ? values.join(",") : values[0] || "";
    this._silentSet("value", next || null);
    this._syncChildren(values);
    this._emit("change", { value: this.multiple ? values : next });
  }
  _syncChildren(values = this._values()) {
    const selected = new Set(values);
    this._chips().forEach((chip) => {
      const isSelected = selected.has(this._chipValue(chip));
      chip._silentSet?.("selected", isSelected ? "" : null);
      chip.querySelector(".w-chip")?.classList.toggle(this.selectedClass, isSelected);
      chip.querySelector(".w-chip")?.classList.toggle("w-chip--selected", isSelected);
      chip.querySelector(".w-chip")?.setAttribute("aria-pressed", isSelected ? "true" : "false");
      if (this.disabled)
        chip.setAttribute("disabled", "");
    });
  }
  _values() {
    return String(this.value || "").split(",").map((value) => value.trim()).filter(Boolean);
  }
  _chips() {
    return Array.from(this.querySelectorAll("w-chip"));
  }
  _chipValue(chip) {
    return chip.getAttribute("value") || chip.textContent.trim();
  }
}
if (!customElements.get("w-chip-group"))
  customElements.define("w-chip-group", WChipGroup);

// src/components/code.js
class WCode extends WElement {
  _template() {
    return `<code class="w-code"><slot></slot></code>`;
  }
}
if (!customElements.get("w-code"))
  customElements.define("w-code", WCode);

// src/components/color-input.js
class WColorInput extends WElement {
  static attrs = ["value", "label", "swatches", "show-swatches", "mode", "disabled"];
  get value() {
    return this._attr("value", "#6750a4");
  }
  get label() {
    return this._attr("label", "Color");
  }
  get mode() {
    return this._attr("mode", "hex");
  }
  get disabled() {
    return this._bool("disabled");
  }
  _swatches() {
    return wValueList(this.getAttribute("swatches"));
  }
  get _showSwatches() {
    return this.hasAttribute("show-swatches") || this._swatches().length > 0;
  }
  _template() {
    const hex = this.value;
    const dis = this.disabled ? " disabled" : "";
    const swatches = this._showSwatches && this._swatches().length ? `<span class="w-color-input-swatches" role="group" aria-label="Color swatches">${this._swatchButtons(hex, dis)}</span>` : "";
    return `<label class="w-field w-color-input">
      <span class="w-label">${this._esc(this.label)}</span>
      <span><input type="color" value="${this._esc(hex)}"${dis}><input class="w-input" value="${this._esc(this._format(hex))}"${dis}></span>
      ${swatches}
    </label>`;
  }
  _swatchButtons(hex, dis) {
    return this._swatches().map((c) => `<button type="button" class="w-color-swatch${c.toLowerCase() === hex.toLowerCase() ? " selected" : ""}" style="--w-color:${this._esc(c)}" data-color="${this._esc(c)}" aria-label="${this._esc(c)}"${dis}></button>`).join("");
  }
  _events() {
    const color = this.querySelector('input[type="color"]');
    const text = this.querySelector(".w-input");
    const sync = (hex) => {
      if (!hex)
        return;
      if (color)
        color.value = hex;
      if (text)
        text.value = this._format(hex);
      this._silentSet("value", hex);
      this.querySelectorAll(".w-color-swatch").forEach((b) => b.classList.toggle("selected", b.getAttribute("data-color").toLowerCase() === hex.toLowerCase()));
      this._emit("change", { value: this._format(hex) });
    };
    color?.addEventListener("input", (event) => {
      event.stopPropagation();
      sync(color.value);
    });
    text?.addEventListener("change", (event) => {
      event.stopPropagation();
      sync(this._toHex(text.value));
    });
    this.querySelectorAll(".w-color-swatch").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!this.disabled)
          sync(btn.getAttribute("data-color"));
      });
    });
  }
  _format(hex) {
    const mode = this.mode;
    if (mode !== "rgb" && mode !== "hsl")
      return hex;
    const h = String(hex).replace("#", "");
    if (h.length < 6)
      return hex;
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    if (mode === "rgb")
      return `rgb(${r}, ${g}, ${b})`;
    const [hh, ss, ll] = this._rgbToHsl(r, g, b);
    return `hsl(${hh}, ${ss}%, ${ll}%)`;
  }
  _rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r)
        h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g)
        h = (b - r) / d + 2;
      else
        h = (r - g) / d + 4;
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }
  _toHex(input) {
    if (!input)
      return "";
    try {
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.fillStyle = "#000000";
      ctx.fillStyle = String(input).trim();
      return ctx.fillStyle.startsWith("#") ? ctx.fillStyle : this.value;
    } catch (_) {
      return this.value;
    }
  }
}
if (!customElements.get("w-color-input"))
  customElements.define("w-color-input", WColorInput);

// src/components/color-picker.js
var HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
function clamp01(value) {
  return wClamp(Number(value), 0, 1);
}
function normalizeHex(value, fallback = "#6750a4") {
  const text = String(value || "").trim();
  const match = text.match(HEX_RE);
  if (!match)
    return fallback;
  let hex = match[1].toLowerCase();
  if (hex.length === 3)
    hex = hex.split("").map((char) => char + char).join("");
  return `#${hex}`;
}
function hexToRgba(value) {
  const hex = normalizeHex(value).slice(1);
  const rgb = hex.slice(0, 6);
  const alpha = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
  return {
    r: parseInt(rgb.slice(0, 2), 16),
    g: parseInt(rgb.slice(2, 4), 16),
    b: parseInt(rgb.slice(4, 6), 16),
    a: alpha
  };
}
function toHexPart(value) {
  return Math.round(wClamp(value, 0, 255)).toString(16).padStart(2, "0");
}
function rgbaToHex({ r, g, b, a = 1 }, includeAlpha = false) {
  const hex = `#${toHexPart(r)}${toHexPart(g)}${toHexPart(b)}`;
  return includeAlpha && a < 1 ? `${hex}${toHexPart(a * 255)}` : hex;
}
function rgbToHsv({ r, g, b }) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;
  let h = 0;
  if (delta) {
    if (max === rr)
      h = 60 * ((gg - bb) / delta % 6);
    else if (max === gg)
      h = 60 * ((bb - rr) / delta + 2);
    else
      h = 60 * ((rr - gg) / delta + 4);
  }
  if (h < 0)
    h += 360;
  return { h, s: max === 0 ? 0 : delta / max, v: max };
}
function hsvToRgb({ h, s, v }) {
  const hue = (Number(h) % 360 + 360) % 360;
  const chroma = v * s;
  const x = chroma * (1 - Math.abs(hue / 60 % 2 - 1));
  const m = v - chroma;
  let rr = 0;
  let gg = 0;
  let bb = 0;
  if (hue < 60)
    [rr, gg, bb] = [chroma, x, 0];
  else if (hue < 120)
    [rr, gg, bb] = [x, chroma, 0];
  else if (hue < 180)
    [rr, gg, bb] = [0, chroma, x];
  else if (hue < 240)
    [rr, gg, bb] = [0, x, chroma];
  else if (hue < 300)
    [rr, gg, bb] = [x, 0, chroma];
  else
    [rr, gg, bb] = [chroma, 0, x];
  return {
    r: (rr + m) * 255,
    g: (gg + m) * 255,
    b: (bb + m) * 255
  };
}

class WColorPicker extends WElement {
  static attrs = ["value", "swatches", "show-swatches", "hide-canvas", "show-alpha", "alpha", "disabled"];
  get value() {
    return normalizeHex(this._attr("value", "#6750a4"));
  }
  get hideCanvas() {
    return this._bool("hide-canvas");
  }
  get showAlpha() {
    return this._bool("show-alpha");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get alpha() {
    if (this.hasAttribute("alpha")) {
      const fromAttr = Number(this.getAttribute("alpha"));
      if (Number.isFinite(fromAttr))
        return clamp01(fromAttr);
    }
    return hexToRgba(this.value).a;
  }
  _swatches() {
    return wValueList(this.getAttribute("swatches")).map((color) => normalizeHex(color, "")).filter(Boolean);
  }
  get _showSwatches() {
    return this.hasAttribute("show-swatches") || this._swatches().length > 0;
  }
  _state() {
    const rgba = hexToRgba(this.value);
    const hsv = rgbToHsv(rgba);
    const alpha = this.alpha;
    const rgb = hsvToRgb(hsv);
    return {
      ...hsv,
      a: alpha,
      rgb,
      hex: rgbaToHex({ ...rgb, a: alpha }, this.showAlpha),
      solidHex: rgbaToHex({ ...rgb, a: 1 }),
      alphaCss: `rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${alpha.toFixed(3)})`
    };
  }
  _template() {
    const state = this._state();
    const dis = this.disabled ? " disabled" : "";
    const style = [
      `--w-color-picker-hue:${Math.round(state.h)}`,
      `--w-color-picker-hue-color:hsl(${Math.round(state.h)} 100% 50%)`,
      `--w-color-picker-current:${state.solidHex}`,
      `--w-color-picker-preview:${state.alphaCss}`
    ].join(";");
    const swatches = this._showSwatches && this._swatches().length ? `<div class="w-color-picker-swatches" role="group" aria-label="Color swatches">${this._swatches().map((color) => `<button type="button" class="w-color-swatch${color.toLowerCase() === state.solidHex.toLowerCase() ? " selected" : ""}" style="--w-color:${this._esc(color)}" data-color="${this._esc(color)}" aria-label="${this._esc(color)}"${dis}></button>`).join("")}</div>` : "";
    const canvas = this.hideCanvas ? "" : `<div class="w-color-picker-canvas" role="slider" tabindex="${this.disabled ? "-1" : "0"}" aria-label="Saturation and brightness" aria-valuetext="${Math.round(state.s * 100)}% saturation, ${Math.round(state.v * 100)}% brightness" data-color-canvas>
        <span class="w-color-picker-canvas-thumb" style="left:${state.s * 100}%;top:${(1 - state.v) * 100}%"></span>
      </div>
      <div class="w-color-picker-slider w-color-picker-hue" role="slider" tabindex="${this.disabled ? "-1" : "0"}" aria-label="Hue" aria-valuemin="0" aria-valuemax="360" aria-valuenow="${Math.round(state.h)}" data-color-hue>
        <span class="w-color-picker-slider-thumb" style="left:${state.h / 360 * 100}%"></span>
      </div>
      ${this.showAlpha ? `<div class="w-color-picker-slider w-color-picker-alpha" role="slider" tabindex="${this.disabled ? "-1" : "0"}" aria-label="Alpha" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(state.a * 100)}" data-color-alpha>
        <span class="w-color-picker-slider-thumb" style="left:${state.a * 100}%"></span>
      </div>` : ""}`;
    return `<div class="w-color-picker${this.hideCanvas ? " w-color-picker--swatches-only" : ""}" style="${this._esc(style)}">
      <div class="w-color-picker-preview-row">
        <span class="w-color-preview" style="background:${this._esc(state.alphaCss)}"></span>
        <label class="w-color-picker-edit">
          <span class="w-sr-only">Hex color</span>
          <input class="w-color-picker-input" type="text" spellcheck="false" value="${this._esc(state.hex)}"${dis}>
        </label>
      </div>
      ${this.hideCanvas ? `<code class="w-color-picker-value">${this._esc(state.hex)}</code>` : ""}
      ${canvas}
      ${swatches}
    </div>`;
  }
  _events() {
    const state = () => this._state();
    const commit = (next, emit = true) => {
      const alpha2 = next.a ?? state().a;
      const rgb = hsvToRgb(next);
      const value = rgbaToHex({ ...rgb, a: alpha2 }, this.showAlpha);
      this._silentSet("value", value);
      if (this.showAlpha)
        this._silentSet("alpha", alpha2.toFixed(3).replace(/0+$/, "").replace(/\.$/, ""));
      this._render();
      this._events();
      if (emit)
        this._emit("change", this.showAlpha ? { value, alpha: alpha2 } : { value });
    };
    const trackPointer = (target, handler) => {
      target.addEventListener("pointerdown", (event) => {
        if (this.disabled)
          return;
        event.preventDefault();
        target.setPointerCapture?.(event.pointerId);
        const move = (nextEvent) => handler(nextEvent);
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
        };
        handler(event);
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up, { once: true });
      });
    };
    const canvas = this._q("[data-color-canvas]");
    if (canvas) {
      const setCanvas = (event) => {
        const rect = canvas.getBoundingClientRect();
        const s = wClamp((event.clientX - rect.left) / rect.width, 0, 1);
        const v = 1 - wClamp((event.clientY - rect.top) / rect.height, 0, 1);
        commit({ ...state(), s, v });
      };
      trackPointer(canvas, setCanvas);
      canvas.addEventListener("keydown", (event) => this._onCanvasKey(event, commit));
    }
    const hue = this._q("[data-color-hue]");
    if (hue) {
      trackPointer(hue, (event) => {
        const rect = hue.getBoundingClientRect();
        commit({ ...state(), h: wClamp((event.clientX - rect.left) / rect.width, 0, 1) * 360 });
      });
      hue.addEventListener("keydown", (event) => this._onLinearKey(event, "h", 360, commit));
    }
    const alpha = this._q("[data-color-alpha]");
    if (alpha) {
      trackPointer(alpha, (event) => {
        const rect = alpha.getBoundingClientRect();
        commit({ ...state(), a: wClamp((event.clientX - rect.left) / rect.width, 0, 1) });
      });
      alpha.addEventListener("keydown", (event) => this._onLinearKey(event, "a", 1, commit));
    }
    this._q(".w-color-picker-input")?.addEventListener("change", (event) => {
      event.stopPropagation();
      if (this.disabled)
        return;
      const value = normalizeHex(event.target.value, this.value);
      const rgba = hexToRgba(value);
      commit({ ...rgbToHsv(rgba), a: rgba.a });
    });
    this._qAll(".w-color-swatch").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (this.disabled)
          return;
        const rgba = hexToRgba(btn.getAttribute("data-color"));
        commit({ ...rgbToHsv(rgba), a: this.alpha });
      });
    });
  }
  _onCanvasKey(event, commit) {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (!keys.includes(event.key))
      return;
    event.preventDefault();
    const state = this._state();
    const step = event.shiftKey ? 0.1 : 0.02;
    if (event.key === "ArrowLeft")
      state.s = wClamp(state.s - step, 0, 1);
    if (event.key === "ArrowRight")
      state.s = wClamp(state.s + step, 0, 1);
    if (event.key === "ArrowUp")
      state.v = wClamp(state.v + step, 0, 1);
    if (event.key === "ArrowDown")
      state.v = wClamp(state.v - step, 0, 1);
    commit(state);
  }
  _onLinearKey(event, key, scale, commit) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
      return;
    event.preventDefault();
    const state = this._state();
    const step = event.shiftKey ? 0.1 : 0.02;
    if (event.key === "Home")
      state[key] = 0;
    if (event.key === "End")
      state[key] = scale;
    if (event.key === "ArrowLeft")
      state[key] = wClamp(state[key] - step * scale, 0, scale);
    if (event.key === "ArrowRight")
      state[key] = wClamp(state[key] + step * scale, 0, scale);
    commit(state);
  }
}
if (!customElements.get("w-color-picker"))
  customElements.define("w-color-picker", WColorPicker);

// src/components/combobox.js
class WCombobox extends WAutocomplete {
  static attrs = ["delimiters"];
  get _isCombobox() {
    return true;
  }
  get delimiters() {
    return Array.from(this._attr("delimiters", ""));
  }
  _events() {
    super._events();
    const input = this._q(".w-autocomplete-input");
    if (!input)
      return;
    const delimiters = this.delimiters;
    if (delimiters.length) {
      input.addEventListener("input", () => {
        const hit = delimiters.find((d) => input.value.includes(d));
        if (!hit)
          return;
        const text = input.value.split(hit)[0].trim();
        input.value = "";
        if (text)
          this._commitFreeText(text);
      });
    }
    input.addEventListener("blur", () => {
      const text = input.value.trim();
      if (!text || this._hasValue(text))
        return;
      if (this._parseItems().some((it) => it.value === text || it.title === text))
        return;
      this._commitFreeText(text);
    });
  }
}
if (!customElements.get("w-combobox")) {
  customElements.define("w-combobox", WCombobox);
}

// src/components/confirm-edit.js
class WConfirmEdit extends WElement {
  static attrs = ["value", "label", "placeholder", "cancel-text", "ok-text", "save-text", "disabled", "hide-actions"];
  get value() {
    return this._attr("value", "");
  }
  set value(v) {
    this.setAttribute("value", v == null ? "" : String(v));
  }
  get label() {
    return this._attr("label", "Editable value");
  }
  get placeholder() {
    return this._attr("placeholder", "");
  }
  get cancelText() {
    return this._attr("cancel-text", "Cancel");
  }
  get okText() {
    return this._attr("save-text", "") || this._attr("ok-text", "Save");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get hideActions() {
    return this._bool("hide-actions");
  }
  get _useBuiltIn() {
    if (this._builtInCached === undefined) {
      this._builtInCached = !Array.from(this.children).some((el) => !el.hasAttribute("slot") && el.tagName.toLowerCase() !== "slot");
    }
    return this._builtInCached;
  }
  get _customActions() {
    if (this._actionsCached === undefined) {
      this._actionsCached = !!this.querySelector('[slot="actions"]');
    }
    return this._actionsCached;
  }
  _template() {
    const dis = this.disabled ? " disabled" : "";
    const body = this._useBuiltIn ? `<label class="w-field"><span class="w-label">${this._esc(this.label)}</span>` + `<input class="w-input" data-confirm-field value="${this._esc(this.value)}"` + `${this.placeholder ? ` placeholder="${this._esc(this.placeholder)}"` : ""}${dis}></label>` : `<slot></slot>`;
    let actions = "";
    if (this._customActions) {
      actions = `<div class="w-confirm-edit-actions"><slot name="actions"></slot></div>`;
    } else if (!this.hideActions) {
      actions = `<div class="w-confirm-edit-actions">` + `<button class="w-btn w-btn-text" type="button" data-cancel${dis}>${this._esc(this.cancelText)}</button>` + `<button class="w-btn w-btn-filled" type="button" data-save disabled>${this._esc(this.okText)}</button>` + `</div>`;
    }
    return `<div class="w-confirm-edit">
      <div class="w-confirm-edit-body">${body}</div>
      ${actions}
    </div>`;
  }
  _events() {
    this._original = this.value;
    if (this.hasAttribute("value"))
      this._setVal(this.value);
    this._syncDirty();
    this.addEventListener("input", () => this._syncDirty());
    this.addEventListener("click", (event) => {
      if (event.target.closest("[data-save]")) {
        event.preventDefault();
        this.save();
      } else if (event.target.closest("[data-cancel]")) {
        event.preventDefault();
        this.cancel();
      }
    });
    this.addEventListener("change", (event) => {
      if (event.target.closest("[data-save],[data-cancel]"))
        return;
      event.stopPropagation();
    });
  }
  _editor() {
    return this.querySelector("[data-confirm-field]") || this.querySelector("w-text-field, w-input, w-textarea, w-select, w-number-input, w-autocomplete, w-combobox") || this.querySelector("input, textarea, select");
  }
  _getVal() {
    const el = this._editor();
    return el ? el.value ?? "" : "";
  }
  _setVal(v) {
    const el = this._editor();
    if (el)
      el.value = v;
  }
  get pristine() {
    return this._getVal() === this._original;
  }
  _syncDirty() {
    const dirty = !this.pristine;
    const save = this.querySelector("[data-save]");
    if (save)
      save.disabled = this.disabled || !dirty;
    this.classList.toggle("dirty", dirty);
  }
  save() {
    if (this.disabled)
      return;
    this._original = this._getVal();
    this._silentSet("value", this._original);
    this._syncDirty();
    this._emit("save", { value: this._original });
    this._emit("change", { value: this._original });
  }
  cancel() {
    this._setVal(this._original);
    this._syncDirty();
    this._emit("cancel", { value: this._original });
  }
}
if (!customElements.get("w-confirm-edit"))
  customElements.define("w-confirm-edit", WConfirmEdit);

// src/components/counter.js
class WCounter extends WElement {
  static attrs = ["value", "max", "tween"];
  get value() {
    return this._attr("value", "0");
  }
  get max() {
    return this._attr("max", "");
  }
  get tween() {
    return this._bool("tween");
  }
  _template() {
    const text = this.max ? `${this.value} / ${this.max}` : this.value;
    return `<span class="w-counter">${this._esc(text)}</span>`;
  }
  _events() {
    if (!this.tween || !window.WMotion)
      return;
    const value = Number(this.value);
    if (!Number.isFinite(value))
      return;
    const el = this._q(".w-counter");
    if (!el)
      return;
    window.WMotion.tween(el, {
      from: 0,
      to: value,
      duration: 700,
      suffix: this.max ? ` / ${this.max}` : ""
    });
  }
}
if (!customElements.get("w-counter"))
  customElements.define("w-counter", WCounter);

// src/components/pagination.js
class WPagination extends WElement {
  static attrs = [
    "page",
    "length",
    "disabled",
    "total-visible",
    "start",
    "show-first-last-page",
    "first-icon",
    "last-icon",
    "prev-icon",
    "next-icon",
    "color",
    "active-color",
    "variant",
    "rounded",
    "size",
    "density",
    "border",
    "ellipsis"
  ];
  get page() {
    return parseInt(this._attr("page", String(this.start)), 10) || this.start;
  }
  set page(v) {
    this.setAttribute("page", String(v));
  }
  get length() {
    return parseInt(this._attr("length", "1"), 10) || 1;
  }
  get disabled() {
    return this._bool("disabled");
  }
  get totalVisible() {
    return parseInt(this._attr("total-visible", "0"), 10) || 0;
  }
  get start() {
    return parseInt(this._attr("start", "1"), 10) || 1;
  }
  get showFirstLastPage() {
    return this._bool("show-first-last-page");
  }
  get firstIcon() {
    return this._attr("first-icon", "«");
  }
  get lastIcon() {
    return this._attr("last-icon", "»");
  }
  get prevIcon() {
    return this._attr("prev-icon", "‹");
  }
  get nextIcon() {
    return this._attr("next-icon", "›");
  }
  get color() {
    return this._attr("color", "");
  }
  get activeColor() {
    return this._attr("active-color", "");
  }
  get variant() {
    return this._attr("variant", "text");
  }
  get rounded() {
    return this._attr("rounded", "");
  }
  get size() {
    return this._attr("size", "");
  }
  get density() {
    return this._attr("density", "");
  }
  get border() {
    return this._bool("border");
  }
  get ellipsis() {
    return this._attr("ellipsis", "…");
  }
  _range() {
    const length = this.length;
    const start = this.start;
    const page = this.page;
    const max = this.totalVisible;
    if (!max || length <= max) {
      const pages2 = [];
      for (let i = 0;i < length; i++)
        pages2.push(start + i);
      return pages2;
    }
    const even = max % 2 === 0;
    const middle = even ? max / 2 : Math.floor(max / 2);
    const left = even ? middle : middle + 1;
    const right = length - middle;
    const pages = [];
    if (left - (page - start) >= 0) {
      for (let i = 0;i < max - 1; i++)
        pages.push(start + i);
      pages.push("ellipsis");
      pages.push(start + length - 1);
    } else if (page - start - right >= (even ? 1 : 0)) {
      pages.push(start);
      pages.push("ellipsis");
      for (let i = 0;i < max - 1; i++)
        pages.push(start + length - (max - 1) + i);
    } else {
      pages.push(start);
      pages.push("ellipsis");
      const rangeStart = page - middle + 1;
      for (let i = 0;i < max - 2; i++)
        pages.push(rangeStart + i);
      pages.push("ellipsis");
      pages.push(start + length - 1);
    }
    return pages;
  }
  _template() {
    const length = this.length;
    const start = this.start;
    const page = this.page;
    const disabled = this.disabled;
    const range = this._range();
    const rootClasses = [
      "w-pagination",
      this.size ? "w-pagination--" + this._size() : "",
      this.density ? "w-pagination--density-" + this.density : "",
      this.rounded ? "w-pagination--rounded" : "",
      this.border ? "w-pagination--border" : ""
    ].filter(Boolean).join(" ");
    let html = `<nav class="${rootClasses}" aria-label="Pagination">`;
    if (this.showFirstLastPage) {
      html += this._btnTemplate({
        pageVal: start,
        label: this.firstIcon,
        ariaLabel: "First page",
        disabled: disabled || page <= start,
        isNav: true
      });
    }
    html += this._btnTemplate({
      pageVal: Math.max(start, page - 1),
      label: this.prevIcon,
      ariaLabel: "Previous page",
      disabled: disabled || page <= start,
      isNav: true
    });
    for (const item of range) {
      if (item === "ellipsis") {
        html += `<span class="w-page-ellipsis" aria-hidden="true">${this._esc(this.ellipsis)}</span>`;
      } else {
        const isActive = item === page;
        html += this._btnTemplate({
          pageVal: item,
          label: String(item),
          ariaLabel: isActive ? `Current page, page ${item}` : `Go to page ${item}`,
          disabled,
          isActive
        });
      }
    }
    html += this._btnTemplate({
      pageVal: Math.min(start + length - 1, page + 1),
      label: this.nextIcon,
      ariaLabel: "Next page",
      disabled: disabled || page >= start + length - 1,
      isNav: true
    });
    if (this.showFirstLastPage) {
      html += this._btnTemplate({
        pageVal: start + length - 1,
        label: this.lastIcon,
        ariaLabel: "Last page",
        disabled: disabled || page >= start + length - 1,
        isNav: true
      });
    }
    html += "</nav>";
    return html;
  }
  _btnTemplate({ pageVal, label, ariaLabel, disabled, isActive, isNav }) {
    const classes = ["w-page-item"];
    if (isActive)
      classes.push("active");
    if (isNav)
      classes.push("w-page-nav");
    const variant = this.variant;
    if (variant && variant !== "text")
      classes.push("w-page-item--" + variant);
    const color = this.color;
    if (color)
      classes.push("w-page-item--color-" + this._normalizeColor(color));
    if (isActive) {
      const activeColor = this.activeColor;
      if (activeColor)
        classes.push("w-page-item--active-color-" + this._normalizeColor(activeColor));
      else if (color)
        classes.push("w-page-item--active-color-" + this._normalizeColor(color));
    }
    const rounded = this.rounded;
    if (rounded) {
      if (rounded === "circle" || rounded === "pill")
        classes.push("w-page-item--pill");
      else
        classes.push("w-page-item--rounded");
    }
    const size = this._size();
    if (size && size !== "default")
      classes.push("w-page-item--" + size);
    const density = this.density;
    if (density)
      classes.push("w-page-item--density-" + density);
    if (this.border)
      classes.push("w-page-item--border");
    if (disabled)
      classes.push("w-page-item--disabled");
    const cls = classes.join(" ");
    const dis = disabled ? " disabled" : "";
    const current = isActive ? ' aria-current="page"' : "";
    const aria = ` aria-label="${this._esc(ariaLabel)}"`;
    return `<button class="${cls}" type="button" data-page="${pageVal}"${dis}${current}${aria}>${this._esc(label)}</button>`;
  }
  _size() {
    const aliases = { xs: "x-small", sm: "small", md: "default", lg: "large", xl: "x-large" };
    const size = aliases[this.size] || this.size;
    const valid = ["x-small", "small", "default", "large", "x-large"];
    return valid.includes(size) ? size : "default";
  }
  _normalizeColor(value) {
    const token = String(value || "").toLowerCase();
    if (!token)
      return "";
    if (token === "danger")
      return "error";
    if (token === "info")
      return "primary";
    const valid = ["primary", "secondary", "tertiary", "success", "warning", "error"];
    return valid.includes(token) ? token : "primary";
  }
  _events() {
    const buttons = this._qAll("[data-page]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled)
          return;
        const pageVal = Number(btn.getAttribute("data-page"));
        if (!pageVal || pageVal === this.page)
          return;
        const oldPage = this.page;
        this.page = pageVal;
        this._emit("change", { page: pageVal });
        this._emit("update:modelValue", { page: pageVal });
        if (pageVal === this.start)
          this._emit("first", { page: pageVal });
        else if (pageVal === this.start + this.length - 1)
          this._emit("last", { page: pageVal });
        else if (pageVal < oldPage)
          this._emit("prev", { page: pageVal });
        else if (pageVal > oldPage)
          this._emit("next", { page: pageVal });
      });
    });
  }
}
if (!customElements.get("w-pagination")) {
  customElements.define("w-pagination", WPagination);
}

// src/components/data-iterator.js
class WDataIterator extends WElement {
  static attrs = [
    "items",
    "page",
    "items-per-page",
    "items-per-page-options",
    "search",
    "sort-by",
    "sort-desc",
    "loading",
    "no-data-text",
    "title-field",
    "subtitle-field",
    "meta-field"
  ];
  get headers() {
    return ["title", "subtitle", "meta"];
  }
  get items() {
    return wParseRecords(this._attr("items", ""), this.headers);
  }
  get page() {
    return Math.max(1, Number(this._attr("page", "1")) || 1);
  }
  get itemsPerPage() {
    return Math.max(1, Number(this._attr("items-per-page", "6")) || 6);
  }
  get itemsPerPageOptions() {
    return this._attr("items-per-page-options", "").split(",").map((n) => parseInt(n, 10)).filter((n) => n > 0);
  }
  get search() {
    return this._attr("search", "").toLowerCase();
  }
  get sortBy() {
    return this._attr("sort-by", "");
  }
  get sortDesc() {
    return this._bool("sort-desc");
  }
  get loading() {
    return this._bool("loading");
  }
  get noDataText() {
    return this._attr("no-data-text", "No data available");
  }
  get titleField() {
    return this._attr("title-field", "title");
  }
  get subtitleField() {
    return this._attr("subtitle-field", "subtitle");
  }
  get metaField() {
    return this._attr("meta-field", "meta");
  }
  _template() {
    if (this.loading)
      return `<div class="w-data-iterator">${this._loadingHtml()}</div>`;
    if (!this.items.length)
      return `<div class="w-data-iterator"><slot></slot></div>`;
    const filtered = this._processed();
    if (!filtered.length) {
      return `<div class="w-data-iterator"><div class="w-data-iterator-empty">${this._esc(this.noDataText)}</div></div>`;
    }
    const pages = Math.max(1, Math.ceil(filtered.length / this.itemsPerPage));
    const page = wClamp(this.page, 1, pages);
    const start = (page - 1) * this.itemsPerPage;
    const items = filtered.slice(start, start + this.itemsPerPage);
    const end = start + items.length;
    return `<div class="w-data-iterator">
      <div class="w-data-iterator-grid">
        ${items.map((item, index) => this._itemHtml(item, start + index)).join("")}
      </div>
      <div class="w-data-iterator-footer">
        <span class="w-data-iterator-range">${start + 1}&#8211;${end} of ${filtered.length}</span>
        <div class="w-data-iterator-controls">
          ${this._perPageHtml()}
          <w-pagination page="${page}" length="${pages}"></w-pagination>
        </div>
      </div>
    </div>`;
  }
  _perPageHtml() {
    const options = this.itemsPerPageOptions;
    if (!options.length)
      return "";
    const opts = options.map((n) => `<option value="${n}"${n === this.itemsPerPage ? " selected" : ""}>${n}</option>`).join("");
    return `<label class="w-data-iterator-per-page">Per page
      <select class="w-select" data-per-page>${opts}</select>
    </label>`;
  }
  _loadingHtml() {
    const cards = Array.from({ length: this.itemsPerPage }, () => `<article class="w-data-iterator-item" aria-hidden="true">
        <span class="w-skeleton w-skeleton-text"></span>
        <span class="w-skeleton w-skeleton-text"></span>
      </article>`).join("");
    return `<div class="w-data-iterator-grid" aria-busy="true">${cards}</div>`;
  }
  _events() {
    this.querySelector("w-pagination")?.addEventListener("change", (event) => {
      event.stopPropagation();
      const page = event.detail.value ?? event.detail.page;
      this._silentSet("page", page);
      this._render();
      this._events();
      this._emit("change", { value: page });
    });
    this.querySelector("[data-per-page]")?.addEventListener("change", (event) => {
      event.stopPropagation();
      const itemsPerPage = parseInt(event.target.value, 10) || this.itemsPerPage;
      this._silentSet("items-per-page", itemsPerPage);
      this._silentSet("page", 1);
      this._render();
      this._events();
      this._emit("update", { page: 1, itemsPerPage });
    });
  }
  _processed() {
    let rows = this._filteredItems();
    if (this.sortBy) {
      const dir = this.sortDesc ? -1 : 1;
      rows = rows.slice().sort((a, b) => this._compare(this._field(a, this.sortBy), this._field(b, this.sortBy)) * dir);
    }
    return rows;
  }
  _filteredItems() {
    if (!this.search)
      return this.items;
    return this.items.filter((item) => JSON.stringify(item).toLowerCase().includes(this.search));
  }
  _field(item, field) {
    const idx = this.headers.indexOf(field);
    return wRecordValue(item, field, idx >= 0 ? idx : 0);
  }
  _compare(a, b) {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb) && String(na) === String(a).trim() && String(nb) === String(b).trim()) {
      return na - nb;
    }
    return String(a).localeCompare(String(b));
  }
  _itemHtml(item, index) {
    const title = wRecordValue(item, this.titleField, 0);
    const subtitle = wRecordValue(item, this.subtitleField, 1);
    const meta = wRecordValue(item, this.metaField, 2);
    return `<article class="w-data-iterator-item" data-index="${index}">
      <strong>${this._esc(title)}</strong>
      ${subtitle ? `<span>${this._esc(subtitle)}</span>` : ""}
      ${meta ? `<small>${this._esc(meta)}</small>` : ""}
    </article>`;
  }
}
if (!customElements.get("w-data-iterator"))
  customElements.define("w-data-iterator", WDataIterator);

// src/components/data-table.js
class WDataTable extends WElement {
  static attrs = [
    "headers",
    "items",
    "item-value",
    "sort-by",
    "sort-desc",
    "multi-sort",
    "search",
    "page",
    "items-per-page",
    "items-per-page-options",
    "show-select",
    "select-strategy",
    "selected",
    "show-expand",
    "expanded",
    "loading",
    "loading-text",
    "no-data-text",
    "density",
    "striped",
    "hover",
    "fixed-header",
    "height"
  ];
  get density() {
    return this._attr("density", "");
  }
  get striped() {
    return this._bool("striped");
  }
  get hover() {
    return this._bool("hover");
  }
  get multiSort() {
    return this._bool("multi-sort");
  }
  get search() {
    return this._attr("search", "").toLowerCase();
  }
  get page() {
    return Math.max(1, wNumberAttr(this, "page", 1));
  }
  get itemsPerPage() {
    return wNumberAttr(this, "items-per-page", 10);
  }
  get itemsPerPageOptions() {
    const raw = this._attr("items-per-page-options", "10,25,50,-1");
    return raw.split(",").map((n) => parseInt(n, 10)).filter((n) => Number.isFinite(n));
  }
  get showSelect() {
    return this._bool("show-select");
  }
  get selectStrategy() {
    return this._attr("select-strategy", "page");
  }
  get showExpand() {
    return this._bool("show-expand");
  }
  get loading() {
    return this._bool("loading");
  }
  get loadingText() {
    return this._attr("loading-text", "Loading items…");
  }
  get noDataText() {
    return this._attr("no-data-text", "No data available");
  }
  get fixedHeader() {
    return wBoolAttr(this, "fixed-header");
  }
  get height() {
    return this._attr("height", "");
  }
  get itemValue() {
    return this._attr("item-value", "");
  }
  get selected() {
    return wValueList(this._attr("selected", "")).map(String);
  }
  get expanded() {
    return wValueList(this._attr("expanded", "")).map(String);
  }
  get columns() {
    if (Array.isArray(this._headersData))
      return this._headersData.map((h, i) => this._normCol(h, i));
    const raw = this._attr("headers", "").trim();
    if (raw.startsWith("[") && raw.includes("{")) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr))
          return arr.map((h, i) => this._normCol(h, i));
      } catch {}
    }
    return wValueList(raw).map((title, i) => this._normCol(title, i));
  }
  set headers(v) {
    this._headersData = v;
    if (this._rendered)
      this._rerender();
  }
  _normCol(h, i) {
    if (h && typeof h === "object") {
      return {
        title: h.title ?? h.key ?? "",
        key: h.key ?? h.title ?? i,
        index: i,
        align: h.align || "start",
        sortable: h.sortable !== false,
        width: h.width || ""
      };
    }
    return { title: h, key: h, index: i, align: "start", sortable: true, width: "" };
  }
  get items() {
    if (this._itemsData !== undefined)
      return this._itemsData;
    return wParseRecords(this._attr("items", ""), this.columns.map((c) => c.key));
  }
  set items(v) {
    this._itemsData = Array.isArray(v) ? v : wParseRecords(v, this.columns.map((c) => c.key));
    if (this._rendered)
      this._rerender();
  }
  _cell(item, col) {
    if (Array.isArray(item))
      return item[col.index] ?? "";
    return wRecordValue(item, col.key, col.index);
  }
  _rowKey(item, index) {
    if (this.itemValue)
      return String(this._cell(item, { key: this.itemValue, index: 0 }));
    return JSON.stringify(item);
  }
  get _sorts() {
    if (!this._sortState) {
      const key = this._attr("sort-by", "");
      this._sortState = key ? [{ key, desc: wBoolAttr(this, "sort-desc") }] : [];
    }
    return this._sortState;
  }
  _filtered() {
    if (!this.search)
      return this.items;
    return this.items.filter((item) => JSON.stringify(item).toLowerCase().includes(this.search));
  }
  _sorted(rows) {
    if (!this._sorts.length)
      return rows;
    const cols = this.columns;
    return rows.slice().sort((a, b) => {
      for (const s of this._sorts) {
        const col = cols.find((c) => c.key === s.key) || { key: s.key, index: 0 };
        const cmp = String(this._cell(a, col)).localeCompare(String(this._cell(b, col)), undefined, { numeric: true });
        if (cmp)
          return s.desc ? -cmp : cmp;
      }
      return 0;
    });
  }
  get _total() {
    return this._filtered().length;
  }
  get _pageCount() {
    if (this.itemsPerPage <= 0)
      return 1;
    return Math.max(1, Math.ceil(this._total / this.itemsPerPage));
  }
  _visibleRows() {
    const rows = this._sorted(this._filtered());
    if (this.itemsPerPage <= 0)
      return rows;
    const page = wClamp(this.page, 1, this._pageCount);
    const start = (page - 1) * this.itemsPerPage;
    return rows.slice(start, start + this.itemsPerPage);
  }
  _template() {
    const cols = this.columns;
    if (!cols.length)
      return `<div class="w-table-wrap"><slot></slot></div>`;
    const rows = this._visibleRows();
    const tableClasses = [
      "w-table",
      this.striped ? "w-table--striped" : "",
      this.hover ? "" : "w-table--no-hover",
      this.density === "compact" || this.density === "dense" ? "w-table--dense" : "",
      this.density === "comfortable" ? "w-table--comfortable" : ""
    ].filter(Boolean).join(" ");
    const wrapClasses = ["w-table-wrap", this.fixedHeader ? "w-table-wrap--fixed-header" : ""].filter(Boolean).join(" ");
    const wrapStyle = this.height ? ` style="max-height:${this._esc(this.height)}"` : "";
    return `<div class="w-data-table${this.loading ? " w-data-table--loading" : ""}">
      ${this.loading ? '<span class="w-data-table-loader" aria-hidden="true"></span>' : ""}
      <div class="${wrapClasses}"${wrapStyle}>
        <table class="${tableClasses}">
          <thead>${this._headHtml(cols, rows)}</thead>
          <tbody>${this._bodyHtml(cols, rows)}</tbody>
        </table>
      </div>
      ${this._footerHtml()}
    </div>`;
  }
  _headHtml(cols, rows) {
    let lead = "";
    if (this.showSelect && this.selectStrategy !== "single") {
      const all = rows.length && rows.every((r, i) => this.selected.includes(this._rowKey(r, i)));
      lead += `<th class="w-table-select"><input type="checkbox" data-select-all${all ? " checked" : ""} aria-label="Select all"></th>`;
    } else if (this.showSelect) {
      lead += `<th class="w-table-select"></th>`;
    }
    if (this.showExpand)
      lead += `<th class="w-table-expand"></th>`;
    const ths = cols.map((col) => {
      const sort = this._sorts.find((s) => s.key === col.key);
      const arrow = sort ? `<span class="w-table-sort-icon" aria-hidden="true">${sort.desc ? "↓" : "↑"}</span>` : "";
      const style = col.width ? ` style="width:${this._esc(col.width)};text-align:${this._align(col)}"` : ` style="text-align:${this._align(col)}"`;
      if (!col.sortable)
        return `<th${style}>${this._esc(col.title)}</th>`;
      return `<th class="w-table-sortable" aria-sort="${sort ? sort.desc ? "descending" : "ascending" : "none"}"${style}>` + `<button class="w-table-sort" type="button" data-sort="${this._esc(col.key)}">${this._esc(col.title)}${arrow}</button></th>`;
    }).join("");
    return `<tr>${lead}${ths}</tr>`;
  }
  _align(col) {
    return col.align === "end" || col.align === "right" ? "right" : col.align === "center" ? "center" : "left";
  }
  _bodyHtml(cols, rows) {
    const span = cols.length + (this.showSelect ? 1 : 0) + (this.showExpand ? 1 : 0);
    if (this.loading && !rows.length)
      return `<tr><td colspan="${span}" class="w-table-message">${this._esc(this.loadingText)}</td></tr>`;
    if (!rows.length)
      return `<tr><td colspan="${span}" class="w-table-message">${this._esc(this.noDataText)}</td></tr>`;
    return rows.map((item, i) => {
      const key = this._rowKey(item, i);
      const isSel = this.selected.includes(key);
      const isExp = this.expanded.includes(key);
      let lead = "";
      if (this.showSelect) {
        const type = this.selectStrategy === "single" ? "radio" : "checkbox";
        lead += `<td class="w-table-select"><input type="${type}" data-select="${this._esc(key)}"${isSel ? " checked" : ""} aria-label="Select row"></td>`;
      }
      if (this.showExpand) {
        lead += `<td class="w-table-expand"><button class="w-table-expand-btn" type="button" data-expand="${this._esc(key)}" aria-expanded="${isExp}" aria-label="Toggle details">${isExp ? "▾" : "▸"}</button></td>`;
      }
      const cells = cols.map((col) => `<td style="text-align:${this._align(col)}">${this._esc(this._cell(item, col))}</td>`).join("");
      const main = `<tr${isSel ? ' class="selected"' : ""}>${lead}${cells}</tr>`;
      if (!isExp)
        return main;
      const detail = cols.map((col) => `<div><strong>${this._esc(col.title)}:</strong> ${this._esc(this._cell(item, col))}</div>`).join("");
      return main + `<tr class="w-data-table-expanded"><td colspan="${span}"><div class="w-data-table-detail">${detail}</div></td></tr>`;
    }).join("");
  }
  _footerHtml() {
    if (this.itemsPerPage <= 0 && !this.itemsPerPageOptions.length)
      return "";
    const total = this._total;
    const page = wClamp(this.page, 1, this._pageCount);
    const perPage = this.itemsPerPage <= 0 ? total : this.itemsPerPage;
    const start = total ? (page - 1) * perPage + 1 : 0;
    const end = this.itemsPerPage <= 0 ? total : Math.min(start + perPage - 1, total);
    const options = this.itemsPerPageOptions;
    const perPageSelect = options.length ? `<label class="w-data-table-per-page">Rows per page
      <select class="w-select" data-per-page>${options.map((n) => `<option value="${n}"${n === this.itemsPerPage ? " selected" : ""}>${n < 0 ? "All" : n}</option>`).join("")}</select></label>` : "";
    const navBtn = (action, label, disabled) => `<button class="w-data-table-nav" type="button" data-page-action="${action}" aria-label="${label}"${disabled ? " disabled" : ""}>${this._navIcon(action)}</button>`;
    return `<div class="w-data-table-footer">
      ${perPageSelect}
      <span class="w-data-table-range">${start}&#8211;${end} of ${total}</span>
      <div class="w-data-table-pagination">
        ${navBtn("first", "First page", page <= 1)}
        ${navBtn("prev", "Previous page", page <= 1)}
        ${navBtn("next", "Next page", page >= this._pageCount)}
        ${navBtn("last", "Last page", page >= this._pageCount)}
      </div>
    </div>`;
  }
  _navIcon(action) {
    return { first: "«", prev: "‹", next: "›", last: "»" }[action] || "";
  }
  _events() {
    this.querySelectorAll("[data-sort]").forEach((btn) => btn.addEventListener("click", () => this._toggleSort(btn.getAttribute("data-sort"))));
    this.querySelectorAll("[data-page-action]").forEach((btn) => btn.addEventListener("click", () => this._goPage(btn.getAttribute("data-page-action"))));
    this.querySelector("[data-per-page]")?.addEventListener("change", (event) => {
      event.stopPropagation();
      this._silentSet("items-per-page", parseInt(event.target.value, 10));
      this._silentSet("page", 1);
      this._rerender();
      this._emitOptions();
    });
    this.querySelector("[data-select-all]")?.addEventListener("change", (event) => {
      event.stopPropagation();
      this._toggleSelectAll(event.target.checked);
    });
    this.querySelectorAll("[data-select]").forEach((box) => box.addEventListener("change", (event) => {
      event.stopPropagation();
      this._toggleSelect(box.getAttribute("data-select"), event.target.checked);
    }));
    this.querySelectorAll("[data-expand]").forEach((btn) => btn.addEventListener("click", () => this._toggleExpand(btn.getAttribute("data-expand"))));
  }
  _rerender() {
    this._render();
    this._events();
  }
  _toggleSort(key) {
    const sorts = this._sorts;
    const existing = sorts.find((s) => s.key === key);
    if (!this.multiSort) {
      if (!existing)
        this._sortState = [{ key, desc: false }];
      else if (!existing.desc)
        this._sortState = [{ key, desc: true }];
      else
        this._sortState = [];
    } else if (!existing)
      sorts.push({ key, desc: false });
    else if (!existing.desc)
      existing.desc = true;
    else
      this._sortState = sorts.filter((s) => s.key !== key);
    const primary = this._sorts[0];
    this._silentSet("sort-by", primary ? primary.key : null);
    this._silentSet("sort-desc", primary && primary.desc ? "true" : null);
    this._silentSet("page", 1);
    this._rerender();
    this._emitOptions();
  }
  _goPage(action) {
    const page = wClamp(this.page, 1, this._pageCount);
    const next = { first: 1, prev: page - 1, next: page + 1, last: this._pageCount }[action];
    const clamped = wClamp(next, 1, this._pageCount);
    if (clamped === page)
      return;
    this._silentSet("page", clamped);
    this._rerender();
    this._emitOptions();
  }
  _toggleSelectAll(checked) {
    const keys = this._visibleRows().map((r, i) => this._rowKey(r, i));
    const set = new Set(this.selected);
    keys.forEach((k) => checked ? set.add(k) : set.delete(k));
    this._commitSelection([...set]);
  }
  _toggleSelect(key, checked) {
    if (this.selectStrategy === "single") {
      this._commitSelection(checked ? [key] : []);
      this._rerender();
      return;
    }
    const set = new Set(this.selected);
    checked ? set.add(key) : set.delete(key);
    this._commitSelection([...set]);
    const all = this._visibleRows().every((r, i) => set.has(this._rowKey(r, i)));
    const master = this.querySelector("[data-select-all]");
    if (master)
      master.checked = all && this._visibleRows().length > 0;
    const tr = this.querySelector(`[data-select="${CSS.escape(key)}"]`)?.closest("tr");
    if (tr)
      tr.classList.toggle("selected", checked);
  }
  _commitSelection(keys) {
    this._silentSet("selected", keys.join(","));
    this._emit("update:selected", { selected: keys });
  }
  _toggleExpand(key) {
    const set = new Set(this.expanded);
    set.has(key) ? set.delete(key) : set.add(key);
    const keys = [...set];
    this._silentSet("expanded", keys.join(","));
    this._rerender();
    this._emit("update:expanded", { expanded: keys });
  }
  _emitOptions() {
    const primary = this._sorts[0];
    const detail = { page: this.page, itemsPerPage: this.itemsPerPage, sortBy: primary ? primary.key : "", sortDesc: !!(primary && primary.desc) };
    this._emit("update:options", detail);
    this._emit("change", detail);
  }
}
if (!customElements.get("w-data-table"))
  customElements.define("w-data-table", WDataTable);

// src/components/data-table-footer.js
class WDataTableFooter extends WElement {
  _template() {
    return `<div class="w-data-table-footer"><slot></slot></div>`;
  }
}
if (!customElements.get("w-data-table-footer")) {
  customElements.define("w-data-table-footer", WDataTableFooter);
}

// src/components/date-input.js
class WDateInput extends WElement {
  static attrs = [
    "value",
    "label",
    "placeholder",
    "hint",
    "error",
    "size",
    "disabled",
    "readonly",
    "name",
    "min",
    "max",
    "format",
    "mode",
    "clearable",
    "first-day-of-week",
    "show-adjacent-months"
  ];
  constructor() {
    super();
    this._popupUid = Math.random().toString(36).slice(2, 9);
    this._outsideClick = null;
  }
  get value() {
    return this._attr("value", "");
  }
  set value(v) {
    this._silentSet("value", v);
    const input = this._q(".w-date-input-field");
    if (input)
      input.value = this._displayValue(v);
    const clear = this._q(".w-date-input-clear");
    if (clear)
      clear.hidden = !v;
  }
  get label() {
    return this._attr("label", "");
  }
  get placeholder() {
    return this._attr("placeholder", "");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get error() {
    return this._attr("error", "");
  }
  get size() {
    return this._attr("size", "");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get readonly() {
    return this._bool("readonly");
  }
  get name() {
    return this._attr("name", "");
  }
  get min() {
    return this._attr("min", "");
  }
  get max() {
    return this._attr("max", "");
  }
  get format() {
    return this._attr("format", "");
  }
  get mode() {
    const m = this._attr("mode", "single");
    return m === "multiple" || m === "range" ? m : "single";
  }
  get clearable() {
    return this._bool("clearable");
  }
  get firstDayOfWeek() {
    const n = parseInt(this._attr("first-day-of-week", "0"), 10);
    return Number.isNaN(n) ? 0 : (n % 7 + 7) % 7;
  }
  get showAdjacentMonths() {
    return this._bool("show-adjacent-months");
  }
  _displayValue(value) {
    const fmt = this.format;
    if (this.mode === "single") {
      const d = wParseIsoDate(value);
      return d ? wFormatDate(d, fmt) : value;
    }
    if (this.mode === "multiple") {
      return wParseDateList(value).map((d) => wFormatDate(d, fmt)).join(", ");
    }
    return value.split(",").map((s) => {
      const d = wParseIsoDate(s.trim());
      return d ? wFormatDate(d, fmt) : s.trim();
    }).filter(Boolean).join(" – ");
  }
  _parseInput(text) {
    const mode = this.mode;
    if (!text.trim())
      return "";
    if (mode === "single") {
      let d = wParseIsoDate(text.trim());
      if (d)
        return wIsoDate(d);
      const tryDate = new Date(text.trim());
      if (!Number.isNaN(tryDate.getTime()))
        return wIsoDate(tryDate);
      return this.value;
    }
    if (mode === "multiple") {
      const items = text.split(/,|;/).map((s) => s.trim()).filter(Boolean);
      const dates = [];
      for (const item of items) {
        const d = wParseIsoDate(item) || (Number.isNaN(new Date(item).getTime()) ? null : new Date(item));
        if (d)
          dates.push(d);
      }
      return dates.map(wIsoDate).join(",");
    }
    const parts = text.split(/[–\-–,]/).map((s) => s.trim()).filter(Boolean);
    if (parts.length < 2)
      return this.value;
    const start = wParseIsoDate(parts[0]) || (Number.isNaN(new Date(parts[0]).getTime()) ? null : new Date(parts[0]));
    const end = wParseIsoDate(parts[1]) || (Number.isNaN(new Date(parts[1]).getTime()) ? null : new Date(parts[1]));
    if (start && end)
      return `${wIsoDate(start)},${wIsoDate(end)}`;
    return this.value;
  }
  _selectedDates() {
    const mode = this.mode;
    if (mode === "single") {
      const d = wParseIsoDate(this.value);
      return d ? [d] : [];
    }
    if (mode === "multiple") {
      return wParseDateList(this.value);
    }
    const parts = this.value.split(",").map((s) => s.trim()).filter(Boolean);
    const start = wParseIsoDate(parts[0] || "");
    const end = wParseIsoDate(parts[1] || "");
    return start && end ? [start, end] : start ? [start] : [];
  }
  _isOpen() {
    return this.classList.contains("w-date-input--open");
  }
  _setOpen(open) {
    this.classList.toggle("w-date-input--open", open);
    const popup = this._q(".w-date-input-popup");
    const icon = this._q(".w-date-input-icon");
    if (popup)
      popup.hidden = !open;
    if (icon)
      icon.setAttribute("aria-expanded", String(open));
    if (open) {
      this._refreshPicker();
    }
  }
  _refreshPicker() {
    const picker = this._q(".w-date-input-popup w-date-picker");
    if (!picker)
      return;
    const dates = this._selectedDates();
    if (dates.length) {
      const d = dates[0];
      picker.setAttribute("month", d.getMonth() + 1);
      picker.setAttribute("year", d.getFullYear());
    }
    picker.setAttribute("value", this.value);
    picker.setAttribute("min", this.min);
    picker.setAttribute("max", this.max);
    picker.setAttribute("mode", this.mode);
    if (this.firstDayOfWeek)
      picker.setAttribute("first-day-of-week", this.firstDayOfWeek);
    else
      picker.removeAttribute("first-day-of-week");
    if (this.showAdjacentMonths)
      picker.setAttribute("show-adjacent-months", "");
    else
      picker.removeAttribute("show-adjacent-months");
  }
  _template() {
    const ph = this.placeholder ? ` placeholder="${this._esc(this.placeholder)}"` : "";
    const val = this.value ? ` value="${this._esc(this._displayValue(this.value))}"` : "";
    const dis = this.disabled ? " disabled" : "";
    const ro = this.readonly ? " readonly" : "";
    const iconDis = this.disabled || this.readonly ? " disabled" : "";
    const nameAttr = this.name ? ` name="${this._esc(this.name)}"` : "";
    const sizeClass = this.size ? ` w-input--${this.size}` : "";
    const errorClass = this.error ? " w-field-error" : "";
    const hasValue = Boolean(this.value);
    const canClear = this.clearable && hasValue && !this.disabled && !this.readonly;
    const firstDate = this._selectedDates()[0];
    const pickerExtras = [
      firstDate ? ` year="${firstDate.getFullYear()}"` : "",
      firstDate ? ` month="${firstDate.getMonth() + 1}"` : "",
      this.firstDayOfWeek ? ` first-day-of-week="${this.firstDayOfWeek}"` : "",
      this.showAdjacentMonths ? " show-adjacent-months" : ""
    ].join("");
    return `<div class="w-field w-date-input${errorClass}">
      ${this.label ? `<label class="w-field-label">${this._esc(this.label)}</label>` : ""}
      <div class="w-date-input-wrap">
        <button class="w-date-input-icon" type="button" aria-label="Open calendar" aria-expanded="false" aria-controls="${this._popupId()}"${iconDis}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/>
          </svg>
        </button>
        <input class="w-input w-date-input-field${sizeClass}" type="text"${ph}${val}${dis}${ro}${nameAttr}>
        ${canClear ? `<button class="w-date-input-clear" type="button" aria-label="Clear date"${dis}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>` : ""}
      </div>
      ${this.error || this.hint ? `<span class="w-field-hint">${this._esc(this.error || this.hint)}</span>` : ""}
      <div class="w-date-input-popup" id="${this._popupId()}" hidden>
        <w-date-picker value="${this._esc(this.value)}" min="${this._esc(this.min)}" max="${this._esc(this.max)}" mode="${this.mode}" hide-header${pickerExtras}></w-date-picker>
      </div>
    </div>`;
  }
  _popupId() {
    return `w-date-input-popup-${this._popupUid}`;
  }
  _events() {
    const input = this._q(".w-date-input-field");
    const icon = this._q(".w-date-input-icon");
    const clear = this._q(".w-date-input-clear");
    const picker = this._q(".w-date-input-popup w-date-picker");
    if (icon) {
      icon.addEventListener("click", (e) => {
        e.preventDefault();
        if (this.disabled || this.readonly)
          return;
        this._setOpen(!this._isOpen());
        if (this._isOpen())
          input?.focus();
      });
    }
    if (input) {
      input.addEventListener("input", (event) => {
        event.stopPropagation();
        this._emit("input", { value: input.value, name: this.name });
      });
      input.addEventListener("change", (event) => {
        event.stopPropagation();
        const parsed = this._parseInput(input.value);
        this._commit(parsed);
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this._isOpen()) {
          e.preventDefault();
          this._setOpen(false);
        }
      });
    }
    if (clear) {
      clear.addEventListener("click", (e) => {
        e.preventDefault();
        if (this.disabled)
          return;
        this._commit("");
        input?.focus();
      });
    }
    if (picker) {
      picker.addEventListener("change", (e) => {
        e.stopImmediatePropagation();
        const next = e.detail?.value ?? "";
        this._commit(next);
        if (this.mode === "single")
          this._setOpen(false);
      });
    }
    if (this._outsideClick) {
      document.removeEventListener("click", this._outsideClick);
    }
    this._outsideClick = (e) => {
      if (!this._isOpen())
        return;
      if (e.composedPath().includes(this))
        return;
      this._setOpen(false);
    };
    document.addEventListener("click", this._outsideClick);
  }
  _commit(nextValue) {
    if (this.mode === "single") {
      const d = wParseIsoDate(nextValue);
      const min = wParseIsoDate(this.min);
      const max = wParseIsoDate(this.max);
      if (d && !wDateInRange(d, min, max)) {
        nextValue = this.value;
      }
    }
    const changed = nextValue !== this.value;
    this._silentSet("value", nextValue);
    const input = this._q(".w-date-input-field");
    if (input)
      input.value = this._displayValue(nextValue);
    const clear = this._q(".w-date-input-clear");
    if (clear)
      clear.hidden = !nextValue;
    if (this._isOpen())
      this._refreshPicker();
    if (changed)
      this._emit("change", { value: nextValue, name: this.name });
  }
  disconnectedCallback() {
    if (this._outsideClick)
      document.removeEventListener("click", this._outsideClick);
  }
  focus() {
    const input = this._q(".w-date-input-field");
    if (input)
      input.focus();
  }
}
if (!customElements.get("w-date-input"))
  customElements.define("w-date-input", WDateInput);

// src/components/date-picker.js
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class WDatePicker extends WElement {
  static attrs = ["value", "month", "year", "min", "max", "first-day-of-week", "show-adjacent-months", "mode", "view", "title", "hide-header"];
  get value() {
    return this._attr("value", "");
  }
  get month() {
    return parseInt(this._attr("month", String(new Date().getMonth() + 1)), 10) || 1;
  }
  get year() {
    return parseInt(this._attr("year", String(new Date().getFullYear())), 10) || new Date().getFullYear();
  }
  get min() {
    return wParseIsoDate(this._attr("min", ""));
  }
  get max() {
    return wParseIsoDate(this._attr("max", ""));
  }
  get title() {
    return this._attr("title", "Select date");
  }
  get hideHeader() {
    return this._bool("hide-header");
  }
  get view() {
    const view = this._attr("view", "date");
    return view === "months" || view === "years" ? view : "date";
  }
  get firstDayOfWeek() {
    const n = parseInt(this._attr("first-day-of-week", "0"), 10);
    return Number.isNaN(n) ? 0 : (n % 7 + 7) % 7;
  }
  get showAdjacentMonths() {
    return this._bool("show-adjacent-months");
  }
  get mode() {
    const m = this._attr("mode", "single");
    return m === "multiple" || m === "range" ? m : "single";
  }
  _selectedDates() {
    if (this.mode === "single") {
      const d = wParseIsoDate(this.value);
      return d ? [d] : [];
    }
    if (this.mode === "multiple") {
      return this.value.split(",").map((s) => wParseIsoDate(s.trim())).filter(Boolean);
    }
    const parts = this.value.split(",").map((s) => s.trim());
    const start = wParseIsoDate(parts[0] || "");
    const end = wParseIsoDate(parts[1] || "");
    return start && end ? [start, end] : start ? [start] : [];
  }
  _isSelected(date) {
    return this._selectedDates().some((d) => wIsSameDate(d, date));
  }
  _rangeState() {
    const dates = this._selectedDates();
    if (this.mode !== "range" || dates.length < 2)
      return null;
    return { start: dates[0], end: dates[1] };
  }
  _template() {
    const label = this._monthYearLabel();
    let html = `<div class="w-date-picker w-date-picker--view-${this.view}" role="application" aria-label="Calendar">`;
    if (!this.hideHeader) {
      html += `<div class="w-date-picker-picker-title">
        <span>${this._esc(this.title)}</span>
        <strong>${this._esc(this._selectionLabel())}</strong>
      </div>`;
    }
    html += `<div class="w-date-picker-header">
      <button class="w-date-picker-nav w-date-picker-nav--prev" type="button" aria-label="${this._esc(this._navLabel(-1))}">‹</button>
      <button class="w-date-picker-title" type="button" aria-label="Change calendar view">${this._esc(label)}</button>
      <button class="w-date-picker-nav w-date-picker-nav--next" type="button" aria-label="${this._esc(this._navLabel(1))}">›</button>
    </div>`;
    html += this.view === "years" ? this._yearsTemplate() : this.view === "months" ? this._monthsTemplate() : this._daysTemplate();
    html += "</div>";
    return html;
  }
  _selectionLabel() {
    const dates = this._selectedDates();
    if (!dates.length)
      return "No date selected";
    if (this.mode === "range" && dates.length === 2)
      return `${dates[0].toLocaleDateString()} – ${dates[1].toLocaleDateString()}`;
    if (this.mode === "multiple")
      return `${dates.length} selected`;
    return dates[0].toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }
  _monthYearLabel() {
    if (this.view === "months")
      return String(this.year);
    if (this.view === "years") {
      const start = this._yearPageStart();
      return `${start} - ${start + 11}`;
    }
    return new Date(this.year, this.month - 1, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
  }
  _navLabel(delta) {
    if (this.view === "years")
      return delta < 0 ? "Previous years" : "Next years";
    if (this.view === "months")
      return delta < 0 ? "Previous year" : "Next year";
    return delta < 0 ? "Previous month" : "Next month";
  }
  _daysTemplate() {
    const date = new Date(this.year, this.month - 1, 1);
    const daysInMonth = new Date(this.year, this.month, 0).getDate();
    const offset = (date.getDay() - this.firstDayOfWeek + 7) % 7;
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const orderedWeekdays = [...weekdays.slice(this.firstDayOfWeek), ...weekdays.slice(0, this.firstDayOfWeek)];
    const prevMonthDays = new Date(this.year, this.month - 1, 0).getDate();
    const range = this._rangeState();
    let html = '<div class="w-date-picker-grid" role="grid">';
    orderedWeekdays.forEach((day) => {
      html += `<div class="w-date-picker-weekday" role="columnheader">${day}</div>`;
    });
    if (this.showAdjacentMonths) {
      for (let i = offset - 1;i >= 0; i--) {
        const day = prevMonthDays - i;
        html += this._dayButton(day, this._isoForDay(this.year, this.month - 1, day), true, range);
      }
    } else {
      for (let i = 0;i < offset; i++)
        html += '<span class="w-date-picker-spacer"></span>';
    }
    for (let day = 1;day <= daysInMonth; day++) {
      html += this._dayButton(day, this._isoForDay(this.year, this.month, day), false, range);
    }
    if (this.showAdjacentMonths) {
      const totalCells = offset + daysInMonth;
      const remainder = totalCells % 7 === 0 ? 0 : 7 - totalCells % 7;
      for (let day = 1;day <= remainder; day++) {
        html += this._dayButton(day, this._isoForDay(this.year, this.month + 1, day), true, range);
      }
    }
    html += "</div>";
    return html;
  }
  _monthsTemplate() {
    return `<div class="w-date-picker-months" role="grid">${MONTHS.map((label, index) => {
      const month = index + 1;
      const selected = month === this.month;
      return `<button class="w-date-picker-month${selected ? " selected" : ""}" type="button" data-month="${month}" aria-selected="${selected}">${label}</button>`;
    }).join("")}</div>`;
  }
  _yearsTemplate() {
    const start = this._yearPageStart();
    return `<div class="w-date-picker-years" role="grid">${Array.from({ length: 12 }, (_, index) => start + index).map((year) => {
      const selected = year === this.year;
      return `<button class="w-date-picker-year${selected ? " selected" : ""}" type="button" data-year="${year}" aria-selected="${selected}">${year}</button>`;
    }).join("")}</div>`;
  }
  _yearPageStart() {
    return Math.floor(this.year / 12) * 12;
  }
  _isoForDay(year, month, day) {
    return wIsoDate(new Date(year, month - 1, day));
  }
  _dayButton(day, iso, otherMonth, range) {
    const date = wParseIsoDate(iso);
    const disabled = !wDateInRange(date, this.min, this.max);
    const selected = this._isSelected(date);
    const today = wIsSameDate(date, new Date);
    const classes = ["w-date-picker-day"];
    if (otherMonth)
      classes.push("other-month");
    if (disabled)
      classes.push("disabled");
    if (today)
      classes.push("today");
    if (selected)
      classes.push("selected");
    if (range && date) {
      const { start, end } = range;
      const isStart = wIsSameDate(date, start);
      const isEnd = wIsSameDate(date, end);
      if (isStart)
        classes.push("range-start");
      if (isEnd)
        classes.push("range-end");
      if (!isStart && !isEnd && wDateBetween(date, start, end))
        classes.push("in-range");
    }
    return `<button class="${classes.join(" ")}" type="button" role="gridcell" data-date="${iso}"${disabled ? " disabled" : ""}${selected ? ' aria-selected="true"' : ""}>${day}</button>`;
  }
  _events() {
    this._q(".w-date-picker-nav--prev")?.addEventListener("click", () => this._shiftView(-1));
    this._q(".w-date-picker-nav--next")?.addEventListener("click", () => this._shiftView(1));
    this._q(".w-date-picker-title")?.addEventListener("click", () => this._cycleView());
    this._qAll("[data-date]").forEach((button) => {
      button.addEventListener("click", () => {
        const date = wParseIsoDate(button.getAttribute("data-date"));
        if (date)
          this._select(date);
      });
      button.addEventListener("keydown", (event) => this._onDayKeyDown(event, button));
    });
    this._qAll("[data-month]").forEach((button) => {
      button.addEventListener("click", () => this._selectMonth(Number(button.getAttribute("data-month"))));
    });
    this._qAll("[data-year]").forEach((button) => {
      button.addEventListener("click", () => this._selectYear(Number(button.getAttribute("data-year"))));
    });
  }
  _cycleView() {
    const next = this.view === "date" ? "months" : this.view === "months" ? "years" : "date";
    this._setView(next);
  }
  _setView(view) {
    this._silentSet("view", view);
    this._render();
    this._events();
  }
  _selectMonth(month) {
    this._silentSet("month", month);
    this._setView("date");
    this._emit("change", { month, year: this.year, view: "date" });
  }
  _selectYear(year) {
    this._silentSet("year", year);
    this._setView("months");
    this._emit("change", { month: this.month, year, view: "months" });
  }
  _shiftView(delta) {
    if (this.view === "years") {
      this._silentSet("year", this.year + delta * 12);
    } else if (this.view === "months") {
      this._silentSet("year", this.year + delta);
    } else {
      const d = new Date(this.year, this.month - 1 + delta, 1);
      this._silentSet("month", d.getMonth() + 1);
      this._silentSet("year", d.getFullYear());
    }
    this._render();
    this._events();
    this._emit("change", { month: this.month, year: this.year, view: this.view });
  }
  _onDayKeyDown(event, button) {
    const current = wParseIsoDate(button.getAttribute("data-date"));
    if (!current)
      return;
    let delta = 0;
    if (event.key === "ArrowRight")
      delta = 1;
    else if (event.key === "ArrowLeft")
      delta = -1;
    else if (event.key === "ArrowDown")
      delta = 7;
    else if (event.key === "ArrowUp")
      delta = -7;
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._select(current);
      return;
    } else {
      return;
    }
    event.preventDefault();
    const next = new Date(current);
    next.setDate(current.getDate() + delta);
    const nextIso = wIsoDate(next);
    let nextButton = this._q(`[data-date="${nextIso}"]`);
    if (!nextButton) {
      this._silentSet("month", next.getMonth() + 1);
      this._silentSet("year", next.getFullYear());
      this._render();
      this._events();
      this._emit("change", { month: next.getMonth() + 1, year: next.getFullYear(), view: this.view });
      nextButton = this._q(`[data-date="${nextIso}"]`);
    }
    if (nextButton)
      nextButton.focus();
  }
  _select(date) {
    let nextValue = "";
    if (this.mode === "single") {
      nextValue = wIsoDate(date);
    } else if (this.mode === "multiple") {
      const dates = this._selectedDates();
      const index = dates.findIndex((d) => wIsSameDate(d, date));
      if (index >= 0)
        dates.splice(index, 1);
      else
        dates.push(date);
      nextValue = dates.map(wIsoDate).join(",");
    } else {
      const dates = this._selectedDates();
      if (dates.length === 0 || dates.length === 2) {
        nextValue = wIsoDate(date);
      } else {
        const start = dates[0];
        const ordered = [start, date].sort((a, b) => a.getTime() - b.getTime());
        nextValue = `${wIsoDate(ordered[0])},${wIsoDate(ordered[1])}`;
      }
    }
    this._silentSet("value", nextValue);
    this._render();
    this._events();
    this._emit("change", { value: nextValue });
  }
}
if (!customElements.get("w-date-picker"))
  customElements.define("w-date-picker", WDatePicker);

// src/components/defaults-provider.js
class WDefaultsProvider extends WElement {
  static attrs = ["defaults", "disabled"];
  _template() {
    return `<div class="w-defaults-provider"><slot></slot></div>`;
  }
  _parse(raw) {
    try {
      const parsed = JSON.parse(raw || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  }
  get _defaults() {
    return this._parse(this.getAttribute("defaults"));
  }
  _events() {
    this._applyDefaults();
    if (!this._observer) {
      this._observer = new MutationObserver(() => this._applyDefaults());
      this._observer.observe(this, { childList: true, subtree: true });
    }
  }
  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
  _ownerFor(el, key) {
    let node = el.parentElement;
    while (node) {
      if (node.tagName && node.tagName.toLowerCase() === "w-defaults-provider" && !node.hasAttribute("disabled")) {
        const defs = this._parse(node.getAttribute("defaults"));
        const governs = Object.keys(defs).some((sel) => {
          try {
            return el.matches(sel) && Object.prototype.hasOwnProperty.call(defs[sel] || {}, key);
          } catch (_) {
            return false;
          }
        });
        if (governs)
          return node;
      }
      node = node.parentElement;
    }
    return null;
  }
  _applyDefaults() {
    if (this._bool("disabled"))
      return;
    const defaults = this._defaults;
    Object.keys(defaults).forEach((selector) => {
      const attrs = defaults[selector] || {};
      let nodes;
      try {
        nodes = this.querySelectorAll(selector);
      } catch (_) {
        return;
      }
      nodes.forEach((el) => {
        Object.keys(attrs).forEach((name) => {
          if (el.hasAttribute(name))
            return;
          if (this._ownerFor(el, name) !== this)
            return;
          const value = attrs[name];
          if (value === false || value == null)
            return;
          el.setAttribute(name, value === true ? "" : String(value));
        });
      });
    });
  }
}
if (!customElements.get("w-defaults-provider"))
  customElements.define("w-defaults-provider", WDefaultsProvider);

// src/components/divider.js
class WDivider extends WElement {
  static attrs = ["vertical", "inset"];
  get vertical() {
    return this._bool("vertical");
  }
  get inset() {
    return this._bool("inset");
  }
  _template() {
    const cls = `w-divider${this.vertical ? " w-divider--vertical" : ""}${this.inset ? " w-divider--inset" : ""}`;
    return `<div class="${cls}" role="separator" aria-orientation="${this.vertical ? "vertical" : "horizontal"}"></div>`;
  }
}
if (!customElements.get("w-divider"))
  customElements.define("w-divider", WDivider);

// src/components/empty.js
var W_EMPTY_DEFAULT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>`;

class WEmpty extends WElement {
  static attrs = ["headline", "title", "text", "subtitle", "icon", "image", "size", "color", "bg-color", "justify", "action-text", "href", "text-width"];
  static justify = ["start", "center", "end"];
  static tokens = ["primary", "secondary", "tertiary", "success", "warning", "error", "info", "surface"];
  get headline() {
    return this._attr("headline", "");
  }
  get title() {
    return this._attr("title", "");
  }
  get text() {
    return this._attr("text", "") || this._attr("subtitle", "");
  }
  get icon() {
    return this._attr("icon", "");
  }
  get image() {
    return this._attr("image", "");
  }
  get justify() {
    const j = this._attr("justify", "");
    return this.constructor.justify.includes(j) ? j : "center";
  }
  get actionText() {
    return this._attr("action-text", "");
  }
  get href() {
    return this._attr("href", "");
  }
  _template() {
    const html = [
      `<div class="w-empty w-empty--${this.justify}"${this._style()}>`,
      this._media(),
      this._headline(),
      this._content(),
      this._actions(),
      `</div>`
    ];
    return html.join("");
  }
  _events() {
    const action = this._q("[data-w-empty-action]");
    if (action && !this.href)
      action.addEventListener("click", () => this._emit("click:action", { value: true }));
  }
  _media() {
    if (this._hasSlot("media"))
      return '<div class="w-empty-media"><slot name="media"></slot></div>';
    if (this.image)
      return `<div class="w-empty-media"><img class="w-empty-image" src="${this._esc(this.image)}" alt=""></div>`;
    if (this.icon)
      return `<div class="w-empty-media w-empty-icon" aria-hidden="true">${this._esc(this.icon)}</div>`;
    if (this._hasDefaultSlot())
      return '<div class="w-empty-media"><slot></slot></div>';
    return `<div class="w-empty-media" aria-hidden="true">${W_EMPTY_DEFAULT_ICON}</div>`;
  }
  _headline() {
    if (this._hasSlot("headline"))
      return '<div class="w-empty-headline"><slot name="headline"></slot></div>';
    if (this.headline)
      return `<div class="w-empty-headline">${this._esc(this.headline)}</div>`;
    return "";
  }
  _content() {
    const hasTitle = this._hasSlot("title") || this.title;
    const hasText = this._hasSlot("text") || this.text;
    if (!hasTitle && !hasText)
      return "";
    let html = '<div class="w-empty-content">';
    if (this._hasSlot("title"))
      html += '<p class="w-empty-title"><slot name="title"></slot></p>';
    else if (this.title)
      html += `<p class="w-empty-title">${this._esc(this.title)}</p>`;
    if (this._hasSlot("text"))
      html += '<p class="w-empty-subtitle"><slot name="text"></slot></p>';
    else if (this.text)
      html += `<p class="w-empty-subtitle">${this._esc(this.text)}</p>`;
    return html + "</div>";
  }
  _actions() {
    if (this._hasSlot("actions"))
      return '<div class="w-empty-actions"><slot name="actions"></slot></div>';
    if (this._hasSlot("action"))
      return '<div class="w-empty-actions"><slot name="action"></slot></div>';
    if (this.actionText) {
      const tag = this.href ? "a" : "button";
      const attrs = this.href ? ` href="${this._esc(this.href)}"` : ' type="button"';
      return `<div class="w-empty-actions"><${tag} class="w-btn w-btn--tonal" data-w-empty-action${attrs}>${this._esc(this.actionText)}</${tag}></div>`;
    }
    return "";
  }
  _style() {
    const s = [];
    const size = this._cssLength(this._attr("size", ""));
    const tw = this._cssLength(this._attr("text-width", ""));
    if (size)
      s.push("--w-empty-size: " + size);
    if (tw)
      s.push("--w-empty-text-width: " + tw);
    const c = this._token(this._attr("color", ""));
    if (c)
      s.push("--w-empty-accent: " + c.solid);
    const bg = this._token(this._attr("bg-color", ""));
    if (bg) {
      s.push("--w-empty-bg: " + (bg.bg || bg.solid));
      if (bg.fg)
        s.push("--w-empty-fg: " + bg.fg);
    }
    return s.length ? ` style="${s.join("; ")}"` : "";
  }
  _token(value) {
    const t = String(value || "").trim().toLowerCase();
    if (!t)
      return null;
    if (t === "surface")
      return { solid: "var(--w-surface)", bg: "var(--w-surface)", fg: "var(--w-text)" };
    if (!this.constructor.tokens.includes(t))
      return { solid: value };
    const n = t === "info" ? "primary" : t;
    return { solid: `var(--w-${n})`, bg: `var(--w-${n}-container)`, fg: `var(--w-on-${n}-container)` };
  }
  _cssLength(value) {
    const raw = String(value || "").trim();
    if (!raw)
      return "";
    return /^\d+(\.\d+)?$/.test(raw) ? raw + "px" : raw;
  }
  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
  _hasDefaultSlot() {
    return Array.from(this.childNodes).some((n) => {
      if (n.nodeType === Node.ELEMENT_NODE)
        return !n.hasAttribute("slot");
      if (n.nodeType === Node.TEXT_NODE)
        return n.textContent.trim().length > 0;
      return false;
    });
  }
}
customElements.define("w-empty", WEmpty);

// src/components/empty-state.js
class WEmptyState extends customElements.get("w-empty") {
}
if (!customElements.get("w-empty-state")) {
  customElements.define("w-empty-state", WEmptyState);
}

// src/components/expansion-panel.js
class WExpansionPanel extends WElement {
  static attrs = [
    "header",
    "title",
    "text",
    "value",
    "open",
    "disabled",
    "readonly",
    "static",
    "hide-actions",
    "expand-icon",
    "collapse-icon",
    "color",
    "bg-color",
    "elevation",
    "rounded",
    "tile"
  ];
  get header() {
    return this._attr("title", this._attr("header", ""));
  }
  get panelText() {
    return this._attr("text", "");
  }
  get value() {
    return this._attr("value", "");
  }
  get open() {
    return this._bool("open");
  }
  set open(v) {
    v ? this.setAttribute("open", "") : this.removeAttribute("open");
  }
  get disabled() {
    return !!(this._bool("disabled") || this.closest("w-expansion-panels")?._bool?.("disabled"));
  }
  get readonly() {
    return !!(this._bool("readonly") || this.closest("w-expansion-panels")?._bool?.("readonly"));
  }
  get isStatic() {
    return this._bool("static");
  }
  get hideActions() {
    return this._bool("hide-actions");
  }
  _template() {
    const isOpen = this.open ? " open" : "";
    const dis = this.disabled ? " disabled" : "";
    const headerAttr = this.header;
    const bodyId = this._bodyId || (this._bodyId = "w-expansion-panel-" + Math.random().toString(36).slice(2, 8));
    const icon = this.open ? this._attr("collapse-icon", "") : this._attr("expand-icon", "");
    const chevron = icon ? `<span class="w-expand-chevron" aria-hidden="true">${this._esc(icon)}</span>` : `<svg class="w-expand-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;
    const classes = [
      "w-expand",
      isOpen.trim(),
      this.disabled ? "w-expand--disabled" : "",
      this.readonly ? "w-expand--readonly" : "",
      this.isStatic ? "w-expand--static" : "",
      this.hideActions ? "w-expand--hide-actions" : "",
      this._bool("tile") ? "w-expand--tile" : ""
    ].filter(Boolean).join(" ");
    let html = `<div class="${classes}">`;
    html += `<button class="w-expand-header${this.isStatic ? " w-expand-header--static" : ""}"${dis} type="button" aria-expanded="${this.open ? "true" : "false"}" aria-controls="${bodyId}"${this.readonly ? ' aria-readonly="true"' : ""}>`;
    html += `<span class="w-expand-title">`;
    if (headerAttr)
      html += this._esc(headerAttr);
    html += `<slot name="title"></slot>`;
    html += `<slot name="header"></slot>`;
    html += `</span>`;
    if (!this.hideActions)
      html += `<span class="w-expansion-panel-title__icon">${chevron}</span>`;
    html += `</button>`;
    html += `<div class="w-expand-body w-expansion-panel-text" id="${bodyId}" role="region">`;
    html += `<div class="w-expansion-panel-text__wrapper">`;
    if (this.panelText)
      html += `<p>${this._esc(this.panelText)}</p>`;
    html += `<slot name="text"></slot><slot></slot>`;
    html += `</div></div>`;
    html += `</div>`;
    return html;
  }
  _events() {
    const btn = this._q(".w-expand-header");
    if (!btn || this.disabled)
      return;
    btn.addEventListener("click", () => {
      if (this.readonly || this.isStatic)
        return;
      const newOpen = !this.open;
      this.setOpen(newOpen);
      const panels = this.closest("w-expansion-panels");
      if (panels)
        panels._onItemToggle(this);
    });
  }
  setOpen(open, silent) {
    const next = !!open;
    const btn = this._q(".w-expand-header");
    const wrap = this._q(".w-expand");
    this._silentSet("open", next);
    if (btn)
      btn.setAttribute("aria-expanded", String(next));
    const done = () => {
      if (!silent)
        this._dispatch("toggle", { open: next, value: this._groupValue() });
    };
    if (wrap && window.WMotion && typeof window.WMotion.setExpand === "function") {
      window.WMotion.setExpand(wrap, next).then(done);
    } else {
      if (wrap)
        wrap.classList.toggle("open", next);
      done();
    }
  }
  _groupValue() {
    if (this.hasAttribute("value"))
      return this.getAttribute("value");
    const panels = this.closest("w-expansion-panels");
    if (!panels)
      return "";
    return String(Array.from(panels.querySelectorAll("w-expansion-panel")).indexOf(this));
  }
  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}
if (!customElements.get("w-expansion-panel")) {
  customElements.define("w-expansion-panel", WExpansionPanel);
}

// src/components/expansion-panel-title.js
class WExpansionPanelTitle extends WElement {
  _template() {
    return `<button class="w-expand-header w-expansion-panel-title" type="button">
      <span class="w-flex-1"><slot></slot></span>
      <svg class="w-expand-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>
    </button>`;
  }
}
if (!customElements.get("w-expansion-panel-title")) {
  customElements.define("w-expansion-panel-title", WExpansionPanelTitle);
}

// src/components/expansion-panel-text.js
class WExpansionPanelText extends WElement {
  _template() {
    return `<div class="w-expand-body w-expansion-panel-text"><slot></slot></div>`;
  }
}
if (!customElements.get("w-expansion-panel-text")) {
  customElements.define("w-expansion-panel-text", WExpansionPanelText);
}

// src/components/expansion-panels.js
class WExpansionPanels extends WElement {
  static attrs = [
    "value",
    "multiple",
    "single",
    "mandatory",
    "variant",
    "accordion",
    "flat",
    "tile",
    "rounded",
    "no-divider",
    "gap",
    "disabled",
    "readonly"
  ];
  get multiple() {
    return this._bool("multiple");
  }
  get single() {
    return this._bool("single") || !this.multiple;
  }
  get mandatory() {
    return this._bool("mandatory");
  }
  get variant() {
    const value = this._attr("variant", this._bool("accordion") ? "accordion" : "default");
    return ["default", "accordion", "inset", "popout"].includes(value) ? value : "default";
  }
  connectedCallback() {
    super.connectedCallback();
    this._observer = new MutationObserver(() => this._syncItems());
    this._observer.observe(this, { childList: true, subtree: false });
  }
  disconnectedCallback() {
    if (this._observer)
      this._observer.disconnect();
  }
  _template() {
    const classes = [
      "w-accordion",
      "w-expansion-panels",
      "w-accordion--variant-" + this.variant,
      this._bool("flat") ? "w-accordion--flat" : "",
      this._bool("tile") ? "w-accordion--tile" : "",
      this._bool("rounded") ? "w-accordion--rounded" : "",
      this._bool("no-divider") ? "w-accordion--no-divider" : ""
    ].filter(Boolean).join(" ");
    const gap = this._cssLength(this.getAttribute("gap"));
    return `<div class="${classes}"${gap ? ` style="--w-expansion-gap:${gap}"` : ""}><slot></slot></div>`;
  }
  _events() {
    this._syncFromModel();
    this._syncItems();
    if (!this._keyHandler) {
      this._keyHandler = (event) => this._onKeydown(event);
      this.addEventListener("keydown", this._keyHandler);
    }
  }
  _syncItems() {
    if (this.mandatory) {
      const firstEnabled = this._getItems().find((item) => !item.disabled);
      if (firstEnabled && !this._getItems().some((item) => item.open))
        firstEnabled.setOpen(true, true);
    }
    if (!this.single)
      return;
    const items = this._getItems();
    const openItems = items.filter((i) => i.open);
    if (openItems.length > 1) {
      openItems.slice(1).forEach((item) => {
        if (typeof item.setOpen === "function")
          item.setOpen(false, true);
        else
          item.open = false;
      });
    }
  }
  _getItems() {
    return Array.from(this.querySelectorAll("w-expansion-panel"));
  }
  _onItemToggle(toggledItem) {
    if (this.mandatory && !toggledItem.open && !this._getItems().some((item) => item.open)) {
      toggledItem.setOpen(true, true);
      return;
    }
    if (this.single && toggledItem.open) {
      const items = this._getItems();
      items.forEach((item) => {
        if (item !== toggledItem && item.open) {
          if (typeof item.setOpen === "function")
            item.setOpen(false, true);
          else
            item.open = false;
        }
      });
    }
    this._emitSelection();
  }
  _syncFromModel() {
    const raw = this.getAttribute("value");
    if (raw == null)
      return;
    const selected = this._parseModel(raw).map(String);
    const items = this._getItems();
    items.forEach((item, index) => {
      const value = this._itemValue(item, index);
      const shouldOpen = selected.includes(value);
      if (item.open !== shouldOpen && typeof item.setOpen === "function")
        item.setOpen(shouldOpen, true);
    });
  }
  _emitSelection() {
    const value = this._selectedValue();
    this._silentSet("value", Array.isArray(value) ? value.join(",") : value);
    this._dispatch("change", { value });
  }
  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    }));
  }
  _selectedValue() {
    const values = this._getItems().map((item, index) => item.open ? this._itemValue(item, index) : null).filter((value) => value != null);
    return this.multiple ? values : values[0] ?? null;
  }
  _itemValue(item, index) {
    return item.hasAttribute("value") ? item.getAttribute("value") : String(index);
  }
  _parseModel(raw) {
    const value = String(raw).trim();
    if (!value)
      return [];
    if (value.startsWith("[") && value.endsWith("]")) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed))
          return parsed;
      } catch (_) {
        return value.slice(1, -1).split(",").map((item) => item.trim()).filter(Boolean);
      }
    }
    return this.multiple ? value.split(",").map((item) => item.trim()).filter(Boolean) : [value];
  }
  _onKeydown(event) {
    const header = event.target.closest?.(".w-expand-header");
    if (!header || !this.contains(header))
      return;
    const headers = this._getItems().map((item) => item.querySelector(".w-expand-header")).filter((btn) => btn && !btn.disabled);
    const current = headers.indexOf(header);
    if (current < 0)
      return;
    let next = current;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      next = (current + 1) % headers.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      next = (current - 1 + headers.length) % headers.length;
    else if (event.key === "Home")
      next = 0;
    else if (event.key === "End")
      next = headers.length - 1;
    else
      return;
    event.preventDefault();
    headers[next]?.focus();
  }
  _cssLength(value) {
    const raw = String(value || "").trim();
    if (!raw)
      return "";
    if (/^\d+(\.\d+)?$/.test(raw))
      return raw + "px";
    if (/^\d+(\.\d+)?(px|rem|em|vh|vw|dvh|dvw|%)$/.test(raw))
      return raw;
    return "";
  }
}
if (!customElements.get("w-expansion-panels")) {
  customElements.define("w-expansion-panels", WExpansionPanels);
}

// src/components/fab.js
class WFab extends WElement {
  static attrs = ["icon", "icon-set", "label", "size", "color", "variant", "rounded", "fixed", "absolute", "position", "location", "active", "appear", "aria-label"];
  get icon() {
    return this._attr("icon", "+");
  }
  get iconSet() {
    return this._attr("icon-set", "");
  }
  get label() {
    return this._attr("label", "");
  }
  get size() {
    return this._attr("size", "");
  }
  get color() {
    return this._attr("color", "");
  }
  get variant() {
    return this._attr("variant", "elevated");
  }
  get rounded() {
    return this._attr("rounded", "");
  }
  get fixed() {
    return this._bool("fixed");
  }
  get absolute() {
    return this._bool("absolute");
  }
  get position() {
    return this._attr("position", "");
  }
  get location() {
    return this._attr("location", "");
  }
  get active() {
    return this._bool("active");
  }
  get appear() {
    return this._bool("appear");
  }
  _template() {
    const size = this.size;
    const sizeClass = size ? " w-fab--" + size : "";
    const fixedClass = this.fixed ? " w-fab--fixed" : "";
    const absoluteClass = this.absolute ? " w-fab--absolute" : "";
    const extendedClass = this.label ? " w-fab--extended" : "";
    const loc = this.location || this.position || "";
    const locParts = loc.split(/[-\s]+/);
    const vPos = locParts[0] || "";
    const hPos = locParts[1] || "";
    const vClass = vPos ? " w-fab--" + vPos : "";
    const hClass = hPos ? " w-fab--" + hPos : "";
    const locClass = fixedClass || absoluteClass ? vClass + hClass : "";
    const color = this.color;
    const colorClass = color ? " w-fab--color-" + color : "";
    const variant = this.variant;
    const variantClass = variant && variant !== "elevated" ? " w-fab--variant-" + variant : "";
    const rounded = this.rounded;
    const roundedClass = rounded ? rounded === "true" || rounded === "" ? " w-fab--rounded" : " w-fab--rounded-" + rounded : "";
    const activeClass = this.active ? " w-fab--active" : "";
    const label = this.label ? `<span class="w-fab__label">${this._esc(this.label)}</span>` : "";
    const aria = this.getAttribute("aria-label") || this.label || this.icon;
    const iconSet = this.iconSet;
    const value = iconSet ? `${iconSet}:${this.icon}` : this.icon;
    const icon = icons_default.resolve(value, { iconClass: "w-icon" });
    return `<button class="w-fab${sizeClass}${fixedClass}${absoluteClass}${extendedClass}${locClass}${colorClass}${variantClass}${roundedClass}${activeClass}" type="button" aria-label="${this._esc(aria)}">
      ${icon}${label}<slot></slot>
    </button>`;
  }
  _events() {
    const btn = this._q("button");
    if (!btn)
      return;
    btn.addEventListener("click", (e) => {
      this._emit("click", { originalEvent: e });
    });
  }
}
if (!customElements.get("w-fab"))
  customElements.define("w-fab", WFab);

// src/components/field.js
class WField extends WElement {
  static attrs = ["label", "hint", "error"];
  get label() {
    return this._attr("label", "");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get error() {
    return this._attr("error", "");
  }
  _template() {
    return `<label class="w-field${this.error ? " error" : ""}">
      ${this.label ? `<span class="w-label">${this._esc(this.label)}</span>` : ""}
      <slot></slot>
      ${this.error || this.hint ? `<span class="w-messages">${this._esc(this.error || this.hint)}</span>` : ""}
    </label>`;
  }
}
if (!customElements.get("w-field"))
  customElements.define("w-field", WField);

// src/components/file-input.js
var SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"];
function formatSize(bytes) {
  if (bytes == null || bytes === 0)
    return "0 B";
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), SIZE_UNITS.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${SIZE_UNITS[i]}`;
}
function truncateName(name, len = 22) {
  if (!len || name.length <= len)
    return name;
  const first = Math.floor((len - 1) / 2);
  const last = len - first - 1;
  return name.slice(0, first) + "…" + name.slice(name.length - last);
}
function toFileList(files) {
  try {
    const dt = new DataTransfer;
    files.forEach((f) => dt.items.add(f));
    return dt.files;
  } catch (e) {
    return null;
  }
}

class WFileInput extends WElement {
  static attrs = [
    "label",
    "accept",
    "multiple",
    "disabled",
    "readonly",
    "chips",
    "small-chips",
    "counter",
    "show-size",
    "clearable",
    "placeholder",
    "hint",
    "error",
    "truncate-length",
    "density",
    "name"
  ];
  constructor() {
    super();
    this._files = [];
  }
  get label() {
    return this._attr("label", "Choose file");
  }
  get accept() {
    return wValueList(this._attr("accept", "")).join(",");
  }
  get multiple() {
    return this._bool("multiple");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get readonly() {
    return this._bool("readonly");
  }
  get chips() {
    return this._bool("chips");
  }
  get smallChips() {
    return this._bool("small-chips");
  }
  get counter() {
    return this._bool("counter");
  }
  get showSize() {
    return this._bool("show-size");
  }
  get clearable() {
    return this._bool("clearable");
  }
  get placeholder() {
    return this._attr("placeholder", "");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get error() {
    return this._attr("error", "");
  }
  get truncateLength() {
    const n = parseInt(this._attr("truncate-length", "22"), 10);
    return Number.isNaN(n) ? 22 : n;
  }
  get density() {
    return this._attr("density", "");
  }
  get name() {
    return this._attr("name", "");
  }
  get files() {
    return Array.from(this._files);
  }
  set files(value) {
    this._files = value ? Array.from(value) : [];
    if (this._rendered) {
      this._render();
      this._events();
      this._applyCommonProps();
    }
  }
  get _enhanced() {
    return this.chips || this.smallChips || this.counter || this.showSize || this.clearable || this.placeholder || this.hint || this.error || this.density || this.readonly;
  }
  _template() {
    if (!this._enhanced) {
      return `<label class="w-file-input">
        <span class="w-file-input-label">${this._esc(this.label)}</span>
        <span class="w-file-input-name">${this._esc(this._fileNames()) || "No file chosen"}</span>
        <input type="file"${this._inputAttrs()}>
      </label>`;
    }
    const rootClass = [
      "w-file-input",
      "w-file-input--field",
      this.density ? `w-file-input--density-${this.density}` : ""
    ].filter(Boolean).join(" ");
    const messageParts = [];
    if (this.error)
      messageParts.push(this.error);
    else if (this.hint)
      messageParts.push(this.hint);
    if (this.counter && !this.error)
      messageParts.push(this._counterText());
    const message = messageParts.join(" · ");
    const fieldClass = this.error ? "w-field w-field-error" : "w-field";
    return `<div class="${fieldClass}">
      ${this.label ? `<label class="w-field-label">${this._esc(this.label)}</label>` : ""}
      <div class="${rootClass}">
        <label class="w-file-input-field">
          <input type="file"${this._inputAttrs()}>
          ${this._selectionTemplate()}
          ${!this._files.length && this.placeholder ? `<span class="w-file-input-placeholder">${this._esc(this.placeholder)}</span>` : ""}
        </label>
        ${this.clearable && this._files.length && !this.disabled ? `<button class="w-file-input-clear" type="button" aria-label="Clear files">×</button>` : ""}
      </div>
      ${message ? `<span class="w-field-hint">${this._esc(message)}</span>` : ""}
    </div>`;
  }
  _inputAttrs() {
    const attrs = [];
    if (this.accept)
      attrs.push(` accept="${this._esc(this.accept)}"`);
    if (this.multiple)
      attrs.push(" multiple");
    if (this.disabled)
      attrs.push(" disabled");
    if (this.readonly)
      attrs.push(' readonly tabindex="-1"');
    if (this.name)
      attrs.push(` name="${this._esc(this.name)}"`);
    return attrs.join("");
  }
  _fileNames() {
    if (!this._files.length)
      return "";
    return this._files.map((f) => truncateName(f.name, this.truncateLength)).join(", ");
  }
  _counterText() {
    const count = this._files.length;
    const total = this._files.reduce((sum, f) => sum + (f.size || 0), 0);
    return `${count} file${count !== 1 ? "s" : ""}${total ? ` (${formatSize(total)})` : ""}`;
  }
  _selectionTemplate() {
    if (!this._files.length)
      return "";
    if (this.chips || this.smallChips) {
      const chipSize = this.smallChips ? "w-chip--x-small" : "w-chip--small";
      return `<span class="w-file-input-chips">${this._files.map((file, i) => `
        <span class="w-chip w-chip-tonal ${chipSize} w-file-input-chip" data-index="${i}">
          <span class="w-chip__content">${this._esc(truncateName(file.name, this.truncateLength))}</span>
          ${this.showSize ? `<span class="w-chip__append">${this._esc(formatSize(file.size))}</span>` : ""}
          <span class="w-chip__close w-chip-close" role="button" tabindex="0" aria-label="Remove ${this._esc(file.name)}">×</span>
        </span>
      `).join("")}</span>`;
    }
    return `<span class="w-file-input-name">${this._esc(this._fileNames())}</span>`;
  }
  _events() {
    const input = this._q('input[type="file"]');
    const field = this._q(".w-file-input-field");
    const clear = this._q(".w-file-input-clear");
    if (input) {
      input.addEventListener("change", (event) => {
        event.stopPropagation();
        const files = Array.from(event.target.files || []);
        this._files = files;
        this._render();
        this._events();
        this._applyCommonProps();
        this._emitFiles("change");
        this._emitFiles("input");
      });
      input.addEventListener("click", (event) => {
        if (this.readonly)
          event.preventDefault();
      });
      const list = toFileList(this._files);
      if (list)
        input.files = list;
    }
    if (field) {
      field.addEventListener("dragover", (event) => {
        event.preventDefault();
        field.classList.add("w-file-input--dragover");
      });
      field.addEventListener("dragleave", () => {
        field.classList.remove("w-file-input--dragover");
      });
      field.addEventListener("drop", (event) => {
        event.preventDefault();
        field.classList.remove("w-file-input--dragover");
        if (this.disabled || this.readonly)
          return;
        const dropped = Array.from(event.dataTransfer?.files || []);
        this._files = this.multiple ? dropped : dropped.slice(0, 1);
        this._render();
        this._events();
        this._applyCommonProps();
        this._emitFiles("change");
        this._emitFiles("input");
      });
    }
    if (clear) {
      clear.addEventListener("click", (event) => {
        event.stopPropagation();
        this._clear();
      });
    }
    this._qAll(".w-file-input-chip .w-chip-close").forEach((btn) => {
      const onActivate = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const chip = btn.closest(".w-file-input-chip");
        const index = parseInt(chip?.getAttribute("data-index"), 10);
        if (!Number.isNaN(index))
          this._removeFile(index);
      };
      btn.addEventListener("click", onActivate);
      btn.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ")
          return;
        onActivate(event);
      });
    });
  }
  _emitFiles(eventName) {
    const files = this.files.map((file) => ({ name: file.name, size: file.size, type: file.type }));
    this._emit(eventName, { files, value: files });
  }
  _removeFile(index) {
    this._files.splice(index, 1);
    this._render();
    this._events();
    this._applyCommonProps();
    this._emitFiles("change");
  }
  _clear() {
    this._files = [];
    this._render();
    this._events();
    this._applyCommonProps();
    this._emit("change", { files: [], value: [] });
  }
}
if (!customElements.get("w-file-input"))
  customElements.define("w-file-input", WFileInput);

// src/components/file-upload.js
function toFileList2(files) {
  try {
    const dt = new DataTransfer;
    files.forEach((f) => dt.items.add(f));
    return dt.files;
  } catch (e) {
    return null;
  }
}

class WFileUpload extends WElement {
  static attrs = [
    "title",
    "subtitle",
    "browse-text",
    "divider-text",
    "icon",
    "accept",
    "multiple",
    "disabled",
    "readonly",
    "clearable",
    "show-size",
    "density"
  ];
  constructor() {
    super();
    this._files = [];
  }
  get title() {
    return this._attr("title", "Upload files");
  }
  get subtitle() {
    return this._attr("subtitle", "Drag and drop files here");
  }
  get browseText() {
    return this._attr("browse-text", "Browse");
  }
  get dividerText() {
    return this._attr("divider-text", "or");
  }
  get icon() {
    return this._attr("icon", "⬆");
  }
  get accept() {
    return wValueList(this._attr("accept", "")).join(",");
  }
  get multiple() {
    return this._bool("multiple");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get readonly() {
    return this._bool("readonly");
  }
  get clearable() {
    return this._bool("clearable");
  }
  get showSize() {
    return this._bool("show-size");
  }
  get density() {
    return this._attr("density", "");
  }
  get files() {
    return Array.from(this._files);
  }
  set files(value) {
    this._files = value ? Array.from(value) : [];
    if (this._rendered) {
      this._render();
      this._events();
      this._applyCommonProps();
    }
  }
  _template() {
    const dropClass = [
      "w-file-upload-dropzone",
      this.density ? `w-file-upload-dropzone--density-${this.density}` : "",
      this.disabled ? "w-file-upload-dropzone--disabled" : "",
      this.readonly ? "w-file-upload-dropzone--readonly" : ""
    ].filter(Boolean).join(" ");
    return `<div class="w-file-upload">
      <div class="${dropClass}" tabindex="${this.disabled ? "-1" : "0"}" role="button" aria-label="${this._esc(this.title)}">
        <input type="file"${this._inputAttrs()}>
        <div class="w-file-upload-icon">${this.icon}</div>
        <div class="w-file-upload-title">${this._esc(this.title)}</div>
        <div class="w-file-upload-divider"><span>${this._esc(this.dividerText)}</span></div>
        <button class="w-file-upload-browse w-btn w-btn-tonal" type="button"${this.disabled ? " disabled" : ""}>${this._esc(this.browseText)}</button>
        ${this.subtitle ? `<div class="w-file-upload-subtitle">${this._esc(this.subtitle)}</div>` : ""}
      </div>
      ${this._files.length ? this._listTemplate() : ""}
    </div>`;
  }
  _inputAttrs() {
    const attrs = [];
    if (this.accept)
      attrs.push(` accept="${this._esc(this.accept)}"`);
    if (this.multiple)
      attrs.push(" multiple");
    if (this.disabled)
      attrs.push(" disabled");
    if (this.readonly)
      attrs.push(" readonly");
    return attrs.join("");
  }
  _listTemplate() {
    return `<div class="w-file-upload-list">${this._files.map((file, i) => `
      <div class="w-file-upload-item" data-index="${i}">
        <span class="w-file-upload-item-name">${this._esc(truncateName(file.name, 40))}</span>
        ${this.showSize ? `<span class="w-file-upload-item-size">${this._esc(formatSize(file.size))}</span>` : ""}
        ${this.clearable ? `<button class="w-file-upload-item-remove" type="button" aria-label="Remove ${this._esc(file.name)}" tabindex="0">×</button>` : ""}
      </div>
    `).join("")}</div>`;
  }
  _events() {
    const dropzone = this._q(".w-file-upload-dropzone");
    const input = this._q('input[type="file"]');
    const browse = this._q(".w-file-upload-browse");
    if (input) {
      input.addEventListener("change", (event) => {
        event.stopPropagation();
        const selected = Array.from(event.target.files || []);
        this._addFiles(selected);
      });
      const list = toFileList2(this._files);
      if (list)
        input.files = list;
    }
    if (dropzone) {
      dropzone.addEventListener("click", (event) => {
        if (event.target.closest(".w-file-upload-browse, .w-file-upload-item-remove"))
          return;
        if (this.disabled || this.readonly)
          return;
        input?.click();
      });
      dropzone.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ")
          return;
        event.preventDefault();
        if (this.disabled || this.readonly)
          return;
        input?.click();
      });
      dropzone.addEventListener("dragover", (event) => {
        event.preventDefault();
        if (this.disabled || this.readonly)
          return;
        dropzone.classList.add("w-file-upload-dropzone--dragover");
      });
      dropzone.addEventListener("dragleave", (event) => {
        event.preventDefault();
        if (!dropzone.contains(event.relatedTarget)) {
          dropzone.classList.remove("w-file-upload-dropzone--dragover");
        }
      });
      dropzone.addEventListener("drop", (event) => {
        event.preventDefault();
        dropzone.classList.remove("w-file-upload-dropzone--dragover");
        if (this.disabled || this.readonly)
          return;
        const dropped = Array.from(event.dataTransfer?.files || []);
        this._addFiles(dropped);
      });
      dropzone.addEventListener("paste", (event) => {
        if (this.disabled || this.readonly)
          return;
        const pasted = Array.from(event.clipboardData?.files || []);
        if (!pasted.length)
          return;
        event.preventDefault();
        this._addFiles(pasted);
      });
    }
    if (browse) {
      browse.addEventListener("click", (event) => {
        event.stopPropagation();
        if (this.disabled || this.readonly)
          return;
        input?.click();
      });
    }
    this._qAll(".w-file-upload-item-remove").forEach((btn) => {
      const handler = (event) => {
        event.stopPropagation();
        const item = btn.closest(".w-file-upload-item");
        const index = parseInt(item?.getAttribute("data-index"), 10);
        if (!Number.isNaN(index))
          this._removeFile(index);
      };
      btn.addEventListener("click", handler);
      btn.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ")
          return;
        handler(event);
      });
    });
  }
  _addFiles(files) {
    if (!files.length)
      return;
    this._files = this.multiple ? [...this._files, ...files] : files.slice(0, 1);
    this._render();
    this._events();
    this._applyCommonProps();
    this._emitFiles("change");
    this._emitFiles("input");
  }
  _removeFile(index) {
    this._files.splice(index, 1);
    this._render();
    this._events();
    this._applyCommonProps();
    this._emitFiles("change");
  }
  _emitFiles(eventName) {
    const files = this.files.map((file) => ({ name: file.name, size: file.size, type: file.type }));
    this._emit(eventName, { files, value: files });
  }
}
if (!customElements.get("w-file-upload"))
  customElements.define("w-file-upload", WFileUpload);

// src/components/footer.js
class WFooter extends WElement {
  static attrs = [
    "color",
    "height",
    "border",
    "elevation",
    "rounded",
    "app"
  ];
  get color() {
    return this._attr("color", "");
  }
  get height() {
    return this._attr("height", "");
  }
  get border() {
    return this._bool("border");
  }
  get elevation() {
    return this._attr("elevation", "");
  }
  get rounded() {
    return this._attr("rounded", "");
  }
  get app() {
    return this._bool("app");
  }
  _template() {
    const classes = [
      "w-footer",
      this.border ? "w-footer--border" : "",
      this.app ? "w-footer--app" : "",
      this._roundedClass(),
      this._elevationClass(),
      this._colorClass()
    ].filter(Boolean).join(" ");
    const style = this._styleAttr();
    return `<footer class="${classes}"${style}><slot></slot></footer>`;
  }
  _roundedClass() {
    if (!this.hasAttribute("rounded"))
      return "";
    const value = this.rounded;
    if (!value || value === "true")
      return "w-footer--rounded";
    return `w-footer--rounded-${value}`;
  }
  _elevationClass() {
    const e = this.elevation;
    if (!e)
      return "";
    const num = parseInt(e, 10);
    if (num >= 1 && num <= 5)
      return `w-footer--elevation-${num}`;
    return "";
  }
  _colorClass() {
    const color = this.color;
    if (!color)
      return "";
    const token = color.toLowerCase().trim();
    const semantic = ["primary", "secondary", "success", "warning", "error", "surface"];
    if (semantic.includes(token))
      return `w-footer--color-${token}`;
    return "";
  }
  _styleAttr() {
    const styles = [];
    const height = this._resolveHeight();
    if (height)
      styles.push(`--w-footer-height: ${height}`);
    const color = this.color;
    if (color) {
      const token = color.toLowerCase().trim();
      const semantic = ["primary", "secondary", "success", "warning", "error", "surface"];
      if (!semantic.includes(token)) {
        styles.push(`--w-footer-bg: ${color}`);
        styles.push(`--w-footer-color: #ffffff`);
      }
    }
    if (styles.length)
      return ` style="${styles.join("; ")}"`;
    return "";
  }
  _resolveHeight() {
    const h = this.height;
    if (!h)
      return "";
    const num = parseFloat(h);
    if (!isNaN(num) && String(num) === String(h).trim())
      return `${num}px`;
    return h;
  }
}
if (!customElements.get("w-footer")) {
  customElements.define("w-footer", WFooter);
}

// src/components/form.js
class WForm extends WElement {
  static attrs = ["fast-fail", "validate-on"];
  get fastFail() {
    return this.hasAttribute("fast-fail");
  }
  get validateOn() {
    return this._attr("validate-on", "input");
  }
  get isDisabled() {
    return this.hasAttribute("disabled");
  }
  get isReadonly() {
    return this.hasAttribute("readonly");
  }
  get items() {
    return this._fields();
  }
  get errors() {
    return this._errors || [];
  }
  get isValidating() {
    return false;
  }
  get isValid() {
    const v = this.getAttribute("value");
    return v == null ? null : v === "true";
  }
  _template() {
    return `<form class="w-form" novalidate><slot></slot></form>`;
  }
  _events() {
    this._applyState();
    if (this._formBound)
      return;
    this._formBound = true;
    this.addEventListener("submit", (event) => this._onSubmit(event));
    this.addEventListener("input", (event) => this._onFieldEvent(event, "input"), true);
    this.addEventListener("blur", (event) => this._onFieldEvent(event, "blur"), true);
  }
  validate() {
    const errors = [];
    let valid = true;
    this._fields().forEach((el, i) => {
      if (!valid && this.fastFail)
        return;
      const ok = el.validity.valid;
      this._mark(el, ok);
      if (!ok) {
        valid = false;
        errors.push({ id: this._fieldId(el, i), errorMessages: [el.validationMessage] });
      }
    });
    this._errors = errors;
    this._setValidity(this._fields().length ? valid : null);
    return { valid, errors };
  }
  reset() {
    this.querySelector("form")?.reset();
    this.resetValidation();
  }
  resetValidation() {
    this._fields().forEach((el) => this._mark(el, null));
    this._errors = [];
    this._setValidity(null);
  }
  _fields() {
    return Array.from(this.querySelectorAll("input, select, textarea")).filter((el) => el.willValidate);
  }
  _fieldId(el, i) {
    return el.name || el.id || "field-" + i;
  }
  _onSubmit(event) {
    if (event.target === this)
      return;
    event.stopImmediatePropagation();
    const result = this.validate();
    this._emit("submit", { valid: result.valid, errors: result.errors });
    const form = this.querySelector("form");
    if (!event.defaultPrevented && result.valid && form && form.getAttribute("action")) {
      form.submit();
    }
    event.preventDefault();
  }
  _onFieldEvent(event, kind) {
    if (!this.validateOn.split(/\s+/).includes(kind))
      return;
    const el = event.target;
    if (!el || !this._fields().includes(el))
      return;
    this._mark(el, el.validity.valid);
    this._refreshValidity();
  }
  _refreshValidity() {
    const states = this._fields().map((el) => el.dataset.wValidated);
    if (states.some((s) => s === "invalid"))
      return this._setValidity(false);
    if (states.length && states.every((s) => s === "valid"))
      return this._setValidity(true);
    this._setValidity(null);
  }
  _mark(el, ok) {
    if (ok === null) {
      el.removeAttribute("aria-invalid");
      delete el.dataset.wValidated;
    } else {
      el.dataset.wValidated = ok ? "valid" : "invalid";
      if (ok)
        el.removeAttribute("aria-invalid");
      else
        el.setAttribute("aria-invalid", "true");
    }
    const field = el.closest(".w-field");
    if (field)
      field.classList.toggle("w-field-error", ok === false);
  }
  _setValidity(value) {
    if (this._validity === value)
      return;
    this._validity = value;
    this._silentSet("value", value === null ? null : value ? "true" : "false");
    this._emit("change", { value });
  }
  _applyState() {
    const dis = this.isDisabled;
    const ro = this.isReadonly;
    this.querySelectorAll("input, select, textarea, button").forEach((el) => {
      this._cascade(el, "disabled", dis);
      if ("readOnly" in el)
        this._cascade(el, "readOnly", ro);
    });
  }
  _cascade(el, prop, on) {
    const flag = "wForm" + prop;
    if (on) {
      if (!el[prop]) {
        el[prop] = true;
        el.dataset[flag] = "1";
      }
    } else if (el.dataset[flag]) {
      el[prop] = false;
      delete el.dataset[flag];
    }
  }
}
if (!customElements.get("w-form"))
  customElements.define("w-form", WForm);

// src/components/hotkey.js
var KEYS = {
  cmd: { mac: "⌘", pc: "Ctrl", symbol: "⌘", text: "Command" },
  meta: { mac: "⌘", pc: "Ctrl", symbol: "⌘", text: "Command" },
  command: { mac: "⌘", pc: "Ctrl", symbol: "⌘", text: "Command" },
  super: { mac: "⌘", pc: "Win", symbol: "⌘", text: "Super" },
  win: { mac: "⌘", pc: "Win", symbol: "⊞", text: "Windows" },
  ctrl: { mac: "⌃", pc: "Ctrl", symbol: "⌃", text: "Control" },
  control: { mac: "⌃", pc: "Ctrl", symbol: "⌃", text: "Control" },
  alt: { mac: "⌥", pc: "Alt", symbol: "⌥", text: "Alt" },
  option: { mac: "⌥", pc: "Alt", symbol: "⌥", text: "Option" },
  opt: { mac: "⌥", pc: "Alt", symbol: "⌥", text: "Option" },
  shift: { mac: "⇧", pc: "Shift", symbol: "⇧", text: "Shift" },
  enter: { mac: "↵", pc: "Enter", symbol: "↵", text: "Enter" },
  return: { mac: "↵", pc: "Enter", symbol: "↵", text: "Enter" },
  backspace: { mac: "⌫", pc: "Backspace", symbol: "⌫", text: "Backspace" },
  delete: { mac: "⌦", pc: "Delete", symbol: "⌦", text: "Delete" },
  del: { mac: "⌦", pc: "Delete", symbol: "⌦", text: "Delete" },
  escape: { mac: "⎋", pc: "Esc", symbol: "⎋", text: "Escape" },
  esc: { mac: "⎋", pc: "Esc", symbol: "⎋", text: "Escape" },
  tab: { mac: "⇥", pc: "Tab", symbol: "⇥", text: "Tab" },
  space: { mac: "Space", pc: "Space", symbol: "␣", text: "Space" },
  up: { mac: "↑", pc: "↑", symbol: "↑", text: "Up" },
  down: { mac: "↓", pc: "↓", symbol: "↓", text: "Down" },
  left: { mac: "←", pc: "←", symbol: "←", text: "Left" },
  right: { mac: "→", pc: "→", symbol: "→", text: "Right" },
  arrowup: { mac: "↑", pc: "↑", symbol: "↑", text: "Up" },
  arrowdown: { mac: "↓", pc: "↓", symbol: "↓", text: "Down" },
  arrowleft: { mac: "←", pc: "←", symbol: "←", text: "Left" },
  arrowright: { mac: "→", pc: "→", symbol: "→", text: "Right" }
};

class WHotkey extends WElement {
  static attrs = ["keys", "platform", "display-mode", "variant", "disabled"];
  get keys() {
    return this._attr("keys", "");
  }
  get displayMode() {
    return this._attr("display-mode", "icon");
  }
  get variant() {
    return this._attr("variant", "contained");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get platform() {
    const p = this._attr("platform", "");
    if (p)
      return p;
    const ua = (typeof navigator !== "undefined" && (navigator.userAgentData && navigator.userAgentData.platform || navigator.platform || "")).toLowerCase();
    return ua.includes("mac") ? "mac" : "pc";
  }
  get _sequence() {
    return this.keys.split("-").map((step) => step.trim()).filter(Boolean).map((step) => step.split("+").map((k) => k.trim()).filter(Boolean));
  }
  _label(token) {
    const def = KEYS[token.toLowerCase()];
    if (def) {
      if (this.displayMode === "symbol")
        return def.symbol;
      if (this.displayMode === "text")
        return def.text;
      return this.platform === "mac" ? def.mac : def.pc;
    }
    return token.length === 1 ? token.toUpperCase() : token.charAt(0).toUpperCase() + token.slice(1);
  }
  _ariaLabel() {
    return this._sequence.map((combo) => combo.map((k) => (KEYS[k.toLowerCase()] || {}).text || this._label(k)).join(" + ")).join(", then ");
  }
  _template() {
    const cls = [
      "w-hotkey",
      "w-hotkey--" + this._esc(this.variant),
      this.disabled ? "w-hotkey--disabled" : ""
    ].filter(Boolean).join(" ");
    const steps = this._sequence.map((combo) => combo.map((key) => `<kbd class="w-kbd w-hotkey-key">${this._esc(this._label(key))}</kbd>`).join(""));
    const inner = steps.join('<span class="w-hotkey-then">then</span>');
    const disabled = this.disabled ? ' aria-disabled="true"' : "";
    return `<span class="${cls}" role="img" aria-label="${this._esc(this._ariaLabel())}"${disabled}>${inner}</span>`;
  }
}
if (!customElements.get("w-hotkey"))
  customElements.define("w-hotkey", WHotkey);

// src/components/hover.js
class WHover extends WElement {
  static attrs = ["active", "model-value", "disabled", "open-delay", "close-delay"];
  get active() {
    return wBoolAttr(this, "active") || wBoolAttr(this, "model-value");
  }
  get disabled() {
    return wBoolAttr(this, "disabled");
  }
  get openDelay() {
    return wNumberAttr(this, "open-delay", 0);
  }
  get closeDelay() {
    return wNumberAttr(this, "close-delay", 0);
  }
  _template() {
    return `<div class="w-hover${this.active ? " is-hovering" : ""}" data-hover-root data-hovering="${this.active}">
      <slot></slot>
    </div>`;
  }
  _events() {
    const root = this._q("[data-hover-root]");
    if (!root)
      return;
    root.addEventListener("mouseenter", () => this._setHover(true));
    root.addEventListener("mouseleave", () => this._setHover(false));
    root.addEventListener("focusin", () => this._setHover(true));
    root.addEventListener("focusout", () => this._setHover(false));
  }
  _setHover(value) {
    clearTimeout(this.__hoverTimer);
    const delay = value ? this.openDelay : this.closeDelay;
    this.__hoverTimer = setTimeout(() => {
      const root = this._q("[data-hover-root]");
      root?.classList.toggle("is-hovering", value);
      root?.setAttribute("data-hovering", String(value));
      if (!this.disabled) {
        this._silentSet("active", value ? "" : null);
        if (this.hasAttribute("model-value"))
          this._silentSet("model-value", value ? "" : null);
        this._emit("update:model-value", value);
        this._emit("change", { value });
      }
    }, delay);
  }
}
if (!customElements.get("w-hover"))
  customElements.define("w-hover", WHover);

// src/components/icon.js
class WIcon extends WElement {
  static attrs = ["name", "icon", "size", "icon-set", "icon-class", "color", "disabled", "start", "end", "opacity"];
  static sizeAliases = { xs: "x-small", sm: "small", md: "default", lg: "large", xl: "x-large" };
  static sizes = ["x-small", "small", "default", "large", "x-large"];
  static colors = ["primary", "secondary", "tertiary", "success", "warning", "error", "danger", "info"];
  get name() {
    return this._attr("name", this._attr("icon", ""));
  }
  get size() {
    return this._attr("size", "");
  }
  _template() {
    const iconSet = this.getAttribute("icon-set") || "";
    const sizeRaw = String(this.size || "").toLowerCase();
    const sizeAlias = this.constructor.sizeAliases[sizeRaw] || sizeRaw;
    const isNamedSize = this.constructor.sizes.includes(sizeAlias);
    const classes = [
      this.getAttribute("icon-class") || "w-icon",
      isNamedSize ? "w-icon--" + sizeAlias : "",
      this._bool("start") ? "w-icon--start" : "",
      this._bool("end") ? "w-icon--end" : "",
      this._bool("disabled") ? "w-icon--disabled" : ""
    ].filter(Boolean).join(" ");
    const value = iconSet ? `${iconSet}:${this.name}` : this.name;
    let resolved = icons_default.resolve(value, { iconClass: classes });
    const styles = [];
    if (this.size && !isNamedSize)
      styles.push(`font-size: ${this._esc(this.size)}`);
    const color = this._color();
    if (color)
      styles.push(`color: ${color}`);
    const opacity = this.getAttribute("opacity");
    if (opacity != null && opacity !== "")
      styles.push(`--w-icon-opacity: ${this._esc(opacity)}`);
    if (styles.length)
      resolved = resolved.replace(/(class="[^"]*")/, `$1 style="${styles.join("; ")}"`);
    if (!resolved.includes("<slot"))
      resolved += "<slot></slot>";
    return resolved;
  }
  _color() {
    const raw = String(this._attr("color", "")).toLowerCase();
    if (!raw)
      return "";
    const map = { danger: "error", info: "primary" };
    if (this.constructor.colors.includes(raw))
      return `var(--w-${map[raw] || raw})`;
    return this.getAttribute("color");
  }
}
if (!customElements.get("w-icon"))
  customElements.define("w-icon", WIcon);

// src/components/icon-btn.js
class WIconBtn extends WElement {
  static attrs = ["icon", "icon-set", "aria-label"];
  get icon() {
    return this._attr("icon", "");
  }
  get iconSet() {
    return this._attr("icon-set", "");
  }
  _template() {
    const label = this.getAttribute("aria-label") || this.icon || "Icon button";
    const iconSet = this.iconSet;
    const value = iconSet ? `${iconSet}:${this.icon}` : this.icon;
    const icon = icons_default.resolve(value, { iconClass: "w-icon" });
    return `<button class="w-btn w-btn-icon" type="button" aria-label="${this._esc(label)}">${icon}<slot></slot></button>`;
  }
}
if (!customElements.get("w-icon-btn"))
  customElements.define("w-icon-btn", WIconBtn);

// src/components/img.js
class WImg extends WElement {
  static attrs = ["src", "alt", "cover", "fit", "position", "gradient", "aspect-ratio", "width", "height", "max-width", "max-height", "min-width", "min-height", "lazy-src", "eager", "srcset", "sizes", "color", "rounded", "draggable"];
  static colors = ["primary", "secondary", "tertiary", "success", "warning", "error", "danger", "info", "surface"];
  get src() {
    return this._attr("src", "");
  }
  get alt() {
    return this._attr("alt", "");
  }
  _len(v) {
    const s = String(v == null ? "" : v).trim();
    if (!s)
      return "";
    return /^-?\d+(\.\d+)?$/.test(s) ? s + "px" : s;
  }
  _color(value) {
    const raw = String(value || "").toLowerCase();
    if (!raw)
      return "";
    const map = { danger: "error", info: "primary" };
    if (this.constructor.colors.includes(raw))
      return `var(--w-${map[raw] || raw})`;
    return value;
  }
  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
  _template() {
    const styles = [];
    const ar = this._attr("aspect-ratio", "");
    if (ar)
      styles.push(`aspect-ratio: ${this._esc(ar)}`);
    [["width", "width"], ["height", "height"], ["max-width", "max-width"], ["max-height", "max-height"], ["min-width", "min-width"], ["min-height", "min-height"]].forEach(([attr, prop]) => {
      const v = this._len(this.getAttribute(attr));
      if (v)
        styles.push(`${prop}: ${v}`);
    });
    const bg = this._color(this.getAttribute("color"));
    if (bg)
      styles.push(`background-color: ${bg}`);
    const cover = this._bool("cover") || this._attr("fit", "") === "cover";
    const contain = this._attr("fit", "") === "contain";
    const fitClass = cover ? " w-img__img--cover" : contain ? " w-img__img--contain" : "";
    const position = this._attr("position", "");
    const imgStyle = position ? ` style="object-position: ${this._esc(position)}"` : "";
    const eager = this._bool("eager");
    const loading = eager ? "" : ' loading="lazy"';
    const draggable = this.getAttribute("draggable");
    const dragAttr = draggable != null ? ` draggable="${this._esc(draggable)}"` : "";
    const srcset = this.getAttribute("srcset");
    const sizes = this.getAttribute("sizes");
    const srcsetAttr = srcset ? ` srcset="${this._esc(srcset)}"` : "";
    const sizesAttr = sizes ? ` sizes="${this._esc(sizes)}"` : "";
    const rounded = this.hasAttribute("rounded") ? this.getAttribute("rounded") && this.getAttribute("rounded") !== "true" ? " w-img--rounded-" + this.getAttribute("rounded") : " w-img--rounded" : "";
    const lazy = this._attr("lazy-src", "");
    const placeholder = this._hasSlot("placeholder") ? '<div class="w-img__placeholder"><slot name="placeholder"></slot></div>' : lazy ? `<div class="w-img__placeholder w-img__placeholder--lazy" style="background-image: url('${this._esc(lazy)}')"></div>` : "";
    const gradient = this._attr("gradient", "");
    const gradientEl = gradient ? `<div class="w-img__gradient" style="background-image: linear-gradient(${this._esc(gradient)})"></div>` : "";
    const errorEl = this._hasSlot("error") ? '<div class="w-img__error"><slot name="error"></slot></div>' : "";
    return `<div class="w-img${rounded}" style="${styles.join("; ")}">` + placeholder + `<img class="w-img__img${fitClass}" src="${this._esc(this.src)}" alt="${this._esc(this.alt)}"${srcsetAttr}${sizesAttr}${loading}${dragAttr}${imgStyle}>` + gradientEl + errorEl + '<div class="w-img__content"><slot></slot></div>' + "</div>";
  }
  _events() {
    const img = this._q(".w-img__img");
    if (!img)
      return;
    const done = () => {
      this.classList.add("w-img--loaded");
      this._emit("load", this.src);
    };
    img.addEventListener("load", done);
    img.addEventListener("error", () => {
      this.classList.add("w-img--error");
      this._emit("error", this.src);
    });
    if (img.complete && img.naturalWidth)
      done();
  }
}
if (!customElements.get("w-img"))
  customElements.define("w-img", WImg);

// src/components/infinite-scroll.js
class WInfiniteScroll extends WElement {
  static attrs = [
    "mode",
    "side",
    "direction",
    "color",
    "height",
    "margin",
    "threshold",
    "disabled",
    "status",
    "load-more-text",
    "loading-text",
    "empty-text",
    "error-text"
  ];
  get mode() {
    return this._attr("mode", "intersect");
  }
  get side() {
    return this._attr("side", "end");
  }
  get direction() {
    return this._attr("direction", "vertical");
  }
  get horizontal() {
    return this.direction === "horizontal";
  }
  get color() {
    return this._attr("color", "");
  }
  get height() {
    return this._attr("height", "260px");
  }
  get margin() {
    return wNumberAttr(this, "margin", wNumberAttr(this, "threshold", 96));
  }
  get disabled() {
    return wBoolAttr(this, "disabled");
  }
  get status() {
    return this._attr("status", "idle");
  }
  get loadMoreText() {
    return this._attr("load-more-text", "Load more");
  }
  get loadingText() {
    return this._attr("loading-text", "Loading…");
  }
  get emptyText() {
    return this._attr("empty-text", "No more items");
  }
  get errorText() {
    return this._attr("error-text", "Something went wrong");
  }
  get sides() {
    return this.side === "both" ? ["start", "end"] : [this.side];
  }
  _color(c) {
    c = String(c).trim();
    return /^[a-z][a-z0-9-]*$/i.test(c) ? `var(--w-${c}, ${c})` : c;
  }
  _template() {
    const cls = `w-infinite-scroll${this.horizontal ? " w-infinite-scroll--horizontal" : ""}`;
    const sizeProp = this.horizontal ? "max-width" : "max-height";
    const colorVar = this.color ? `;--w-infinite-color:${this._color(this.color)}` : "";
    const trigger = (side) => `<div class="w-infinite-scroll-trigger" data-side="${side}" role="status">${this._triggerContent()}</div>`;
    return `<div class="${cls}" style="${sizeProp}:${this._esc(this.height)}${colorVar}" data-infinite-scroll>
      ${this.sides.includes("start") ? trigger("start") : ""}
      <div class="w-infinite-scroll-content"><slot></slot></div>
      ${this.sides.includes("end") ? trigger("end") : ""}
    </div>`;
  }
  _triggerContent() {
    const s = this.status;
    if (s === "loading")
      return `<span class="w-infinite-scroll-spinner" aria-hidden="true"></span><span>${this._esc(this.loadingText)}</span>`;
    if (s === "empty")
      return `<span class="w-infinite-scroll-empty">${this._esc(this.emptyText)}</span>`;
    if (s === "error")
      return `<span class="w-infinite-scroll-error">${this._esc(this.errorText)}</span> <button type="button" class="w-btn w-btn-text" data-retry>Retry</button>`;
    if (this.mode === "manual")
      return `<button type="button" class="w-btn w-btn-tonal" data-load-more>${this._esc(this.loadMoreText)}</button>`;
    return "";
  }
  _events() {
    const scroller = this._q("[data-infinite-scroll]");
    if (!scroller)
      return;
    this._scroller = scroller;
    this._bindButtons();
    if (this.mode === "manual")
      return;
    if ("IntersectionObserver" in window) {
      this.__io?.disconnect();
      this.__io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            this._requestLoad(entry.target.getAttribute("data-side") || "end");
        });
      }, { root: scroller, rootMargin: `${this.margin}px` });
      this._observeTriggers();
    }
    this.__onScroll = () => this._checkScroll();
    scroller.addEventListener("scroll", this.__onScroll, { passive: true });
  }
  _bindButtons() {
    this._qAll("[data-load-more], [data-retry]").forEach((btn) => {
      const side = btn.closest("[data-side]")?.getAttribute("data-side") || "end";
      btn.addEventListener("click", () => this._requestLoad(side));
    });
  }
  _observeTriggers() {
    if (!this.__io)
      return;
    this._qAll(".w-infinite-scroll-trigger").forEach((t) => {
      this.__io.unobserve(t);
      this.__io.observe(t);
    });
  }
  _checkScroll() {
    const el = this._scroller;
    if (!el)
      return;
    const nearStart = (this.horizontal ? el.scrollLeft : el.scrollTop) <= this.margin;
    const size = this.horizontal ? el.scrollWidth - el.clientWidth - el.scrollLeft : el.scrollHeight - el.clientHeight - el.scrollTop;
    const nearEnd = size <= this.margin;
    if (this.sides.includes("start") && nearStart)
      this._requestLoad("start");
    if (this.sides.includes("end") && nearEnd)
      this._requestLoad("end");
  }
  _requestLoad(side) {
    if (this.__loading || this.disabled || this.status === "empty")
      return;
    this.__loading = true;
    this.__side = side;
    this._setStatus("loading");
    this._emit("load", { side, done: (status) => this._done(status) });
  }
  _done(status) {
    this.__loading = false;
    this._setStatus(status === "ok" || !status ? "idle" : status);
    if (this.status === "idle" && this.mode === "intersect") {
      requestAnimationFrame(() => this._observeTriggers());
    }
  }
  _setStatus(status) {
    this._silentSet("status", status);
    this._qAll(".w-infinite-scroll-trigger").forEach((t) => {
      t.innerHTML = this._triggerContent();
    });
    this._bindButtons();
  }
  complete(status = "empty") {
    this._done(status);
  }
  reset() {
    this.__loading = false;
    this._setStatus("idle");
    this._observeTriggers();
  }
  disconnectedCallback() {
    this.__io?.disconnect();
    if (this._scroller && this.__onScroll)
      this._scroller.removeEventListener("scroll", this.__onScroll);
  }
}
if (!customElements.get("w-infinite-scroll"))
  customElements.define("w-infinite-scroll", WInfiniteScroll);

// src/components/infinite-scroll-intersect.js
class WInfiniteScrollIntersect extends WElement {
  static attrs = ["side"];
  get side() {
    return this._attr("side", "end");
  }
  _template() {
    return `<div class="w-infinite-scroll-intersect" data-side="${this._esc(this.side)}" aria-hidden="true"><slot></slot></div>`;
  }
  _events() {
    if (!("IntersectionObserver" in window))
      return;
    this.__io?.disconnect();
    const target = this._q(".w-infinite-scroll-intersect");
    if (!target)
      return;
    this.__io = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting))
        this._emit("load", { side: this.side });
    });
    this.__io.observe(target);
  }
  disconnectedCallback() {
    this.__io?.disconnect();
  }
}
if (!customElements.get("w-infinite-scroll-intersect")) {
  customElements.define("w-infinite-scroll-intersect", WInfiniteScrollIntersect);
}

// src/components/item-group.js
class WItemGroup extends WElement {
  static attrs = ["value", "multiple", "mandatory", "max", "selected-class", "active-class", "disabled"];
  get value() {
    return wValue(this, "");
  }
  get multiple() {
    return wBoolAttr(this, "multiple");
  }
  get mandatory() {
    return wBoolAttr(this, "mandatory");
  }
  get disabled() {
    return wBoolAttr(this, "disabled");
  }
  get max() {
    return this.hasAttribute("max") ? wNumberAttr(this, "max", Infinity) : Infinity;
  }
  get selectedClass() {
    return this._attr("active-class", this._attr("selected-class", "active"));
  }
  _template() {
    const multi = this.multiple ? ' aria-multiselectable="true"' : "";
    const disabled = this.disabled ? ' aria-disabled="true"' : "";
    return `<div class="w-item-group" role="group"${multi}${disabled}><slot></slot></div>`;
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this._observer) {
      this._observer = new MutationObserver(() => {
        if (!this.isConnected)
          return;
        const group = this._q(".w-item-group, .w-slide-group");
        const slot = group?.querySelector(":scope > slot");
        if (slot) {
          Array.from(this.children).forEach((child) => {
            if (child !== group && !group.contains(child)) {
              slot.appendChild(child);
            }
          });
        }
        const validValues = this._items().map((item, index) => this._itemValue(item, index));
        let selected = this._selectedValues().filter((value2) => validValues.includes(value2));
        if (this.mandatory && !selected.length && validValues.length) {
          selected = [validValues[0]];
        }
        const value = this.multiple ? JSON.stringify(selected) : selected[0] || "";
        this._silentSet("value", value || null);
        this._syncGroupItems();
        this._bindItemListeners();
        this._bindKeyboardNavigation();
      });
      this._observer.observe(this, { childList: true, subtree: true });
    }
  }
  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
  _events() {
    this._syncGroupItems();
    this._bindItemListeners();
    this._bindKeyboardNavigation();
  }
  _items() {
    const group = this._q(".w-item-group, .w-slide-group") || this;
    const slot = group.querySelector(":scope > slot");
    const children = slot ? Array.from(slot.children) : Array.from(group.children);
    return children.filter((item) => item.nodeType === Node.ELEMENT_NODE);
  }
  _enabledItems() {
    return this._items().filter((item) => !this._isItemDisabled(item));
  }
  _isItemDisabled(item) {
    if (this.disabled)
      return true;
    return item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true" || item.disabled === true;
  }
  _itemValue(item, index) {
    return item.getAttribute("value") || item.getAttribute("data-value") || String(index);
  }
  _selectedValues() {
    return wValueList(this.value);
  }
  _toggleItem(item) {
    if (this._isItemDisabled(item))
      return;
    const items = this._items();
    const value = this._itemValue(item, items.indexOf(item));
    let selected = this._selectedValues();
    const currentlySelected = selected.includes(value);
    if (this.multiple) {
      if (currentlySelected) {
        if (!this.mandatory || selected.length > 1) {
          selected = selected.filter((itemValue) => itemValue !== value);
        }
      } else if (selected.length < this.max) {
        selected = selected.concat(value);
      }
      if (this.mandatory && !selected.length)
        selected = [value];
    } else {
      selected = currentlySelected && !this.mandatory ? [] : [value];
    }
    this._setSelected(selected);
  }
  _setSelected(selected) {
    const value = this.multiple ? JSON.stringify(selected) : selected[0] || "";
    if (value === this.value)
      return;
    this._silentSet("value", value || null);
    this._syncGroupItems();
    this._emit("change", { value: this.multiple ? selected : value });
  }
  _syncGroupItems() {
    const selected = this._selectedValues();
    const items = this._items();
    const enabledItems = this._enabledItems();
    const group = this._q(".w-item-group, .w-slide-group");
    items.forEach((item, index) => {
      const active = selected.includes(this._itemValue(item, index));
      item.classList.toggle(this.selectedClass, active);
      item.classList.toggle("selected", active);
      item.setAttribute("aria-pressed", String(active));
      item.toggleAttribute("selected", active);
    });
    this._updateTabIndexes(enabledItems);
    if (group) {
      if (this.multiple)
        group.setAttribute("aria-multiselectable", "true");
      else
        group.removeAttribute("aria-multiselectable");
      if (this.disabled)
        group.setAttribute("aria-disabled", "true");
      else
        group.removeAttribute("aria-disabled");
    }
  }
  _updateTabIndexes(enabledItems = this._enabledItems()) {
    const items = this._items();
    const activeElement = document.activeElement;
    const focusedItem = items.find((item) => item === activeElement || item.contains(activeElement));
    const tabbable = focusedItem && enabledItems.includes(focusedItem) ? focusedItem : enabledItems[0];
    items.forEach((item) => {
      if (this._isItemDisabled(item)) {
        item.setAttribute("tabindex", "-1");
        return;
      }
      item.setAttribute("tabindex", item === tabbable ? "0" : "-1");
    });
  }
  _bindItemListeners() {
    const items = this._items();
    items.forEach((item) => {
      if (item.__wItemGroup === this)
        return;
      item.__wItemGroup = this;
      item.addEventListener("click", (event) => {
        if (this._isItemDisabled(item))
          return;
        event.preventDefault();
        this._toggleItem(item);
      });
      item.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ")
          return;
        if (this._isItemDisabled(item))
          return;
        event.preventDefault();
        this._toggleItem(item);
      });
      item.addEventListener("focusin", (event) => {
        if (event.currentTarget !== item)
          return;
        this._updateTabIndexes();
      });
    });
  }
  _bindKeyboardNavigation() {
    const group = this._q(".w-item-group, .w-slide-group") || this;
    if (group.__wKeyboardBound === this)
      return;
    group.__wKeyboardBound = this;
    group.addEventListener("keydown", (event) => this._onGroupKeydown(event));
  }
  _onGroupKeydown(event) {
    const group = this._q(".w-item-group, .w-slide-group") || this;
    if (group.classList.contains("w-slide-group"))
      return;
    let move = 0;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      move = 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      move = -1;
    else if (event.key === "Home")
      move = "home";
    else if (event.key === "End")
      move = "end";
    else
      return;
    event.preventDefault();
    const items = this._enabledItems();
    if (!items.length)
      return;
    let next;
    if (move === "home")
      next = items[0];
    else if (move === "end")
      next = items[items.length - 1];
    else {
      const current = document.activeElement;
      const currentIndex = items.findIndex((item) => item === current || item.contains(current));
      const index = currentIndex < 0 ? 0 : Math.max(0, Math.min(items.length - 1, currentIndex + move));
      next = items[index];
    }
    this._focusItem(next);
  }
  _focusItem(item) {
    if (!item)
      return;
    const focusTarget = item.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || item;
    focusTarget.focus({ preventScroll: true });
  }
}
if (!customElements.get("w-item-group"))
  customElements.define("w-item-group", WItemGroup);

// src/components/kbd.js
class WKbd extends WElement {
  _template() {
    return `<kbd class="w-kbd"><slot></slot></kbd>`;
  }
}
if (!customElements.get("w-kbd"))
  customElements.define("w-kbd", WKbd);

// src/components/label.js
class WLabel extends WElement {
  _template() {
    return `<span class="w-label"><slot></slot></span>`;
  }
}
if (!customElements.get("w-label"))
  customElements.define("w-label", WLabel);

// src/components/layout.js
class WLayout extends WElement {
  _template() {
    return `<div class="w-layout"><slot></slot></div>`;
  }
}
if (!customElements.get("w-layout"))
  customElements.define("w-layout", WLayout);

// src/components/lazy.js
class WLazy extends WElement {
  static attrs = ["active", "model-value", "transition", "height", "min-height", "root-margin", "threshold"];
  get active() {
    return wBoolAttr(this, "active") || wBoolAttr(this, "model-value");
  }
  get transition() {
    return this._attr("transition", "fade");
  }
  get height() {
    return this._attr("height", "");
  }
  get minHeight() {
    return this._attr("min-height", "160px");
  }
  get rootMargin() {
    return this._attr("root-margin", "0px");
  }
  get threshold() {
    return wNumberAttr(this, "threshold", 0);
  }
  _template() {
    const active = this.active;
    const transition = this.transition && this.transition !== "none" ? ` w-lazy--transition-${this._esc(this.transition)}` : "";
    const style = this.height ? ` style="height:${this._esc(this.height)}"` : ` style="min-height:${this._esc(this.minHeight)}"`;
    return `<div class="w-lazy${active ? " is-active" : ""}${transition}"${style} data-lazy-root>
      <slot${active ? "" : " hidden"}></slot>
      <div class="w-lazy-placeholder"${active ? " hidden" : ""} aria-hidden="true"></div>
    </div>`;
  }
  _events() {
    if (this.active)
      return;
    const root = this._q("[data-lazy-root]");
    if (!root || !("IntersectionObserver" in window))
      return;
    this.__io?.disconnect();
    this.__io = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting))
        return;
      this.__io?.disconnect();
      this.setAttribute("active", "");
      this._emit("load", { value: true });
      this._emit("update:modelValue", { value: true });
    }, { rootMargin: this.rootMargin, threshold: this.threshold });
    this.__io.observe(root);
  }
  disconnectedCallback() {
    this.__io?.disconnect();
  }
}
if (!customElements.get("w-lazy"))
  customElements.define("w-lazy", WLazy);

// src/components/locale-provider.js
class WLocaleProvider extends WElement {
  static attrs = ["locale", "fallback-locale", "rtl"];
  get locale() {
    return this._attr("locale", "");
  }
  get rtl() {
    return this._bool("rtl");
  }
  _template() {
    const dir = this.rtl ? "rtl" : "ltr";
    const lang = this.locale ? ` lang="${this._esc(this.locale)}"` : "";
    const fallback = this.getAttribute("fallback-locale");
    const fallbackAttr = fallback ? ` data-fallback-locale="${this._esc(fallback)}"` : "";
    return `<div class="w-locale-provider" dir="${dir}"${lang}${fallbackAttr}><slot></slot></div>`;
  }
}
if (!customElements.get("w-locale-provider"))
  customElements.define("w-locale-provider", WLocaleProvider);

// src/components/main.js
class WMain extends WElement {
  static attrs = ["scrollable"];
  get scrollable() {
    return this._bool("scrollable");
  }
  _template() {
    const cls = ["w-main", this.scrollable ? "w-main--scrollable" : ""].filter(Boolean).join(" ");
    return `<main class="${cls}"><slot></slot></main>`;
  }
}
if (!customElements.get("w-main"))
  customElements.define("w-main", WMain);

// src/components/menu.js
class WMenu extends WElement {
  static attrs = [
    "id",
    "content-id",
    "label",
    "open",
    "location",
    "side",
    "disabled",
    "persistent",
    "close-on-content-click",
    "open-delay",
    "close-delay",
    "submenu"
  ];
  constructor() {
    super();
    this.__wUid = "w-menu-" + Math.random().toString(36).slice(2, 9);
  }
  disconnectedCallback() {
    this._removeGlobalListeners();
    this._clearTimers();
  }
  get menuId() {
    return this._attr("content-id", this.getAttribute("id") ? this.getAttribute("id") + "-content" : this.__wUid);
  }
  get label() {
    return this._attr("label", "Menu");
  }
  get open() {
    return this._bool("open");
  }
  get location() {
    return this._attr("location", this._attr("side", this.submenu ? "end" : "bottom-start"));
  }
  get disabled() {
    return this._bool("disabled");
  }
  get persistent() {
    return this._bool("persistent");
  }
  get closeOnContentClick() {
    return this._attr("close-on-content-click", "true") !== "false";
  }
  get openDelay() {
    return this._numberAttr("open-delay", 0);
  }
  get closeDelay() {
    return this._numberAttr("close-delay", 0);
  }
  get submenu() {
    return this._bool("submenu");
  }
  _template() {
    const hasActivator = !!this.querySelector('[slot="activator"]');
    const classes = [
      "w-menu",
      this.open ? "open" : "",
      this.submenu ? "w-menu--submenu" : "",
      "w-menu--" + this._classToken(this.location)
    ].filter(Boolean).join(" ");
    const activator = hasActivator ? `<span class="w-menu-activator" role="button" tabindex="${this.disabled ? "-1" : "0"}" aria-haspopup="menu" aria-expanded="${this.open ? "true" : "false"}" aria-controls="${this._esc(this.menuId)}"><slot name="activator"></slot></span>` : `<button class="w-btn w-btn-outlined w-menu-activator" type="button" aria-haspopup="menu" aria-expanded="${this.open ? "true" : "false"}" aria-controls="${this._esc(this.menuId)}"${this.disabled ? " disabled" : ""}>${this._esc(this.label)}</button>`;
    return `<div class="${classes}">
      ${activator}
      <div id="${this._esc(this.menuId)}" class="w-menu-content" role="menu"><slot></slot></div>
    </div>`;
  }
  _events() {
    const activator = this._q(".w-menu-activator");
    const content = this._q(".w-menu-content");
    if (!activator || !content || this.disabled)
      return;
    activator.addEventListener("click", (event) => {
      event.stopPropagation();
      this._scheduleOpen(!this.open, this.open ? this.closeDelay : this.openDelay);
    });
    activator.addEventListener("keydown", (event) => this._onActivatorKeydown(event));
    activator.addEventListener("mouseenter", () => {
      if (this.openDelay > 0 || this.submenu)
        this._scheduleOpen(true, this.openDelay);
    });
    this.addEventListener("mouseleave", () => {
      if (this.closeDelay > 0 || this.submenu)
        this._scheduleOpen(false, this.closeDelay);
    });
    content.addEventListener("keydown", (event) => this._onContentKeydown(event));
    content.addEventListener("click", (event) => {
      const item = event.target instanceof Element ? event.target.closest('button, a, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]') : null;
      if (item && this.closeOnContentClick)
        this._setOpen(false);
    });
    this._addGlobalListeners();
  }
  _onActivatorKeydown(event) {
    if (event.isComposing)
      return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._setOpen(true);
      this._focusItem(event.key === "ArrowUp" ? "last" : "first");
      return;
    }
    if (this.submenu && event.key === "ArrowRight") {
      event.preventDefault();
      this._setOpen(true);
      this._focusItem("first");
    }
  }
  _onContentKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      this._setOpen(false);
      this._q(".w-menu-activator")?.focus();
      return;
    }
    if (event.key === "Tab") {
      this._setOpen(false);
      return;
    }
    if (this.submenu && event.key === "ArrowLeft") {
      event.preventDefault();
      this._setOpen(false);
      this._q(".w-menu-activator")?.focus();
      return;
    }
    const direction = event.key === "ArrowDown" ? "next" : event.key === "ArrowUp" ? "prev" : event.key === "Home" ? "first" : event.key === "End" ? "last" : "";
    if (!direction)
      return;
    event.preventDefault();
    this._focusItem(direction);
  }
  _focusItem(direction) {
    const items = this._items();
    if (!items.length)
      return;
    const active = document.activeElement;
    let index = items.indexOf(active);
    if (direction === "first")
      index = 0;
    else if (direction === "last")
      index = items.length - 1;
    else
      index = index < 0 ? 0 : (index + (direction === "next" ? 1 : -1) + items.length) % items.length;
    items[index]?.focus();
  }
  _items() {
    const content = this._q(".w-menu-content");
    if (!content)
      return [];
    return Array.from(content.querySelectorAll('button, a, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')).filter((item) => {
      if (!(item instanceof HTMLElement))
        return false;
      if (item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true")
        return false;
      return item.offsetParent !== null || item.getClientRects().length > 0;
    });
  }
  _addGlobalListeners() {
    this._removeGlobalListeners();
    this.__wDocumentPointerdown = (event) => {
      if (!this.open || this.persistent)
        return;
      if (this.contains(event.target))
        return;
      this._setOpen(false);
    };
    this.__wDocumentKeydown = (event) => {
      if (event.key === "Escape" && this.open && !this.persistent)
        this._setOpen(false);
    };
    document.addEventListener("pointerdown", this.__wDocumentPointerdown);
    document.addEventListener("keydown", this.__wDocumentKeydown);
  }
  _removeGlobalListeners() {
    if (this.__wDocumentPointerdown)
      document.removeEventListener("pointerdown", this.__wDocumentPointerdown);
    if (this.__wDocumentKeydown)
      document.removeEventListener("keydown", this.__wDocumentKeydown);
    this.__wDocumentPointerdown = null;
    this.__wDocumentKeydown = null;
  }
  _scheduleOpen(open, delay) {
    this._clearTimers();
    if (!delay) {
      this._setOpen(open);
      return;
    }
    this.__wTimer = setTimeout(() => this._setOpen(open), delay);
  }
  _clearTimers() {
    if (this.__wTimer)
      clearTimeout(this.__wTimer);
    this.__wTimer = null;
  }
  _setOpen(open) {
    if (this.disabled || open === this.open)
      return;
    this._silentSet("open", open ? "" : null);
    this._render();
    this._events();
    this._emit("toggle", { open });
    if (!open)
      this._emit("close", { open });
  }
  _numberAttr(name, fallback) {
    const value = Number(this._attr(name, fallback));
    return Number.isFinite(value) ? Math.max(0, value) : fallback;
  }
  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "bottom-start";
  }
}
if (!customElements.get("w-menu"))
  customElements.define("w-menu", WMenu);

// src/components/messages.js
class WMessages extends WElement {
  static attrs = ["error"];
  get error() {
    return this._bool("error");
  }
  _template() {
    return `<p class="w-messages${this.error ? " error" : ""}"><slot></slot></p>`;
  }
}
if (!customElements.get("w-messages"))
  customElements.define("w-messages", WMessages);

// src/components/navigation-drawer.js
class WNavigationDrawer extends WElement {
  static attrs = [
    "open",
    "rail",
    "permanent",
    "temporary",
    "location",
    "label",
    "close-on-navigation",
    "width",
    "floating",
    "expand-on-hover",
    "scrim",
    "border",
    "elevation",
    "color"
  ];
  connectedCallback() {
    if (this.permanent) {
      this._silentSet("open", true);
    }
    super.connectedCallback();
  }
  get open() {
    return this.permanent || this._bool("open");
  }
  get rail() {
    return this._bool("rail");
  }
  get permanent() {
    return this._bool("permanent");
  }
  get temporary() {
    return this._bool("temporary");
  }
  get location() {
    return this._attr("location", "left");
  }
  get label() {
    return this._attr("label", "Navigation");
  }
  get closeOnNavigation() {
    const value = this.getAttribute("close-on-navigation");
    return value == null || !["false", "0", "off"].includes(value.toLowerCase());
  }
  get width() {
    return this._attr("width", "");
  }
  get floating() {
    return this._bool("floating");
  }
  get expandOnHover() {
    return this._bool("expand-on-hover");
  }
  get scrim() {
    const v = this.getAttribute("scrim");
    return v == null || !["false", "0", "off"].includes(v.toLowerCase());
  }
  get border() {
    return this._bool("border");
  }
  get elevation() {
    return this._attr("elevation", "");
  }
  get color() {
    return this._attr("color", "");
  }
  _template() {
    const classes = [
      "w-navigation-drawer",
      this.open ? "open" : "",
      this.rail ? "w-navigation-drawer--rail" : "",
      this.permanent ? "w-navigation-drawer--permanent" : "",
      this.temporary ? "w-navigation-drawer--temporary" : "",
      this.location === "right" ? "w-navigation-drawer--right" : "",
      this.floating ? "w-navigation-drawer--floating" : "",
      this.expandOnHover ? "w-navigation-drawer--expand-on-hover" : "",
      this.border ? "w-navigation-drawer--border" : ""
    ].filter(Boolean).join(" ");
    const styles = [];
    if (this.width) {
      styles.push("--w-drawer-width: " + (isNaN(this.width) ? this.width : this.width + "px") + ";");
    }
    if (this.color) {
      styles.push("--w-drawer-bg: var(--w-" + this.color + ");");
    }
    const styleAttr = styles.length ? ' style="' + styles.join(" ") + '"' : "";
    const elevationClass = this.elevation && !this.floating ? " elevation-" + this.elevation : "";
    const showScrim = this._showScrim();
    return `<aside class="${classes}${elevationClass}" aria-label="${this._esc(this.label)}" aria-hidden="${this.open ? "false" : "true"}"${this.open ? "" : " inert"}${styleAttr}>
        <slot></slot>
      </aside>
      <button class="w-navigation-drawer-scrim${showScrim ? " open" : ""}" type="button" aria-label="Close navigation"${showScrim ? "" : " hidden"}></button>`;
  }
  _events() {
    const scrim = this._q(".w-navigation-drawer-scrim");
    if (scrim)
      scrim.addEventListener("click", () => this.close("scrim"));
    const drawer = this._q(".w-navigation-drawer");
    if (drawer) {
      drawer.addEventListener("click", (event) => {
        if (!this.closeOnNavigation || !this._isCompact())
          return;
        if (event.target.closest("a[href], [data-w-drawer-close]"))
          this.close("navigation");
      });
      if (this.expandOnHover && this.rail) {
        drawer.addEventListener("mouseenter", () => this._expandRail(true));
        drawer.addEventListener("mouseleave", () => this._expandRail(false));
        drawer.addEventListener("focusin", () => this._expandRail(true));
        drawer.addEventListener("focusout", () => this._expandRail(false));
      }
    }
    if (!this.__wDrawerKeydown) {
      this.__wDrawerKeydown = (event) => {
        if (event.key === "Escape" && this.open && !this.permanent)
          this.close("escape");
      };
      document.addEventListener("keydown", this.__wDrawerKeydown);
    }
  }
  disconnectedCallback() {
    if (this.__wDrawerKeydown) {
      document.removeEventListener("keydown", this.__wDrawerKeydown);
      this.__wDrawerKeydown = null;
    }
  }
  show(reason = "programmatic") {
    this._setOpen(true, reason);
  }
  close(reason = "programmatic") {
    if (this.permanent)
      return;
    this._setOpen(false, reason);
  }
  toggle() {
    this._setOpen(!this.open, "toggle");
  }
  _setOpen(open, reason) {
    if (open === this.open)
      return;
    this._silentSet("open", open);
    this._render();
    this._events();
    this._applyCommonProps();
    this._emit("toggle", { open, reason });
    if (!open)
      this._emit("close", { open, reason });
  }
  _isCompact() {
    return this.temporary || window.matchMedia("(max-width: 1024px)").matches;
  }
  _showScrim() {
    if (!this.open || this.permanent)
      return false;
    if (this.temporary)
      return true;
    return this.scrim;
  }
  _expandRail(expand) {
    const drawer = this._q(".w-navigation-drawer");
    if (!drawer)
      return;
    drawer.classList.toggle("w-navigation-drawer--rail-expanded", expand);
  }
}
if (!customElements.get("w-navigation-drawer"))
  customElements.define("w-navigation-drawer", WNavigationDrawer);

// src/components/no-ssr.js
class WNoSsr extends WElement {
  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
  _template() {
    const mounted = this._mounted;
    const placeholder = this._hasSlot("placeholder") ? `<slot name="placeholder"${mounted ? " hidden" : ""}></slot>` : "";
    return `<div class="w-no-ssr">${placeholder}<slot${mounted ? "" : " hidden"}></slot></div>`;
  }
  _events() {
    if (this._mounted)
      return;
    this.__raf = requestAnimationFrame(() => {
      this._mounted = true;
      this._render();
      if (typeof this._events === "function")
        this._events();
    });
  }
  disconnectedCallback() {
    if (this.__raf)
      cancelAnimationFrame(this.__raf);
  }
}
if (!customElements.get("w-no-ssr"))
  customElements.define("w-no-ssr", WNoSsr);

// src/components/number-input.js
class WNumberInput extends WElement {
  static attrs = [
    "value",
    "min",
    "max",
    "step",
    "label",
    "placeholder",
    "hint",
    "error",
    "name",
    "disabled",
    "readonly",
    "size",
    "precision",
    "min-fraction-digits",
    "decimal-separator",
    "grouping",
    "group-separator",
    "control-variant",
    "inset",
    "hide-input",
    "reverse"
  ];
  get min() {
    const v = this._attr("min", "");
    return v === "" ? Number.MIN_SAFE_INTEGER : Number(v);
  }
  get max() {
    const v = this._attr("max", "");
    return v === "" ? Number.MAX_SAFE_INTEGER : Number(v);
  }
  get step() {
    return Number(this._attr("step", "1")) || 1;
  }
  get precision() {
    const v = this.getAttribute("precision");
    if (v === null)
      return 0;
    if (v === "null" || v === "")
      return null;
    return Number(v);
  }
  get minFractionDigits() {
    const v = this.getAttribute("min-fraction-digits");
    return v == null ? null : Number(v);
  }
  get decimalSeparator() {
    return this._attr("decimal-separator", "");
  }
  get groupSeparator() {
    return this._attr("group-separator", "");
  }
  get grouping() {
    const v = this.getAttribute("grouping");
    if (v == null || v === "false")
      return false;
    if (v === "" || v === "true" || v === "always")
      return true;
    return v;
  }
  get controlVariant() {
    if (this.hideInput)
      return "stacked";
    const v = this._attr("control-variant", "default");
    return ["default", "stacked", "split", "hidden"].includes(v) ? v : "default";
  }
  get inset() {
    return this._bool("inset");
  }
  get hideInput() {
    return this._bool("hide-input");
  }
  get reverse() {
    return this._bool("reverse");
  }
  get label() {
    return this._attr("label", "");
  }
  get placeholder() {
    return this._attr("placeholder", "");
  }
  get hint() {
    return this._attr("hint", "");
  }
  get error() {
    return this._attr("error", "");
  }
  get name() {
    return this._attr("name", "");
  }
  get size() {
    return this._attr("size", "");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get readonly() {
    return this._bool("readonly");
  }
  get controlsDisabled() {
    return this.disabled || this.readonly;
  }
  get model() {
    const raw = this._attr("value", "");
    if (raw === "" || raw == null)
      return null;
    const n = Number(raw);
    return Number.isNaN(n) ? null : n;
  }
  get canIncrease() {
    return !this.controlsDisabled && (this.model ?? 0) + this.step <= this.max;
  }
  get canDecrease() {
    return !this.controlsDisabled && (this.model ?? 0) - this.step >= this.min;
  }
  _template() {
    const variant = this.controlVariant;
    const sizeClass = this.size ? " w-input--" + this.size : "";
    const minAttr = this.hasAttribute("min") ? ` min="${this._esc(this.getAttribute("min"))}"` : "";
    const maxAttr = this.hasAttribute("max") ? ` max="${this._esc(this.getAttribute("max"))}"` : "";
    const ph = this.placeholder ? ` placeholder="${this._esc(this.placeholder)}"` : "";
    const nm = this.name ? ` name="${this._esc(this.name)}"` : "";
    const input = `<input class="w-input${sizeClass}" type="text" inputmode="decimal"` + ` value="${this._esc(this._format(this.model))}"${minAttr}${maxAttr} step="${this.step}"${ph}${nm}` + `${this.disabled ? " disabled" : ""}${this.readonly ? " readonly" : ""} data-w-number-input>`;
    const dec = this._btn("-1", variant === "split" ? "minus" : "chevron-down");
    const inc = this._btn("1", variant === "split" ? "plus" : "chevron-up");
    let inner;
    if (variant === "hidden") {
      inner = input;
    } else if (variant === "split") {
      inner = this.reverse ? `${inc}${input}${dec}` : `${dec}${input}${inc}`;
    } else {
      const group = `<span class="w-number-input-control">${variant === "stacked" ? inc + dec : dec + inc}</span>`;
      inner = this.reverse ? `${group}${input}` : `${input}${group}`;
    }
    const classes = [
      "w-field",
      "w-number-input",
      "w-number-input--" + variant,
      this.inset ? "w-number-input--inset" : "",
      this.hideInput ? "w-number-input--hide-input" : "",
      this.reverse ? "w-number-input--reverse" : "",
      this.error ? "w-field-error" : ""
    ].filter(Boolean).join(" ");
    const message = this.error || this.hint;
    return `<label class="${classes}">` + (this.label ? `<span class="w-label">${this._esc(this.label)}</span>` : "") + `<span class="w-number-input-field">${inner}</span>` + (message ? `<span class="w-field-hint">${this._esc(message)}</span>` : "") + `</label>`;
  }
  _btn(step, icon) {
    const blocked = step === "1" ? !this.canIncrease : !this.canDecrease;
    const label = step === "1" ? "Increase" : "Decrease";
    return `<button type="button" class="w-number-input-btn" data-step="${step}" tabindex="-1"` + ` aria-label="${label}" aria-hidden="true"${blocked ? " disabled" : ""}>${this._icon(icon)}</button>`;
  }
  _icon(name) {
    const paths = {
      "chevron-up": "M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z",
      "chevron-down": "M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z",
      plus: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
      minus: "M19 13H5v-2h14v2z"
    };
    return `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="${paths[name]}"/></svg>`;
  }
  _events() {
    const input = this._q("input");
    if (input) {
      input.addEventListener("input", (event) => {
        event.stopPropagation();
        this._emit("input", { value: this._parse(input.value) });
      });
      input.addEventListener("change", (event) => {
        event.stopPropagation();
        const n = this._parse(input.value);
        this._commit(input.value === "" || Number.isNaN(n) ? null : this._clamp(n));
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          this._stepBy(1);
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          this._stepBy(-1);
        }
      });
    }
    this._qAll("[data-step]").forEach((btn) => {
      const dir = Number(btn.getAttribute("data-step"));
      btn.addEventListener("pointerdown", (event) => {
        if (btn.disabled || !event.isPrimary)
          return;
        event.preventDefault();
        this._holdStart(dir);
      });
      ["pointerup", "pointerleave", "pointercancel"].forEach((name) => {
        btn.addEventListener(name, () => this._holdStop());
      });
    });
  }
  _stepBy(dir) {
    if (dir > 0 && !this.canIncrease)
      return;
    if (dir < 0 && !this.canDecrease)
      return;
    this._commit(this._clamp((this.model ?? 0) + dir * this.step));
  }
  _holdStart(dir) {
    this._holdStop();
    this._stepBy(dir);
    let delay = 300;
    const tick = () => {
      if (dir > 0 ? !this.canIncrease : !this.canDecrease)
        return this._holdStop();
      this._stepBy(dir);
      delay = Math.max(40, delay - 40);
      this._holdTimer = setTimeout(tick, delay);
    };
    this._holdTimer = setTimeout(tick, delay);
  }
  _holdStop() {
    if (this._holdTimer) {
      clearTimeout(this._holdTimer);
      this._holdTimer = null;
    }
  }
  _commit(value) {
    const precision = this.precision;
    const rounded = value == null ? null : precision == null ? value : Number(value.toFixed(precision));
    const formatted = this._format(rounded);
    const input = this._q("input");
    if (input)
      input.value = formatted;
    this._silentSet("value", rounded == null ? null : String(rounded));
    this._syncButtons();
    this._emit("change", { value: rounded });
  }
  _syncButtons() {
    const up = this._q('[data-step="1"]');
    const down = this._q('[data-step="-1"]');
    if (up)
      up.disabled = !this.canIncrease;
    if (down)
      down.disabled = !this.canDecrease;
  }
  _clamp(n) {
    return Math.min(Math.max(n, this.min), this.max);
  }
  _parse(text) {
    const dec = this.decimalSeparator || ".";
    const grp = this.groupSeparator || (this.grouping ? "," : "");
    let s = String(text);
    if (grp)
      s = s.split(grp).join("");
    if (dec !== ".")
      s = s.split(dec).join(".");
    s = s.replace(/[^0-9.\-]/g, "");
    return Number(s);
  }
  _format(n) {
    if (n == null || Number.isNaN(n))
      return "";
    const precision = this.precision;
    const max = precision == null ? 20 : precision;
    const min = this.minFractionDigits != null ? this.minFractionDigits : precision == null ? 0 : precision;
    let s;
    try {
      s = new Intl.NumberFormat("en-US", {
        useGrouping: !!this.grouping,
        minimumFractionDigits: Math.min(min, max),
        maximumFractionDigits: max
      }).format(n);
    } catch {
      s = String(n);
    }
    const dec = this.decimalSeparator;
    const grp = this.groupSeparator;
    if (dec || grp) {
      s = s.replace(/,/g, "\x00").replace(/\./g, dec || ".").replace(/\u0000/g, grp || ",");
    }
    return s;
  }
}
if (!customElements.get("w-number-input"))
  customElements.define("w-number-input", WNumberInput);

// src/components/otp.js
class WOtp extends WElement {
  static attrs = ["length", "value", "type", "divider", "placeholder", "disabled"];
  get length() {
    return parseInt(this._attr("length", "6"), 10) || 6;
  }
  get value() {
    return this._attr("value", "");
  }
  get type() {
    const t = this._attr("type", "text");
    return ["text", "number", "password"].includes(t) ? t : "text";
  }
  get divider() {
    return this._attr("divider", "");
  }
  get placeholder() {
    return this._attr("placeholder", "");
  }
  get disabled() {
    return this._bool("disabled");
  }
  _template() {
    const chars = this.value.split("");
    const inputType = this.type === "password" ? "password" : "text";
    const inputmode = this.type === "number" ? "numeric" : "text";
    const ph = this.placeholder ? ` placeholder="${this._esc(this.placeholder)}"` : "";
    const dis = this.disabled ? " disabled" : "";
    const parts = [];
    for (let i = 0;i < this.length; i++) {
      if (i > 0 && this.divider) {
        parts.push(`<span class="w-otp-separator" aria-hidden="true">${this._esc(this.divider)}</span>`);
      }
      parts.push(`<input class="w-otp-input" type="${inputType}" inputmode="${inputmode}"` + ` autocomplete="one-time-code" maxlength="1" value="${this._esc(chars[i] || "")}"` + `${ph}${dis} aria-label="Digit ${i + 1}">`);
    }
    return `<div class="w-otp">${parts.join("")}</div>`;
  }
  _events() {
    const inputs = Array.from(this._qAll(".w-otp input"));
    inputs.forEach((input, index) => {
      input.addEventListener("focus", () => input.select());
      input.addEventListener("input", (event) => {
        event.stopPropagation();
        let v = input.value;
        if (this.type === "number")
          v = v.replace(/\D/g, "");
        input.value = v.slice(-1);
        this._sync(inputs);
        if (input.value && inputs[index + 1])
          inputs[index + 1].focus();
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && !input.value && inputs[index - 1]) {
          inputs[index - 1].focus();
        } else if (event.key === "ArrowLeft" && inputs[index - 1]) {
          event.preventDefault();
          inputs[index - 1].focus();
        } else if (event.key === "ArrowRight" && inputs[index + 1]) {
          event.preventDefault();
          inputs[index + 1].focus();
        }
      });
      input.addEventListener("paste", (event) => {
        event.preventDefault();
        let text = event.clipboardData && event.clipboardData.getData("text") || "";
        if (this.type === "number")
          text = text.replace(/\D/g, "");
        const chars = text.split("");
        for (let i = index, j = 0;i < inputs.length && j < chars.length; i += 1, j += 1) {
          inputs[i].value = chars[j];
        }
        this._sync(inputs);
        inputs[Math.min(index + chars.length, inputs.length - 1)].focus();
      });
    });
  }
  _sync(inputs) {
    const value = inputs.map((el) => el.value).join("");
    this._silentSet("value", value);
    this._emit("input", { value });
    if (inputs.every((el) => el.value !== ""))
      this._emit("change", { value });
  }
}
if (!customElements.get("w-otp"))
  customElements.define("w-otp", WOtp);

// src/components/otp-input.js
class WOtpInput extends customElements.get("w-otp") {
}
if (!customElements.get("w-otp-input")) {
  customElements.define("w-otp-input", WOtpInput);
}

// src/components/overlay.js
class WOverlay extends WElement {
  static attrs = [
    "open",
    "label",
    "scrim",
    "persistent",
    "opacity",
    "z-index",
    "contained",
    "absolute",
    "disabled",
    "content-class",
    "location",
    "width",
    "height",
    "min-width",
    "max-width",
    "no-click-animation"
  ];
  constructor() {
    super();
    this.__wUid = "w-overlay-" + Math.random().toString(36).slice(2, 9);
  }
  get open() {
    return this._bool("open");
  }
  get label() {
    return this._attr("label", "Open overlay");
  }
  get persistent() {
    return this._bool("persistent");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get contained() {
    return this._bool("contained");
  }
  get absolute() {
    return this._bool("absolute");
  }
  get location() {
    return this._attr("location", "center");
  }
  get contentClass() {
    return this._attr("content-class", "");
  }
  get noClickAnimation() {
    return this._bool("no-click-animation");
  }
  get hasScrim() {
    const scrim = this.getAttribute("scrim");
    return scrim == null || !["false", "0", "off", "none"].includes(String(scrim).toLowerCase());
  }
  _template() {
    const hasActivator = !!this.querySelector('[slot="activator"]');
    const activator = hasActivator ? `<span class="w-overlay-activator" role="button" tabindex="${this.disabled ? "-1" : "0"}" aria-haspopup="dialog" aria-expanded="${this.open ? "true" : "false"}" aria-controls="${this.__wUid}-content"><slot name="activator"></slot></span>` : `<button class="w-btn w-btn-outlined w-overlay-activator" type="button" aria-haspopup="dialog" aria-expanded="${this.open ? "true" : "false"}" aria-controls="${this.__wUid}-content"${this.disabled ? " disabled" : ""}>${this._esc(this.label)}</button>`;
    const contentClass = ["w-overlay-content", this.contentClass].filter(Boolean).join(" ");
    return `${activator}
      <div class="${this._overlayClass()}"${this._overlayStyle()} ${this.open ? "" : "hidden"} role="presentation">
        ${this.hasScrim ? '<div class="w-overlay-scrim" aria-hidden="true"></div>' : ""}
        <div id="${this.__wUid}-content" class="${this._esc(contentClass)}" role="dialog" aria-modal="${this.contained ? "false" : "true"}" tabindex="-1"${this._contentStyle()}>
          <slot></slot>
        </div>
      </div>`;
  }
  _events() {
    const activator = this._q(".w-overlay-activator");
    if (activator && !this.disabled) {
      activator.addEventListener("click", (event) => {
        event.stopPropagation();
        this.show();
      });
      activator.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ")
          return;
        event.preventDefault();
        this.show();
      });
    }
    const overlay = this._q(".w-overlay");
    if (overlay) {
      overlay.addEventListener("click", (event) => {
        const target = event.target;
        const outside = target === overlay || target instanceof Element && target.classList.contains("w-overlay-scrim");
        if (!outside || this.disabled)
          return;
        if (!this.persistent)
          this.close("outside");
        else
          this._animateClick();
      });
    }
    if (!this.__wOverlayKeydown) {
      this.__wOverlayKeydown = (event) => {
        if (event.key !== "Escape" || !this.open || this.disabled)
          return;
        if (!this.persistent)
          this.close("escape");
        else
          this._animateClick();
      };
      document.addEventListener("keydown", this.__wOverlayKeydown);
    }
  }
  disconnectedCallback() {
    if (this.__wOverlayKeydown)
      document.removeEventListener("keydown", this.__wOverlayKeydown);
  }
  show() {
    this._setOpen(true, "show");
  }
  close(reason = "programmatic") {
    this._setOpen(false, reason);
  }
  _setOpen(open, reason) {
    if (open && this.disabled)
      return;
    if (open === this.open)
      return;
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (open && active && this.contains(active))
      this.__wReturnFocus = active;
    this._silentSet("open", open ? "" : null);
    this._render();
    this._events();
    if (open)
      this._focusContent();
    else
      this._returnFocus();
    this._dispatch("toggle", { open, reason });
    if (!open)
      this._dispatch("close", { open, reason });
  }
  _overlayClass() {
    return [
      "w-overlay",
      this.open ? "open" : "",
      this.hasScrim ? "w-overlay--scrim" : "",
      this.persistent ? "w-overlay--persistent" : "",
      this.contained ? "w-overlay--contained" : "",
      this.absolute ? "w-overlay--absolute" : "",
      "w-overlay--location-" + this._classToken(this.location)
    ].filter(Boolean).join(" ");
  }
  _overlayStyle() {
    const styles = [];
    const scrim = this.getAttribute("scrim");
    const opacity = this.getAttribute("opacity");
    const zIndex = this.getAttribute("z-index");
    if (scrim && !["true", "false", "0", "off", "none"].includes(String(scrim).toLowerCase())) {
      styles.push("--w-overlay-scrim: " + this._scrimValue(scrim));
    }
    if (opacity)
      styles.push("--w-overlay-opacity: " + this._cssPercent(opacity));
    if (zIndex)
      styles.push("z-index: " + this._esc(zIndex));
    return styles.length ? ` style="${styles.join("; ")}"` : "";
  }
  _contentStyle() {
    const styles = [];
    ["width", "height", "min-width", "max-width"].forEach((name) => {
      const value = this.getAttribute(name);
      if (value)
        styles.push(`${name}: ${this._esc(value)}`);
    });
    return styles.length ? ` style="${styles.join("; ")}"` : "";
  }
  _focusContent() {
    const content = this._q(".w-overlay-content");
    if (!content)
      return;
    const focusable = content.querySelector('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    (focusable || content).focus?.({ preventScroll: true });
  }
  _returnFocus() {
    const target = this.__wReturnFocus;
    this.__wReturnFocus = null;
    if (target && target.isConnected)
      target.focus?.({ preventScroll: true });
  }
  _animateClick() {
    if (this.noClickAnimation)
      return;
    const content = this._q(".w-overlay-content");
    if (!content)
      return;
    content.classList.remove("w-overlay-content--bounce");
    content.getBoundingClientRect();
    content.classList.add("w-overlay-content--bounce");
    setTimeout(() => content.classList.remove("w-overlay-content--bounce"), 180);
  }
  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
  _cssPercent(value) {
    const raw = String(value || "").trim();
    if (/^\d+(\.\d+)?%$/.test(raw))
      return raw;
    const number = Number(raw);
    if (Number.isFinite(number))
      return (number <= 1 ? number * 100 : number) + "%";
    return "48%";
  }
  _scrimValue(value) {
    const raw = String(value || "").trim();
    if (/^[a-z][a-z0-9-]*$/i.test(raw))
      return "var(--w-" + this._esc(raw.toLowerCase()) + ", " + this._esc(raw) + ")";
    return this._esc(raw);
  }
  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "center";
  }
}
if (!customElements.get("w-overlay"))
  customElements.define("w-overlay", WOverlay);

// src/components/parallax.js
class WParallax extends WElement {
  static attrs = ["src", "height", "alt", "scale"];
  get src() {
    return this._attr("src", "");
  }
  get height() {
    return this._attr("height", "");
  }
  get alt() {
    return this._attr("alt", "");
  }
  get scale() {
    const s = parseFloat(this._attr("scale", "0.5"));
    return isNaN(s) ? 0.5 : Math.min(Math.max(s, 0), 1);
  }
  _template() {
    const style = this.height ? ` style="height: ${this._esc(this.height)};"` : "";
    return `<div class="w-parallax"${style}>
      <img class="w-parallax-img" src="${this._esc(this.src)}" alt="${this._esc(this.alt)}">
      <div class="w-parallax-content"><slot></slot></div>
    </div>`;
  }
  _events() {
    this._img = this._q(".w-parallax-img");
    this._root = this._q(".w-parallax");
    if (!this._img || this._reducedMotion())
      return;
    this._onScroll = () => this._update();
    window.addEventListener("scroll", this._onScroll, { passive: true });
    window.addEventListener("resize", this._onScroll, { passive: true });
    this._update();
  }
  _reducedMotion() {
    return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  _update() {
    if (!this._root || !this._img)
      return;
    const rect = this._root.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom < 0 || rect.top > vh)
      return;
    const center = rect.top + rect.height / 2;
    const translate = -(center - vh / 2) * this.scale * 0.3;
    this._img.style.transform = `translateY(${translate.toFixed(1)}px)`;
  }
  disconnectedCallback() {
    if (this._onScroll) {
      window.removeEventListener("scroll", this._onScroll);
      window.removeEventListener("resize", this._onScroll);
    }
  }
}
if (!customElements.get("w-parallax"))
  customElements.define("w-parallax", WParallax);

// src/components/picker.js
class WPicker extends WElement {
  static attrs = ["title"];
  get title() {
    return this._attr("title", "");
  }
  _template() {
    return `<div class="w-picker w-card">
      ${this.title ? `<div class="w-card-header">${this._esc(this.title)}</div>` : ""}
      <div class="w-card-body"><slot></slot></div>
    </div>`;
  }
}
if (!customElements.get("w-picker"))
  customElements.define("w-picker", WPicker);

// src/components/progress.js
class WProgress extends WElement {
  static attrs = [
    "variant",
    "value",
    "model-value",
    "max",
    "indeterminate",
    "color",
    "bg-color",
    "tween",
    "height",
    "buffer-value",
    "buffer-color",
    "striped",
    "stream",
    "reverse",
    "rounded",
    "absolute",
    "location",
    "size",
    "width",
    "rotate"
  ];
  static tokens = ["primary", "secondary", "tertiary", "success", "warning", "error", "info", "surface"];
  static sizes = { "x-small": 16, small: 24, sm: 32, default: 32, large: 48, lg: 64, "x-large": 64 };
  get variant() {
    return this._attr("variant", "linear");
  }
  get value() {
    const mv = this._attr("model-value", null);
    return parseFloat(mv != null ? mv : this._attr("value", "0")) || 0;
  }
  get max() {
    return parseFloat(this._attr("max", "100")) || 100;
  }
  get indeterminate() {
    return this._bool("indeterminate");
  }
  get bufferValue() {
    const v = parseFloat(this._attr("buffer-value", "100"));
    return Number.isFinite(v) ? v : 100;
  }
  get reverse() {
    return this._bool("reverse");
  }
  get striped() {
    return this._bool("striped");
  }
  get stream() {
    return this._bool("stream");
  }
  get tween() {
    return this._bool("tween");
  }
  _template() {
    return this.variant === "circular" ? this._circularTemplate() : this._linearTemplate();
  }
  _linearTemplate() {
    const classes = [
      "w-progress",
      this.indeterminate ? "w-progress--indeterminate" : "",
      this.reverse ? "w-progress--reverse" : "",
      this.striped ? "w-progress--striped" : "",
      this.stream ? "w-progress--stream" : "",
      this.hasAttribute("rounded") ? "w-progress--rounded" : "",
      this._bool("absolute") ? "w-progress--absolute" : "",
      this._location() ? "w-progress--" + this._location() : ""
    ].filter(Boolean).join(" ");
    const styles = [];
    const h = this._cssLength(this._attr("height", ""));
    if (h)
      styles.push("--w-progress-height: " + h);
    const fill = this._color(this._attr("color", ""));
    if (fill)
      styles.push("--w-progress-color: " + fill);
    const bg = this._color(this._attr("bg-color", ""));
    if (bg)
      styles.push("--w-progress-bg: " + bg);
    const bufColor = this._color(this._attr("buffer-color", ""));
    if (bufColor)
      styles.push("--w-progress-buffer-color: " + bufColor);
    const style = styles.length ? ` style="${styles.join("; ")}"` : "";
    const buffer = !this.indeterminate && this.hasAttribute("buffer-value") ? `<div class="w-progress-buffer" style="inline-size: ${this._pctOf(this.bufferValue)}%"></div>` : "";
    const stream = this.stream ? `<div class="w-progress-stream" style="inline-size: ${this.indeterminate ? 100 : this._pctOf(this.bufferValue)}%"></div>` : "";
    const barStyle = this.indeterminate ? "" : ` style="inline-size: ${this._pct()}%"`;
    const content = this._hasContent() ? '<div class="w-progress-content"><slot></slot></div>' : "";
    return `<div class="${classes}" role="progressbar" aria-valuemin="0" aria-valuemax="${this.max}"${this.indeterminate ? "" : ` aria-valuenow="${this.value}"`}${style}>
      ${buffer}${stream}<div class="w-progress-bar"${barStyle}></div>${content}
    </div>`;
  }
  _circularTemplate() {
    const styles = [];
    const size = this._resolveSize(this._attr("size", ""));
    if (size)
      styles.push(`width: ${size}px`, `height: ${size}px`);
    const fill = this._color(this._attr("color", ""));
    if (fill)
      styles.push("--w-progress-color: " + fill);
    const bg = this._color(this._attr("bg-color", ""));
    if (bg)
      styles.push("--w-progress-bg: " + bg);
    const width = this._attr("width", "");
    if (width)
      styles.push("--w-progress-width: " + width);
    const rotate = this._attr("rotate", "");
    if (rotate)
      styles.push("--w-progress-rotate: " + rotate + "deg");
    const style = styles.length ? ` style="${styles.join("; ")}"` : "";
    const indet = this.indeterminate ? " w-progress-circular--indeterminate" : "";
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = this.indeterminate ? "" : ` stroke-dashoffset="${circumference - this._pct() / 100 * circumference}"`;
    const content = this._hasContent() ? '<div class="w-progress-content"><slot></slot></div>' : "";
    return `<div class="w-progress-circular${indet}" role="progressbar" aria-valuemin="0" aria-valuemax="${this.max}"${this.indeterminate ? "" : ` aria-valuenow="${this.value}"`}${style}>
      <svg viewBox="0 0 48 48" width="100%" height="100%">
        <circle class="w-progress-track" cx="24" cy="24" r="${radius}"></circle>
        <circle class="w-progress-fill" cx="24" cy="24" r="${radius}" stroke-dasharray="${circumference}"${offset}></circle>
      </svg>${content}
    </div>`;
  }
  _location() {
    const loc = String(this._attr("location", "")).toLowerCase();
    return loc === "top" || loc === "bottom" ? loc : "";
  }
  _resolveSize(value) {
    const raw = String(value || "").trim().toLowerCase();
    if (!raw)
      return "";
    if (this.constructor.sizes[raw])
      return this.constructor.sizes[raw];
    return /^\d+(\.\d+)?$/.test(raw) ? raw : "";
  }
  _color(value) {
    const t = String(value || "").trim().toLowerCase();
    if (!t)
      return "";
    if (t === "surface")
      return "var(--w-surface-container-high)";
    if (this.constructor.tokens.includes(t))
      return `var(--w-${t === "info" ? "primary" : t})`;
    return value;
  }
  _cssLength(value) {
    const raw = String(value || "").trim();
    if (!raw)
      return "";
    return /^\d+(\.\d+)?$/.test(raw) ? raw + "px" : raw;
  }
  _pct() {
    return this._pctOf(this.value);
  }
  _pctOf(v) {
    const max = this.max || 100;
    if (max <= 0)
      return 0;
    return Math.min(100, Math.max(0, v / max * 100));
  }
  _hasContent() {
    return Array.from(this.childNodes).some((n) => {
      if (n.nodeType === Node.ELEMENT_NODE)
        return !n.hasAttribute("slot");
      if (n.nodeType === Node.TEXT_NODE)
        return n.textContent.trim().length > 0;
      return false;
    });
  }
  _events() {
    if (!this.tween || this.indeterminate || !window.WMotion)
      return;
    if (this.variant === "circular") {
      const fill = this._q(".w-progress-fill");
      if (!fill)
        return;
      const radius = 20;
      const circumference = 2 * Math.PI * radius;
      const to = circumference - this._pct() / 100 * circumference;
      window.WMotion.tween(fill, { from: circumference, to, property: "attr:stroke-dashoffset", duration: 700, format: "raw" });
      return;
    }
    const bar = this._q(".w-progress-bar");
    if (bar)
      window.WMotion.tween(bar, { from: 0, to: this._pct(), property: "inline-size", duration: 700 });
  }
}

// src/components/progress-linear.js
class WProgressLinear extends WProgress {
  get variant() {
    return "linear";
  }
}
if (!customElements.get("w-progress-linear")) {
  customElements.define("w-progress-linear", WProgressLinear);
}

// src/components/progress-circular.js
class WProgressCircular extends WProgress {
  get variant() {
    return "circular";
  }
}
if (!customElements.get("w-progress-circular")) {
  customElements.define("w-progress-circular", WProgressCircular);
}

// src/components/pull-to-refresh.js
class WPullToRefresh extends WElement {
  static attrs = ["threshold", "pull-down-threshold", "refreshing", "model-value", "disabled"];
  get threshold() {
    if (this.hasAttribute("pull-down-threshold"))
      return wNumberAttr(this, "pull-down-threshold", 64);
    return wNumberAttr(this, "threshold", 64);
  }
  get disabled() {
    return wBoolAttr(this, "disabled");
  }
  connectedCallback() {
    super.connectedCallback();
    if (wBoolAttr(this, "refreshing") || wBoolAttr(this, "model-value"))
      this.__refreshing = true;
  }
  _template() {
    const refreshing = this.__refreshing ? " is-refreshing" : "";
    return `<div class="w-pull-to-refresh${refreshing}" data-pull-root>
      <div class="w-pull-indicator" aria-hidden="true"><span class="w-pull-spinner"></span>Pull to refresh</div>
      <slot></slot>
    </div>`;
  }
  _events() {
    const root = this._q("[data-pull-root]");
    if (!root || this.disabled)
      return;
    let startY = 0;
    let pulling = false;
    const reset = () => {
      pulling = false;
      root.style.setProperty("--w-pull-distance", "0px");
      root.classList.remove("is-pulling");
    };
    root.addEventListener("pointerdown", (event) => {
      if (root.scrollTop > 0 || this.__refreshing)
        return;
      startY = event.clientY;
      pulling = true;
      root.setPointerCapture?.(event.pointerId);
    });
    root.addEventListener("pointermove", (event) => {
      if (!pulling)
        return;
      const distance = Math.max(0, event.clientY - startY);
      if (!distance)
        return;
      root.classList.add("is-pulling");
      root.style.setProperty("--w-pull-distance", `${Math.min(distance, this.threshold * 1.35)}px`);
      event.preventDefault();
    });
    root.addEventListener("pointerup", () => {
      if (!pulling)
        return;
      const distance = parseFloat(root.style.getPropertyValue("--w-pull-distance")) || 0;
      if (distance >= this.threshold)
        this._refresh();
      reset();
    });
    root.addEventListener("pointercancel", reset);
  }
  complete() {
    this.__refreshing = false;
    this._q("[data-pull-root]")?.classList.remove("is-refreshing");
  }
  _refresh() {
    if (this.__refreshing)
      return;
    this.__refreshing = true;
    this._q("[data-pull-root]")?.classList.add("is-refreshing");
    const detail = { done: () => this.complete() };
    this._emit("load", detail);
    this._emit("change", detail);
  }
}
if (!customElements.get("w-pull-to-refresh"))
  customElements.define("w-pull-to-refresh", WPullToRefresh);

// src/components/radio-group.js
class WRadioGroup extends WElement {
  static attrs = ["name", "value", "label", "disabled", "inline"];
  get name() {
    return this._attr("name", "w-radio-group");
  }
  get value() {
    return this._attr("value", "");
  }
  get label() {
    return this._attr("label", "");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get inline() {
    return this._bool("inline");
  }
  _template() {
    const cls = `w-selection-control-group w-radio-group${this.inline ? " w-radio-group--inline" : ""}`;
    return `<div class="${cls}" role="radiogroup"${this.label ? ` aria-label="${this._esc(this.label)}"` : ""}>
      ${this.label ? `<span class="w-label">${this._esc(this.label)}</span>` : ""}
      <slot></slot>
    </div>`;
  }
  _events() {
    this.querySelectorAll("w-radio").forEach((radio) => {
      if (!radio.getAttribute("name"))
        radio.setAttribute("name", this.name);
      if (this.disabled) {
        radio.setAttribute("disabled", "");
        radio.__wRadioGroupDisabled = true;
      } else if (radio.__wRadioGroupDisabled) {
        radio.removeAttribute("disabled");
        radio.__wRadioGroupDisabled = false;
      }
      const value = radio.getAttribute("value") || radio.textContent.trim();
      radio.toggleAttribute("checked", value === this.value);
      if (radio.__wRadioGroup === this)
        return;
      radio.__wRadioGroup = this;
      radio.addEventListener("change", (event) => {
        event.stopPropagation();
        if (!event.detail?.checked)
          return;
        const next = event.detail.value;
        this._silentSet("value", next);
        this.querySelectorAll("w-radio").forEach((item) => {
          item.toggleAttribute("checked", (item.getAttribute("value") || item.textContent.trim()) === next);
        });
        this._emit("change", { value: next, name: this.name });
      });
    });
  }
}
if (!customElements.get("w-radio-group"))
  customElements.define("w-radio-group", WRadioGroup);

// src/components/range-slider.js
class WRangeSlider extends WElement {
  static attrs = ["min", "max", "start", "end", "step", "label", "disabled", "direction", "thumb-label", "ticks"];
  get min() {
    return Number(this._attr("min", "0"));
  }
  get max() {
    return Number(this._attr("max", "100"));
  }
  get start() {
    return Number(this._attr("start", String(this.min)));
  }
  get end() {
    return Number(this._attr("end", String(this.max)));
  }
  get step() {
    return this._attr("step", "1");
  }
  get stepNum() {
    const s = Number(this.step);
    return s > 0 ? s : 1;
  }
  get label() {
    return this._attr("label", "");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get vertical() {
    return this._attr("direction", "") === "vertical" || this._bool("vertical");
  }
  get thumbLabel() {
    const v = this.getAttribute("thumb-label");
    if (v === null)
      return false;
    return v === "always" ? "always" : true;
  }
  get ticks() {
    const v = this.getAttribute("ticks");
    if (v === null)
      return false;
    return v === "always" ? "always" : true;
  }
  _pct(v) {
    const span = this.max - this.min;
    return span === 0 ? 0 : (v - this.min) / span * 100;
  }
  _ticksHtml() {
    if (!this.ticks)
      return "";
    const span = this.max - this.min;
    const count = Math.floor(span / this.stepNum);
    if (count < 1 || count > 100)
      return "";
    let marks = "";
    for (let i = 0;i <= count; i++) {
      marks += `<span class="w-range-slider-tick" style="--pos:${i * this.stepNum / span * 100}%"></span>`;
    }
    return `<span class="w-range-slider-ticks" aria-hidden="true">${marks}</span>`;
  }
  _thumbLabelsHtml() {
    if (!this.thumbLabel)
      return "";
    return `<span class="w-range-slider-thumb-label" data-thumb="start" style="--pos:${this._pct(this.start)}%">${this.start}</span>` + `<span class="w-range-slider-thumb-label" data-thumb="end" style="--pos:${this._pct(this.end)}%">${this.end}</span>`;
  }
  _template() {
    const dis = this.disabled ? " disabled" : "";
    const sPct = this._pct(this.start);
    const ePct = this._pct(this.end);
    const range = `min="${this.min}" max="${this.max}" step="${this._esc(this.step)}"`;
    const cls = [
      "w-field",
      "w-range-slider",
      this.vertical ? "w-range-slider--vertical" : "",
      this.disabled ? "w-range-slider--disabled" : "",
      this.thumbLabel ? "w-range-slider--thumb-label" : "",
      this.thumbLabel === "always" ? "w-range-slider--thumb-label-always" : ""
    ].filter(Boolean).join(" ");
    return `<label class="${cls}">
      ${this.label ? `<span class="w-label">${this._esc(this.label)}</span>` : ""}
      <span class="w-range-slider-control" style="--start:${sPct}%;--end:${ePct}%">
        <span class="w-range-slider-track" aria-hidden="true">
          <span class="w-range-slider-fill"></span>
        </span>
        ${this._ticksHtml()}
        <input class="w-range-slider-input" type="range" ${range} value="${this.start}" aria-label="Start"${dis}>
        <input class="w-range-slider-input" type="range" ${range} value="${this.end}" aria-label="End"${dis}>
        ${this._thumbLabelsHtml()}
      </span>
      <span class="w-messages">${this.start} – ${this.end}</span>
    </label>`;
  }
  _events() {
    const inputs = Array.from(this.querySelectorAll(".w-range-slider-input"));
    if (inputs.length < 2)
      return;
    const [startInput, endInput] = inputs;
    const commit = (type) => this._emit(type, { start: Number(startInput.value), end: Number(endInput.value) });
    startInput.addEventListener("input", (event) => {
      event.stopPropagation();
      if (Number(startInput.value) > Number(endInput.value))
        startInput.value = endInput.value;
      this._update(inputs);
      commit("input");
    });
    endInput.addEventListener("input", (event) => {
      event.stopPropagation();
      if (Number(endInput.value) < Number(startInput.value))
        endInput.value = startInput.value;
      this._update(inputs);
      commit("input");
    });
    inputs.forEach((input) => input.addEventListener("change", (event) => {
      event.stopPropagation();
      commit("change");
    }));
    this._update(inputs);
  }
  _update(inputs) {
    const start = Number(inputs[0].value);
    const end = Number(inputs[1].value);
    const sPct = this._pct(start);
    const ePct = this._pct(end);
    const control = this._q(".w-range-slider-control");
    if (control) {
      control.style.setProperty("--start", `${sPct}%`);
      control.style.setProperty("--end", `${ePct}%`);
    }
    const startLabel = this._q('.w-range-slider-thumb-label[data-thumb="start"]');
    const endLabel = this._q('.w-range-slider-thumb-label[data-thumb="end"]');
    if (startLabel) {
      startLabel.textContent = String(start);
      startLabel.style.setProperty("--pos", `${sPct}%`);
    }
    if (endLabel) {
      endLabel.textContent = String(end);
      endLabel.style.setProperty("--pos", `${ePct}%`);
    }
    const mid = (this.min + this.max) / 2;
    inputs[0].style.zIndex = start > mid ? "5" : "3";
    inputs[1].style.zIndex = "4";
    this._silentSet("start", start);
    this._silentSet("end", end);
    const msg = this._q(".w-messages");
    if (msg)
      msg.textContent = `${start} – ${end}`;
  }
}
if (!customElements.get("w-range-slider"))
  customElements.define("w-range-slider", WRangeSlider);

// src/components/rating.js
var DEFAULT_EMPTY_ICON = `
  <svg class="w-rating__svg" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 3.7 2.47 5.01 5.53.8-4 3.9.94 5.51L12 16.32l-4.94 2.6.94-5.51-4-3.9 5.53-.8L12 3.7Z"></path>
  </svg>`;
var DEFAULT_FULL_ICON = `
  <svg class="w-rating__svg" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 2.5 2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55-4.76-4.64 6.58-.96L12 2.5Z"></path>
  </svg>`;
var SIZE_VALUES = {
  xs: "1rem",
  "x-small": "1rem",
  sm: "1.25rem",
  small: "1.25rem",
  md: "1.5rem",
  default: "1.5rem",
  lg: "32px",
  large: "32px",
  xl: "2.5rem",
  "x-large": "2.5rem"
};
var TOKEN_COLORS = {
  primary: "primary",
  secondary: "secondary",
  success: "success",
  warning: "warning",
  danger: "error",
  error: "error",
  info: "primary",
  muted: "text-subtle",
  text: "text",
  divider: "divider"
};

class WRating extends WElement {
  static attrs = [
    "value",
    "model-value",
    "name",
    "length",
    "label",
    "item-aria-label",
    "item-labels",
    "item-label-position",
    "empty-icon",
    "full-icon",
    "half-increments",
    "clearable",
    "hover",
    "readonly",
    "disabled",
    "ripple",
    "size",
    "density",
    "tag",
    "theme",
    "color",
    "active-color"
  ];
  get value() {
    const raw = this.hasAttribute("model-value") ? this._attr("model-value", "0") : this._attr("value", "0");
    return this._clamp(this._number(raw, 0));
  }
  set value(nextValue) {
    const value = this._formatValue(this._quantize(this._clamp(nextValue)));
    this.setAttribute("value", value);
  }
  get length() {
    return Math.min(100, Math.max(1, Math.floor(this._number(this._attr("length", "5"), 5))));
  }
  get readonly() {
    return this._bool("readonly");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get halfIncrements() {
    return this._bool("half-increments");
  }
  get label() {
    return this._attr("label", "Rating");
  }
  _template() {
    const selectedValue = this.value;
    const tag = this._tagName();
    const itemLabels = this._itemLabels();
    const itemSlot = this._slotSource("item");
    const itemLabelSlot = this._slotSource("item-label");
    const density = this._density();
    const labelPosition = this._labelPosition();
    const classes = [
      "w-rating",
      `w-rating--density-${density}`,
      `w-rating--labels-${labelPosition}`,
      this.halfIncrements ? "w-rating--half-increments" : "",
      this._bool("hover") ? "w-rating--hover" : "",
      this._bool("ripple") ? "w-rating--ripple" : "",
      this.readonly ? "w-rating--readonly" : "",
      this.disabled ? "w-rating--disabled" : ""
    ].filter(Boolean).join(" ");
    const style = [
      `--w-rating-size:${this._sizeValue()}`,
      `--w-rating-color:${this._colorValue(this._attr("color", ""), "var(--w-divider)")}`,
      `--w-rating-active-color:${this._colorValue(this._attr("active-color", "") || this._attr("color", ""), "var(--w-warning)")}`
    ].join(";");
    const theme = this._attr("theme", "");
    const rootState = [
      `class="${classes}"`,
      `style="${this._esc(style)}"`,
      'role="radiogroup"',
      `aria-label="${this._esc(this.label)}"`,
      this.readonly ? 'aria-readonly="true"' : "",
      this.disabled ? 'aria-disabled="true"' : "",
      theme ? `data-w-theme="${this._esc(theme)}"` : "",
      `data-value="${this._formatValue(selectedValue)}"`
    ].filter(Boolean).join(" ");
    let items = "";
    for (let index = 1;index <= this.length; index += 1) {
      items += this._itemTemplate({
        index,
        selectedValue,
        label: itemLabels[index - 1],
        itemSlot,
        itemLabelSlot
      });
    }
    const inputName = this._attr("name", "");
    return `
      <${tag} ${rootState}>
        <span class="w-rating__items">${items}</span>
        <input
          class="w-rating__input"
          type="hidden"
          ${inputName ? `name="${this._esc(inputName)}"` : ""}
          value="${this._formatValue(selectedValue)}"
        >
        <span class="w-rating__slot-store" hidden aria-hidden="true">
          <slot name="item"></slot>
          <slot name="item-label"></slot>
        </span>
      </${tag}>`;
  }
  _itemTemplate({ index, selectedValue, label, itemSlot, itemLabelSlot }) {
    const fill = this._fillFor(index, selectedValue);
    const state = this._stateFor(fill);
    const controls = this.halfIncrements ? `${this._controlTemplate(index - 0.5, selectedValue, "start")}
         ${this._controlTemplate(index, selectedValue, "end")}` : this._controlTemplate(index, selectedValue, "full");
    const iconData = {
      index,
      value: index,
      label: label ?? "",
      state,
      length: this.length
    };
    const emptyIcon = itemSlot ? this._interpolate(itemSlot, { ...iconData, layer: "empty" }) : this._iconMarkup("empty");
    const fullIcon = itemSlot ? this._interpolate(itemSlot, { ...iconData, layer: "filled" }) : this._iconMarkup("full");
    const labelMarkup = label !== undefined || itemLabelSlot ? `<span class="w-rating__label">${itemLabelSlot ? this._interpolate(itemLabelSlot, iconData) : this._esc(label)}</span>` : "";
    return `
      <span
        class="w-rating__wrapper"
        data-index="${index}"
        data-state="${state}"
        style="--w-rating-fill:${fill}%"
      >
        ${labelMarkup}
        <span class="w-rating__item">
          ${controls}
          <span class="w-rating__visual" aria-hidden="true">
            <span class="w-rating__icon w-rating__icon--empty">${emptyIcon}</span>
            <span class="w-rating__icon w-rating__icon--filled">${fullIcon}</span>
          </span>
        </span>
      </span>`;
  }
  _controlTemplate(value, selectedValue, zone) {
    const formattedValue = this._formatValue(value);
    const checked = value === selectedValue;
    const focusValue = this._focusValue(selectedValue);
    return `
      <button
        class="w-rating__control w-rating__control--${zone}"
        type="button"
        role="radio"
        data-value="${formattedValue}"
        aria-checked="${checked}"
        aria-label="${this._esc(this._itemAriaLabel(value))}"
        tabindex="${value === focusValue ? "0" : "-1"}"
        ${this.disabled ? "disabled" : ""}
      ></button>`;
  }
  _events() {
    const controls = Array.from(this._qAll(".w-rating__control"));
    controls.forEach((control) => {
      control.addEventListener("click", () => {
        if (this.disabled || this.readonly)
          return;
        const targetValue = this._number(control.dataset.value, 0);
        const nextValue = this._bool("clearable") && targetValue === this.value ? 0 : targetValue;
        this._commit(nextValue);
      });
      control.addEventListener("keydown", (event) => this._onKeydown(event));
      if (this._bool("hover")) {
        control.addEventListener("mouseenter", () => {
          if (this.disabled || this.readonly)
            return;
          this._syncVisual(this._number(control.dataset.value, 0), true);
        });
        control.addEventListener("mouseleave", () => {
          this._syncVisual(this.value, false);
        });
      }
    });
  }
  _onKeydown(event) {
    if (this.disabled || this.readonly || event.altKey || event.ctrlKey || event.metaKey)
      return;
    const step = this.halfIncrements ? 0.5 : 1;
    let nextValue;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      nextValue = this.value + step;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      nextValue = this.value - step;
    } else if (event.key === "Home") {
      nextValue = 0;
    } else if (event.key === "End") {
      nextValue = this.length;
    } else {
      return;
    }
    event.preventDefault();
    this._commit(nextValue, true);
  }
  _commit(nextValue, moveFocus = false) {
    const value = this._quantize(this._clamp(nextValue));
    const formattedValue = this._formatValue(value);
    this._silentSet("value", formattedValue);
    if (this.hasAttribute("model-value"))
      this._silentSet("model-value", formattedValue);
    this._syncVisual(value, false);
    this._emit("update:model-value", value);
    this._emit("change", { value });
    if (moveFocus) {
      const focusValue = this._focusValue(value);
      this._q(`.w-rating__control[data-value="${this._formatValue(focusValue)}"]`)?.focus();
    }
  }
  _syncVisual(displayValue, hovering) {
    const root = this._q(".w-rating");
    if (!root)
      return;
    if (hovering)
      root.setAttribute("data-hover-value", this._formatValue(displayValue));
    else
      root.removeAttribute("data-hover-value");
    const selectedValue = this.value;
    root.dataset.value = this._formatValue(selectedValue);
    this._qAll(".w-rating__wrapper").forEach((wrapper) => {
      const index = this._number(wrapper.dataset.index, 1);
      const fill = this._fillFor(index, displayValue);
      wrapper.style.setProperty("--w-rating-fill", `${fill}%`);
      wrapper.dataset.state = this._stateFor(fill);
    });
    const focusValue = this._focusValue(selectedValue);
    this._qAll(".w-rating__control").forEach((control) => {
      const controlValue = this._number(control.dataset.value, 0);
      control.setAttribute("aria-checked", String(controlValue === selectedValue));
      control.tabIndex = controlValue === focusValue ? 0 : -1;
    });
    const input = this._q(".w-rating__input");
    if (input)
      input.value = this._formatValue(selectedValue);
  }
  _itemAriaLabel(value) {
    const template = this._attr("item-aria-label", "{value} of {length}");
    return this._interpolate(template, {
      value: this._formatValue(value),
      length: this.length
    });
  }
  _itemLabels() {
    const raw = this._attr("item-labels", "");
    if (!raw)
      return [];
    try {
      const labels = JSON.parse(raw);
      return Array.isArray(labels) ? labels.map((label) => String(label)) : [];
    } catch {
      return [];
    }
  }
  _slotSource(name) {
    const source = this.querySelector(`[slot="${name}"]`);
    if (!source)
      return "";
    if (source.tagName === "TEMPLATE")
      return source.innerHTML;
    const clone = source.cloneNode(true);
    clone.removeAttribute("slot");
    return clone.outerHTML;
  }
  _interpolate(source, values) {
    return Object.entries(values).reduce((result, [key, value]) => {
      const escapedValue = this._esc(value);
      return result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), escapedValue).replace(new RegExp(`{${key}}`, "g"), escapedValue);
    }, source);
  }
  _iconMarkup(layer) {
    const attribute = layer === "full" ? "full-icon" : "empty-icon";
    const customIcon = this._attr(attribute, "");
    if (customIcon) {
      return icons_default.resolve(customIcon, { iconClass: "w-icon w-rating__custom-icon" });
    }
    return layer === "full" ? DEFAULT_FULL_ICON : DEFAULT_EMPTY_ICON;
  }
  _fillFor(index, value) {
    const rawFill = (value - (index - 1)) * 100;
    return Math.max(0, Math.min(100, rawFill));
  }
  _stateFor(fill) {
    if (fill >= 100)
      return "full";
    if (fill > 0)
      return "half";
    return "empty";
  }
  _focusValue(value) {
    const step = this.halfIncrements ? 0.5 : 1;
    if (value <= 0)
      return step;
    return this._quantize(this._clamp(value));
  }
  _quantize(value) {
    const step = this.halfIncrements ? 0.5 : 1;
    return Math.round(value / step) * step;
  }
  _clamp(value) {
    return Math.max(0, Math.min(this.length, this._number(value, 0)));
  }
  _number(value, fallback) {
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? number : fallback;
  }
  _formatValue(value) {
    return String(Number(value.toFixed(2)));
  }
  _labelPosition() {
    return this._attr("item-label-position", "top") === "bottom" ? "bottom" : "top";
  }
  _density() {
    const density = this._attr("density", "default");
    return ["default", "comfortable", "compact"].includes(density) ? density : "default";
  }
  _tagName() {
    const tag = this._attr("tag", "div").toLowerCase();
    return ["div", "span", "section"].includes(tag) ? tag : "div";
  }
  _sizeValue() {
    const size = this._attr("size", "default").trim().toLowerCase();
    if (SIZE_VALUES[size])
      return SIZE_VALUES[size];
    if (/^\d*\.?\d+$/.test(size))
      return `${size}px`;
    if (/^\d*\.?\d+(rem|em|px|%)$/.test(size))
      return size;
    return SIZE_VALUES.default;
  }
  _colorValue(color, fallback) {
    const value = String(color || "").trim().toLowerCase();
    if (!value)
      return fallback;
    if (TOKEN_COLORS[value])
      return `var(--w-${TOKEN_COLORS[value]})`;
    if (globalThis.CSS?.supports?.("color", value))
      return value;
    return fallback;
  }
}
if (!customElements.get("w-rating"))
  customElements.define("w-rating", WRating);

// src/components/responsive.js
class WResponsive extends WElement {
  static attrs = ["aspect-ratio"];
  get aspectRatio() {
    return this._attr("aspect-ratio", "16 / 9");
  }
  _template() {
    return `<div class="w-responsive" style="aspect-ratio:${this._esc(this.aspectRatio)}"><slot></slot></div>`;
  }
}
if (!customElements.get("w-responsive"))
  customElements.define("w-responsive", WResponsive);

// src/components/selection-control.js
class WSelectionControl extends WElement {
  static attrs = ["type", "label", "name", "value", "checked", "disabled"];
  get type() {
    return this._attr("type", "checkbox");
  }
  get label() {
    return this._attr("label", "");
  }
  get name() {
    return this._attr("name", "");
  }
  get value() {
    return this._attr("value", "on");
  }
  get checked() {
    return this._bool("checked");
  }
  get disabled() {
    return this._bool("disabled");
  }
  _template() {
    const type = this.type === "radio" ? "radio" : "checkbox";
    const nm = this.name ? ` name="${this._esc(this.name)}"` : "";
    const val = this.value ? ` value="${this._esc(this.value)}"` : "";
    return `<label class="w-selection-control">
      <input type="${type}"${nm}${val}${this.checked ? " checked" : ""}${this.disabled ? " disabled" : ""}>
      <span>${this._esc(this.label)}<slot></slot></span>
    </label>`;
  }
  _events() {
    const input = this._q("input");
    if (!input)
      return;
    input.addEventListener("change", (event) => {
      event.stopPropagation();
      this._silentSet("checked", input.checked);
      this._emit("change", { checked: input.checked, name: this.name, value: this.value });
    });
  }
}
if (!customElements.get("w-selection-control"))
  customElements.define("w-selection-control", WSelectionControl);

// src/components/selection-control-group.js
class WSelectionControlGroup extends WElement {
  _template() {
    return `<div class="w-selection-control-group" role="group"><slot></slot></div>`;
  }
}
if (!customElements.get("w-selection-control-group"))
  customElements.define("w-selection-control-group", WSelectionControlGroup);

// src/components/sheet.js
class WSheet extends WElement {
  static attrs = ["bottom", "open"];
  get bottom() {
    return this._bool("bottom");
  }
  get open() {
    return this._bool("open");
  }
  _template() {
    if (this.bottom) {
      return `<div class="w-sheet-bottom${this.open ? " open" : ""}"><slot></slot></div>`;
    }
    return `<div class="w-card"><slot></slot></div>`;
  }
}
if (!customElements.get("w-sheet"))
  customElements.define("w-sheet", WSheet);

// src/components/skeleton.js
var SKELETON_BASIC = {
  text: '<div class="w-skeleton w-skeleton-text"></div>',
  heading: '<div class="w-skeleton w-skeleton-heading"></div>',
  subtitle: '<div class="w-skeleton w-skeleton-subtitle"></div>',
  avatar: '<div class="w-skeleton w-skeleton-avatar"></div>',
  image: '<div class="w-skeleton w-skeleton-image"></div>',
  button: '<div class="w-skeleton w-skeleton-button"></div>',
  chip: '<div class="w-skeleton w-skeleton-chip"></div>',
  icon: '<div class="w-skeleton w-skeleton-icon"></div>',
  divider: '<div class="w-skeleton w-skeleton-divider"></div>',
  "table-cell": '<div class="w-skeleton w-skeleton-table-cell"></div>',
  block: '<div class="w-skeleton w-skeleton-block"></div>'
};
var SKELETON_COMPOSITE = {
  sentences: "text@2",
  paragraph: "text@3",
  article: "heading, paragraph",
  actions: "button@2",
  card: "image, article",
  "card-avatar": "image, list-item-avatar"
};
var SKELETON_LIST = {
  "list-item": [false, 1],
  "list-item-two-line": [false, 2],
  "list-item-three-line": [false, 3],
  "list-item-avatar": [true, 1],
  "list-item-avatar-two-line": [true, 2],
  "list-item-avatar-three-line": [true, 3]
};

class WSkeleton extends WElement {
  static attrs = ["type", "boilerplate", "loading", "color", "width", "height", "variant", "lines"];
  static tokens = ["primary", "secondary", "tertiary", "success", "warning", "error", "info"];
  get type() {
    return this._attr("type", "");
  }
  _template() {
    if (this._hasDefaultSlot() && !this._bool("loading")) {
      return "<slot></slot>";
    }
    const bones = this.type ? this._resolveList(this.type) : this._legacyBones();
    const styles = [];
    const w = this._cssLength(this._attr("width", ""));
    const h = this._cssLength(this._attr("height", ""));
    if (w)
      styles.push("width: " + w);
    if (h)
      styles.push("height: " + h);
    const color = this._color(this._attr("color", ""));
    if (color)
      styles.push("--w-skeleton-color: " + color);
    const style = styles.length ? ` style="${styles.join("; ")}"` : "";
    const cls = "w-skeleton-loader" + (this._bool("boilerplate") ? " w-skeleton--boilerplate" : "");
    return `<div class="${cls}" aria-busy="true" aria-live="polite"${style}>${bones}</div>`;
  }
  _resolveList(list) {
    return String(list).split(",").map((t) => this._resolveToken(t.trim())).join("");
  }
  _resolveToken(token) {
    if (!token)
      return "";
    const at = token.indexOf("@");
    if (at !== -1) {
      const base = token.slice(0, at);
      const count = Math.max(1, parseInt(token.slice(at + 1), 10) || 1);
      return Array.from({ length: count }, () => this._resolveToken(base)).join("");
    }
    if (SKELETON_LIST[token])
      return this._listItem(...SKELETON_LIST[token]);
    if (SKELETON_COMPOSITE[token]) {
      const inner = this._resolveList(SKELETON_COMPOSITE[token]);
      if (token === "card" || token === "card-avatar")
        return `<div class="w-skeleton-card">${inner}</div>`;
      return inner;
    }
    return SKELETON_BASIC[token] || SKELETON_BASIC.text;
  }
  _listItem(hasAvatar, lines) {
    const avatar = hasAvatar ? SKELETON_BASIC.avatar : "";
    const text = Array.from({ length: lines }, () => SKELETON_BASIC.text).join("");
    return `<div class="w-skeleton-list-item">${avatar}<div class="w-skeleton-list-item__content">${text}</div></div>`;
  }
  _legacyBones() {
    const v = this._attr("variant", "text");
    if (v === "avatar")
      return SKELETON_BASIC.avatar;
    if (v === "block")
      return SKELETON_BASIC.block;
    const count = Math.max(1, parseInt(this._attr("lines", "1"), 10) || 1);
    return Array.from({ length: count }, () => SKELETON_BASIC.text).join("");
  }
  _color(value) {
    const t = String(value || "").trim().toLowerCase();
    if (!t)
      return "";
    if (this.constructor.tokens.includes(t))
      return `var(--w-${t === "info" ? "primary" : t})`;
    return value;
  }
  _cssLength(value) {
    const raw = String(value || "").trim();
    if (!raw)
      return "";
    return /^\d+(\.\d+)?$/.test(raw) ? raw + "px" : raw;
  }
  _hasDefaultSlot() {
    return Array.from(this.childNodes).some((n) => {
      if (n.nodeType === Node.ELEMENT_NODE)
        return !n.hasAttribute("slot");
      if (n.nodeType === Node.TEXT_NODE)
        return n.textContent.trim().length > 0;
      return false;
    });
  }
}
customElements.define("w-skeleton", WSkeleton);

// src/components/skeleton-loader.js
class WSkeletonLoader extends customElements.get("w-skeleton") {
}
if (!customElements.get("w-skeleton-loader")) {
  customElements.define("w-skeleton-loader", WSkeletonLoader);
}

// src/components/slide-group.js
class WSlideGroup extends WItemGroup {
  static attrs = ["value", "multiple", "mandatory", "selected-class", "disabled", "center-active", "show-arrows", "direction", "prev-icon", "next-icon"];
  get centerActive() {
    return wBoolAttr(this, "center-active");
  }
  get showArrows() {
    return wBoolAttr(this, "show-arrows", true);
  }
  get arrowsAlways() {
    return this.getAttribute("show-arrows") === "always";
  }
  get direction() {
    return this._attr("direction", "horizontal");
  }
  get prevIcon() {
    return this._attr("prev-icon", "") || (this.direction === "vertical" ? "↑" : "‹");
  }
  get nextIcon() {
    return this._attr("next-icon", "") || (this.direction === "vertical" ? "↓" : "›");
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this._resizeObserver && typeof ResizeObserver === "function") {
      this._resizeObserver = new ResizeObserver(() => this._updateArrows());
      this._resizeObserver.observe(this);
    }
  }
  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }
  _template() {
    const vertical = this.direction === "vertical";
    const alwaysClass = this.arrowsAlways ? " w-slide-group-shell--arrows-always" : "";
    const prevArrow = this.showArrows ? `<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" data-slide-scroll="-1" aria-label="Previous items">${this._esc(this.prevIcon)}</button>` : "";
    const nextArrow = this.showArrows ? `<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" data-slide-scroll="1" aria-label="Next items">${this._esc(this.nextIcon)}</button>` : "";
    return `<div class="w-slide-group-shell${vertical ? " w-slide-group-shell--vertical" : ""}${alwaysClass}">
      ${prevArrow}
      <div class="w-slide-group" role="group" tabindex="0"><slot></slot></div>
      ${nextArrow}
    </div>`;
  }
  _events() {
    super._events();
    const scroller = this._q(".w-slide-group");
    if (!scroller)
      return;
    this._qAll("[data-slide-scroll]").forEach((button) => {
      button.addEventListener("click", () => this._scrollByPage(Number(button.getAttribute("data-slide-scroll"))));
    });
    scroller.addEventListener("scroll", () => this._updateArrows(), { passive: true });
    scroller.addEventListener("keydown", (event) => {
      const horizontal = this.direction !== "vertical";
      if (horizontal && event.key === "ArrowRight" || !horizontal && event.key === "ArrowDown") {
        event.preventDefault();
        this._focusSibling(1);
      }
      if (horizontal && event.key === "ArrowLeft" || !horizontal && event.key === "ArrowUp") {
        event.preventDefault();
        this._focusSibling(-1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        this._focusItem(this._items()[0]);
      }
      if (event.key === "End") {
        event.preventDefault();
        this._focusItem(this._items().at(-1));
      }
    });
    this._scrollActiveIntoView();
    requestAnimationFrame(() => this._updateArrows());
  }
  _setSelected(selected) {
    super._setSelected(selected);
    this._scrollActiveIntoView();
    this._updateArrows();
  }
  _updateArrows() {
    const shell = this._q(".w-slide-group-shell");
    const scroller = this._q(".w-slide-group");
    if (!shell || !scroller)
      return;
    const horizontal = this.direction !== "vertical";
    const pos = horizontal ? scroller.scrollLeft : scroller.scrollTop;
    const size = horizontal ? scroller.scrollWidth : scroller.scrollHeight;
    const client = horizontal ? scroller.clientWidth : scroller.clientHeight;
    const max = size - client;
    shell.classList.toggle("w-slide-group-shell--overflow", max > 1);
    const edge = 4;
    const prev = this._q(".w-slide-group-arrow--prev");
    const next = this._q(".w-slide-group-arrow--next");
    if (prev)
      prev.disabled = pos <= edge;
    if (next)
      next.disabled = pos >= max - edge;
  }
  _scrollByPage(direction) {
    const scroller = this._q(".w-slide-group");
    if (!scroller)
      return;
    const horizontal = this.direction !== "vertical";
    scroller.scrollBy({
      left: horizontal ? direction * scroller.clientWidth * 0.8 : 0,
      top: horizontal ? 0 : direction * scroller.clientHeight * 0.8,
      behavior: "smooth"
    });
  }
  _focusSibling(direction) {
    const items = this._items().filter((item) => !item.hasAttribute("disabled"));
    const current = document.activeElement;
    const currentIndex = items.findIndex((item) => item === current || item.contains(current));
    const index = Math.max(0, currentIndex);
    const next = items[Math.max(0, Math.min(items.length - 1, index + direction))];
    this._focusItem(next);
  }
  _focusItem(item) {
    if (!item)
      return;
    const focusTarget = item.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || item;
    focusTarget.focus({ preventScroll: true });
    item.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  _scrollActiveIntoView() {
    const active = this._items().find((item) => item.classList.contains(this.selectedClass) || item.hasAttribute("selected"));
    if (!active)
      return;
    active.scrollIntoView({
      behavior: "smooth",
      block: this.centerActive ? "center" : "nearest",
      inline: this.centerActive ? "center" : "nearest"
    });
  }
}
if (!customElements.get("w-slide-group"))
  customElements.define("w-slide-group", WSlideGroup);

// src/components/slide-group-item.js
class WSlideGroupItem extends WElement {
  static attrs = ["value", "disabled"];
  get disabled() {
    return wBoolAttr(this, "disabled");
  }
  _template() {
    return `<div class="w-slide-group-item"${this.disabled ? ' aria-disabled="true"' : ""}><slot></slot></div>`;
  }
}
if (!customElements.get("w-slide-group-item"))
  customElements.define("w-slide-group-item", WSlideGroupItem);

// src/components/snackbar.js
class WSnackbar extends WElement {
  static attrs = ["message", "text", "action", "duration", "timeout", "open", "model-value", "inline", "color", "variant", "location", "multi-line", "vertical", "rounded", "timer"];
  static variants = ["flat", "elevated", "tonal", "outlined", "text"];
  static tokens = ["primary", "secondary", "tertiary", "success", "warning", "error", "info"];
  get message() {
    return this._attr("text", "") || this._attr("message", "");
  }
  set message(v) {
    this.setAttribute("message", v);
  }
  get action() {
    return this._attr("action", "");
  }
  get duration() {
    const raw = this.hasAttribute("timeout") ? this._attr("timeout", "5000") : this._attr("duration", "5000");
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : 5000;
  }
  get open() {
    return this._bool("open") || this._truthy("model-value");
  }
  set open(v) {
    v ? this.setAttribute("open", "") : this.removeAttribute("open");
  }
  get inline() {
    return this._bool("inline");
  }
  get variant() {
    const v = this._attr("variant", "");
    return this.constructor.variants.includes(v) ? v : "";
  }
  get multiLine() {
    return this._bool("multi-line");
  }
  get vertical() {
    return this._bool("vertical");
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.open)
      this._scheduleDismiss();
  }
  _template() {
    if (!this.open)
      return "";
    const loc = this._location();
    const classes = [
      "w-snackbar",
      "open",
      this.inline ? "w-snackbar--inline" : "",
      "w-snackbar--" + loc.y,
      "w-snackbar--" + loc.x,
      this.multiLine ? "w-snackbar--multi-line" : "",
      this.vertical ? "w-snackbar--vertical" : "",
      this.hasAttribute("rounded") ? "w-snackbar--rounded" : "",
      this.variant ? "w-snackbar--" + this.variant : ""
    ].filter(Boolean).join(" ");
    const closeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    const msg = this.message;
    const actions = this._hasSlot("actions") ? '<slot name="actions"></slot>' : this.action ? `<button class="w-snackbar-action" type="button" data-w-snackbar-action>${this._esc(this.action)}</button>` : "";
    let html = `<div class="${classes}" role="status" aria-live="polite"${this._surfaceStyle()}>`;
    html += `<div class="w-snackbar-content"><span class="w-snackbar-msg">${msg ? this._esc(msg) : "<slot></slot>"}</span></div>`;
    html += `<div class="w-snackbar-actions">${actions}<button class="w-snackbar-close" type="button" data-w-snackbar-close aria-label="Dismiss">${closeIcon}</button></div>`;
    if (this.hasAttribute("timer") && this.duration > 0) {
      html += `<div class="w-snackbar-timer" style="animation-duration:${this.duration}ms${this._timerColor()}"></div>`;
    }
    html += `</div>`;
    return html;
  }
  _events() {
    if (!this.open)
      return;
    const action = this._q("[data-w-snackbar-action]");
    if (action)
      action.addEventListener("click", () => this.close());
    const close = this._q("[data-w-snackbar-close]");
    if (close)
      close.addEventListener("click", () => this.close());
  }
  _location() {
    const parts = String(this._attr("location", "bottom")).toLowerCase().split(/[\s-]+/);
    const y = parts.includes("top") ? "top" : "bottom";
    const x = parts.includes("start") || parts.includes("left") ? "start" : parts.includes("end") || parts.includes("right") ? "end" : "center";
    return { y, x };
  }
  _surfaceStyle() {
    const t = String(this._attr("color", "")).trim().toLowerCase();
    if (!t)
      return "";
    if (this.constructor.tokens.includes(t)) {
      const n = t === "info" ? "primary" : t;
      return ` style="--w-snackbar-bg: var(--w-${n}-container); --w-snackbar-fg: var(--w-on-${n}-container); --w-snackbar-action: var(--w-${n})"`;
    }
    return ` style="--w-snackbar-bg: ${this._esc(this._attr("color", ""))}"`;
  }
  _timerColor() {
    const t = String(this._attr("timer", "")).trim().toLowerCase();
    if (!t || t === "true" || t === "")
      return "";
    const c = this.constructor.tokens.includes(t) ? `var(--w-${t === "info" ? "primary" : t})` : this._attr("timer", "");
    return `;background:${this._esc(c)}`;
  }
  _scheduleDismiss() {
    if (this._timer)
      clearTimeout(this._timer);
    if (this.duration < 0)
      return;
    this._timer = setTimeout(() => this.close(), this.duration);
  }
  _truthy(name) {
    if (!this.hasAttribute(name))
      return false;
    return !["false", "0", "null"].includes(String(this.getAttribute(name)).toLowerCase());
  }
  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
  show() {
    this.open = true;
    this._scheduleDismiss();
  }
  close() {
    if (this._timer)
      clearTimeout(this._timer);
    this.open = false;
    if (this.hasAttribute("model-value"))
      this._silentSet("model-value", "false");
    this._emit("update:model-value", false);
    this._emit("close");
  }
}
customElements.define("w-snackbar", WSnackbar);

// src/components/snackbar-queue.js
class WSnackbarQueue extends WElement {
  static attrs = ["messages", "duration", "timeout", "color", "location", "variant"];
  get messages() {
    return wRows(this._attr("messages", ""));
  }
  get duration() {
    return this.hasAttribute("timeout") ? wNumberAttr(this, "timeout", 5000) : wNumberAttr(this, "duration", 5000);
  }
  _forwarded() {
    return ["color", "location", "variant"].filter((a) => this.hasAttribute(a)).map((a) => `${a}="${this._esc(this.getAttribute(a))}"`).join(" ");
  }
  _template() {
    if (!this.__queue)
      this.__queue = this.messages.map((message) => ({ message, id: Math.random().toString(36).slice(2) }));
    const fwd = this._forwarded();
    return `<div class="w-snackbar-queue" aria-live="polite">
      ${this.__queue.map((item) => `<w-snackbar open message="${this._esc(item.message)}" timeout="${this.duration}" data-id="${this._esc(item.id)}" ${fwd}></w-snackbar>`).join("")}
      <slot></slot>
    </div>`;
  }
  _events() {
    this.querySelectorAll("w-snackbar[data-id]").forEach((snackbar) => {
      snackbar.addEventListener("close", () => this._remove(snackbar.getAttribute("data-id")));
    });
  }
  push(message, options = {}) {
    if (!this.__queue)
      this.__queue = [];
    this.__queue.push({
      id: Math.random().toString(36).slice(2),
      message: String(message || ""),
      ...options
    });
    this._render();
    this._events();
  }
  _remove(id) {
    this.__queue = (this.__queue || []).filter((item) => item.id !== id);
    this._render();
    this._events();
  }
}
if (!customElements.get("w-snackbar-queue"))
  customElements.define("w-snackbar-queue", WSnackbarQueue);

// src/components/sparkline.js
var sparkUid = 0;

class WSparkline extends WElement {
  static attrs = [
    "values",
    "type",
    "fill",
    "smooth",
    "color",
    "gradient",
    "gradient-direction",
    "line-width",
    "padding",
    "min",
    "max",
    "labels",
    "show-labels",
    "label-size",
    "auto-draw",
    "auto-draw-duration",
    "label"
  ];
  get values() {
    return wNumberList(this._attr("values", ""));
  }
  get type() {
    return this._attr("type", "trend");
  }
  get isBar() {
    return this.type === "bar";
  }
  get fill() {
    return wBoolAttr(this, "fill");
  }
  get smooth() {
    if (!this.hasAttribute("smooth"))
      return 0;
    const n = parseFloat(this._attr("smooth", ""));
    return Number.isFinite(n) ? n : 8;
  }
  get color() {
    return this._attr("color", "");
  }
  get gradient() {
    return this._attr("gradient", "").split(",").map((c) => c.trim()).filter(Boolean);
  }
  get gradientDirection() {
    return this._attr("gradient-direction", "left");
  }
  get lineWidth() {
    const n = parseFloat(this._attr("line-width", ""));
    return Number.isFinite(n) ? n : 4;
  }
  get padding() {
    const n = parseFloat(this._attr("padding", ""));
    return Number.isFinite(n) ? n : 4;
  }
  get labels() {
    return this._attr("labels", "").split(",").map((l) => l.trim()).filter(Boolean);
  }
  get showLabels() {
    return wBoolAttr(this, "show-labels");
  }
  get labelSize() {
    const n = parseFloat(this._attr("label-size", ""));
    return Number.isFinite(n) ? n : 6;
  }
  get autoDraw() {
    return wBoolAttr(this, "auto-draw");
  }
  get autoDrawDuration() {
    const n = parseFloat(this._attr("auto-draw-duration", ""));
    return Number.isFinite(n) ? n : 1000;
  }
  get label() {
    return this._attr("label", "Sparkline");
  }
  _color(c) {
    c = String(c).trim();
    return /^[a-z][a-z0-9-]*$/i.test(c) ? `var(--w-${c}, ${c})` : c;
  }
  _template() {
    const values = this.values.length ? this.values : [3, 6, 4, 8, 5, 9];
    const pad = this.padding;
    const W = 100;
    const labelList = this.showLabels ? values.map((v) => String(v)) : this.labels;
    const labelH = labelList.length ? this.labelSize + 4 : 0;
    const chartH = 40;
    const H = chartH + labelH;
    const min = Number.isFinite(parseFloat(this._attr("min", ""))) ? parseFloat(this._attr("min", "")) : Math.min(...values);
    const max = Number.isFinite(parseFloat(this._attr("max", ""))) ? parseFloat(this._attr("max", "")) : Math.max(...values);
    const range = max - min || 1;
    const uid = this._uid || (this._uid = `w-spark-${++sparkUid}`);
    const stroke = this.gradient.length ? `url(#${uid})` : this.color ? this._color(this.color) : "var(--w-primary)";
    const defs = this.gradient.length ? this._gradientDefs(uid) : "";
    const aria = ` role="img" aria-label="${this._esc(this.label)}"`;
    const cls = `w-sparkline w-sparkline--${this.isBar ? "bar" : "trend"}${this.fill ? " w-sparkline--fill" : ""}${this.autoDraw && !this.isBar ? " w-sparkline--auto-draw" : ""}`;
    const style = ` style="--w-sparkline-color:${stroke};--w-sparkline-width:${this.lineWidth};--w-sparkline-draw-duration:${this.autoDrawDuration}ms"`;
    const body = this.isBar ? this._barBody(values, min, range, pad, W, chartH) : this._trendBody(values, min, range, pad, W, chartH);
    const labelsSvg = labelList.length ? this._labelsSvg(values, labelList, pad, W, H) : "";
    return `<svg class="${cls}" viewBox="0 0 ${W} ${H}"${aria}${style}>${defs}${body}${labelsSvg}</svg>`;
  }
  _x(i, n, pad, W) {
    return n === 1 ? W / 2 : i / (n - 1) * (W - pad * 2) + pad;
  }
  _y(v, min, range, pad, chartH) {
    return chartH - pad - (v - min) / range * (chartH - pad * 2);
  }
  _trendBody(values, min, range, pad, W, chartH) {
    const pts = values.map((v, i) => ({ x: this._x(i, values.length, pad, W), y: this._y(v, min, range, pad, chartH) }));
    const d = this.smooth ? this._smoothPath(pts) : pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
    const fill = this.fill && pts.length ? `<path class="w-sparkline-fill" d="${d} L${pts[pts.length - 1].x.toFixed(2)},${chartH} L${pts[0].x.toFixed(2)},${chartH} Z"></path>` : "";
    return `${fill}<path class="w-sparkline-line" d="${d}" pathLength="1"></path>`;
  }
  _smoothPath(pts) {
    if (pts.length < 2)
      return pts.length ? `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}` : "";
    const t = Math.min(Math.max(this.smooth, 0) / 48, 0.3) || 1 / 6;
    let d = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
    for (let i = 0;i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) * t;
      const c1y = p1.y + (p2.y - p0.y) * t;
      const c2x = p2.x - (p3.x - p1.x) * t;
      const c2y = p2.y - (p3.y - p1.y) * t;
      d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
    }
    return d;
  }
  _barBody(values, min, range, pad, W, chartH) {
    const n = values.length;
    const slot = (W - pad * 2) / n;
    const gap = Math.min(slot * 0.25, this.lineWidth / 2 + 1);
    const bw = Math.max(1, slot - gap);
    return values.map((v, i) => {
      const h = (v - min) / range * (chartH - pad * 2) + pad;
      const x = pad + i * slot + (slot - bw) / 2;
      return `<rect class="w-sparkline-bar" x="${x.toFixed(2)}" y="${(chartH - h).toFixed(2)}" width="${bw.toFixed(2)}" height="${h.toFixed(2)}" rx="1.5"></rect>`;
    }).join("");
  }
  _labelsSvg(values, labels, pad, W, H) {
    const n = values.length;
    return `<g class="w-sparkline-labels" font-size="${this.labelSize}">` + labels.map((text, i) => {
      const x = this.isBar ? pad + (i + 0.5) / n * (W - pad * 2) : this._x(i, n, pad, W);
      return `<text x="${x.toFixed(2)}" y="${(H - 1).toFixed(2)}" text-anchor="middle">${this._esc(text)}</text>`;
    }).join("") + `</g>`;
  }
  _gradientDefs(uid) {
    const dir = { left: [0, 0, 1, 0], right: [1, 0, 0, 0], top: [0, 0, 0, 1], bottom: [0, 1, 0, 0] }[this.gradientDirection] || [0, 0, 1, 0];
    const colors = this.gradient;
    const stops = colors.map((c, i) => `<stop offset="${colors.length === 1 ? 0 : (i / (colors.length - 1) * 100).toFixed(0)}%" stop-color="${this._color(c)}"></stop>`).join("");
    return `<defs><linearGradient id="${uid}" x1="${dir[0]}" y1="${dir[1]}" x2="${dir[2]}" y2="${dir[3]}">${stops}</linearGradient></defs>`;
  }
}
if (!customElements.get("w-sparkline"))
  customElements.define("w-sparkline", WSparkline);

// src/components/speed-dial.js
class WSpeedDial extends WElement {
  static attrs = ["icon", "icon-set", "open", "open-on-hover", "location", "transition", "aria-label"];
  get icon() {
    return this._attr("icon", "+");
  }
  get iconSet() {
    return this._attr("icon-set", "");
  }
  get open() {
    return this._bool("open");
  }
  get openOnHover() {
    return this._bool("open-on-hover");
  }
  get location() {
    return this._attr("location", "top center");
  }
  get transition() {
    return this._attr("transition", "scale");
  }
  _template() {
    const loc = this.location || "top center";
    const locParts = loc.split(/[-\s]+/);
    const vPos = locParts[0] || "top";
    const hPos = locParts[1] || "center";
    const locClass = ` w-speed-dial--${vPos} w-speed-dial--${hPos}`;
    const openClass = this.open ? " w-speed-dial--open" : "";
    const transitionClass = ` w-speed-dial--transition-${this.transition}`;
    const iconSet = this.iconSet;
    const value = iconSet ? `${iconSet}:${this.icon}` : this.icon;
    const icon = icons_default.resolve(value, { iconClass: "w-icon" });
    const aria = this.getAttribute("aria-label") || "Open actions";
    return `<div class="w-speed-dial${locClass}${openClass}${transitionClass}">
      <button class="w-fab w-speed-dial__trigger" type="button" aria-expanded="${this.open ? "true" : "false"}" aria-haspopup="true" aria-label="${this._esc(aria)}">
        ${icon}
      </button>
      <div class="w-speed-dial__actions"><slot></slot></div>
    </div>`;
  }
  _events() {
    const trigger = this._q(".w-speed-dial__trigger");
    const actions = this._q(".w-speed-dial__actions");
    if (!trigger || !actions)
      return;
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      this._toggle(!this.open);
    });
    if (this.openOnHover) {
      let leaveTimer;
      this.addEventListener("mouseenter", () => {
        clearTimeout(leaveTimer);
        if (!this.open)
          this._toggle(true);
      });
      this.addEventListener("mouseleave", () => {
        leaveTimer = setTimeout(() => this._toggle(false), 150);
      });
    }
    this._keydownHandler = (e) => {
      if (e.key === "Escape" && this.open) {
        e.preventDefault();
        this._toggle(false);
        trigger.focus();
      }
    };
    document.addEventListener("keydown", this._keydownHandler);
    this._outsideHandler = (e) => {
      if (this.open && !this.contains(e.target)) {
        this._toggle(false);
      }
    };
    document.addEventListener("click", this._outsideHandler);
  }
  _toggle(nextOpen) {
    if (this.open === nextOpen)
      return;
    this._silentSet("open", nextOpen);
    this._emit("toggle", { open: nextOpen });
    this._emit("update:open", { open: nextOpen });
    this._render();
    this._events();
  }
  disconnectedCallback() {
    if (this._keydownHandler) {
      document.removeEventListener("keydown", this._keydownHandler);
      this._keydownHandler = null;
    }
    if (this._outsideHandler) {
      document.removeEventListener("click", this._outsideHandler);
      this._outsideHandler = null;
    }
  }
}
if (!customElements.get("w-speed-dial"))
  customElements.define("w-speed-dial", WSpeedDial);

// src/components/step.js
class WStep extends WElement {
  static attrs = ["label", "caption", "state", "value", "complete", "error", "editable"];
  get label() {
    return this._attr("label", "");
  }
  get caption() {
    return this._attr("caption", "");
  }
  get state() {
    return this._attr("state", "");
  }
  get value() {
    return this._attr("value", "");
  }
  _template() {
    const isError = this._bool("error") || this.state === "error";
    const isDone = !isError && (this._bool("complete") || this.state === "done" || this.state === "complete");
    const isActive = !isError && !isDone && this.state === "active";
    const editable = this._bool("editable");
    const cls = ["w-step"];
    if (isActive)
      cls.push("active");
    if (isDone)
      cls.push("done");
    if (isError)
      cls.push("error");
    if (editable)
      cls.push("editable");
    const indicator = isError ? "!" : isDone ? "✓" : this._esc(this.value || "");
    return `<div class="${cls.join(" ")}" role="presentation" data-step-header>
      <div class="w-step-indicator">${indicator}</div>
      <div class="w-step-connector"></div>
      <div class="w-step-content">
        <div class="w-step-label">${this._esc(this.label)}<slot></slot></div>
        ${this.caption ? `<div class="w-step-caption">${this._esc(this.caption)}</div>` : ""}
      </div>
    </div>`;
  }
}
if (!customElements.get("w-step"))
  customElements.define("w-step", WStep);

// src/components/stepper-item.js
class WStepperItem extends customElements.get("w-step") {
}
if (!customElements.get("w-stepper-item")) {
  customElements.define("w-stepper-item", WStepperItem);
}

// src/components/stepper.js
class WStepper extends WElement {
  static attrs = ["value", "editable", "non-linear", "alt-labels", "mandatory", "vertical"];
  get editable() {
    return this._bool("editable");
  }
  get nonLinear() {
    return this._bool("non-linear");
  }
  get altLabels() {
    return this._bool("alt-labels");
  }
  get vertical() {
    return this._bool("vertical");
  }
  _stepSelector() {
    return "w-step, w-stepper-item";
  }
  _template() {
    const cls = ["w-stepper"];
    if (this.vertical)
      cls.push("w-stepper--vertical");
    if (this.altLabels)
      cls.push("w-stepper--alt-labels");
    if (this.editable || this.nonLinear)
      cls.push("w-stepper--clickable");
    return `<div class="${cls.join(" ")}"><slot></slot></div>`;
  }
  _events() {
    this._sync();
    queueMicrotask(() => this.isConnected && this._sync());
    if (this.__wStepperBound)
      return;
    this.__wStepperBound = true;
    this.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target)
        return;
      const action = target.closest("[data-stepper-action]");
      if (action && this.contains(action) && !action.hasAttribute("disabled")) {
        this._move(action.getAttribute("data-stepper-action") === "prev" ? -1 : 1);
        return;
      }
      const header = target.closest("[data-step-header]");
      if (!header || !this.contains(header))
        return;
      const step = header.closest(this._stepSelector());
      if (!step || step.closest("w-stepper-window"))
        return;
      if (!(this.editable || this.nonLinear))
        return;
      const steps = this._steps();
      const index = steps.indexOf(step);
      if (index >= 0)
        this._goto(this._stepValue(step, index));
    });
  }
  _steps() {
    return Array.from(this.querySelectorAll(this._stepSelector())).filter((step) => !step.closest("w-stepper-window"));
  }
  _stepValue(step, index) {
    return step.getAttribute("value") || String(index + 1);
  }
  get activeValue() {
    const value = this._attr("value", "");
    if (value)
      return value;
    const steps = this._steps();
    return steps.length ? this._stepValue(steps[0], 0) : "";
  }
  _activeIndex() {
    const steps = this._steps();
    const active = this.activeValue;
    const index = steps.findIndex((step, i) => this._stepValue(step, i) === active);
    return index < 0 ? 0 : index;
  }
  _move(delta) {
    const steps = this._steps();
    const index = this._activeIndex() + delta;
    if (index < 0 || index >= steps.length)
      return;
    this._goto(this._stepValue(steps[index], index));
  }
  _goto(value) {
    if (value === this.activeValue)
      return;
    this._silentSet("value", value);
    this._sync();
    this._emit("change", { value });
  }
  _sync() {
    const steps = this._steps();
    const activeIndex = this._activeIndex();
    const clickable = this.editable || this.nonLinear;
    steps.forEach((step, i) => {
      const active = i === activeIndex;
      const error = step.hasAttribute("error");
      const complete = !active && (i < activeIndex || step.hasAttribute("complete"));
      const state = error ? "error" : active ? "active" : complete ? "done" : "";
      if (step.getAttribute("state") !== state)
        step.setAttribute("state", state);
      if (step.hasAttribute("editable") !== clickable)
        step.toggleAttribute("editable", clickable);
      step.setAttribute("aria-current", active ? "step" : "false");
    });
    const win = this.querySelector("w-stepper-window");
    if (win && win.getAttribute("value") !== String(activeIndex))
      win.setAttribute("value", String(activeIndex));
    this.querySelectorAll("[data-stepper-action]").forEach((btn) => {
      const dir = btn.getAttribute("data-stepper-action");
      const disabled = dir === "prev" ? activeIndex <= 0 : activeIndex >= steps.length - 1;
      btn.toggleAttribute("disabled", disabled);
    });
  }
}
if (!customElements.get("w-stepper"))
  customElements.define("w-stepper", WStepper);

// src/components/stepper-vertical.js
var WStepper2 = customElements.get("w-stepper");

class WStepperVertical extends WStepper2 {
  get vertical() {
    return true;
  }
  _stepSelector() {
    return "w-stepper-vertical-item";
  }
}
if (!customElements.get("w-stepper-vertical")) {
  customElements.define("w-stepper-vertical", WStepperVertical);
}

// src/components/window.js
class WWindow extends WElement {
  static attrs = ["value", "show-arrows", "continuous", "height", "direction", "mandatory", "crossfade", "reverse", "prev-icon", "next-icon", "touch", "disabled", "selected-class"];
  get value() {
    return parseInt(wPrimitiveValue(this, "0"), 10) || 0;
  }
  set value(v) {
    this.setAttribute("value", String(v));
  }
  get showArrows() {
    return wPrimitiveBoolAttr(this, "show-arrows");
  }
  get continuous() {
    return wPrimitiveBoolAttr(this, "continuous");
  }
  get height() {
    return this._attr("height", "");
  }
  get direction() {
    return this._attr("direction", "horizontal");
  }
  get mandatory() {
    return wPrimitiveBoolAttr(this, "mandatory", true);
  }
  get crossfade() {
    return wPrimitiveBoolAttr(this, "crossfade");
  }
  get reverse() {
    return wPrimitiveBoolAttr(this, "reverse");
  }
  get touch() {
    return wPrimitiveBoolAttr(this, "touch", true);
  }
  get disabled() {
    return wPrimitiveBoolAttr(this, "disabled", false);
  }
  get selectedClass() {
    return this._attr("selected-class", "");
  }
  get prevIcon() {
    return this._attr("prev-icon", "");
  }
  get nextIcon() {
    return this._attr("next-icon", "");
  }
  _template() {
    const items = this._itemCount();
    const value = this._clampedValue(items);
    const height = this.height ? ` style="height: ${this._esc(this.height)};"` : "";
    const prevDisabled = this.disabled || !this.continuous && value <= 0 ? " disabled" : "";
    const nextDisabled = this.disabled || !this.continuous && value >= items - 1 ? " disabled" : "";
    const vertical = this.direction === "vertical";
    const axisClass = vertical ? " w-window--vertical" : "";
    const crossfadeClass = this.crossfade ? " w-window--crossfade" : "";
    const disabledClass = this.disabled ? " w-window--disabled" : "";
    const prevGlyph = this.prevIcon ? this._esc(this.prevIcon) : vertical ? "↑" : "‹";
    const nextGlyph = this.nextIcon ? this._esc(this.nextIcon) : vertical ? "↓" : "›";
    const arrows = this.showArrows && items > 1 ? `
      <button class="w-window-arrow w-window-arrow--prev" type="button" data-window-step="-1" aria-label="Previous item"${prevDisabled}>${prevGlyph}</button>
      <button class="w-window-arrow w-window-arrow--next" type="button" data-window-step="1" aria-label="Next item"${nextDisabled}>${nextGlyph}</button>` : "";
    let dots = "";
    for (let i = 0;i < items; i++) {
      dots += `<button class="w-window-dot${i === value ? " active" : ""}" type="button" role="tab" aria-selected="${i === value}" data-window-index="${i}" aria-label="Show item ${i + 1}"${this.disabled ? " disabled" : ""}></button>`;
    }
    return `<div class="w-window${axisClass}${crossfadeClass}${disabledClass}" tabindex="0" role="group" aria-roledescription="carousel"${height}>
      <div class="w-window-track" style="${this._trackTransform(value)}"><slot></slot></div>
      ${arrows}
      <div class="w-window-controls" role="tablist">${dots}</div>
    </div>`;
  }
  _events() {
    this._syncItems();
    this._qAll("[data-window-index]").forEach((button) => {
      button.addEventListener("click", () => {
        if (this.disabled)
          return;
        this._setValue(Number(button.getAttribute("data-window-index")));
      });
    });
    this._qAll("[data-window-step]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!this.disabled)
          this._step(Number(button.getAttribute("data-window-step")));
      });
    });
    this._q(".w-window")?.addEventListener("keydown", (event) => {
      if (this.disabled)
        return;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        this._step(-1);
      }
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        this._step(1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        this._setValue(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        this._setValue(this._itemCount() - 1);
      }
    });
    this._bindTouch();
  }
  _bindTouch() {
    const win = this._q(".w-window");
    if (!win || !this.touch)
      return;
    let startX = 0;
    let startY = 0;
    let tracking = false;
    win.addEventListener("pointerdown", (event) => {
      if (this.disabled || event.pointerType === "mouse" && event.button !== 0)
        return;
      tracking = true;
      startX = event.clientX;
      startY = event.clientY;
    });
    win.addEventListener("pointerup", (event) => {
      if (!tracking)
        return;
      tracking = false;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      const vertical = this.direction === "vertical";
      const delta = vertical ? dy : dx;
      if (Math.abs(delta) < 40)
        return;
      this._step(delta < 0 ? 1 : -1);
    });
  }
  get _itemSelector() {
    return "w-window-item, w-tabs-window-item, w-stepper-window-item";
  }
  _itemCount() {
    return this.querySelectorAll(this._itemSelector).length;
  }
  _clampedValue(items) {
    if (!items)
      return 0;
    return Math.max(0, Math.min(this.value, items - 1));
  }
  _step(delta) {
    const items = this._itemCount();
    if (!items)
      return;
    let next = this.value + delta;
    if (this.continuous)
      next = (next + items) % items;
    else
      next = Math.max(0, Math.min(next, items - 1));
    this._setValue(next);
  }
  _setValue(value) {
    const items = this._itemCount();
    const next = Math.max(0, Math.min(value, Math.max(0, items - 1)));
    if (next === this.value && this.mandatory)
      return;
    this.value = next;
    this._syncItems();
    this._emit("change", { value: next });
  }
  _trackTransform(value) {
    if (this.direction === "vertical")
      return `transform: translateY(-${value * 100}%);`;
    const direction = this.reverse ? 1 : -1;
    return `transform: translateX(${direction * value * 100}%);`;
  }
  _syncItems() {
    const value = this._clampedValue(this._itemCount());
    const track = this._q(".w-window-track");
    if (track)
      track.style.cssText = this._trackTransform(value);
    this.querySelectorAll(this._itemSelector).forEach((item, index) => {
      const active = index === value;
      item.classList.toggle("active", active);
      if (this.selectedClass)
        item.classList.toggle(this.selectedClass, active);
      item.toggleAttribute("selected", active);
      item.setAttribute("aria-hidden", String(!active));
    });
    this._qAll("[data-window-index]").forEach((button) => {
      const active = Number(button.getAttribute("data-window-index")) === value;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
  }
}
if (!customElements.get("w-window"))
  customElements.define("w-window", WWindow);

// src/components/stepper-window.js
class WStepperWindow extends customElements.get("w-window") {
}
if (!customElements.get("w-stepper-window")) {
  customElements.define("w-stepper-window", WStepperWindow);
}

// src/components/window-item.js
class WWindowItem extends WElement {
  _template() {
    return `<div class="w-window-item"><slot></slot></div>`;
  }
}
if (!customElements.get("w-window-item"))
  customElements.define("w-window-item", WWindowItem);

// src/components/stepper-window-item.js
class WStepperWindowItem extends customElements.get("w-window-item") {
}
if (!customElements.get("w-stepper-window-item")) {
  customElements.define("w-stepper-window-item", WStepperWindowItem);
}

// src/components/system-bar.js
class WSystemBar extends WElement {
  static attrs = [
    "color",
    "height",
    "window",
    "rounded",
    "elevation",
    "absolute"
  ];
  get color() {
    return this._attr("color", "");
  }
  get height() {
    return this._attr("height", "");
  }
  get window() {
    return this._bool("window");
  }
  get rounded() {
    return this._attr("rounded", "");
  }
  get elevation() {
    return this._attr("elevation", "");
  }
  get absolute() {
    return this._bool("absolute");
  }
  _template() {
    const classes = [
      "w-system-bar",
      this.window ? "w-system-bar--window" : "",
      this.absolute ? "w-system-bar--absolute" : "",
      this._roundedClass(),
      this._elevationClass(),
      this._colorClass()
    ].filter(Boolean).join(" ");
    const style = this._styleAttr();
    return `<div class="${classes}"${style} role="status" aria-label="System status"><slot></slot></div>`;
  }
  _roundedClass() {
    if (!this.hasAttribute("rounded"))
      return "";
    const value = this.rounded;
    if (!value || value === "true")
      return "w-system-bar--rounded";
    return `w-system-bar--rounded-${value}`;
  }
  _elevationClass() {
    const e = this.elevation;
    if (!e)
      return "";
    const num = parseInt(e, 10);
    if (num >= 1 && num <= 5)
      return `w-system-bar--elevation-${num}`;
    return "";
  }
  _colorClass() {
    const color = this.color;
    if (!color)
      return "";
    const token = color.toLowerCase().trim();
    const semantic = ["primary", "secondary", "success", "warning", "error", "surface"];
    if (semantic.includes(token))
      return `w-system-bar--color-${token}`;
    return "";
  }
  _styleAttr() {
    const styles = [];
    const height = this._resolveHeight();
    if (height)
      styles.push(`--w-system-bar-height: ${height}`);
    const color = this.color;
    if (color) {
      const token = color.toLowerCase().trim();
      const semantic = ["primary", "secondary", "success", "warning", "error", "surface"];
      if (!semantic.includes(token)) {
        styles.push(`--w-system-bar-bg: ${color}`);
        styles.push(`--w-system-bar-color: #ffffff`);
      }
    }
    if (styles.length)
      return ` style="${styles.join("; ")}"`;
    return "";
  }
  _resolveHeight() {
    const h = this.height;
    if (!h) {
      return this.window ? "32px" : "24px";
    }
    const num = parseFloat(h);
    if (!isNaN(num) && String(num) === String(h).trim())
      return `${num}px`;
    return h;
  }
}
if (!customElements.get("w-system-bar")) {
  customElements.define("w-system-bar", WSystemBar);
}

// src/components/tab.js
class WTab extends WElement {
  static attrs = ["value", "active", "disabled", "stacked", "href", "ripple"];
  get value() {
    return this._attr("value", "");
  }
  get active() {
    return this._bool("active");
  }
  set active(v) {
    v ? this.setAttribute("active", "") : this.removeAttribute("active");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get stacked() {
    return this.hasAttribute("stacked");
  }
  get href() {
    return this._attr("href", "");
  }
  _template() {
    const cls = `w-tab${this.active ? " active" : ""}${this.stacked ? " w-tab--stacked" : ""}`;
    const selected = this.active ? "true" : "false";
    if (this.href && !this.disabled) {
      return `<a class="${cls}" href="${this._esc(this.href)}" role="tab" aria-selected="${selected}">
      <slot></slot>
    </a>`;
    }
    const dis = this.disabled ? ' disabled aria-disabled="true"' : "";
    return `<button class="${cls}"${dis} type="button" role="tab" aria-selected="${selected}">
      <slot></slot>
    </button>`;
  }
  _events() {
    if (this.hasAttribute("ripple"))
      this._attachRipple(this._q("button, a"));
  }
}
customElements.define("w-tab", WTab);

// src/components/tabs.js
class WTabs extends WElement {
  static attrs = [
    "value",
    "variant",
    "align-tabs",
    "fixed-tabs",
    "grow",
    "direction",
    "stacked",
    "center-active",
    "hide-slider",
    "slider-color",
    "show-arrows",
    "prev-icon",
    "next-icon"
  ];
  get value() {
    return this._attr("value", "");
  }
  set value(v) {
    this.setAttribute("value", v);
  }
  get variant() {
    return this._attr("variant", "");
  }
  get alignTabs() {
    return this._attr("align-tabs", "start");
  }
  get direction() {
    return this._attr("direction", "horizontal");
  }
  get fixedTabs() {
    return this.hasAttribute("fixed-tabs");
  }
  get grow() {
    return this.hasAttribute("grow");
  }
  get stacked() {
    return this.hasAttribute("stacked");
  }
  get centerActive() {
    return this.hasAttribute("center-active");
  }
  get showArrows() {
    return this.hasAttribute("show-arrows");
  }
  get hideSlider() {
    return this.hasAttribute("hide-slider");
  }
  get prevIcon() {
    return this._attr("prev-icon", "");
  }
  get nextIcon() {
    return this._attr("next-icon", "");
  }
  get _vertical() {
    return this.direction === "vertical";
  }
  get _hasSlider() {
    return !this.hideSlider && this.variant !== "pills";
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this._observer) {
      this._observer = new MutationObserver(() => {
        this._syncTabs();
        this._positionSlider();
      });
      this._observer.observe(this, { childList: true, subtree: false });
    }
    if (!this._resizeObserver && typeof ResizeObserver === "function") {
      this._resizeObserver = new ResizeObserver(() => this._positionSlider());
      this._resizeObserver.observe(this);
    }
  }
  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "value") {
      if (this._rendered && oldVal !== newVal && !this._skipRender) {
        this._syncTabs();
        this._positionSlider();
        if (this.centerActive)
          this._scrollActiveIntoView();
      }
      return;
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }
  _template() {
    const strip = ["w-tabs"];
    if (this.variant === "pills")
      strip.push("w-tabs-pills");
    if (this.alignTabs === "center")
      strip.push("w-tabs--align-center");
    else if (this.alignTabs === "end")
      strip.push("w-tabs--align-end");
    if (this.fixedTabs)
      strip.push("w-tabs--fixed");
    if (this.grow)
      strip.push("w-tabs--grow");
    if (this.stacked)
      strip.push("w-tabs--stacked");
    if (this._vertical)
      strip.push("w-tabs--vertical");
    if (this._hasSlider)
      strip.push("w-tabs--js-slider");
    else if (this.hideSlider)
      strip.push("w-tabs--no-slider");
    const slider = this._hasSlider ? '<span class="w-tabs-slider" aria-hidden="true"></span>' : "";
    const orientation = this._vertical ? ' aria-orientation="vertical"' : "";
    const stripEl = `<div class="${strip.join(" ")}" role="tablist"${orientation}><slot></slot>${slider}</div>`;
    if (!this.showArrows)
      return stripEl;
    const vert = this._vertical;
    const prevGlyph = this._esc(this.prevIcon || (vert ? "↑" : "‹"));
    const nextGlyph = this._esc(this.nextIcon || (vert ? "↓" : "›"));
    const prev = `<button class="w-tabs-arrow w-tabs-arrow--prev" type="button" data-tabs-scroll="-1" aria-label="Previous tabs">${prevGlyph}</button>`;
    const next = `<button class="w-tabs-arrow w-tabs-arrow--next" type="button" data-tabs-scroll="1" aria-label="Next tabs">${nextGlyph}</button>`;
    return `<div class="w-tabs-shell${vert ? " w-tabs-shell--vertical" : ""}">${prev}${stripEl}${next}</div>`;
  }
  _events() {
    const container = this._q(".w-tabs");
    if (!container)
      return;
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".w-tab");
      if (!btn)
        return;
      const tabEl = btn.closest("w-tab");
      if (!tabEl || tabEl.disabled)
        return;
      this._activateTab(tabEl);
    });
    container.addEventListener("keydown", (e) => {
      const nextKey = this._vertical ? "ArrowDown" : "ArrowRight";
      const prevKey = this._vertical ? "ArrowUp" : "ArrowLeft";
      let move;
      if (e.key === nextKey)
        move = 1;
      else if (e.key === prevKey)
        move = -1;
      else if (e.key === "Home")
        move = "home";
      else if (e.key === "End")
        move = "end";
      else
        return;
      e.preventDefault();
      this._moveFocus(move);
    });
    this._qAll("[data-tabs-scroll]").forEach((button) => {
      button.addEventListener("click", () => this._scrollByPage(Number(button.getAttribute("data-tabs-scroll"))));
    });
    if (this.showArrows) {
      container.addEventListener("scroll", () => this._updateArrows(), { passive: true });
    }
    this._syncTabs();
    requestAnimationFrame(() => {
      this._positionSlider();
      this._updateArrows();
      if (this.centerActive)
        this._scrollActiveIntoView();
    });
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this._positionSlider());
    }
  }
  _getTabElements() {
    return Array.from(this.querySelectorAll("w-tab"));
  }
  _moveFocus(move) {
    const tabs = this._getTabElements().filter((t) => !t.disabled);
    if (!tabs.length)
      return;
    const activeIndex = tabs.findIndex((t) => t.active);
    let nextIndex;
    if (move === "home")
      nextIndex = 0;
    else if (move === "end")
      nextIndex = tabs.length - 1;
    else {
      const start = activeIndex < 0 ? 0 : activeIndex;
      nextIndex = (start + move + tabs.length) % tabs.length;
    }
    const nextTab = tabs[nextIndex];
    if (!nextTab)
      return;
    this._activateTab(nextTab);
    const focusTarget = nextTab.querySelector(".w-tab");
    if (focusTarget)
      focusTarget.focus();
  }
  _syncTabs() {
    const currentValue = this.value;
    this._getTabElements().forEach((tab) => {
      const shouldBeActive = tab.value === currentValue;
      if (tab.active !== shouldBeActive)
        tab.active = shouldBeActive;
    });
  }
  _activateTab(tabEl) {
    if (!tabEl || tabEl.disabled)
      return;
    const newValue = tabEl.value;
    if (this.value === newValue)
      return;
    this.value = newValue;
    this._emit("change", { value: newValue });
  }
  _activeButton() {
    const active = this._getTabElements().find((t) => t.active);
    return active ? active.querySelector(".w-tab") : null;
  }
  _positionSlider() {
    if (!this._hasSlider)
      return;
    const slider = this._q(".w-tabs-slider");
    const strip = this._q(".w-tabs");
    if (!slider || !strip)
      return;
    const btn = this._activeButton();
    if (!btn) {
      slider.style.width = "0";
      slider.style.height = "0";
      return;
    }
    if (this._vertical) {
      slider.style.width = "";
      slider.style.height = btn.offsetHeight + "px";
      slider.style.transform = `translateY(${btn.offsetTop}px)`;
    } else {
      slider.style.height = "";
      slider.style.width = btn.offsetWidth + "px";
      slider.style.transform = `translateX(${btn.offsetLeft}px)`;
    }
  }
  _scrollByPage(direction) {
    const strip = this._q(".w-tabs");
    if (!strip)
      return;
    if (this._vertical)
      strip.scrollBy({ top: direction * strip.clientHeight * 0.8, behavior: "smooth" });
    else
      strip.scrollBy({ left: direction * strip.clientWidth * 0.8, behavior: "smooth" });
  }
  _scrollActiveIntoView() {
    const btn = this._activeButton();
    if (!btn)
      return;
    btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }
  _updateArrows() {
    if (!this.showArrows)
      return;
    const strip = this._q(".w-tabs");
    if (!strip)
      return;
    const prev = this._q(".w-tabs-arrow--prev");
    const next = this._q(".w-tabs-arrow--next");
    const pos = this._vertical ? strip.scrollTop : strip.scrollLeft;
    const max = this._vertical ? strip.scrollHeight - strip.clientHeight : strip.scrollWidth - strip.clientWidth;
    if (prev)
      prev.disabled = pos <= 1;
    if (next)
      next.disabled = pos >= max - 1;
  }
  _applyCommonProps() {
    super._applyCommonProps();
    const setVar = (prop, attr) => {
      const v = this.getAttribute(attr);
      if (v)
        this.style.setProperty(prop, `var(--w-${v})`);
      else
        this.style.removeProperty(prop);
    };
    setVar("--w-tabs-color", "color");
    setVar("--w-tabs-slider-color", "slider-color");
    setVar("--w-tabs-bg", "bg-color");
  }
}
customElements.define("w-tabs", WTabs);

// src/components/tabs-window.js
class WTabsWindow extends customElements.get("w-window") {
}
if (!customElements.get("w-tabs-window")) {
  customElements.define("w-tabs-window", WTabsWindow);
}

// src/components/tabs-window-item.js
class WTabsWindowItem extends customElements.get("w-window-item") {
}
if (!customElements.get("w-tabs-window-item")) {
  customElements.define("w-tabs-window-item", WTabsWindowItem);
}

// src/components/theme-provider.js
class WThemeProvider extends WElement {
  static attrs = ["theme", "with-background"];
  get theme() {
    return this._attr("theme", "");
  }
  _template() {
    const cls = ["w-theme-provider", this._bool("with-background") ? "w-theme-provider--with-background" : ""].filter(Boolean).join(" ");
    const themeAttr = this.theme ? ` data-w-theme="${this._esc(this.theme)}"` : "";
    return `<div class="${cls}"${themeAttr}><slot></slot></div>`;
  }
}
if (!customElements.get("w-theme-provider"))
  customElements.define("w-theme-provider", WThemeProvider);

// src/components/time-picker.js
function parseTime(value) {
  const match = String(value || "").trim().toLowerCase().match(/^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?\s*([ap]m)?$/);
  const hour = match ? Math.max(0, Math.min(23, parseInt(match[1], 10) || 0)) : 12;
  const minute = match ? Math.max(0, Math.min(59, parseInt(match[2] || "0", 10) || 0)) : 0;
  const second = match ? Math.max(0, Math.min(59, parseInt(match[3] || "0", 10) || 0)) : 0;
  const period = match?.[4];
  return {
    hour: period ? to24Hour(hour, period) : hour,
    minute,
    second
  };
}
function pad(value) {
  return String(value).padStart(2, "0");
}
function formatTime({ hour, minute, second }, seconds = false) {
  return `${pad(hour)}:${pad(minute)}${seconds ? `:${pad(second)}` : ""}`;
}
function to24Hour(hour, period) {
  const normalized = Math.max(1, Math.min(12, Number(hour) || 12));
  return normalized % 12 + (period === "pm" ? 12 : 0);
}
function timeValue(parts, seconds = false) {
  return parts.hour * 3600 + parts.minute * 60 + (seconds ? parts.second : 0);
}
function parseLimit(value, fallback) {
  if (!value)
    return fallback;
  return parseTime(value);
}
function classToken(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

class WTimePicker extends WElement {
  static attrs = [
    "value",
    "label",
    "title",
    "view",
    "view-mode",
    "format",
    "period",
    "use-seconds",
    "scrollable",
    "allowed-hours",
    "allowed-minutes",
    "allowed-seconds",
    "min",
    "max",
    "color",
    "elevation",
    "width",
    "density",
    "hide-header",
    "ampm-in-title",
    "variant",
    "disabled",
    "readonly"
  ];
  get value() {
    return wValue(this, "12:00");
  }
  get label() {
    return this._attr("label", "Time");
  }
  get title() {
    return this._attr("title", "Select time");
  }
  get view() {
    const view = this._attr("view-mode", this._attr("view", "hours"));
    if (view === "hour")
      return "hours";
    if (view === "minute")
      return "minutes";
    if (view === "second")
      return "seconds";
    if (view === "minutes" || view === "seconds")
      return view;
    return "hours";
  }
  get viewMode() {
    return this.view === "hours" ? "hour" : this.view === "minutes" ? "minute" : "second";
  }
  get format() {
    const format = this._attr("format", "ampm");
    return format === "24hr" ? "24hr" : "ampm";
  }
  get period() {
    const attr = String(this.getAttribute("period") || "").toLowerCase();
    if (attr === "am" || attr === "pm")
      return attr;
    return this._parts().hour >= 12 ? "pm" : "am";
  }
  get useSeconds() {
    return wBoolAttr(this, "use-seconds");
  }
  get scrollable() {
    return wBoolAttr(this, "scrollable");
  }
  get hideHeader() {
    return wBoolAttr(this, "hide-header");
  }
  get ampmInTitle() {
    return wBoolAttr(this, "ampm-in-title");
  }
  get disabled() {
    return wBoolAttr(this, "disabled");
  }
  get readonly() {
    return wBoolAttr(this, "readonly");
  }
  get color() {
    return this._attr("color", "primary");
  }
  get elevation() {
    return this._attr("elevation", "");
  }
  get density() {
    return this._attr("density", "");
  }
  get width() {
    return this._attr("width", "");
  }
  get variant() {
    return this._attr("variant", "dial") === "input" ? "input" : "dial";
  }
  _parts() {
    return parseTime(this.value);
  }
  _period() {
    return this.period.toUpperCase();
  }
  _displayHour() {
    const hour = this._parts().hour;
    if (this.format === "24hr")
      return pad(hour);
    const display = hour % 12 || 12;
    return pad(display);
  }
  _template() {
    const parts = this._parts();
    const period = this._period();
    const readonly = this.disabled || this.readonly;
    const clockItems = this.view === "hours" ? this._hourItems(parts) : this._unitItems(this.view === "seconds" ? parts.second : parts.minute, parts);
    const unitLabel = this.view === "hours" ? "hour" : this.view === "seconds" ? "second" : "minute";
    const classes = [
      "w-time-picker",
      `w-time-picker--variant-${this.variant}`,
      `w-time-picker--format-${this.format}`,
      `w-time-picker--color-${classToken(this.color)}`,
      this.disabled ? "w-time-picker--disabled" : "",
      this.readonly ? "w-time-picker--readonly" : "",
      this.density ? `w-time-picker--density-${classToken(this.density)}` : "",
      this.elevation !== "" ? `w-time-picker--elevation-${classToken(this.elevation)}` : ""
    ].filter(Boolean).join(" ");
    const style = [
      this.width ? `width:${this._esc(this.width)}` : "",
      this.color && !/^(primary|secondary|tertiary|success|warning|error|danger|info)$/.test(this.color) ? `--w-time-picker-color:${this._esc(this.color)}` : ""
    ].filter(Boolean).join(";");
    const title = this.ampmInTitle && this.format === "ampm" ? `${this.title} ${period}` : this.title;
    return `<div class="${classes}"${style ? ` style="${style}"` : ""} aria-label="${this._esc(this.label)}">
      ${!this.hideHeader ? `<div class="w-time-picker-title">${this._esc(title)}</div>` : ""}
      ${this.label ? `<div class="w-time-picker-label">${this._esc(this.label)}</div>` : ""}
      <div class="w-time-picker-header">
        ${this._fieldButton("hours", this._displayHour(), readonly)}
        <span class="w-time-picker-separator">:</span>
        ${this._fieldButton("minutes", pad(parts.minute), readonly)}
        ${this.useSeconds ? `<span class="w-time-picker-separator">:</span>${this._fieldButton("seconds", pad(parts.second), readonly)}` : ""}
        ${this.format === "ampm" ? `<div class="w-time-picker-period" role="group" aria-label="Period">
          <button type="button" class="${period === "AM" ? "active" : ""}" data-time-period="AM"${readonly ? " disabled" : ""}>AM</button>
          <button type="button" class="${period === "PM" ? "active" : ""}" data-time-period="PM"${readonly ? " disabled" : ""}>PM</button>
        </div>` : ""}
      </div>
      <div class="w-time-picker-clock" role="listbox" aria-label="Choose ${unitLabel}"${this.scrollable ? " data-time-scrollable" : ""}>
        ${clockItems}
        <span class="w-time-picker-hand" style="--w-time-picker-angle:${this._angle()}deg"></span>
      </div>
      <input type="hidden" value="${this._esc(formatTime(parts, this.useSeconds))}">
    </div>`;
  }
  _fieldButton(view, value, readonly) {
    const active = this.view === view;
    if (this.variant === "input") {
      return `<label class="w-time-picker-field${active ? " active" : ""}">
        <span class="w-sr-only">${view}</span>
        <input value="${this._esc(value)}" inputmode="numeric" maxlength="2" data-time-field="${view}"${readonly ? " disabled" : ""}>
      </label>`;
    }
    return `<button class="w-time-picker-display${active ? " active" : ""}" type="button" data-time-view="${view}"${readonly ? " disabled" : ""}>${this._esc(value)}</button>`;
  }
  _hourItems(parts) {
    const values = this.format === "24hr" ? Array.from({ length: 24 }, (_, index) => index) : Array.from({ length: 12 }, (_, index) => index + 1);
    return values.map((value) => {
      const hour24 = this.format === "24hr" ? value : to24Hour(value, this.period);
      const selected = this.format === "24hr" ? parts.hour === value : (parts.hour % 12 || 12) === value;
      const angle = this.format === "24hr" ? value / 24 * 360 : value / 12 * 360;
      const radius = this.format === "24hr" && value < 12 ? 31 : 42;
      const label = this.format === "24hr" ? pad(value) : String(value);
      return this._clockButton(label, value, selected, angle, radius, "hour", this._isAllowed("hour", hour24, parts));
    }).join("");
  }
  _unitItems(selectedValue, parts) {
    return Array.from({ length: 12 }, (_, index) => index * 5).map((value) => {
      const selected = selectedValue === value;
      const unit = this.view === "seconds" ? "second" : "minute";
      return this._clockButton(pad(value), value, selected, value / 60 * 360, 42, unit, this._isAllowed(unit, value, parts));
    }).join("");
  }
  _clockButton(label, value, selected, angle, radius, unit, allowed = true) {
    const radians = angle * Math.PI / 180;
    const x = 50 + Math.sin(radians) * radius;
    const y = 50 - Math.cos(radians) * radius;
    return `<button class="w-time-picker-clock-item${selected ? " selected" : ""}${allowed ? "" : " disabled"}" type="button" data-time-unit="${unit}" data-time-value="${value}" style="left:${x}%;top:${y}%"${this.disabled || this.readonly || !allowed ? " disabled" : ""}>${this._esc(label)}</button>`;
  }
  _angle() {
    const parts = this._parts();
    if (this.view === "hours") {
      const value = this.format === "24hr" ? parts.hour : parts.hour % 12 || 12;
      return this.format === "24hr" ? value / 24 * 360 : value / 12 * 360;
    }
    return (this.view === "seconds" ? parts.second : parts.minute) / 60 * 360;
  }
  _events() {
    this._qAll("[data-time-view]").forEach((button) => {
      button.addEventListener("click", () => this._setView(button.getAttribute("data-time-view")));
    });
    this._qAll("[data-time-field]").forEach((input) => {
      input.addEventListener("focus", () => this._setView(input.getAttribute("data-time-field"), false));
      input.addEventListener("change", (event) => {
        event.stopPropagation();
        this._setField(input.getAttribute("data-time-field"), input.value);
      });
      input.addEventListener("keydown", (event) => this._onFieldKey(event, input.getAttribute("data-time-field")));
    });
    this._qAll("[data-time-period]").forEach((button) => {
      button.addEventListener("click", () => this._setPeriod(button.getAttribute("data-time-period")));
    });
    this._qAll("[data-time-unit]").forEach((button) => {
      button.addEventListener("click", () => this._select(button.getAttribute("data-time-unit"), Number(button.getAttribute("data-time-value"))));
    });
    this._q("[data-time-scrollable]")?.addEventListener("wheel", (event) => this._onWheel(event));
  }
  _setView(view, render = true) {
    if (this.disabled || this.readonly)
      return;
    this._silentSet("view", view);
    this._silentSet("view-mode", this.viewMode);
    this._emit("input", { field: "view", value: this.viewMode });
    if (render) {
      this._render();
      this._events();
    }
  }
  _setPeriod(period) {
    if (this.disabled || this.readonly)
      return;
    const nextPeriod = String(period || "").toLowerCase();
    if (nextPeriod !== "am" && nextPeriod !== "pm")
      return;
    const parts = this._parts();
    if (nextPeriod === "am" && parts.hour >= 12)
      parts.hour -= 12;
    if (nextPeriod === "pm" && parts.hour < 12)
      parts.hour += 12;
    this._silentSet("period", nextPeriod);
    this._emit("input", { field: "period", value: nextPeriod });
    this._commit(parts);
  }
  _select(unit, value) {
    if (this.disabled || this.readonly)
      return;
    const parts = this._parts();
    if (unit === "hour") {
      if (this.format === "ampm") {
        const period = this.period.toUpperCase();
        parts.hour = value % 12;
        if (period === "PM")
          parts.hour += 12;
      } else {
        parts.hour = value;
      }
      if (!this._isAllowed("hour", parts.hour, parts))
        return;
      this._silentSet("view", "minutes");
      this._silentSet("view-mode", "minute");
      this._emit("input", { field: "hour", value: parts.hour });
    } else if (unit === "minute") {
      if (!this._isAllowed("minute", value, parts))
        return;
      parts.minute = value;
      if (this.useSeconds)
        this._silentSet("view", "seconds");
      if (this.useSeconds)
        this._silentSet("view-mode", "second");
      this._emit("input", { field: "minute", value });
    } else {
      if (!this._isAllowed("second", value, parts))
        return;
      parts.second = value;
      this._emit("input", { field: "second", value });
    }
    this._commit(parts);
  }
  _setField(view, rawValue) {
    if (this.disabled || this.readonly)
      return;
    const parts = this._parts();
    const value = Math.max(0, Math.min(view === "hours" && this.format === "ampm" ? 12 : view === "hours" ? 23 : 59, parseInt(rawValue, 10) || 0));
    if (view === "hours")
      parts.hour = this.format === "ampm" ? to24Hour(value || 12, this.period) : value;
    if (view === "minutes")
      parts.minute = value;
    if (view === "seconds")
      parts.second = value;
    const unit = view === "hours" ? "hour" : view === "minutes" ? "minute" : "second";
    if (!this._isAllowed(unit, unit === "hour" ? parts.hour : value, parts)) {
      this._render();
      this._events();
      return;
    }
    this._commit(parts);
  }
  _onFieldKey(event, view) {
    if (!["ArrowUp", "ArrowDown"].includes(event.key))
      return;
    event.preventDefault();
    const increment = event.key === "ArrowUp";
    const unit = view === "hours" ? "hour" : view === "minutes" ? "minute" : "second";
    const parts = this._parts();
    const current = unit === "hour" ? parts.hour : unit === "minute" ? parts.minute : parts.second;
    const next = this._nextAllowed(unit, current, increment, parts, 1);
    if (unit === "hour")
      return this._commitAbsoluteHour(next, parts);
    this._select(unit, next);
  }
  _onWheel(event) {
    if (!this.scrollable || this.disabled || this.readonly)
      return;
    event.preventDefault();
    const parts = this._parts();
    const unit = this.view === "hours" ? "hour" : this.view === "minutes" ? "minute" : "second";
    const current = unit === "hour" ? parts.hour : unit === "minute" ? parts.minute : parts.second;
    const next = this._nextAllowed(unit, current, event.deltaY < 0, parts);
    if (unit === "hour")
      return this._commitAbsoluteHour(next, parts);
    this._select(unit, next);
  }
  _commit(parts) {
    const value = formatTime(parts, this.useSeconds);
    const changed = value !== this.value;
    this._silentSet("value", value);
    this._render();
    this._events();
    if (changed)
      this._emit("change", { value });
  }
  _allowedList(unit) {
    const attr = unit === "hour" ? "allowed-hours" : unit === "minute" ? "allowed-minutes" : "allowed-seconds";
    return wNumberList(this.getAttribute(attr), []);
  }
  _isAllowed(unit, value, parts = this._parts()) {
    const list = this._allowedList(unit);
    if (list.length && !list.includes(value))
      return false;
    const next = { ...parts };
    if (unit === "hour")
      next.hour = value;
    if (unit === "minute")
      next.minute = value;
    if (unit === "second")
      next.second = value;
    const min = parseLimit(this.getAttribute("min"), { hour: 0, minute: 0, second: 0 });
    const max = parseLimit(this.getAttribute("max"), { hour: 23, minute: 59, second: 59 });
    const valueSeconds = timeValue(next, this.useSeconds);
    return valueSeconds >= timeValue(min, this.useSeconds) && valueSeconds <= timeValue(max, this.useSeconds);
  }
  _commitAbsoluteHour(hour, parts = this._parts()) {
    if (!this._isAllowed("hour", hour, parts))
      return;
    parts.hour = hour;
    this._silentSet("period", hour >= 12 ? "pm" : "am");
    this._emit("input", { field: "hour", value: hour });
    this._commit(parts);
  }
  _nextAllowed(unit, current, increment, parts, stepOverride) {
    const limit = unit === "hour" ? 24 : 60;
    const step = stepOverride || (unit === "hour" ? 1 : 5);
    for (let i = 0;i < limit; i += step) {
      current = (current + (increment ? step : -step) + limit) % limit;
      if (this._isAllowed(unit, current, parts))
        return current;
    }
    return current;
  }
}
if (!customElements.get("w-time-picker"))
  customElements.define("w-time-picker", WTimePicker);

// src/components/timeline.js
var TIMELINE_TOKENS = ["primary", "secondary", "tertiary", "success", "warning", "error", "info"];
var TIMELINE_SIZES = { "x-small": "0.5rem", small: "0.75rem", default: "0.875rem", large: "1.25rem", "x-large": "1.75rem" };
function wTimelineColor(value) {
  const t = String(value || "").trim().toLowerCase();
  if (!t)
    return "";
  return TIMELINE_TOKENS.includes(t) ? `var(--w-${t === "info" ? "primary" : t})` : value;
}
function wTimelineSize(value) {
  const t = String(value || "").trim().toLowerCase();
  if (!t)
    return "";
  if (TIMELINE_SIZES[t])
    return TIMELINE_SIZES[t];
  return /^\d+(\.\d+)?$/.test(t) ? t + "px" : t;
}

class WTimeline extends WElement {
  static attrs = ["align", "justify", "side", "density", "direction", "dot-color", "icon-color", "line-color", "line-thickness", "line-inset", "truncate-line", "size", "fill-dot", "hide-opposite"];
  _template() {
    const align = this._attr("align", "start") === "center" ? "center" : "start";
    const side = this._attr("side", "");
    const truncate = this._attr("truncate-line", "");
    const classes = [
      "w-timeline",
      "w-timeline--align-" + align,
      this._attr("justify", "") === "center" ? "w-timeline--justify-center" : "",
      this._attr("density", "") === "compact" ? "w-timeline--density-compact" : "",
      this._attr("direction", "") === "horizontal" ? "w-timeline--horizontal" : "",
      side === "start" || side === "end" ? "w-timeline--side-" + side : "",
      truncate ? "w-timeline--truncate-" + truncate : "",
      this._bool("fill-dot") ? "w-timeline--fill-dot" : "",
      this._bool("hide-opposite") ? "w-timeline--hide-opposite" : ""
    ].filter(Boolean).join(" ");
    const styles = [];
    const lineColor = wTimelineColor(this._attr("line-color", ""));
    if (lineColor)
      styles.push("--w-timeline-line-color: " + lineColor);
    const thickness = this._attr("line-thickness", "");
    if (thickness)
      styles.push("--w-timeline-line-size: " + (/^\d+(\.\d+)?$/.test(thickness) ? thickness + "px" : thickness));
    const inset = this._attr("line-inset", "");
    if (inset)
      styles.push("--w-timeline-line-inset: " + (/^\d+(\.\d+)?$/.test(inset) ? inset + "px" : inset));
    const dotColor = wTimelineColor(this._attr("dot-color", ""));
    if (dotColor)
      styles.push("--w-timeline-dot-color: " + dotColor);
    const iconColor = wTimelineColor(this._attr("icon-color", ""));
    if (iconColor)
      styles.push("--w-timeline-icon-color: " + iconColor);
    const size = wTimelineSize(this._attr("size", ""));
    if (size)
      styles.push("--w-timeline-dot-size: " + size);
    const style = styles.length ? ` style="${styles.join("; ")}"` : "";
    return `<div class="${classes}"${style} role="list"><slot></slot></div>`;
  }
}
if (!customElements.get("w-timeline"))
  customElements.define("w-timeline", WTimeline);

// src/components/timeline-item.js
class WTimelineItem extends WElement {
  static attrs = ["time", "title", "dot", "fill-dot", "hide-dot", "icon", "dot-color", "icon-color", "size", "side", "hide-opposite"];
  get itemTitle() {
    return this._attr("title", "");
  }
  get time() {
    return this._attr("time", "");
  }
  _template() {
    const side = this._attr("side", "");
    const sideClass = side === "start" ? " w-timeline-item--start" : side === "end" ? " w-timeline-item--end" : "";
    const hideOppClass = this._bool("hide-opposite") ? " w-timeline-item--hide-opposite" : "";
    const fill = this._bool("fill-dot") || this._attr("dot", "filled") !== "outlined";
    const icon = this._attr("icon", "");
    const dotStyles = [];
    const color = wTimelineColor(this._attr("dot-color", ""));
    if (color)
      dotStyles.push("--w-timeline-dot-color: " + color);
    const iconColor = wTimelineColor(this._attr("icon-color", ""));
    if (iconColor)
      dotStyles.push("--w-timeline-icon-color: " + iconColor);
    const size = wTimelineSize(this._attr("size", ""));
    if (size)
      dotStyles.push("--w-timeline-dot-size: " + size);
    const dotStyle = dotStyles.length ? ` style="${dotStyles.join("; ")}"` : "";
    const dot = this._bool("hide-dot") ? "" : `<span class="w-timeline-dot w-timeline-dot--${fill ? "filled" : "outlined"}"${dotStyle}>${icon ? `<span class="w-timeline-dot__icon" aria-hidden="true">${this._esc(icon)}</span>` : ""}</span>`;
    const opposite = this._bool("hide-opposite") ? "" : this._hasSlot("opposite") ? '<div class="w-timeline-opposite"><slot name="opposite"></slot></div>' : this.time ? `<div class="w-timeline-opposite">${this._esc(this.time)}</div>` : '<div class="w-timeline-opposite" aria-hidden="true"></div>';
    const title = this.itemTitle ? `<div class="w-timeline-title">${this._esc(this.itemTitle)}</div>` : "";
    return `<div class="w-timeline-item${sideClass}${hideOppClass}" role="listitem">
      ${opposite}
      <div class="w-timeline-divider-col">${dot}</div>
      <div class="w-timeline-content">${title}<div class="w-timeline-body"><slot></slot></div></div>
    </div>`;
  }
  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }
}
if (!customElements.get("w-timeline-item"))
  customElements.define("w-timeline-item", WTimelineItem);

// src/components/timeline-divider.js
class WTimelineDivider extends WElement {
  _template() {
    return `<div class="w-timeline-divider" aria-hidden="true"><slot></slot></div>`;
  }
}
if (!customElements.get("w-timeline-divider")) {
  customElements.define("w-timeline-divider", WTimelineDivider);
}

// src/components/toolbar.js
class WToolbar extends WElement {
  _template() {
    return `<div class="w-toolbar"><slot></slot></div>`;
  }
}
if (!customElements.get("w-toolbar"))
  customElements.define("w-toolbar", WToolbar);

// src/components/toolbar-title.js
class WToolbarTitle extends WElement {
  _template() {
    return `<div class="w-toolbar-title"><slot></slot></div>`;
  }
}
if (!customElements.get("w-toolbar-title")) {
  customElements.define("w-toolbar-title", WToolbarTitle);
}

// src/components/toolbar-items.js
class WToolbarItems extends WElement {
  _template() {
    return `<div class="w-toolbar-items"><slot></slot></div>`;
  }
}
if (!customElements.get("w-toolbar-items")) {
  customElements.define("w-toolbar-items", WToolbarItems);
}

// src/components/treeview.js
class WTreeview extends WElement {
  static attrs = [
    "items",
    "item-title",
    "item-value",
    "item-children",
    "activatable",
    "activated",
    "multiple-active",
    "selectable",
    "selected",
    "select-strategy",
    "opened",
    "open-all",
    "open-on-click",
    "density",
    "hoverable",
    "rounded",
    "color",
    "disabled",
    "expand-icon",
    "collapse-icon"
  ];
  get itemsAttr() {
    return this._attr("items", "");
  }
  get itemTitleKey() {
    return this._attr("item-title", "title");
  }
  get itemValueKey() {
    return this._attr("item-value", "value");
  }
  get itemChildrenKey() {
    return this._attr("item-children", "children");
  }
  get activatable() {
    return this._bool("activatable");
  }
  get multipleActive() {
    return this._bool("multiple-active");
  }
  get selectable() {
    return this._bool("selectable");
  }
  get selectStrategy() {
    const value = this._attr("select-strategy", "leaf");
    return ["leaf", "independent", "classic"].includes(value) ? value : "leaf";
  }
  get openAll() {
    return this._bool("open-all");
  }
  get openOnClick() {
    return this._bool("open-on-click");
  }
  get density() {
    return this._attr("density", "");
  }
  get hoverable() {
    return this._bool("hoverable");
  }
  get rounded() {
    return this._bool("rounded");
  }
  get disabled() {
    return this._bool("disabled");
  }
  get expandIcon() {
    return this._attr("expand-icon", "›");
  }
  get openedValues() {
    return this._readValues(this._attr("opened", ""));
  }
  get selectedValues() {
    return this._readValues(this._attr("selected", ""));
  }
  get activatedValues() {
    return this._readValues(this._attr("activated", ""));
  }
  _template() {
    this._tree = this._parseItems(this.itemsAttr);
    if (!this._tree.length)
      return '<div class="w-treeview" role="tree"><slot></slot></div>';
    const classes = ["w-treeview"];
    if (this.density)
      classes.push("w-treeview--" + this.density);
    if (this.hoverable)
      classes.push("w-treeview--hoverable");
    if (this.rounded)
      classes.push("w-treeview--rounded");
    if (this.selectable)
      classes.push("w-treeview--selectable");
    if (this.activatable)
      classes.push("w-treeview--activatable");
    if (this.disabled)
      classes.push("w-treeview--disabled");
    const color = this._attr("color", "");
    const style = color ? ` style="--w-treeview-accent: ${this._esc(color)};"` : "";
    const opened = new Set(this.openedValues);
    const selected = new Set(this.selectedValues);
    const activated = new Set(this.activatedValues);
    const html = this._treeHtml(this._tree, opened, selected, activated, true);
    return `<div class="${classes.join(" ")}" role="tree"${style}>${html}</div>`;
  }
  _treeHtml(nodes, opened, selected, activated, root) {
    const groupRole = root ? ' role="presentation"' : ' role="group"';
    return `<ul class="w-treeview-list"${groupRole}>${nodes.map((node) => {
      const hasChildren = node.children.length > 0;
      const open = this.openAll || opened.has(node.value);
      const active = activated.has(node.value);
      const value = this._esc(node.value);
      const toggle = hasChildren ? `<button class="w-treeview-toggle" type="button" tabindex="-1" aria-label="Toggle ${this._esc(node.title)}">${this._esc(this.expandIcon)}</button>` : '<span class="w-treeview-leaf" aria-hidden="true"></span>';
      let checkbox = "";
      let selectedAttr = active ? ' aria-selected="true"' : "";
      if (this.selectable) {
        const state = this._nodeState(node, selected);
        checkbox = `<span class="w-treeview-checkbox" role="checkbox" tabindex="-1" aria-checked="${state}"></span>`;
        selectedAttr = ` aria-selected="${state === "true"}"`;
      }
      return `<li class="w-treeview-node${open ? " open" : ""}" role="treeitem" data-value="${value}"` + `${hasChildren ? ` aria-expanded="${open}"` : ""}${selectedAttr}>` + `<div class="w-treeview-row${active ? " active" : ""}"${node.disabled ? ' aria-disabled="true"' : ""} tabindex="-1">` + `${toggle}${checkbox}<span class="w-treeview-label">${this._esc(node.title)}</span>` + "</div>" + `${hasChildren ? this._treeHtml(node.children, opened, selected, activated, false) : ""}` + "</li>";
    }).join("")}</ul>`;
  }
  _events() {
    const tree = this._q(".w-treeview");
    if (!tree || !this._tree || !this._tree.length)
      return;
    this.addEventListener("change", (event) => {
      if (event.target !== this)
        event.stopImmediatePropagation();
    });
    tree.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target)
        return;
      const li = target.closest(".w-treeview-node");
      if (!li || !tree.contains(li))
        return;
      const node = this._nodeByValue(li.getAttribute("data-value"));
      if (!node)
        return;
      if (target.closest(".w-treeview-toggle")) {
        this._toggleOpen(li, node);
        return;
      }
      if (this.disabled || node.disabled)
        return;
      if (target.closest(".w-treeview-checkbox")) {
        this._toggleSelect(node);
        return;
      }
      if (this.openOnClick && node.children.length)
        this._toggleOpen(li, node);
      if (this.activatable)
        this._activate(node);
    });
    tree.addEventListener("keydown", (event) => this._onKeydown(event, tree));
    this._roveTabIndex(tree);
  }
  _toggleOpen(li, node) {
    const open = !li.classList.contains("open");
    li.classList.toggle("open", open);
    li.setAttribute("aria-expanded", String(open));
    const next = new Set(this.openedValues);
    if (open)
      next.add(node.value);
    else
      next.delete(node.value);
    const opened = Array.from(next);
    this._silentSet("opened", JSON.stringify(opened));
    this._emit("change", { value: opened, name: "opened" });
  }
  _activate(node) {
    let activated;
    if (this.multipleActive) {
      activated = this._toggleArray(this.activatedValues, node.value);
    } else {
      activated = this.activatedValues.includes(node.value) ? [] : [node.value];
    }
    this._silentSet("activated", JSON.stringify(activated));
    this._syncActivated(new Set(activated));
    this._emit("change", {
      value: this.multipleActive ? activated : activated[0] || "",
      name: "activated",
      id: node.value
    });
  }
  _syncActivated(activated) {
    this.querySelectorAll(".w-treeview-node").forEach((li) => {
      const on = activated.has(li.getAttribute("data-value"));
      li.querySelector(":scope > .w-treeview-row").classList.toggle("active", on);
      if (!this.selectable)
        li.setAttribute("aria-selected", String(on));
    });
  }
  _toggleSelect(node) {
    const selected = new Set(this.selectedValues);
    if (this.selectStrategy === "independent") {
      selected.has(node.value) ? selected.delete(node.value) : selected.add(node.value);
    } else {
      const targets = this.selectStrategy === "classic" ? this._descendants(node) : this._leaves(node);
      const allOn = targets.every((value) => selected.has(value));
      targets.forEach((value) => allOn ? selected.delete(value) : selected.add(value));
      if (this.selectStrategy === "classic")
        this._normalizeClassic(this._tree, selected);
    }
    const list = Array.from(selected);
    this._silentSet("selected", JSON.stringify(list));
    this._syncSelected(selected);
    this._emit("change", { value: list, name: "selected", id: node.value });
  }
  _syncSelected(selected) {
    this.querySelectorAll(".w-treeview-node").forEach((li) => {
      const node = this._nodeByValue(li.getAttribute("data-value"));
      if (!node)
        return;
      const state = this._nodeState(node, selected);
      const box = li.querySelector(":scope > .w-treeview-row > .w-treeview-checkbox");
      if (box)
        box.setAttribute("aria-checked", state);
      li.setAttribute("aria-selected", String(state === "true"));
    });
  }
  _nodeState(node, selected) {
    if (this.selectStrategy === "independent")
      return selected.has(node.value) ? "true" : "false";
    const leaves = this._leaves(node);
    const on = leaves.filter((value) => selected.has(value)).length;
    if (on === 0)
      return "false";
    return on === leaves.length ? "true" : "mixed";
  }
  _normalizeClassic(nodes, selected) {
    nodes.forEach((node) => {
      if (!node.children.length)
        return;
      this._normalizeClassic(node.children, selected);
      const allOn = node.children.every((child) => selected.has(child.value));
      allOn ? selected.add(node.value) : selected.delete(node.value);
    });
  }
  _leaves(node, out = []) {
    if (!node.children.length)
      out.push(node.value);
    else
      node.children.forEach((child) => this._leaves(child, out));
    return out;
  }
  _descendants(node, out = []) {
    out.push(node.value);
    node.children.forEach((child) => this._descendants(child, out));
    return out;
  }
  _onKeydown(event, tree) {
    const rows = this._visibleRows(tree);
    if (!rows.length)
      return;
    const current = rows.indexOf(document.activeElement);
    const li = document.activeElement && document.activeElement.closest ? document.activeElement.closest(".w-treeview-node") : null;
    const node = li ? this._nodeByValue(li.getAttribute("data-value")) : null;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this._focusRow(rows, current < 0 ? 0 : Math.min(current + 1, rows.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        this._focusRow(rows, current <= 0 ? 0 : current - 1);
        break;
      case "Home":
        event.preventDefault();
        this._focusRow(rows, 0);
        break;
      case "End":
        event.preventDefault();
        this._focusRow(rows, rows.length - 1);
        break;
      case "ArrowRight":
        if (!li || !node || !node.children.length)
          break;
        event.preventDefault();
        if (!li.classList.contains("open"))
          this._toggleOpen(li, node);
        else {
          const next = this._visibleRows(tree);
          this._focusRow(next, next.indexOf(li.querySelector(":scope > .w-treeview-row")) + 1);
        }
        break;
      case "ArrowLeft":
        if (!li || !node)
          break;
        event.preventDefault();
        if (li.classList.contains("open") && node.children.length)
          this._toggleOpen(li, node);
        else {
          const parent = li.parentElement ? li.parentElement.closest(".w-treeview-node") : null;
          if (parent) {
            const row = parent.querySelector(":scope > .w-treeview-row");
            this._roveTo(row);
            row.focus();
          }
        }
        break;
      case "Enter":
      case " ":
        if (!node || this.disabled || node.disabled)
          break;
        event.preventDefault();
        if (this.selectable)
          this._toggleSelect(node);
        else if (this.activatable)
          this._activate(node);
        else if (node.children.length)
          this._toggleOpen(li, node);
        break;
      default:
        return;
    }
  }
  _visibleRows(tree) {
    return Array.from(tree.querySelectorAll(".w-treeview-row")).filter((row) => row.offsetParent !== null || row.getClientRects().length > 0);
  }
  _focusRow(rows, index) {
    const row = rows[Math.max(0, Math.min(index, rows.length - 1))];
    if (!row)
      return;
    this._roveTo(row);
    row.focus();
  }
  _roveTabIndex(tree) {
    const first = tree.querySelector(".w-treeview-row");
    if (first)
      this._roveTo(first);
  }
  _roveTo(row) {
    this.querySelectorAll(".w-treeview-row").forEach((el) => el.setAttribute("tabindex", "-1"));
    row.setAttribute("tabindex", "0");
  }
  _nodeByValue(value) {
    if (value == null)
      return null;
    const walk = (nodes) => {
      for (const node of nodes) {
        if (node.value === value)
          return node;
        const found = walk(node.children);
        if (found)
          return found;
      }
      return null;
    };
    return walk(this._tree || []);
  }
  _parseItems(raw) {
    if (!raw)
      return [];
    const text = String(raw).trim();
    const parsed = this._parseStructuredValue(text);
    if (Array.isArray(parsed)) {
      if (parsed.length && parsed.every((item) => typeof item === "string" && item.includes(">"))) {
        return this._fromPaths(parsed);
      }
      return parsed.map((item) => this._normalize(item)).filter(Boolean);
    }
    const list = text.replace(/^\[|\]$/g, "").split(text.includes(";") ? ";" : ",").map((part) => part.trim()).filter(Boolean);
    if (list.some((item) => item.includes(">")))
      return this._fromPaths(list);
    return list.map((item) => this._normalize(item)).filter(Boolean);
  }
  _normalize(item) {
    if (item == null)
      return null;
    if (typeof item !== "object") {
      const label = String(item).trim();
      return label ? { title: label, value: label, children: [], disabled: false } : null;
    }
    const title = item[this.itemTitleKey] ?? item.title ?? "";
    const value = String(item[this.itemValueKey] ?? item.value ?? title);
    const rawChildren = item[this.itemChildrenKey] || item.children || [];
    const children = Array.isArray(rawChildren) ? rawChildren.map((child) => this._normalize(child)).filter(Boolean) : [];
    return { title: String(title), value, children, disabled: !!item.disabled };
  }
  _fromPaths(paths) {
    const root = [];
    paths.forEach((path) => {
      const parts = String(path).split(">").map((part) => part.trim()).filter(Boolean);
      let level = root;
      let prefix = "";
      parts.forEach((label) => {
        prefix = prefix ? prefix + ">" + label : label;
        let node = level.find((entry) => entry.title === label);
        if (!node) {
          node = { title: label, value: prefix, children: [], disabled: false };
          level.push(node);
        }
        level = node.children;
      });
    });
    return root;
  }
  _readValues(value) {
    if (!value)
      return [];
    const text = String(value).trim();
    if (!text)
      return [];
    const parsed = this._parseStructuredValue(text);
    if (Array.isArray(parsed))
      return parsed.map(String);
    if (parsed != null)
      return [String(parsed)];
    return text.split(",").map((part) => part.trim()).filter(Boolean);
  }
  _toggleArray(values, value) {
    return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
  }
  _parseStructuredValue(text) {
    try {
      return JSON.parse(text);
    } catch (_) {
      if (!text.includes("'"))
        return null;
      try {
        const normalized = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_2, value) => JSON.stringify(value.replace(/\\'/g, "'")));
        return JSON.parse(normalized);
      } catch (_2) {
        return null;
      }
    }
  }
}
if (!customElements.get("w-treeview"))
  customElements.define("w-treeview", WTreeview);

// src/components/validation.js
class WValidation extends WElement {
  _template() {
    return `<div class="w-validation"><slot></slot></div>`;
  }
}
if (!customElements.get("w-validation"))
  customElements.define("w-validation", WValidation);

// src/components/virtual-scroll.js
class WVirtualScroll extends WElement {
  static attrs = ["height", "items", "item-height", "item-title", "overscan"];
  get itemList() {
    const raw = this._attr("items", "");
    const parsed = this._parseStructured(raw);
    return Array.isArray(parsed) ? parsed : wParseRecords(raw);
  }
  get dynamic() {
    return !this.hasAttribute("item-height");
  }
  get itemHeight() {
    return Math.max(1, wNumberAttr(this, "item-height", 48));
  }
  get overscan() {
    return Math.max(0, wNumberAttr(this, "overscan", 3));
  }
  get itemTitleKey() {
    return this._attr("item-title", "title");
  }
  get height() {
    return this._attr("height", "240px");
  }
  get _estimate() {
    return 48;
  }
  _heightStyle() {
    const value = this.height;
    return /^\d+(\.\d+)?$/.test(value) ? value + "px" : value;
  }
  _numHeight() {
    return parseFloat(this.height) || 240;
  }
  _template() {
    this._items = this.itemList;
    if (!this._items.length) {
      return `<div class="w-virtual-scroll" style="max-height:${this._esc(this._heightStyle())}"><slot></slot></div>`;
    }
    this._initSizes();
    return `<div class="w-virtual-scroll" style="height:${this._esc(this._heightStyle())}" data-virtual-scroll role="list">
      <div class="w-virtual-scroll-container" data-virtual-container></div>
    </div>`;
  }
  _events() {
    const scroller = this._q("[data-virtual-scroll]");
    if (!scroller)
      return;
    scroller.addEventListener("scroll", () => this._renderWindow(), { passive: true });
    this._renderWindow();
  }
  _initSizes() {
    const len = this._items.length;
    if (this._sizes && this._sizes.length === len && this._sizesKey === this.itemHeight && this._sizesDyn === this.dynamic)
      return;
    const base = this.dynamic ? this._estimate : this.itemHeight;
    this._sizes = new Array(len).fill(base);
    this._sizesKey = this.itemHeight;
    this._sizesDyn = this.dynamic;
    this._buildOffsets();
  }
  _buildOffsets() {
    const len = this._sizes.length;
    const offsets = new Array(len + 1);
    offsets[0] = 0;
    for (let i = 0;i < len; i++)
      offsets[i + 1] = offsets[i] + this._sizes[i];
    this._offsets = offsets;
  }
  _indexAt(y) {
    const offsets = this._offsets;
    const last = offsets.length - 1;
    if (y <= 0)
      return 0;
    if (y >= offsets[last])
      return Math.max(0, last - 1);
    let lo = 0;
    let hi = last;
    while (lo < hi) {
      const mid = lo + hi >> 1;
      if (offsets[mid] <= y)
        lo = mid + 1;
      else
        hi = mid;
    }
    return Math.max(0, lo - 1);
  }
  _renderWindow() {
    const scroller = this._q("[data-virtual-scroll]");
    const container = this._q("[data-virtual-container]");
    if (!scroller || !container)
      return;
    const len = this._items.length;
    const viewport = scroller.clientHeight || this._numHeight();
    const top = scroller.scrollTop;
    const start = Math.max(0, this._indexAt(top) - this.overscan);
    const end = Math.min(len, this._indexAt(top + viewport) + 1 + this.overscan);
    container.style.paddingTop = this._offsets[start] + "px";
    container.style.paddingBottom = this._offsets[len] - this._offsets[end] + "px";
    container.innerHTML = this._rows(start, end);
    if (this.dynamic)
      this._measure(container, start);
    this._range = { start, end };
    this._emit("scroll", { start, end });
  }
  _rows(start, end) {
    let html = "";
    for (let i = start;i < end; i++) {
      const style = this.dynamic ? "" : ` style="height:${this.itemHeight}px"`;
      html += `<div class="w-virtual-scroll-item" role="listitem" data-index="${i}"${style}>${this._esc(this._display(this._items[i]))}</div>`;
    }
    return html;
  }
  _measure(container, start) {
    let changed = false;
    container.querySelectorAll(".w-virtual-scroll-item").forEach((el) => {
      const i = Number(el.dataset.index);
      const h = el.offsetHeight;
      if (h && this._sizes[i] !== h) {
        this._sizes[i] = h;
        changed = true;
      }
    });
    if (!changed)
      return;
    this._buildOffsets();
    const len = this._items.length;
    const end = start + container.children.length;
    container.style.paddingTop = this._offsets[start] + "px";
    container.style.paddingBottom = this._offsets[len] - this._offsets[end] + "px";
  }
  _display(item) {
    if (item == null)
      return "";
    if (typeof item === "object")
      return String(wRecordValue(item, this.itemTitleKey));
    return String(item);
  }
  scrollToIndex(index) {
    const scroller = this._q("[data-virtual-scroll]");
    if (!scroller || !this._offsets)
      return;
    const i = wClamp(Math.floor(Number(index) || 0), 0, this._items.length);
    scroller.scrollTop = this._offsets[i];
    this._renderWindow();
  }
  calculateVisibleItems() {
    this._renderWindow();
  }
  _parseStructured(text) {
    text = String(text || "").trim();
    if (!text.startsWith("["))
      return null;
    try {
      return JSON.parse(text);
    } catch (_) {}
    if (!text.includes("'"))
      return null;
    try {
      const normalized = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, value) => JSON.stringify(value.replace(/\\'/g, "'")));
      return JSON.parse(normalized);
    } catch (_) {
      return null;
    }
  }
}
if (!customElements.get("w-virtual-scroll"))
  customElements.define("w-virtual-scroll", WVirtualScroll);

// src/components/calendar-monthly.js
class WCalendarMonthly extends WElement {
  _template() {
    return `<div class="w-calendar-monthly"><slot></slot></div>`;
  }
}
if (!customElements.get("w-calendar-monthly")) {
  customElements.define("w-calendar-monthly", WCalendarMonthly);
}

// src/components/class-icon.js
class WClassIcon extends WElement {
  static attrs = ["name", "size", "label"];
  get name() {
    return this._attr("name", "");
  }
  get size() {
    return this._attr("size", "");
  }
  get label() {
    return this._attr("label", "");
  }
  _template() {
    const style = this.size ? ` style="font-size:${this._esc(this.size)}"` : "";
    const aria = this.label ? ` role="img" aria-label="${this._esc(this.label)}"` : ' aria-hidden="true"';
    return `<i class="w-icon w-class-icon ${this._esc(this.name)}"${style}${aria}><slot></slot></i>`;
  }
}
if (!customElements.get("w-class-icon")) {
  customElements.define("w-class-icon", WClassIcon);
}

// src/components/component-icon.js
class WComponentIcon extends WElement {
  static attrs = ["label"];
  get label() {
    return this._attr("label", "");
  }
  _template() {
    const aria = this.label ? ` role="img" aria-label="${this._esc(this.label)}"` : ' aria-hidden="true"';
    return `<span class="w-icon w-component-icon"${aria}><slot></slot></span>`;
  }
}
if (!customElements.get("w-component-icon")) {
  customElements.define("w-component-icon", WComponentIcon);
}

// src/components/data-table-headers.js
class WDataTableHeaders extends WElement {
  static attrs = ["headers", "sort-by", "sort-desc"];
  get headers() {
    return wValueList(this._attr("headers", ""));
  }
  get sortBy() {
    return this._attr("sort-by", "");
  }
  get sortDesc() {
    return this._bool("sort-desc");
  }
  _template() {
    if (!this.headers.length)
      return `<w-row header no-gutters class="w-table-header"><slot></slot></w-row>`;
    const cols = Math.max(1, Math.floor(12 / this.headers.length));
    return `<w-row header no-gutters class="w-table-header">
      ${this.headers.map((header) => `<w-col cols="${cols}" role="columnheader"><button class="w-table-sort" type="button" data-sort="${this._esc(header)}">${this._esc(header)}${this.sortBy === header ? `<span aria-hidden="true">${this.sortDesc ? " ↓" : " ↑"}</span>` : ""}</button></w-col>`).join("")}
    </w-row>`;
  }
  _events() {
    this.querySelectorAll("[data-sort]").forEach((button) => {
      button.addEventListener("click", () => {
        const sortBy = button.getAttribute("data-sort");
        const sortDesc = this.sortBy === sortBy ? !this.sortDesc : false;
        this._silentSet("sort-by", sortBy);
        this._silentSet("sort-desc", sortDesc ? "true" : null);
        this._render();
        this._events();
        this._emit("change", { sortBy, sortDesc });
      });
    });
  }
}
if (!customElements.get("w-data-table-headers")) {
  customElements.define("w-data-table-headers", WDataTableHeaders);
}

// src/components/data-table-row.js
class WDataTableRow extends WElement {
  static attrs = ["headers", "item", "active"];
  get headers() {
    return wValueList(this._attr("headers", ""));
  }
  get item() {
    const raw = this._attr("item", "");
    if (!raw)
      return [];
    if (raw.trim().startsWith("[")) {
      try {
        return JSON.parse(raw);
      } catch {
        const text = raw.trim();
        return text.endsWith("]") ? wFields(text.slice(1, -1).replaceAll(",", "|")) : [];
      }
    }
    if (raw.trim().startsWith("{")) {
      try {
        return JSON.parse(raw);
      } catch {
        return {};
      }
    }
    return wFields(raw);
  }
  get active() {
    return this._bool("active");
  }
  _template() {
    if (!this.headers.length)
      return `<w-row no-gutters class="${this.active ? "selected" : ""}"><slot></slot></w-row>`;
    const cols = Math.max(1, Math.floor(12 / this.headers.length));
    return `<w-row no-gutters class="${this.active ? "selected" : ""}">
      ${this.headers.map((header, index) => `<w-col cols="${cols}" role="cell">${this._esc(wRecordValue(this.item, header, index))}</w-col>`).join("")}
    </w-row>`;
  }
}
if (!customElements.get("w-data-table-row")) {
  customElements.define("w-data-table-row", WDataTableRow);
}

// src/components/data-table-rows.js
class WDataTableRows extends WElement {
  static attrs = ["headers", "items"];
  get headers() {
    return wValueList(this._attr("headers", ""));
  }
  get items() {
    return wParseRecords(this._attr("items", ""), this.headers);
  }
  _template() {
    if (!this.items.length || !this.headers.length)
      return `<div class="w-data-table-rows"><slot></slot></div>`;
    return `<div class="w-data-table-rows">
      ${this.items.map((item) => `<w-data-table-row headers="${this._esc(JSON.stringify(this.headers))}" item="${this._esc(JSON.stringify(item))}"></w-data-table-row>`).join("")}
    </div>`;
  }
}
if (!customElements.get("w-data-table-rows")) {
  customElements.define("w-data-table-rows", WDataTableRows);
}

// src/components/date-picker-header.js
class WDatePickerHeader extends WElement {
  static attrs = ["header", "append-icon", "clickable"];
  get header() {
    return this._attr("header", "");
  }
  get appendIcon() {
    return this._attr("append-icon", "");
  }
  get clickable() {
    return this._bool("clickable") || this.hasAttribute("onclick");
  }
  _template() {
    return `<div class="w-date-picker-header${this.clickable ? " w-date-picker-header--clickable" : ""}">
      <span class="w-date-picker-header__prepend"><slot name="prepend"></slot></span>
      <span class="w-date-picker-header__content"><slot>${this._esc(this.header)}</slot></span>
      <span class="w-date-picker-header__append">${this.appendIcon ? `<button class="w-btn w-btn-text w-btn-icon" type="button" data-append aria-label="${this._esc(this.appendIcon)}">${this._esc(this.appendIcon)}</button>` : '<slot name="append"></slot>'}</span>
    </div>`;
  }
}
if (!customElements.get("w-date-picker-header")) {
  customElements.define("w-date-picker-header", WDatePickerHeader);
}

// src/components/dialog-bottom-transition.js
class WDialogBottomTransition extends WElement {
  _template() {
    return `<div class="w-dialog-bottom-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-dialog-bottom-transition")) {
  customElements.define("w-dialog-bottom-transition", WDialogBottomTransition);
}

// src/components/dialog-top-transition.js
class WDialogTopTransition extends WElement {
  _template() {
    return `<div class="w-dialog-top-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-dialog-top-transition")) {
  customElements.define("w-dialog-top-transition", WDialogTopTransition);
}

// src/components/dialog-transition.js
class WDialogTransition extends WElement {
  _template() {
    return `<div class="w-dialog-transition"><slot></slot></div>`;
  }
}
if (!customElements.get("w-dialog-transition")) {
  customElements.define("w-dialog-transition", WDialogTransition);
}

// src/components/expand-both-transition.js
class WExpandBothTransition extends WElement {
  _template() {
    return `<div class="w-expand-both-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-expand-both-transition")) {
  customElements.define("w-expand-both-transition", WExpandBothTransition);
}

// src/components/expand-transition.js
class WExpandTransition extends WElement {
  _template() {
    return `<div class="w-expand-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-expand-transition")) {
  customElements.define("w-expand-transition", WExpandTransition);
}

// src/components/expand-x-transition.js
class WExpandXTransition extends WElement {
  _template() {
    return `<div class="w-expand-x-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-expand-x-transition")) {
  customElements.define("w-expand-x-transition", WExpandXTransition);
}

// src/components/fab-transition.js
class WFabTransition extends WElement {
  _template() {
    return `<div class="w-fab-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-fab-transition")) {
  customElements.define("w-fab-transition", WFabTransition);
}

// src/components/fade-transition.js
class WFadeTransition extends WElement {
  _template() {
    return `<div class="w-fade-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-fade-transition")) {
  customElements.define("w-fade-transition", WFadeTransition);
}

// src/components/ligature-icon.js
class WLigatureIcon extends WElement {
  static attrs = ["name", "size", "label"];
  get name() {
    return this._attr("name", "");
  }
  get size() {
    return this._attr("size", "");
  }
  get label() {
    return this._attr("label", "");
  }
  _template() {
    const style = this.size ? ` style="font-size:${this._esc(this.size)}"` : "";
    const aria = this.label ? ` role="img" aria-label="${this._esc(this.label)}"` : ' aria-hidden="true"';
    return `<span class="w-icon w-ligature-icon"${style}${aria}>${this._esc(this.name)}<slot></slot></span>`;
  }
}
if (!customElements.get("w-ligature-icon")) {
  customElements.define("w-ligature-icon", WLigatureIcon);
}

// src/components/list-group-activator.js
class WListGroupActivator extends WElement {
  static attrs = ["title", "prepend-icon", "append-icon", "expanded", "controls", "disabled"];
  get title() {
    return this._attr("title", "");
  }
  get prependIcon() {
    return this._attr("prepend-icon", "");
  }
  get appendIcon() {
    return this._attr("append-icon", "");
  }
  get expanded() {
    const value = this._attr("expanded", "false");
    return value === "true" || value === "" || this.hasAttribute("open");
  }
  get controls() {
    return this._attr("controls", "");
  }
  get disabled() {
    return this._bool("disabled");
  }
  _template() {
    const hasCustomContent = this.childNodes.length > 0;
    const content = hasCustomContent ? "<slot></slot>" : `${this.prependIcon ? `<span class="w-list-item-prepend">${this._esc(this.prependIcon)}</span>` : '<span class="w-list-item-prepend" aria-hidden="true"></span>'}
        <span class="w-list-item-content"><span class="w-list-item-title">${this._esc(this.title)}</span></span>
        <span class="w-list-item-append">${this._esc(this.appendIcon)}</span>`;
    return `<button class="w-list-group-activator w-list-item" type="button" aria-expanded="${this.expanded}"${this.controls ? ` aria-controls="${this._esc(this.controls)}"` : ""}${this.disabled ? " disabled" : ""}>${content}</button>`;
  }
}
if (!customElements.get("w-list-group-activator")) {
  customElements.define("w-list-group-activator", WListGroupActivator);
}

// src/components/scale-transition.js
class WScaleTransition extends WElement {
  _template() {
    return `<div class="w-scale-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-scale-transition")) {
  customElements.define("w-scale-transition", WScaleTransition);
}

// src/components/scroll-x-reverse-transition.js
class WScrollXReverseTransition extends WElement {
  _template() {
    return `<div class="w-scroll-x-reverse-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-scroll-x-reverse-transition")) {
  customElements.define("w-scroll-x-reverse-transition", WScrollXReverseTransition);
}

// src/components/scroll-x-transition.js
class WScrollXTransition extends WElement {
  _template() {
    return `<div class="w-scroll-x-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-scroll-x-transition")) {
  customElements.define("w-scroll-x-transition", WScrollXTransition);
}

// src/components/scroll-y-reverse-transition.js
class WScrollYReverseTransition extends WElement {
  _template() {
    return `<div class="w-scroll-y-reverse-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-scroll-y-reverse-transition")) {
  customElements.define("w-scroll-y-reverse-transition", WScrollYReverseTransition);
}

// src/components/scroll-y-transition.js
class WScrollYTransition extends WElement {
  _template() {
    return `<div class="w-scroll-y-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-scroll-y-transition")) {
  customElements.define("w-scroll-y-transition", WScrollYTransition);
}

// src/components/slide-x-reverse-transition.js
class WSlideXReverseTransition extends WElement {
  _template() {
    return `<div class="w-slide-x-reverse-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-slide-x-reverse-transition")) {
  customElements.define("w-slide-x-reverse-transition", WSlideXReverseTransition);
}

// src/components/slide-x-transition.js
class WSlideXTransition extends WElement {
  _template() {
    return `<div class="w-slide-x-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-slide-x-transition")) {
  customElements.define("w-slide-x-transition", WSlideXTransition);
}

// src/components/slide-y-reverse-transition.js
class WSlideYReverseTransition extends WElement {
  _template() {
    return `<div class="w-slide-y-reverse-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-slide-y-reverse-transition")) {
  customElements.define("w-slide-y-reverse-transition", WSlideYReverseTransition);
}

// src/components/slide-y-transition.js
class WSlideYTransition extends WElement {
  _template() {
    return `<div class="w-slide-y-transition w-transition-wrapper"><slot></slot></div>`;
  }
}
if (!customElements.get("w-slide-y-transition")) {
  customElements.define("w-slide-y-transition", WSlideYTransition);
}

// src/components/svg-icon.js
class WSvgIcon extends WElement {
  static attrs = ["path", "view-box", "size", "label"];
  get path() {
    return this._attr("path", "");
  }
  get viewBox() {
    return this._attr("view-box", "0 0 24 24");
  }
  get size() {
    return this._attr("size", "1em");
  }
  get label() {
    return this._attr("label", "");
  }
  _template() {
    const aria = this.label ? ` role="img" aria-label="${this._esc(this.label)}"` : ' aria-hidden="true"';
    const style = this.size ? ` style="font-size:${this._esc(this.size)}"` : "";
    const body = this.path ? `<path d="${this._esc(this.path)}"></path>` : "<slot></slot>";
    return `<svg class="w-icon w-svg-icon"${style} viewBox="${this._esc(this.viewBox)}"${aria}>${body}</svg>`;
  }
}
if (!customElements.get("w-svg-icon")) {
  customElements.define("w-svg-icon", WSvgIcon);
}

// src/components/barline.js
class WBarline extends WElement {
  _template() {
    return `<div class="w-barline"><slot></slot></div>`;
  }
}
if (!customElements.get("w-barline")) {
  customElements.define("w-barline", WBarline);
}

// src/components/calendar-category.js
class WCalendarCategory extends WElement {
  _template() {
    return `<div class="w-calendar-category"><slot></slot></div>`;
  }
}
if (!customElements.get("w-calendar-category")) {
  customElements.define("w-calendar-category", WCalendarCategory);
}

// src/components/calendar-daily.js
class WCalendarDaily extends WElement {
  _template() {
    return `<div class="w-calendar-daily"><slot></slot></div>`;
  }
}
if (!customElements.get("w-calendar-daily")) {
  customElements.define("w-calendar-daily", WCalendarDaily);
}

// src/components/calendar-weekly.js
class WCalendarWeekly extends WElement {
  _template() {
    return `<div class="w-calendar-weekly"><slot></slot></div>`;
  }
}
if (!customElements.get("w-calendar-weekly")) {
  customElements.define("w-calendar-weekly", WCalendarWeekly);
}

// src/components/checkbox-btn.js
class WCheckboxBtn extends WElement {
  _template() {
    return `<div class="w-checkbox-btn"><slot></slot></div>`;
  }
}
if (!customElements.get("w-checkbox-btn")) {
  customElements.define("w-checkbox-btn", WCheckboxBtn);
}

// src/components/color-picker-canvas.js
class WColorPickerCanvas extends WElement {
  _template() {
    return `<div class="w-color-picker-canvas"><slot></slot></div>`;
  }
}
if (!customElements.get("w-color-picker-canvas")) {
  customElements.define("w-color-picker-canvas", WColorPickerCanvas);
}

// src/components/color-picker-edit.js
class WColorPickerEdit extends WElement {
  _template() {
    return `<div class="w-color-picker-edit"><slot></slot></div>`;
  }
}
if (!customElements.get("w-color-picker-edit")) {
  customElements.define("w-color-picker-edit", WColorPickerEdit);
}

// src/components/color-picker-preview.js
class WColorPickerPreview extends WElement {
  _template() {
    return `<div class="w-color-picker-preview"><slot></slot></div>`;
  }
}
if (!customElements.get("w-color-picker-preview")) {
  customElements.define("w-color-picker-preview", WColorPickerPreview);
}

// src/components/color-picker-swatches.js
class WColorPickerSwatches extends WElement {
  _template() {
    return `<div class="w-color-picker-swatches"><slot></slot></div>`;
  }
}
if (!customElements.get("w-color-picker-swatches")) {
  customElements.define("w-color-picker-swatches", WColorPickerSwatches);
}

// src/components/data-table-column.js
class WDataTableColumn extends WElement {
  _template() {
    return `<div class="w-data-table-column"><slot></slot></div>`;
  }
}
if (!customElements.get("w-data-table-column")) {
  customElements.define("w-data-table-column", WDataTableColumn);
}

// src/components/data-table-group-header-row.js
class WDataTableGroupHeaderRow extends WElement {
  _template() {
    return `<div class="w-data-table-group-header-row"><slot></slot></div>`;
  }
}
if (!customElements.get("w-data-table-group-header-row")) {
  customElements.define("w-data-table-group-header-row", WDataTableGroupHeaderRow);
}

// src/components/data-table-server.js
class WDataTableServer extends WDataTable {
  static attrs = [...WDataTable.attrs, "items-length"];
  get itemsLength() {
    return wNumberAttr(this, "items-length", this.items.length);
  }
  _filtered() {
    return this.items;
  }
  _sorted(rows) {
    return rows;
  }
  _visibleRows() {
    return this.items;
  }
  get _total() {
    return this.itemsLength;
  }
}
if (!customElements.get("w-data-table-server"))
  customElements.define("w-data-table-server", WDataTableServer);

// src/components/data-table-virtual.js
class WDataTableVirtual extends WDataTable {
  static attrs = [...WDataTable.attrs, "item-height"];
  get itemHeight() {
    return Math.max(1, wNumberAttr(this, "item-height", 48));
  }
  get height() {
    return this._attr("height", "400px");
  }
  _allRows() {
    return this._sorted(this._filtered());
  }
  _template() {
    const cols = this.columns;
    if (!cols.length)
      return `<div class="w-table-wrap"><slot></slot></div>`;
    const tableClasses = [
      "w-table",
      this.striped ? "w-table--striped" : "",
      this.hover ? "" : "w-table--no-hover",
      this.density === "compact" || this.density === "dense" ? "w-table--dense" : "",
      this.density === "comfortable" ? "w-table--comfortable" : ""
    ].filter(Boolean).join(" ");
    return `<div class="w-data-table w-data-table--virtual">
      <div class="w-table-wrap w-table-wrap--fixed-header" style="height:${this._esc(this.height)};overflow:auto" data-virtual-scroll>
        <table class="${tableClasses}">
          <thead>${this._headHtml(cols, [])}</thead>
          <tbody data-virtual-body></tbody>
        </table>
      </div>
    </div>`;
  }
  _events() {
    const scroller = this.querySelector("[data-virtual-scroll]");
    if (scroller)
      scroller.addEventListener("scroll", () => this._renderWindow());
    this.querySelectorAll("[data-sort]").forEach((btn) => btn.addEventListener("click", () => this._toggleSort(btn.getAttribute("data-sort"))));
    this._renderWindow();
  }
  _renderWindow() {
    const scroller = this.querySelector("[data-virtual-scroll]");
    const tbody = this.querySelector("[data-virtual-body]");
    if (!scroller || !tbody)
      return;
    const cols = this.columns;
    const rows = this._allRows();
    const rowH = this.itemHeight;
    const viewport = scroller.clientHeight || parseInt(this.height, 10) || 400;
    const overscan = 4;
    const start = Math.max(0, Math.floor(scroller.scrollTop / rowH) - overscan);
    const count = Math.ceil(viewport / rowH) + overscan * 2;
    const end = Math.min(rows.length, start + count);
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="${cols.length}" class="w-table-message">${this._esc(this.noDataText)}</td></tr>`;
      return;
    }
    let html = "";
    if (start > 0)
      html += `<tr aria-hidden="true" style="height:${start * rowH}px"><td colspan="${cols.length}"></td></tr>`;
    for (let i = start;i < end; i++) {
      html += `<tr style="height:${rowH}px">` + cols.map((col) => `<td style="text-align:${this._align(col)}">${this._esc(this._cell(rows[i], col))}</td>`).join("") + `</tr>`;
    }
    if (end < rows.length)
      html += `<tr aria-hidden="true" style="height:${(rows.length - end) * rowH}px"><td colspan="${cols.length}"></td></tr>`;
    tbody.innerHTML = html;
  }
}
if (!customElements.get("w-data-table-virtual"))
  customElements.define("w-data-table-virtual", WDataTableVirtual);

// src/components/date-picker-controls.js
class WDatePickerControls extends WElement {
  _template() {
    return `<div class="w-date-picker-controls"><slot></slot></div>`;
  }
}
if (!customElements.get("w-date-picker-controls")) {
  customElements.define("w-date-picker-controls", WDatePickerControls);
}

// src/components/date-picker-month.js
class WDatePickerMonth extends WElement {
  _template() {
    return `<div class="w-date-picker-month"><slot></slot></div>`;
  }
}
if (!customElements.get("w-date-picker-month")) {
  customElements.define("w-date-picker-month", WDatePickerMonth);
}

// src/components/date-picker-months.js
class WDatePickerMonths extends WElement {
  _template() {
    return `<div class="w-date-picker-months"><slot></slot></div>`;
  }
}
if (!customElements.get("w-date-picker-months")) {
  customElements.define("w-date-picker-months", WDatePickerMonths);
}

// src/components/date-picker-years.js
class WDatePickerYears extends WElement {
  _template() {
    return `<div class="w-date-picker-years"><slot></slot></div>`;
  }
}
if (!customElements.get("w-date-picker-years")) {
  customElements.define("w-date-picker-years", WDatePickerYears);
}

// src/components/field-label.js
class WFieldLabel extends WElement {
  _template() {
    return `<div class="w-field-label"><slot></slot></div>`;
  }
}
if (!customElements.get("w-field-label")) {
  customElements.define("w-field-label", WFieldLabel);
}

// src/components/file-upload-dropzone.js
class WFileUploadDropzone extends WElement {
  _template() {
    return `<div class="w-file-upload-dropzone"><slot></slot></div>`;
  }
}
if (!customElements.get("w-file-upload-dropzone")) {
  customElements.define("w-file-upload-dropzone", WFileUploadDropzone);
}

// src/components/file-upload-item.js
class WFileUploadItem extends WElement {
  _template() {
    return `<div class="w-file-upload-item"><slot></slot></div>`;
  }
}
if (!customElements.get("w-file-upload-item")) {
  customElements.define("w-file-upload-item", WFileUploadItem);
}

// src/components/file-upload-list.js
class WFileUploadList extends WElement {
  _template() {
    return `<div class="w-file-upload-list"><slot></slot></div>`;
  }
}
if (!customElements.get("w-file-upload-list")) {
  customElements.define("w-file-upload-list", WFileUploadList);
}

// src/components/item.js
class WItem extends WElement {
  static attrs = ["title", "description", "icon", "shortcut", "disabled"];
  get title() {
    return this._attr("title", "");
  }
  get description() {
    return this._attr("description", "");
  }
  get icon() {
    return this._attr("icon", "");
  }
  get shortcut() {
    return this._attr("shortcut", "");
  }
  get disabled() {
    return this._bool("disabled");
  }
  _template() {
    const generated = this.title || this.description || this.icon || this.shortcut;
    const content = generated ? `${this.icon ? `<span class="w-item-icon" aria-hidden="true">${this._esc(this.icon)}</span>` : '<span class="w-item-icon" aria-hidden="true"></span>'}
        <span class="w-item-content">
          ${this.title ? `<span class="w-item-title">${this._esc(this.title)}</span>` : ""}
          ${this.description ? `<span class="w-item-description">${this._esc(this.description)}</span>` : ""}
        </span>
        ${this.shortcut ? `<kbd class="w-kbd">${this._esc(this.shortcut)}</kbd>` : '<slot name="append"></slot>'}` : "<slot></slot>";
    return `<button class="w-item" type="button"${this.disabled ? " disabled" : ""}>${content}</button>`;
  }
}
if (!customElements.get("w-item")) {
  customElements.define("w-item", WItem);
}

// src/components/layout-item.js
class WLayoutItem extends WElement {
  _template() {
    return `<div class="w-layout-item"><slot></slot></div>`;
  }
}
if (!customElements.get("w-layout-item")) {
  customElements.define("w-layout-item", WLayoutItem);
}

// src/components/list-children.js
class WListChildren extends WElement {
  _template() {
    return `<div class="w-list-children"><slot></slot></div>`;
  }
}
if (!customElements.get("w-list-children")) {
  customElements.define("w-list-children", WListChildren);
}

// src/components/list-group.js
class WListGroup extends WElement {
  static attrs = [
    "open",
    "title",
    "value",
    "raw-id",
    "prepend-icon",
    "append-icon",
    "expand-icon",
    "collapse-icon",
    "subgroup",
    "fluid",
    "disabled",
    "color",
    "base-color",
    "active-color"
  ];
  get open() {
    return this._bool("open");
  }
  get title() {
    return this._attr("title", "");
  }
  get value() {
    return this._attr("value", this.title);
  }
  get rawId() {
    return this._attr("raw-id", this.value || this.title || "group");
  }
  get prependIcon() {
    return this._attr("prepend-icon", "");
  }
  get expandIcon() {
    return this._attr("expand-icon", "⌄");
  }
  get collapseIcon() {
    return this._attr("collapse-icon", "⌃");
  }
  get toggleIcon() {
    return this.open ? this.collapseIcon : this.expandIcon;
  }
  get appendIcon() {
    return this._attr("append-icon", this.subgroup ? "" : this.toggleIcon);
  }
  get subgroup() {
    return this._bool("subgroup");
  }
  get fluid() {
    return this._bool("fluid");
  }
  get disabled() {
    return this._bool("disabled");
  }
  _template() {
    const hasActivator = !!this.querySelector('[slot="activator"]');
    const id = "w-list-group-" + this._classToken(this.rawId);
    const classes = [
      "w-list-group",
      this.open ? "open" : "",
      this.subgroup ? "w-list-group--subgroup" : "",
      this.fluid ? "w-list-group--fluid" : ""
    ].filter(Boolean).join(" ");
    const prependIcon = this.prependIcon || (this.subgroup ? this.toggleIcon : "");
    const activator = hasActivator ? `<w-list-group-activator expanded="${this.open}" controls="${id}"${this.disabled ? " disabled" : ""}><slot name="activator"></slot></w-list-group-activator>` : `<w-list-group-activator
          title="${this._esc(this.title)}"
          prepend-icon="${this._esc(prependIcon)}"
          append-icon="${this._esc(this.appendIcon)}"
          expanded="${this.open}"
          controls="${id}"
          ${this.disabled ? "disabled" : ""}
        ></w-list-group-activator>`;
    return `<div class="${classes}">
      ${activator}
      <div id="${this._esc(id)}" class="w-list-group-items"${this.open ? "" : " hidden"}><slot></slot></div>
    </div>`;
  }
  _events() {
    const activator = this._q("w-list-group-activator") || this._q(".w-list-group-activator");
    if (!activator || this.disabled)
      return;
    activator.addEventListener("click", () => {
      const open = !this.open;
      this._silentSet("open", open ? "true" : null);
      this._render();
      this._events();
      this._emit("toggle", { open, value: this.value });
    });
  }
  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "group";
  }
}
if (!customElements.get("w-list-group")) {
  customElements.define("w-list-group", WListGroup);
}

// src/components/list-img.js
class WListImg extends WElement {
  _template() {
    return `<div class="w-list-img"><slot></slot></div>`;
  }
}
if (!customElements.get("w-list-img")) {
  customElements.define("w-list-img", WListImg);
}

// src/components/list-item-action.js
class WListItemAction extends WElement {
  _template() {
    return `<div class="w-list-item-action"><slot></slot></div>`;
  }
}
if (!customElements.get("w-list-item-action")) {
  customElements.define("w-list-item-action", WListItemAction);
}

// src/components/list-item-media.js
class WListItemMedia extends WElement {
  _template() {
    return `<div class="w-list-item-media"><slot></slot></div>`;
  }
}
if (!customElements.get("w-list-item-media")) {
  customElements.define("w-list-item-media", WListItemMedia);
}

// src/components/otp-field.js
class WOtpField extends WElement {
  _template() {
    return `<div class="w-otp-field"><slot></slot></div>`;
  }
}
if (!customElements.get("w-otp-field")) {
  customElements.define("w-otp-field", WOtpField);
}

// src/components/otp-group.js
class WOtpGroup extends WElement {
  _template() {
    return `<div class="w-otp-group"><slot></slot></div>`;
  }
}
if (!customElements.get("w-otp-group")) {
  customElements.define("w-otp-group", WOtpGroup);
}

// src/components/otp-separator.js
class WOtpSeparator extends WElement {
  _template() {
    return `<div class="w-otp-separator"><slot></slot></div>`;
  }
}
if (!customElements.get("w-otp-separator")) {
  customElements.define("w-otp-separator", WOtpSeparator);
}

// src/components/picker-title.js
class WPickerTitle extends WElement {
  _template() {
    return `<div class="w-picker-title"><slot></slot></div>`;
  }
}
if (!customElements.get("w-picker-title")) {
  customElements.define("w-picker-title", WPickerTitle);
}

// src/components/slider-thumb.js
class WSliderThumb extends WElement {
  _template() {
    return `<div class="w-slider-thumb"><slot></slot></div>`;
  }
}
if (!customElements.get("w-slider-thumb")) {
  customElements.define("w-slider-thumb", WSliderThumb);
}

// src/components/slider-track.js
class WSliderTrack extends WElement {
  _template() {
    return `<div class="w-slider-track"><slot></slot></div>`;
  }
}
if (!customElements.get("w-slider-track")) {
  customElements.define("w-slider-track", WSliderTrack);
}

// src/components/sparkline-tooltip.js
class WSparklineTooltip extends WElement {
  _template() {
    return `<div class="w-sparkline-tooltip"><slot></slot></div>`;
  }
}
if (!customElements.get("w-sparkline-tooltip")) {
  customElements.define("w-sparkline-tooltip", WSparklineTooltip);
}

// src/components/stepper-actions.js
class WStepperActions extends WElement {
  static attrs = ["prev-text", "next-text"];
  get prevText() {
    return this._attr("prev-text", "Back");
  }
  get nextText() {
    return this._attr("next-text", "Next");
  }
  _template() {
    if (this.querySelector("[data-stepper-action]")) {
      return `<div class="w-stepper-actions"><slot></slot></div>`;
    }
    return `<div class="w-stepper-actions">
      <button class="w-btn w-btn-text" type="button" data-stepper-action="prev">${this._esc(this.prevText)}</button>
      <button class="w-btn w-btn-filled" type="button" data-stepper-action="next">${this._esc(this.nextText)}</button>
    </div>`;
  }
}
if (!customElements.get("w-stepper-actions")) {
  customElements.define("w-stepper-actions", WStepperActions);
}

// src/components/stepper-header.js
class WStepperHeader extends WElement {
  _template() {
    return `<div class="w-stepper-header"><slot></slot></div>`;
  }
}
if (!customElements.get("w-stepper-header")) {
  customElements.define("w-stepper-header", WStepperHeader);
}

// src/components/stepper-vertical-actions.js
class WStepperVerticalActions extends WElement {
  _template() {
    return `<div class="w-stepper-vertical-actions"><slot></slot></div>`;
  }
}
if (!customElements.get("w-stepper-vertical-actions")) {
  customElements.define("w-stepper-vertical-actions", WStepperVerticalActions);
}

// src/components/stepper-vertical-item.js
class WStepperVerticalItem extends WElement {
  static attrs = ["value", "title", "label", "caption", "state", "complete", "error", "editable"];
  get value() {
    return this._attr("value", "");
  }
  get title() {
    return this._attr("title", "") || this._attr("label", "");
  }
  get caption() {
    return this._attr("caption", "");
  }
  get state() {
    return this._attr("state", "");
  }
  _template() {
    const isError = this._bool("error") || this.state === "error";
    const isDone = !isError && (this._bool("complete") || this.state === "done" || this.state === "complete");
    const isActive = !isError && !isDone && this.state === "active";
    const editable = this._bool("editable");
    const itemCls = ["w-stepper-vertical-item"];
    if (isActive)
      itemCls.push("active");
    if (isDone)
      itemCls.push("done");
    if (isError)
      itemCls.push("error");
    const stepCls = ["w-step"];
    if (isActive)
      stepCls.push("active");
    if (isDone)
      stepCls.push("done");
    if (isError)
      stepCls.push("error");
    if (editable)
      stepCls.push("editable");
    const indicator = isError ? "!" : isDone ? "✓" : this._esc(this.value || "");
    return `<div class="${itemCls.join(" ")}">
      <div class="${stepCls.join(" ")}" data-step-header>
        <div class="w-step-indicator">${indicator}</div>
        <div class="w-step-connector"></div>
        <div class="w-step-content">
          <div class="w-step-label">${this._esc(this.title)}</div>
          ${this.caption ? `<div class="w-step-caption">${this._esc(this.caption)}</div>` : ""}
        </div>
      </div>
      <div class="w-stepper-vertical-content"${isActive ? "" : " hidden"}><slot></slot></div>
    </div>`;
  }
}
if (!customElements.get("w-stepper-vertical-item")) {
  customElements.define("w-stepper-vertical-item", WStepperVerticalItem);
}

// src/components/time-picker-clock.js
class WTimePickerClock extends WElement {
  _template() {
    return `<div class="w-time-picker-clock"><slot></slot></div>`;
  }
}
if (!customElements.get("w-time-picker-clock")) {
  customElements.define("w-time-picker-clock", WTimePickerClock);
}

// src/components/time-picker-controls.js
class WTimePickerControls extends WElement {
  _template() {
    return `<div class="w-time-picker-controls"><slot></slot></div>`;
  }
}
if (!customElements.get("w-time-picker-controls")) {
  customElements.define("w-time-picker-controls", WTimePickerControls);
}

// src/components/time-picker-field.js
class WTimePickerField extends WElement {
  _template() {
    return `<div class="w-time-picker-field"><slot></slot></div>`;
  }
}
if (!customElements.get("w-time-picker-field")) {
  customElements.define("w-time-picker-field", WTimePickerField);
}

// src/components/treeview-children.js
class WTreeviewChildren extends WElement {
  _template() {
    return `<div class="w-treeview-children"><slot></slot></div>`;
  }
}
if (!customElements.get("w-treeview-children")) {
  customElements.define("w-treeview-children", WTreeviewChildren);
}

// src/components/treeview-group.js
class WTreeviewGroup extends WElement {
  _template() {
    return `<div class="w-treeview-group"><slot></slot></div>`;
  }
}
if (!customElements.get("w-treeview-group")) {
  customElements.define("w-treeview-group", WTreeviewGroup);
}

// src/components/treeview-item.js
class WTreeviewItem extends WElement {
  _template() {
    return `<div class="w-treeview-item"><slot></slot></div>`;
  }
}
if (!customElements.get("w-treeview-item")) {
  customElements.define("w-treeview-item", WTreeviewItem);
}

// src/components/trendline.js
class WTrendline extends WElement {
  _template() {
    return `<div class="w-trendline"><slot></slot></div>`;
  }
}
if (!customElements.get("w-trendline")) {
  customElements.define("w-trendline", WTrendline);
}

// src/components/virtual-scroll-item.js
class WVirtualScrollItem extends WElement {
  _template() {
    return `<div class="w-virtual-scroll-item"><slot></slot></div>`;
  }
}
if (!customElements.get("w-virtual-scroll-item")) {
  customElements.define("w-virtual-scroll-item", WVirtualScrollItem);
}
