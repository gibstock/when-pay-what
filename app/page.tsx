import { prisma } from '../lib/prisma';
import { PaymentSource } from '@prisma/client';
import SubscriptionView from './components/SubscriptionView';
import { startOfMonth, endOfMonth } from 'date-fns';
import SubscriptionManager from './components/SubscriptionManager';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const paymentSources: PaymentSource[] = await prisma.paymentSource.findMany();

  const today = new Date();
  const startDate = startOfMonth(today);
  const endDate = endOfMonth(today);

  const listSubscriptions = await prisma.subscription.findMany({
    where: {
      dueDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      dueDate: 'asc',
    },
    include: {
      paymentSource: true,
    },
  });

  console.log('list subs: ', listSubscriptions);

  const calendarSubscriptions = await prisma.subscription.findMany({
    include: {
      paymentSource: true,
    },
  });

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">When Pay What</h1>

      <SubscriptionManager paymentSources={paymentSources} />
      <SubscriptionView
        listSubscriptions={listSubscriptions}
        calendarSubscriptions={calendarSubscriptions}
      />
    </main>
  );
}
