import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import type { OrderStatus } from '@/types'

const SELLER_ALLOWED_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus>> = {
  PLACED: 'SELLER_REVIEW',
  SELLER_REVIEW: 'SELLER_CONFIRMED',
  SELLER_CONFIRMED: 'PACKING',
  PACKING: 'READY_FOR_PICKUP',
  READY_FOR_PICKUP: 'FINDING_COURIER',
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const shop = await prisma.sellerShop.findUnique({ where: { userId: session.user.id } })
  if (!shop) return NextResponse.json({ error: 'Toko tidak ditemukan' }, { status: 404 })

  const order = await prisma.order.findFirst({
    where: { id, shopId: shop.id },
    include: {
      buyer: { select: { name: true, phone: true, address: true } },
      items: { include: { product: true } },
      delivery: true,
      statusLogs: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const shop = await prisma.sellerShop.findUnique({ where: { userId: session.user.id } })
  if (!shop) return NextResponse.json({ error: 'Toko tidak ditemukan' }, { status: 404 })

  const order = await prisma.order.findFirst({ where: { id, shopId: shop.id } })
  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })

  const body = await req.json()
  const { action, cancelReason, itemUpdates } = body

  if (action === 'CANCEL') {
    await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED', cancelReason },
    })
    await prisma.orderStatusLog.create({
      data: { orderId: id, status: 'CANCELLED', note: cancelReason, createdBy: session.user.id },
    })
    await prisma.notification.create({
      data: {
        userId: order.buyerId,
        title: 'Pesanan Dibatalkan',
        body: `Pesanan #${order.orderNumber} dibatalkan oleh penjual.`,
        type: 'ORDER_CANCELLED',
        data: { orderId: id },
      },
    })
    return NextResponse.json({ success: true })
  }

  const nextStatus = SELLER_ALLOWED_TRANSITIONS[order.status as OrderStatus]
  if (!nextStatus) {
    return NextResponse.json({ error: 'Transisi status tidak valid' }, { status: 400 })
  }

  // Update item quantities/prices if seller confirms final details
  if (itemUpdates && Array.isArray(itemUpdates)) {
    for (const upd of itemUpdates) {
      await prisma.orderItem.update({
        where: { id: upd.id },
        data: { finalPrice: upd.finalPrice, finalQuantity: upd.finalQuantity, isCancelled: upd.isCancelled ?? false },
      })
    }
  }

  await prisma.order.update({ where: { id }, data: { status: nextStatus } })
  await prisma.orderStatusLog.create({
    data: { orderId: id, status: nextStatus, createdBy: session.user.id },
  })

  // Notify buyer when ready for pickup / finding courier
  if (nextStatus === 'FINDING_COURIER') {
    await prisma.notification.create({
      data: {
        userId: order.buyerId,
        title: 'Pesanan Siap Dikirim',
        body: `Pesanan #${order.orderNumber} sedang mencari kurir.`,
        type: 'ORDER_UPDATE',
        data: { orderId: id },
      },
    })
  }

  return NextResponse.json({ status: nextStatus })
}
