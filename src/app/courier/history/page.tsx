export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export default async function CourierHistoryPage() {
  const session = await auth()

  const deliveries = await prisma.delivery.findMany({
    where: { courierId: session!.user.id, status: 'DELIVERED' },
    include: {
      order: {
        include: {
          buyer: { select: { name: true } },
          shop: true,
          items: true,
        },
      },
    },
    orderBy: { deliveredAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex items-center px-margin-mobile py-sm bg-surface shadow-header">
        <h1 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Riwayat Pengiriman
        </h1>
      </header>

      <main className="pt-20 pb-28 px-margin-mobile space-y-md">
        {deliveries.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-xl text-center">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-lg">
              <span className="material-symbols-outlined text-[40px] text-outline">moped</span>
            </div>
            <p className="text-body-sm text-text-secondary">Belum ada pengiriman selesai</p>
          </div>
        ) : (
          deliveries.map((d) => (
            <div key={d.id} className="bg-surface-white rounded-xl card-shadow p-md">
              <div className="flex items-start gap-md">
                <div className="w-10 h-10 bg-primary-fixed/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    task_alt
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-on-surface text-body-lg truncate">
                    {d.order.shop.name} → {d.order.buyer.name}
                  </p>
                  <p className="text-body-sm text-text-secondary">{d.order.items.length} item produk</p>
                  {d.deliveredAt && (
                    <p className="text-body-sm text-primary font-bold mt-xs">
                      Selesai: {formatDate(d.deliveredAt.toString())}
                    </p>
                  )}
                </div>
                <p className="font-bold text-headline-sm text-primary flex-shrink-0" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  Rp 15.000
                </p>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}
