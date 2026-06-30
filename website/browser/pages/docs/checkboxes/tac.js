export default class extends Tac {
  onMount() {
    document.title = 'Checkboxes — DuVay Documentation'

    // Set indeterminate state on the mixed-state checkbox demo.
    const setMixed = function () {
      document.querySelectorAll('[data-demo-mixed]').forEach(function (el) {
        const input = el.tagName === 'DUVAY-CHECKBOX'
          ? el.querySelector('input[type="checkbox"]')
          : el
        if (input) input.indeterminate = true
      })
    }
    setMixed()
    requestAnimationFrame(setMixed)

    // Echo native checked state back to the page.
    const updateBool = function (value) {
      const cssDisplay = document.getElementById('demo-bool-value-css')
      const wcDisplay = document.getElementById('demo-bool-value-wc')
      if (cssDisplay) cssDisplay.textContent = value
      if (wcDisplay) wcDisplay.textContent = value
    }

    document.addEventListener('change', function (event) {
      const target = event.target
      if (!target || !target.hasAttribute('data-demo-bool')) return
      if (target.tagName === 'INPUT' && target.type === 'checkbox') {
        updateBool(target.checked ? 'yes' : 'no')
      }
    })

    document.addEventListener('change', function (event) {
      const target = event.target
      if (!target || !target.hasAttribute('data-demo-bool')) return
      if (target.tagName === 'W-CHECKBOX' && event.detail) {
        updateBool(event.detail.checked ? 'yes' : 'no')
      }
    })
  }
}
