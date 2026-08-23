// @ts-check
export default class {
  /** Clear the textarea this clear-button belongs to. */
  clearTextarea(event) {
    const field = event.currentTarget.previousElementSibling?.querySelector('textarea')
    if (!field) return
    field.value = ''
    // Let listeners (character counter, validation) observe the change.
    field.dispatchEvent(new Event('input', { bubbles: true }))
    field.focus()
  }
}
