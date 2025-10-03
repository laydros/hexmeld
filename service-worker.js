/*
 * Hexmeld - A hex grid puzzle game
 * Copyright (C) 2025 Jason Hamilton and contributors
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
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
