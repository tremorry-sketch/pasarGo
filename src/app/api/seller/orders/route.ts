import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import type { OrderStatus } from '@/types'

export async function GET(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const shop = await prisma.sellerShop.findUnique({ where: { userId: session.user.id } })
  if (!shop) return NextResponse.json({ error: 'Toko tidak ditemukan' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const orders = await prisma.order.findMany({
    where: {
      shopId: shop.id,
      ...(status ? { status: status as OrderStatus } : {}),
    },
    include: {
      buyer: { select: { name: true, phone: true } },
      items: { include: { product: true } },
      delivery: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}
