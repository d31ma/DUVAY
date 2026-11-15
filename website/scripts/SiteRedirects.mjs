import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export class SiteRedirects {
  static WEB_ROOT = join(dirname(dirname(fileURLToPath(import.meta.url))), 'dist', 'web');
  static SCRIPT_URL = '/shared/scripts/duvay-redirect.js';
  static CANONICAL = 'rel="canonical"';

  /** @type {Record<string, string>} */
  static MOVED = {
    '/docs/v-model': '/docs/w-model',
  };

  static SCRIPT = `var canonical = document.querySelector('link[rel="canonical"]');
if (canonical) {
  location.replace(canonical.getAttribute('href') + location.search + location.hash);
}
`;

  /**
   * @param {string} webRoot
   * @returns {Promise<number>}
   */
  static async write(webRoot = SiteRedirects.WEB_ROOT) {
    await SiteRedirects.writeFile(webRoot, SiteRedirects.SCRIPT_URL, SiteRedirects.SCRIPT);
    for (const [from, to] of Object.entries(SiteRedirects.MOVED)) {
      await SiteRedirects.writeStub(webRoot, from, to);
    }
    const count = Object.keys(SiteRedirects.MOVED).length;
    console.log(`[duvay] wrote ${count} redirect page(s)`);
    return count;
  }

  /**
   * @param {string} webRoot
   * @param {string} from
   * @param {string} to
   * @returns {Promise<void>}
   */
  static async writeStub(webRoot, from, to) {
    const page = join(SiteRedirects.relative(from), 'index.html');
    const existing = await readFile(join(webRoot, page), 'utf8').catch(() => null);
    SiteRedirects.refuseRealRoute(from, existing);
    await SiteRedirects.writeFile(webRoot, page, SiteRedirects.html(from, to));
  }

  /**
   * @param {string} from
   * @param {string | null} existing
   * @returns {void}
   */
  static refuseRealRoute(from, existing) {
    if (existing === null) return;
    if (existing.includes(SiteRedirects.CANONICAL)) return;
    throw new Error(`[duvay] redirect ${from} would overwrite a real route`);
  }

  /**
   * @param {string} webRoot
   * @param {string} path
   * @param {string} text
   * @returns {Promise<void>}
   */
  static async writeFile(webRoot, path, text) {
    const file = join(webRoot, SiteRedirects.relative(path));
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, text);
  }

  /**
   * @param {string} path
   * @returns {string}
   */
  static relative(path) {
    return path.replace(/^\//, '');
  }

  /**
   * @param {string} from
   * @param {string} to
   * @returns {string}
   */
  static html(from, to) {
    const target = to.endsWith('/') ? to : `${to}/`;
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moved to ${target}</title>
  <link rel="canonical" href="${target}">
  <meta name="robots" content="noindex">
  <script src="${SiteRedirects.SCRIPT_URL}"></script>
  <noscript><meta http-equiv="refresh" content="0; url=${target}"></noscript>
</head>
<body>
  <p><code>${from}</code> is now <a href="${target}">${target}</a>.</p>
</body>
</html>
`;
  }
}

if (import.meta.main) {
  SiteRedirects.write().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
