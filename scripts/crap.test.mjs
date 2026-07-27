// bun scripts/crap.test.mjs — guards the complexity counter against the two
// things that actually break it: HTML in template literals, and regex literals.
import assert from 'node:assert/strict';
import { blankLiterals, countComplexity } from './crap.mjs';

const cc = (source) => countComplexity(blankLiterals(source));

assert.equal(cc('const a = 1;'), 1);
assert.equal(cc('if (a) { b(); }'), 2);
assert.equal(cc('if (a && b) { c(); } else if (d) { e(); }'), 4);

// `if`, `||` and `?` inside markup are text, not branches.
assert.equal(cc('return `<p class="if || ?">${label}</p>`;'), 1);
// ...but a ternary in a ${} expression is.
assert.equal(cc('return `<p>${a ? b : c}</p>`;'), 2);
// Balanced braces inside a ${} expression must not end the expression early.
assert.equal(cc('return `${fn({ a: 1 })} ${b ? 1 : 2}`;'), 2);
// Nested template inside an expression.
assert.equal(cc('return `${x ? `<b>if || ?</b>` : ``}`;'), 2);

// Regex literals are not division and their contents are not branches.
assert.equal(cc('const re = /if|for\\/?/g;'), 1);
assert.equal(cc('const half = total / 2 / 3;'), 1);

// Comments and strings.
assert.equal(cc('// if (a) {}\nconst b = 1;'), 1);
assert.equal(cc("const s = 'if a || b';"), 1);
assert.equal(cc('/* while (x) */ const b = 1;'), 1);

// Optional chaining is not a ternary; nullish coalescing is a branch.
assert.equal(cc('const a = b?.c;'), 1);
assert.equal(cc('const a = b ?? c;'), 2);

console.log('crap.test.mjs ok');
