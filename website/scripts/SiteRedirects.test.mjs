import { describe, expect, test } from 'bun:test';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SiteRedirects } from './SiteRedirects.mjs';

describe('redirect pages written after the Tac bundle', () => {
  test('writes a stub that names the new route and the redirect script', async () => {
    const root = await mkdtemp(join(tmpdir(), 'duvay-redirects-'));
    expect(await SiteRedirects.write(root)).toBe(1);
    const page = await readFile(join(root, 'docs/v-model/index.html'), 'utf8');
    expect(page).toContain('<link rel="canonical" href="/docs/w-model/">');
    expect(page).toContain(`<script src="${SiteRedirects.SCRIPT_URL}"></script>`);
    const script = await readFile(join(root, 'shared/scripts/duvay-redirect.js'), 'utf8');
    expect(script).toContain('location.replace');
  });

  test('refuses to replace a real page at the old route', async () => {
    const root = await mkdtemp(join(tmpdir(), 'duvay-redirects-'));
    await mkdir(join(root, 'docs/v-model'), { recursive: true });
    await writeFile(join(root, 'docs/v-model/index.html'), '<w-app></w-app>');
    await expect(SiteRedirects.write(root)).rejects.toThrow('would overwrite a real route');
  });
});
