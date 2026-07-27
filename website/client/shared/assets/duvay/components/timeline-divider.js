/* <w-timeline-divider> — Timeline divider subcomponent */

class WTimelineDivider extends WElement {
  _template() {
    return `<div class="w-timeline-divider" aria-hidden="true"><slot></slot></div>`;
  }
}

if (!customElements.get('w-timeline-divider')) {
  customElements.define('w-timeline-divider', WTimelineDivider);
}
