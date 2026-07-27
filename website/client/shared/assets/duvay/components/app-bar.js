/* <w-app-bar> — DuVay component module
 *
 * Vuetify parity: color, density (prominent|comfortable|compact), flat,
 * extended/extension-height, elevation, image (bg url), collapse, rounded,
 * border, height, location (top|bottom), scroll-behavior (hide|elevate|
 * collapse|fade-image) with scroll-threshold. Keeps existing sticky + scroll
 * listener and w-app-bar-nav-icon integration.
 *
 * Attributes:
 *   title            - text title (rendered as .w-app-bar-title)
 *   sticky           - boolean; pins the bar on scroll
 *   color            - palette token name (e.g. primary, surface)
 *   bg-color         - palette token name for background
 *   density          - prominent | comfortable | compact
 *   flat             - boolean; removes shadow/elevation
 *   extended         - boolean; renders an extension slot below the bar
 *   extension-height - height of extension area (default: 48px)
 *   elevation        - 0..N shadow level
 *   image            - background image URL
 *   collapse         - boolean; collapses to icon-only width
 *   rounded          - boolean or size (sm|md|lg|xl|pill)
 *   border           - boolean; adds border
 *   height           - explicit height (number or CSS value)
 *   location         - top (default) | bottom
 *   scroll-behavior  - hide | elevate | collapse | fade-image
 *   scroll-threshold - pixel scroll distance before behavior kicks in (default: 4)
 *
 * Events:
 *   scroll - fires on scroll state change (detail: { scrolled, behavior })
 */

export class WAppBar extends WElement {
  static attrs = [
    'title', 'sticky', 'color', 'bg-color', 'density', 'flat',
    'extended', 'extension-height', 'elevation', 'image',
    'collapse', 'rounded', 'border', 'height', 'location',
    'scroll-behavior', 'scroll-threshold',
    'absolute', 'floating', 'name', 'order', 'collapse-position', 'scroll-target',
  ];

  get title() { return this._attr('title', ''); }
  get sticky() { return this._bool('sticky'); }
  get color() { return this._attr('color', ''); }
  get bgColor() { return this._attr('bg-color', ''); }
  get density() { return this._attr('density', ''); }
  get flat() { return this._bool('flat'); }
  get extended() { return this._bool('extended'); }
  get extensionHeight() { return this._attr('extension-height', '48'); }
  get elevation() { return this._attr('elevation', ''); }
  get image() { return this._attr('image', ''); }
  get collapse() { return this._bool('collapse'); }
  get rounded() { return this._attr('rounded', ''); }
  get border() { return this._bool('border'); }
  get height() { return this._attr('height', ''); }
  get location() { return this._attr('location', 'top'); }
  get scrollBehavior() { return this._attr('scroll-behavior', ''); }
  get scrollThreshold() { return this._attr('scroll-threshold', '4'); }
  get absolute() { return this._bool('absolute'); }
  get floating() { return this._bool('floating'); }
  get name() { return this._attr('name', ''); }
  get order() { return this._attr('order', ''); }
  get collapsePosition() { return this._attr('collapse-position', 'start'); }
  get scrollTarget() { return this._attr('scroll-target', ''); }

  _classes() {
    // Elevation only applies when not flat.
    return 'w-app-bar'
      + this._cls({ 'w-app-bar--sticky': this.sticky })
      + this._cls({ ['w-app-bar--' + this.density]: this.density })
      + this._cls({
        'w-app-bar--flat': this.flat,
        'w-app-bar--collapse': this.collapse,
        'w-app-bar--border': this.border,
        'w-app-bar--bottom': this.location === 'bottom',
        'w-app-bar--image': this.image,
        ['elevation-' + this.elevation]: !this.flat && this.elevation,
      })
      + this._cls({
        'w-app-bar--absolute': this.absolute,
        'w-app-bar--floating': this.floating,
        'w-app-bar--collapse-end': this.collapse && this.collapsePosition === 'end',
      })
      + this._roundedClass();
  }

