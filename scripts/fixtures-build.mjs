#!/usr/bin/env bun
// DuVay — Layer 2: conformance fixtures
//
// Runs the live web implementation over a fixed set of inputs and records
// input → expected output as language-neutral JSON. Every platform library
// reimplements the logic in its own language and asserts against these
// vectors; a platform is not "at parity" until it passes 100% for its tier.
//
// This is the shared-behaviour mechanism the plan chose instead of a shared
// runtime (KMP / Compose Multiplatform): it works identically for Swift,
// Kotlin, C# and Rust, which no shared runtime does.
//
// Vectors use local-time date components throughout, so they are timezone
// independent — verified by running this generator under several TZs.
//
//   bun scripts/fixtures-build.mjs           write spec/fixtures/*.json
//   bun scripts/fixtures-build.mjs --check   fail if the committed fixtures are stale

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, 'spec', 'fixtures');

// SwiftPM test bundles can only read resources declared inside the target, so
// Apple needs a copy rather than a path into spec/. Writing it here — and
// checking it under --check — is what stops that copy from drifting; the other
// three platforms read spec/fixtures directly.
const MIRRORS = [join(ROOT, 'apple', 'Tests', 'DuVayCoreTests', 'Fixtures')];

/* ── Minimal DOM shim ─────────────────────────────────────────────────────
 * mask-input.js reaches HTMLElement/customElements at module scope. The mask
 * grammar itself is pure, so a stub is enough to import and exercise it
 * without pulling in a headless browser.
 */
globalThis.HTMLElement ??= class {};
globalThis.customElements ??= { get: () => undefined, define: () => {} };
// WElement is an ambient global in the browser bundle, not an ES export.
globalThis.WElement ??= class extends globalThis.HTMLElement {};

const cal = await import('../src/components/calendar-utils.js');
const utils = await import('../src/components/utils.js');
const { WMaskInput } = await import('../src/components/mask-input.js');

/* ── Serialization ───────────────────────────────────────────────────── */

const pad = (n, w = 2) => String(n).padStart(w, '0');

