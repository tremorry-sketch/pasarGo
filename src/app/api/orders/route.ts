import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { generateOrderNumber } from '@/lib/utils'

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const orders = await prisma.order.findMany({
    where: {
      buyerId: session.user.id,
      ...(status ? { status: status as any } : {}),
    },
    include: {
      shop: { include: { market: true } },
      items: true,
      delivery: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { shopId, deliveryAddress, deliveryNote, buyerNote, ifStockEmpty, paymentMethod } = await req.json()

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: { include: { product: true } },
    },
  })

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 })
  }

  const shopItems = cart.items.filter((i) => i.product.shopId === shopId)
  if (shopItems.length === 0) {
    return NextResponse.json({ error: 'Tidak ada produk dari toko ini' }, { status: 400 })
  }

  const subtotal = shopItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0)
  const deliveryFee = 15000
  const platformFee = 0
  const total = subtotal + deliveryFee + platformFee

  const shop = await prisma.sellerShop.findUnique({ where: { id: shopId } })

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      buyerId: session.user.id,
      shopId,
      subtotal,
      deliveryFee,
      platformFee,
      total,
      deliveryAddress,
      deliveryNote,
      buyerNote,
      ifStockEmpty: ifStockEmpty || 'CONTACT',
      paymentMethod: paymentMethod || 'COD',
      status: 'PLACED',
      items: {
        create: shopItems.map((i) => ({
          productId: i.productId,
          productName: i.product.name,
          productUnit: i.product.unit,
          quantity: i.quantity,
          priceAtOrder: i.product.price,
          note: i.note,
        })),
      },
      statusLogs: {
        create: {
          status: 'PLACED',
          note: 'Pesanan dibuat oleh pembeli',
          createdBy: session.user.id,
        },
      },
    },
  })

  // Clear cart items from this shop
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId: { in: shopItems.map((i) => i.productId) } },
  })

  // Create delivery record
  await prisma.delivery.create({
    data: {
      orderId: order.id,
      pickupAddress: shop?.name + ' - ' + (shop?.marketId || ''),
      dropAddress: deliveryAddress,
    },
  })

  // Create payment record
  await prisma.payment.create({
    data: {
      orderId: order.id,
      method: paymentMethod || 'COD',
      amount: total,
    },
  })

  // Notify seller
  await prisma.notification.create({
    data: {
      userId: shop!.userId,
      title: 'Pesanan Baru!',
      body: `Pesanan #${order.orderNumber} masuk. Segera konfirmasi.`,
      type: 'NEW_ORDER',
      data: { orderId: order.id },
    },
  })

  return NextResponse.json(order, { status: 201 })
}
