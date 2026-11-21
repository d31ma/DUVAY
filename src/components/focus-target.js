/* WFocusTarget — the control that takes focus for an element (DUVAY-12).
 *
 * Components give focus back to an element they remember: a menu's
 * activator, a dialog's opener or `return-focus` element, an overlay's last
 * focused control. That element is often a DuVay wrapper such as <w-btn> or
 * <w-icon-btn>, whose host cannot take focus, so `host.focus()` does nothing
 * and focus falls to <body>. `of(element)` returns the control instead:
 *
 *   - the element itself, when it can take focus (a native control, or any
 *     element with a tabindex, -1 included);
 *   - otherwise its first tabbable descendant (button, a[href], input,
 *     select, textarea, summary, or a tabindex other than -1);
 *   - otherwise its nearest tabbable ancestor (a click on the icon or label
 *     inside a button).
 *
 * Disabled, hidden and inert controls are skipped. <body>, <html>, a
 * detached element and anything that is not an element give null, so a
 * component never moves focus somewhere the user did not come from.
 */

export class WFocusTarget {
  static TABBABLE = 'button, a[href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';

  static FOCUSABLE = 'button, a[href], input, select, textarea, summary, [tabindex], [contenteditable]:not([contenteditable="false"])';

  static of(element) {
    const candidates = WFocusTarget._candidates(element);
    return candidates.find(WFocusTarget._canTakeFocus) || null;
  }

  static focus(element, options) {
    const target = WFocusTarget.of(element);
    target?.focus(options);
    return target;
  }

  static _candidates(element) {
    if (!WFocusTarget._isReturnPoint(element)) return [];
    const inside = Array.from(element.querySelectorAll(WFocusTarget.TABBABLE));
    return [element, ...inside, element.parentElement?.closest(WFocusTarget.TABBABLE)];
  }

  static _isReturnPoint(element) {
    if (!(element instanceof Element) || !element.isConnected) return false;
    return element !== document.body && element !== document.documentElement;
  }

  static _canTakeFocus(candidate) {
    if (!(candidate instanceof HTMLElement) || !candidate.matches(WFocusTarget.FOCUSABLE)) return false;
    return !candidate.matches(':disabled') && !candidate.closest('[inert]') && candidate.getClientRects().length > 0;
  }
}
