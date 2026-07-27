import { createHash } from 'node:crypto';
import { chmod, mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const TACHYON_VERSION = '26.30.04';
export const TACHYON_RELEASE = `https://github.com/d31ma/Tachyon/releases/download/v${TACHYON_VERSION}`;

export const TACHYON_ASSETS = Object.freeze({
  'darwin-arm64': {
    name: 'ty-macos-arm64',
    sha256: '3ebcf70c9b1a3ae1aae263dcf4d233f106514f63ca0fce676481353e394ebf82',
  },
  'darwin-x64': {
    name: 'ty-macos-x64',
    sha256: 'b6833bffa2080da731f616ce408e173ed3fbbf1bc1d33d85875833f39fa81feb',
  },
  'linux-arm64': {
    name: 'ty-linux-arm64',
    sha256: 'faf99370b7943a1cfce2872b43a94984c220b244285f3243076caaef07be5bf9',
  },
  'linux-x64': {
    name: 'ty-linux-x64',
    sha256: '0ccf5db78f196db3d9279b2a533a22e2413a146c91968775aa7c988d0c89f72d',
  },
  'win32-x64': {
    name: 'ty-windows-x64.exe',
    sha256: 'e012364b06fb4b1e26f3ebdb5ad10093e5355db6d5e5835e6c9d40ef3ec5c885',
  },
});

const websiteRoot = dirname(dirname(fileURLToPath(import.meta.url)));

export function releaseAsset(platform = process.platform, arch = process.arch) {
  const key = `${platform}-${arch}`;
  const asset = TACHYON_ASSETS[key];
  if (!asset) {
    throw new Error(`Tachyon ${TACHYON_VERSION} has no release binary for ${key}`);
  }
  return { ...asset, url: `${TACHYON_RELEASE}/${asset.name}` };
}

export function verifyReleaseMapping() {
  const assets = Object.values(TACHYON_ASSETS);
  if (assets.length !== 5 || new Set(assets.map(({ name }) => name)).size !== assets.length) {
    throw new Error('Tachyon release asset mapping is incomplete or duplicated');
  }
  for (const { name, sha256 } of assets) {
    if (!/^ty-(?:linux|macos|windows)-/.test(name) || !/^[a-f0-9]{64}$/.test(sha256)) {
      throw new Error(`Invalid pinned Tachyon release metadata for ${name}`);
    }
  }
  return true;
}

async function sha256(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex');
}

async function downloadVerifiedBinary(asset) {
  const path = resolve(websiteRoot, '.cache', 'tachyon', `v${TACHYON_VERSION}`, asset.name);
  try {
    if (await sha256(path) === asset.sha256) return path;
  } catch {
    // A missing or unreadable cache entry is replaced below.
  }

  await mkdir(dirname(path), { recursive: true });
  const response = await fetch(asset.url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Tachyon download failed: ${response.status} ${response.statusText}`);

  const temporary = `${path}.${process.pid}.download`;
  await writeFile(temporary, new Uint8Array(await response.arrayBuffer()));
  const actual = await sha256(temporary);
  if (actual !== asset.sha256) {
    await unlink(temporary).catch(() => {});
    throw new Error(`Tachyon checksum mismatch: expected ${asset.sha256}, received ${actual}`);
  }
  await chmod(temporary, 0o755);
  await unlink(path).catch(() => {});
  await rename(temporary, path);
  return path;
}

async function main(args) {
  verifyReleaseMapping();
  if (args[0] === '--verify-mapping') {
    console.log(`Tachyon v${TACHYON_VERSION}: ${Object.keys(TACHYON_ASSETS).length} pinned release assets`);
    return;
  }

  const binary = await downloadVerifiedBinary(releaseAsset());
  const child = Bun.spawn([binary, ...args], {
    cwd: websiteRoot,
    env: {
      ...process.env,
      TACHYON_CACHE_DIR: resolve(websiteRoot, '.cache', 'tachyon', 'runtime'),
    },
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  });
  const code = await child.exited;
  if (code !== 0) process.exitCode = code;
}

if (import.meta.main) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
