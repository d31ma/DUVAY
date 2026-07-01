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
    const cls = transitionClass(name || el.getAttribute('data-w-transition') || 'fade');
    const ms = duration(opts.duration || el.getAttribute('data-w-transition-duration'), 180);

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
    const cls = transitionClass(name || el.getAttribute('data-w-transition') || 'fade');
    const ms = duration(opts.duration || el.getAttribute('data-w-transition-duration'), 180);

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
    const ms = duration(opts.duration || panel.getAttribute('data-w-expand-duration'), 180);
    const header = panel.querySelector('.w-expand-header, [data-w-expand-toggle]');

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
    const selector = opts.selector || container.getAttribute('data-w-flip-items');
    const ms = duration(opts.duration || container.getAttribute('data-w-flip-duration'), 260);
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
    const selector = opts.selector || container.getAttribute('data-w-flip-items');
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
    const selector = opts.selector || container.getAttribute('data-w-flip-items');
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

  function applyValue(el, property, value, options) {
    const opts = options || {};
    const unit = opts.unit || '';
    if (!property || property === 'text') {
      el.textContent = formatValue(value, opts);
    } else if (property === 'width') {
      el.style.width = value + (unit || '%');
    } else if (property === 'height') {
      el.style.height = value + (unit || 'px');
    } else if (property === 'opacity') {
      el.style.opacity = String(value);
    } else if (property === 'scale') {
      el.style.transform = `scale(${value})`;
    } else if (property === 'translateX') {
      el.style.transform = `translateX(${value}${unit || 'px'})`;
    } else if (property === 'translateY') {
      el.style.transform = `translateY(${value}${unit || 'px'})`;
    } else if (property.indexOf('css:') === 0) {
      el.style.setProperty(property.slice(4), value + unit);
    } else if (property.indexOf('attr:') === 0) {
      el.setAttribute(property.slice(5), formatValue(value, opts));
    }
  }

  function tween(el, options) {
    if (!el) return Promise.resolve();
    const opts = options || {};
    const from = Number(opts.from != null ? opts.from : el.getAttribute('data-w-tween-from') || 0);
    const to = Number(opts.to != null ? opts.to : el.getAttribute('data-w-tween-to') || el.textContent || 0);
    const ms = duration(opts.duration || el.getAttribute('data-w-tween-duration'), 600);
    const property = opts.property || el.getAttribute('data-w-tween-property') || 'text';
    const fmt = opts.format || el.getAttribute('data-w-tween-format') || 'integer';
    const unit = opts.unit || el.getAttribute('data-w-tween-unit') || '';
    const prefix = opts.prefix || el.getAttribute('data-w-tween-prefix') || '';
    const suffix = opts.suffix || el.getAttribute('data-w-tween-suffix') || '';
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
        if (t < 1) requestAnimationFrame(frame);
        else resolve(el);
      }
      requestAnimationFrame(frame);
    });
  }

  function spring(el, options) {
    if (!el) return Promise.resolve();
    const opts = options || {};
    const from = Number(opts.from != null ? opts.from : el.getAttribute('data-w-spring-from') || 0);
    const to = Number(opts.to != null ? opts.to : el.getAttribute('data-w-spring-to') || 1);
    const property = opts.property || el.getAttribute('data-w-spring-property') || 'scale';
    const unit = opts.unit || el.getAttribute('data-w-spring-unit') || '';
    const stiffness = Number(opts.stiffness || el.getAttribute('data-w-spring-stiffness') || 0.14);
    const damping = Number(opts.damping || el.getAttribute('data-w-spring-damping') || 0.76);

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
    scope.querySelectorAll('[data-w-flip]').forEach((el) => watchFlip(el));
    scope.querySelectorAll('[data-w-tween]').forEach((el) => {
      if (el.dataset.wTweenReady) return;
      el.dataset.wTweenReady = '1';
      if (el.getAttribute('data-w-tween-auto') !== 'false') tween(el);
    });
    scope.querySelectorAll('[data-w-spring]').forEach((el) => {
      if (el.dataset.wSpringReady) return;
      el.dataset.wSpringReady = '1';
      if (el.getAttribute('data-w-spring-auto') !== 'false') spring(el);
    });
  }

  document.addEventListener('click', function (event) {
    const transitionTrigger = event.target.closest('[data-w-transition-toggle]');
    if (transitionTrigger) {
      const target = targetById(transitionTrigger.getAttribute('data-w-transition-toggle'));
      const name = transitionTrigger.getAttribute('data-w-transition-name') || target?.getAttribute('data-w-transition') || 'fade';
      if (target) toggle(target, null, name);
      return;
    }

    const flipTrigger = event.target.closest('[data-w-flip-reorder]');
    if (flipTrigger) {
      const container = targetById(flipTrigger.getAttribute('data-w-flip-reorder'));
      if (!container) return;
      const mode = flipTrigger.getAttribute('data-w-flip-mode') || 'reverse';
      const selector = container.getAttribute('data-w-flip-items');
      flip(container, () => {
        const items = flipItems(container, selector);
        const parent = items[0] && items[0].parentElement ? items[0].parentElement : container;
        const ordered = mode === 'rotate' ? items.slice(1).concat(items[0]) : items.reverse();
        ordered.forEach((item) => parent.appendChild(item));
      });
      return;
    }

    const crossTrigger = event.target.closest('[data-w-crossfade]');
    if (crossTrigger) {
      const parts = crossTrigger.getAttribute('data-w-crossfade').split(/[:,\s]+/).filter(Boolean);
      const first = document.querySelector('[data-w-crossfade-key="' + parts[0] + '"]');
      const second = document.querySelector('[data-w-crossfade-key="' + parts[1] + '"]');
      let from = first;
      let to = second;
      if (crossTrigger.hasAttribute('data-w-crossfade-toggle') && first && second) {
        const firstHidden = first.hidden || first.classList.contains('w-transition-hidden');
        from = firstHidden ? second : first;
        to = firstHidden ? first : second;
      }
      if (!from || !to) return;
      const toHidden = to.hidden || to.classList.contains('w-transition-hidden');
      if (toHidden) {
        to.hidden = false;
        to.classList.remove('w-transition-hidden');
      }
      crossfade(from, to).then(() => {
        if (crossTrigger.hasAttribute('data-w-crossfade-toggle')) {
          from.hidden = true;
          from.classList.add('w-transition-hidden');
        }
      });
      return;
    }

    const tweenTrigger = event.target.closest('[data-w-tween-start]');
    if (tweenTrigger) {
      const target = targetById(tweenTrigger.getAttribute('data-w-tween-start'));
      if (target) tween(target);
      return;
    }

    const springTrigger = event.target.closest('[data-w-spring-start]');
    if (springTrigger) {
      const target = targetById(springTrigger.getAttribute('data-w-spring-start'));
      if (target) spring(target);
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
    init,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(document), { once: true });
  } else {
    init(document);
  }
})(window);
