// Khan Academy Video Booster — content script (v3.1)
// Floating "Play Video" pill on the right edge of mathacademy.com.
// Click → in-page modal with the matching Khan Academy video.
// No auto-popups, no XP, no quizzes.

(function () {
  "use strict";

  const LOG = (...a) => { try { console.log('[KB]', ...a); } catch (e) {} };
  LOG('content.js loaded', location.href);

  let currentTopic = null;
  let extensionEnabled = true;
  let ytApiKey = null;
  const KHAN_CHANNEL_ID = 'UC4a-Gbdw7vOaccHmFo40b9g'; // Khan Academy official YouTube channel
  const ytSearchCache = new Map(); // topic → { id, title } (per-session)

  // ── Storage / enabled toggle ────────────────────────────────
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['enabled', 'ytApiKey'], (r) => {
      extensionEnabled = r.enabled !== false;
      ytApiKey = r.ytApiKey || null;
      LOG('enabled?', extensionEnabled, 'api?', !!ytApiKey);
      syncSideButton();
    });
    chrome.storage.onChanged.addListener((c) => {
      if (c.enabled) {
        extensionEnabled = c.enabled.newValue !== false;
        if (!extensionEnabled) closeOverlay();
        syncSideButton();
      }
      if (c.ytApiKey) ytApiKey = c.ytApiKey.newValue || null;
    });
  }

  // ── YouTube Data API search ─────────────────────────────────
  // Searches YouTube for the given query. If channelId given, restricts to
  // that channel; otherwise searches all of YouTube. Falls back gracefully
  // if no key, quota exhausted, or network error.
  async function ytSearch(query, channelId) {
    if (!ytApiKey) return null;
    const cacheKey = (channelId || 'all') + '::' + query.toLowerCase();
    if (ytSearchCache.has(cacheKey)) return ytSearchCache.get(cacheKey);

    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('maxResults', '1');
    url.searchParams.set('type', 'video');
    url.searchParams.set('videoEmbeddable', 'true');
    url.searchParams.set('q', query);
    if (channelId) url.searchParams.set('channelId', channelId);
    url.searchParams.set('key', ytApiKey);

    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), 4000);
    try {
      const res = await fetch(url.toString(), { signal: ctrl.signal });
      clearTimeout(timeoutId);
      if (!res.ok) { LOG('YT API error', res.status, query); return null; }
      const data = await res.json();
      const item = data.items && data.items[0];
      if (!item || !item.id || !item.id.videoId) return null;
      const result = { id: item.id.videoId, title: item.snippet?.title || query };
      ytSearchCache.set(cacheKey, result);
      return result;
    } catch (e) {
      clearTimeout(timeoutId);
      LOG('YT API fetch failed', e?.message || e);
      return null;
    }
  }

  // Loose fuzzy lookup against the local map: try the topic, then each word.
  function looseLocalMatch(topic) {
    if (typeof findBestTopicMatch !== 'function') return null;
    let m = findBestTopicMatch(topic);
    if (m && m.youtube) return m;
    const words = topic.toLowerCase().split(/[\s,/\-:;()]+/).filter((w) => w.length > 3);
    for (const w of words) {
      m = findBestTopicMatch(w);
      if (m && m.youtube) return m;
    }
    return null;
  }

  // Last-resort safety net: a Sal Khan general math intro.
  // "Why we do math" — one of Khan Academy's most popular evergreen videos.
  const FALLBACK_VIDEO = { youtube: 'AuX7nPBqDts', title: 'Khan Academy basics (closest match)' };

  // ── Topic detection ─────────────────────────────────────────
  function isLikelyTopic(text) {
    if (!text) return false;
    const t = text.trim();
    if (t.length < 3 || t.length > 80) return false;
    const skip = [
      /^(menu|home|profile|settings|log\s?out|sign|account|dashboard|xp|level|streak|score|points|coins|back|next|skip|submit|continue|help|close|cancel|loading|error|courses|pedagogy|faq|about|login|join|sign up|copyright|terms|privacy|play video)/i,
      /^\d+$/, /^[\W_]+$/,
    ];
    return !skip.some((p) => p.test(t));
  }

  function detectTopic() {
    const candidates = [];
    const add = (text, priority) => {
      if (text && isLikelyTopic(text)) candidates.push({ text: text.trim(), priority });
    };

    document.querySelectorAll('[data-topic],[data-lesson],[data-title],[data-task-name],[data-name]').forEach((el) => {
      add(el.dataset.topic || el.dataset.lesson || el.dataset.title || el.dataset.taskName || el.dataset.name, 12);
      add(el.getAttribute('aria-label'), 11);
    });

    const sel = [
      '.task-title', '.lesson-title', '.topic-title', '.task-name', '.topic-name', '.lesson-name',
      '[class*="TopicName"]', '[class*="topic-name"]', '[class*="LessonTitle"]',
      '[class*="TaskTitle"]', '[class*="taskTitle"]', '[class*="task-title"]',
      '[class*="TaskCard"]', '[class*="taskCard"]',
      '[class*="LessonHeader"]', '[class*="UnitTitle"]', '[class*="SectionTitle"]',
      '[class*="Objective"]', '[class*="objective"]',
    ];
    for (const s of sel) {
      try {
        document.querySelectorAll(s).forEach((el) => {
          if (el.closest('#khan-booster-overlay')) return;
          if (el.closest('#kb-side-btn')) return;
          const cleaned = el.textContent.trim()
            .replace(/^\d+\.\d+(\.\d+)?\s*/, '')
            .replace(/^(Unit|Section|Lesson|Chapter)\s*\d+\s*[:.\-]\s*/i, '')
            .trim();
          if (cleaned.length > 2 && cleaned.length < 80 && el.offsetParent !== null) add(cleaned, 9);
        });
      } catch (e) {}
    }

    document.querySelectorAll('h1,h2,h3').forEach((h) => {
      if (h.closest('#khan-booster-overlay')) return;
      if (h.closest('#kb-side-btn')) return;
      add(h.textContent.trim(), 7);
    });

    if (!candidates.length) return null;
    candidates.sort((a, b) => b.priority - a.priority);
    return candidates[0].text;
  }

  function findKhanVideo(topic) {
    let map = null;
    try { if (typeof findBestTopicMatch === 'function') map = findBestTopicMatch(topic); } catch (e) {}
    if (map) return map;
    return {
      title: topic,
      youtube: null,
      video: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(topic)}`,
      khanUrl: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(topic)}`,
      searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent('khan academy ' + topic + ' math')}`,
    };
  }

  // Wrap a saved DB mapping into the same shape as the local map entries.
  function wrapSaved(saved, topic) {
    const local = findKhanVideo(topic);
    return {
      title: saved.title || (local && local.title) || topic,
      youtube: saved.youtube,
      video: (local && local.video) || `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(topic)}`,
      khanUrl: (local && local.khanUrl) || `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(topic)}`,
      searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent('khan academy ' + topic)}`,
      source: saved.source || 'saved',
    };
  }

  // Translate an internal source code into a friendly badge.
  function sourceBadge(source) {
    if (source === 'user') return { text: 'Your pick', cls: 'kb-badge-user' };
    if (source === 'youtube-api' || source === 'saved') return { text: 'YT cache', cls: 'kb-badge-yt' };
    return { text: 'Built-in', cls: 'kb-badge-local' };
  }

  // Parse a YouTube URL or raw video ID into an 11-char video ID.
  function parseYouTubeId(input) {
    if (!input) return null;
    const s = String(input).trim();
    // Raw 11-char video ID
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    // youtu.be/<id>
    let m = s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    // youtube.com/watch?v=<id>
    m = s.match(/[?&]v=([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    // youtube.com/embed/<id>
    m = s.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    // youtube.com/shorts/<id>
    m = s.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return null;
  }

  // ── Overlay ─────────────────────────────────────────────────
  function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }

  function closeOverlay() {
    const ex = document.getElementById('khan-booster-overlay');
    if (ex) ex.remove();
    document.removeEventListener('keydown', escHandler);
  }

  function escHandler(e) { if (e.key === 'Escape') closeOverlay(); }

  function showOverlay(topic, videoData) {
    LOG('showOverlay', topic, videoData);
    closeOverlay();

    const title = (videoData && videoData.title) || topic || 'Khan Academy';
    const yt = videoData && videoData.youtube;
    const khanUrl = (videoData && (videoData.video || videoData.khanUrl))
      || `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(topic || 'math')}`;
    const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent('khan academy ' + (topic || 'math'))}`;
    const ytWatch = yt ? `https://www.youtube.com/watch?v=${encodeURIComponent(yt)}` : null;

    // Track real video opens (not the loading skeleton or the empty state).
    if (yt && topic && !videoData?.loading && typeof KBdb !== 'undefined') {
      try {
        KBdb.bumpStats();
        KBdb.recordHistory({ topic, youtube: yt, title, source: videoData.source || 'local-map' });
        KBdb.bumpMappingUse(topic);
      } catch (e) { LOG('stats record failed', e); }
    }

    const wrap = document.createElement('div');
    wrap.id = 'khan-booster-overlay';
    const badge = (yt && !videoData?.loading) ? sourceBadge(videoData?.source) : null;
    const badgeHtml = badge ? `<span class="kb-badge ${badge.cls}">${escapeHtml(badge.text)}</span>` : '';

    wrap.innerHTML = `
      <div class="kb-backdrop"></div>
      <div class="kb-modal" role="dialog" aria-modal="true" aria-label="Khan Academy video">
        <div class="kb-head">
          <div class="kb-title">
            <span class="kb-dot"></span>
            <span class="kb-topic">${escapeHtml(title)}</span>
            ${badgeHtml}
          </div>
          <button class="kb-close" id="kb-close" aria-label="Close">&times;</button>
        </div>
        <div class="kb-video">
          ${yt
            ? `<iframe id="kb-iframe"
                  src="https://www.youtube.com/embed/${encodeURIComponent(yt)}?rel=0&modestbranding=1&autoplay=1&playsinline=1"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen></iframe>`
            : (videoData && videoData.loading)
              ? `<div class="kb-empty kb-loading">
                   <div class="kb-spinner"></div>
                   <p>Searching Khan Academy for <strong>${escapeHtml(topic || 'this topic')}</strong>&hellip;</p>
                 </div>`
              : `<div class="kb-empty">
                   <p>No exact Khan Academy video for <strong>${escapeHtml(topic || 'this topic')}</strong>.</p>
                   <p class="kb-empty-sub">Use the buttons below to search Khan Academy or YouTube.</p>
                 </div>`
          }
        </div>
        <div class="kb-actions">
          ${ytWatch ? `<a class="kb-btn kb-btn-primary" href="${escapeHtml(ytWatch)}" target="_blank" rel="noopener">Open on YouTube</a>` : ''}
          <a class="kb-btn ${ytWatch ? 'kb-btn-ghost' : 'kb-btn-primary'}" href="${escapeHtml(khanUrl)}" target="_blank" rel="noopener">Open on Khan Academy</a>
          <button type="button" class="kb-btn kb-btn-ghost" id="kb-wrong">Wrong video?</button>
        </div>
        <div class="kb-override" id="kb-override" hidden>
          <div class="kb-override-help">
            Paste a YouTube URL or 11-character video ID. We'll save it for
            <strong>${escapeHtml(topic || 'this topic')}</strong> on this device.
          </div>
          <div class="kb-override-row">
            <input type="text" id="kb-override-input" placeholder="https://www.youtube.com/watch?v=..." autocomplete="off" spellcheck="false" />
            <button type="button" class="kb-btn kb-btn-primary kb-override-save" id="kb-override-save">Save</button>
          </div>
          <div class="kb-override-row kb-override-row-secondary">
            <a class="kb-link" href="${escapeHtml(ytSearch)}" target="_blank" rel="noopener">Search YouTube for a better one &rarr;</a>
            <button type="button" class="kb-link kb-link-danger" id="kb-override-clear" ${yt ? '' : 'hidden'}>Forget saved video</button>
          </div>
          <div class="kb-override-msg" id="kb-override-msg" hidden></div>
        </div>
      </div>
    `;
    (document.body || document.documentElement).appendChild(wrap);

    const closeBtn = wrap.querySelector('#kb-close');
    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
    const backdrop = wrap.querySelector('.kb-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeOverlay);
    document.addEventListener('keydown', escHandler);

    // Override panel: lets the user pin a different video for this topic.
    const wrongBtn = wrap.querySelector('#kb-wrong');
    const overridePane = wrap.querySelector('#kb-override');
    const overrideInput = wrap.querySelector('#kb-override-input');
    const overrideSave = wrap.querySelector('#kb-override-save');
    const overrideClear = wrap.querySelector('#kb-override-clear');
    const overrideMsg = wrap.querySelector('#kb-override-msg');
    const showMsg = (text, kind) => {
      if (!overrideMsg) return;
      overrideMsg.textContent = text;
      overrideMsg.className = 'kb-override-msg' + (kind ? ' kb-msg-' + kind : '');
      overrideMsg.hidden = false;
    };

    if (wrongBtn && overridePane) {
      wrongBtn.addEventListener('click', () => {
        overridePane.hidden = !overridePane.hidden;
        if (!overridePane.hidden && overrideInput) overrideInput.focus();
      });
    }
    if (overrideSave && overrideInput) {
      const submit = async () => {
        const id = parseYouTubeId(overrideInput.value);
        if (!id) { showMsg("Couldn't read a YouTube video ID from that.", 'err'); return; }
        if (!topic) { showMsg('No topic to save against.', 'err'); return; }
        if (typeof KBdb === 'undefined') { showMsg('Storage unavailable.', 'err'); return; }
        try {
          await KBdb.saveMapping(topic, { youtube: id, title: topic, source: 'user' });
          showMsg('Saved. Reloading video…', 'ok');
          setTimeout(() => {
            showOverlay(topic, wrapSaved({ youtube: id, title: topic, source: 'user' }, topic));
          }, 350);
        } catch (e) {
          showMsg('Failed to save: ' + (e?.message || e), 'err');
        }
      };
      overrideSave.addEventListener('click', submit);
      overrideInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    }
    if (overrideClear) {
      overrideClear.addEventListener('click', async () => {
        if (typeof KBdb === 'undefined' || !topic) return;
        try {
          await KBdb.deleteMapping(topic);
          showMsg('Cleared. Resolving fresh video…', 'ok');
          setTimeout(async () => {
            const data = await resolveVideoData(topic);
            showOverlay(topic, data);
          }, 350);
        } catch (e) {
          showMsg('Failed to clear: ' + (e?.message || e), 'err');
        }
      });
    }

    if (yt) attachIframeErrorHandling(wrap, topic, ytSearch, khanUrl);
  }

  // ── Iframe load / timeout handling ──────────────────────────
  function attachIframeErrorHandling(wrap, topic, ytSearch, khanUrl) {
    const iframe = wrap.querySelector('#kb-iframe');
    if (!iframe) return;
    let resolved = false;

    const showFailure = (reason) => {
      if (resolved) return;
      resolved = true;
      LOG('iframe failed:', reason);
      const videoBox = wrap.querySelector('.kb-video');
      if (!videoBox) return;
      videoBox.innerHTML = `
        <div class="kb-empty">
          <p><strong>Couldn't load this video.</strong></p>
          <p class="kb-empty-sub">It might be unavailable or blocked from embedding. Try the buttons below.</p>
        </div>`;
    };

    iframe.addEventListener('load', () => { resolved = true; LOG('iframe loaded'); });
    iframe.addEventListener('error', () => showFailure('iframe-error'));
    setTimeout(() => { if (!resolved) showFailure('timeout'); }, 10000);
  }

  // ── Public API for popup ────────────────────────────────────
  window.__kbGetCurrentMatch = function () {
    const topic = currentTopic || detectTopic();
    if (!topic) return null;
    return { topic, videoData: findKhanVideo(topic) };
  };

  window.__kbShowVideo = async function (forcedTopic) {
    const topic = (forcedTopic && forcedTopic.trim()) || currentTopic || detectTopic();
    if (!topic) {
      showOverlay('Khan Academy', { title: 'Pick a topic', youtube: null,
        video: 'https://www.khanacademy.org/math', khanUrl: 'https://www.khanacademy.org/math' });
      return { ok: false, reason: 'no-topic' };
    }
    // DB-first so user overrides win immediately, no loading flicker.
    if (typeof KBdb !== 'undefined') {
      try {
        const saved = await KBdb.getMapping(topic);
        if (saved && saved.youtube) { showOverlay(topic, wrapSaved(saved, topic)); return { ok: true, topic }; }
      } catch (e) {}
    }
    const local = findKhanVideo(topic);
    if (local && local.youtube) { showOverlay(topic, local); return { ok: true, topic }; }
    showOverlay(topic, { title: topic, youtube: null, loading: true,
      video: local && local.video, khanUrl: local && local.khanUrl });
    const data = await resolveVideoData(topic);
    showOverlay(topic, data);
    return { ok: !!(data && data.youtube), topic };
  };

  // ── Resolve video data: tiered fallback so we ALWAYS return a video ──
  function wrapYt(yt, topic, local) {
    return {
      title: yt.title || (local && local.title) || topic,
      youtube: yt.id,
      video: (local && local.video) || `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(topic)}`,
      khanUrl: (local && local.khanUrl) || `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(topic)}`,
      searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent('khan academy ' + topic)}`,
      source: 'youtube-api',
    };
  }

  async function resolveVideoData(topic) {
    // 0) Database first — user overrides + previously cached YT hits.
    //    User overrides outrank everything (including a local map hit), so a
    //    student who corrected a bad video gets their version forever.
    if (typeof KBdb !== 'undefined') {
      try {
        const saved = await KBdb.getMapping(topic);
        if (saved && saved.youtube) return wrapSaved(saved, topic);
      } catch (e) { LOG('db read failed', e); }
    }

    const local = findKhanVideo(topic);

    // 1) Local exact / good fuzzy match — fastest path
    if (local && local.youtube) return local;

    // 2) Loose local match before any network call
    const loose = looseLocalMatch(topic);
    if (loose && loose.youtube) return Object.assign({}, loose);

    // 3) Single YouTube API search on Khan's channel (with 4s timeout)
    if (ytApiKey) {
      const yt = await ytSearch(topic, KHAN_CHANNEL_ID)
        || await ytSearch('khan academy ' + topic, null);
      if (yt) {
        const wrapped = wrapYt(yt, topic, local);
        // Persist so we don't burn quota on the same topic again, and so
        // the result is available offline next time.
        if (typeof KBdb !== 'undefined') {
          KBdb.saveMapping(topic, { youtube: yt.id, title: wrapped.title, source: 'youtube-api' });
        }
        return wrapped;
      }
    }

    // 4) Last resort: Khan Academy general math intro — never empty.
    return Object.assign({}, FALLBACK_VIDEO, {
      title: FALLBACK_VIDEO.title,
      video: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(topic)}`,
      khanUrl: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(topic)}`,
      searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent('khan academy ' + topic)}`,
    });
  }

  // ── Floating side button ────────────────────────────────────
  async function handleSideClick(e) {
    try {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    } catch (err) {}
    LOG('side-btn click', { extensionEnabled, currentTopic });
    if (!extensionEnabled) {
      LOG('extension disabled — ignoring click');
      return;
    }
    const topic = currentTopic || detectTopic();
    if (!topic) {
      showOverlay('Khan Academy', { title: 'No topic detected on this page', youtube: null,
        video: 'https://www.khanacademy.org/math', khanUrl: 'https://www.khanacademy.org/math' });
      return;
    }

    // DB-first so user overrides take priority over the static map.
    if (typeof KBdb !== 'undefined') {
      try {
        const saved = await KBdb.getMapping(topic);
        if (saved && saved.youtube) { showOverlay(topic, wrapSaved(saved, topic)); return; }
      } catch (err) {}
    }

    const local = findKhanVideo(topic);
    if (local && local.youtube) {
      showOverlay(topic, local);
      return;
    }

    // No local YT match — show loading state, then run the fallback chain
    showOverlay(topic, { title: topic, youtube: null, loading: true,
      video: (local && local.video), khanUrl: (local && local.khanUrl) });

    const data = await resolveVideoData(topic);
    showOverlay(topic, data);
  }

  function ensureSideButton() {
    if (document.getElementById('kb-side-btn')) return;
    if (!document.body) return;
    const btn = document.createElement('button');
    btn.id = 'kb-side-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Play Khan Academy video for this topic');
    btn.setAttribute('title', 'Play Khan Academy video (Alt+K)');
    btn.innerHTML = `
      <span class="kb-side-icon">&#9654;</span>
      <span class="kb-side-label">Play Video</span>
    `;
    btn.addEventListener('click', handleSideClick);
    document.body.appendChild(btn);
    LOG('side-btn injected');
  }

  // Document-level capture-phase fallback — catches clicks on the side
  // button even if Math Academy stops propagation in bubble phase.
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;
    if (target.id === 'kb-side-btn' || (target.closest && target.closest('#kb-side-btn'))) {
      handleSideClick(e);
    }
  }, true);

  // Keyboard shortcut: Alt+K to open the video overlay for the current
  // detected topic. Skipped while typing in inputs/contenteditables.
  document.addEventListener('keydown', (e) => {
    if (!extensionEnabled) return;
    if (!e.altKey || e.metaKey || e.ctrlKey) return;
    if ((e.key || '').toLowerCase() !== 'k') return;
    const ae = document.activeElement;
    if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return;
    e.preventDefault();
    e.stopPropagation();
    handleSideClick(e);
  }, true);

  function syncSideButton() {
    if (!extensionEnabled) {
      const b = document.getElementById('kb-side-btn');
      if (b) b.remove();
      return;
    }
    ensureSideButton();
  }

  // ── Passive topic tracking (no auto-overlay) ────────────────
  let debounceTimer = null;
  function refreshTopic() {
    const t = detectTopic();
    if (t && t.length >= 3) currentTopic = t;
  }
  function debouncedRefresh() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(refreshTopic, 500);
  }

  let lastUrl = window.location.href;
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      currentTopic = null;
      setTimeout(refreshTopic, 1500);
      syncSideButton();
    }
  }, 1000);

  function startObservers() {
    refreshTopic();
    syncSideButton();
    new MutationObserver(() => { debouncedRefresh(); syncSideButton(); })
      .observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', startObservers);
  } else if (document.body) {
    startObservers();
  } else {
    window.addEventListener('DOMContentLoaded', startObservers);
  }

  // Fallback in case DOMContentLoaded already fired before listener attached
  setTimeout(() => { if (document.body) { refreshTopic(); syncSideButton(); } }, 1500);

  // ── Inject styles (use !important to beat Math Academy's CSS) ──
  const style = document.createElement('style');
  style.id = 'kb-style';
  style.textContent = `
    #khan-booster-overlay {
      position: fixed !important;
      inset: 0 !important;
      z-index: 2147483600 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      pointer-events: auto !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    #khan-booster-overlay .kb-backdrop {
      position: absolute !important; inset: 0 !important;
      background: rgba(8,12,24,0.78) !important;
      backdrop-filter: blur(4px) !important;
    }
    #khan-booster-overlay .kb-modal {
      position: absolute !important;
      left: 50% !important; top: 50% !important;
      transform: translate(-50%,-50%) !important;
      width: min(900px, 92vw) !important;
      background: #11142a !important; color: #e6e7f2 !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      border-radius: 16px !important; overflow: hidden !important;
      box-shadow: 0 30px 80px rgba(0,0,0,0.5) !important;
    }
    #khan-booster-overlay .kb-head {
      display: flex !important; align-items: center !important; justify-content: space-between !important;
      padding: 14px 18px !important;
      border-bottom: 1px solid rgba(255,255,255,0.06) !important;
      background: linear-gradient(135deg, rgba(20,191,150,0.08), rgba(14,165,233,0.08)) !important;
    }
    #khan-booster-overlay .kb-title { display: flex !important; align-items: center !important; gap: 10px !important; font-weight: 700 !important; font-size: 15px !important; color: #e6e7f2 !important; flex: 1 !important; min-width: 0 !important; }
    #khan-booster-overlay .kb-topic { white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }
    #khan-booster-overlay .kb-badge {
      flex: 0 0 auto !important;
      font-size: 10px !important; font-weight: 700 !important;
      padding: 3px 8px !important; border-radius: 999px !important;
      letter-spacing: 0.4px !important; text-transform: uppercase !important;
    }
    #khan-booster-overlay .kb-badge-user { background: rgba(20,191,150,0.18) !important; color: #14BF96 !important; }
    #khan-booster-overlay .kb-badge-yt { background: rgba(14,165,233,0.18) !important; color: #0ea5e9 !important; }
    #khan-booster-overlay .kb-badge-local { background: rgba(255,255,255,0.06) !important; color: #9aa0bf !important; }
    #khan-booster-overlay .kb-dot { width: 10px !important; height: 10px !important; border-radius: 50% !important; background: linear-gradient(135deg,#14BF96,#0ea5e9) !important; box-shadow: 0 0 12px rgba(20,191,150,0.5) !important; }
    #khan-booster-overlay .kb-close { background: transparent !important; border: none !important; color: #9aa0bf !important; font-size: 28px !important; line-height: 1 !important; cursor: pointer !important; padding: 0 6px !important; }
    #khan-booster-overlay .kb-close:hover { color: #fff !important; }
    #khan-booster-overlay .kb-video { position: relative !important; width: 100% !important; aspect-ratio: 16/9 !important; background: #000 !important; }
    #khan-booster-overlay .kb-video iframe { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; border: 0 !important; }
    #khan-booster-overlay .kb-empty { display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; height: 100% !important; padding: 24px !important; text-align: center !important; color: #c9cce0 !important; gap: 10px !important; }
    #khan-booster-overlay .kb-empty-sub { color: #8a8fae !important; margin-top: 6px !important; font-size: 13px !important; }
    #khan-booster-overlay .kb-spinner {
      width: 36px !important; height: 36px !important;
      border: 3px solid rgba(255,255,255,0.1) !important;
      border-top-color: #14BF96 !important;
      border-radius: 50% !important;
      animation: kb-spin 0.9s linear infinite !important;
    }
    @keyframes kb-spin { to { transform: rotate(360deg); } }
    #khan-booster-overlay .kb-actions { display: flex !important; gap: 10px !important; padding: 14px 18px !important; border-top: 1px solid rgba(255,255,255,0.06) !important; }
    #khan-booster-overlay .kb-btn { flex: 1 !important; text-align: center !important; padding: 11px 14px !important; border-radius: 10px !important; font-weight: 700 !important; font-size: 13px !important; text-decoration: none !important; cursor: pointer !important; border: 1px solid transparent !important; }
    #khan-booster-overlay .kb-btn-primary { background: linear-gradient(135deg,#14BF96,#0ea5e9) !important; color: #fff !important; }
    #khan-booster-overlay .kb-btn-primary:hover { filter: brightness(1.06) !important; }
    #khan-booster-overlay .kb-btn-ghost { background: rgba(255,255,255,0.04) !important; color: #c9cce0 !important; border-color: rgba(255,255,255,0.08) !important; }
    #khan-booster-overlay .kb-btn-ghost:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }
    #khan-booster-overlay button.kb-btn { font-family: inherit !important; }

    #khan-booster-overlay .kb-override {
      padding: 14px 18px 16px !important;
      border-top: 1px solid rgba(255,255,255,0.06) !important;
      background: rgba(0,0,0,0.18) !important;
      display: flex !important; flex-direction: column !important; gap: 10px !important;
    }
    #khan-booster-overlay .kb-override[hidden] { display: none !important; }
    #khan-booster-overlay .kb-override-help { font-size: 12px !important; color: #9aa0bf !important; line-height: 1.5 !important; }
    #khan-booster-overlay .kb-override-help strong { color: #14BF96 !important; }
    #khan-booster-overlay .kb-override-row { display: flex !important; gap: 8px !important; align-items: center !important; }
    #khan-booster-overlay .kb-override-row-secondary { justify-content: space-between !important; font-size: 11px !important; }
    #khan-booster-overlay .kb-override-row input {
      flex: 1 !important;
      padding: 9px 11px !important;
      background: rgba(0,0,0,0.35) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      border-radius: 8px !important;
      color: #e6e7f2 !important; font-size: 12px !important;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important;
      outline: none !important;
    }
    #khan-booster-overlay .kb-override-row input:focus { border-color: #14BF96 !important; }
    #khan-booster-overlay .kb-override-save { flex: 0 0 auto !important; padding: 9px 16px !important; }
    #khan-booster-overlay .kb-link {
      background: transparent !important; border: none !important; padding: 0 !important;
      color: #6b8aff !important; text-decoration: none !important;
      font-size: 11px !important; font-weight: 600 !important; cursor: pointer !important;
      font-family: inherit !important;
    }
    #khan-booster-overlay .kb-link:hover { text-decoration: underline !important; color: #8da6ff !important; }
    #khan-booster-overlay .kb-link-danger { color: #f59e7a !important; }
    #khan-booster-overlay .kb-link-danger:hover { color: #f97e58 !important; }
    #khan-booster-overlay .kb-link[hidden] { display: none !important; }
    #khan-booster-overlay .kb-override-msg {
      font-size: 12px !important; padding: 8px 10px !important;
      border-radius: 6px !important; background: rgba(255,255,255,0.04) !important;
      color: #c9cce0 !important;
    }
    #khan-booster-overlay .kb-override-msg[hidden] { display: none !important; }
    #khan-booster-overlay .kb-msg-ok { background: rgba(20,191,150,0.15) !important; color: #14BF96 !important; }
    #khan-booster-overlay .kb-msg-err { background: rgba(245,158,11,0.18) !important; color: #f59e0b !important; }

    #kb-side-btn {
      position: fixed !important;
      right: 0 !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      z-index: 2147483500 !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      padding: 12px 14px 12px 16px !important;
      background: linear-gradient(135deg, #14BF96, #0ea5e9) !important;
      color: #fff !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 13px !important;
      font-weight: 700 !important;
      border: none !important;
      border-top-left-radius: 999px !important;
      border-bottom-left-radius: 999px !important;
      cursor: pointer !important;
      box-shadow: 0 6px 20px rgba(14,165,233,0.35) !important;
      transition: transform 0.18s ease, box-shadow 0.18s ease !important;
      letter-spacing: 0.2px !important;
      pointer-events: auto !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    #kb-side-btn:hover {
      transform: translateY(-50%) translateX(-2px) !important;
      box-shadow: 0 8px 24px rgba(14,165,233,0.5) !important;
    }
    #kb-side-btn:active { transform: translateY(-50%) translateX(0) !important; }
    #kb-side-btn::before {
      content: "";
      position: absolute !important;
      inset: 0 !important;
      border-top-left-radius: 999px !important;
      border-bottom-left-radius: 999px !important;
      box-shadow: 0 0 0 0 rgba(20,191,150,0.55);
      animation: kb-pulse 2.4s ease-out 2;
      pointer-events: none !important;
    }
    @keyframes kb-pulse {
      0% { box-shadow: 0 0 0 0 rgba(20,191,150,0.55); }
      70% { box-shadow: 0 0 0 14px rgba(20,191,150,0); }
      100% { box-shadow: 0 0 0 0 rgba(20,191,150,0); }
    }
    #kb-side-btn .kb-side-icon {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 22px !important; height: 22px !important;
      border-radius: 50% !important;
      background: rgba(255,255,255,0.22) !important;
      font-size: 11px !important;
      padding-left: 2px !important;
    }
    #kb-side-btn .kb-side-label { white-space: nowrap !important; color: #fff !important; }
  `;
  (document.head || document.documentElement).appendChild(style);
})();
