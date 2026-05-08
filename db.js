// Khan Booster local database — chrome.storage.local key/value store.
//
// Three logical collections, all kept under separate top-level keys so
// chrome.storage.local stays a flat bag (it doesn't support nested writes
// without rewriting the whole value):
//
//   kb.mappings   — { [topicLower]: { youtube, title, source, savedAt, lastUsed, useCount } }
//                   "source" is one of: 'user' | 'youtube-api' | 'local-map'
//                   user > youtube-api > local-map for resolution priority.
//   kb.history    — array of { ts, topic, youtube, title, source }, capped at 200.
//   kb.stats      — { totalOpens, todayKey, todayOpens, firstUseAt }
//
// All functions are async and tolerate missing chrome.storage gracefully so
// the file can be loaded in either content scripts or popup pages.

(function (root) {
  "use strict";

  const HAS_STORAGE = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
  const HISTORY_CAP = 200;

  function get(keys) {
    if (!HAS_STORAGE) return Promise.resolve({});
    return new Promise((resolve) => {
      try { chrome.storage.local.get(keys, (r) => resolve(r || {})); }
      catch (e) { resolve({}); }
    });
  }

  function set(obj) {
    if (!HAS_STORAGE) return Promise.resolve();
    return new Promise((resolve) => {
      try { chrome.storage.local.set(obj, () => resolve()); }
      catch (e) { resolve(); }
    });
  }

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function normTopic(t) {
    return (t || '').toLowerCase().trim().replace(/\s+/g, ' ');
  }

  // ── Mappings ─────────────────────────────────────────────────
  async function getMapping(topic) {
    const key = normTopic(topic);
    if (!key) return null;
    const r = await get('kb.mappings');
    const all = r['kb.mappings'] || {};
    return all[key] || null;
  }

  async function saveMapping(topic, { youtube, title, source }) {
    const key = normTopic(topic);
    if (!key || !youtube) return;
    const r = await get('kb.mappings');
    const all = r['kb.mappings'] || {};
    const existing = all[key];

    // Don't downgrade: a 'user' override should never be replaced by a
    // 'youtube-api' or 'local-map' entry. Same youtube + same source bumps
    // the lastUsed/useCount only.
    const rank = { 'user': 3, 'youtube-api': 2, 'local-map': 1 };
    if (existing && rank[existing.source] > rank[source] && existing.youtube !== youtube) return;

    all[key] = {
      youtube,
      title: title || (existing && existing.title) || topic,
      source: source || 'youtube-api',
      savedAt: (existing && existing.savedAt) || Date.now(),
      lastUsed: Date.now(),
      useCount: ((existing && existing.useCount) || 0) + 1,
    };
    await set({ 'kb.mappings': all });
  }

  async function bumpMappingUse(topic) {
    const key = normTopic(topic);
    if (!key) return;
    const r = await get('kb.mappings');
    const all = r['kb.mappings'] || {};
    if (!all[key]) return;
    all[key].lastUsed = Date.now();
    all[key].useCount = (all[key].useCount || 0) + 1;
    await set({ 'kb.mappings': all });
  }

  async function deleteMapping(topic) {
    const key = normTopic(topic);
    if (!key) return;
    const r = await get('kb.mappings');
    const all = r['kb.mappings'] || {};
    if (!all[key]) return;
    delete all[key];
    await set({ 'kb.mappings': all });
  }

  async function listMappings() {
    const r = await get('kb.mappings');
    const all = r['kb.mappings'] || {};
    return Object.entries(all)
      .map(([topic, v]) => Object.assign({ topic }, v))
      .sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0));
  }

  // ── History ──────────────────────────────────────────────────
  async function recordHistory({ topic, youtube, title, source }) {
    if (!topic) return;
    const r = await get('kb.history');
    const list = Array.isArray(r['kb.history']) ? r['kb.history'] : [];
    list.unshift({ ts: Date.now(), topic, youtube: youtube || null, title: title || topic, source: source || 'unknown' });
    if (list.length > HISTORY_CAP) list.length = HISTORY_CAP;
    await set({ 'kb.history': list });
  }

  async function listHistory(limit) {
    const r = await get('kb.history');
    const list = Array.isArray(r['kb.history']) ? r['kb.history'] : [];
    return typeof limit === 'number' ? list.slice(0, limit) : list;
  }

  async function clearHistory() {
    await set({ 'kb.history': [] });
  }

  // ── Stats ────────────────────────────────────────────────────
  async function bumpStats() {
    const r = await get('kb.stats');
    const s = r['kb.stats'] || { totalOpens: 0, todayKey: null, todayOpens: 0, firstUseAt: null };
    const tk = todayKey();
    if (s.todayKey !== tk) { s.todayKey = tk; s.todayOpens = 0; }
    s.totalOpens = (s.totalOpens || 0) + 1;
    s.todayOpens = (s.todayOpens || 0) + 1;
    if (!s.firstUseAt) s.firstUseAt = Date.now();
    await set({ 'kb.stats': s });
    return s;
  }

  async function getStats() {
    const r = await get('kb.stats');
    return r['kb.stats'] || { totalOpens: 0, todayKey: todayKey(), todayOpens: 0, firstUseAt: null };
  }

  // ── Bulk export / import (for "save your data" use cases) ────
  async function exportAll() {
    const r = await get(['kb.mappings', 'kb.history', 'kb.stats']);
    return {
      mappings: r['kb.mappings'] || {},
      history: r['kb.history'] || [],
      stats: r['kb.stats'] || null,
      exportedAt: new Date().toISOString(),
    };
  }

  async function importMappings(mappings) {
    if (!mappings || typeof mappings !== 'object') return 0;
    const r = await get('kb.mappings');
    const all = r['kb.mappings'] || {};
    let added = 0;
    for (const [k, v] of Object.entries(mappings)) {
      if (!v || !v.youtube) continue;
      const key = normTopic(k);
      if (!key) continue;
      all[key] = Object.assign({}, all[key], v);
      added++;
    }
    await set({ 'kb.mappings': all });
    return added;
  }

  const KBdb = {
    getMapping, saveMapping, bumpMappingUse, deleteMapping, listMappings,
    recordHistory, listHistory, clearHistory,
    bumpStats, getStats,
    exportAll, importMappings,
    normTopic,
  };

  // Expose to whichever environment loaded us.
  if (typeof window !== 'undefined') window.KBdb = KBdb;
  if (typeof globalThis !== 'undefined') globalThis.KBdb = KBdb;
  if (typeof module !== 'undefined') module.exports = KBdb;
})(typeof window !== 'undefined' ? window : globalThis);
