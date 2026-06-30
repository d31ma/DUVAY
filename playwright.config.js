import { defineConfig } from './website/node_modules/@playwright/test/index.mjs';

export default defineConfig({
  testDir: './tests/components',
  testMatch: '**/*.spec.js',
  outputDir: './test-results/components',
  reporter: 'line',
  timeout: 30000,
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
});
