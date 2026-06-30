/* <w-tooltip> - Vuetify-style tooltip primitive */

class WTooltip extends WElement {
  static attrs = [
    'open',
    'model-value',
    'tooltip-id',
    'text',
    'position',
    'location',
    'color',
    'offset',
    'open-delay',
    'close-delay',
    'open-on-click',
    'open-on-hover',
    'open-on-focus',
    'interactive',
    'target',
    'content-class',
    'disabled',
    'close-on-content-click',
  ];

  constructor() {
    super();
    this.__wUid = 'w-tooltip-' + Math.random().toString(36).slice(2, 9);
    this.__wCursor = null;
  }

  get open() { return this._bool('open'); }
  get text() { return this._attr('text', ''); }
  get tooltipId() { return this._attr('tooltip-id', this.id ? this.id + '-content' : this.__wUid); }
  get location() { return this._attr('location', this._attr('position', 'top')); }
  get color() { return this._attr('color', ''); }
  get offset() { return this._attr('offset', '0.625rem'); }
  get openDelay() { return this._numberAttr('open-delay', 0); }
  get closeDelay() { return this._numberAttr('close-delay', 0); }
  get openOnClick() { return this._enabledAttr('open-on-click', false); }
  get openOnHover() { return this._enabledAttr('open-on-hover', true); }
  get openOnFocus() { return this._enabledAttr('open-on-focus', !this.openOnClick); }
  get interactive() { return this._enabledAttr('interactive', false); }
  get disabled() { return this._enabledAttr('disabled', false); }
  get cursorTarget() { return this._attr('target', '') === 'cursor'; }
  get closeOnContentClick() { return this._enabledAttr('close-on-content-click', false); }
  get contentClass() { return this._attr('content-class', ''); }

  _render() {
    const children = this._takeChildren();
    const activatorChildren = children.activator.length ? children.activator : children.default;
    const hasContent = children.content.length > 0;

    this.innerHTML = this._shellTemplate(this._hasFocusableNodes(activatorChildren), hasContent);

    const activator = this._q('.w-tooltip-activator');
    const content = this._q('.w-tooltip-content');
    activatorChildren.forEach((node) => {
      this._normalizeSlotNode(node, 'activator');
      activator.appendChild(node);
    });
    if (hasContent) {
      children.content.forEach((node) => {
        this._normalizeSlotNode(node, 'content');
        content.appendChild(node);
      });
    }

    if (this.open && this.cursorTarget && !this.__wCursor) this._rememberCursor();
  }

  _shellTemplate(hasFocusableActivator, hasContent) {
    const location = this._classToken(this.location);
    const classes = [
      'w-tooltip',
      'w-tooltip--' + location,
      this.open ? 'open w-tooltip--open' : '',
      this.interactive ? 'w-tooltip--interactive' : '',
      this.cursorTarget ? 'w-tooltip--target-cursor' : '',
      this.cursorTarget && this.__wCursor ? 'w-tooltip--cursor-ready' : '',
      this.disabled ? 'w-tooltip--disabled' : '',
    ].filter(Boolean).join(' ');
    const triggerAttrs = [
      'class="w-tooltip-activator"',
      `aria-describedby="${this._esc(this.tooltipId)}"`,
      this.disabled ? 'aria-disabled="true"' : '',
      hasFocusableActivator ? '' : 'tabindex="0"',
    ].filter(Boolean).join(' ');
    const contentClass = ['w-tooltip-content', this.contentClass].filter(Boolean).join(' ');
    const fallback = hasContent ? '' : `<span data-w-tooltip-generated>${this._esc(this.text)}</span>`;

    return `<span class="${this._esc(classes)}"${this._style()}>
      <span ${triggerAttrs}></span>
      <span id="${this._esc(this.tooltipId)}" class="${this._esc(contentClass)}" role="tooltip"${this.open ? '' : ' hidden'}>${fallback}</span>
    </span>`;
  }

