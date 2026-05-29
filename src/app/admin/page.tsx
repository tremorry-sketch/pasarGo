export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { OrderStatusBadge } from '@/components/shared/order-status-badge'

export default async function AdminDashboard() {
  const [totalUsers, totalSellers, totalMarkets, activeOrders, todayRevenue, recentOrders, disputes] = await Promise.all([
    prisma.user.count({ where: { role: 'BUYER' } }),
    prisma.user.count({ where: { role: 'SELLER' } }),
    prisma.market.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: { notIn: ['COMPLETED', 'CANCELLED'] } } }),
    prisma.order.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      where: { status: { notIn: ['COMPLETED', 'CANCELLED'] } },
      include: { buyer: { select: { name: true } }, shop: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.dispute.count({ where: { status: 'OPEN' } }),
  ])

  const STATS = [
    { label: 'GMV Hari Ini', value: formatCurrency(todayRevenue._sum.total ?? 0), icon: 'payments', color: 'text-primary', bg: 'bg-primary-container/10', trend: '+12.5%', up: true },
    { label: 'Total Order', value: activeOrders.toString(), icon: 'shopping_bag', color: 'text-tertiary', bg: 'bg-tertiary-container/10', trend: '+5.2%', up: true },
    { label: 'Order Bermasalah', value: disputes.toString(), icon: 'report', color: 'text-error', bg: 'bg-error-container/20', trend: '-2.1%', up: false },
    { label: 'User Aktif', value: (totalUsers + totalSellers).toString(), icon: 'group', color: 'text-secondary', bg: 'bg-secondary-container/20', trend: '+18.3%', up: true },
  ]

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Top AppBar */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm glass-header shadow-header">
        <div>
          <h2 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Overview Performance
          </h2>
          <p className="text-body-sm text-text-secondary">Data terkini operasional PasarGo.</p>
        </div>
        <button className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </button>
      </header>

      <main className="pt-24 pb-32 px-margin-mobile space-y-lg">
        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-gutter">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-surface-white p-md rounded-xl card-shadow border border-border-muted flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className={`p-xs ${stat.bg} rounded-lg`}>
                  <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                </div>
                <span className={`font-bold text-label-bold flex items-center gap-0.5 ${stat.up ? 'text-status-ready' : 'text-status-canceled'}`}>
                  {stat.trend}
                  <span className="material-symbols-outlined text-sm">{stat.up ? 'trending_up' : 'trending_down'}</span>
                </span>
              </div>
              <div className="mt-md">
                <p className="text-body-sm text-text-secondary">{stat.label}</p>
                <h3 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  {stat.value}
                </h3>
              </div>
            </div>
          ))}
        </section>

        {/* Quick Links */}
        <section>
          <h3 className="font-bold text-headline-sm mb-md text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Kelola Platform
          </h3>
          <div className="grid grid-cols-2 gap-md">
            {[
              { href: '/admin/markets', label: 'Kelola Pasar', icon: 'storefront', color: 'text-primary', bg: 'bg-primary-container/10' },
              { href: '/admin/orders', label: 'Monitor Order', icon: 'receipt_long', color: 'text-tertiary', bg: 'bg-tertiary-container/10' },
              { href: '/admin/categories', label: 'Kategori', icon: 'category', color: 'text-secondary', bg: 'bg-secondary-container/20' },
              { href: '/admin/orders?status=DISPUTE', label: 'Dispute', icon: 'report', color: 'text-error', bg: 'bg-error-container/20' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-md bg-surface-white rounded-xl card-shadow p-md hover:border hover:border-primary-fixed transition-all active:scale-[0.97]"
              >
                <div className={`w-12 h-12 ${link.bg} rounded-xl flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${link.color}`}>{link.icon}</span>
                </div>
                <p className="font-bold text-on-surface text-body-lg">{link.label}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Disputes Alert */}
        {disputes > 0 && (
          <Link
            href="/admin/orders?status=DISPUTE"
            className="flex items-center gap-md bg-error-container border border-error/20 rounded-xl p-md active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-error">report</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-error">{disputes} Dispute Belum Ditangani</p>
              <p className="text-body-sm text-error/70">Segera tangani untuk menjaga kepercayaan pengguna</p>
            </div>
            <span className="material-symbols-outlined text-error">chevron_right</span>
          </Link>
        )}

        {/* Live Order Monitoring */}
        <section>
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Live Order Monitoring
            </h3>
            <Link href="/admin/orders" className="text-primary font-bold text-label-bold flex items-center gap-base">
              Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="space-y-sm">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/admin/orders`}>
                <div className="bg-surface-white rounded-xl card-shadow border border-border-muted p-md flex items-center gap-md active:scale-[0.98] transition-transform">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-base">
                      <p className="font-mono text-body-sm text-text-secondary">{order.orderNumber}</p>
                      <OrderStatusBadge status={order.status as any} />
                    </div>
                    <p className="font-bold text-on-surface text-body-lg">{order.buyer.name}</p>
                    <p className="text-body-sm text-text-secondary">{order.shop.name}</p>
                  </div>
                  <span className="material-symbols-outlined text-outline flex-shrink-0">chevron_right</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Platform Stats */}
        <section className="grid grid-cols-3 gap-sm">
          {[
            { label: 'Pembeli', value: totalUsers, icon: 'person' },
            { label: 'Penjual', value: totalSellers, icon: 'storefront' },
            { label: 'Pasar', value: totalMarkets, icon: 'location_on' },
          ].map((s) => (
            <div key={s.label} className="bg-surface-white p-sm rounded-xl card-shadow text-center">
              <span className="material-symbols-outlined text-primary mb-base">{s.icon}</span>
              <p className="font-bold text-[20px] text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{s.value}</p>
              <p className="text-[10px] font-bold text-text-secondary">{s.label}</p>
            </div>
          ))}
        </section>
      </main>

    </div>
  )
}
