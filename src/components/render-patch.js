/* WRenderPatch — updates the affected part of an element in place (DUVAY-8).
 *
 * When a text attribute (hint, error, label, messages, ...) or `disabled` /
 * `readonly` changes, the new template usually differs from the last one in a few text nodes and
 * attributes. `apply(host, before, after)` compares the two template strings
 * and makes the same changes on the live nodes, so the control the user is
 * in keeps its identity: focus, caret, value, IME composition, undo history,
 * an open list and its active option all stay.
 *
 * Where the children changed shape (a message row that gains a line, a hint
 * that becomes an error with its own markup, or a bare w-input that gets its
 * first label and so a wrapper), the children are built again from the new
 * template, and every kept node is moved into its place in the new markup.
 * Kept nodes are controls, links, slots, custom elements and anything with a
 * tabindex: they keep their identity, listeners and state. This is done only
 * when the kept nodes are direct children of the node being rebuilt (so no
 * wrapper that holds a control is thrown away) and the old and new templates
 * have the same kept nodes in the same order. Otherwise it gives up (returns
 * false, and changes nothing); the caller then re-renders.
 *
 * Only the parts that differ between the two templates are touched, so state
 * that the component set on the live nodes (classes, `hidden`, aria state)
 * stays. Slots and nested custom elements are compared by their attributes
 * only. Moving a focused node drops focus; the caller restores it.
 */

export class WRenderPatch {
  static keptSelector = 'a, button, input, select, textarea, slot, [tabindex], [contenteditable]';

  static patchedAttributes = new Set([
    'hint', 'error', 'label', 'placeholder', 'messages', 'error-messages', 'counter', 'persistent-hint',
    'disabled', 'readonly',
  ]);

  static stateAttributes = new Set(['disabled', 'readonly']);

  static applies(name) {
    return WRenderPatch.patchedAttributes.has(name);
  }

  // `_events()` must run again after these: components bind or skip
  // listeners by them.
  static changesState(name) {
    return WRenderPatch.stateAttributes.has(name);
  }

  static apply(host, before, after) {
    if (before === after) return true;
    const changes = [];
    const parsed = WRenderPatch._collectChildren(host, WRenderPatch._parse(before), WRenderPatch._parse(after), changes);
    if (!parsed) return false;
    changes.forEach((change) => change());
    return true;
  }

  static _parse(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
  }

  // Changes for the children are kept only when every child could be
  // patched; otherwise plain nodes are inserted or removed around the
  // matching ones, and as a last step the child list is rebuilt.
  static _collectChildren(live, before, after, changes) {
    const steps = [WRenderPatch._collectEachChild, WRenderPatch._collectAligned, WRenderPatch._collectRebuild];
    return steps.some((step) => WRenderPatch._tryStep(step, [live, before, after], changes));
  }

  static _tryStep(step, nodes, changes) {
    const local = [];
    if (!step(nodes[0], nodes[1], nodes[2], local)) return false;
    changes.push(...local);
    return true;
  }

  static _collectEachChild(live, before, after, changes) {
    const count = before.childNodes.length;
    if (after.childNodes.length !== count || live.childNodes.length !== count) return false;
    for (let index = 0; index < count; index += 1) {
      const nodes = [live.childNodes[index], before.childNodes[index], after.childNodes[index]];
      if (!WRenderPatch._collectNode(nodes, changes)) return false;
    }
    return true;
  }

  static _collectNode([live, before, after], changes) {
    if (before.isEqualNode(after)) return true;
    if (!WRenderPatch._sameKind(live, before) || !WRenderPatch._sameKind(before, after)) return false;
    if (before.nodeType !== Node.ELEMENT_NODE) {
      changes.push(() => { live.data = after.data; });
      return true;
    }
    WRenderPatch._collectAttributes(live, before, after, changes);
    if (before.localName === 'textarea') return WRenderPatch._collectDefaultText(live, before, after, changes);
    if (WRenderPatch._isOpaque(before)) return before.innerHTML === after.innerHTML;
    return WRenderPatch._collectChildren(live, before, after, changes);
  }

