export default class SendStatusDemo {
  static sendDelayMs = 700
  static failDelayMs = 600

  /** @param {Element} row @param {Element} demo */
  static retry(row, demo) {
    row.querySelector('w-send-status')?.setAttribute('state', 'sending')
    setTimeout(() => SendStatusDemo.remove(row, demo), SendStatusDemo.sendDelayMs)
  }

  /** @param {Element} row @param {Element} demo */
  static remove(row, demo) {
    row.toggleAttribute('hidden', true)
    SendStatusDemo.showEmptyWhenDone(demo)
  }

  /** @param {Element} demo */
  static showEmptyWhenDone(demo) {
    const empty = demo.querySelector('w-list-item:not([hidden])') === null
    demo.querySelector('[data-attention-list]')?.toggleAttribute('hidden', empty)
    demo.querySelector('[data-attention-empty]')?.toggleAttribute('hidden', !empty)
  }

  /** @param {Element} demo */
  static failAgain(demo) {
    const rows = demo.querySelectorAll('[data-attention-list] w-list-item')
    rows.forEach((row) => SendStatusDemo.sendAgain(row))
    SendStatusDemo.showEmptyWhenDone(demo)
    setTimeout(() => {
      rows.forEach((row) => row.querySelector('w-send-status')?.setAttribute('state', 'failed'))
    }, SendStatusDemo.failDelayMs)
  }

  /** @param {Element} row */
  static sendAgain(row) {
    row.toggleAttribute('hidden', false)
    row.querySelector('w-send-status')?.setAttribute('state', 'sending')
  }
}
