import '../styles/app.css'
import '../assets/duvay/duvay-wc.js'
import '../assets/duvay/duvay-directives.js'
import './docs.js'
import './directive-demos.js'

const DUVAY_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#83cde3"/>
  <path d="m8 53 11-36q1-6 7 0l6 19 6-19q6-6 7 0l11 36q-12-5-24 0-12 5-24 0Z" fill="#08323f" stroke="#08323f" stroke-width="2" stroke-linejoin="round"/>
  <path d="M13 44q19-6 38 0" fill="none" stroke="#83cde3" stroke-opacity=".56" stroke-width="2" stroke-linecap="round"/>
</svg>`

function applyFavicon() {
  const href = 'data:image/svg+xml,' + encodeURIComponent(DUVAY_FAVICON_SVG)
  let link = document.querySelector('link[rel="icon"][data-w-favicon]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'icon')
    link.setAttribute('data-w-favicon', '')
    document.head.appendChild(link)
  }
  link.setAttribute('type', 'image/svg+xml')
  link.setAttribute('href', href)
}

applyFavicon()

// Apply the persisted theme as early as possible to avoid a flash of the
// wrong palette. docs.js owns the full theme lifecycle after this.
try {
  document.documentElement.setAttribute('data-w-theme', localStorage.getItem('w-theme') || 'light')
} catch (_) {
  document.documentElement.setAttribute('data-w-theme', 'light')
}
