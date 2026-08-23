// The site header is on every page, which makes it the load point for the
// site's global styles and behaviour. Tachyon 26.33 renders in the client and
// pulls each component's module on demand, so a shared import placed here runs
// exactly once per document, before anything below it mounts.
//
// The logo is authored as plain inline SVG; docs.js repairs its namespace along
// with every other inline SVG on the page.
import '../../../shared/scripts/imports.js'

export default class {}
