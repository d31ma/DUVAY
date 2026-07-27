/* WTransition — shared base for the <w-*-transition> wrappers.
 *
 * Not a custom element itself. Every wrapper renders the same shape — a
 * display:contents element around a <slot> — and accepts the same props, so
 * the surface is implemented once here and each wrapper only names the
 * transition it drives.
 *
 *   group           every slotted child transitions independently
 *   hide-on-leave   the leaving child is hidden instead of animated out
 *   leave-absolute  the leaving child is taken out of flow for the leave
 *   mode            'out-in' | 'in-out' phase ordering for swap()
 *   origin          transform-origin for the animation
 *   target          anchors `origin` on another element, or on an "x,y" point
 *   disabled        a WElement common prop — skips the animation entirely
 *   duration        milliseconds, forwarded to the motion runtime
 *
 * Motion is delegated to window.WMotion (duvay-motion.js), which already
 * honours prefers-reduced-motion; nothing here bypasses it.
 *
 * enter(), leave(), toggle() and swap() all return a promise and default to
 * this wrapper's own children, so
 *   document.querySelector('w-fade-transition').enter()
 * is the whole integration surface for a router or a hand-rolled controller.
 */

export class WTransition extends WElement {
  static attrs = ['group', 'hide-on-leave', 'leave-absolute', 'mode', 'origin', 'target'];

  // Overridden per wrapper: the transition's class name (also the name the
  // motion runtime resolves) and the layout class the wrapper element carries.
  static transition = 'w-fade-transition';
  static wrapperClass = 'w-transition-wrapper';

  _template() {
    const own = this.constructor;
    const classes = [own.transition, own.wrapperClass, this._bool('group') ? 'w-transition-group' : ''];
    return `<div class="${classes.filter(Boolean).join(' ')}"><slot></slot></div>`;
  }

  // transform-origin belongs to the animated child, not to the display:contents
  // wrapper, so it is mirrored onto the children after every render.
  _events() {
    this._applyOrigin(this._children());
  }

  /* Targets */

  _children() {
    const slot = this._q('slot');
    return slot ? Array.from(slot.children) : [];
  }

  // What enter()/leave()/toggle() act on when called with no element: every
  // child under `group`, otherwise the single transitioning child.
  items() {
    const children = this._children();
    return this._bool('group') ? children : children.slice(0, 1);
  }

  /* Options */

  _name() {
    return this.constructor.transition;
  }

  // `disabled` skips the animation by collapsing it to a zero duration, which
  // makes the motion runtime apply the end state directly.
  _options() {
    return { duration: this._bool('disabled') ? 0 : this.getAttribute('duration') };
  }

  _origin() {
    const explicit = this._attr('origin', '');
    if (explicit) return explicit;
    const target = this._attr('target', '');
    return target ? this._targetOrigin(target) : '';
  }

  _applyOrigin(items) {
    const origin = this._origin();
    items.forEach((item) => { item.style.transformOrigin = origin; });
    return items;
  }

  // `target` takes an element id / selector or an "x,y" viewport point, and
  // resolves to a transform-origin offset measured from this wrapper's box.
  _targetOrigin(target) {
    const point = this._targetPoint(target);
    if (!point) return '';
    const box = this.getBoundingClientRect();
    return `${Math.round(point[0] - box.left)}px ${Math.round(point[1] - box.top)}px`;
  }

  _targetPoint(target) {
    const point = target.split(',').map(Number);
    if (point.length === 2 && point.every(Number.isFinite)) return point;
    const element = this._targetElement(target);
    if (!element) return null;
    const box = element.getBoundingClientRect();
    return [box.left + box.width / 2, box.top + box.height / 2];
  }

  _targetElement(target) {
    try {
      return document.getElementById(target) || document.querySelector(target);
    } catch (_) {
      return null;
    }
  }

  /* Phases */

  enter(element) {
    return this._run(element, (item) => window.WMotion.enter(item, this._name(), this._options()));
  }

  leave(element) {
    return this._run(element, (item) => this._leave(item));
  }

  toggle(element, open) {
    return this._run(element, (item) => this._toggle(item, open));
  }

  // Replace the visible child with `next`. `mode` orders the two phases:
  //   out-in   the old child leaves, then the new one enters
  //   in-out   the new child enters, then the old one leaves
  //   default  both phases run together
  swap(next, from) {
    const leaving = from || this._children().filter((item) => item !== next && !this._hidden(item))[0];
    if (!leaving) return this.enter(next);
    const mode = this._attr('mode', '');
    if (mode === 'out-in') return this.leave(leaving).then(() => this.enter(next));
    if (mode === 'in-out') return this.enter(next).then(() => this.leave(leaving));
    return Promise.all([this.enter(next), this.leave(leaving)]);
  }

  _run(element, run) {
    const items = this._applyOrigin(element ? [element] : this.items());
    if (!window.WMotion) return Promise.resolve(items);
    return Promise.all(items.map(run));
  }

  _leave(item) {
    if (this._bool('hide-on-leave')) return this._hide(item);
    const absolute = this._bool('leave-absolute');
    if (absolute) item.classList.add('w-leave-absolute');
    return window.WMotion.leave(item, this._name(), this._options()).then((done) => {
      if (absolute) item.classList.remove('w-leave-absolute');
      return done;
    });
  }

  // hide-on-leave: straight to the hidden end state, with any half-applied
  // lifecycle class cleared so the element cannot be left mid-animation.
  _hide(item) {
    item.classList.remove('w-enter-from', 'w-enter-active', 'w-leave-active', 'w-leave-to');
    item.classList.add('w-transition-hidden');
    item.hidden = true;
    return Promise.resolve(item);
  }

  _toggle(item, open) {
    const opening = open == null ? this._hidden(item) : open;
    const phase = opening ? this.enter(item) : this.leave(item);
    return phase.then((done) => {
      item.setAttribute('aria-hidden', String(!opening));
      return done;
    });
  }

  _hidden(item) {
    return item.hidden || item.classList.contains('w-transition-hidden');
  }
}

if (typeof window !== 'undefined') {
  window.WTransition = WTransition;
}
