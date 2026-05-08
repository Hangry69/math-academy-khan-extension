#!/usr/bin/env node
// Validate every unique YouTube ID in khan-topics.js against the YouTube
// oEmbed endpoint. oEmbed is free, unauthenticated, and returns 401 for
// private/removed videos and 404 for nonexistent IDs — perfect smoke test.
//
// Usage:
//   node scripts/validate-youtube-ids.js [--concurrency=8] [--out=report.json]
//
// Exit code 0 always. Writes a report to scripts/youtube-validation-report.json
// listing { ok: [...], dead: [...{ id, status, topics: [...] }] }.

const path = require('path');
const fs = require('fs');

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const m = a.match(/^--([^=]+)=(.*)$/);
  return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
}));

const CONCURRENCY = parseInt(args.concurrency || '8', 10);
const OUT = args.out || path.join(__dirname, 'youtube-validation-report.json');

const { KHAN_TOPIC_MAP } = require(path.join(__dirname, '..', 'khan-topics.js'));

// Build id → [topics that use it] index.
const idIndex = new Map();
for (const [topic, v] of Object.entries(KHAN_TOPIC_MAP)) {
  if (!v || !v.youtube) continue;
  if (!idIndex.has(v.youtube)) idIndex.set(v.youtube, []);
  idIndex.get(v.youtube).push(topic);
}

const ids = Array.from(idIndex.keys());
console.log(`Checking ${ids.length} unique YouTube IDs (covers ${Object.values(KHAN_TOPIC_MAP).filter(v => v.youtube).length} mapped topics).`);

async function check(id) {
  const url = `https://www.youtube.com/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${encodeURIComponent(id)}`;
  try {
    const res = await fetch(url, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      return { id, ok: true, title: data.title, author: data.author_name };
    }
    return { id, ok: false, status: res.status };
  } catch (e) {
    return { id, ok: false, status: 0, error: String(e?.message || e) };
  }
}

async function pool(items, conc, fn) {
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: conc }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      const r = await fn(items[i], i);
      results[i] = r;
      if ((i + 1) % 25 === 0) {
        process.stdout.write(`  ${i + 1}/${items.length} checked\n`);
      }
    }
  });
  await Promise.all(workers);
  return results;
}

(async () => {
  const t0 = Date.now();
  const results = await pool(ids, CONCURRENCY, check);
  const ok = results.filter((r) => r.ok);
  const dead = results.filter((r) => !r.ok).map((r) => ({
    id: r.id,
    status: r.status,
    topics: idIndex.get(r.id) || [],
    error: r.error,
  }));

  const report = {
    checkedAt: new Date().toISOString(),
    elapsedMs: Date.now() - t0,
    totalIds: ids.length,
    okCount: ok.length,
    deadCount: dead.length,
    dead,
    sampleOk: ok.slice(0, 5),
  };
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));

  console.log(`\nDone in ${(report.elapsedMs / 1000).toFixed(1)}s.`);
  console.log(`  ok:   ${ok.length}`);
  console.log(`  dead: ${dead.length}`);
  if (dead.length) {
    console.log('\nDead IDs:');
    for (const d of dead) {
      console.log(`  ${d.id}  [${d.status}]  used by: ${d.topics.slice(0, 3).join(', ')}${d.topics.length > 3 ? ` (+${d.topics.length - 3})` : ''}`);
    }
  }
  console.log(`\nFull report: ${OUT}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
