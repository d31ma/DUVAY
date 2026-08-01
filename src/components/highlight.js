/* <w-highlight> — safe text highlighting by query or explicit ranges. */

import { wValueList } from './utils.js';
import { wSafeColor } from './file-input.js';

export class WHighlight extends WElement {
  static attrs = ['match-all', 'matches', 'color', 'text', 'opacity', 'ignore-case', 'mark-class', 'query'];

  get matches() {
    if (this._matchesValue !== undefined) return this._matchesValue;
    try {
      const value = JSON.parse(this._attr('matches', '[]'));
      return Array.isArray(value) ? value : [];
    } catch { return []; }
  }
  set matches(value) { this._matchesValue = Array.isArray(value) ? value : []; this._refresh(); }

  _template() {
    const text = this._sourceText();
    const ranges = this._ranges(text);
    const className = ['w-highlight-mark', this._attr('mark-class', '')].filter(Boolean).join(' ');
    const style = this._markStyle();
    let cursor = 0;
    let html = '';
    ranges.forEach(([start, end]) => {
      html += this._esc(text.slice(cursor, start));
      html += `<mark class="${this._esc(className)}"${style}>${this._esc(text.slice(start, end))}</mark>`;
      cursor = end;
    });
    html += this._esc(text.slice(cursor));
    return `<span class="w-highlight">${html}<slot hidden></slot></span>`;
  }

  _sourceText() {
    if (this.hasAttribute('text')) return this._attr('text', '');
    const slot = this.querySelector('slot:not([name])');
    return slot ? slot.textContent : this.textContent;
  }

  _ranges(text) {
    const explicit = this.matches
      .map((range) => Array.isArray(range) ? [Number(range[0]), Number(range[1])] : null)
      .filter((range) => range && Number.isInteger(range[0]) && Number.isInteger(range[1]) && range[0] >= 0 && range[1] > range[0])
      .map(([start, end]) => [start, Math.min(text.length, end)])
      .sort((a, b) => a[0] - b[0]);
    if (explicit.length) return this._merge(explicit);

    const queries = wValueList(this._attr('query', '')).filter(Boolean);
    const haystack = this._bool('ignore-case') ? text.toLocaleLowerCase() : text;
    const ranges = [];
    queries.forEach((query) => {
      const needle = this._bool('ignore-case') ? query.toLocaleLowerCase() : query;
      let index = haystack.indexOf(needle);
      while (index >= 0) {
        ranges.push([index, index + needle.length]);
        if (!this._bool('match-all')) break;
        index = haystack.indexOf(needle, index + Math.max(needle.length, 1));
      }
    });
    return this._merge(ranges.sort((a, b) => a[0] - b[0]));
  }

  _merge(ranges) {
    return ranges.reduce((result, range) => {
      const previous = result[result.length - 1];
      if (previous && range[0] <= previous[1]) previous[1] = Math.max(previous[1], range[1]);
      else result.push([...range]);
      return result;
    }, []);
  }

  _markStyle() {
    const declarations = [];
    const color = wSafeColor(this._attr('color', ''));
    const opacity = Number(this._attr('opacity', ''));
    if (color) declarations.push(`--w-highlight-color:${this._esc(color)}`);
    if (Number.isFinite(opacity) && opacity >= 0 && opacity <= 1) declarations.push(`--w-highlight-opacity:${opacity}`);
    return declarations.length ? ` style="${declarations.join(';')}"` : '';
  }

  _refresh() { if (this._rendered) this._render(); }
}

if (!customElements.get('w-highlight')) customElements.define('w-highlight', WHighlight);
