import { describe, expect, test } from 'bun:test';
import {
  releaseAsset,
  TACHYON_ASSETS,
  TACHYON_RELEASE,
  TACHYON_VERSION,
  verifyReleaseMapping,
} from './ty.mjs';

describe('pinned Tachyon runner', () => {
  test('maps every published v26.33.02 binary to an exact checksum', () => {
    expect(TACHYON_VERSION).toBe('26.33.02');
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
      sha256: 'c662da31be584364b1d0554df232336a047b90ba66ab9bde9c87e248bb184616',
      url: `${TACHYON_RELEASE}/ty-linux-x64`,
    });
    expect(() => releaseAsset('win32', 'arm64')).toThrow(
      'Tachyon 26.33.02 has no release binary for win32-arm64',
    );
  });
});
