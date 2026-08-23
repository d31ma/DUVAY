// @ts-check
export default class {
  /**
   * Build the demo gradient with DOM calls.
   *
   * Tachyon 26.33 parses lowercase elements it does not know as components and
   * rejects SVG's <stop> (TY1402). Creating the nodes here keeps the rendered
   * example identical without fighting the compiler.
   */
  hydrate() {
    const NS = 'http://www.w3.org/2000/svg'
    const STOPS = [['0%', '#f72047'], ['50%', '#ffd200'], ['100%', '#1feaea']]

    for (const defs of document.querySelectorAll('[data-sparkline-gradient]')) {
      if (defs.firstElementChild) continue // already built

      const gradient = document.createElementNS(NS, 'linearGradient')
      gradient.setAttribute('id', String(defs.getAttribute('data-sparkline-gradient')))
      for (const [axis, value] of [['x1', '0'], ['y1', '0'], ['x2', '1'], ['y2', '0']]) {
        gradient.setAttribute(axis, value)
      }
      for (const [offset, color] of STOPS) {
        const stop = document.createElementNS(NS, 'stop')
        stop.setAttribute('offset', offset)
        stop.setAttribute('stop-color', color)
        gradient.appendChild(stop)
      }
      defs.appendChild(gradient)
    }
  }
}
