#!/usr/bin/env bun
// CRAP score report: CRAP(f) = cc(f)^2 * (1 - coverage(f))^3 + cc(f)
//
//   bun run test:coverage   # runs the Playwright suite with V8 coverage on
//   bun run crap            # reads coverage/raw/*.json and prints this report
//
// Function boundaries and hit counts come straight from V8 (via Playwright's
// coverage API), so there is no parser dependency. Complexity is counted on a
// copy of the source with strings, comments, and regex literals blanked out.
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const rawDirectory = process.env.CRAP_RAW || join(projectRoot, 'coverage/raw');
const limit = Number(process.env.CRAP_LIMIT || 12);
const top = Number(process.env.CRAP_TOP || 25);
// CRAP_FILTER=<path substring> lists every function in the matching files, not
// just the ones over the limit — the loop for working a single file down.
const filter = process.env.CRAP_FILTER || '';
const DECISIONS = /\b(if|for|while|case|catch)\b|&&|\|\||\?\?|\?(?!\.)/g;

if (import.meta.main) {
  const files = await loadCoverage();
  if (!files.size) {
    console.error('No coverage found. Run: bun run test:coverage');
    process.exit(1);
  }

  const functions = [];
  for (const [path, file] of [...files].sort()) {
    const source = await readFile(join(projectRoot, path), 'utf8');
    const blanked = blankLiterals(source);
    const lineStarts = indexLines(source);
    // V8 reports the module wrapper as a function spanning the whole file.
    const own = file.functions.filter((fn) => fn.end - fn.start > 1 && !(fn.start === 0 && fn.end >= source.length));

    for (const fn of own) {
      // Nested functions are measured on their own, so exclude their bodies
      // from the enclosing one rather than counting the branches twice.
      const nested = own.filter((other) => other !== fn && other.start >= fn.start && other.end <= fn.end);
      const body = maskRanges(blanked, fn, nested);
      const complexity = countComplexity(body);
      const coverage = lineCoverage(maskRanges(source, fn, nested), file.covered, lineStarts, fn.start, fn.end);
      if (coverage.total === 0) continue;
      const ratio = coverage.covered / coverage.total;
      functions.push({
        path,
        name: fn.name || '(anonymous)',
        line: lineOf(lineStarts, fn.start),
        complexity,
        coverage: ratio,
        crap: complexity ** 2 * (1 - ratio) ** 3 + complexity,
      });
    }
  }

  report(functions);
}

async function loadCoverage() {
  const merged = new Map();
  let entries = [];
  try {
    entries = await readdir(rawDirectory);
  } catch {
    return merged;
  }

  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue;
    const dump = JSON.parse(await readFile(join(rawDirectory, entry), 'utf8'));
    for (const [path, data] of Object.entries(dump)) {
      let file = merged.get(path);
      if (!file) {
        file = { functions: new Map(), covered: null };
        merged.set(path, file);
      }
      for (const fn of data.functions) file.functions.set(`${fn.start}:${fn.end}`, fn);
      const covered = decodeRuns(data.runs);
      if (!file.covered) {
        file.covered = covered;
      } else {
        for (let i = 0; i < covered.length; i += 1) if (covered[i]) file.covered[i] = 1;
      }
    }
  }

  for (const file of merged.values()) file.functions = [...file.functions.values()];
  return merged;
}

function decodeRuns(runs) {
  const total = runs.reduce((sum, length) => sum + length, 0);
  const bytes = new Uint8Array(total);
  let offset = 0;
  let value = 0;
  for (const length of runs) {
    if (value) bytes.fill(1, offset, offset + length);
    offset += length;
    value = value ? 0 : 1;
  }
  return bytes;
}

// Replaces the contents of comments, strings, and regex literals with spaces so
// that `if` inside an HTML template string is not counted as a branch. Template
// `${...}` expressions are kept — they hold real ternaries.
export function blankLiterals(source) {
  const out = source.split('');
  const blank = (from, to) => {
    for (let i = from; i < to && i < out.length; i += 1) {
      if (out[i] !== '\n') out[i] = ' ';
    }
  };
  // Frames with `literalStart` are template literals; frames with `depth` are
  // `${...}` expression scopes, where braces must be balanced before the
  // template text resumes.
  const stack = [];
  let i = 0;
  let previous = '';

  while (i < source.length) {
    const char = source[i];
    const frame = stack[stack.length - 1];

    if (frame && frame.literalStart !== undefined) {
      if (char === '\\') {
        i += 2;
      } else if (char === '$' && source[i + 1] === '{') {
        blank(frame.literalStart, i);
        stack.push({ depth: 0 });
        previous = '{';
        i += 2;
      } else if (char === '`') {
        blank(frame.literalStart, i);
        stack.pop();
        previous = '`';
        i += 1;
      } else {
        i += 1;
      }
      continue;
    }

    if (char === '/' && source[i + 1] === '/') {
      const end = source.indexOf('\n', i);
      blank(i, end === -1 ? source.length : end);
      i = end === -1 ? source.length : end;
      continue;
    }
    if (char === '/' && source[i + 1] === '*') {
      const end = source.indexOf('*/', i + 2);
      blank(i, end === -1 ? source.length : end + 2);
      i = end === -1 ? source.length : end + 2;
      continue;
    }
    if (char === '"' || char === "'") {
      const end = skipQuoted(source, i, char);
      blank(i, end);
      i = end;
      previous = char;
      continue;
    }
    if (char === '/' && '(,=:[!&|?{};+-*%~^\n'.includes(previous)) {
      const end = skipRegex(source, i);
      if (end > i) {
        blank(i, end);
        i = end;
        previous = '/';
        continue;
      }
    }
    if (char === '`') {
      stack.push({ literalStart: i + 1 });
      i += 1;
      continue;
    }
    if (frame) {
      if (char === '{') {
        frame.depth += 1;
      } else if (char === '}') {
        if (frame.depth === 0) {
          stack.pop();
          stack[stack.length - 1].literalStart = i + 1;
          previous = '}';
          i += 1;
          continue;
        }
        frame.depth -= 1;
      }
    }

    if (!/\s/.test(char)) previous = char;
    i += 1;
  }

  return out.join('');
}

