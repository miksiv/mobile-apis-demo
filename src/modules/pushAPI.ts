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
    console.log('Initial notification permission:', Notification.permission);
    if (Notification.permission === 'denied') {
        pushResult.textContent = 'Notifications are blocked. Please enable them in your browser settings.';
        (pushSubscribeBtn as HTMLButtonElement).disabled = true;
        (pushTestBtn as HTMLButtonElement).disabled = true;
    } else if (Notification.permission === 'granted') {
        pushResult.textContent = 'Notifications are already enabled. You can subscribe to push notifications.';
        pushResult.style.background = '#d4edda';
        pushResult.style.color = '#155724';
    } else {
        pushResult.textContent = 'Click "Subscribe to Notifications" to request permission and enable push notifications.';
        pushResult.style.background = '#fff3cd';
        pushResult.style.color = '#856404';
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

    // Request permission from the user (following the guide's best practices)
    async function askPermission() {
        return new Promise((resolve, reject) => {
            const permissionResult = Notification.requestPermission((result) => {
                resolve(result);
            });
            if (permissionResult) {
                permissionResult.then(resolve, reject);
            }
        }).then((permissionResult) => {
            if (permissionResult !== 'granted') {
                throw new Error('Permission denied');
            }
            return permissionResult;
        });
    }

    // Subscribe to push notifications
    async function subscribeToPush() {
        try {
            console.log('Starting push subscription process...');
            console.log(navigator.serviceWorker)
            const registration = await navigator.serviceWorker.ready;
            console.log('Service worker ready:', registration);
            
            // Request notification permission using the guide's method
            console.log('Requesting notification permission...');
            const permission = await askPermission();
            console.log('Permission result:', permission);

            // Subscribe to push notifications
            console.log('Creating VAPID key...');
            const vapidKey = urlBase64ToUint8Array(
                'BEl62iUYgUivxIkv69yViEuiBIa40HI0YyQfFD2OPgZ4BESv6WA-D_Wk51ZunQlVbapQHgXtwqFQliyU7Fwld0'
            );
            console.log('VAPID key created, subscribing to push manager...');
            
            pushSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidKey as any
            });
            
            console.log('Push subscription successful:', pushSubscription);

            // Simulate sending subscription to server (as per the guide)
            await sendSubscriptionToServer(pushSubscription);

            pushResult.textContent = `Subscribed to push notifications!\nEndpoint: ${pushSubscription.endpoint.substring(0, 50)}...\n\nSubscription sent to server successfully!`;
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
            console.error('Push subscription error:', error);
            if ((error as Error).message === 'Permission denied') {
                pushResult.textContent = 'Notification permission denied. Please allow notifications in your browser settings.';
            } else {
                pushResult.textContent = `Subscription failed: ${formatError(error)}`;
            }
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

    // Send test notification (demonstrating both local and push notification concepts)
    async function sendTestNotification() {
        try {
            if (!pushSubscription) {
                pushResult.textContent = 'Please subscribe to push notifications first';
                return;
            }

            // Show a local notification to demonstrate the notification API
            const notification = new Notification('Modern Web APIs Demo', {
                body: 'This is a test notification from the Push API demo! 🚀\n\nIn a real app, this would be sent from your server using the push subscription.',
                icon: '/mobile-apis-demo/icon-192x192.svg',
                badge: '/mobile-apis-demo/badge-72x72.svg',
                tag: 'demo-notification',
                requireInteraction: true
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            // Also simulate what would happen if we sent a push from the server
            console.log('Simulating server push notification...');
            console.log('Subscription endpoint:', pushSubscription.endpoint);
            console.log('In a real app, your server would send a push to this endpoint');

            pushResult.textContent = 'Test notification sent! Check your notification area.\n\nThis demonstrates the Notification API. In a real app, your server would send push notifications to the subscription endpoint.';
            pushResult.style.background = '#d4edda';
            pushResult.style.color = '#155724';
            
            pushStatus.textContent = 'Test notification displayed - this shows how notifications work!';
            pushStatus.style.background = '#d4edda';
            pushStatus.style.color = '#155724';
        } catch (error) {
            pushResult.textContent = `Failed to send test notification: ${formatError(error)}`;
            pushResult.style.background = '#f8d7da';
            pushResult.style.color = '#721c24';
        }
    }

    // Send subscription to server (following the guide's approach)
    async function sendSubscriptionToServer(subscription: PushSubscription) {
        console.log('Sending subscription to server...');
        
        // In a real app, you would send this to your server
        // For demo purposes, we'll simulate this process
        const p256dhKey = subscription.getKey('p256dh');
        const authKey = subscription.getKey('auth');
        
        const subscriptionData = {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: p256dhKey ? btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(p256dhKey)))) : null,
                auth: authKey ? btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(authKey)))) : null
            }
        };

        console.log('Subscription data to send to server:', subscriptionData);
        
        // Simulate server response
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Server response: Subscription saved successfully');
                resolve(true);
            }, 1000);
        });
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
