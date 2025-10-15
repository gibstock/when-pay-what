'use client';

import { useState } from 'react';
import { PaymentSource } from '@prisma/client';

interface AddSubscriptionFormProps {
  paymentSources: PaymentSource[];
}

export default function AddSubscriptionForm({
  paymentSources,
}: AddSubscriptionFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentSourceId, setPaymentSourceId] = useState(
    paymentSources[0]?.id || ''
  );
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePeriod, setRecurrencePeriod] = useState('MONTHLY');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          amount: parseFloat(amount),
          dueDate: new Date(dueDate),
          paymentSourceId,
          isRecurring,
          recurrencePeriod: isRecurring ? recurrencePeriod : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      setName('');
      setAmount('');
      setDueDate('');
      alert('Subscription added successfully!');
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-100 rounded-lg shadow-md mb-8"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Add New Subscription
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <input
          type="text"
          placeholder="Service Name (e.g., Netflix)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <select
          value={paymentSourceId}
          onChange={(e) => setPaymentSourceId(e.target.value)}
          className="p-2 border rounded"
          required
        >
          {paymentSources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 flex items-center space-x-4 text-gray-700">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="h-5 w-5"
          />
          <span>Recurring?</span>
        </label>

        {isRecurring && (
          <select
            value={recurrencePeriod}
            onChange={(e) => setRecurrencePeriod(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        )}
      </div>
      <button
        type="submit"
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Subscription
      </button>
    </form>
  );
}
