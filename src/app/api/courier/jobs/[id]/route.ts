import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import type { DeliveryStatus, OrderStatus } from '@/types'

const DELIVERY_ORDER_MAP: Partial<Record<DeliveryStatus, OrderStatus>> = {
  ACCEPTED: 'COURIER_ASSIGNED',
  HEADING_TO_SELLER: 'COURIER_ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  ON_DELIVERY: 'ON_DELIVERY',
  DELIVERED: 'DELIVERED',
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'COURIER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { action } = await req.json()

  const delivery = await prisma.delivery.findUnique({
    where: { id },
    include: { order: true },
  })

  if (!delivery) return NextResponse.json({ error: 'Job tidak ditemukan' }, { status: 404 })

  if (action === 'ACCEPT') {
    if (delivery.courierId) return NextResponse.json({ error: 'Job sudah diambil' }, { status: 400 })

    await prisma.delivery.update({
      where: { id },
      data: { courierId: session.user.id, status: 'ACCEPTED', acceptedAt: new Date() },
    })
    await prisma.order.update({ where: { id: delivery.orderId }, data: { status: 'COURIER_ASSIGNED' } })
    await prisma.orderStatusLog.create({
      data: { orderId: delivery.orderId, status: 'COURIER_ASSIGNED', createdBy: session.user.id },
    })

    // Notify buyer
    await prisma.notification.create({
      data: {
        userId: delivery.order.buyerId,
        title: 'Kurir Ditemukan',
        body: `Kurir sedang menuju penjual untuk mengambil pesanan kamu.`,
        type: 'ORDER_UPDATE',
        data: { orderId: delivery.orderId },
      },
    })
    return NextResponse.json({ success: true })
  }

  const STATUS_FLOW: Partial<Record<string, DeliveryStatus>> = {
    ACCEPTED: 'HEADING_TO_SELLER',
    HEADING_TO_SELLER: 'PICKED_UP',
    PICKED_UP: 'ON_DELIVERY',
    ON_DELIVERY: 'DELIVERED',
  }

  if (action === 'NEXT') {
    if (delivery.courierId !== session.user.id) {
      return NextResponse.json({ error: 'Bukan job kamu' }, { status: 403 })
    }

    const nextDeliveryStatus = STATUS_FLOW[delivery.status]
    if (!nextDeliveryStatus) return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 })

    const nextOrderStatus = DELIVERY_ORDER_MAP[nextDeliveryStatus]
    const updateData: any = { status: nextDeliveryStatus }

    if (nextDeliveryStatus === 'PICKED_UP') updateData.pickedUpAt = new Date()
    if (nextDeliveryStatus === 'DELIVERED') updateData.deliveredAt = new Date()

    await prisma.delivery.update({ where: { id }, data: updateData })

    if (nextOrderStatus) {
      await prisma.order.update({ where: { id: delivery.orderId }, data: { status: nextOrderStatus } })
      await prisma.orderStatusLog.create({
        data: { orderId: delivery.orderId, status: nextOrderStatus, createdBy: session.user.id },
      })

      if (nextOrderStatus === 'DELIVERED') {
        await prisma.notification.create({
          data: {
            userId: delivery.order.buyerId,
            title: 'Pesanan Terkirim!',
            body: 'Pesanan kamu sudah sampai. Jangan lupa beri rating ya!',
            type: 'ORDER_DELIVERED',
            data: { orderId: delivery.orderId },
          },
        })
      }
    }

    return NextResponse.json({ deliveryStatus: nextDeliveryStatus, orderStatus: nextOrderStatus })
  }

  return NextResponse.json({ error: 'Action tidak valid' }, { status: 400 })
}
