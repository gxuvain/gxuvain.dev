;(function () {
  var preference = 'System'
  try {
    var stored = localStorage.getItem('theme-preference')
    if (stored === 'Dark' || stored === 'Light') preference = stored
  } catch {
    preference = 'System'
  }

  var isDark =
    preference === 'Dark' ||
    (preference === 'System' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  var theme = isDark ? 'Dark' : 'Light'
  document.documentElement.dataset.theme = theme

  var themeColor = document.querySelector('meta[name="theme-color"]')
  if (themeColor) {
    themeColor.setAttribute('content', isDark ? '#161616' : '#faf9f6')
  }
})()
