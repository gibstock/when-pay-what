import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    await prisma.subscription.update({
      where: { id: id },
      data: { isPaidThisPeriod: true },
    });

    return NextResponse.json({ message: 'Subscription marked as paid' }, { status: 200 });
  } catch (error) {
    console.error('Failed to mark as paid:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}