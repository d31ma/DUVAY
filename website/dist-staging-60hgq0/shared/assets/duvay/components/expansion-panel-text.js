/* <w-expansion-panel-text> — Expansion panel body subcomponent */

class WExpansionPanelText extends WElement {
  _template() {
    return `<div class="w-expand-body w-expansion-panel-text"><slot></slot></div>`;
  }
}

if (!customElements.get('w-expansion-panel-text')) {
  customElements.define('w-expansion-panel-text', WExpansionPanelText);
}
