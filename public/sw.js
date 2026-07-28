// EduNomad service worker — app-shell precache + network-first navigations.
// Deeper offline behaviour (SOP, draft sync) is layered on in G016.
//
// v2: navigation caching is restricted to PUBLIC pages. v1 cached every
// navigation except /admin and /api, which meant signed-in HTML for /app,
// /parent and the staff consoles (student names, offers, visa status) was
// written to the shared origin cache and replayed on any network failure — to
// whoever was using the device next. Bumping the cache name also purges any v1
// entries that already contain personal data, via the activate handler below.
const CACHE = "edunomad-shell-v2";
const SHELL = ["/", "/privacy", "/terms", "/manifest.webmanifest", "/icon.svg"];

// Only these may be cached for offline navigation. Everything else is per-user.
const PUBLIC_NAVIGATION =
  /^\/(?:$|guides(?:\/|$)|(?:bn|hi|ne)\/guides(?:\/|$)|programmes\/|privacy$|terms$|editorial-standards$)/;

function isPublicNavigation(pathname) {
  return pathname === "/" || PUBLIC_NAVIGATION.test(pathname);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Never cache admin or API responses.
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api")) return;

  // /sop is staff-only. v1 cached it stale-while-revalidate, so the cached copy
  // was served before any auth check — internal procedure content readable by
  // whoever used the device next, even signed out. Offline SOP access needs to be
  // rebuilt against an auth-aware store; until then it is network-only.

  if (request.mode === "navigate") {
    // Per-user pages are never cached and never served from cache: a stale
    // authenticated page could otherwise be shown to a different user.
    if (!isPublicNavigation(url.pathname)) return;

    event.respondWith(
      fetch(request)
        .then((res) => {
          // Only store successful, non-redirected responses.
          if (res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(request).then((m) => m || caches.match("/"))),
    );
  }
});

// G012 — Web Push: show the notification and focus the app on click.
self.addEventListener("push", (event) => {
  let data = { title: "EduNomad", body: "" };
  try {
    data = event.data ? event.data.json() : data;
  } catch {
    if (event.data) data.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "EduNomad", {
      body: data.body || "",
      icon: "/icon.svg",
      badge: "/icon.svg",
      data: { url: data.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const c of clients) {
        if (c.url.includes(url) && "focus" in c) return c.focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});
