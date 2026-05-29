import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const shop = await prisma.sellerShop.findUnique({ where: { userId: session.user.id } })
  if (!shop) return NextResponse.json({ error: 'Toko tidak ditemukan' }, { status: 404 })

  const product = await prisma.product.findFirst({ where: { id, shopId: shop.id } })
  if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 })

  const body = await req.json()
  const { price, stock, isActive, name, description, unit } = body

  if (price && price !== product.price) {
    await prisma.productPriceHistory.create({ data: { productId: id, price } })
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...(price !== undefined ? { price } : {}),
      ...(stock !== undefined ? { stock } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(name ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(unit ? { unit } : {}),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const shop = await prisma.sellerShop.findUnique({ where: { userId: session.user.id } })

  await prisma.product.update({
    where: { id, shopId: shop?.id },
    data: { isActive: false },
  })

  return NextResponse.json({ success: true })
}
