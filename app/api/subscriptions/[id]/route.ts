import { NextResponse } from 'next/server';
import {prisma} from '../../../../lib/prisma'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await prisma.subscription.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ message: 'Subscription deleted' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete subscription:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}