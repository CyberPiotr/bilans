const CACHE_NAME = "vitatrack-mobile-shell-v30";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./config.js",
  "./app.js",
  "./service-worker.js",
  "./db.js",
  "./manifest.json",
  "./icons/cyber-zdrowie-logo.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];
const NETWORK_FIRST_FILES = new Set(["index.html", "app.js", "config.js", "service-worker.js"]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const fileName = requestUrl.pathname.split("/").pop() || "index.html";
  if (requestUrl.origin === self.location.origin && NETWORK_FIRST_FILES.has(fileName)) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === "opaque") {
            return networkResponse;
          }
          const responseCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
          return networkResponse;
        })
        .catch(() => caches.match("./index.html"));
    }),
  );
});