/** Dates serialize to local components — never UTC — so vectors are TZ-stable. */
function encode(value) {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return { $date: 'invalid' };
    return {
      $date: `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
        + `T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`,
    };
  }
  if (Array.isArray(value)) return value.map(encode);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, encode(v)]));
  }
  if (value === undefined) return null;
  return value;
}

/** `{ $date: … }` in an input vector becomes a real local Date. */
function decode(value) {
  if (Array.isArray(value)) return value.map(decode);
  if (value && typeof value === 'object') {
    if (typeof value.$date === 'string') {
      const [d, t = '12:00:00'] = value.$date.split('T');
      const [y, mo, da] = d.split('-').map(Number);
      const [h, mi, s] = t.split(':').map(Number);
      return new Date(y, mo - 1, da, h, mi, s);
    }
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, decode(v)]));
  }
  return value;
}

const D = (iso) => ({ $date: iso });

/* ── Vectors ─────────────────────────────────────────────────────────── */

const SUITES = [
  {
    file: 'calendar.json',
    description:
      'Date arithmetic every platform must reproduce exactly. Source of truth: src/components/calendar-utils.js.',
    fns: {
      // Parsing — must reject overflowed calendar dates rather than rolling over.
      wCalendarDate: [
        ['2026-08-22'], ['2026-02-29'], ['2024-02-29'], ['2024-02-31'],
        ['2026-13-01'], ['2026-00-10'], ['not-a-date'], [''],
        ['2026-08-22 09:30'], ['2026-08-22T09:30:15'],
      ],
      wCalendarIso: [[D('2026-08-22T12:00:00')], [D('2026-01-05T00:00:00')]],
      wCalendarDay: [[D('2026-08-22T23:59:59')], [D('2026-08-22T00:00:00')]],
      // Month arithmetic must clamp, not overflow: Jan 31 + 1 month = Feb 28/29.
      wCalendarAddDays: [
        [D('2026-08-22T12:00:00'), 1], [D('2026-08-22T12:00:00'), -1],
        [D('2026-12-31T12:00:00'), 1], [D('2026-03-01T12:00:00'), -1],
        [D('2026-08-22T12:00:00'), 0], [D('2026-08-22T12:00:00'), 365],
      ],
      wCalendarAddMonths: [
        [D('2026-01-31T12:00:00'), 1], [D('2024-01-31T12:00:00'), 1],
        [D('2026-08-22T12:00:00'), -1], [D('2026-12-15T12:00:00'), 1],
        [D('2026-03-31T12:00:00'), -1], [D('2026-08-22T12:00:00'), 12],
      ],
      wCalendarStartOfWeek: [
        [D('2026-08-22T12:00:00'), 0], [D('2026-08-22T12:00:00'), 1],
        [D('2026-08-23T12:00:00'), 0], [D('2026-08-23T12:00:00'), 1],
      ],
      wCalendarEndOfWeek: [[D('2026-08-22T12:00:00'), 0], [D('2026-08-22T12:00:00'), 1]],
      wCalendarDays: [
        [D('2026-08-01T12:00:00'), D('2026-08-05T12:00:00')],
        [D('2026-08-01T12:00:00'), D('2026-08-31T12:00:00'), 7],
        [D('2026-08-05T12:00:00'), D('2026-08-01T12:00:00')],
      ],
      wCalendarMinutes: [[D('2026-08-22T00:00:00')], [D('2026-08-22T09:30:00')], [D('2026-08-22T23:59:00')]],
      wCalendarHasTime: [['2026-08-22'], ['2026-08-22 09:30'], ['2026-08-22T09:30'], [''], [null]],
      // ISO-8601 week numbering — the classic cross-language divergence.
      wCalendarWeekNumber: [
        [D('2026-01-01T12:00:00')], [D('2026-08-22T12:00:00')], [D('2026-12-31T12:00:00')],
        [D('2027-01-01T12:00:00')], [D('2024-12-30T12:00:00')], [D('2021-01-01T12:00:00')],
      ],
      wAllowedBy: [
        [null, '2026-08-22'],
        [['2026-08-22', '2026-08-23'], '2026-08-22'],
        [['2026-08-22'], '2026-08-24'],
      ],
      wCalendarColor: [['primary'], [''], [null], ['success']],
    },
  },
  {
    file: 'values.json',
    description:
      'Attribute value parsing and formatting shared by every control. Source of truth: src/components/utils.js.',
    fns: {
      wValueList: [
        ['a,b,c'], ['["a","b"]'], [''], [null], ['  a , b  '], ['[]'], ['single'],
      ],
      wNumberList: [['1,2,3'], ['[1,2]'], ['a,b'], [''], ['1, 2.5, -3']],
      wInitials: [['Ada Lovelace'], ['ada'], [''], [null], ['Grace Brewster Murray Hopper']],
      wParseIsoDate: [['2026-08-22'], ['2024-02-31'], ['nope'], ['']],
      wIsSameDate: [
        [D('2026-08-22T09:00:00'), D('2026-08-22T21:00:00')],
        [D('2026-08-22T12:00:00'), D('2026-08-23T12:00:00')],
      ],
      // min/max are Dates, not strings. Bounds are inclusive; null is ignored.
      wDateInRange: [
        [D('2026-08-22T12:00:00'), D('2026-08-01T12:00:00'), D('2026-08-31T12:00:00')],
        [D('2026-09-22T12:00:00'), D('2026-08-01T12:00:00'), D('2026-08-31T12:00:00')],
        [D('2026-07-22T12:00:00'), D('2026-08-01T12:00:00'), D('2026-08-31T12:00:00')],
        [D('2026-08-01T12:00:00'), D('2026-08-01T12:00:00'), D('2026-08-31T12:00:00')],
        [D('2026-08-31T12:00:00'), D('2026-08-01T12:00:00'), D('2026-08-31T12:00:00')],
        [D('2026-08-22T12:00:00'), D('2026-08-01T12:00:00'), null],
        [D('2026-08-22T12:00:00'), null, D('2026-08-31T12:00:00')],
        [D('2026-08-22T12:00:00'), null, null],
      ],
      // Trust boundary: javascript: and data: URLs must never survive.
      wSafeUrl: [
        ['https://example.com'], ['/docs/buttons'], ['javascript:alert(1)'],
        ['JaVaScRiPt:alert(1)'], ['data:text/html,<script>'], [''], ['#anchor'],
      ],
    },
  },
  {
    file: 'mask.json',
    description:
      'Input-mask grammar (# digit, A letter, N alphanumeric, X any, \\\\ escapes). '
      + 'Source of truth: src/components/mask-input.js.',
    fns: {
      applyMask: [
        ['###-###', '123456'], ['###-###', '12'], ['###-###', ''],
        ['(###) ###-####', '5551234567'], ['AAA-###', 'abc123'],
        ['AAA-###', '123abc'], ['NNNN', 'a1b2'], ['XXXX', 'a!b?'],
        ['##/##/####', '22082026'], ['\\\\####', '123'],
        // Token-class discrimination. Without these, a platform could define
        // `#` as alphanumeric (or `A` as any character) and still pass every
        // vector above — the suite would certify an implementation that is
        // wrong. Each case below fails unless the class is exactly right.
        ['###', 'a1b2c3'],   // # skips letters                  → "123"
        ['AAA', '1a2b3c'],   // A skips digits                   → "abc"
        ['NNN', '!a1!b2'],   // N skips punctuation only         → "a1b"
        ['XXX', '!@#'],      // X accepts anything               → "!@#"
        ['###', 'abc'],      // no digits at all                 → ""
        ['AAA', '123'],      // no letters at all                → ""
        ['NNN', '!!!'],      // no alphanumerics at all          → ""
        ['##', '1a2'],       // interleaved, digits only         → "12"
      ],
      unmask: [
        ['###-###', '123-456'], ['(###) ###-####', '(555) 123-4567'],
        ['##/##/####', '22/08/2026'], ['AAA-###', 'abc-123'],
      ],
    },
  },
];

