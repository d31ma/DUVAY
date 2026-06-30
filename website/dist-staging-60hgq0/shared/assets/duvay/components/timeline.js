/* <w-timeline> — DuVay component module */

export class WTimeline extends WElement {
  _template() {
    return `<div class="w-timeline"><slot></slot></div>`;
  }
}

if (!customElements.get('w-timeline')) customElements.define('w-timeline', WTimeline);
