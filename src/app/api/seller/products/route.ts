import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const shop = await prisma.sellerShop.findUnique({ where: { userId: session.user.id } })
  if (!shop) return NextResponse.json([])

  const products = await prisma.product.findMany({
    where: { shopId: shop.id },
    include: { category: true },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const shop = await prisma.sellerShop.findUnique({ where: { userId: session.user.id } })
  if (!shop) return NextResponse.json({ error: 'Toko tidak ditemukan' }, { status: 404 })

  const { name, categoryId, price, unit, stock, description, minOrder } = await req.json()
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const product = await prisma.product.create({
    data: { shopId: shop.id, categoryId, name, slug, price, unit: unit || 'kg', stock: stock || 0, description, minOrder: minOrder || 0.25 },
  })

  await prisma.productPriceHistory.create({ data: { productId: product.id, price } })

  return NextResponse.json(product, { status: 201 })
}
