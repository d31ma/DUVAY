// Interactive behaviour for the component docs pages.
//
// TACHYON allows no script beside a page or component (ADR 0029, ADR 0030), so
// the demos are wired here, like directive-demos.js: one document-level
// listener per event, matched by data attributes in the page markup. This
// survives client navigation and does not depend on when a demo mounts.

import SendStatusDemo from './send-status-demo.js'

class PageDemos {
  /** @returns {void} */
  static start() {
    if (window.__wPageDemos) return
    window.__wPageDemos = true
    document.addEventListener('click', (event) => PageDemos.click(event))
    document.addEventListener('change', (event) => PageDemos.change(event))
    document.addEventListener('input', (event) => PageDemos.input(event))
    document.addEventListener('load', (event) => PageDemos.load(event), true)
  }

  /**
   * @param {EventTarget | null} target
   * @param {string} selector
   * @returns {Element | null}
   */
  static closest(target, selector) {
    if (!(target instanceof Element)) return null
    return target.closest(selector)
  }

  /** @param {Event} event */
  static click(event) {
    PageDemos.toggleSheet(PageDemos.closest(event.target, '[data-demo-sheet-toggle]'))
    PageDemos.showToast(PageDemos.closest(event.target, '[data-demo-toast]'))
    PageDemos.jump(PageDemos.closest(event.target, '[data-demo-jump]'))
    PageDemos.clearTextarea(PageDemos.closest(event.target, '[data-demo-clear-textarea]'))
    PageDemos.openCommand(PageDemos.closest(event.target, '[data-open-command]'))
    PageDemos.dialogClick(event)
    PageDemos.sheetClick(event)
    PageDemos.attentionClick(event)
  }

  /** @param {Event} event */
  static change(event) {
    PageDemos.sortBy(event)
    PageDemos.syncTabs(event)
    PageDemos.echoChecked(event)
  }

  /** @param {Event} event */
  static input(event) {
    const field = PageDemos.closest(event.target, '[data-demo-search-target]')
    if (!field || !(event instanceof CustomEvent)) return
    const table = document.getElementById(String(field.getAttribute('data-demo-search-target')))
    table?.setAttribute('search', event.detail.value)
  }

  /** @param {Event} event */
  static load(event) {
    if (!(event instanceof CustomEvent) || !(event.target instanceof Element)) return
    const scroller = event.target
    if (scroller.hasAttribute('data-demo-refresh')) event.detail.done()
    if (scroller.hasAttribute('data-demo-load-batch')) PageDemos.loadItems(event, scroller)
    if (scroller.hasAttribute('data-demo-load-retry')) PageDemos.loadAfterRetry(event, scroller)
  }

  /** @param {Element | null} button */
  static toggleSheet(button) {
    if (!button) return
    const name = button.getAttribute('data-demo-sheet-toggle')
    const open = button.getAttribute('data-demo-open') === 'true'
    if (button.hasAttribute('data-demo-component')) {
      document.querySelector(`[data-bottom-sheet="${name}"]`)?.toggleAttribute('open', open)
      document.querySelector(`[data-bottom-sheet-scrim="${name}"]`)?.classList.toggle('open', open)
      return
    }
    const sheet = document.querySelector(`[data-sheet="${name}"]`)
    sheet?.classList.toggle('open', open)
    sheet?.setAttribute('aria-hidden', String(!open))
    document.querySelector(`[data-sheet-scrim="${name}"]`)?.classList.toggle('open', open)
  }

  /** @param {Element | null} button */
  static showToast(button) {
    if (!button) return
    const duration = button.getAttribute('data-demo-toast-duration')
    globalThis.WToast?.(button.getAttribute('data-demo-toast'), duration ? Number(duration) : undefined)
  }

  /** @param {Element | null} button */
  static jump(button) {
    if (!button) return
    const scroller = document.getElementById(String(button.getAttribute('data-demo-jump-target')))
    scroller?.scrollToIndex(Number(button.getAttribute('data-demo-jump')))
  }

  /** @param {Element | null} button */
  static clearTextarea(button) {
    const field = button?.previousElementSibling?.querySelector('textarea')
    if (!field) return
    field.value = ''
    field.dispatchEvent(new Event('input', { bubbles: true }))
    field.focus()
  }

  /** @param {Element | null} button */
  static openCommand(button) {
    if (!button) return
    const command = document.getElementById(String(button.getAttribute('data-open-command')))
    if (command && typeof command.show === 'function') command.show()
  }

  /** @param {Event} event */
  static sortBy(event) {
    const control = PageDemos.closest(event.target, '[data-demo-sort-target]')
    if (!control || !(event instanceof CustomEvent)) return
    const iterator = document.getElementById(String(control.getAttribute('data-demo-sort-target')))
    iterator?.setAttribute('sort-by', event.detail.value)
  }

  /** @param {Event} event */
  static syncTabs(event) {
    const tabs = PageDemos.closest(event.target, 'w-tabs[data-window]')
    if (!tabs || !(event instanceof CustomEvent)) return
    const panels = document.getElementById(String(tabs.getAttribute('data-window')))
    const values = Array.from(tabs.querySelectorAll('w-tab'), (tab) => tab.getAttribute('value'))
    const index = values.indexOf(event.detail.value)
    if (panels && index >= 0) panels.value = index
  }

  /** @param {Event} event */
  static echoChecked(event) {
    const target = event.target
    if (!(target instanceof Element) || !target.hasAttribute('data-demo-bool')) return
    const checked = PageDemos.checkedValue(event, target)
    if (checked === null) return
    for (const id of ['demo-bool-value-css', 'demo-bool-value-wc']) {
      const display = document.getElementById(id)
      if (display) display.textContent = checked ? 'yes' : 'no'
    }
  }

  /**
   * @param {Event} event
   * @param {Element} target
   * @returns {boolean | null}
   */
  static checkedValue(event, target) {
    if (target instanceof HTMLInputElement && target.type === 'checkbox') return target.checked
    if (target.tagName === 'W-CHECKBOX' && event instanceof CustomEvent && event.detail) return Boolean(event.detail.checked)
    return null
  }

  /**
   * @param {CustomEvent} event
   * @param {Element} scroller
   */
  static loadItems(event, scroller) {
    const waiting = scroller.querySelectorAll('.w-list-item[hidden]')
    const shown = Math.min(Number(scroller.getAttribute('data-demo-load-batch')), waiting.length)
    for (let index = 0; index < shown; index += 1) waiting[index].toggleAttribute('hidden', false)
    event.detail.done(shown < waiting.length ? 'ok' : 'empty')
  }

  /**
   * @param {CustomEvent} event
   * @param {Element} scroller
   */
  static loadAfterRetry(event, scroller) {
    const attempt = Number(scroller.getAttribute('data-demo-attempt') || 0) + 1
    scroller.setAttribute('data-demo-attempt', String(attempt))
    if (attempt === 1) {
      event.detail.done('error')
      return
    }
    scroller.querySelector('.w-list-item[hidden]')?.toggleAttribute('hidden', false)
    event.detail.done('empty')
  }

  /**
   * @param {Element | null} target
   * @param {Element | null} overlay
   * @param {boolean} open
   */
  static showOverlay(target, overlay, open) {
    target?.classList.toggle('open', open)
    target?.setAttribute('aria-hidden', String(!open))
    overlay?.classList.toggle('open', open)
  }

  /**
   * The CSS-only dialog and sheet demos: an opener, an overlay named
   * `<id>-overlay`, and close buttons inside the panel.
   *
   * @param {Event} event
   * @param {string} id
   * @param {string} openAttribute
   * @param {string} closeAttribute
   */
  static cssOverlayClick(event, id, openAttribute, closeAttribute) {
    const target = document.getElementById(id)
    const overlay = document.getElementById(`${id}-overlay`)
    if (PageDemos.closest(event.target, `[${openAttribute}="${id}"]`)) PageDemos.showOverlay(target, overlay, true)
    if (PageDemos.closest(event.target, `#${id}-overlay`)) PageDemos.showOverlay(target, overlay, false)
    if (PageDemos.closest(event.target, `#${id} [${closeAttribute}]`)) PageDemos.showOverlay(target, overlay, false)
  }

  /** @param {Event} event */
  static dialogClick(event) {
    PageDemos.cssOverlayClick(event, 'demo-dialog', 'w-dialog-open', 'w-dialog-close')
    const opener = PageDemos.closest(event.target, '[data-demo-dialog-open]')
    const closer = PageDemos.closest(event.target, '[data-demo-dialog-close]')
    const opened = opener && document.querySelector(`[data-demo-dialog="${opener.getAttribute('data-demo-dialog-open')}"]`)
    const closed = closer && document.querySelector(`[data-demo-dialog="${closer.getAttribute('data-demo-dialog-close')}"]`)
    if (opened && typeof opened.show === 'function') opened.show()
    if (closed && typeof closed.close === 'function') closed.close()
  }

  /** @param {Event} event */
  static sheetClick(event) {
    PageDemos.cssOverlayClick(event, 'demo-sheet', 'w-sheet-open', 'w-sheet-close')
    const opener = PageDemos.closest(event.target, '[data-demo-sheet-open]')
    const closer = PageDemos.closest(event.target, '[data-demo-sheet-close]')
    const scrim = PageDemos.closest(event.target, '[data-demo-sheet-overlay="wc-sheet"]')
    if (opener) PageDemos.namedSheet(opener.getAttribute('data-demo-sheet-open'), true)
    if (closer) PageDemos.namedSheet(closer.getAttribute('data-demo-sheet-close'), false)
    if (scrim) PageDemos.namedSheet('wc-sheet', false)
  }

  /**
   * @param {string | null} name
   * @param {boolean} open
   */
  static namedSheet(name, open) {
    const sheet = document.querySelector(`[data-demo-sheet="${name}"]`)
    const overlay = document.querySelector(`[data-demo-sheet-overlay="${name}"]`)
    PageDemos.showOverlay(sheet, overlay, open)
  }

  /** @param {Event} event */
  static attentionClick(event) {
    const demo = PageDemos.closest(event.target, '[data-attention-demo]')
    if (!demo) return
    const row = PageDemos.closest(event.target, 'w-list-item')
    if (PageDemos.closest(event.target, '[data-attention-reset]')) SendStatusDemo.failAgain(demo)
    if (row && PageDemos.closest(event.target, '[data-attention-retry]')) SendStatusDemo.retry(row, demo)
    if (row && PageDemos.closest(event.target, '[data-attention-discard]')) SendStatusDemo.remove(row, demo)
  }
}

PageDemos.start()
