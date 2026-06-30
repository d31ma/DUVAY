/* DuVay icon registry — configurable icon sets for zero-dependency Light-DOM components.
 *
 * Icon integration: register icon sets (font classes, ligatures,
 * SVG paths, or custom elements) and resolve icon names through a single API.
 * No icon font is bundled; users load their own and tell DuVay how to render it.
 *
 * Usage:
 *   WIcons.set('mdi', { type: 'class', prefix: 'mdi' });
 *   WIcons.defaultSet = 'mdi';
 *   <w-icon name="home"></w-icon>   <!-- renders <span class="w-icon mdi mdi-home"> -->
 *
 * Adapters:
 *   - type: 'text'      render name as text inside .w-icon (default, backward-compatible)
 *   - type: 'class'     render <span class="w-icon {prefix} {name}"></span>
 *   - type: 'ligature'  same as text, for ligature-based fonts such as Material Symbols
 *   - type: 'svg'       render <svg class="w-icon"> with a registered path
 *   - type: 'component' render a custom element by tag name
 *
 * Aliases:
 *   WIcons.alias('close', 'mdi:window-close');
 *   <w-icon name="$close"></w-icon>
 */

function escClass(s) {
  return String(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const DEFAULTS = {
  text: {
    type: 'text',
    render(name, _set, { iconClass = 'w-icon' } = {}) {
      return `<span class="${escClass(iconClass)}" aria-hidden="true">${name}</span>`;
    }
  },
  ligature: {
    type: 'ligature',
    render(name, _set, { iconClass = 'w-icon' } = {}) {
      return `<span class="${escClass(iconClass)}" aria-hidden="true">${name}</span>`;
    }
  },
  class: {
    type: 'class',
    prefix: '',
    render(name, set, { iconClass = 'w-icon' } = {}) {
      const cls = [iconClass, set.prefix, name].filter(Boolean).join(' ');
      return `<span class="${escClass(cls)}" aria-hidden="true"></span>`;
    }
  },
  svg: {
    type: 'svg',
    viewBox: '0 0 24 24',
    paths: {},
    render(name, set, { iconClass = 'w-icon' } = {}) {
      const path = set.paths?.[name];
      if (!path) return DEFAULTS.text.render(name, set, { iconClass });
      return `<svg class="${escClass(iconClass)}" viewBox="${set.viewBox}" aria-hidden="true">${path}</svg>`;
    }
  },
  component: {
    type: 'component',
    render(name, _set, { iconClass = 'w-icon' } = {}) {
      return `<${name} class="${escClass(iconClass)}" aria-hidden="true"></${name}>`;
    }
  }
};

const WIcons = {
  sets: { ...DEFAULTS },
  aliases: {},
  defaultSet: 'text',

  set(name, config) {
    this.sets[name] = { ...DEFAULTS[config.type], ...config };
    return this;
  },

  alias(name, value) {
    this.aliases[name] = value;
    return this;
  },

  resolve(value, { iconClass = 'w-icon' } = {}) {
    if (value == null) return '';
    let raw = String(value);

    // Aliases: $name
    if (raw.startsWith('$')) {
      const key = raw.slice(1);
      raw = this.aliases[key] ?? raw;
    }

    // Set prefix: set:name
    let setName = this.defaultSet;
    let iconName = raw;
    const idx = raw.indexOf(':');
    if (idx > 0) {
      setName = raw.slice(0, idx);
      iconName = raw.slice(idx + 1);
    }

    const set = this.sets[setName] || this.sets.text;
    return set.render(iconName, set, { iconClass });
  }
};

if (!globalThis.WIcons) globalThis.WIcons = WIcons;
export default WIcons;
