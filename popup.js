// Popup — tabs (Now / Saved / History / Settings) backed by db.js.

document.addEventListener('DOMContentLoaded', async () => {
  // Tabs ────────────────────────────────────────────────────────
  const tabs = document.querySelectorAll('.tab');
  const panels = {
    now: document.getElementById('panel-now'),
    saved: document.getElementById('panel-saved'),
    history: document.getElementById('panel-history'),
    settings: document.getElementById('panel-settings'),
  };
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.toggle('active', t === tab));
      const which = tab.dataset.tab;
      Object.entries(panels).forEach(([k, p]) => p.classList.toggle('active', k === which));
      if (which === 'saved') renderSaved();
      if (which === 'history') renderHistory();
    });
  });

  // Header version from manifest
  try {
    const mf = chrome.runtime.getManifest();
    if (mf && mf.version) document.getElementById('ver').textContent = 'v' + mf.version;
  } catch (e) {}

  // Settings ────────────────────────────────────────────────────
  const toggleA = document.getElementById('toggle-enabled');
  const toggleB = document.getElementById('toggle-enabled-2');
  const apiKeyInput = document.getElementById('api-key');
  const saveKeyBtn = document.getElementById('save-key');
  const apiStatus = document.getElementById('api-status');

  const stored = await chrome.storage.local.get(['enabled', 'ytApiKey']);
  const enabled = stored.enabled !== false;
  toggleA.checked = enabled; toggleB.checked = enabled;
  const onToggle = (e) => {
    chrome.storage.local.set({ enabled: e.target.checked });
    toggleA.checked = e.target.checked; toggleB.checked = e.target.checked;
  };
  toggleA.addEventListener('change', onToggle);
  toggleB.addEventListener('change', onToggle);

  if (stored.ytApiKey) {
    apiKeyInput.value = stored.ytApiKey;
    apiStatus.textContent = 'Active'; apiStatus.className = 'api-status set';
  }
  saveKeyBtn.addEventListener('click', async () => {
    const v = apiKeyInput.value.trim();
    if (!v) {
      await chrome.storage.local.remove('ytApiKey');
      apiStatus.textContent = 'Not set'; apiStatus.className = 'api-status unset';
      saveKeyBtn.textContent = 'Cleared';
      setTimeout(() => { saveKeyBtn.textContent = 'Save'; }, 1200);
      return;
    }
    await chrome.storage.local.set({ ytApiKey: v });
    apiStatus.textContent = 'Active'; apiStatus.className = 'api-status set';
    saveKeyBtn.textContent = 'Saved';
    setTimeout(() => { saveKeyBtn.textContent = 'Save'; }, 1200);
  });

  // Stats ───────────────────────────────────────────────────────
  await refreshStats();

  // Now panel ──────────────────────────────────────────────────
  const statusEl = document.getElementById('status');
  const openBtn = document.getElementById('open-khan-video');
  const topicInput = document.getElementById('topic-override');

  let activeTab = null;
  let detected = null;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    activeTab = tab || null;
  } catch (e) {}

  const onMathAcademy = !!(activeTab && activeTab.url && activeTab.url.includes('mathacademy.com'));

  if (!onMathAcademy) {
    statusEl.innerHTML = `<span class="warn">Open mathacademy.com first.</span>`;
  } else {
    try {
      const res = await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => (typeof window.__kbGetCurrentMatch === 'function' ? window.__kbGetCurrentMatch() : null),
      });
      detected = res?.[0]?.result || null;
    } catch (e) {}

    if (detected && detected.topic) {
      const t = detected.videoData?.title || detected.topic;
      const hasYt = !!detected.videoData?.youtube;
      statusEl.innerHTML = hasYt
        ? `Detected: <strong>${escapeHtml(t)}</strong>`
        : (stored.ytApiKey
            ? `Detected: <strong>${escapeHtml(detected.topic)}</strong> (will search YouTube)`
            : `No exact match — will search for <strong>${escapeHtml(detected.topic)}</strong>`);
    } else {
      statusEl.innerHTML = `No math topic detected. Type one below or open a lesson.`;
    }
  }

  openBtn.addEventListener('click', async () => {
    const typed = topicInput.value.trim();
    if (!onMathAcademy) {
      const q = typed || (detected && detected.topic) || 'math';
      chrome.tabs.create({ url: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(q)}` });
      window.close();
      return;
    }
    try {
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (forced) => (typeof window.__kbShowVideo === 'function' ? window.__kbShowVideo(forced) : null),
        args: [typed || null],
      });
      window.close();
    } catch (e) {
      const q = typed || (detected && detected.topic) || 'math';
      chrome.tabs.create({ url: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(q)}` });
    }
  });

  // Autocomplete ───────────────────────────────────────────────
  const suggestionsBox = document.getElementById('suggestions');
  let suggestionPool = null; // lazy-built list of all candidate topics
  let focusedSuggestion = -1;

  async function buildSuggestionPool() {
    const pool = new Map(); // key (lowercased) → { topic, kind }
    // saved overrides first (highest signal)
    try {
      const saved = await KBdb.listMappings();
      saved.forEach((m) => { if (m.topic) pool.set(m.topic, { topic: m.topic, kind: 'user' }); });
    } catch (e) {}
    // history next
    try {
      const hist = await KBdb.listHistory(80);
      hist.forEach((h) => { if (h.topic && !pool.has(h.topic.toLowerCase())) pool.set(h.topic.toLowerCase(), { topic: h.topic, kind: 'history' }); });
    } catch (e) {}
    // built-in topic map last
    if (typeof KHAN_TOPIC_MAP === 'object') {
      Object.keys(KHAN_TOPIC_MAP).forEach((k) => { if (!pool.has(k)) pool.set(k, { topic: k, kind: 'builtin' }); });
    }
    return Array.from(pool.values());
  }

  function rankSuggestions(query, pool) {
    const q = query.toLowerCase().trim();
    if (!q) return pool.filter((p) => p.kind !== 'builtin').slice(0, 8);
    const scored = [];
    for (const item of pool) {
      const t = item.topic.toLowerCase();
      let score = 0;
      if (t === q) score = 100;
      else if (t.startsWith(q)) score = 60;
      else if (t.includes(' ' + q)) score = 45;
      else if (t.includes(q)) score = 30;
      else {
        // word-overlap fallback: any q-word starts a t-word
        const qw = q.split(/\s+/).filter(Boolean);
        const tw = t.split(/\s+/);
        let hits = 0;
        for (const w of qw) if (tw.some((tt) => tt.startsWith(w))) hits++;
        if (hits) score = 10 + hits * 4;
      }
      if (score === 0) continue;
      // boost saved & history above built-in
      if (item.kind === 'user') score += 12;
      else if (item.kind === 'history') score += 6;
      // shorter exact-ish matches first
      score -= Math.min(8, Math.max(0, t.length - q.length) / 4);
      scored.push({ item, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8).map((s) => s.item);
  }

  async function renderSuggestions() {
    if (!suggestionPool) suggestionPool = await buildSuggestionPool();
    const items = rankSuggestions(topicInput.value, suggestionPool);
    if (!items.length) { suggestionsBox.classList.remove('open'); suggestionsBox.innerHTML = ''; return; }
    suggestionsBox.innerHTML = items.map((it, i) => {
      const tag = it.kind === 'user'
        ? `<span class="suggestion-tag user">Saved</span>`
        : it.kind === 'history'
          ? `<span class="suggestion-tag history">Recent</span>`
          : '';
      return `<div class="suggestion" data-i="${i}" data-topic="${escapeAttr(it.topic)}">
        <span class="suggestion-text">${escapeHtml(it.topic)}</span>${tag}
      </div>`;
    }).join('');
    suggestionsBox.classList.add('open');
    focusedSuggestion = -1;
    suggestionsBox.querySelectorAll('.suggestion').forEach((el) => {
      el.addEventListener('mousedown', (ev) => {
        ev.preventDefault();
        topicInput.value = el.dataset.topic || '';
        suggestionsBox.classList.remove('open');
        topicInput.focus();
      });
    });
  }

  topicInput.addEventListener('input', renderSuggestions);
  topicInput.addEventListener('focus', renderSuggestions);
  topicInput.addEventListener('blur', () => {
    setTimeout(() => suggestionsBox.classList.remove('open'), 120);
  });
  topicInput.addEventListener('keydown', (e) => {
    const open = suggestionsBox.classList.contains('open');
    const items = suggestionsBox.querySelectorAll('.suggestion');
    if (open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      if (!items.length) return;
      focusedSuggestion = Math.max(0, Math.min(items.length - 1,
        focusedSuggestion + (e.key === 'ArrowDown' ? 1 : -1)));
      items.forEach((el, i) => el.classList.toggle('focused', i === focusedSuggestion));
      items[focusedSuggestion].scrollIntoView({ block: 'nearest' });
      return;
    }
    if (e.key === 'Enter') {
      if (open && focusedSuggestion >= 0 && items[focusedSuggestion]) {
        e.preventDefault();
        topicInput.value = items[focusedSuggestion].dataset.topic || '';
        suggestionsBox.classList.remove('open');
        return;
      }
      openBtn.click();
    }
    if (e.key === 'Escape') suggestionsBox.classList.remove('open');
  });

  // Saved tab actions ─────────────────────────────────────────
  document.getElementById('export-btn').addEventListener('click', async () => {
    const data = await KBdb.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khan-booster-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  document.getElementById('clear-saved-btn').addEventListener('click', async () => {
    if (!confirm('Forget all saved video overrides? This can\'t be undone.')) return;
    await chrome.storage.local.set({ 'kb.mappings': {} });
    await renderSaved();
    await refreshStats();
  });
  document.getElementById('clear-history-btn').addEventListener('click', async () => {
    if (!confirm('Clear playback history?')) return;
    await KBdb.clearHistory();
    await renderHistory();
  });
  document.getElementById('reload-link').addEventListener('click', async (e) => {
    e.preventDefault();
    await refreshStats();
    await renderSaved();
    await renderHistory();
  });

  // Render saved + history once at load so the count badges are accurate
  await renderSaved();
  await renderHistory();

  // ── Render functions ──────────────────────────────────────────
  async function refreshStats() {
    const stats = await KBdb.getStats();
    const mappings = await KBdb.listMappings();
    const history = await KBdb.listHistory();
    document.getElementById('stat-today').textContent = stats.todayOpens || 0;
    document.getElementById('stat-total').textContent = stats.totalOpens || 0;
    document.getElementById('stat-saved').textContent = mappings.length;
    document.getElementById('saved-count').textContent = mappings.length;
    document.getElementById('history-count').textContent = history.length;
  }

  async function renderSaved() {
    const list = await KBdb.listMappings();
    document.getElementById('saved-count').textContent = list.length;
    const container = document.getElementById('saved-list');
    if (!list.length) {
      container.innerHTML = `
        <div class="list-empty">
          <strong>No saved videos yet.</strong>
          When you click "Wrong video?" in the player and pick a different YouTube link, it'll save here so the topic always loads your version.
        </div>`;
      return;
    }
    container.className = 'list';
    container.innerHTML = list.map((m) => {
      const badge = m.source === 'user'
        ? `<span class="item-badge badge-user">Your pick</span>`
        : m.source === 'youtube-api'
          ? `<span class="item-badge badge-yt">YT cache</span>`
          : `<span class="item-badge badge-local">Local</span>`;
      const last = m.lastUsed ? timeAgo(m.lastUsed) : 'never';
      const ytUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(m.youtube)}`;
      return `
        <div class="item" data-topic="${escapeAttr(m.topic)}">
          <div class="item-row1">
            <span class="item-topic" title="${escapeAttr(m.topic)}">${escapeHtml(m.topic)}</span>
            ${badge}
          </div>
          <div class="item-row2">
            <a href="${escapeAttr(ytUrl)}" target="_blank" rel="noopener">${escapeHtml(m.youtube)}</a>
            <span>·</span>
            <span>${m.useCount || 1}× · ${last}</span>
            <span class="spacer"></span>
            <button class="item-btn" data-action="delete">Forget</button>
          </div>
        </div>`;
    }).join('');
    container.querySelectorAll('button[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const topic = btn.closest('.item')?.dataset.topic;
        if (!topic) return;
        await KBdb.deleteMapping(topic);
        await renderSaved();
        await refreshStats();
      });
    });
  }

  async function renderHistory() {
    const list = await KBdb.listHistory(80);
    document.getElementById('history-count').textContent = list.length;
    const container = document.getElementById('history-list');
    if (!list.length) {
      container.innerHTML = `
        <div class="list-empty">
          <strong>No history yet.</strong>
          Open a video on Math Academy and it'll show up here.
        </div>`;
      return;
    }
    container.className = 'list';
    container.innerHTML = list.map((h) => {
      const ytUrl = h.youtube ? `https://www.youtube.com/watch?v=${encodeURIComponent(h.youtube)}` : '#';
      const badge = h.source === 'user'
        ? `<span class="item-badge badge-user">Your pick</span>`
        : h.source === 'youtube-api'
          ? `<span class="item-badge badge-yt">YT</span>`
          : `<span class="item-badge badge-local">Local</span>`;
      return `
        <div class="item">
          <div class="item-row1">
            <span class="item-topic" title="${escapeAttr(h.title || h.topic)}">${escapeHtml(h.title || h.topic)}</span>
            ${badge}
          </div>
          <div class="item-row2">
            ${h.youtube ? `<a href="${escapeAttr(ytUrl)}" target="_blank" rel="noopener">${escapeHtml(h.youtube)}</a><span>·</span>` : ''}
            <span>${escapeHtml(h.topic)}</span>
            <span class="spacer"></span>
            <span>${timeAgo(h.ts)}</span>
          </div>
        </div>`;
    }).join('');
  }
});

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}
function escapeAttr(text) {
  return escapeHtml(text).replace(/"/g, '&quot;');
}
function timeAgo(ts) {
  const sec = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (sec < 60) return sec + 's ago';
  const min = Math.floor(sec / 60);
  if (min < 60) return min + 'm ago';
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + 'h ago';
  const day = Math.floor(hr / 24);
  if (day < 30) return day + 'd ago';
  const mo = Math.floor(day / 30);
  return mo + 'mo ago';
}
