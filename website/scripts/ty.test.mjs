import { describe, expect, test } from 'bun:test';
import {
  releaseAsset,
  TACHYON_ASSETS,
  TACHYON_RELEASE,
  TACHYON_VERSION,
  verifyReleaseMapping,
} from './ty.mjs';

describe('pinned Tachyon runner', () => {
  test('maps every published v26.30.04 binary to an exact checksum', () => {
    expect(TACHYON_VERSION).toBe('26.30.04');
    expect(verifyReleaseMapping()).toBe(true);
    expect(Object.keys(TACHYON_ASSETS).sort()).toEqual([
      'darwin-arm64',
      'darwin-x64',
      'linux-arm64',
      'linux-x64',
      'win32-x64',
    ]);
  });

  test('builds the official release URL and rejects unsupported runners', () => {
    expect(releaseAsset('linux', 'x64')).toEqual({
      name: 'ty-linux-x64',
      sha256: '0ccf5db78f196db3d9279b2a533a22e2413a146c91968775aa7c988d0c89f72d',
      url: `${TACHYON_RELEASE}/ty-linux-x64`,
    });
    expect(() => releaseAsset('win32', 'arm64')).toThrow(
      'Tachyon 26.30.04 has no release binary for win32-arm64',
    );
  });
});
