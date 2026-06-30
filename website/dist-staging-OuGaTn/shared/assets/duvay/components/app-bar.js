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

  _template() {
    const classes = ['w-app-bar'];
    if (this.sticky) classes.push('w-app-bar--sticky');
    if (this.density) classes.push('w-app-bar--' + this.density);
    if (this.flat) classes.push('w-app-bar--flat');
    if (this.collapse) classes.push('w-app-bar--collapse');
    if (this.border) classes.push('w-app-bar--border');
    if (this.location === 'bottom') classes.push('w-app-bar--bottom');
    if (this.image) classes.push('w-app-bar--image');

    // Elevation class (only if not flat)
    if (!this.flat && this.elevation) {
      classes.push('w-elevation-' + this.elevation);
    }

    // Rounded
    if (this.rounded) {
      classes.push(this.rounded === 'true' || this.rounded === '' ? 'w-rounded' : 'w-rounded-' + this.rounded);
    }

    // Color / bg-color via inline CSS custom properties
    const styles = [];
    if (this.color) styles.push('--w-app-bar-color: var(--w-' + this.color + ');');
    if (this.bgColor) styles.push('--w-app-bar-bg: var(--w-' + this.bgColor + ');');
    if (this.height) styles.push('--w-app-bar-height: ' + (isNaN(this.height) ? this.height : this.height + 'px') + ';');
    if (this.image) styles.push('--w-app-bar-image: url(' + this._esc(this.image) + ');');
    if (this.extensionHeight) styles.push('--w-app-bar-extension-height: ' + (isNaN(this.extensionHeight) ? this.extensionHeight : this.extensionHeight + 'px') + ';');

    const styleAttr = styles.length ? ' style="' + styles.join(' ') + '"' : '';

    const titleHtml = this.title ? `<strong class="w-app-bar-title">${this._esc(this.title)}</strong>` : '';

    const extension = this.extended ? `<div class="w-app-bar-extension"><slot name="extension"></slot></div>` : '';

    return `<header class="${classes.join(' ')}"${styleAttr}>
      ${titleHtml}
      <slot></slot>
    </header>${extension}`;
  }

  _events() {
    this._removeScrollListener();

    // Scroll behavior handling
    if (this.scrollBehavior || this.sticky) {
      this.__wAppBarScroll = () => this._syncScrolledState();
      window.addEventListener('scroll', this.__wAppBarScroll, { passive: true });
      this._syncScrolledState();
    }
  }

  disconnectedCallback() {
    this._removeScrollListener();
  }

  _syncScrolledState() {
    const threshold = parseInt(this.scrollThreshold, 10) || 4;
    const scrolled = window.scrollY > threshold;
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
      this._emit('scroll', { scrolled, behavior, scrollY: window.scrollY });
    }
  }

  _removeScrollListener() {
    if (!this.__wAppBarScroll) return;
    window.removeEventListener('scroll', this.__wAppBarScroll);
    this.__wAppBarScroll = null;
  }
}

if (!customElements.get('w-app-bar')) customElements.define('w-app-bar', WAppBar);
