/*
 * Hexmeld - A hex grid puzzle game
 * Copyright (c) 2025 Jason Hamilton
 *
 * Licensed under the BSD 3-Clause License.
 * See LICENSE file for details.
 */
const CACHE_VERSION = 'v1.8.1';
const CACHE_NAME = `hexmeld-cache-${CACHE_VERSION}`;
const PRECACHE_URLS = [
  './',
  './index.html',
  './instructions.html',
  './assets/manifest.webmanifest',
  './assets/hexmeld-icon.svg',
  './assets/hexmeld-icon-180.png',
  './assets/hexmeld-icon-192.png',
  './assets/hexmeld-icon-512.png'
];

self.addEventListener('install', (event) => {
  // Force the new service worker to activate immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(
    clients.claim().then(() =>
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name.startsWith('hexmeld-cache-') && name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  const isHtmlFile = url.pathname.endsWith('.html') || url.pathname.endsWith('/');

  // Network-first strategy for HTML files to ensure updates
  if (isHtmlFile) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for assets (images, manifest, etc.)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
