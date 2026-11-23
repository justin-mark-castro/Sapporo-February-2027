/* Sapporo 2027 — offline cache. Stale-while-revalidate for the site and its static libraries;
   live FX / Wikipedia calls are left alone (the app has its own fallbacks). */
var CACHE = "sapporo-2027-v17";
var CORE = ["./", "index.html", "styles.css", "data.js", "app.js", "extras.js", "polish.js", "music.js"];
var CROSS = ["unpkg.com", "fonts.googleapis.com", "fonts.gstatic.com", "tile.openstreetmap.org", "upload.wikimedia.org"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var same = url.origin === self.location.origin;
  var cross = CROSS.some(function (h) { return url.hostname === h || url.hostname.endsWith("." + h); });
  if (!same && !cross) return;
  if (url.pathname.endsWith("bgm.mp3")) return; // large, range requests: skip
  // Site files (HTML/JS/CSS/data): network-first so a deploy shows up on the next load; cache only as offline fallback.
  var isSite = same && (req.mode === "navigate" || /\.(html|js|css|json)$/.test(url.pathname) || url.pathname.endsWith("/"));
  if (isSite) {
    e.respondWith(fetch(req).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () { return caches.match(req, { ignoreSearch: true }); }));
    return;
  }
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(req, { ignoreSearch: false }).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && (res.ok || res.type === "opaque")) c.put(req, res.clone());
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
