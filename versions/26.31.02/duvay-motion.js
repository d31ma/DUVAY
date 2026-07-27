/* DuVay — Motion runtime
 *
 * Framework-agnostic helpers for named transitions, expansion height,
 * FLIP reorders, crossfades, tweened values, and spring motion.
 */

(function (root) {
  'use strict';

  if (root.WMotion && root.WMotion.__wMotion) {
    if (typeof root.WMotion.init === 'function') root.WMotion.init(document);
    return;
  }

  const TRANSITIONS = {
    fade: 'w-fade-transition',
    scale: 'w-scale-transition',
    'slide-x': 'w-slide-x-transition',
    'slide-x-reverse': 'w-slide-x-reverse-transition',
    'slide-y': 'w-slide-y-transition',
    'slide-y-reverse': 'w-slide-y-reverse-transition',
    'scroll-x': 'w-scroll-x-transition',
    'scroll-x-reverse': 'w-scroll-x-reverse-transition',
    'scroll-y': 'w-scroll-y-transition',
    'scroll-y-reverse': 'w-scroll-y-reverse-transition',
  };

  const flipState = new WeakMap();

  function prefersReducedMotion() {
    return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function duration(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  }

  function easing(value, fallback) {
    return value || fallback || 'cubic-bezier(0.2, 0, 0, 1)';
  }

  function transitionClass(name) {
    return TRANSITIONS[name] || name || TRANSITIONS.fade;
  }

  function waitForTransition(el, ms, done) {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      el.removeEventListener('transitionend', finish);
      done();
    };
    el.addEventListener('transitionend', finish, { once: true });
    root.setTimeout(finish, ms + 40);
  }

  function cleanTransition(el, cls) {
    el.classList.remove(cls, 'w-enter-from', 'w-enter-active', 'w-leave-active', 'w-leave-to');
    el.style.removeProperty('--w-motion-duration-local');
  }

  function enter(el, name, options) {
    if (!el) return Promise.resolve();
    const opts = options || {};
    const cls = transitionClass(name || el.getAttribute('w-transition') || 'fade');
    const ms = duration(opts.duration || el.getAttribute('w-transition-duration'), 180);

    return new Promise((resolve) => {
      cleanTransition(el, cls);
      el.hidden = false;
      el.classList.remove('w-transition-hidden');
      el.classList.add(cls);

      if (prefersReducedMotion() || ms === 0) {
        cleanTransition(el, cls);
        resolve(el);
        return;
      }

      el.style.setProperty('--w-motion-duration-local', ms + 'ms');
      el.classList.add('w-enter-from');
      void el.offsetWidth;
      el.classList.add('w-enter-active');
      el.classList.remove('w-enter-from');
      waitForTransition(el, ms, () => {
        cleanTransition(el, cls);
        resolve(el);
      });
    });
  }

  function leave(el, name, options) {
    if (!el) return Promise.resolve();
    const opts = options || {};
    const cls = transitionClass(name || el.getAttribute('w-transition') || 'fade');
    const ms = duration(opts.duration || el.getAttribute('w-transition-duration'), 180);

    return new Promise((resolve) => {
      cleanTransition(el, cls);
      el.classList.add(cls);

      if (prefersReducedMotion() || ms === 0) {
        el.hidden = opts.hide !== false;
        el.classList.toggle('w-transition-hidden', opts.hide !== false);
        cleanTransition(el, cls);
        resolve(el);
        return;
      }

      el.style.setProperty('--w-motion-duration-local', ms + 'ms');
      el.classList.add('w-leave-active');
      void el.offsetWidth;
      el.classList.add('w-leave-to');
      waitForTransition(el, ms, () => {
        if (opts.hide !== false) {
          el.hidden = true;
          el.classList.add('w-transition-hidden');
        }
        cleanTransition(el, cls);
        resolve(el);
      });
    });
  }

  function toggle(el, open, name, options) {
    const isOpen = open == null
      ? (el.hidden || el.classList.contains('w-transition-hidden') || el.getAttribute('aria-hidden') === 'true')
      : open;
    const run = isOpen ? enter : leave;
    return run(el, name, options).then(() => {
      if (el) el.setAttribute('aria-hidden', String(!isOpen));
      return el;
    });
  }

  function setExpand(panel, open, options) {
    if (!panel) return Promise.resolve();
    const body = panel.querySelector('.w-expand-body');
    if (!body) {
      panel.classList.toggle('open', !!open);
      return Promise.resolve(panel);
    }

    const next = open == null ? !panel.classList.contains('open') : !!open;
    const opts = options || {};
    const ms = duration(opts.duration || panel.getAttribute('w-expand-duration'), 180);
    const header = panel.querySelector('.w-expand-header, [w-expand-toggle]');

    if (header) header.setAttribute('aria-expanded', String(next));

    return new Promise((resolve) => {
      if (prefersReducedMotion() || ms === 0) {
        panel.classList.toggle('open', next);
        body.classList.remove('w-motion-expanding');
        body.style.height = '';
        body.style.opacity = '';
        resolve(panel);
        return;
      }

      body.classList.add('w-motion-expanding');
      body.style.overflow = 'hidden';

      const start = panel.classList.contains('open') ? body.scrollHeight : 0;
      if (next) panel.classList.add('open');
      body.style.height = start + 'px';
      body.style.opacity = next ? '0' : '1';
      body.style.transition = `height ${ms}ms ${easing(opts.easing, 'cubic-bezier(0.2, 0, 0, 1)')}, opacity ${ms}ms ease`;
      void body.offsetHeight;

      const end = next ? body.scrollHeight : 0;
      requestAnimationFrame(() => {
        body.style.height = end + 'px';
        body.style.opacity = next ? '1' : '0';
      });

      waitForTransition(body, ms, () => {
        panel.classList.toggle('open', next);
        body.classList.remove('w-motion-expanding');
        body.style.height = '';
        body.style.opacity = '';
        body.style.overflow = '';
        body.style.transition = '';
        resolve(panel);
      });
    });
  }

  function flipItems(container, selector) {
    if (!container) return [];
    if (selector) return Array.from(container.querySelectorAll(selector));
    return Array.from(container.children).filter((el) => el.nodeType === 1);
  }

  function readRects(container, selector) {
    const rects = new Map();
    flipItems(container, selector).forEach((el) => {
      rects.set(el, el.getBoundingClientRect());
    });
    return rects;
  }

  function animateFlip(container, before, options) {
    const opts = options || {};
    const selector = opts.selector || container.getAttribute('w-flip-items');
    const ms = duration(opts.duration || container.getAttribute('w-flip-duration'), 260);
    const ease = easing(opts.easing, 'cubic-bezier(0.2, 0, 0, 1)');
    const after = readRects(container, selector);

    if (prefersReducedMotion() || ms === 0) {
      flipState.set(container, after);
      return Promise.resolve(container);
    }

    const animations = [];
    after.forEach((newRect, el) => {
      const oldRect = before.get(el);
      if (!oldRect) return;
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
      animations.push(el.animate([
        { transform: `translate(${dx}px, ${dy}px)` },
        { transform: 'translate(0, 0)' },
      ], { duration: ms, easing: ease }));
    });

    flipState.set(container, after);
    return Promise.all(animations.map((a) => a.finished.catch(() => {}))).then(() => container);
  }

  function flip(container, mutate, options) {
    if (!container) return Promise.resolve();
    const opts = options || {};
    const selector = opts.selector || container.getAttribute('w-flip-items');
    const before = readRects(container, selector);
    if (typeof mutate === 'function') mutate();
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        animateFlip(container, before, Object.assign({}, opts, { selector })).then(resolve);
      });
    });
  }

  function watchFlip(container, options) {
    if (!container || flipState.has(container)) return;
    const opts = options || {};
    const selector = opts.selector || container.getAttribute('w-flip-items');
    flipState.set(container, readRects(container, selector));
    const observer = new MutationObserver(() => {
      const before = flipState.get(container) || new Map();
      requestAnimationFrame(() => animateFlip(container, before, { selector }));
    });
    observer.observe(container, { childList: true });
  }

  function crossfade(from, to, options) {
    if (!from || !to) return Promise.resolve();
    const opts = options || {};
    const ms = duration(opts.duration, 260);
    const ease = easing(opts.easing, 'cubic-bezier(0.2, 0, 0, 1)');
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const clone = from.cloneNode(true);

    clone.classList.add('w-motion-crossfade-clone');
    clone.removeAttribute('id');
    clone.style.left = a.left + 'px';
    clone.style.top = a.top + 'px';
    clone.style.width = a.width + 'px';
    clone.style.height = a.height + 'px';
    document.body.appendChild(clone);

    if (prefersReducedMotion() || ms === 0) {
      clone.remove();
      return Promise.resolve();
    }

    const sx = b.width && a.width ? b.width / a.width : 1;
    const sy = b.height && a.height ? b.height / a.height : 1;
    const animation = clone.animate([
      { opacity: 1, transform: 'translate(0, 0) scale(1, 1)' },
      { opacity: 0.2, transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${sx}, ${sy})` },
    ], { duration: ms, easing: ease });

    return animation.finished.catch(() => {}).then(() => clone.remove());
  }

  function formatValue(value, options) {
    const opts = options || {};
    const format = opts.format || 'integer';
    let text = format === 'fixed-2' ? value.toFixed(2)
      : format === 'fixed-1' ? value.toFixed(1)
      : format === 'raw' ? String(value)
      : String(Math.round(value));
    return (opts.prefix || '') + text + (opts.suffix || '');
  }

  const VALUE_SETTERS = Object.assign(Object.create(null), {
    text: (el, value, opts) => { el.textContent = formatValue(value, opts); },
    width: (el, value, opts) => { el.style.width = value + (opts.unit || '%'); },
    height: (el, value, opts) => { el.style.height = value + (opts.unit || 'px'); },
    opacity: (el, value) => { el.style.opacity = String(value); },
    scale: (el, value) => { el.style.transform = `scale(${value})`; },
    translateX: (el, value, opts) => { el.style.transform = `translateX(${value}${opts.unit || 'px'})`; },
    translateY: (el, value, opts) => { el.style.transform = `translateY(${value}${opts.unit || 'px'})`; },
  });

  function applyValue(el, property, value, options) {
    const opts = options || {};
    const setter = VALUE_SETTERS[property || 'text'];
    if (setter) {
      setter(el, value, opts);
    } else if (property.indexOf('css:') === 0) {
      el.style.setProperty(property.slice(4), value + (opts.unit || ''));
    } else if (property.indexOf('attr:') === 0) {
      el.setAttribute(property.slice(5), formatValue(value, opts));
    }
  }

  function pickNumber(value, fallback) {
    return Number(value != null ? value : fallback);
  }

  function pickOption(opts, key, el, attr, fallback) {
    return opts[key] || el.getAttribute(attr) || fallback;
  }

  function tweenOptions(el, opts) {
    return {
      from: pickNumber(opts.from, el.getAttribute('w-tween-from') || 0),
      to: pickNumber(opts.to, el.getAttribute('w-tween-to') || el.textContent || 0),
      ms: duration(opts.duration || el.getAttribute('w-tween-duration'), 600),
      property: pickOption(opts, 'property', el, 'w-tween-property', 'text'),
      format: pickOption(opts, 'format', el, 'w-tween-format', 'integer'),
      unit: pickOption(opts, 'unit', el, 'w-tween-unit', ''),
      prefix: pickOption(opts, 'prefix', el, 'w-tween-prefix', ''),
      suffix: pickOption(opts, 'suffix', el, 'w-tween-suffix', ''),
      ease: opts.easingFn || ((t) => 1 - Math.pow(1 - t, 3)),
    };
  }

  function tween(el, options) {
    if (!el) return Promise.resolve();
    const cfg = tweenOptions(el, options || {});
    const fmt = { format: cfg.format, unit: cfg.unit, prefix: cfg.prefix, suffix: cfg.suffix };

    return new Promise((resolve) => {
      if (prefersReducedMotion() || cfg.ms === 0 || !Number.isFinite(cfg.from) || !Number.isFinite(cfg.to)) {
        applyValue(el, cfg.property, cfg.to, fmt);
        resolve(el);
        return;
      }
      const start = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - start) / cfg.ms);
        const value = cfg.from + (cfg.to - cfg.from) * cfg.ease(t);
        applyValue(el, cfg.property, value, fmt);
        if (t < 1) requestAnimationFrame(frame);
        else resolve(el);
      }
      requestAnimationFrame(frame);
    });
  }

  function spring(el, options) {
    if (!el) return Promise.resolve();
    const opts = options || {};
    const from = pickNumber(opts.from, el.getAttribute('w-spring-from') || 0);
    const to = pickNumber(opts.to, el.getAttribute('w-spring-to') || 1);
    const property = pickOption(opts, 'property', el, 'w-spring-property', 'scale');
    const unit = pickOption(opts, 'unit', el, 'w-spring-unit', '');
    const stiffness = Number(pickOption(opts, 'stiffness', el, 'w-spring-stiffness', 0.14));
    const damping = Number(pickOption(opts, 'damping', el, 'w-spring-damping', 0.76));

    return new Promise((resolve) => {
      if (prefersReducedMotion() || !Number.isFinite(from) || !Number.isFinite(to)) {
        applyValue(el, property, to, { unit, format: 'raw' });
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
        applyValue(el, property, value, { unit, format: 'raw' });
        frames += 1;
        if ((Math.abs(to - value) < 0.001 && Math.abs(velocity) < 0.001) || frames > 180) {
          applyValue(el, property, to, { unit, format: 'raw' });
          resolve(el);
        } else {
          requestAnimationFrame(frame);
        }
      }
      requestAnimationFrame(frame);
    });
  }

  function targetById(value) {
    if (!value) return null;
    return document.getElementById(value) || document.querySelector(value);
  }

  function init(rootNode) {
    const scope = rootNode || document;
    scope.querySelectorAll('[w-flip]').forEach((el) => watchFlip(el));
    scope.querySelectorAll('[w-tween]').forEach((el) => {
      if (el.hasAttribute('w-tween-ready')) return;
      el.setAttribute('w-tween-ready', '1');
      if (el.getAttribute('w-tween-auto') !== 'false') tween(el);
    });
    scope.querySelectorAll('[w-spring]').forEach((el) => {
      if (el.hasAttribute('w-spring-ready')) return;
      el.setAttribute('w-spring-ready', '1');
      if (el.getAttribute('w-spring-auto') !== 'false') spring(el);
    });
  }

  function handleTransitionTrigger(event) {
    const trigger = event.target.closest('[w-transition-toggle]');
    if (!trigger) return false;
    const target = targetById(trigger.getAttribute('w-transition-toggle'));
    const name = trigger.getAttribute('w-transition-name') || target?.getAttribute('w-transition') || 'fade';
    if (target) toggle(target, null, name);
    return true;
  }

  function handleFlipTrigger(event) {
    const trigger = event.target.closest('[w-flip-reorder]');
    if (!trigger) return false;
    const container = targetById(trigger.getAttribute('w-flip-reorder'));
    if (!container) return true;
    const mode = trigger.getAttribute('w-flip-mode') || 'reverse';
    const selector = container.getAttribute('w-flip-items');
    flip(container, () => {
      const items = flipItems(container, selector);
      const parent = items[0] && items[0].parentElement ? items[0].parentElement : container;
      const ordered = mode === 'rotate' ? items.slice(1).concat(items[0]) : items.reverse();
      ordered.forEach((item) => parent.appendChild(item));
    });
    return true;
  }

  function crossfadePair(trigger, first, second) {
    if (!trigger.hasAttribute('w-crossfade-toggle') || !first || !second) return [first, second];
    const firstHidden = first.hidden || first.classList.contains('w-transition-hidden');
    return firstHidden ? [second, first] : [first, second];
  }

  function handleCrossfadeTrigger(event) {
    const trigger = event.target.closest('[w-crossfade]');
    if (!trigger) return false;
    const parts = trigger.getAttribute('w-crossfade').split(/[:,\s]+/).filter(Boolean);
    const pair = crossfadePair(
      trigger,
      document.querySelector('[w-crossfade-key="' + parts[0] + '"]'),
      document.querySelector('[w-crossfade-key="' + parts[1] + '"]'),
    );
    const from = pair[0];
    const to = pair[1];
    if (!from || !to) return true;
    const toHidden = to.hidden || to.classList.contains('w-transition-hidden');
    if (toHidden) {
      to.hidden = false;
      to.classList.remove('w-transition-hidden');
    }
    crossfade(from, to).then(() => {
      if (trigger.hasAttribute('w-crossfade-toggle')) {
        from.hidden = true;
        from.classList.add('w-transition-hidden');
      }
    });
    return true;
  }

  function handleTweenTrigger(event) {
    const trigger = event.target.closest('[w-tween-start]');
    if (!trigger) return false;
    const target = targetById(trigger.getAttribute('w-tween-start'));
    if (target) tween(target);
    return true;
  }

  function handleSpringTrigger(event) {
    const trigger = event.target.closest('[w-spring-start]');
    if (!trigger) return false;
    const target = targetById(trigger.getAttribute('w-spring-start'));
    if (target) spring(target);
    return true;
  }

  const CLICK_HANDLERS = [
    handleTransitionTrigger,
    handleFlipTrigger,
    handleCrossfadeTrigger,
    handleTweenTrigger,
    handleSpringTrigger,
  ];

  document.addEventListener('click', function (event) {
    CLICK_HANDLERS.some((handle) => handle(event));
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
    init,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(document), { once: true });
  } else {
    init(document);
  }
})(window);
