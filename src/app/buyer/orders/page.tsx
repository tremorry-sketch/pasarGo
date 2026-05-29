export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/shared/order-status-badge'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function BuyerOrdersPage() {
  const session = await auth()

  const orders = await prisma.order.findMany({
    where: { buyerId: session!.user.id },
    include: { shop: true, items: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface shadow-header">
        <h1 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Pesanan Saya
        </h1>
        <Link href="/buyer/notifications" className="p-xs rounded-full hover:bg-surface-container-low relative">
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
        </Link>
      </header>

      <main className="pt-20 pb-32 px-margin-mobile space-y-md">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 text-center">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-lg">
              <span className="material-symbols-outlined text-[48px] text-outline">receipt_long</span>
            </div>
            <h2 className="font-bold text-headline-sm text-on-surface mb-xs" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Belum Ada Pesanan
            </h2>
            <p className="text-body-sm text-text-secondary mb-lg">Yuk mulai belanja dari pasar terdekat!</p>
            <Link
              href="/markets"
              className="bg-primary text-on-primary px-xl py-md rounded-full font-bold text-label-bold shadow-btn-primary squishy-btn"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-md pt-sm">
            {orders.map((order) => (
              <Link key={order.id} href={`/buyer/orders/${order.id}`}>
                <div className="bg-surface-white rounded-xl card-shadow border border-border-muted overflow-hidden active:scale-[0.98] transition-transform">
                  <div className="p-md">
                    <div className="flex justify-between items-start mb-md">
                      <div>
                        <h3 className="font-semibold text-title-md text-on-surface">{order.shop.name}</h3>
                        <p className="text-body-sm text-text-secondary">{order.orderNumber}</p>
                      </div>
                      <OrderStatusBadge status={order.status as any} />
                    </div>
                    <div className="flex items-center gap-md mb-md">
                      <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary">shopping_basket</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-label-bold">{order.items.length} item</p>
                        <p className="text-body-sm text-text-secondary">{formatDate(order.createdAt.toString())}</p>
                      </div>
                      <p className="font-bold text-primary text-label-bold">{formatCurrency(order.total)}</p>
                    </div>
                    <div className="flex items-center justify-center gap-sm w-full bg-primary text-on-primary py-sm rounded-full font-bold text-label-bold shadow-btn-primary">
                      <span>Lacak Pesanan</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

    </div>
  )
}
