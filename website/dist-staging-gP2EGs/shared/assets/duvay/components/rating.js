/* <w-rating> — accessible rating input with whole and half increments.
 *
 * Attributes:
 *   value                - selected numeric value
 *   length               - number of rating items (default: 5)
 *   half-increments      - expose half-step controls
 *   clearable            - selecting the current value clears it
 *   hover                - preview values while pointing at an item
 *   readonly / disabled  - block changes while preserving readable state
 *   name                 - hidden form input name
 *   label                - radiogroup accessible label
 *   item-aria-label      - item label template with {value} and {length}
 *   item-labels          - JSON array of labels
 *   item-label-position  - top | bottom
 *   empty-icon/full-icon - icon registry name or text glyph
 *   color/active-color   - DuVay color token or safe CSS color
 *   density              - default | comfortable | compact
 *   size                 - xs | sm | md | lg | xl | CSS length
 *   ripple               - enable press feedback
 *   tag                  - div | span | section
 *   theme                - theme name forwarded to the rendered root
 *
 * Slots:
 *   item       - custom icon markup; cloned for empty and filled layers
 *   item-label - custom label markup; supports {{label}}, {{value}}, {{index}}
 *
 * Events:
 *   change
 */

import WIcons from '../icons.js';

const DEFAULT_EMPTY_ICON = `
  <svg class="w-rating__svg" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 3.7 2.47 5.01 5.53.8-4 3.9.94 5.51L12 16.32l-4.94 2.6.94-5.51-4-3.9 5.53-.8L12 3.7Z"></path>
  </svg>`;

const DEFAULT_FULL_ICON = `
  <svg class="w-rating__svg" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 2.5 2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55-4.76-4.64 6.58-.96L12 2.5Z"></path>
  </svg>`;

const SIZE_VALUES = {
  xs: '1rem',
  'x-small': '1rem',
  sm: '1.25rem',
  small: '1.25rem',
  md: '1.5rem',
  default: '1.5rem',
  lg: '32px',
  large: '32px',
  xl: '2.5rem',
  'x-large': '2.5rem',
};

const TOKEN_COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  danger: 'error',
  error: 'error',
  info: 'primary',
  muted: 'text-subtle',
  text: 'text',
  divider: 'divider',
};

export class WRating extends WElement {
  static attrs = [
    'value',
    'name',
    'length',
    'label',
    'item-aria-label',
    'item-labels',
    'item-label-position',
    'empty-icon',
    'full-icon',
    'half-increments',
    'clearable',
    'hover',
    'readonly',
    'disabled',
    'ripple',
    'size',
    'density',
    'tag',
    'theme',
    'color',
    'active-color',
  ];

  get value() {
    return this._clamp(this._number(this._attr('value', '0'), 0));
  }

  set value(nextValue) {
    const value = this._formatValue(this._quantize(this._clamp(nextValue)));
    this.setAttribute('value', value);
  }

  get length() {
    return Math.min(100, Math.max(1, Math.floor(this._number(this._attr('length', '5'), 5))));
  }

  get readonly() {
    return this._bool('readonly');
  }

  get disabled() {
    return this._bool('disabled');
  }

  get halfIncrements() {
    return this._bool('half-increments');
  }

  get label() {
    return this._attr('label', 'Rating');
  }

  _template() {
    const selectedValue = this.value;
    const tag = this._tagName();
    const itemLabels = this._itemLabels();
    const itemSlot = this._slotSource('item');
    const itemLabelSlot = this._slotSource('item-label');
    const density = this._density();
    const labelPosition = this._labelPosition();
    const classes = [
      'w-rating',
      `w-rating--density-${density}`,
      `w-rating--labels-${labelPosition}`,
      this.halfIncrements ? 'w-rating--half-increments' : '',
      this._bool('hover') ? 'w-rating--hover' : '',
      this._bool('ripple') ? 'w-rating--ripple' : '',
      this.readonly ? 'w-rating--readonly' : '',
      this.disabled ? 'w-rating--disabled' : '',
    ].filter(Boolean).join(' ');
    const style = [
      `--w-rating-size:${this._sizeValue()}`,
      `--w-rating-color:${this._colorValue(this._attr('color', ''), 'var(--w-divider)')}`,
      `--w-rating-active-color:${this._colorValue(this._attr('active-color', '') || this._attr('color', ''), 'var(--w-warning)')}`,
    ].join(';');
    const theme = this._attr('theme', '');
    const rootState = [
      `class="${classes}"`,
      `style="${this._esc(style)}"`,
      'role="radiogroup"',
      `aria-label="${this._esc(this.label)}"`,
      this.readonly ? 'aria-readonly="true"' : '',
      this.disabled ? 'aria-disabled="true"' : '',
      theme ? `data-w-theme="${this._esc(theme)}"` : '',
      `data-value="${this._formatValue(selectedValue)}"`,
    ].filter(Boolean).join(' ');

    let items = '';
    for (let index = 1; index <= this.length; index += 1) {
      items += this._itemTemplate({
        index,
        selectedValue,
        label: itemLabels[index - 1],
        itemSlot,
        itemLabelSlot,
      });
    }

    const inputName = this._attr('name', '');
    return `
      <${tag} ${rootState}>
        <span class="w-rating__items">${items}</span>
        <input
          class="w-rating__input"
          type="hidden"
          ${inputName ? `name="${this._esc(inputName)}"` : ''}
          value="${this._formatValue(selectedValue)}"
        >
        <span class="w-rating__slot-store" hidden aria-hidden="true">
          <slot name="item"></slot>
          <slot name="item-label"></slot>
        </span>
      </${tag}>`;
  }

