export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/shared/order-status-badge'
import { formatCurrency, formatDate, ORDER_STATUS_LABEL } from '@/lib/utils'

const STATUS_ICON: Record<string, string> = {
  DRAFT: 'edit_note',
  PLACED: 'shopping_bag',
  SELLER_REVIEW: 'inventory_2',
  SELLER_CONFIRMED: 'check_circle',
  PACKING: 'inventory_2',
  READY_FOR_PICKUP: 'local_shipping',
  FINDING_COURIER: 'search',
  COURIER_ASSIGNED: 'moped',
  PICKED_UP: 'moped',
  ON_DELIVERY: 'local_shipping',
  DELIVERED: 'home',
  COMPLETED: 'task_alt',
  CANCELLED: 'cancel',
  DISPUTE: 'report',
}

export default async function BuyerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params

  const order = await prisma.order.findFirst({
    where: { id, buyerId: session!.user.id },
    include: {
      shop: { include: { market: true } },
      items: { include: { product: true } },
      delivery: { include: { courier: { select: { name: true, phone: true } } } },
      statusLogs: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!order) notFound()

  const isActiveStep = (status: string) => order.status === status
  const isDoneStep = (status: string) => {
    const doneStatuses = order.statusLogs.map((l) => l.status)
    return doneStatuses.includes(status as any) && order.status !== status
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface shadow-header">
        <div className="flex items-center gap-md">
          <Link href="/buyer/orders" className="active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </Link>
          <h1 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Lacak Pesanan
          </h1>
        </div>
        <button className="active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-primary">help_outline</span>
        </button>
      </header>

      <main className="pt-[72px] pb-[100px] px-margin-mobile space-y-md">
        {/* Status Header Card */}
        <section className="bg-surface-white rounded-xl p-md card-shadow border-l-[5px] border-status-reviewing mt-md">
          <div className="flex justify-between items-start mb-base">
            <h2 className="font-semibold text-title-md text-on-surface">
              {ORDER_STATUS_LABEL[order.status as keyof typeof ORDER_STATUS_LABEL] ?? order.status}
            </h2>
            <OrderStatusBadge status={order.status as any} />
          </div>
          <p className="text-body-sm text-text-secondary">
            No. Pesanan: <span className="font-bold text-on-surface">{order.orderNumber}</span>
          </p>
          <p className="text-body-sm text-text-secondary mt-base">{formatDate(order.updatedAt.toString())}</p>
        </section>

        {/* Timeline */}
        <section className="bg-surface-white rounded-xl p-md card-shadow">
          <h3 className="font-semibold text-title-md mb-lg">Status Perjalanan</h3>
          <div className="space-y-0">
            {order.statusLogs.map((log, i) => {
              const done = i < order.statusLogs.length - 1
              const active = i === order.statusLogs.length - 1
              return (
                <div key={log.id} className="relative flex gap-md pb-lg">
                  {/* Connector line */}
                  {i < order.statusLogs.length - 1 && (
                    <div
                      className="absolute top-6 left-[11px] w-0.5 h-full"
                      style={{ background: done ? '#006b2d' : '#bdcaba' }}
                    />
                  )}
                  {/* Dot */}
                  <div
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      done
                        ? 'bg-primary text-white'
                        : active
                        ? 'bg-status-reviewing text-white shadow-[0_0_0_4px_rgba(246,166,35,0.2)]'
                        : 'bg-surface-container-highest text-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]" style={done ? { fontVariationSettings: "'FILL' 1" } : {}}>
                      {done ? 'check' : (STATUS_ICON[log.status] ?? 'radio_button_checked')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-body-lg ${active ? 'text-primary font-semibold' : done ? 'text-on-surface' : 'text-outline'}`}>
                      {ORDER_STATUS_LABEL[log.status as keyof typeof ORDER_STATUS_LABEL] ?? log.status}
                    </span>
                    <span className="text-body-sm text-text-secondary">
                      {active ? 'Sedang berlangsung' : formatDate(log.createdAt.toString())}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Seller & Courier Cards */}
        <div className="grid grid-cols-2 gap-md">
          {/* Seller */}
          <section className="bg-surface-white rounded-xl p-md card-shadow flex flex-col justify-between">
            <div className="flex items-center gap-sm mb-md">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-[24px]">storefront</span>
              </div>
              <div className="min-w-0">
                <span className="text-body-sm text-text-secondary block">Penjual</span>
                <h4 className="font-semibold text-title-md truncate">{order.shop.name}</h4>
              </div>
            </div>
            <div className="flex items-center gap-xs text-status-ready">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="font-bold text-label-bold">Terpercaya</span>
            </div>
          </section>

          {/* Courier */}
          <section className="bg-surface-white rounded-xl p-md card-shadow flex flex-col gap-md">
            {order.delivery?.courier ? (
              <>
                <div className="flex items-center gap-sm">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-[24px]">moped</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-body-sm text-text-secondary block">Kurir</span>
                    <h4 className="font-semibold text-title-md truncate">{order.delivery.courier.name}</h4>
                  </div>
                </div>
                <button className="w-full py-sm bg-primary text-on-primary rounded-full font-bold text-label-bold flex items-center justify-center gap-xs active:scale-95 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  CHAT
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center">
                <span className="material-symbols-outlined text-[32px] text-outline opacity-40">moped</span>
                <p className="text-body-sm text-text-secondary mt-xs">Menunggu kurir</p>
              </div>
            )}
          </section>
        </div>

        {/* Order Summary */}
        <section className="bg-surface-white rounded-xl card-shadow overflow-hidden">
          <div className="flex justify-between items-center p-md">
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
              <span className="font-semibold text-title-md">Detail Pesanan</span>
            </div>
            <span className="material-symbols-outlined">expand_more</span>
          </div>
          <div className="px-md pb-md border-t border-border-muted space-y-sm">
            {order.items.map((item) => (
              <div key={item.id} className={`flex justify-between text-body-sm ${item.isCancelled ? 'opacity-40 line-through' : ''}`}>
                <span className="text-text-secondary">
                  {item.productName} ({item.finalQuantity ?? item.quantity} {item.productUnit})
                </span>
                <span className="text-on-surface">
                  {formatCurrency((item.finalPrice ?? item.priceAtOrder) * (item.finalQuantity ?? item.quantity))}
                </span>
              </div>
            ))}
            <div className="pt-sm border-t border-dashed border-outline-variant flex justify-between">
              <span className="font-bold text-label-bold text-on-surface">Total Pembayaran</span>
              <span className="font-semibold text-title-md text-primary">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </section>

        {/* Delivery Address */}
        <section className="bg-surface-white rounded-xl p-md card-shadow">
          <div className="flex items-center gap-sm mb-sm">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <h3 className="font-semibold text-title-md">Alamat Pengiriman</h3>
          </div>
          <p className="text-body-sm text-text-secondary leading-relaxed">{order.deliveryAddress}</p>
          {order.deliveryNote && (
            <p className="text-body-sm text-outline mt-xs italic">Catatan: {order.deliveryNote}</p>
          )}
        </section>

        {/* Help */}
        <section className="text-center pt-md">
          <p className="text-body-sm text-text-secondary mb-xs">Mengalami kendala dengan pesanan?</p>
          <a href="#" className="font-bold text-label-bold text-primary underline underline-offset-4 flex items-center justify-center gap-base">
            <span className="material-symbols-outlined text-[18px]">support_agent</span>
            Butuh bantuan? Hubungi Kami
          </a>
        </section>

        {/* Complete CTA */}
        {order.status === 'DELIVERED' && (
          <Link
            href={`/buyer/orders/${order.id}/rate`}
            className="block w-full bg-primary text-on-primary text-center font-bold py-md rounded-full shadow-btn-primary squishy-btn"
          >
            Beri Rating & Selesaikan Pesanan
          </Link>
        )}
      </main>

    </div>
  )
}
