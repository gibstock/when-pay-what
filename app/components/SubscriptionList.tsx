'use client';

import { Prisma } from '@prisma/client';
import { useRouter } from 'next/navigation';
type SubscriptionWithPaymentSource = Prisma.SubscriptionGetPayload<{
  include: { paymentSource: true };
}>;

interface SubscriptionListProps {
  subscriptions: SubscriptionWithPaymentSource[];
}

export default function SubscriptionList({
  subscriptions,
}: SubscriptionListProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const apiUrl = `${basePath}/api/subscriptions/${id}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error deleting subscription.');
    }
  };

  if (subscriptions.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          No subscriptions added yet. Add one above to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold border-b pb-2">
        Upcoming Payments
      </h2>
      {subscriptions.map((sub) => (
        <div
          key={sub.id}
          className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
        >
          <div>
            <p className="font-bold text-lg text-gray-700">{sub.name}</p>
            <p className="text-sm text-gray-600">
              from {sub.paymentSource.name}
            </p>
            {sub.notes && (
              <p className="mt-1 text-sm text-gray-800 bg-gray-100 p-2 rounded border border-gray-200">
                {sub.notes}
              </p>
            )}
            {sub.isRecurring && (
              <span className="mt-1 inline-block bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                {sub.recurrencePeriod?.toLowerCase()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-bold text-xl text-blue-600">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(sub.amount)}
              </p>
              <p className="text-sm text-gray-600">
                Due:{' '}
                {new Date(sub.dueDate).toLocaleDateString('en-US', {
                  timeZone: 'UTC',
                })}
              </p>
            </div>
            <button
              onClick={() => handleDelete(sub.id)}
              className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
