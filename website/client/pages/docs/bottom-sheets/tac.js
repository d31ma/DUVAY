export default class extends Tac {
  setSheetOpen(name, open, component = false) {
    const prefix = component ? 'bottom-sheet' : 'sheet'
    const sheet = document.querySelector(`[data-${prefix}="${name}"]`)
    const scrim = document.querySelector(`[data-${prefix}-scrim="${name}"]`)

    if (component) {
      sheet?.toggleAttribute('open', open)
    } else {
      sheet?.classList.toggle('open', open)
      sheet?.setAttribute('aria-hidden', String(!open))
    }
    scrim?.classList.toggle('open', open)
  }
}
