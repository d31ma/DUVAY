#!/usr/bin/env bun
// DuVay — run every native platform's conformance suite
//
// The plan's CI matrix runs these on a macOS runner (Swift), Ubuntu (Gradle,
// Rust) and Windows (WinUI). This script runs whichever are available locally
// and reports the rest as skipped rather than silently passing — a suite that
// did not run is not a suite that passed.
//
// Toolchains live on the ANNEX drive; source its environment first:
//   source /Volumes/ANNEX/toolchains/duvay-env.sh
//   bun scripts/native-verify.mjs

import { $ } from 'bun';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

const PLATFORMS = [
  {
    name: 'apple',
    tool: 'swift',
    cwd: 'apple',
    // --scratch-path keeps SwiftPM's .build off the system drive.
    run: () => $`swift test --scratch-path ${process.env.DUVAY_SWIFT_BUILD ?? '.build'}`.cwd(join(ROOT, 'apple')).quiet(),
  },
  {
    name: 'android',
    tool: 'gradle',
    cwd: 'android',
    run: () => $`gradle :duvay-core:test --console=plain -q`.cwd(join(ROOT, 'android')).quiet(),
  },
  {
    name: 'linux',
    tool: 'cargo',
    cwd: 'linux',
    run: () => $`cargo test --test conformance -q`.cwd(join(ROOT, 'linux')).quiet(),
  },
  {
    name: 'windows',
    tool: 'dotnet',
    cwd: 'windows',
    run: () => $`dotnet test DuVay.Core.Tests/DuVay.Core.Tests.csproj --nologo -v q`.cwd(join(ROOT, 'windows')).quiet(),
  },
];

async function available(tool) {
  try {
    await $`which ${tool}`.quiet();
    return true;
  } catch {
    return false;
  }
}

const results = [];
for (const platform of PLATFORMS) {
  if (!(await available(platform.tool))) {
    results.push({ ...platform, status: 'skipped', note: `${platform.tool} not on PATH` });
    continue;
  }
  const started = performance.now();
  try {
    await platform.run();
    results.push({ ...platform, status: 'passed', ms: performance.now() - started });
  } catch (err) {
    const output = [err.stdout?.toString(), err.stderr?.toString()].filter(Boolean).join('\n');
    results.push({ ...platform, status: 'failed', ms: performance.now() - started, output });
  }
}

console.log('\nnative conformance\n');
for (const r of results) {
  const mark = { passed: '✓', failed: '✗', skipped: '·' }[r.status];
  const timing = r.ms ? `${(r.ms / 1000).toFixed(1)}s` : '';
  console.log(`  ${mark} ${r.name.padEnd(9)} ${r.status.padEnd(8)} ${timing.padStart(6)}  ${r.note ?? ''}`);
}

const failed = results.filter((r) => r.status === 'failed');
for (const r of failed) {
  console.error(`\n─── ${r.name} ───\n${r.output?.slice(-2000) ?? '(no output)'}`);
}

const passed = results.filter((r) => r.status === 'passed').length;
const skipped = results.filter((r) => r.status === 'skipped').length;
console.log(`\n${passed} passed · ${failed.length} failed · ${skipped} skipped`);

if (failed.length) process.exit(1);
if (skipped) {
  console.log('\nSkipped platforms did not run — that is not the same as passing.');
}
