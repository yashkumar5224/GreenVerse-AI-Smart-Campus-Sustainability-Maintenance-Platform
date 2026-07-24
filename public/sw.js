// GreenVerse PWA Service Worker
const CACHE_NAME = 'greenverse-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icons.svg'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Handle SPA Client Navigation Fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Skip non-GET requests or external API calls (Supabase, Unsplash)
  if (request.method !== 'GET' || request.url.includes('supabase.co') || request.url.includes('unsplash.com')) {
    return;
  }

  // Handle SPA HTML Navigation
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html') || fetch('/index.html');
      })
    );
    return;
  }

  // Handle Static Asset Requests with Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {/* ignore background fetch errors */});
        return cachedResponse;
      }
      return fetch(request);
    }).catch(() => {
      if (request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
