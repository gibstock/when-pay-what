'use client';

import { useState } from 'react';
import { Prisma } from '@prisma/client';
import SubscriptionList from './SubscriptionList';
import CalendarView from './CalendarView';

type SubscriptionWithPaymentSource = Prisma.SubscriptionGetPayload<{
  include: { paymentSource: true };
}>;

interface SubscriptionViewProps {
  listSubscriptions: SubscriptionWithPaymentSource[];
  calendarSubscriptions: SubscriptionWithPaymentSource[];
}

type View = 'list' | 'calendar';

export default function SubscriptionView({
  listSubscriptions,
  calendarSubscriptions,
}: SubscriptionViewProps) {
  const [view, setView] = useState<View>('list');

  const getTabClass = (tabName: View) => {
    return view === tabName
      ? 'border-blue-500 text-blue-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  };

  return (
    <section>
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setView('list')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass(
              'list'
            )}`}
          >
            Upcoming Payments (This Month)
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass(
              'calendar'
            )}`}
          >
            Calendar View
          </button>
        </nav>
      </div>

      {view === 'list' && (
        <SubscriptionList subscriptions={listSubscriptions} />
      )}
      {view === 'calendar' && (
        <CalendarView subscriptions={calendarSubscriptions} />
      )}
    </section>
  );
}
