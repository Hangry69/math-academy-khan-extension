# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Chrome MV3 extension that injects a "Play Video" pill on `mathacademy.com` lesson pages. Click → in-page modal with the matching Khan Academy video. No build step — every file shipped is hand-written or generated once and committed. Load the directory directly via `chrome://extensions` → "Load unpacked".

There is no `package.json`. Node is only used by the helper scripts in `scripts/` — they `require()` the same `.js` files the extension ships so they double as both Chrome globals and CommonJS modules (see the dual export footers in `db.js` and `khan-topics.js`).

## Common commands

```bash
# Regression tests for the topic matcher + related-topics + parseYouTubeId.
# This is the only real test suite. Run it after any change to khan-topics.js
# or to the fuzzy-match logic.
node scripts/test-matcher.js

# Smoke-check every unique YouTube ID in KHAN_TOPIC_MAP via YouTube's oEmbed
# endpoint (no API key needed). Writes scripts/youtube-validation-report.json
# with { ok: [...], dead: [...] }. Run periodically to catch link rot.
node scripts/validate-youtube-ids.js
node scripts/validate-youtube-ids.js --concurrency=8 --out=report.json

# Regenerate khan-video-index.js from a clone of tamnd/khanacademy-index
# (CC-BY-SA-4.0). One-shot data import; only run when re-seeding the corpus.
node scripts/build-khan-index.js <path-to-khanacademy-index-checkout>
```

For interactive UI work without an active Math Academy session, open `test.html` — it mimics the Math Academy markup the content script looks for. It's loaded via `<script>` tags so the content script boots even when the manifest's URL match doesn't fire (e.g. opening over `file://` or `chrome-extension://`).

## Architecture

### Load order matters

`manifest.json` injects four scripts into every `*.mathacademy.com/*` page, in this exact order:

```
khan-topics.js  →  khan-video-index.js  →  db.js  →  content.js
```

These are plain globals, not modules. `content.js` calls `findBestTopicMatch`, `findRelatedTopics`, `findKhanByIndexTitle`, and `KBdb` by name. If you add a new helper, expose it via `window.<name>` AND keep a `module.exports` footer so `scripts/test-matcher.js` (running in Node) can require it.

### Tiered video resolution

`resolveVideoData(topic)` in `content.js` walks a fixed ladder and returns the first hit. Do not reorder these without understanding why:

1. **DB** (`KBdb.getMapping`) — user overrides and previously-cached YT hits. Tried first against the URL-derived topic-ID key, then against the topic-text key (back-compat with mappings saved before v4.1).
2. **Curated map** (`findBestTopicMatch` over `KHAN_TOPIC_MAP` in `khan-topics.js`) — ~600 hand-picked topic → YouTube-ID rows. Exact → longest contained key → word-overlap scoring (see "Matcher quirks" below).
3. **Loose local match** (`looseLocalMatch`) — retries the matcher against each word of the topic individually.
4. **Bundled index** (`findKhanByIndexTitle` over `KHAN_VIDEO_INDEX`) — 1312 math-flavored videos generated from `tamnd/khanacademy-index`. Hits are persisted into the DB as `source: 'youtube-api'` so the linear scan only runs once per topic.
5. **YouTube Data API** — only if the user pasted an API key in the popup. Searches Khan's channel first, then "khan academy {topic}" channel-wide. 4s timeout. Persists to DB.
6. **`FALLBACK_VIDEO`** — "Why we do math" by Sal Khan. Modal is never empty.

### Storage model (`db.js`)

`chrome.storage.local` is a flat bag, so the three logical collections live under separate top-level keys: `kb.mappings`, `kb.history` (capped at 200), `kb.stats`. All three are async; functions tolerate missing `chrome.storage` so the same module works in popup, content script, and Node.

Mapping `source` ranks as `user (3) > youtube-api (2) > local-map (1)`. `saveMapping` refuses to **downgrade** an existing entry — a user override is never silently replaced by a YT API result.

### Topic key: URL ID vs text

`detectLessonContext()` parses `/tasks/<TASK_ID>/topics/<TOPIC_ID>/<kind>` out of the Math Academy URL. When that succeeds, the storage key is `topicid:<TOPIC_ID>` (stable across lesson renames). When it doesn't (e.g. dashboard view), the key falls back to the lowercased topic text. The override "Save" flow writes the topic-ID key; the override "Clear" flow deletes **both** keys to prevent stale text-keyed entries from outliving the topic-ID one.

