// Khan Booster — embedded player wrapper.
//
// Loaded by player.html (chrome-extension://<id>/player.html?yt=<id>) which
// content.js sets as the modal iframe src. This file embeds the actual
// youtube-nocookie player and forwards YouTube IFrame API onError /
// onReady events to the parent window via postMessage. The parent
// (content.js) listens on `e.data.source === 'kb-player'`.
//
// Why this layer exists: gives us same-origin access to the iframe's
// load/error and a reliable error-code signal for embed-disabled videos
// (YouTube error 101/150). Also future-proofs against Math Academy
// adding a CSP that blocks direct YouTube iframes — chrome-extension://
// pages aren't subject to the host page's CSP.
(function () {
  "use strict";
  const params = new URLSearchParams(location.search);
  const yt = (params.get('yt') || '').trim();
  const post = (msg) => { try { parent.postMessage(Object.assign({ source: 'kb-player' }, msg), '*'); } catch (e) {} };

  if (!yt || !/^[A-Za-z0-9_-]{6,}$/.test(yt)) {
    document.body.innerHTML = '<div class="empty"><p>No video specified.</p></div>';
    post({ type: 'error', reason: 'no-yt-id' });
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(yt) +
    '?rel=0&modestbranding=1&autoplay=1&playsinline=1&enablejsapi=1&origin=' +
    encodeURIComponent(location.origin);
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  // referrerpolicy guards against Chrome stripping the Referer header from
  // extension iframes — without it, YouTube can return error 153 even for
  // perfectly normal embeddable videos.
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  iframe.setAttribute('allowfullscreen', '');
  iframe.addEventListener('load', () => post({ type: 'loaded', yt }));
  document.body.appendChild(iframe);

  // YouTube IFrame API messages arrive as JSON-stringified objects.
  // Origin check: only trust messages from the YouTube embed iframe — any
  // page can postMessage and we don't want to spoof an error/ready signal.
  window.addEventListener('message', (e) => {
    if (e.source !== iframe.contentWindow) return;
    if (!e.data) return;
    let data;
    try { data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (err) { return; }
    if (!data) return;
    // The IFrame API sends { event: 'onError', info: <code> } and
    // { event: 'onReady' }. Forward both: parent uses onReady to know the
    // player is actually playable (not just that the shell loaded).
    if (data.event === 'onError') {
      post({ type: 'error', reason: 'yt-error', code: data.info, yt });
    } else if (data.event === 'onReady') {
      post({ type: 'ready', yt });
      try {
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
      } catch (err) {}
    }
  });
})();
