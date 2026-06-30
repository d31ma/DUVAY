export default class extends Tac {
  onMount() {
    document.title = 'Dialog & Overlay — DuVay Documentation'

    function openOverlay(target, overlay) {
      if (target) {
        target.classList.add('open')
        target.setAttribute('aria-hidden', 'false')
      }
      if (overlay) overlay.classList.add('open')
    }

    function closeOverlay(target, overlay) {
      if (target) {
        target.classList.remove('open')
        target.setAttribute('aria-hidden', 'true')
      }
      if (overlay) overlay.classList.remove('open')
    }

    const cssDialogOpener = document.querySelector('[data-w-dialog-open="demo-dialog"]')
    const cssDialog = document.getElementById('demo-dialog')
    const cssDialogOverlay = document.getElementById('demo-dialog-overlay')
    if (cssDialogOpener) {
      cssDialogOpener.addEventListener('click', function () {
        openOverlay(cssDialog, cssDialogOverlay)
      })
    }
    if (cssDialogOverlay) {
      cssDialogOverlay.addEventListener('click', function () {
        closeOverlay(cssDialog, cssDialogOverlay)
      })
    }
    document.querySelectorAll('#demo-dialog [data-w-dialog-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeOverlay(cssDialog, cssDialogOverlay)
      })
    })

    document.addEventListener('click', function (event) {
      const dialogOpen = event.target.closest('[data-demo-dialog-open]')
      if (dialogOpen) {
        const name = dialogOpen.getAttribute('data-demo-dialog-open')
        const dialog = document.querySelector('[data-demo-dialog="' + name + '"]')
        if (dialog && typeof dialog.show === 'function') dialog.show()
      }

      const dialogClose = event.target.closest('[data-demo-dialog-close]')
      if (dialogClose) {
        const name = dialogClose.getAttribute('data-demo-dialog-close')
        const dialog = document.querySelector('[data-demo-dialog="' + name + '"]')
        if (dialog && typeof dialog.close === 'function') dialog.close()
      }
    })

    const cssSheetOpener = document.querySelector('[data-w-sheet-open="demo-sheet"]')
    const cssSheet = document.getElementById('demo-sheet')
    const cssSheetOverlay = document.getElementById('demo-sheet-overlay')

    if (cssSheetOpener) {
      cssSheetOpener.addEventListener('click', function () {
        openOverlay(cssSheet, cssSheetOverlay)
      })
    }
    if (cssSheetOverlay) {
      cssSheetOverlay.addEventListener('click', function () {
        closeOverlay(cssSheet, cssSheetOverlay)
      })
    }
    document.querySelectorAll('#demo-sheet [data-w-sheet-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeOverlay(cssSheet, cssSheetOverlay)
      })
    })

    document.addEventListener('click', function (event) {
      const sheetOpen = event.target.closest('[data-demo-sheet-open]')
      if (sheetOpen) {
        const name = sheetOpen.getAttribute('data-demo-sheet-open')
        const sheet = document.querySelector('[data-demo-sheet="' + name + '"]')
        const sheetOverlay = document.querySelector('[data-demo-sheet-overlay="' + name + '"]')
        openOverlay(sheet, sheetOverlay)
      }

      const sheetClose = event.target.closest('[data-demo-sheet-close]')
      if (sheetClose) {
        const name = sheetClose.getAttribute('data-demo-sheet-close')
        const sheet = document.querySelector('[data-demo-sheet="' + name + '"]')
        const sheetOverlay = document.querySelector('[data-demo-sheet-overlay="' + name + '"]')
        closeOverlay(sheet, sheetOverlay)
      }

      const sheetOverlay = event.target.closest('[data-demo-sheet-overlay="wc-sheet"]')
      if (sheetOverlay) {
        const sheet = document.querySelector('[data-demo-sheet="wc-sheet"]')
        closeOverlay(sheet, sheetOverlay)
      }
    })
  }
}
