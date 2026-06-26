/**
 * CryptoMsg Ultimate - Service Worker
 * نسخه 5.0
 *
 * @author 443a
 * @license MIT
 */

const CACHE_NAME = 'cryptomsg-v5.0.0-ultimate';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './assets/css/style.css',
    './assets/js/app.js',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './assets/icons/icon.svg'
];

// External resources with CORS
const EXTERNAL_ASSETS = [
    'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            // Cache local assets
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            }),
            // Try to cache external assets (don't fail if they don't load)
            caches.open(CACHE_NAME).then((cache) => {
                return Promise.allSettled(
                    EXTERNAL_ASSETS.map(url =>
                        fetch(url, { mode: 'cors' })
                            .then(response => {
                                if (response.ok) {
                                    return cache.put(url, response);
                                }
                            })
                            .catch(() => {
                                console.log('Could not cache:', url);
                            })
                    )
                );
            })
        ])
    );
    // Activate immediately
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        }).then(() => {
            // Take control of all pages immediately
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return cached response if found
            if (cachedResponse) {
                // Optionally update cache in background
                fetchAndCache(event.request);
                return cachedResponse;
            }

            // Otherwise fetch from network
            return fetchAndCache(event.request);
        }).catch(() => {
            // If both cache and network fail, return offline page
            if (event.request.destination === 'document') {
                return caches.match('./index.html');
            }
            // Return a simple error response for other resources
            return new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable'
            });
        })
    );
});

// Helper function to fetch and cache
async function fetchAndCache(request) {
    try {
        const response = await fetch(request);

        // Only cache successful responses
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            // Clone the response since it can only be read once
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        throw error;
    }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

// Background sync for future features
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        console.log('Background sync triggered');
    }
});

// Push notifications (for future features)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'پیام جدید',
            icon: './assets/icons/icon-192.png',
            badge: './assets/icons/icon-192.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.id
            }
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'CryptoMsg', options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Focus existing window if available
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open new window
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
