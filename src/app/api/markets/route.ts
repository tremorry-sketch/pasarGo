import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const markets = await prisma.market.findMany({
    where: { isActive: true },
    include: { _count: { select: { sellerShops: { where: { isActive: true } } } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(markets)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const market = await prisma.market.create({ data })
  return NextResponse.json(market, { status: 201 })
}
