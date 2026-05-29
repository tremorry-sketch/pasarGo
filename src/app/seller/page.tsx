export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default async function SellerDashboard() {
  const session = await auth()

  const shop = await prisma.sellerShop.findUnique({
    where: { userId: session!.user.id },
    include: { market: true },
  })

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-margin-mobile text-center bg-background">
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-lg">
          <span className="material-symbols-outlined text-[40px] text-outline">storefront</span>
        </div>
        <h2 className="font-bold text-headline-sm text-on-surface mb-xs" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Toko Belum Terdaftar
        </h2>
        <p className="text-body-sm text-text-secondary">Hubungi admin untuk mendaftarkan toko kamu.</p>
      </div>
    )
  }

  const [newOrders, reviewOrders, packingOrders, totalProducts, todayRevenue] = await Promise.all([
    prisma.order.count({ where: { shopId: shop.id, status: 'PLACED' } }),
    prisma.order.count({ where: { shopId: shop.id, status: 'SELLER_REVIEW' } }),
    prisma.order.count({ where: { shopId: shop.id, status: 'PACKING' } }),
    prisma.product.count({ where: { shopId: shop.id, isActive: true } }),
    prisma.order.aggregate({
      where: {
        shopId: shop.id,
        status: 'COMPLETED',
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
      _sum: { subtotal: true },
    }),
  ])

  const recentOrders = await prisma.order.findMany({
    where: { shopId: shop.id, status: { notIn: ['COMPLETED', 'CANCELLED'] } },
    include: { buyer: { select: { name: true } }, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface shadow-header">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">location_on</span>
          <h1 className="font-bold text-[24px] text-primary" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            PasarGo
          </h1>
        </div>
        <Link href="/seller/profile" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors active:scale-95">
          <span className="material-symbols-outlined text-on-surface-variant">person</span>
        </Link>
      </header>

      <main className="pt-24 pb-28 px-margin-mobile space-y-lg">
        {/* Daily Summary */}
        <section>
          <div className="flex items-baseline justify-between mb-sm">
            <h2 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Ringkasan Hari Ini
            </h2>
            <Link href="/seller/orders" className="text-primary font-bold text-label-bold">Lihat Detail</Link>
          </div>

          {/* Revenue Card */}
          <div className="bg-primary text-on-primary p-md rounded-xl shadow-btn-primary mb-md relative overflow-hidden">
            <div className="relative z-10">
              <p className="font-bold text-label-bold opacity-80 mb-base">Pendapatan Hari Ini</p>
              <p className="font-bold text-display-lg-mobile" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                {formatCurrency(todayRevenue._sum.subtotal ?? 0)}
              </p>
              <p className="text-body-sm opacity-70 mt-xs">{shop.name} — {shop.market?.name}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-container rounded-full opacity-40" />
            <div className="absolute right-12 -top-6 w-16 h-16 bg-primary-fixed-dim rounded-full opacity-20" />
          </div>

          {/* Bento Stats */}
          <div className="grid grid-cols-3 gap-sm">
            <div className="bg-surface-white p-sm rounded-xl card-shadow border-l-[5px] border-status-placed">
              <p className="font-bold text-[24px] leading-none mb-base" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                {newOrders}
              </p>
              <p className="font-bold text-[10px] text-text-secondary leading-tight">Order Baru</p>
            </div>
            <div className="bg-surface-white p-sm rounded-xl card-shadow border-l-[5px] border-status-reviewing">
              <p className="font-bold text-[24px] leading-none mb-base" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                {reviewOrders}
              </p>
              <p className="font-bold text-[10px] text-text-secondary leading-tight">Perlu Dicek</p>
            </div>
            <div className="bg-surface-white p-sm rounded-xl card-shadow border-l-[5px] border-status-packing">
              <p className="font-bold text-[24px] leading-none mb-base" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                {packingOrders}
              </p>
              <p className="font-bold text-[10px] text-text-secondary leading-tight">Dikemas</p>
            </div>
          </div>
        </section>

        {/* Order Masuk */}
        <section>
          <div className="flex items-center justify-between mb-sm">
            <h2 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Order Masuk
            </h2>
            <div className="flex items-center gap-xs bg-surface-container px-sm py-base rounded-full text-primary font-bold text-label-bold">
              <span>Terbaru</span>
              <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
            </div>
          </div>

          <div className="space-y-md">
            {recentOrders.length === 0 ? (
              <div className="text-center py-xl bg-surface-white rounded-xl card-shadow">
                <span className="material-symbols-outlined text-[40px] text-outline opacity-40">inbox</span>
                <p className="text-body-sm text-text-secondary mt-xs">Tidak ada order aktif</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <Link key={order.id} href={`/seller/orders/${order.id}`}>
                  <div className="bg-surface-white rounded-xl card-shadow border border-border-muted overflow-hidden active:scale-[0.98] transition-transform">
                    <div className="p-md">
                      <div className="flex justify-between items-start mb-md">
                        <div>
                          <h3 className="font-semibold text-title-md mb-base">{order.buyer.name}</h3>
                          <p className="text-body-sm text-text-secondary">{order.orderNumber}</p>
                        </div>
                        <span className="bg-status-placed text-white font-bold text-badge-cap px-sm py-base rounded-full">
                          BARU
                        </span>
                      </div>
                      <div className="flex items-center gap-md mb-md">
                        <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-primary">shopping_basket</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-label-bold">{order.items[0]?.productName ?? 'Produk'}</p>
                          {order.items.length > 1 && (
                            <p className="text-body-sm text-text-secondary">+ {order.items.length - 1} Produk lainnya</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary text-label-bold">
                            {formatCurrency(order.items.reduce((s, i) => s + i.priceAtOrder * i.quantity, 0))}
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-primary text-on-primary py-md rounded-full font-bold text-label-bold flex items-center justify-center gap-sm shadow-btn-primary">
                        <span>Cek Pesanan</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>

    </div>
  )
}