function skipQuoted(source, start, quote) {
  let i = start + 1;
  while (i < source.length) {
    if (source[i] === '\\') i += 2;
    else if (source[i] === quote || source[i] === '\n') return i + 1;
    else i += 1;
  }
  return source.length;
}

function skipRegex(source, start) {
  let i = start + 1;
  let inClass = false;
  while (i < source.length) {
    const char = source[i];
    if (char === '\\') i += 2;
    else if (char === '\n') return start;
    else if (char === '[') { inClass = true; i += 1; }
    else if (char === ']') { inClass = false; i += 1; }
    else if (char === '/' && !inClass) return i + 1;
    else i += 1;
  }
  return start;
}

export function countComplexity(text) {
  return 1 + (text.match(DECISIONS) || []).length;
}

// Blanks everything outside `fn` and inside `nested`, keeping newlines so that
// character offsets and line numbers stay valid.
function maskRanges(source, fn, nested) {
  const out = source.split('');
  const blank = (from, to) => {
    for (let i = from; i < to; i += 1) if (out[i] !== '\n') out[i] = ' ';
  };
  blank(0, fn.start);
  blank(fn.end, out.length);
  for (const range of nested) blank(range.start, range.end);
  return out.join('');
}

function indexLines(source) {
  const starts = [0];
  for (let i = 0; i < source.length; i += 1) if (source[i] === '\n') starts.push(i + 1);
  return starts;
}

function lineOf(starts, offset) {
  let low = 0;
  let high = starts.length - 1;
  while (low < high) {
    const middle = (low + high + 1) >> 1;
    if (starts[middle] <= offset) low = middle;
    else high = middle - 1;
  }
  return low + 1;
}

// A line counts as executable if it holds non-whitespace inside the range, and
// as covered if V8 executed any of that non-whitespace.
function lineCoverage(source, covered, starts, start, end) {
  let total = 0;
  let hit = 0;
  let line = lineOf(starts, start) - 1;

  while (line < starts.length && starts[line] < end) {
    const from = Math.max(starts[line], start);
    const to = Math.min(line + 1 < starts.length ? starts[line + 1] : source.length, end);
    let executable = false;
    let touched = false;
    for (let i = from; i < to; i += 1) {
      if (/\s/.test(source[i])) continue;
      executable = true;
      if (covered[i]) { touched = true; break; }
    }
    if (executable) {
      total += 1;
      if (touched) hit += 1;
    }
    line += 1;
  }

  return { covered: hit, total };
}

function report(every) {
  const all = filter ? every.filter((fn) => fn.path.includes(filter)) : every;
  if (!all.length) {
    console.log(`\nNo functions matched CRAP_FILTER=${filter}\n`);
    return;
  }
  const sorted = [...all].sort((a, b) => b.crap - a.crap);
  const mean = all.reduce((sum, fn) => sum + fn.crap, 0) / all.length;
  const median = [...all].sort((a, b) => a.crap - b.crap)[Math.floor(all.length / 2)].crap;
  const over = filter ? sorted : sorted.filter((fn) => fn.crap > limit);
  const coverage = all.reduce((sum, fn) => sum + fn.coverage, 0) / all.length;

  console.log(`\nCRAP report — ${all.length} functions across ${new Set(all.map((fn) => fn.path)).size} files\n`);
  console.log(`  mean CRAP     ${mean.toFixed(2)}`);
  console.log(`  median CRAP   ${median.toFixed(2)}`);
  console.log(`  max CRAP      ${sorted[0].crap.toFixed(2)}`);
  console.log(`  mean coverage ${(coverage * 100).toFixed(1)}%`);
  console.log(`  over ${limit}       ${over.length} (${((over.length / all.length) * 100).toFixed(1)}%)\n`);

  if (over.length) {
    console.log(`  worst offenders (top ${Math.min(top, over.length)}):`);
    console.log(`  ${'CRAP'.padStart(8)}  ${'cc'.padStart(3)}  ${'cov'.padStart(5)}  location`);
    for (const fn of over.slice(0, top)) {
      const location = `${fn.path}:${fn.line}`;
      console.log(
        `  ${fn.crap.toFixed(1).padStart(8)}  ${String(fn.complexity).padStart(3)}  `
        + `${(fn.coverage * 100).toFixed(0).padStart(4)}%  ${location} ${fn.name}`,
      );
    }
    console.log('');
  }

  process.exitCode = over.length ? 1 : 0;
}
