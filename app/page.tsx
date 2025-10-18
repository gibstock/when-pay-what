import { prisma } from '../lib/prisma';
import AddSubscriptionForm from './components/AddSubscriptionForm';
import { PaymentSource } from '@prisma/client';
import SubscriptionView from './components/SubscriptionView';
import { startOfMonth, endOfMonth } from 'date-fns';

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

  const calendarSubscriptions = await prisma.subscription.findMany({
    include: {
      paymentSource: true,
    },
  });

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-6">when-pay-what</h1>

      <AddSubscriptionForm paymentSources={paymentSources} />
      <SubscriptionView
        listSubscriptions={listSubscriptions}
        calendarSubscriptions={calendarSubscriptions}
      />
    </main>
  );
}
