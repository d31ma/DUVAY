#!/usr/bin/env bun
// DuVay — Windows native gate
//
// WinUI 3 and the Windows App SDK cannot be built on macOS, so the Windows
// half of Phase 4 runs on a real Windows machine over SSH. This ships the
// contract-bearing sources across and runs the conformance suite there.
//
// The host is `tachyon-win` in ~/.ssh/config. Nothing is installed on the
// remote beyond what its .NET SDK already provides, and the working copy lives
// under the remote user's home rather than anywhere system-wide.
//
//   bun scripts/windows-gate.mjs             sync + test
//   bun scripts/windows-gate.mjs --no-sync   test only, using what is there

import { $ } from 'bun';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { rm, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const HOST = process.env.DUVAY_WIN_HOST ?? 'tachyon-win';
const REMOTE = 'duvay'; // relative to the remote user's home

// Only what the gate needs: the shared contract and the .NET projects. The web
// framework, docs site and other platforms are deliberately not shipped.
const PAYLOAD = ['spec', 'windows'];

const sync = !process.argv.includes('--no-sync');

/** Run a command on the remote and return its combined output. */
async function remote(command) {
  const result = await $`ssh -o BatchMode=yes ${HOST} ${command}`.quiet().nothrow();
  const text = [result.stdout?.toString(), result.stderr?.toString()]
    .filter(Boolean)
    .join('\n')
    // The client prints a post-quantum advisory on every connection.
    .split('\n')
    .filter((l) => !/WARNING: connection is not using|store now, decrypt later|openssh\.com\/pq/.test(l))
    .join('\n');
  return { code: result.exitCode, text };
}

if (sync) {
  console.log(`→ syncing ${PAYLOAD.join(', ')} to ${HOST}:~/${REMOTE}`);

  // Exclude build output so the remote rebuilds from clean sources; bin/obj
  // from a macOS build would otherwise confuse the Windows SDK.
  const archive = `${tmpdir()}/duvay-windows-gate.tar.gz`;
  // COPYFILE_DISABLE stops bsdtar writing AppleDouble `._name` companions for
  // extended attributes. The repo lives on Dropbox, which sets them on every
  // file, and the C# compiler rejects them as binary source.
  await $`COPYFILE_DISABLE=1 tar -cz --exclude=bin --exclude=obj --exclude=.DS_Store --exclude=._\* -C ${ROOT} -f ${archive} ${PAYLOAD}`.quiet();

  const prep = await remote(`if not exist ${REMOTE} mkdir ${REMOTE}`);
  if (prep.code !== 0) {
    console.error(prep.text);
    process.exit(1);
  }

  // tar.exe on Windows reads the archive from stdin with -x -z -f -.
  const push = await $`ssh -o BatchMode=yes ${HOST} tar -xz -f - -C ${REMOTE} < ${archive}`.quiet().nothrow();
  if (push.exitCode !== 0) {
    console.error(push.stderr?.toString());
    process.exit(1);
  }
  const { size } = await stat(archive);
  console.log(`✓ synced (${(size / 1024).toFixed(0)} KiB)`);
}

console.log(`→ running conformance on ${HOST}`);
// The machine's system-wide SDK is .NET 8, which cannot even restore a project
// that multi-targets net9.0. A 9.0 SDK is installed per-user under
// %USERPROFILE%\.dotnet9 (no admin, nothing system-wide) and is put first on
// PATH here so the remote matches the local toolchain exactly.
const DOTNET = '%USERPROFILE%\\.dotnet9';
const env = `set "PATH=${DOTNET};%PATH%" && set "DOTNET_ROOT=${DOTNET}" && cd ${REMOTE}\\windows`;
const test = await remote(`${env} && dotnet test DuVay.Core.Tests\\DuVay.Core.Tests.csproj --nologo`);
console.log(test.text.trim());
if (test.code !== 0) {
  console.error('\n✗ windows-gate — conformance failed on the Windows host');
  process.exit(1);
}

// The WinUI 3 control library only builds on Windows, which is the reason this
// gate exists at all. A compile is the meaningful check here: rendering needs
// an interactive session, so it is not attempted over SSH.
console.log(`\n→ building the WinUI 3 control library on ${HOST}`);
// --no-incremental because the sync extracts sources with the archive's own
// timestamps, which can read as older than the remote's existing obj/ output.
// MSBuild then skips the compile and the gate validates a stale binary — it
// kept reporting a base-type change that had already been reverted.
const winui = await remote(`${env} && dotnet build DuVay\\DuVay.csproj --nologo -v m --no-incremental`);

console.log(winui.text.trim());
if (winui.code !== 0) {
  console.error('\n✗ windows-gate — the WinUI 3 control library failed to build');
  process.exit(1);
}

/* ── Control-surface snapshot ─────────────────────────────────────────────
 *
 * The built DLL comes back here rather than the snapshot tool going there: the
 * tool reads metadata tables and never loads the assembly, so it runs happily
 * on macOS, and keeping it local means the recording lives beside the rest of
 * the repo instead of on a host we do not control.
 *
 * This is a structural snapshot, not a visual one — see DuVay.Snapshots for
 * why a pixel suite cannot run over a non-interactive SSH session.
 */
console.log(`\n→ pulling DuVay.dll back from ${HOST} for the control-surface snapshot`);
const dllPath = join(ROOT, '.duvay-winui.dll');

// Ask the host where it put the DLL rather than hard-coding a configuration
// and framework moniker that the SDK is free to change.
const located = await remote(`cd ${REMOTE}\\windows && dir /s /b DuVay\\bin\\DuVay.dll`);
const remoteDll = located.text.split('\n').map((l) => l.trim()).filter(Boolean)[0];
if (located.code !== 0 || !remoteDll) {
  console.error('\n✗ windows-gate — could not locate DuVay.dll on the host');
  process.exit(1);
}

// scp resolves the remote path through the remote shell, which treats a
// backslash as an escape. Windows accepts forward slashes everywhere.
const scpPath = remoteDll.replace(/\\/g, '/');
const pull = await $`scp -q -o BatchMode=yes ${`${HOST}:${scpPath}`} ${dllPath}`.quiet().nothrow();
if (pull.exitCode !== 0) {
  console.error(pull.stderr?.toString());
  console.error('\n✗ windows-gate — could not retrieve DuVay.dll from the host');
  process.exit(1);
}

const mode = process.env.DUVAY_RECORD_SNAPSHOTS === '1' ? '--record' : '--check';
const snapshot = await $`dotnet run --project ${join(ROOT, 'windows', 'DuVay.Snapshots', 'DuVay.Snapshots.csproj')} -v q -- ${dllPath} ${mode}`
  .quiet().nothrow();
await rm(dllPath, { force: true });

console.log(snapshot.text().trim() || snapshot.stderr.toString().trim());
if (snapshot.exitCode !== 0) {
  console.error('\n✗ windows-gate — the WinUI control surface changed');
  process.exit(1);
}

console.log('\n✓ windows-gate — conformance passes, the WinUI 3 library builds, and its control surface matches');
