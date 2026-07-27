/* <w-window-item> — DuVay component module
 *
 * Attributes:
 *   value              - identifier for this panel; <w-window value="…"> may
 *                        select by this name instead of by index
 *   selected-class     - class applied to this item while it is active
 *                        (overrides the parent window's `selected-class`)
 *   transition         - transition applied when the window advances TO this
 *                        item (`fade`, `scale`, `slide-x`, `slide-y`, or a
 *                        custom name); `false`/`none` disables animation
 *   reverse-transition - transition used when the window moves BACKWARDS to
 *                        this item; falls back to `transition`
 */

/* Normalise a transition attribute value: '' / 'true' mean "unset", and
   'false' / 'none' both map to the no-animation class. */
export function wTransitionName(value) {
  const raw = String(value ?? '').trim();
  if (!raw || raw === 'true') return '';
  return raw === 'false' || raw === 'none' ? 'none' : raw;
}

/* Transition classes live in their own namespace so toggling them never
   disturbs the item's own `w-window-item--*` / `w-carousel-item--*` modifiers. */
export const W_TRANSITION_PREFIX = 'w-transition--';

/* Put the in-effect transition class on an item's rendered box. Only the
   active item carries one, so the animation belongs to the incoming panel;
   `forward === false` prefers `reverse-transition`. */
export function wApplyItemTransition(box, item, active, forward) {
  const prefix = W_TRANSITION_PREFIX;
  Array.from(box.classList).forEach((name) => {
    if (name.startsWith(prefix)) box.classList.remove(name);
  });
  if (!active) return;
  const raw = forward === false
    ? (item.getAttribute('reverse-transition') ?? item.getAttribute('transition'))
    : item.getAttribute('transition');
  const name = wTransitionName(raw);
  if (name) box.classList.add(prefix + name);
}

export class WWindowItem extends WElement {
  static attrs = ['value', 'selected-class', 'transition', 'reverse-transition'];

  // The transition classes are owned by the parent window, which knows which
  // direction the value moved in — see wApplyItemTransition.
  _template() {
    return `<div class="w-window-item"><slot></slot></div>`;
  }
}

if (!customElements.get('w-window-item')) customElements.define('w-window-item', WWindowItem);
