// Interactive readouts for the Directives docs pages.
//
// Page-level companion scripts (tac.js) do not run for these nested routes, but
// the global behavior layer does, and DuVay directive events bubble to the
// document. So we wire every demo here with document-level event delegation:
// it survives SPA navigation and works regardless of when the demo markup
// mounts. Each handler is scoped to a demo element id, so it is inert on every
// other page.

if (!window.__wDirectiveDemos) {
  window.__wDirectiveDemos = true

  const text = (id, value) => {
    const el = document.getElementById(id)
    if (el) el.textContent = value
  }

  // scroll → readout of scrollTop
  document.addEventListener('w-scroll', (e) => {
    if (e.target && e.target.id === 'scroll-demo') {
      text('scroll-demo-out', Math.round(e.detail.scrollTop))
    }
  })

  // resize → readout of width x height
  document.addEventListener('w-resize', (e) => {
    if (e.target && e.target.id === 'rz-box') {
      text('rz-out', Math.round(e.detail.width) + ' x ' + Math.round(e.detail.height))
    }
  })

  // touch → readout of last swipe direction
  document.addEventListener('w-swipe', (e) => {
    if (e.target && e.target.id === 'tc-pad') {
      text('tc-out', e.detail.direction)
    }
  })

  // intersect → readout of visibility
  document.addEventListener('w-intersect', (e) => {
    if (e.target && e.target.id === 'io-target') {
      text('io-status', e.detail.isIntersecting ? 'In view!' : 'Not visible yet')
    }
  })

  // mutate → add items and count observed mutations
  let mutateItems = 1
  let mutateCount = 0
  document.addEventListener('w-mutate', (e) => {
    if (e.target && e.target.id === 'mu-list') {
      mutateCount += 1
      text('mu-count', mutateCount)
    }
  })

  // click-outside → open a panel and dismiss it on outside click
  document.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('#mu-add')) {
      const list = document.getElementById('mu-list')
      if (list) {
        mutateItems += 1
        const li = document.createElement('li')
        li.textContent = 'Item ' + mutateItems
        list.appendChild(li)
      }
      return
    }
    if (e.target.closest && e.target.closest('#co-toggle')) {
      const panel = document.getElementById('co-panel')
      if (panel) panel.hidden = false
      text('co-status', 'open')
    }
  })

  document.addEventListener('w-click-outside', (e) => {
    if (e.target && e.target.id === 'co-panel') {
      e.target.hidden = true
    }
  })
}
