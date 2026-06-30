/* <w-counter> — DuVay component module */

export class WCounter extends WElement {
  static attrs = ['value', 'max', 'tween'];

  get value() { return this._attr('value', '0'); }
  get max() { return this._attr('max', ''); }
  get tween() { return this._bool('tween'); }

  _template() {
    const text = this.max ? `${this.value} / ${this.max}` : this.value;
    return `<span class="w-counter">${this._esc(text)}</span>`;
  }

  _events() {
    if (!this.tween || !window.WMotion) return;
    const value = Number(this.value);
    if (!Number.isFinite(value)) return;
    const el = this._q('.w-counter');
    if (!el) return;
    window.WMotion.tween(el, {
      from: 0,
      to: value,
      duration: 700,
      suffix: this.max ? ` / ${this.max}` : '',
    });
  }
}

if (!customElements.get('w-counter')) customElements.define('w-counter', WCounter);
