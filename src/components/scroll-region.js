/* WScrollRegion — a table wrapper that scrolls is reachable from the keyboard
 * (DUVAY-9, WCAG 2.1.1, axe scrollable-region-focusable).
 *
 * While the wrapper's content is larger than the wrapper, it is a named,
 * focusable region (tabindex="0", role="region", aria-label), so a keyboard
 * user can focus it and scroll with the arrow keys. A wrapper that fits adds
 * no tab stop. A ResizeObserver repeats the check when the wrapper or its
 * content changes size. One observer per host: watching again replaces it.
 */

export class WScrollRegion {
  static observers = new WeakMap();

  static ATTRIBUTES = ['tabindex', 'role', 'aria-label'];

  static watch(host, wrapper, label) {
    WScrollRegion.unwatch(host);
    if (!wrapper) return;
    WScrollRegion.sync(wrapper, label);
    WScrollRegion.observe(host, wrapper, label);
  }

  static unwatch(host) {
    WScrollRegion.observers.get(host)?.disconnect();
    WScrollRegion.observers.delete(host);
  }

  static observe(host, wrapper, label) {
    if (typeof ResizeObserver !== 'function') return;
    const observer = new ResizeObserver(() => WScrollRegion.sync(wrapper, label));
    observer.observe(wrapper);
    Array.from(wrapper.children).forEach((child) => observer.observe(child));
    WScrollRegion.observers.set(host, observer);
  }

  static sync(wrapper, label) {
    if (WScrollRegion.scrolls(wrapper)) WScrollRegion.mark(wrapper, label);
    else WScrollRegion.clear(wrapper);
  }

  static scrolls(wrapper) {
    const wider = wrapper.scrollWidth > wrapper.clientWidth + 1;
    const taller = wrapper.scrollHeight > wrapper.clientHeight + 1;
    return wider || taller;
  }

  static mark(wrapper, label) {
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', label);
  }

  static clear(wrapper) {
    WScrollRegion.ATTRIBUTES.forEach((name) => wrapper.removeAttribute(name));
  }
}
