class SiteDefaults {
  /** @type {string} */
  static THEME = 'w-theme'
  /** @type {string} */
  static DEFAULT_THEME = 'light'
  /** @type {string} */
  static SKIN = 'w-os'
  /** @type {string} */
  static DENSITY = 'w-density'
  /** @type {string} */
  static DENSE_SKIN = 'macos'
  /** @type {string} */
  static DENSE = 'compact'

  /**
   * @param {string} key
   * @returns {string | null}
   */
  static saved(key) {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }

  /** @returns {void} */
  static showTheme() {
    const theme = SiteDefaults.saved(SiteDefaults.THEME) ?? SiteDefaults.DEFAULT_THEME
    document.documentElement.setAttribute(SiteDefaults.THEME, theme)
  }

  /** @returns {void} */
  static showSkin() {
    const skin = SiteDefaults.saved(SiteDefaults.SKIN)
    if (skin === null) return
    document.documentElement.setAttribute(SiteDefaults.SKIN, skin)
    SiteDefaults.showDensity(skin)
  }

  /**
   * @param {string} skin
   * @returns {void}
   */
  static showDensity(skin) {
    if (skin === SiteDefaults.DENSE_SKIN) {
      document.documentElement.setAttribute(SiteDefaults.DENSITY, SiteDefaults.DENSE)
      return
    }
    document.documentElement.removeAttribute(SiteDefaults.DENSITY)
  }
}

SiteDefaults.showTheme()
SiteDefaults.showSkin()
