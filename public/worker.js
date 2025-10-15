self.addEventListener('push', (event) => {
  const data = event.data.json();

  const title = data.title || 'when-pay-what';
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});