  // Matches old and new children in order (longest common run of the same
  // tag and first class). Matched nodes stay where they are and are patched;
  // the others are added or removed, which is allowed only for nodes that
  // hold no kept node.
  static _collectAligned(live, before, after, changes) {
    const liveNodes = Array.from(live.childNodes);
    const oldNodes = Array.from(before.childNodes);
    const newNodes = Array.from(after.childNodes);
    if (liveNodes.length !== oldNodes.length) return false;
    const pairs = WRenderPatch._align(oldNodes, newNodes);
    if (!WRenderPatch._unmatchedArePlain(liveNodes, pairs.map((pair) => pair[0]))) return false;
    if (!WRenderPatch._unmatchedArePlain(newNodes, pairs.map((pair) => pair[1]))) return false;
    if (!pairs.every(([oldIndex, newIndex]) => WRenderPatch._collectNode([liveNodes[oldIndex], oldNodes[oldIndex], newNodes[newIndex]], changes))) return false;
    changes.push(() => WRenderPatch._applyAligned(live, liveNodes, newNodes, pairs));
    return true;
  }

  static _unmatchedArePlain(nodes, matched) {
    return nodes.every((node, index) => matched.includes(index) || !WRenderPatch._holdsKept(node));
  }

  static _holdsKept(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    return WRenderPatch._isKept(node) || WRenderPatch._keptNodes(node).length > 0;
  }

  static _applyAligned(live, liveNodes, newNodes, pairs) {
    const kept = new Map(pairs.map(([oldIndex, newIndex]) => [newIndex, liveNodes[oldIndex]]));
    const stay = new Set(kept.values());
    liveNodes.filter((node) => !stay.has(node)).forEach((node) => node.remove());
    let cursor = live.firstChild;
    newNodes.forEach((node, index) => {
      const next = kept.get(index) || document.importNode(node, true);
      if (next === cursor) cursor = cursor.nextSibling;
      else live.insertBefore(next, cursor);
    });
  }

  // Longest common subsequence of node signatures; returns [oldIndex, newIndex] pairs in order.
  static _align(oldNodes, newNodes) {
    const table = WRenderPatch._lcsTable(oldNodes.map(WRenderPatch._signature), newNodes.map(WRenderPatch._signature));
    const pairs = [];
    let oldIndex = oldNodes.length;
    let newIndex = newNodes.length;
    while (oldIndex > 0 && newIndex > 0) {
      const step = WRenderPatch._lcsStep(table, oldNodes, newNodes, [oldIndex, newIndex]);
      if (step === 'match') pairs.unshift([oldIndex - 1, newIndex - 1]);
      if (step !== 'new') oldIndex -= 1;
      if (step !== 'old') newIndex -= 1;
    }
    return pairs;
  }

  static _lcsStep(table, oldNodes, newNodes, [oldIndex, newIndex]) {
    if (WRenderPatch._signature(oldNodes[oldIndex - 1]) === WRenderPatch._signature(newNodes[newIndex - 1])) return 'match';
    return table[oldIndex - 1][newIndex] >= table[oldIndex][newIndex - 1] ? 'old' : 'new';
  }

  static _lcsTable(first, second) {
    const table = Array.from({ length: first.length + 1 }, () => new Array(second.length + 1).fill(0));
    for (let row = 1; row <= first.length; row += 1) {
      for (let column = 1; column <= second.length; column += 1) {
        table[row][column] = WRenderPatch._lcsCell(table, first[row - 1] === second[column - 1], row, column);
      }
    }
    return table;
  }

  static _lcsCell(table, same, row, column) {
    if (same) return table[row - 1][column - 1] + 1;
    return Math.max(table[row - 1][column], table[row][column - 1]);
  }

  static _signature(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return '#' + node.nodeType;
    return node.localName + '.' + WRenderPatch._words(node.getAttribute('class'))[0];
  }

  static _collectRebuild(live, before, after, changes) {
    const kept = WRenderPatch._keptNodes(live);
    if (kept.some((node) => node.parentNode !== live)) return false;
    const oldKept = WRenderPatch._keptNodes(before);
    const newKept = WRenderPatch._keptNodes(after);
    if (!WRenderPatch._sameKeys(kept, oldKept) || !WRenderPatch._sameKeys(oldKept, newKept)) return false;
    const local = [];
    if (!WRenderPatch._collectKept(kept, oldKept, newKept, local)) return false;
    changes.push(...local);
    changes.push(() => WRenderPatch._rebuild(live, after, kept));
    return true;
  }

  static _collectKept(kept, oldKept, newKept, changes) {
    for (let index = 0; index < kept.length; index += 1) {
      const nodes = [kept[index], oldKept[index], newKept[index]];
      if (!WRenderPatch._collectNode(nodes, changes)) return false;
    }
    return true;
  }

  static _rebuild(live, after, kept) {
    const copy = document.createDocumentFragment();
    Array.from(after.childNodes).forEach((node) => copy.appendChild(document.importNode(node, true)));
    WRenderPatch._keptNodes(copy).forEach((node, index) => node.replaceWith(kept[index]));
    live.replaceChildren(copy);
  }

  // The outermost kept elements under `root`, in document order.
  static _keptNodes(root) {
    const kept = Array.from(root.querySelectorAll('*')).filter((element) => WRenderPatch._isKept(element));
    return kept.filter((element) => !WRenderPatch._hasKeptAncestor(element, root));
  }

  static _isKept(element) {
    return element.localName.includes('-') || element.matches(WRenderPatch.keptSelector);
  }

  static _hasKeptAncestor(element, root) {
    for (let parent = element.parentNode; parent && parent !== root; parent = parent.parentNode) {
      if (WRenderPatch._isKept(parent)) return true;
    }
    return false;
  }

  static _sameKeys(first, second) {
    if (first.length !== second.length) return false;
    return first.every((element, index) => WRenderPatch._key(element) === WRenderPatch._key(second[index]));
  }

  static _key(element) {
    return [element.localName, element.getAttribute('type'), element.getAttribute('name'), element.getAttribute('role')].join('|');
  }

  // A textarea's text is its default value; the value the user typed stays.
  static _collectDefaultText(live, before, after, changes) {
    if (before.textContent !== after.textContent) changes.push(() => { live.defaultValue = after.textContent; });
    return true;
  }

  static _sameKind(first, second) {
    return first.nodeType === second.nodeType && first.nodeName === second.nodeName;
  }

  static _isOpaque(element) {
    return element.localName === 'slot' || element.localName.includes('-');
  }

  static _collectAttributes(live, before, after, changes) {
    const names = new Set(before.getAttributeNames().concat(after.getAttributeNames()));
    names.forEach((name) => {
      const oldValue = before.getAttribute(name);
      const newValue = after.getAttribute(name);
      if (oldValue === newValue) return;
      changes.push(() => WRenderPatch._setAttribute(live, name, oldValue, newValue));
    });
  }

  static _setAttribute(live, name, oldValue, newValue) {
    if (name === 'class') {
      WRenderPatch._setClasses(live, oldValue, newValue);
      return;
    }
    if (newValue === null) live.removeAttribute(name);
    else live.setAttribute(name, newValue);
  }

  // Only the classes the template added or dropped change; classes the
  // component added at run time stay.
  static _setClasses(live, oldValue, newValue) {
    const oldNames = WRenderPatch._words(oldValue);
    const newNames = WRenderPatch._words(newValue);
    oldNames.filter((name) => !newNames.includes(name)).forEach((name) => live.classList.remove(name));
    newNames.forEach((name) => live.classList.add(name));
  }

  static _words(value) {
    return String(value || '').split(/\s+/).filter(Boolean);
  }
}
