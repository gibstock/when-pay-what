'use client'; // This must be a Client Component

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Prisma } from '@prisma/client';
import { add } from 'date-fns';
import DayDetailsModal from './DayDetailsModal';
import { useState } from 'react';

type SubscriptionWithPaymentSource = Prisma.SubscriptionGetPayload<{
  include: { paymentSource: true };
}>;

interface CalendarViewProps {
  subscriptions: SubscriptionWithPaymentSource[];
}

export default function CalendarView({ subscriptions }: CalendarViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<
    { id: string; title: string }[]
  >([]);

  const events = subscriptions.flatMap((sub) => {
    const originalEvent = {
      id: sub.id,
      title: `${sub.name} ($${sub.amount.toFixed(2)})`,
      date: sub.dueDate,
      backgroundColor: sub.isRecurring ? '#1e40af' : '#1d4ed8',
      borderColor: sub.isRecurring ? '#1e40af' : '#1d4ed8',
    };

    if (!sub.isRecurring || !sub.recurrencePeriod) {
      return [originalEvent];
    }

    // If recurring, generate events for the next year
    const futureEvents = [originalEvent];
    let lastDate = new Date(sub.dueDate);
    for (let i = 0; i < 12; i++) {
      let nextDate;
      if (sub.recurrencePeriod === 'MONTHLY') {
        nextDate = add(lastDate, { months: 1 });
      } else if (sub.recurrencePeriod === 'WEEKLY') {
        nextDate = add(lastDate, { weeks: 1 });
      } else {
        // YEARLY
        nextDate = add(lastDate, { years: 1 });
      }

      futureEvents.push({ ...originalEvent, date: nextDate });
      lastDate = nextDate;
    }
    return futureEvents;
  });

  const handleDateClick = (arg: { date: Date; allDay: boolean }) => {
    const eventsForDay = events.filter(
      (event) => new Date(event.date).toDateString() === arg.date.toDateString()
    );
    setSelectedDate(arg.date);
    setSelectedEvents(eventsForDay);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
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
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        dateClick={handleDateClick}
      />
      <DayDetailsModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        events={selectedEvents}
        selectedDate={selectedDate}
      />
    </div>
  );
}
