export default class extends Tac {
  onMount() {
    document.title = 'Command — DuVay Documentation'

    // Delegated so it works no matter when the demo button mounts: a click on
    // any [data-open-command] opens the command element it names.
    document.addEventListener('click', function (event) {
      const btn = event.target.closest && event.target.closest('[data-open-command]')
      if (!btn) return
      const el = document.getElementById(btn.getAttribute('data-open-command'))
      if (el && typeof el.show === 'function') el.show()
    })
  }
}
