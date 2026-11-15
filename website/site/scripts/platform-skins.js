// Live OS-skin switcher for the /docs/platform-skins page.
//
// Distinct from the per-demo tabs in docs.js: those scope a skin to one preview
// so you can compare components, whereas this rewrites `w-os` on <html> — which
// is what an application actually does, and what the page is teaching.
//
// Follows the directive-demos pattern: document-level delegation wired once, so
// it survives SPA navigation and is inert on every other page. Guarded for the
// prerender pass, which evaluates modules without a DOM.

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function' && !window.__wPlatformSkins) {
  window.__wPlatformSkins = true

  const root = document.documentElement
  const TABS = '.skin-switch-tab'

  function sync() {
    const os = root.getAttribute('w-os') || ''

    for (const label of document.querySelectorAll('[w-os-current]')) {
      // Show what you would actually write. The tabs are labelled by operating
      // system, so this is where the attribute value gets taught.
      label.textContent = `w-os="${os}"`
    }

    for (const tab of document.querySelectorAll(TABS)) {
      const selected = tab.getAttribute('w-os-pick') === os
      tab.setAttribute('aria-selected', String(selected))
      // Roving tabindex: only the selected tab is in the tab order.
      tab.tabIndex = selected ? 0 : -1
    }
  }

  function apply(os) {
    root.setAttribute('w-os', os)
    // macOS is pointer-dense; duvay.js pairs these two on a real Mac, so the
    // preview has to pair them here or the page would misrepresent the skin.
    if (os === 'macos') root.setAttribute('w-density', 'compact')
    else root.removeAttribute('w-density')

    try { localStorage.setItem('w-os', os) } catch (_) { /* storage unavailable */ }
    sync()
  }

  document.addEventListener('click', (e) => {
    const pick = e.target.closest && e.target.closest('[w-os-pick]')
    if (!pick) return
    apply(pick.getAttribute('w-os-pick'))
  })

  // Arrow-key navigation, per the ARIA tabs pattern.
  document.addEventListener('keydown', (e) => {
    if (!e.target.closest || !e.target.closest(TABS)) return
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(e.key)) return
    e.preventDefault()

    const tabs = [...document.querySelectorAll(TABS)]
    const current = tabs.indexOf(e.target)
    const last = tabs.length - 1
    const next = e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : e.key === 'ArrowLeft' ? (current <= 0 ? last : current - 1)
      : (current >= last ? 0 : current + 1)

    apply(tabs[next].getAttribute('w-os-pick'))
    tabs[next].focus()
  })

  // The page may mount after this module runs (SPA navigation).
  document.addEventListener('DOMContentLoaded', sync)
  window.addEventListener('popstate', sync)
  setTimeout(sync, 0)
}
