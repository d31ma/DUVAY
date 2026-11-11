/* <w-hover-card> - hover and focus preview
 *
 * Attributes:
 *   open        - visible state
 *   side        - top | bottom (default top)
 *   inline      - the content flows below the trigger instead of floating
 *   interactive - the content is a non-modal dialog that may hold buttons and
 *                 links. Turned on automatically when the content slot holds a
 *                 focusable element. Without it the content is a tooltip.
 *   aria-label  - accessible name for the content. In interactive mode the
 *                 trigger names the dialog when this is not set.
 *
 * Behaviour:
 *   Pointer hover and keyboard focus open the card. Moving the pointer from
 *   the trigger onto the card keeps it open. Escape closes it from anywhere;
 *   when focus was inside the card it returns to the trigger.
 *   Interactive mode also opens on click, and the trigger (the first focusable
 *   element in the default slot, or the trigger wrapper as a button) gets
 *   aria-haspopup="dialog", aria-expanded and aria-controls. The closed card
 *   is inert, so Tab never reaches hidden buttons.
 *
 * Slots:
 *   default - the trigger
 *   content - the card
 */

export class WHoverCard extends WElement {
  static attrs = ['open', 'side', 'inline', 'interactive'];
  static focusable = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  static closeDelay = 150;

  get open() { return this._bool('open'); }
  get side() { return this._attr('side', 'top'); }
  get inline() { return this._bool('inline'); }
  get interactive() { return this._bool('interactive') || this._contentHasFocusable(); }

  _template() {
    if (!this._id) this._id = 'w-hover-card-' + Math.random().toString(36).slice(2, 8);
    const classes = [
      'w-hover-card',
      `w-hover-card--${this.side}`,
      this.open ? 'open' : '',
      this.inline ? 'w-hover-card--inline' : '',
    ].filter(Boolean).map((name) => this._esc(name)).join(' ');

    return `<span class="${classes}">
      <span class="w-hover-card-trigger" id="${this._id}-trigger" tabindex="0"><slot></slot></span>
      <span class="w-hover-card-content" id="${this._id}-content"${this._contentRole()}><slot name="content"></slot></span>
    </span>`;
  }

  _contentRole() {
    if (!this.interactive) return ' role="tooltip"' + this._tooltipName();
    const closed = this.open ? '' : ' inert';
    return ` role="dialog" aria-modal="false"${this._dialogName()}${closed}`;
  }

  /* A tooltip normally takes its name from its own visible content. This lets
   * the host name it explicitly, which is the only option when the content is
   * an icon, a chart, or anything else with no text of its own. */
  _tooltipName() {
    const name = this.getAttribute('aria-label');
    return name ? ` aria-label="${this._esc(name)}"` : '';
  }

  _dialogName() {
    const name = this.getAttribute('aria-label');
    return name ? ` aria-label="${this._esc(name)}"` : ` aria-labelledby="${this._id}-trigger"`;
  }

  _contentHasFocusable() {
    const selector = this.constructor.focusable;
    return !!this.querySelector(`[slot="content"]:is(${selector}), [slot="content"] :is(${selector})`);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.__wDocumentEvents) return;
    this.__wDocumentEvents = {
      keydown: (event) => this._onDocumentKeydown(event),
      pointerdown: (event) => this._onDocumentPointer(event),
    };
    document.addEventListener('keydown', this.__wDocumentEvents.keydown);
    document.addEventListener('pointerdown', this.__wDocumentEvents.pointerdown);
  }

  disconnectedCallback() {
    clearTimeout(this.__wCloseTimer);
    if (!this.__wDocumentEvents) return;
    document.removeEventListener('keydown', this.__wDocumentEvents.keydown);
    document.removeEventListener('pointerdown', this.__wDocumentEvents.pointerdown);
    this.__wDocumentEvents = null;
  }

  _events() {
    this.__wControl = this.interactive ? this._wireTrigger() : null;
    if (this.__wHoverCardEvents) return;
    this.__wHoverCardEvents = true;
    this.addEventListener('mouseenter', () => this._onPointerEnter());
    this.addEventListener('mouseleave', () => this._onPointerLeave());
    this.addEventListener('focusin', () => this._onFocusIn());
    this.addEventListener('focusout', (event) => this._onFocusOut(event));
    this.addEventListener('click', (event) => this._onClick(event));
  }

  /* The ARIA goes on the element that takes focus: a slotted button or link
   * when there is one, otherwise the wrapper acting as a button. */
  _wireTrigger() {
    const trigger = this._trigger();
    const control = trigger.querySelector(this.constructor.focusable) || trigger;
    this._setTriggerRole(trigger, control);
    control.setAttribute('aria-haspopup', 'dialog');
    control.setAttribute('aria-controls', this._id + '-content');
    control.setAttribute('aria-expanded', String(this.open));
    return control;
  }

  _setTriggerRole(trigger, control) {
    if (control === trigger) trigger.setAttribute('role', 'button');
    else trigger.removeAttribute('tabindex');
  }

  _trigger() {
    return this._q(':scope > .w-hover-card > .w-hover-card-trigger');
  }

  _content() {
    return this._q(':scope > .w-hover-card > .w-hover-card-content');
  }

  _onPointerEnter() {
    clearTimeout(this.__wCloseTimer);
    this._setOpen(true);
  }

  _onPointerLeave() {
    clearTimeout(this.__wCloseTimer);
    this.__wCloseTimer = setTimeout(() => this._closeUnlessFocused(), this.constructor.closeDelay);
  }

  _closeUnlessFocused() {
    if (this.contains(document.activeElement)) return;
    this._setOpen(false);
  }

  _onFocusIn() {
    if (this.__wQuietFocus) return;
    this._setOpen(true);
  }

  _onFocusOut(event) {
    if (this.contains(event.relatedTarget)) return;
    this._setOpen(false);
  }

  _onClick(event) {
    if (!this.__wControl) return;
    if (this._trigger()?.contains(event.target)) this._setOpen(true);
  }

  _onDocumentPointer(event) {
    if (!this.open || this.contains(event.target)) return;
    this._setOpen(false);
  }

  _onDocumentKeydown(event) {
    if (event.key !== 'Escape' || !this.open) return;
    const focusInCard = !!this._content()?.contains(document.activeElement);
    this._setOpen(false);
    if (focusInCard) this._returnFocus();
  }

  _returnFocus() {
    this.__wQuietFocus = true;
    (this.__wControl || this._trigger())?.focus();
    this.__wQuietFocus = false;
  }

  /* Open and close without re-rendering, so focus inside the card survives. */
  _setOpen(open) {
    if (open === this.open) return;
    this._silentSet('open', open);
    this._q(':scope > .w-hover-card')?.classList.toggle('open', open);
    this.__wControl?.setAttribute('aria-expanded', String(open));
    if (this.__wControl) this._content()?.toggleAttribute('inert', !open);
  }
}

if (!customElements.get('w-hover-card')) {
  customElements.define('w-hover-card', WHoverCard);
}