  _roundedClass() {
    const rounded = this.rounded;
    if (!rounded) return '';
    return rounded === 'true' ? ' rounded' : ' rounded-' + rounded;
  }

  // Color / bg-color / sizing via inline CSS custom properties
  _styleAttr() {
    const styles = [];
    if (this.color) styles.push('--w-app-bar-color: var(--w-' + this.color + ');');
    if (this.bgColor) styles.push('--w-app-bar-bg: var(--w-' + this.bgColor + ');');
    if (this.height) styles.push('--w-app-bar-height: ' + this._length(this.height) + ';');
    if (this.image) styles.push('--w-app-bar-image: url(' + this._esc(this.image) + ');');
    if (this.extensionHeight) styles.push('--w-app-bar-extension-height: ' + this._length(this.extensionHeight) + ';');
    if (this.order) styles.push('order: ' + this._esc(this.order) + ';');

    return styles.length ? ' style="' + styles.join(' ') + '"' : '';
  }

  _length(value) {
    return isNaN(value) ? value : value + 'px';
  }

  _template() {
    const titleHtml = this.title ? `<strong class="w-app-bar-title">${this._esc(this.title)}</strong>` : '';

    const extension = this.extended ? `<div class="w-app-bar-extension"><slot name="extension"></slot></div>` : '';

    return `<header class="${this._classes()}"${this._attrs({ 'data-name': this.name })}${this._styleAttr()}>
      ${titleHtml}
      <slot></slot>
    </header>${extension}`;
  }

  _events() {
    this._removeScrollListener();

    // Scroll behavior handling
    if (this.scrollBehavior || this.sticky) {
      this.__wScrollSource = this._scrollSource();
      this.__wAppBarScroll = () => this._syncScrolledState();
      this.__wScrollSource.addEventListener('scroll', this.__wAppBarScroll, { passive: true });
      this._syncScrolledState();
    }
  }

  // `scroll-target` swaps the observed scroller from the window to a selected
  // element; an unmatched selector falls back to the window.
  _scrollSource() {
    if (!this.scrollTarget) return window;
    try {
      return document.querySelector(this.scrollTarget) || window;
    } catch {
      return window;
    }
  }

  _scrollOffset() {
    const source = this.__wScrollSource;
    if (!source || source === window) return window.scrollY;
    return source.scrollTop;
  }

  disconnectedCallback() {
    this._removeScrollListener();
  }

  _syncScrolledState() {
    const threshold = parseInt(this.scrollThreshold, 10) || 4;
    const offset = this._scrollOffset();
    const scrolled = offset > threshold;
    const bar = this._q('.w-app-bar');
    if (!bar) return;

    // Track previous state for events
    const wasScrolled = bar.classList.contains('w-app-bar--scrolled');

    // Apply scroll-behavior driven classes
    const behavior = this.scrollBehavior;
    if (behavior) {
      switch (behavior) {
        case 'hide':
          bar.classList.toggle('w-app-bar--hidden', scrolled);
          break;
        case 'elevate':
          bar.classList.toggle('w-app-bar--scrolled', scrolled);
          break;
        case 'collapse':
          bar.classList.toggle('w-app-bar--collapsed', scrolled);
          break;
        case 'fade-image':
          if (this.image) {
            bar.classList.toggle('w-app-bar--image-faded', scrolled);
          }
          break;
      }
    }

    // Sticky scrolled state (for frost effect)
    if (this.sticky) {
      this.toggleAttribute('data-scrolled', scrolled);
      bar.classList.toggle('w-app-bar--scrolled', scrolled);
    }

    // Emit scroll event when state changes
    if (wasScrolled !== scrolled) {
      this._emit('scroll', { scrolled, behavior, scrollY: offset });
    }
  }

  _removeScrollListener() {
    if (!this.__wAppBarScroll) return;
    (this.__wScrollSource || window).removeEventListener('scroll', this.__wAppBarScroll);
    this.__wAppBarScroll = null;
    this.__wScrollSource = null;
  }
}

if (!customElements.get('w-app-bar')) customElements.define('w-app-bar', WAppBar);
