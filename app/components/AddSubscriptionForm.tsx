'use client';

import { useState } from 'react';
import { PaymentSource } from '@prisma/client';
import { useRouter } from 'next/navigation';

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
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePeriod, setRecurrencePeriod] = useState('MONTHLY');

  const [isTrial, setIsTrial] = useState(false);
  const [trialType, setTrialType] = useState('FREE');
  const [trialAmount, setTrialAmount] = useState('');
  const [trialEndDate, setTrialEndDate] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const apiUrl = `${basePath}/api/subscriptions`;

    const body = {
      name,
      amount: parseFloat(amount),
      dueDate: new Date(dueDate),
      paymentSourceId,
      isRecurring,
      recurrencePeriod: isRecurring ? recurrencePeriod : null,
      isTrial,
      trialType: isTrial ? trialType : null,
      trialAmount: isTrial && trialAmount ? parseFloat(trialAmount) : null,
      trialEndDate: isTrial && trialEndDate ? new Date(trialEndDate) : null,
      notes,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }
      router.refresh();
      setName('');
      setAmount('');
      setDueDate('');
      setNotes('');
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

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isTrial}
            onChange={(e) => setIsTrial(e.target.checked)}
          />
          <span>Is this a Trial?</span>
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
        {isTrial && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trial Type
                </label>
                <select
                  value={trialType}
                  onChange={(e) => setTrialType(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                >
                  <option value="FREE">Free Trial</option>
                  <option value="INTRO_OFFER">Introductory Offer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trial End Date
                </label>
                <input
                  type="date"
                  value={trialEndDate}
                  onChange={(e) => setTrialEndDate(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
            </div>
            {trialType === 'INTRO_OFFER' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Introductory Price
                </label>
                <input
                  type="number"
                  placeholder="e.g., 4.99"
                  value={trialAmount}
                  onChange={(e) => setTrialAmount(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The &quot;Amount&quot; field above should be the full price
                  after the trial ends.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-4">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm text-gray-700"
          placeholder="e.g., Confirmation #12345, cancel on website..."
        />
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
