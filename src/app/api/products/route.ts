import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const shopId = searchParams.get('shopId')
  const categoryId = searchParams.get('categoryId')
  const marketId = searchParams.get('marketId')
  const search = searchParams.get('q')

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(shopId ? { shopId } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(marketId ? { shop: { marketId } } : {}),
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    },
    include: {
      shop: { include: { market: true } },
      category: true,
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(products)
}
