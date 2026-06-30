/* <w-selection-control-group> — DuVay component module */

export class WSelectionControlGroup extends WElement {
  _template() { return `<div class="w-selection-control-group" role="group"><slot></slot></div>`; }
}

if (!customElements.get('w-selection-control-group')) customElements.define('w-selection-control-group', WSelectionControlGroup);
