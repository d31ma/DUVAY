import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @typedef {{ entry: string, url: string }} Bundle
 * @typedef {{ package: string, version: string, license: string, sha256: string }} Source
 */
export class SiteAssets {
  static WEBSITE = dirname(dirname(fileURLToPath(import.meta.url)));
  static ROOT = dirname(SiteAssets.WEBSITE);
  static OUTPUT_URL = '/shared/assets/duvay/';
  static OUTPUT = join(SiteAssets.WEBSITE, 'client', 'shared', 'assets', 'duvay');
  static TEMPLATE = join(SiteAssets.WEBSITE, 'site', 'manifest.json');
  static MANIFEST = join(SiteAssets.WEBSITE, 'client', 'manifest.json');
  static SIZES = join(SiteAssets.ROOT, 'dist', 'sizes.json');
  static SIZES_COPY = join(SiteAssets.WEBSITE, 'client', 'shared', 'data', 'sizes.json');
  static PACKAGE = 'duvay';
  static LICENSE = 'MIT';

  /** @type {Bundle[]} */
  static SCRIPTS = [
    { entry: 'src/duvay.js', url: 'duvay.min.js' },
    { entry: 'src/duvay-wc.js', url: 'duvay-wc.min.js' },
    { entry: 'src/duvay-directives.js', url: 'duvay-directives.min.js' },
    { entry: 'website/site/scripts/site.js', url: 'duvay-docs.min.js' },
  ];

  /** @type {Bundle[]} */
  static STYLES = [
    { entry: 'website/site/styles/app.css', url: 'duvay-docs.min.css' },
  ];

  /** @returns {Promise<void>} */
  static async build() {
    await rm(SiteAssets.OUTPUT, { recursive: true, force: true });
    await mkdir(SiteAssets.OUTPUT, { recursive: true });
    const version = await SiteAssets.version();
    const scripts = await SiteAssets.bundleAll(SiteAssets.SCRIPTS, version);
    const styles = await SiteAssets.bundleAll(SiteAssets.STYLES, version);
    await SiteAssets.writeManifest(version, scripts, styles);
    await SiteAssets.copySizes();
  }

  /** @returns {Promise<string>} */
  static async version() {
    const text = await readFile(join(SiteAssets.ROOT, 'package.json'), 'utf8');
    return JSON.parse(text).version;
  }

  /**
   * @param {Bundle[]} bundles
   * @param {string} version
   * @returns {Promise<Record<string, Source>>}
   */
  static async bundleAll(bundles, version) {
    /** @type {Record<string, Source>} */
    const sources = {};
    for (const bundle of bundles) {
      sources[SiteAssets.OUTPUT_URL + bundle.url] = await SiteAssets.bundleOne(bundle, version);
    }
    return sources;
  }

  /**
   * @param {Bundle} bundle
   * @param {string} version
   * @returns {Promise<Source>}
   */
  static async bundleOne(bundle, version) {
    const result = await Bun.build({
      entrypoints: [join(SiteAssets.ROOT, bundle.entry)],
      target: 'browser',
      format: 'esm',
      minify: true,
    });
    SiteAssets.requireSuccess(bundle, result);
    const bytes = new Uint8Array(await result.outputs[0].arrayBuffer());
    await writeFile(join(SiteAssets.OUTPUT, bundle.url), bytes);
    console.log(`[duvay] ${bundle.url} ${(bytes.length / 1024).toFixed(1)} KiB from ${bundle.entry}`);
    return SiteAssets.source(bytes, version);
  }

  /**
   * @param {Bundle} bundle
   * @param {Bun.BuildOutput} result
   * @returns {void}
   */
  static requireSuccess(bundle, result) {
    if (result.success && result.outputs.length === 1) return;
    const problems = result.logs.map((log) => String(log)).join('\n');
    throw new Error(`[duvay] could not bundle ${bundle.entry}:\n${problems}`);
  }

  /**
   * @param {Uint8Array} bytes
   * @param {string} version
   * @returns {Source}
   */
  static source(bytes, version) {
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    return { package: SiteAssets.PACKAGE, version, license: SiteAssets.LICENSE, sha256 };
  }

  /**
   * @param {string} version
   * @param {Record<string, Source>} scripts
   * @param {Record<string, Source>} styles
   * @returns {Promise<void>}
   */
  static async writeManifest(version, scripts, styles) {
    const manifest = JSON.parse(await readFile(SiteAssets.TEMPLATE, 'utf8'));
    manifest.tac.scriptSources = scripts;
    manifest.tac.styleSources = SiteAssets.vendorStyles(styles);
    await writeFile(SiteAssets.MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`[duvay] wrote client/manifest.json for DuVay ${version}`);
  }

  /**
   * @param {Record<string, Source>} styles
   * @returns {Record<string, Source & { kind: string }>}
   */
  static vendorStyles(styles) {
    /** @type {Record<string, Source & { kind: string }>} */
    const declared = {};
    for (const [url, source] of Object.entries(styles)) declared[url] = { kind: 'vendor', ...source };
    return declared;
  }

  /** @returns {Promise<void>} */
  static async copySizes() {
    await mkdir(dirname(SiteAssets.SIZES_COPY), { recursive: true });
    const found = await SiteAssets.exists(SiteAssets.SIZES);
    if (!found) {
      console.log('[duvay] dist/sizes.json not found: run `bun run build` at the repository root for the size labels');
      await rm(SiteAssets.SIZES_COPY, { force: true });
      return;
    }
    await copyFile(SiteAssets.SIZES, SiteAssets.SIZES_COPY);
  }

  /**
   * @param {string} path
   * @returns {Promise<boolean>}
   */
  static async exists(path) {
    return stat(path).then(() => true, () => false);
  }
}

if (import.meta.main) {
  SiteAssets.build().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
