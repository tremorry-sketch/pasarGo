import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'COURIER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const mine = searchParams.get('mine') === '1'

  const jobs = await prisma.delivery.findMany({
    where: mine
      ? { courierId: session.user.id }
      : { status: 'AVAILABLE', courierId: null },
    include: {
      order: {
        include: {
          buyer: { select: { name: true, phone: true } },
          shop: { include: { market: true } },
          items: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(jobs)
}