  _events() {
    const root = this._q('.w-tooltip');
    const trigger = this._q('.w-tooltip-activator');
    const content = this._q('.w-tooltip-content');
    if (!root || !trigger || this.disabled) return;

    if (this.openOnHover) {
      root.addEventListener('mouseenter', (event) => this._show('hover', event));
      root.addEventListener('mouseleave', () => this._hide('hover'));
      root.addEventListener('pointermove', (event) => this._rememberCursor(event));
    }

    if (this.openOnFocus) {
      root.addEventListener('focusin', (event) => this._show('focus', event));
      root.addEventListener('focusout', (event) => {
        if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
        this._hide('focus');
      });
    }

    if (this.openOnClick) {
      trigger.addEventListener('click', (event) => {
        this._rememberCursor(event);
        this.open ? this._hide('click') : this._show('click', event);
      });
      trigger.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        this.open ? this._hide('keyboard') : this._show('keyboard', event);
      });
    }

    if (content && this.closeOnContentClick) {
      content.addEventListener('click', () => this._hide('content'));
    }

    if (!this.__wTooltipKeydown) {
      this.__wTooltipKeydown = (event) => {
        if (event.key === 'Escape' && this.open) this._hide('escape');
      };
      document.addEventListener('keydown', this.__wTooltipKeydown);
    }
  }

  disconnectedCallback() {
    if (this.__wTooltipKeydown) document.removeEventListener('keydown', this.__wTooltipKeydown);
    this._clearTimers();
  }

  show() { this._show('programmatic'); }
  close() { this._hide('programmatic'); }

  _show(reason, event) {
    if (this.disabled) return;
    if (event) this._rememberCursor(event);
    this._clearTimers();
    this.__wOpenTimer = setTimeout(() => this._setOpen(true, reason), this.openDelay);
  }

  _hide(reason) {
    this._clearTimers();
    this.__wCloseTimer = setTimeout(() => this._setOpen(false, reason), this.closeDelay);
  }

  _setOpen(open, reason) {
    if (open === this.open) return;
    this._silentSet('open', open ? '' : null);
    this._silentSet('model-value', open ? 'true' : 'false');
    this._render();
    this._events();
    this._dispatch('update:model-value', { value: open });
    this._dispatch(open ? 'w-open' : 'w-close', { reason });
  }

  _style() {
    const styles = [];
    if (this.offset) styles.push('--w-tooltip-offset: ' + this._cssValue(this.offset));
    if (this.color) {
      const token = this._classToken(this.color);
      styles.push('--w-tooltip-bg: var(--w-' + token + ', ' + this._esc(this.color) + ')');
      styles.push('--w-tooltip-fg: var(--w-on-' + token + ', var(--w-inverse-on-surface))');
    }
    if (this.cursorTarget && this.__wCursor) {
      styles.push('--w-tooltip-cursor-x: ' + Math.round(this.__wCursor.x || 0) + 'px');
      styles.push('--w-tooltip-cursor-y: ' + Math.round(this.__wCursor.y || 0) + 'px');
    }
    return styles.length ? ` style="${styles.join('; ')}"` : '';
  }

  _rememberCursor(event) {
    let x = typeof event?.clientX === 'number' ? event.clientX : null;
    let y = typeof event?.clientY === 'number' ? event.clientY : null;
    if (x === null || y === null) {
      const activator = this._q('.w-tooltip-activator');
      const rect = activator?.getBoundingClientRect?.();
      if (!rect) return;
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    this.__wCursor = { x, y };
    const root = this._q('.w-tooltip');
    if (!root || !this.cursorTarget) return;
    root.classList.add('w-tooltip--cursor-ready');
    root.style.setProperty('--w-tooltip-cursor-x', Math.round(x) + 'px');
    root.style.setProperty('--w-tooltip-cursor-y', Math.round(y) + 'px');
  }

  _clearTimers() {
    clearTimeout(this.__wOpenTimer);
    clearTimeout(this.__wCloseTimer);
  }

  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  _enabledAttr(name, fallback) {
    if (!this.hasAttribute(name)) return fallback;
    const value = String(this.getAttribute(name) || '').trim().toLowerCase();
    return !['false', '0', 'off', 'no'].includes(value);
  }

  _numberAttr(name, fallback) {
    const value = Number(this.getAttribute(name));
    return Number.isFinite(value) && value >= 0 ? value : fallback;
  }

  _cssValue(value) {
    const raw = String(value || '').trim();
    if (/^-?\d+(\.\d+)?$/.test(raw)) return raw + 'px';
    return this._esc(raw);
  }

  _classToken(value) {
    return String(value || '').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'top';
  }

  _takeChildren() {
    const groups = { activator: [], content: [], default: [] };
    if (this._rendered) {
      const activator = this._q('.w-tooltip-activator');
      const content = this._q('.w-tooltip-content');
      if (activator) {
        Array.from(activator.childNodes).forEach((node) => {
          const slot = this._nodeSlot(node);
          if (slot === 'activator') groups.activator.push(node);
          else groups.default.push(node);
        });
      }
      if (content) {
        Array.from(content.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-w-tooltip-generated')) return;
          groups.content.push(node);
        });
      }
      return groups;
    }

    Array.from(this.childNodes).forEach((node) => {
      const slot = this._nodeSlot(node);
      if (slot === 'activator') groups.activator.push(node);
      else if (slot === 'content') groups.content.push(node);
      else groups.default.push(node);
    });
    return groups;
  }

  _nodeSlot(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    return node.getAttribute('data-w-slot') || node.getAttribute('slot');
  }

  _normalizeSlotNode(node, slot) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.getAttribute('slot') === slot) {
      node.setAttribute('data-w-slot', slot);
      node.removeAttribute('slot');
    }
  }

  _hasFocusableNodes(nodes) {
    return nodes.some((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      if (node.matches('button, a[href], input, select, textarea, w-btn, [tabindex], [slot="activator"]')) return true;
      return !!node.querySelector('button, a[href], input, select, textarea, w-btn, [tabindex]');
    });
  }
}

if (!customElements.get('w-tooltip')) customElements.define('w-tooltip', WTooltip);
