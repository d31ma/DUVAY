// @ts-check
// Post-bundle pass over every client-rendered route's bootstrap HTML.
//
// Tachyon 26.33 renders Tac in the client, so a route ships as a small
// bootstrap document. Two things still belong in that document's <head>:
//
//   1. The site stylesheet. The compiler emits shared/styles/app.css as a
//      static asset from the `import '../styles/app.css'` in imports.js, but
//      does not link it, so the page would render unstyled until — and only
//      if — JavaScript ran. Linking it here keeps first paint styled.
//   2. A per-route <title>. With no server-rendered subtree, crawlers and
//      tab titles would otherwise see the generic shell title.

import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const STYLESHEET = '/shared/styles/app.css';
const MARK = '<!--duvay-head-->';

/** Every index.html under a root, recursively. */
async function routeDocuments(root) {
  const found = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name === 'index.html') found.push(full);
    }
  }
  await walk(root);
  return found;
}

/** @param {{ targetRoots: Record<string, string> }} context */
export async function postBundle({ targetRoots }) {
  const webRoot = targetRoots.web;
  if (!webRoot) return; // web-only concern

  let patched = 0;
  for (const file of await routeDocuments(webRoot)) {
    let html = await readFile(file, 'utf8');
    if (html.includes(MARK)) continue;
    html = html.replace(
      '</head>',
      `    <link rel="stylesheet" href="${STYLESHEET}">\n    ${MARK}\n</head>`,
    );
    await writeFile(file, html);
    patched += 1;
  }
  console.log(`[duvay] linked ${STYLESHEET} into ${patched} route documents`);
}

export default { postBundle };
