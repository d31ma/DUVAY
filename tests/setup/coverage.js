// V8 coverage capture for the CRAP report. Enabled with DUVAY_COVERAGE=1.
// ponytail: RLE bitmaps instead of a coverage library — c8/istanbul would need
// a build step and source maps we do not have (src is served raw).
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const coverageEnabled = Boolean(process.env.DUVAY_COVERAGE);

export function createCoverageAccumulator() {
  const files = new Map();

  return {
    add(entries) {
      for (const entry of entries) {
        const match = /\/(src\/.*\.js)(?:\?|$)/.exec(entry.url);
        if (!match || !entry.source) continue;

        let file = files.get(match[1]);
        if (!file) {
          file = { covered: new Uint8Array(entry.source.length), functions: new Map() };
          files.set(match[1], file);
        }

        const ranges = [];
        for (const fn of entry.functions) {
          const outer = fn.ranges[0];
          const key = `${outer.startOffset}:${outer.endOffset}`;
          if (!file.functions.has(key)) {
            file.functions.set(key, { start: outer.startOffset, end: outer.endOffset, name: fn.functionName });
          }
          ranges.push(...fn.ranges);
        }

        // Painting outermost-first lets a nested function that never ran carve
        // a hole out of the script-level range, which V8 always marks as run.
        ranges.sort((a, b) => a.startOffset - b.startOffset || b.endOffset - a.endOffset);
        const paint = new Uint8Array(entry.source.length);
        for (const range of ranges) {
          paint.fill(range.count > 0 ? 1 : 0, range.startOffset, range.endOffset);
        }
        for (let i = 0; i < paint.length; i += 1) {
          if (paint[i]) file.covered[i] = 1;
        }
      }
    },

    async write(directory, id) {
      if (!files.size) return;
      const output = {};
      for (const [path, file] of files) {
        output[path] = { functions: [...file.functions.values()], runs: encodeRuns(file.covered) };
      }
      await mkdir(directory, { recursive: true });
      await writeFile(join(directory, `${id}.json`), JSON.stringify(output));
    },
  };
}

// Run-length encoding, starting with a run of uncovered bytes.
function encodeRuns(bytes) {
  const runs = [];
  let value = 0;
  let length = 0;
  for (const byte of bytes) {
    if (byte === value) {
      length += 1;
    } else {
      runs.push(length);
      value = byte;
      length = 1;
    }
  }
  runs.push(length);
  return runs;
}

export function decodeRuns(runs, target) {
  let offset = 0;
  let value = 0;
  for (const length of runs) {
    if (value) target.fill(1, offset, offset + length);
    offset += length;
    value = value ? 0 : 1;
  }
  return target;
}
