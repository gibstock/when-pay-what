'use client';

import { useState } from 'react';
import AddSubscriptionForm from './AddSubscriptionForm';
import { PaymentSource } from '@prisma/client';

interface SubscriptionManagerProps {
  paymentSources: PaymentSource[];
}

export default function SubscriptionManager({
  paymentSources,
}: SubscriptionManagerProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="mb-8">
      {isFormVisible ? (
        <AddSubscriptionForm paymentSources={paymentSources} />
      ) : (
        <div className="flex justify-center">
          <button
            onClick={() => setIsFormVisible(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Add New Subscription</span>
          </button>
        </div>
      )}
    </div>
  );
}
