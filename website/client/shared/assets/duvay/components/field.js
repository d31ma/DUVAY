/* <w-field> — the field shell around any control, mirroring Vuetify's <v-field>.
 *
 * Wraps slotted content (a native input, a <w-input>, anything focusable) in the
 * DuVay `.w-field` chrome: label, inner icons, clear button, and hint / error
 * text, plus the accessibility wiring between them.
 *
 * Attributes:
 *   label              - label text above (or, with single-line, inside) the control
 *   label-id           - explicit DOM id for the label, for custom `aria-labelledby`
 *   hint               - helper text below the control
 *   error              - error text; also puts the field in the error state
 *   variant            - outlined | filled | underlined | plain | solo |
 *                        solo-inverted | solo-filled
 *   flat               - drop the elevation of the solo variants
 *   reverse            - reverse the order of the control row
 *   active             - keep the control highlighted regardless of focus
 *   dirty              - manually apply the dirty (has-value) styling
 *   glow               - inner icons go full opacity + accent while focused
 *   icon-color         - color for the inner icons
 *   center-affix       - vertically centre the icons and the clear button
 *   single-line        - the label collapses into the control's placeholder
 *   details            - generate `aria-describedby` from the hint / error text
 *                        (on by default; set details="false" to opt out)
 *   prepend-inner-icon / append-inner-icon - icons inside the control row
 *   clearable          - show a clear button once the control has a value
 *   clear-icon         - icon used by that button
 *   persistent-clear   - keep the clear button visible while the control is dirty
 *
 * Events:
 *   clear - the clear button emptied the slotted control (detail: { value: '' })
 */

// The `w-field--*` surface modifiers are the framework's shared field
// vocabulary (see selects.css); <w-select>, <w-combobox>, <w-file-input> and
// <w-file-upload> already emit them through these helpers, so <w-field> reuses
// them rather than inventing a second set of names.
import WIcons from '../icons.js';
import { wFieldClasses, wIconHtml, wSafeColor } from './file-input.js';
import { wBoolAttr } from './utils.js';

let fieldUid = 0;

export class WField extends WElement {
  static attrs = [
    'label', 'hint', 'error', 'label-id', 'variant', 'flat', 'reverse', 'active',
    'dirty', 'glow', 'icon-color', 'center-affix', 'single-line', 'details',
    'prepend-inner-icon', 'append-inner-icon', 'clearable', 'clear-icon',
    'persistent-clear',
  ];

  get label() { return this._attr('label', ''); }
  get hint() { return this._attr('hint', ''); }
  get error() { return this._attr('error', ''); }
  get variant() { return this._attr('variant', ''); }
  get singleLine() { return this._bool('single-line'); }
  get clearable() { return this._bool('clearable'); }
  get clearIcon() { return this._attr('clear-icon', ''); }
  get iconColor() { return this._attr('icon-color', ''); }
  get labelId() { return this._attr('label-id', '') || this._uid() + '-label'; }

  // `details` is on by default — the field describes its control unless the
  // author explicitly opts out with details="false".
  get details() { return wBoolAttr(this, 'details', true); }

  _uid() {
    if (!this.__uid) this.__uid = 'w-field-' + (++fieldUid);
    return this.__uid;
  }

  /* ── Template ─────────────────────────────────────────────────────────── */

  _template() {
    return `<label class="w-field${this._classes()}"${this._rootStyle()}>
      ${this._labelHtml()}
      <span class="${this._controlClasses()}">
        ${this._iconHtml('prepend-inner')}
        <slot></slot>
        ${this._clearHtml()}
        ${this._iconHtml('append-inner')}
      </span>
      ${this._messagesHtml()}
    </label>`;
  }

  // Only the state classes live on the outer element; everything that describes
  // the *control* rides the control row, which is what the shared `w-field--*`
  // rules are written against.
  _classes() {
    return this._cls({ error: this.error, 'w-field-error': this.error });
  }

  _controlClasses() {
    const dirty = this._cls({ 'w-field--dirty': this._bool('dirty') });
    return 'w-field-control ' + wFieldClasses(this).join(' ') + dirty;
  }

  _rootStyle() {
    const color = wSafeColor(this.iconColor);
    return color ? ` style="--w-field-icon-color:${color}"` : '';
  }

  _labelHtml() {
    if (!this.label || this.singleLine) return '';
    return `<span class="w-label" id="${this._esc(this.labelId)}">${this._esc(this.label)}</span>`;
  }

  _iconHtml(side) {
    const icon = wIconHtml(this, side + '-icon', 'w-field-icon');
    return icon ? `<span class="w-field-${side}">${icon}</span>` : '';
  }

  _clearHtml() {
    if (!this.clearable) return '';
    const glyph = this.clearIcon ? WIcons.resolve(this.clearIcon, { iconClass: 'w-icon w-field-icon' }) : '&times;';
    return `<button type="button" class="w-field-clear" tabindex="-1" aria-label="Clear">${glyph}</button>`;
  }

  _messagesId() { return this._uid() + '-messages'; }

  _messagesHtml() {
    const text = this.error || this.hint;
    if (!text) return '';
    return `<span class="w-messages" id="${this._messagesId()}">${this._esc(text)}</span>`;
  }

  /* ── Wiring to the slotted control ────────────────────────────────────── */

  _control() {
    return this._q('.w-field-control input, .w-field-control textarea, .w-field-control select');
  }

  _events() {
    const control = this._control();
    if (!control) return;
    this._applyLabel(control);
    this._applyDescribedBy(control);
    this._bindClear(control);
  }

  // A floated label names the control through aria-labelledby; a single-line
  // field folds the label into the placeholder instead.
  _applyLabel(control) {
    if (!this.label) return;
    if (!this.singleLine) return control.setAttribute('aria-labelledby', this.labelId);
    control.setAttribute('aria-label', this.label);
    if (!control.getAttribute('placeholder')) control.setAttribute('placeholder', this.label);
  }

  _applyDescribedBy(control) {
    const messages = this._q('.w-messages');
    if (!messages || !this.details) return control.removeAttribute('aria-describedby');
    control.setAttribute('aria-describedby', messages.id);
    if (this.error) control.setAttribute('aria-invalid', 'true');
  }

  _bindClear(control) {
    const button = this._q('.w-field-clear');
    if (!button) return;
    const sync = () => button.classList.toggle('w-field-clear--visible', control.value !== '');
    // The control survives re-renders (it is slotted), so drop the previous
    // closure before binding the one that knows about the new button.
    if (this.__wClearSync) control.removeEventListener('input', this.__wClearSync);
    this.__wClearSync = sync;
    control.addEventListener('input', sync);
    button.addEventListener('click', () => this._clear(control, sync));
    sync();
  }

  _clear(control, sync) {
    control.value = '';
    sync();
    control.focus();
    control.dispatchEvent(new Event('input', { bubbles: true }));
    this._emit('clear', { value: '' });
  }
}

if (!customElements.get('w-field')) customElements.define('w-field', WField);
