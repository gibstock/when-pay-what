import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys.p256dh || !keys.auth) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint: endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      create: {
        endpoint: endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    });

    return NextResponse.json({ message: 'Subscribed' }, { status: 201 });
  } catch (error) {
    console.error('Failed to save subscription:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}