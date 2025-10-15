import { prisma } from '../lib/prisma';
import AddSubscriptionForm from './components/AddSubscriptionForm';
import { PaymentSource } from '@prisma/client';
import SubscriptionList from './components/SubscriptionList';

export default async function Home() {
  const paymentSources: PaymentSource[] = await prisma.paymentSource.findMany();

  const subscriptions = await prisma.subscription.findMany({
    orderBy: {
      dueDate: 'asc',
    },
    include: {
      paymentSource: true,
    },
  });

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">When Pay What</h1>
      <AddSubscriptionForm paymentSources={paymentSources} />
      <SubscriptionList subscriptions={subscriptions} />
    </main>
  );
}