  _itemTemplate({ index, selectedValue, label, itemSlot, itemLabelSlot }) {
    const fill = this._fillFor(index, selectedValue);
    const state = this._stateFor(fill);
    const controls = this.halfIncrements
      ? `${this._controlTemplate(index - 0.5, selectedValue, 'start')}
         ${this._controlTemplate(index, selectedValue, 'end')}`
      : this._controlTemplate(index, selectedValue, 'full');
    const iconData = {
      index,
      value: index,
      label: label ?? '',
      state,
      length: this.length,
    };
    const emptyIcon = itemSlot
      ? this._interpolate(itemSlot, { ...iconData, layer: 'empty' })
      : this._iconMarkup('empty');
    const fullIcon = itemSlot
      ? this._interpolate(itemSlot, { ...iconData, layer: 'filled' })
      : this._iconMarkup('full');
    const labelMarkup = label !== undefined || itemLabelSlot
      ? `<span class="w-rating__label">${
          itemLabelSlot
            ? this._interpolate(itemLabelSlot, iconData)
            : this._esc(label)
        }</span>`
      : '';

    return `
      <span
        class="w-rating__wrapper"
        data-index="${index}"
        data-state="${state}"
        style="--w-rating-fill:${fill}%"
      >
        ${labelMarkup}
        <span class="w-rating__item">
          ${controls}
          <span class="w-rating__visual" aria-hidden="true">
            <span class="w-rating__icon w-rating__icon--empty">${emptyIcon}</span>
            <span class="w-rating__icon w-rating__icon--filled">${fullIcon}</span>
          </span>
        </span>
      </span>`;
  }

  _controlTemplate(value, selectedValue, zone) {
    const formattedValue = this._formatValue(value);
    const checked = value === selectedValue;
    const focusValue = this._focusValue(selectedValue);
    return `
      <button
        class="w-rating__control w-rating__control--${zone}"
        type="button"
        role="radio"
        data-value="${formattedValue}"
        aria-checked="${checked}"
        aria-label="${this._esc(this._itemAriaLabel(value))}"
        tabindex="${value === focusValue ? '0' : '-1'}"
        ${this.disabled ? 'disabled' : ''}
      ></button>`;
  }

  _events() {
    const controls = Array.from(this._qAll('.w-rating__control'));
    controls.forEach((control) => {
      control.addEventListener('click', () => {
        if (this.disabled || this.readonly) return;
        const targetValue = this._number(control.dataset.value, 0);
        const nextValue = this._bool('clearable') && targetValue === this.value ? 0 : targetValue;
        this._commit(nextValue);
      });

      control.addEventListener('keydown', (event) => this._onKeydown(event));

      if (this._bool('hover')) {
        control.addEventListener('mouseenter', () => {
          if (this.disabled || this.readonly) return;
          this._syncVisual(this._number(control.dataset.value, 0), true);
        });
        control.addEventListener('mouseleave', () => {
          this._syncVisual(this.value, false);
        });
      }
    });
  }

  _onKeydown(event) {
    if (this.disabled || this.readonly || event.altKey || event.ctrlKey || event.metaKey) return;

    const step = this.halfIncrements ? 0.5 : 1;
    let nextValue;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      nextValue = this.value + step;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      nextValue = this.value - step;
    } else if (event.key === 'Home') {
      nextValue = 0;
    } else if (event.key === 'End') {
      nextValue = this.length;
    } else {
      return;
    }

