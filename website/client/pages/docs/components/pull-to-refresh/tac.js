// @ts-check
export default class {
  /** The demo has nothing to fetch, so it completes the gesture immediately. */
  finishRefresh(event) {
    event.detail.done()
  }
}
