/* <w-treeview> — DuVay component module */
import { wBoolAttr, wRows } from './utils.js';

export class WTreeview extends WElement {
  static attrs = ['items', 'open-all'];

  get items() { return wRows(this._attr('items', '')); }
  get openAll() { return wBoolAttr(this, 'open-all'); }

  _template() {
    if (!this.items.length) return `<div class="w-treeview" role="tree"><slot></slot></div>`;
    const tree = this._buildTree();
    return `<div class="w-treeview" role="tree">${this._treeHtml(tree)}</div>`;
  }

  _events() {
    this.querySelectorAll('.w-treeview-toggle').forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('.w-treeview-node');
        const open = !item.classList.contains('open');
        item.classList.toggle('open', open);
        button.setAttribute('aria-expanded', String(open));
        item.setAttribute('aria-expanded', String(open));
      });
    });
  }

  _buildTree() {
    const root = [];
    this.items.forEach((path) => {
      const parts = path.split('>').map((part) => part.trim()).filter(Boolean);
      let level = root;
      parts.forEach((label) => {
        let node = level.find((item) => item.label === label);
        if (!node) {
          node = { label, children: [] };
          level.push(node);
        }
        level = node.children;
      });
    });
    return root;
  }

  _treeHtml(nodes) {
    return `<ul>${nodes.map((node) => {
      const hasChildren = node.children.length > 0;
      const open = this.openAll || !hasChildren ? ' open' : '';
      return `<li class="w-treeview-node${open}" role="treeitem"${hasChildren ? ` aria-expanded="${this.openAll}"` : ''}>
        <span class="w-treeview-row">
          ${hasChildren ? `<button class="w-treeview-toggle" type="button" aria-expanded="${this.openAll}" aria-label="Toggle ${this._esc(node.label)}">›</button>` : '<span class="w-treeview-leaf" aria-hidden="true"></span>'}
          <span>${this._esc(node.label)}</span>
        </span>
        ${hasChildren ? this._treeHtml(node.children) : ''}
      </li>`;
    }).join('')}</ul>`;
  }
}

if (!customElements.get('w-treeview')) customElements.define('w-treeview', WTreeview);
