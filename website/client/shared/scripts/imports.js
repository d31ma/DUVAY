import '../styles/app.css'
import '../assets/duvay/duvay.js'
import '../assets/duvay/duvay-wc.js'
import '../assets/duvay/duvay-directives.js'
import './docs.js'
import './directive-demos.js'
import './platform-skins.js'

const DUVAY_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#83cde3"/>
  <path d="m8 53 11-36q1-6 7 0l6 19 6-19q6-6 7 0l11 36q-12-5-24 0-12 5-24 0Z" fill="#08323f" stroke="#08323f" stroke-width="2" stroke-linejoin="round"/>
  <path d="M13 44q19-6 38 0" fill="none" stroke="#83cde3" stroke-opacity=".56" stroke-width="2" stroke-linecap="round"/>
</svg>`

function applyFavicon() {
  const href = 'data:image/svg+xml,' + encodeURIComponent(DUVAY_FAVICON_SVG)
  let link = document.querySelector('link[rel="icon"][w-favicon]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'icon')
    link.setAttribute('w-favicon', '')
    document.head.appendChild(link)
  }
  link.setAttribute('type', 'image/svg+xml')
  link.setAttribute('href', href)
}

applyFavicon()

// Apply the persisted theme as early as possible to avoid a flash of the
// wrong palette. docs.js owns the full theme lifecycle after this.
try {
  document.documentElement.setAttribute('w-theme', localStorage.getItem('w-theme') || 'light')
} catch (_) {
  document.documentElement.setAttribute('w-theme', 'light')
}

// The docs site wears the visitor's own platform skin — the most direct
// demonstration the framework can give of what it does. duvay.js is imported
// above and has already detected and applied it, so there is nothing to do
// unless the visitor picked a skin explicitly on /docs/platform-skins.
//
// An explicit choice overrides detection, and clears the density that
// detection pairs with macOS — otherwise switching away from macOS would leave
// a stale compact density behind.
try {
  const chosen = localStorage.getItem('w-os')
  if (chosen !== null) {
    document.documentElement.setAttribute('w-os', chosen)
    if (chosen === 'macos') document.documentElement.setAttribute('w-density', 'compact')
    else document.documentElement.removeAttribute('w-density')
  }
} catch (_) { /* storage unavailable — keep whatever duvay.js detected */ }
