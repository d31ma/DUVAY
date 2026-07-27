export default class extends Tac {
  loadItems(event, limit, batchSize) {
    const list = event.currentTarget.querySelector('.w-list')
    const first = list.children.length + 1
    let markup = ''

    for (let offset = 0; offset < batchSize; offset += 1) {
      markup += `<div class="w-list-item">Item ${first + offset}</div>`
    }

    list.insertAdjacentHTML('beforeend', markup)
    event.detail.done(list.children.length >= limit ? 'empty' : 'ok')
  }

  loadAfterRetry(event) {
    const scroller = event.currentTarget
    const attempt = Number(scroller.dataset.attempt || 0) + 1
    scroller.dataset.attempt = String(attempt)

    if (attempt === 1) {
      event.detail.done('error')
      return
    }

    scroller.querySelector('.w-list').insertAdjacentHTML(
      'beforeend',
      '<div class="w-list-item">Loaded after retry</div>',
    )
    event.detail.done('empty')
  }
}
