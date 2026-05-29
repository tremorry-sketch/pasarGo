export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/shared/order-status-badge'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function SellerOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const session = await auth()
  const sp = await searchParams

  const shop = await prisma.sellerShop.findUnique({ where: { userId: session!.user.id } })

  const orders = shop ? await prisma.order.findMany({
    where: {
      shopId: shop.id,
      ...(sp.status ? { status: sp.status as any } : {}),
    },
    include: {
      buyer: { select: { name: true, phone: true } },
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  }) : []

  const statusTabs = [
    { label: 'Semua', value: '' },
    { label: 'Baru', value: 'PLACED' },
    { label: 'Dikonfirmasi', value: 'SELLER_CONFIRMED' },
    { label: 'Packing', value: 'PACKING' },
    { label: 'Selesai', value: 'COMPLETED' },
  ]

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface shadow-header">
        <h1 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Daftar Pesanan
        </h1>
        <div className="flex items-center gap-xs bg-surface-container px-sm py-base rounded-full text-primary font-bold text-label-bold">
          <span>Filter</span>
          <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
        </div>
      </header>

      {/* Status Tabs */}
      <div className="fixed top-[52px] left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 flex gap-xs overflow-x-auto no-scrollbar px-margin-mobile py-sm bg-surface border-b border-border-muted">
        {statusTabs.map((tab) => {
          const isActive = sp.status === tab.value || (!sp.status && !tab.value)
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/seller/orders?status=${tab.value}` : '/seller/orders'}
              className={`flex-shrink-0 px-md py-xs rounded-full font-bold text-label-bold transition-colors ${
                isActive ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-surface-white border border-border-muted text-on-surface-variant'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      <main className="pt-32 pb-28 px-margin-mobile space-y-md">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-xl text-center">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-lg">
              <span className="material-symbols-outlined text-[40px] text-outline">inbox</span>
            </div>
            <p className="text-body-sm text-text-secondary">Tidak ada pesanan</p>
          </div>
        ) : (
          orders.map((order) => (
            <Link key={order.id} href={`/seller/orders/${order.id}`}>
              <div className="bg-surface-white rounded-xl card-shadow border border-border-muted overflow-hidden active:scale-[0.98] transition-transform">
                <div className="p-md">
                  <div className="flex justify-between items-start mb-sm">
                    <div>
                      <h3 className="font-semibold text-title-md text-on-surface">{order.buyer.name}</h3>
                      <p className="text-body-sm text-text-secondary font-mono">{order.orderNumber}</p>
                    </div>
                    <OrderStatusBadge status={order.status as any} />
                  </div>
                  <div className="flex items-center gap-xs text-body-sm text-text-secondary mb-md">
                    <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                    <span>{order.items.length} item</span>
                    <span>•</span>
                    <span>{formatDate(order.createdAt.toString())}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-primary text-label-bold">{formatCurrency(order.total)}</p>
                    <div className="flex items-center gap-xs font-bold text-label-bold text-primary">
                      <span>Cek Pesanan</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </main>
    </div>
  )
}
