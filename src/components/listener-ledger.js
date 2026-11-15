/* WListenerLedger — lets `_events()` run again on the same nodes (DUVAY-8).
 *
 * A component's `_events()` binds listeners on its inner nodes and was written
 * to run once after each full render, when every inner node is new. When
 * `disabled` or `readonly` is patched in place the inner nodes stay, but
 * `_events()` must still run: many components bind nothing while disabled.
 *
 * `run(host, skipRepeats, callback)` runs `callback` (the component's
 * `_events()`) while it notes every listener added to a node inside `host`
 * (not the host itself, and not document or window, whose listeners the
 * components add and remove themselves). With `skipRepeats` a listener that
 * the same node already got from an earlier run (same type, capture flag and
 * code) is not added again, so nothing fires twice. New nodes get their
 * listeners as usual.
 */

export class WListenerLedger {
  static loadAdd = EventTarget.prototype.addEventListener;
  static seen = new WeakMap();
  static active = null;

  static trackingAdd = function trackingAdd(type, listener, options) {
    return WListenerLedger.add(this, type, listener, options);
  };

  // The add method in place when the outermost run started is restored after
  // it, so a wrapper another library installed stays.
  static run(host, skipRepeats, callback) {
    const previous = WListenerLedger.active;
    const originalAdd = previous ? previous.originalAdd : EventTarget.prototype.addEventListener;
    WListenerLedger.active = { host, skipRepeats, originalAdd };
    EventTarget.prototype.addEventListener = WListenerLedger.trackingAdd;
    try {
      callback();
    } finally {
      WListenerLedger.active = previous;
      WListenerLedger._restoreAdd(previous, originalAdd);
    }
  }

  static add(target, type, listener, options) {
    const active = WListenerLedger.active;
    if (!active) return WListenerLedger.loadAdd.call(target, type, listener, options);
    if (!WListenerLedger._tracks(active, target, listener)) return active.originalAdd.call(target, type, listener, options);
    const key = WListenerLedger._key(type, listener, options);
    const keys = WListenerLedger._keysOf(target);
    if (active.skipRepeats && keys.has(key)) return undefined;
    keys.add(key);
    return active.originalAdd.call(target, type, listener, options);
  }

  static _restoreAdd(previous, originalAdd) {
    if (previous) return;
    EventTarget.prototype.addEventListener = originalAdd;
  }

  static _tracks(active, target, listener) {
    if (typeof listener !== 'function' || !(target instanceof Node)) return false;
    return target !== active.host && active.host.contains(target);
  }

  static _keysOf(target) {
    if (!WListenerLedger.seen.has(target)) WListenerLedger.seen.set(target, new Set());
    return WListenerLedger.seen.get(target);
  }

  static _key(type, listener, options) {
    const capture = typeof options === 'boolean' ? options : !!(options && options.capture);
    return type + '|' + capture + '|' + String(listener);
  }
}
