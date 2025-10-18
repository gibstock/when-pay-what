'use client'; // This must be a Client Component

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Prisma } from '@prisma/client';

// This is the same type we used in SubscriptionList
type SubscriptionWithPaymentSource = Prisma.SubscriptionGetPayload<{
  include: { paymentSource: true };
}>;

interface CalendarViewProps {
  subscriptions: SubscriptionWithPaymentSource[];
}

export default function CalendarView({ subscriptions }: CalendarViewProps) {
  // 1. Format your subscriptions into "events" for FullCalendar
  const events = subscriptions.map((sub) => ({
    id: sub.id,
    title: `${sub.name} ($${sub.amount.toFixed(2)})`,
    date: sub.dueDate, // FullCalendar can read ISO date strings
    // We can even color-code recurring events
    backgroundColor: sub.isRecurring ? '#1e40af' : '#1d4ed8',
    borderColor: sub.isRecurring ? '#1e40af' : '#1d4ed8',
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* FullCalendar needs a bit of CSS help to look right. 
        We add this <style> tag to import its core styles.
      */}
      <style>
        {`
          .fc {
            background-color: white;
            color: black;
          }
          .fc-daygrid-day-number {
            color: #374151;
          }
          .fc-col-header-cell-cushion {
            color: #1f2937;
            font-weight: 600;
          }
          .fc-event {
            font-size: 0.8rem;
          }
        `}
      </style>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto" // Makes it responsive
      />
    </div>
  );
}
