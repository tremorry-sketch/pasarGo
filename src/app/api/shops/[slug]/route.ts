import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const shop = await prisma.sellerShop.findUnique({
    where: { slug, isActive: true },
    include: { market: true, user: { select: { name: true, phone: true } } },
  })

  if (!shop) return NextResponse.json({ error: 'Toko tidak ditemukan' }, { status: 404 })
  return NextResponse.json(shop)
}
