// Haven — minimal service worker.
// v1 strategy:
//   • Static assets (CSS, JS, fonts, images): cache-first, fall back to network.
//   • HTML navigations: network-first, fall back to last cached navigation,
//     then to the cached home as a final "we are offline" anchor.
//   • Same-origin only — never touch the marketing site or third-party.

const CACHE_NAME = "haven-v1";
const SHELL_URLS = ["/", "/manifest.webmanifest", "/favicon.svg", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Skip Next.js internals — they self-cache and we don't want to wedge HMR
  // by serving stale chunks. (Dev only; in prod we cache them like assets.)
  if (url.pathname.startsWith("/_next/static")) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (url.pathname.startsWith("/_next/")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, res.clone());
    }
    return res;
  } catch (err) {
    return Response.error();
  }
}

async function networkFirst(request) {
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, res.clone());
    }
    return res;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Last resort — the cached home is the offline anchor.
    const home = await caches.match("/");
    if (home) return home;
    return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
  }
}
