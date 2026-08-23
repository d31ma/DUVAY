// @ts-check
export default class {
  setSortBy(event) {
    document.getElementById('di-sorted')?.setAttribute('sort-by', event.detail.value)
  }
}
