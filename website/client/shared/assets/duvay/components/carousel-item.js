/* <w-carousel-item> — a single carousel slide.
 *
 * A slide is an image surface first (the <w-img> attribute set applies here)
 * and a window item second (it participates in the parent carousel's
 * selection and transitions).
 *
 * Image attributes:
 *   src, alt        - the slide image
 *   cover           - crop to fill (default true)
 *   srcset, sizes   - responsive source descriptors
 *   lazy-src        - blurred placeholder shown behind the image while loading
 *   gradient        - linear-gradient stops overlaid on the image
 *   aspect-ratio    - reserve a ratio box (number or "16 / 9")
 *   image-class     - extra classes for the inner <img>
 *   content-class   - extra classes for the slide box
 *   draggable       - native draggable passthrough ("true" | "false")
 *   crossorigin     - "" | anonymous | use-credentials
 *   referrerpolicy  - referrer policy for the image request
 *
 * Layout attributes:
 *   absolute        - position: absolute
 *   inline          - lay out inline instead of as a flex block
 *
 * Selection attributes:
 *   value              - identifier the parent carousel can select by name
 *   selected-class     - class applied while this slide is active
 *   transition         - transition when advancing to this slide
 *   reverse-transition - transition when moving backwards to this slide
 */
import { wBoolAttr } from './utils.js';

export class WCarouselItem extends WElement {
  static attrs = [
    'src', 'alt', 'cover', 'srcset', 'sizes', 'lazy-src', 'gradient',
    'aspect-ratio', 'image-class', 'content-class', 'draggable', 'crossorigin',
    'referrerpolicy', 'absolute', 'inline', 'value', 'selected-class',
    'transition', 'reverse-transition',
  ];

  get src() { return this._attr('src', ''); }
  get alt() { return this._attr('alt', ''); }
  get cover() { return wBoolAttr(this, 'cover', true); }

  // Author-supplied class lists ride along verbatim (escaped) so consumers can
  // hang utility classes off the slide box and the <img>.
  _extraClasses(name) {
    const value = this._attr(name, '').trim();
    return value ? ' ' + this._esc(value) : '';
  }

  _boxClasses() {
    return 'w-carousel-item'
      + this._cls({
        'w-carousel-item--absolute': this._bool('absolute'),
        'w-carousel-item--inline': this._bool('inline'),
      })
      + this._extraClasses('content-class');
  }

  _boxStyle() {
    const ratio = this._attr('aspect-ratio', '');
    return ratio ? ` style="aspect-ratio:${this._esc(ratio)}"` : '';
  }

  _imgAttrs() {
    return this._attrs({
      srcset: this._attr('srcset', ''),
      sizes: this._attr('sizes', ''),
      draggable: this.getAttribute('draggable'),
      crossorigin: this._attr('crossorigin', ''),
      referrerpolicy: this._attr('referrerpolicy', ''),
    });
  }

  _imgMarkup() {
    if (!this.src) return '';
    const classes = 'w-carousel-img'
      + this._cls({ 'w-carousel-img--cover': this.cover })
      + this._extraClasses('image-class');
    return `<img class="${classes}" src="${this._esc(this.src)}" alt="${this._esc(this.alt)}"${this._imgAttrs()}>`;
  }

  // Sits behind the real image; an image that has not painted yet is
  // transparent, so the placeholder shows through with no JS involved.
  _lazyMarkup() {
    const lazy = this._attr('lazy-src', '');
    return lazy ? `<div class="w-carousel-item__placeholder" style="background-image:url('${this._esc(lazy)}')"></div>` : '';
  }

  _gradientMarkup() {
    const gradient = this._attr('gradient', '');
    return gradient ? `<div class="w-carousel-item__gradient" style="background-image:linear-gradient(${this._esc(gradient)})"></div>` : '';
  }

  _template() {
    return `<div class="${this._boxClasses()}"${this._boxStyle()}>`
      + this._lazyMarkup()
      + this._imgMarkup()
      + this._gradientMarkup()
      + '<slot></slot></div>';
  }
}

if (!customElements.get('w-carousel-item')) customElements.define('w-carousel-item', WCarouselItem);