    event.preventDefault();
    this._commit(nextValue, true);
  }

  _commit(nextValue, moveFocus = false) {
    const value = this._quantize(this._clamp(nextValue));
    const formattedValue = this._formatValue(value);
    this._silentSet('value', formattedValue);
    this._syncVisual(value, false);
    this._emit('change', { value });

    if (moveFocus) {
      const focusValue = this._focusValue(value);
      this._q(`.w-rating__control[data-value="${this._formatValue(focusValue)}"]`)?.focus();
    }
  }

  _syncVisual(displayValue, hovering) {
    const root = this._q('.w-rating');
    if (!root) return;

    if (hovering) root.setAttribute('data-hover-value', this._formatValue(displayValue));
    else root.removeAttribute('data-hover-value');

    const selectedValue = this.value;
    root.dataset.value = this._formatValue(selectedValue);
    this._qAll('.w-rating__wrapper').forEach((wrapper) => {
      const index = this._number(wrapper.dataset.index, 1);
      const fill = this._fillFor(index, displayValue);
      wrapper.style.setProperty('--w-rating-fill', `${fill}%`);
      wrapper.dataset.state = this._stateFor(fill);
    });

    const focusValue = this._focusValue(selectedValue);
    this._qAll('.w-rating__control').forEach((control) => {
      const controlValue = this._number(control.dataset.value, 0);
      control.setAttribute('aria-checked', String(controlValue === selectedValue));
      control.tabIndex = controlValue === focusValue ? 0 : -1;
    });

    const input = this._q('.w-rating__input');
    if (input) input.value = this._formatValue(selectedValue);
  }

  _itemAriaLabel(value) {
    const template = this._attr('item-aria-label', '{value} of {length}');
    return this._interpolate(template, {
      value: this._formatValue(value),
      length: this.length,
    });
  }

  _itemLabels() {
    const raw = this._attr('item-labels', '');
    if (!raw) return [];
    try {
      const labels = JSON.parse(raw);
      return Array.isArray(labels) ? labels.map((label) => String(label)) : [];
    } catch {
      return [];
    }
  }

  _slotSource(name) {
    const source = this.querySelector(`[slot="${name}"]`);
    if (!source) return '';
    if (source.tagName === 'TEMPLATE') return source.innerHTML;

    const clone = source.cloneNode(true);
    clone.removeAttribute('slot');
    return clone.outerHTML;
  }

  _interpolate(source, values) {
    return Object.entries(values).reduce((result, [key, value]) => {
      const escapedValue = this._esc(value);
      return result
        .replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), escapedValue)
        .replace(new RegExp(`{${key}}`, 'g'), escapedValue);
    }, source);
  }

  _iconMarkup(layer) {
    const attribute = layer === 'full' ? 'full-icon' : 'empty-icon';
    const customIcon = this._attr(attribute, '');
    if (customIcon) {
      return WIcons.resolve(customIcon, { iconClass: 'w-icon w-rating__custom-icon' });
    }
    return layer === 'full' ? DEFAULT_FULL_ICON : DEFAULT_EMPTY_ICON;
  }

  _fillFor(index, value) {
    const rawFill = (value - (index - 1)) * 100;
    return Math.max(0, Math.min(100, rawFill));
  }

  _stateFor(fill) {
    if (fill >= 100) return 'full';
    if (fill > 0) return 'half';
    return 'empty';
  }

  _focusValue(value) {
    const step = this.halfIncrements ? 0.5 : 1;
    if (value <= 0) return step;
    return this._quantize(this._clamp(value));
  }

  _quantize(value) {
    const step = this.halfIncrements ? 0.5 : 1;
    return Math.round(value / step) * step;
  }

  _clamp(value) {
    return Math.max(0, Math.min(this.length, this._number(value, 0)));
  }

  _number(value, fallback) {
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? number : fallback;
  }

  _formatValue(value) {
    return String(Number(value.toFixed(2)));
  }

  _labelPosition() {
    return this._attr('item-label-position', 'top') === 'bottom' ? 'bottom' : 'top';
  }

  _density() {
    const density = this._attr('density', 'default');
    return ['default', 'comfortable', 'compact'].includes(density) ? density : 'default';
  }

  _tagName() {
    const tag = this._attr('tag', 'div').toLowerCase();
    return ['div', 'span', 'section'].includes(tag) ? tag : 'div';
  }

  _sizeValue() {
    const size = this._attr('size', 'default').trim().toLowerCase();
    if (SIZE_VALUES[size]) return SIZE_VALUES[size];
    if (/^\d*\.?\d+$/.test(size)) return `${size}px`;
    if (/^\d*\.?\d+(rem|em|px|%)$/.test(size)) return size;
    return SIZE_VALUES.default;
  }

  _colorValue(color, fallback) {
    const value = String(color || '').trim().toLowerCase();
    if (!value) return fallback;
    if (TOKEN_COLORS[value]) return `var(--w-${TOKEN_COLORS[value]})`;
    if (globalThis.CSS?.supports?.('color', value)) return value;
    return fallback;
  }
}

if (!customElements.get('w-rating')) customElements.define('w-rating', WRating);