/* ── Callable resolution ─────────────────────────────────────────────── */

/**
 * The mask grammar lives on WMaskInput.prototype and reads only `this.mask`,
 * so it can be invoked against a stub host rather than a live element.
 */
const maskHost = (mask) => ({
  mask,
  _applyMaskToken: WMaskInput.prototype._applyMaskToken,
});

function resolve(suiteFile, name) {
  if (suiteFile === 'mask.json') {
    if (name === 'applyMask') return (mask, value) => WMaskInput.prototype._applyMask.call(maskHost(mask), value);
    if (name === 'unmask') return (mask, value) => WMaskInput.prototype._unmask.call(maskHost(mask), value);
  }
  return cal[name] ?? utils[name];
}

/* ── Run ─────────────────────────────────────────────────────────────── */

await mkdir(OUT, { recursive: true });
const check = process.argv.includes('--check');
let stale = 0;
let vectors = 0;

for (const suite of SUITES) {
  const cases = [];
  for (const [name, argSets] of Object.entries(suite.fns)) {
    const fn = resolve(suite.file, name);
    if (typeof fn !== 'function') throw new Error(`${suite.file}: no implementation for ${name}`);
    for (const rawArgs of argSets) {
      const args = rawArgs.map(decode);
      // A vector that throws is almost always a malformed input, not a
      // contract: no other language can reproduce a JS TypeError, and encoding
      // one would force every platform to model JavaScript's type system.
      // Fail loudly rather than emitting a bug-shaped fixture.
      let expected;
      try {
        expected = encode(fn(...args));
      } catch (err) {
        console.error(
          `✗ ${suite.file}: ${name}(${JSON.stringify(rawArgs)}) threw ${err.constructor.name}: ${err.message}\n`
          + '  Fixture inputs must be valid for the function under test. Fix the vector.',
        );
        process.exit(1);
      }
      cases.push({ fn: name, args: rawArgs.map(encode), expected });
      vectors++;
    }
  }

  const doc = {
    $description: suite.description,
    $note:
      'Generated by scripts/fixtures-build.mjs. `{"$date":"YYYY-MM-DDTHH:mm:ss"}` denotes a local-time date. '
      + 'Reimplement each fn natively and assert args → expected.',
    cases,
  };
  const json = JSON.stringify(doc, null, 2) + '\n';
  const targets = [join(OUT, suite.file), ...MIRRORS.map((dir) => join(dir, suite.file))];

  for (const path of targets) {
    if (check) {
      const existing = await readFile(path, 'utf8').catch(() => null);
      if (existing !== json) {
        console.error(`✗ fixtures stale: ${path.replace(ROOT + '/', '')}`);
        stale++;
      }
    } else {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, json);
    }
  }
  if (!check) console.log(`✓ ${suite.file.padEnd(16)} ${cases.length} vectors`);
}

if (check) {
  if (stale) {
    console.error(`\n✗ fixtures:check — ${stale} suite(s) stale, run \`bun run fixtures:build\``);
    process.exit(1);
  }
  console.log(`✓ fixtures:check — ${SUITES.length} suites up to date`);
} else {
  console.log(`✓ ${vectors} conformance vectors → spec/fixtures/`);
}
