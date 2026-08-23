// @ts-check
export default class {
  setSearch(event) {
    document.getElementById('dt-search')?.setAttribute('search', event.detail.value)
  }
}