### Why `player.html` exists

The modal iframe doesn't point straight at YouTube — it points at `chrome-extension://<id>/player.html?yt=<id>`, which wraps a `youtube-nocookie.com` embed and forwards `onError` / `onReady` events to `content.js` via `postMessage` (`source: 'kb-player'`). This gives us:

- Reliable detection of embed-disabled videos (YT error codes 100, 101/150, 153).
- Same-origin access to the iframe load event.
- CSP insulation — `chrome-extension://` pages don't inherit Math Academy's CSP.

The `referrerpolicy="strict-origin-when-cross-origin"` on the inner iframe is load-bearing: without it Chrome strips the `Referer` and YouTube returns error 153 even for normal embeddable videos.

### Failure recovery

When an iframe error fires, `tryRecovery()` picks a related topic with a different YT ID and re-renders the overlay. Recovery is depth-capped at 2 to avoid infinite chains, and tracks `_triedIds` so the same broken video can't be re-served. The watchdog timer (`currentLoadWatchdog`) and `postMessage` handler (`currentPlayerMsgHandler`) are tracked as module-level singletons and torn down by `closeOverlay()` — stacked listeners would fire for every subsequent overlay and an orphan timer would overwrite a successful recovery with "couldn't load this video" 12 s later.

### Stat counting trap

`KBdb.bumpStats() / recordHistory() / bumpMappingUse()` are only called from `showOverlay` when `yt && topic && !videoData?.loading && !videoData?._recoveryDepth`. The loading skeleton, the empty state, and silent recoveries all re-enter `showOverlay`; without these guards one click would record 2–3 opens.

## Matcher quirks (`khan-topics.js`)

- Filler words (`"introduction to"`, `"basics of"`, `"the"`, `"of"`, …) are stripped before matching.
- **Longest contained key wins** in step 2 — `"Solving Linear Equations in One Variable"` correctly hits `"linear equations"`. The reverse (`key.includes(stripped)`) is deliberately avoided because a short generic search like `"equations"` would otherwise latch onto the longest key containing that word.
- Step 3 (word overlap) penalises keys that are >2 words longer than the search, so generic queries stay generic.
- `findKhanByIndexTitle` requires `bestScore >= 10` and `findBestTopicMatch` requires `bestScore >= 3` — both thresholds exist to avoid returning garbage for nonsense input. If you weaken them, add cases to `scripts/test-matcher.js` first.

## CSS

All extension styles in `content.js` are injected with `!important` because Math Academy's stylesheet uses high-specificity selectors that would otherwise override the modal/pill. Keep the `!important` when adding new rules. The overlay uses `z-index: 2147483600` (max signed 32-bit minus a few) to sit above any Math Academy modal.

## Topic detection

`detectTopic()` ranks DOM candidates by priority (data attributes 11–12, common Math Academy class names 9, `h1/h2/h3` 7) and returns the top hit. `isLikelyTopic()` filters out chrome strings ("menu", "dashboard", "xp", "play video", etc.) so the pill itself can't become the detected topic. The candidate selectors are deliberately broad (`[class*="TaskTitle"]`, `[class*="taskTitle"]`, …) because Math Academy's class names are hash-suffixed and change between builds; prefer adding patterns over hard-coding exact class names.

`offsetParent` would skip `position: fixed` headers — `getClientRects().length > 0` is used instead.

## When adding a topic to `KHAN_TOPIC_MAP`

Shape: `"lowercase topic key": { video: "<khan url>", youtube: "<11-char id or null>", title: "Title Case" }`. After adding rows:

1. Run `node scripts/test-matcher.js` — make sure no existing case regresses.
2. Run `node scripts/validate-youtube-ids.js` if you added new IDs — confirms they embed.

Keep keys lowercase and singular-ish; the matcher does its own filler-word stripping, so don't include `"introduction to"` in the key.

## Versioning

Bump `manifest.json` `version` for any user-visible change — the popup reads it via `chrome.runtime.getManifest()` and shows it in the header. Commit messages follow `vX.Y: short description` for feature releases and `fix: …` / `scripts: …` for smaller changes (see `git log`).
