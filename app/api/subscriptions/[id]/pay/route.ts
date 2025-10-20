import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const id = resolvedParams.id;
    
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