/* <w-expansion-panel-title> — Expansion panel title subcomponent */

class WExpansionPanelTitle extends WElement {
  _template() {
    return `<button class="w-expand-header w-expansion-panel-title" type="button">
      <span class="w-flex-1"><slot></slot></span>
      <svg class="w-expand-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>
    </button>`;
  }
}

if (!customElements.get('w-expansion-panel-title')) {
  customElements.define('w-expansion-panel-title', WExpansionPanelTitle);
}
