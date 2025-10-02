// Service Worker for Push Notifications

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

// Activate event - claim all clients immediately
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(self.clients.claim());
});

// Push event - handle incoming push notifications (following the guide's approach)
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

    // If the push event has data, use it (following the guide's data handling)
    if (event.data) {
        try {
            const data = event.data.json();
            console.log('Push data received:', data);
            notificationData = { ...notificationData, ...data };
        } catch (e) {
            // If data is not JSON, treat it as text
            console.log('Push data as text:', event.data.text());
            notificationData.body = event.data.text();
        }
    }

    // Extend the event lifetime until the browser has shown the notification
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

// Log when service worker is ready
console.log('Service Worker loaded and ready!');
