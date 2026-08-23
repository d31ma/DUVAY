// @ts-check
export default class {
  /** WToast is installed on window by the DuVay behaviour layer. */
  showToast(message, duration) {
    globalThis.WToast?.(message, duration)
  }
}
