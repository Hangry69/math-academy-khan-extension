#!/usr/bin/env node
// Regression tests for the topic matcher + related-topics resolver.
// Run with: node scripts/test-matcher.js
// Exits 0 on all-pass, 1 if any case fails.

const path = require('path');
const { findBestTopicMatch, findRelatedTopics, KHAN_TOPIC_MAP } = require(
  path.join(__dirname, '..', 'khan-topics.js')
);

let failed = 0;
let passed = 0;

function expect(name, actual, predicate, expectedDesc) {
  const ok = predicate(actual);
  if (ok) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}`);
    console.log(`    got: ${JSON.stringify(actual)}`);
    if (expectedDesc) console.log(`    expected: ${expectedDesc}`);
  }
}

// ── findBestTopicMatch ───────────────────────────────────────
console.log('\nfindBestTopicMatch');

// Direct hits
expect('exact match: "fractions"',
  findBestTopicMatch('fractions'),
  (r) => r && r.title === 'Fractions');

expect('case-insensitive: "QUADRATIC FORMULA"',
  findBestTopicMatch('QUADRATIC FORMULA'),
  (r) => r && r.title === 'Quadratic Formula');

// Long-key contained
expect('"Solving Linear Equations in One Variable" → linear equations key',
  findBestTopicMatch('Solving Linear Equations in One Variable'),
  (r) => r && r.youtube && r.title.toLowerCase().includes('linear'));

// Filler-word stripping
expect('"Introduction to Quadratics" → quadratics',
  findBestTopicMatch('Introduction to Quadratics'),
  (r) => r && r.title.toLowerCase().includes('quadratic'));

// Should not match generic noise
expect('garbage "asdfasdfasdf" → null',
  findBestTopicMatch('asdfasdfasdf'),
  (r) => r === null);

// Specific Math Academy phrasing added in v4.0
expect('"Vertex Form of a Quadratic" hits the new entry',
  findBestTopicMatch('Vertex Form of a Quadratic'),
  (r) => r && r.title.toLowerCase().includes('vertex'));

expect('"Factoring Trinomials" exact hit',
  findBestTopicMatch('Factoring Trinomials'),
  (r) => r && r.title.toLowerCase().includes('factoring'));

// Calculus
expect('"derivatives" exact hit',
  findBestTopicMatch('derivatives'),
  (r) => r && r.title === 'Derivatives');

expect('"chain rule" exact hit',
  findBestTopicMatch('chain rule'),
  (r) => r && r.title === 'Chain Rule');

// Stats
expect('"central limit theorem" hits the new entry',
  findBestTopicMatch('central limit theorem'),
  (r) => r && r.youtube != null || (r && r.title));

// ── findRelatedTopics ────────────────────────────────────────
console.log('\nfindRelatedTopics');

const relFractions = findRelatedTopics('fractions', 4);
expect('returns up to 4 results for "fractions"',
  relFractions,
  (a) => Array.isArray(a) && a.length <= 4 && a.length > 0);

expect('all related topics have a youtube id (filter requirement)',
  relFractions,
  (a) => a.every((r) => r.youtube && /^[A-Za-z0-9_-]{6,}$/.test(r.youtube)));

expect('related topics are deduped by youtube id',
  relFractions,
  (a) => new Set(a.map((r) => r.youtube)).size === a.length);

expect('related topics for "quadratics" exclude exact key',
  findRelatedTopics('quadratics', 4),
  (a) => Array.isArray(a) && a.every((r) => r.topic !== 'quadratics'));

expect('empty query → empty array',
  findRelatedTopics('', 4),
  (a) => Array.isArray(a) && a.length === 0);

// ── KHAN_TOPIC_MAP shape sanity ──────────────────────────────
console.log('\nKHAN_TOPIC_MAP shape');

const badEntries = Object.entries(KHAN_TOPIC_MAP).filter(([k, v]) =>
  !v || typeof v !== 'object' || !v.title || !v.video
);
expect(`every entry has title + video (${Object.keys(KHAN_TOPIC_MAP).length} total)`,
  badEntries,
  (a) => a.length === 0,
  '0 malformed entries');

const ytIds = Object.values(KHAN_TOPIC_MAP)
  .filter((v) => v.youtube)
  .map((v) => v.youtube);
const badYt = ytIds.filter((id) => !/^[A-Za-z0-9_-]{11}$/.test(id));
expect(`youtube ids are 11-char id format (${ytIds.length} non-null)`,
  badYt,
  (a) => a.length === 0,
  '0 malformed YT ids');

// ── parseYouTubeId (mirrored from content.js) ────────────────
// Kept in sync manually with content.js; if you change one, update both
// and the corresponding tests below.
console.log('\nparseYouTubeId');

function parseYouTubeId(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  let m = s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  m = s.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  m = s.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  m = s.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  return null;
}

const cases = [
  ['raw 11-char id', 'AuX7nPBqDts', 'AuX7nPBqDts'],
  ['watch URL', 'https://www.youtube.com/watch?v=AuX7nPBqDts', 'AuX7nPBqDts'],
  ['watch URL with extra params', 'https://www.youtube.com/watch?v=AuX7nPBqDts&t=120s', 'AuX7nPBqDts'],
  ['youtu.be short URL', 'https://youtu.be/AuX7nPBqDts', 'AuX7nPBqDts'],
  ['youtu.be with query', 'https://youtu.be/AuX7nPBqDts?si=abc', 'AuX7nPBqDts'],
  ['embed URL', 'https://www.youtube.com/embed/AuX7nPBqDts', 'AuX7nPBqDts'],
  ['shorts URL', 'https://www.youtube.com/shorts/AuX7nPBqDts', 'AuX7nPBqDts'],
  ['mobile m. watch URL', 'https://m.youtube.com/watch?v=AuX7nPBqDts', 'AuX7nPBqDts'],
  ['leading/trailing whitespace', '  AuX7nPBqDts  ', 'AuX7nPBqDts'],
  ['too-short id alone', 'short', null],
  ['empty', '', null],
  ['null', null, null],
  ['undefined', undefined, null],
  ['random text', 'this is not a youtube link', null],
];
for (const [name, input, want] of cases) {
  expect(name, parseYouTubeId(input), (r) => r === want, JSON.stringify(want));
}

// ── Summary ──────────────────────────────────────────────────
console.log(`\n${passed} passed, ${failed} failed.`);
process.exit(failed === 0 ? 0 : 1);
