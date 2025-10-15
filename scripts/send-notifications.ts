import { prisma } from '../lib/prisma';
import webpush from 'web-push';
import { add, sub } from 'date-fns';

function getNextDueDate(currentDueDate: Date, period: 'WEEKLY' | 'MONTHLY' | 'YEARLY'): Date {
  switch (period) {
    case 'WEEKLY':
      return add(currentDueDate, { weeks: 1 });
    case 'MONTHLY':
      return add(currentDueDate, { months: 1 });
    case 'YEARLY':
      return add(currentDueDate, { years: 1 });
    default:
      return currentDueDate;
  }
}

async function main() {
  console.log('Starting notification check...');

  if (!process.env.VAPID_PRIVATE_KEY || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_MAILTO) {
    console.error('VAPID keys are not configured in .env file.');
    return;
  }
  webpush.setVapidDetails(
    process.env.VAPID_MAILTO,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const dueSubscriptions = await prisma.subscription.findMany({
    where: {
      dueDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (dueSubscriptions.length === 0) {
    console.log('No subscriptions due today.');
    return;
  }

  const pushEndpoints = await prisma.pushSubscription.findMany();
  
  if (pushEndpoints.length === 0) {
    console.log('No users are subscribed for notifications.');
    return;
  }

  console.log(`Found ${dueSubscriptions.length} due subscription(s) and ${pushEndpoints.length} subscribed device(s).`);

  for (const sub of dueSubscriptions) {
    const notificationPayload = JSON.stringify({
      title: 'Payment Due Today!',
      body: `${sub.name} is due for $${sub.amount.toFixed(2)}.`,
    });

    for (const endpoint of pushEndpoints) {
      const pushSubscription = {
        endpoint: endpoint.endpoint,
        keys: { p256dh: endpoint.p256dh, auth: endpoint.auth },
      };
      
      try {
        await webpush.sendNotification(pushSubscription, notificationPayload);
        console.log(`Notification sent for ${sub.name} to ${endpoint.endpoint.slice(0, 50)}...`);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
    
    if (sub.isRecurring && sub.recurrencePeriod) {
        const nextDueDate = getNextDueDate(sub.dueDate, sub.recurrencePeriod);
        await prisma.subscription.update({
            where: { id: sub.id },
            data: { dueDate: nextDueDate },
        });
        console.log(`Updated next due date for ${sub.name} to ${nextDueDate.toLocaleDateString()}`);
    }
  }

  console.log('Notification check finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });