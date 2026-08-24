import { defineConfig } from './website/node_modules/@playwright/test/index.mjs';

/* One project per `w-os` value. A skin may change font, motion, elevation,
 * chrome heights, switch geometry, focus rings and scrollbars — all of which
 * components are asserted against — so behaviour that holds unskinned does not
 * automatically hold in a skin. The switch geometry regression is the worked
 * example: `.w-switch` owned its own track size, so the skins' values were
 * inherited but never applied, and nothing caught it.
 *
 * `web` is the empty attribute — DuVay's own look, no skin. The other five are
 * the operating-system names; the design-language aliases (material, fluent,
 * adwaita) resolve to the same rules, so testing one of each pair is enough. */
const OS_PROJECTS = ['web', 'ios', 'android', 'macos', 'windows', 'linux'];

export default defineConfig({
  testDir: './tests/components',
  testMatch: '**/*.spec.js',
  outputDir: './test-results/components',
  reporter: 'line',
  timeout: 30000,
  /* Running six projects saturates the machine, and a handful of hover/focus
   * specs race under that load — they pass in isolation and fail perhaps one
   * run in three. One retry absorbs that without hiding anything: Playwright
   * reports a test that only passes on retry as `flaky`, and a test that fails
   * twice still fails the run. */
  retries: 1,
  // Each worker spins up its own component test server (scope: 'worker') on a
  // random port, so the suite is safe to parallelize. Override with --workers.
  workers: '50%',
  use: {
    browserName: 'chromium',
    viewport: {
      width: 1280,
      height: 720,
    },
  },
  projects: OS_PROJECTS.map((name) => ({
    name,
    // 'web' means "no skin", which is the absent attribute, not the string.
    use: { duvayOs: name === 'web' ? '' : name },
  })),
});
