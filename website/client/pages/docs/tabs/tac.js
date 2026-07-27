export default class extends Tac {
  onMount() {
    document.title = 'Tabs — DuVay Documentation'

    // Keep each tabs strip in sync with its content window. Delegated at the
    // document level so it works no matter which strip emits the event: on
    // change, move the window named by data-window to the selected index.
    document.addEventListener('change', function (event) {
      const tabs = event.target.closest && event.target.closest('w-tabs[data-window]')
      if (!tabs) return
      const win = document.getElementById(tabs.getAttribute('data-window'))
      if (!win) return
      const values = Array.from(tabs.querySelectorAll('w-tab')).map(function (tab) {
        return tab.getAttribute('value')
      })
      const index = values.indexOf(event.detail.value)
      if (index >= 0) win.value = index
    })
  }
}
