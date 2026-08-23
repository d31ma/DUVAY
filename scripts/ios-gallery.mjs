#!/usr/bin/env bun
// DuVay — build, install and launch the iOS gallery on a simulator.
//
// SwiftPM cannot emit an iOS .app bundle and the repo has no .xcodeproj, so the
// modules are compiled directly with swiftc against the simulator SDK and the
// bundle is assembled by hand. That keeps the repo free of a checked-in Xcode
// project whose only purpose is a dev harness.
//
// The gallery is an internal harness, not a product — see CROSS-PLATFORM-PLAN.md.
//
//   bun scripts/ios-gallery.mjs            build + install + launch
//   bun scripts/ios-gallery.mjs --build    build only

import { $ } from 'bun';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const APPLE = join(ROOT, 'apple');
const OUT = process.env.DUVAY_SWIFT_BUILD
  ? join(process.env.DUVAY_SWIFT_BUILD, 'gallery-ios')
  : join(APPLE, '.build', 'gallery-ios');

const BUNDLE_ID = 'ma.del.duvay.gallery';
const TARGET = 'arm64-apple-ios17.0-simulator';

const sdk = (await $`xcrun --sdk iphonesimulator --show-sdk-path`.text()).trim();

/** Compile one module to a .swiftmodule plus an object file. */
async function buildModule(name, sources, searchPaths) {
  // Args are passed as one array: Bun's shell treats a newline inside a
  // template literal as a command separator, not as whitespace.
  const args = [
    'swiftc',
    '-target', TARGET, '-sdk', sdk,
    '-swift-version', '6',
    // Without this a single-file module is compiled as a script and emits its
    // own `main`, which then collides with the app's at link time.
    '-parse-as-library',
    // Whole-module: without it swiftc emits one object per source file and
    // then refuses a single -o.
    '-wmo',
    '-module-name', name,
    '-emit-module', '-emit-module-path', join(OUT, `${name}.swiftmodule`),
    '-c', '-o', join(OUT, `${name}.o`),
    ...searchPaths.flatMap((p) => ['-I', p]),
    ...sources,
  ];
  await $`xcrun ${args}`.quiet();
  console.log(`  ✓ ${name}`);
}

const swift = async (dir) =>
  (await Array.fromAsync(new Bun.Glob('**/*.swift').scan({ cwd: dir, absolute: true }))).sort();

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

console.log(`→ compiling for ${TARGET}`);
await buildModule('DuVayTokens', await swift(join(APPLE, 'Sources/DuVayTokens')), []);
await buildModule('DuVayCore', await swift(join(APPLE, 'Sources/DuVayCore')), []);
await buildModule('DuVay', await swift(join(APPLE, 'Sources/DuVay')), [OUT]);

// The app is compiled and linked in one step; `-parse-as-library` is required
// because @main lives in a file called something other than main.swift.
const app = join(OUT, 'Gallery.app');
await mkdir(app, { recursive: true });
console.log('→ linking app');
const linkArgs = [
  'swiftc',
  '-target', TARGET, '-sdk', sdk,
  '-swift-version', '6',
  '-parse-as-library',
  '-I', OUT,
  join(OUT, 'DuVayTokens.o'), join(OUT, 'DuVayCore.o'), join(OUT, 'DuVay.o'),
  ...(await swift(join(APPLE, 'Gallery'))),
  '-o', join(app, 'Gallery'),
];
await $`xcrun ${linkArgs}`.quiet();

await writeFile(join(app, 'Info.plist'), `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleExecutable</key><string>Gallery</string>
  <key>CFBundleIdentifier</key><string>${BUNDLE_ID}</string>
  <key>CFBundleName</key><string>DuVay Gallery</string>
  <key>CFBundleDisplayName</key><string>DuVay</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>LSRequiresIPhoneOS</key><true/>
  <key>MinimumOSVersion</key><string>17.0</string>
  <key>UILaunchScreen</key><dict/>
  <key>UISupportedInterfaceOrientations</key>
  <array><string>UIInterfaceOrientationPortrait</string></array>
</dict>
</plist>
`);
console.log(`✓ built ${app}`);

if (process.argv.includes('--build')) process.exit(0);

const booted = (await $`xcrun simctl list devices booted -j`.json()).devices;
const device = Object.values(booted).flat()[0];
if (!device) {
  console.error('✗ no booted simulator — boot one with `xcrun simctl boot <udid>`');
  process.exit(1);
}
console.log(`→ installing on ${device.name} (${device.udid})`);
await $`xcrun simctl install ${device.udid} ${app}`.quiet();
await $`xcrun simctl launch ${device.udid} ${BUNDLE_ID}`.quiet();
console.log(`✓ launched ${BUNDLE_ID}`);
