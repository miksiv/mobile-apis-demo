// Push API functionality

import { checkAPISupport, disableButtonAndShowError, formatError } from '../shared/utils';

let pushSubscription: PushSubscription | null = null;

export function initPushAPI(): void {
    const pushSubscribeBtn = document.getElementById('push-subscribe-btn')!;
    const pushUnsubscribeBtn = document.getElementById('push-unsubscribe-btn')!;
    const pushTestBtn = document.getElementById('push-test-btn')!;
    const pushResult = document.getElementById('push-result')!;
    const pushStatus = document.getElementById('push-status')!;

    // Check for Push API support
    const support = checkAPISupport(
        'Push API',
        ('serviceWorker' in navigator) && ('PushManager' in window)
    );

    if (!support.supported) {
        disableButtonAndShowError(pushSubscribeBtn, pushResult, support.message!);
        disableButtonAndShowError(pushUnsubscribeBtn, pushResult, '');
        disableButtonAndShowError(pushTestBtn, pushResult, '');
        return;
    }

    // Check notification permission
    if (Notification.permission === 'denied') {
        pushResult.textContent = 'Notifications are blocked. Please enable them in your browser settings.';
        (pushSubscribeBtn as HTMLButtonElement).disabled = true;
        (pushTestBtn as HTMLButtonElement).disabled = true;
    }

    // Initialize service worker
    async function initServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/mobile-apis-demo/sw.js');
            console.log('Service Worker registered:', registration);
            pushStatus.textContent = 'Service Worker registered successfully';
            pushStatus.style.background = '#d4edda';
            pushStatus.style.color = '#155724';
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            pushStatus.textContent = `Service Worker registration failed: ${formatError(error)}`;
            pushStatus.style.background = '#f8d7da';
            pushStatus.style.color = '#721c24';
        }
    }

    // Subscribe to push notifications
    async function subscribeToPush() {
        try {
            const registration = await navigator.serviceWorker.ready;
            
            // Request notification permission
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                pushResult.textContent = 'Notification permission denied';
                return;
            }

            // Subscribe to push notifications
            const vapidKey = urlBase64ToUint8Array(
                'BEl62iUYgUivxIkv69yViEuiBIa40HI0YyQfFD2OPgZ4BESv6WA-D_Wk51ZunQlVbapQHgXtwqFQliyU7Fwld0'
            );
            pushSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidKey as any
            });

            pushResult.textContent = `Subscribed to push notifications!\nEndpoint: ${pushSubscription.endpoint.substring(0, 50)}...`;
            pushResult.style.background = '#d4edda';
            pushResult.style.color = '#155724';
            
            pushStatus.textContent = 'Successfully subscribed to push notifications';
            pushStatus.style.background = '#d4edda';
            pushStatus.style.color = '#155724';
            
            (pushSubscribeBtn as HTMLButtonElement).textContent = 'Subscribed ✅';
            (pushSubscribeBtn as HTMLButtonElement).disabled = true;
            (pushUnsubscribeBtn as HTMLButtonElement).disabled = false;
            (pushTestBtn as HTMLButtonElement).disabled = false;
        } catch (error) {
            pushResult.textContent = `Subscription failed: ${formatError(error)}`;
            pushResult.style.background = '#f8d7da';
            pushResult.style.color = '#721c24';
        }
    }

    // Unsubscribe from push notifications
    async function unsubscribeFromPush() {
        try {
            if (pushSubscription) {
                await pushSubscription.unsubscribe();
                pushSubscription = null;
                
                pushResult.textContent = 'Unsubscribed from push notifications';
                pushResult.style.background = '#fff3cd';
                pushResult.style.color = '#856404';
                
                pushStatus.textContent = 'Successfully unsubscribed from push notifications';
                pushStatus.style.background = '#fff3cd';
                pushStatus.style.color = '#856404';
                
                (pushSubscribeBtn as HTMLButtonElement).textContent = 'Subscribe to Notifications 🔔';
                (pushSubscribeBtn as HTMLButtonElement).disabled = false;
                (pushUnsubscribeBtn as HTMLButtonElement).disabled = true;
                (pushTestBtn as HTMLButtonElement).disabled = true;
            }
        } catch (error) {
            pushResult.textContent = `Unsubscription failed: ${formatError(error)}`;
            pushResult.style.background = '#f8d7da';
            pushResult.style.color = '#721c24';
        }
    }

    // Send test notification
    async function sendTestNotification() {
        try {
            if (!pushSubscription) {
                pushResult.textContent = 'Please subscribe to push notifications first';
                return;
            }

            // For demo purposes, we'll show a local notification
            // In a real app, you would send the subscription to your server
            // and the server would send the push notification
            
            const notification = new Notification('Modern Web APIs Demo', {
                body: 'This is a test notification from the Push API demo! 🚀',
                icon: '/mobile-apis-demo/icon-192x192.svg',
                badge: '/mobile-apis-demo/badge-72x72.svg',
                tag: 'demo-notification',
                requireInteraction: true
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            pushResult.textContent = 'Test notification sent! Check your notification area.';
            pushResult.style.background = '#d4edda';
            pushResult.style.color = '#155724';
            
            pushStatus.textContent = 'Test notification displayed';
            pushStatus.style.background = '#d4edda';
            pushStatus.style.color = '#155724';
        } catch (error) {
            pushResult.textContent = `Failed to send test notification: ${formatError(error)}`;
            pushResult.style.background = '#f8d7da';
            pushResult.style.color = '#721c24';
        }
    }

    // Helper function to convert VAPID key
    function urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Event listeners
    pushSubscribeBtn.addEventListener('click', subscribeToPush);
    pushUnsubscribeBtn.addEventListener('click', unsubscribeFromPush);
    pushTestBtn.addEventListener('click', sendTestNotification);

    // Initialize service worker
    initServiceWorker();

    // Check if already subscribed
    navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
            if (subscription) {
                pushSubscription = subscription;
                pushResult.textContent = 'Already subscribed to push notifications';
                pushResult.style.background = '#d4edda';
                pushResult.style.color = '#155724';
                
                (pushSubscribeBtn as HTMLButtonElement).textContent = 'Subscribed ✅';
                (pushSubscribeBtn as HTMLButtonElement).disabled = true;
                (pushUnsubscribeBtn as HTMLButtonElement).disabled = false;
                (pushTestBtn as HTMLButtonElement).disabled = false;
            }
        });
    });
}
