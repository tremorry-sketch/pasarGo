import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: { include: { shop: true, category: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return NextResponse.json(cart ?? { items: [] })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId, quantity, note } = await req.json()

  let cart = await prisma.cart.findUnique({ where: { userId: session.user.id } })
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: session.user.id } })
  }

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  })

  if (existing) {
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: existing.id } })
    } else {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity, note },
      })
    }
  } else if (quantity > 0) {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity, note } })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } })
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  }

  return NextResponse.json({ success: true })
}
