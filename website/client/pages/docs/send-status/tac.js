// @ts-check
export default class SendStatusPage {
  static sendDelayMs = 700
  static failDelayMs = 600
  static listening = false
  static rows = [
    { id: 'attention-1', title: 'Lunch on Friday?', subtitle: 'Chat with Ana', reason: 'The server refused the message.', retry: true },
    { id: 'attention-2', title: 'Quarterly report', subtitle: 'Mail to Finance', reason: 'Attachment too large.', retry: true },
    { id: 'attention-3', title: 'Moved the meeting to 3 pm', subtitle: 'Calendar: Team sync', reason: 'You no longer have access to this calendar.', retry: false },
  ]

  onMount() {
    document.title = 'Send status — DuVay Documentation'
    if (SendStatusPage.listening) return
    SendStatusPage.listening = true
    document.addEventListener('click', (event) => SendStatusPage.handleClick(event))
  }

  /** @param {Event} event */
  static handleClick(event) {
    const target = /** @type {Element} */ (event.target)
    const demo = target.closest?.('[data-attention-demo]')
    if (!demo) return
    const row = target.closest('w-list-item')
    if (target.closest('[data-attention-reset]')) SendStatusPage.failAgain(demo)
    if (row && target.closest('[data-attention-retry]')) SendStatusPage.retry(row, demo)
    if (row && target.closest('[data-attention-discard]')) SendStatusPage.remove(row, demo)
  }

  /** @param {Element} row @param {Element} demo */
  static retry(row, demo) {
    row.querySelector('w-send-status')?.setAttribute('state', 'sending')
    setTimeout(() => SendStatusPage.remove(row, demo), SendStatusPage.sendDelayMs)
  }

  /** @param {Element} row @param {Element} demo */
  static remove(row, demo) {
    row.remove()
    SendStatusPage.showEmptyWhenDone(demo)
  }

  /** @param {Element} demo */
  static showEmptyWhenDone(demo) {
    const empty = demo.querySelector('w-list-item') === null
    demo.querySelector('[data-attention-list]')?.toggleAttribute('hidden', empty)
    demo.querySelector('[data-attention-empty]')?.toggleAttribute('hidden', !empty)
  }

  /** @param {Element} demo */
  static failAgain(demo) {
    const slot = demo.querySelector('[data-attention-list] slot')
    if (!slot) return
    slot.innerHTML = SendStatusPage.rows.map((row) => SendStatusPage.rowMarkup(row)).join('')
    SendStatusPage.showEmptyWhenDone(demo)
    setTimeout(() => {
      slot.querySelectorAll('w-send-status').forEach((status) => status.setAttribute('state', 'failed'))
    }, SendStatusPage.failDelayMs)
  }

  /** @param {{id: string, title: string, subtitle: string, reason: string, retry: boolean}} row @returns {string} */
  static rowMarkup(row) {
    const describedBy = `aria-describedby="${row.id}-title"`
    const retry = row.retry ? `<w-btn slot="actions" size="small" variant="tonal" ${describedBy} data-attention-retry>Retry</w-btn>` : ''
    return `<w-list-item id="${row.id}" item-role="none" title="${row.title}" subtitle="${row.subtitle}">`
      + `<w-send-status state="sending" reason="${row.reason}">${retry}`
      + `<w-btn slot="actions" size="small" variant="text" ${describedBy} data-attention-discard>Discard</w-btn>`
      + '</w-send-status></w-list-item>'
  }
}
