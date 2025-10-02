// Service Worker for Push Notifications
const CACHE_NAME = 'push-demo-v1';
const urlsToCache = [
    '/',
    '/src/main.ts',
    '/src/style.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
    console.log('Push event received:', event);
    
    let notificationData = {
        title: 'Modern Web APIs Demo',
        body: 'Hello! This is a test push notification from the demo.',
        icon: '/mobile-apis-demo/icon-192x192.svg',
        badge: '/mobile-apis-demo/badge-72x72.svg',
        tag: 'demo-notification',
        requireInteraction: true,
        actions: [
            {
                action: 'open',
                title: 'Open Demo',
                icon: '/mobile-apis-demo/icon-192x192.svg'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/mobile-apis-demo/icon-192x192.svg'
            }
        ]
    };

    // If the push event has data, use it
    if (event.data) {
        try {
            const data = event.data.json();
            notificationData = { ...notificationData, ...data };
        } catch (e) {
            // If data is not JSON, treat it as text
            notificationData.body = event.data.text();
        }
    }

    const promiseChain = self.registration.showNotification(
        notificationData.title,
        notificationData
    );

    event.waitUntil(promiseChain);
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('Notification click received:', event);
    
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        // Open the demo page
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then((clientList) => {
                // Check if there's already a window/tab open with the target URL
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin + '/mobile-apis-demo') && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If no existing window, open a new one
                if (clients.openWindow) {
                    return clients.openWindow(self.location.origin + '/mobile-apis-demo');
                }
            })
        );
    } else if (event.action === 'close') {
        // Just close the notification (already done above)
        console.log('Notification closed by user');
    }
});

// Background sync (optional - for offline functionality)
self.addEventListener('sync', (event) => {
    console.log('Background sync event:', event);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Perform background sync tasks here
            Promise.resolve()
        );
    }
});

// Message event - handle messages from the main thread
self.addEventListener('message', (event) => {
    console.log('Service worker received message:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
