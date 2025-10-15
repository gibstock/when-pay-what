import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RecurrencePeriod } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, amount, dueDate, paymentSourceId, isRecurring, recurrencePeriod } = body;

    if (!name || !amount || !dueDate || !paymentSourceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newSubscription = await prisma.subscription.create({
      data: {
        name: name,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        paymentSourceId: paymentSourceId,
        isRecurring: isRecurring,
        recurrencePeriod: recurrencePeriod as RecurrencePeriod,
      },
    });

    return NextResponse.json(newSubscription, { status: 201 });
  } catch (error) {
    console.error('Failed to create subscription:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}