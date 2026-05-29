import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import type { OrderStatus } from '@/types'

export async function GET(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const orders = await prisma.order.findMany({
    where: status ? { status: status as OrderStatus } : {},
    include: {
      buyer: { select: { name: true, phone: true } },
      shop: { include: { market: true } },
      delivery: { include: { courier: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(orders)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { orderId, status, note } = await req.json()

  await prisma.order.update({ where: { id: orderId }, data: { status } })
  await prisma.orderStatusLog.create({
    data: { orderId, status, note: note || 'Diubah oleh admin', createdBy: session.user.id },
  })

  return NextResponse.json({ success: true })
}
