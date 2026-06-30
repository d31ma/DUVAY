/* <w-progress> — Linear or circular progress indicator
 *
 * Attributes:
 *   variant       - linear | circular (default: linear)
 *   value         - current value (0–100)
 *   max           - maximum value (default: 100)
 *   indeterminate - if set, shows animated indeterminate state
 *   size          - sm | lg (circular only; omit for default 48px)
 *   tween         - animates determinate value from 0 on render
 *
 * Slots:
 *   default - ignored; self-contained visual element
 */

export class WProgress extends WElement {

  static attrs = ['variant', 'value', 'max', 'indeterminate', 'size', 'tween'];

  get variant()       { return this._attr('variant', 'linear'); }
  get value()         { return parseFloat(this._attr('value', '0')) || 0; }
  get max()           { return parseFloat(this._attr('max', '100')) || 100; }
  get indeterminate() { return this._bool('indeterminate'); }
  get size()          { return this._attr('size', ''); }
  get tween()         { return this._bool('tween'); }

  _template() {
    const isCircular = this.variant === 'circular';

    if (isCircular) {
      return this._circularTemplate();
    }
    return this._linearTemplate();
  }

  _linearTemplate() {
    const indet = this.indeterminate ? ' w-progress--indeterminate' : '';
    const pct = this.indeterminate ? '' : ` style="width: ${this._pct()}%;"`;

    return `<div class="w-progress${indet}" role="progressbar" aria-valuenow="${this.value}" aria-valuemin="0" aria-valuemax="${this.max}">
      <div class="w-progress-bar"${pct}></div>
    </div>`;
  }

  _circularTemplate() {
    const sz = this.size ? ' w-progress-circular--' + this.size : '';
    const indet = this.indeterminate ? ' w-progress-circular--indeterminate' : '';
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = this.indeterminate ? '' : ` stroke-dashoffset="${circumference - (this._pct() / 100) * circumference}"`;

    return `<div class="w-progress-circular${sz}${indet}" role="progressbar" aria-valuenow="${this.value}" aria-valuemin="0" aria-valuemax="${this.max}">
      <svg viewBox="0 0 48 48" width="100%" height="100%">
        <circle class="w-progress-track" cx="24" cy="24" r="${radius}"></circle>
        <circle class="w-progress-fill" cx="24" cy="24" r="${radius}" stroke-dasharray="${circumference}"${offset}></circle>
      </svg>
    </div>`;
  }

  _pct() {
    const max = this.max || 100;
    if (max <= 0) return 0;
    return Math.min(100, Math.max(0, (this.value / max) * 100));
  }

  _events() {
    if (!this.tween || this.indeterminate || !window.WMotion) return;
    if (this.variant === 'circular') {
      const fill = this._q('.w-progress-fill');
      if (!fill) return;
      const radius = 20;
      const circumference = 2 * Math.PI * radius;
      const to = circumference - (this._pct() / 100) * circumference;
      window.WMotion.tween(fill, {
        from: circumference,
        to,
        property: 'attr:stroke-dashoffset',
        duration: 700,
        format: 'raw',
      });
      return;
    }

    const bar = this._q('.w-progress-bar');
    if (bar) window.WMotion.tween(bar, { from: 0, to: this._pct(), property: 'width', duration: 700 });
  }
}
