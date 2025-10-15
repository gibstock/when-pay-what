'use client';

import { useEffect } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushSubscriptionManager() {
  useEffect(() => {
    const setupPushNotifications = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.register(
          '/worker.js'
        );

        await navigator.serviceWorker.ready;

        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          if (!VAPID_PUBLIC_KEY) {
            console.error('VAPID public key not found.');
            return;
          }

          try {
            const applicationServerKey =
              urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: applicationServerKey,
            });

            await fetch('/api/push/subscribe', {
              method: 'POST',
              body: JSON.stringify(subscription),
              headers: { 'Content-Type': 'application/json' },
            });
          } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
          }
        }
      }
    };
    setupPushNotifications();
  }, []);

  return null;
}
