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
    console.log('[Push Manager] useEffect running.');

    const setupPushNotifications = async () => {
      console.log('[Push Manager] setupPushNotifications() called.');

      if (!('serviceWorker' in navigator && 'PushManager' in window)) {
        console.warn(
          '[Push Manager] Browser does NOT support Service Workers or Push.'
        );
        return;
      }

      console.log('[Push Manager] Browser supports Service Workers and Push.');

      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const workerPath = `${basePath}/worker.js`;
        console.log(`[Push Manager] Registering worker at: ${workerPath}`);

        const registration = await navigator.serviceWorker.register(
          workerPath,
          {
            scope: basePath || '/', // Explicitly set the scope
          }
        );

        await navigator.serviceWorker.ready;
        console.log('[Push Manager] Service Worker is active.');

        let subscription = await registration.pushManager.getSubscription();
        console.log('[Push Manager] Existing subscription:', subscription);

        if (!subscription) {
          console.log(
            '[Push Manager] No subscription found. Attempting to subscribe...'
          );

          const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          if (!VAPID_PUBLIC_KEY) {
            console.error('[Push Manager] VAPID public key not found.');
            return;
          }
          console.log('[Push Manager] VAPID key found.');

          const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey,
          });

          console.log(
            '[Push Manager] New subscription successful:',
            subscription
          );

          const apiUrl = `${basePath}/api/push/subscribe`;
          await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: { 'Content-Type': 'application/json' },
          });
          console.log('[Push Manager] Sent subscription to backend.');
        } else {
          console.log('[Push Manager] User is already subscribed.');
        }
      } catch (error) {
        console.error('[Push Manager] An error occurred:', error);
      }
    };

    setupPushNotifications();
  }, []);

  return null;
}
