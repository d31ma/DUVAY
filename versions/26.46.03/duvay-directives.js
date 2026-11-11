/* DuVay — Directives (w-* behaviors)
 *
 * Optional add-on (like duvay-motion.js). Zero dependencies.
 *
 * Framework-agnostic equivalents of Vuetify's directives. Each element that
 * carries a `w-*` attribute is wired with a per-element observer/listener
 * and dispatches a bubbling `w-<name>` CustomEvent (the callback equivalent).
 * Elements added/removed at runtime are wired/torn down by a MutationObserver,
 * so dynamically-injected markup works without a re-init call.
 *
 * Usage:
 *   <script src="duvay-directives.js" defer></script>
 *   <div w-intersect></div>
 *   el.addEventListener('w-intersect', e => { ... e.detail.isIntersecting ... });
 */

(function () {
  'use strict';

  function dirNoop() {}

  function emit(el, name, detail) {
    el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: detail || {} }));
  }

  // w-click-outside → w-click-outside { originalEvent }
  function setupClickOutside(el) {
    function onClick(e) {
      if (el === e.target || el.contains(e.target)) return;
      var include = el.getAttribute('w-click-outside-include');
      if (include) {
        var nodes = document.querySelectorAll(include);
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i] === e.target || nodes[i].contains(e.target)) return;
        }
      }
      emit(el, 'w-click-outside', { originalEvent: e });
    }
    document.addEventListener('click', onClick, true);
    return function () { document.removeEventListener('click', onClick, true); };
  }

  // w-intersect → w-intersect { isIntersecting, entries }; reflects w-intersecting
  function setupIntersect(el) {
    if (typeof IntersectionObserver === 'undefined') return dirNoop;
    var once = el.hasAttribute('w-intersect-once');
    var quiet = el.hasAttribute('w-intersect-quiet');
    var opts = {};
    var margin = el.getAttribute('w-intersect-margin');
    if (margin) opts.rootMargin = margin;
    var threshold = el.getAttribute('w-intersect-threshold');
    if (threshold) {
      opts.threshold = threshold.split(',').map(function (t) { return parseFloat(t); });
    }
    var rootSel = el.getAttribute('w-intersect-root');
    if (rootSel) opts.root = document.querySelector(rootSel);
    var first = true;
    var io = new IntersectionObserver(function (entries, observer) {
      var isIntersecting = entries.some(function (en) { return en.isIntersecting; });
      el.setAttribute('w-intersecting', isIntersecting ? 'true' : 'false');
      if (quiet && first) { first = false; return; }
      first = false;
      emit(el, 'w-intersect', { isIntersecting: isIntersecting, entries: entries });
      if (once && isIntersecting) observer.disconnect();
    }, opts);
    io.observe(el);
    return function () { io.disconnect(); };
  }

  // w-mutate → w-mutate { mutations }
  function setupMutate(el) {
    if (typeof MutationObserver === 'undefined') return dirNoop;
    var once = el.hasAttribute('w-mutate-once');
    var immediate = el.hasAttribute('w-mutate-immediate');
    var attr = el.hasAttribute('w-mutate-attr');
    var char = el.hasAttribute('w-mutate-char');
    var child = el.hasAttribute('w-mutate-child');
    var sub = el.hasAttribute('w-mutate-sub');
    var any = attr || char || child || sub;
    var mo = new MutationObserver(function (mutations) {
      emit(el, 'w-mutate', { mutations: mutations });
      if (once) mo.disconnect();
    });
    mo.observe(el, {
      attributes: any ? attr : true,
      characterData: any ? char : true,
      childList: any ? child : true,
      subtree: any ? sub : true
    });
    if (immediate) emit(el, 'w-mutate', { mutations: [] });
    return function () { mo.disconnect(); };
  }

  // w-resize → w-resize { width, height, entries }
  function setupResize(el) {
    var quiet = el.hasAttribute('w-resize-quiet');
    function fire(entries) {
      var rect = el.getBoundingClientRect();
      emit(el, 'w-resize', { width: rect.width, height: rect.height, entries: entries || [] });
    }
    var ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      var first = true;
      ro = new ResizeObserver(function (entries) {
        if (first) { first = false; if (quiet) return; } // initial observe callback = mount fire
        fire(entries);
      });
      ro.observe(el);
    } else if (!quiet) {
      fire([]);
    }
    function onWin() { fire([]); }
    window.addEventListener('resize', onWin);
    return function () {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', onWin);
    };
  }

  // w-ripple → visual ink (no event)
  function setupRipple(el) {
    el.classList.add('w-ripple-host');
    var center = el.hasAttribute('w-ripple-center');
    function show(e) {
      var rect = el.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var x, y;
      if (center || e.type === 'keydown' || e.clientX == null) {
        x = rect.width / 2; y = rect.height / 2;
      } else {
        x = e.clientX - rect.left; y = e.clientY - rect.top;
      }
      var ink = document.createElement('span');
      ink.className = 'w-ripple-ink';
      ink.style.width = ink.style.height = size + 'px';
      ink.style.left = (x - size / 2) + 'px';
      ink.style.top = (y - size / 2) + 'px';
      el.appendChild(ink);
      ink.addEventListener('animationend', function () { ink.remove(); });
    }
    function onKey(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') show(e);
    }
    el.addEventListener('pointerdown', show);
    el.addEventListener('keydown', onKey);
    return function () {
      el.removeEventListener('pointerdown', show);
      el.removeEventListener('keydown', onKey);
      el.classList.remove('w-ripple-host');
    };
  }

  // w-scroll → w-scroll { scrollTop, scrollLeft, target }
  function setupScroll(el) {
    var self = el.hasAttribute('w-scroll-self');
    var targetSel = el.getAttribute('w-scroll-target');
    var target = self ? el : (targetSel ? (document.querySelector(targetSel) || window) : window);
    function onScroll(e) {
      var t = (target === window) ? document.documentElement : target;
      emit(el, 'w-scroll', {
        scrollTop: t.scrollTop != null ? t.scrollTop : (window.scrollY || 0),
        scrollLeft: t.scrollLeft != null ? t.scrollLeft : (window.scrollX || 0),
        target: e.target
      });
    }
    target.addEventListener('scroll', onScroll, { passive: true });
    return function () { target.removeEventListener('scroll', onScroll); };
  }

  // w-touch → w-swipe { direction, offsetX, offsetY } + w-touchstart/move/end
  function setupTouch(el) {
    var threshold = parseInt(el.getAttribute('w-touch-threshold'), 10) || 16;
    var startX = 0, startY = 0, active = false;
    function down(e) {
      active = true; startX = e.clientX; startY = e.clientY;
      emit(el, 'w-touchstart', { x: startX, y: startY });
    }
    function move(e) {
      if (!active) return;
      emit(el, 'w-touchmove', { offsetX: e.clientX - startX, offsetY: e.clientY - startY });
    }
    function up(e) {
      if (!active) return;
      active = false;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      emit(el, 'w-touchend', { offsetX: dx, offsetY: dy });
      var absX = Math.abs(dx), absY = Math.abs(dy);
      var dir = null;
      if (absX > absY && absX > threshold) dir = dx < 0 ? 'left' : 'right';
      else if (absY >= absX && absY > threshold) dir = dy < 0 ? 'up' : 'down';
      if (dir) emit(el, 'w-swipe', { direction: dir, offsetX: dx, offsetY: dy });
    }
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return function () {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }

  var DIRECTIVES = {
    'w-click-outside': setupClickOutside,
    'w-intersect': setupIntersect,
    'w-mutate': setupMutate,
    'w-resize': setupResize,
    'w-ripple': setupRipple,
    'w-scroll': setupScroll,
    'w-touch': setupTouch
  };
  var DIR_ATTRS = Object.keys(DIRECTIVES);
  var DIR_SELECTOR = DIR_ATTRS.map(function (a) { return '[' + a + ']'; }).join(',');
  var wiredEls = new WeakMap();

  function directiveActive(el, attr) {
    if (!el.hasAttribute(attr)) return false;
    if (attr === 'w-ripple' && el.getAttribute(attr) === 'false') return false;
    return true;
  }

  function wireDirectives(el) {
    if (!el || el.nodeType !== 1 || !el.hasAttribute) return;
    var rec = wiredEls.get(el);
    if (!rec) { rec = {}; wiredEls.set(el, rec); }
    for (var i = 0; i < DIR_ATTRS.length; i++) {
      var attr = DIR_ATTRS[i];
      var active = directiveActive(el, attr);
      if (active && !rec[attr]) {
        var td = DIRECTIVES[attr](el);
        rec[attr] = (typeof td === 'function') ? td : dirNoop;
      } else if (!active && rec[attr]) {
        try { rec[attr](); } catch (_) {}
        delete rec[attr];
      }
    }
  }

  function unwireDirectives(el) {
    var rec = wiredEls.get(el);
    if (!rec) return;
    for (var attr in rec) { if (rec.hasOwnProperty(attr)) { try { rec[attr](); } catch (_) {} } }
    wiredEls.delete(el);
  }

  function eachDirectiveEl(node, fn) {
    if (!node || node.nodeType !== 1) return;
    fn(node);
    if (node.querySelectorAll) node.querySelectorAll(DIR_SELECTOR).forEach(fn);
  }

  function scanDirectives(root) {
    root = root || document;
    if (root.querySelectorAll) root.querySelectorAll(DIR_SELECTOR).forEach(wireDirectives);
    if (root.nodeType === 1) wireDirectives(root);
  }

  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'attributes') { wireDirectives(m.target); continue; }
        for (var r = 0; r < m.removedNodes.length; r++) eachDirectiveEl(m.removedNodes[r], unwireDirectives);
        for (var a = 0; a < m.addedNodes.length; a++) eachDirectiveEl(m.addedNodes[a], wireDirectives);
      }
    }).observe(document.documentElement, {
      childList: true, subtree: true, attributes: true, attributeFilter: DIR_ATTRS
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { scanDirectives(document); });
  } else {
    scanDirectives(document);
  }

  // Programmatic API for manual (re)wiring of detached or framework-managed nodes.
  window.WDirectives = {
    wire: wireDirectives,
    unwire: unwireDirectives,
    scan: scanDirectives
  };
})();
