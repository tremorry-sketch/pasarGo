export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function MarketsPage() {
  const markets = await prisma.market.findMany({
    where: { isActive: true },
    include: { _count: { select: { sellerShops: { where: { isActive: true } } } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface shadow-header">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">location_on</span>
          <h1 className="font-bold text-headline-sm text-primary" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            PasarGo
          </h1>
        </div>
        <button className="p-xs rounded-full hover:bg-surface-container-low transition-colors active:scale-95">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
        </button>
      </header>

      <main className="pt-24 pb-32 px-margin-mobile">
        {/* Title + Search */}
        <section className="mb-lg">
          <h2 className="font-bold text-headline-md text-on-surface mb-sm" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Pilih Pasar
          </h2>
          <div className="relative mb-md">
            <input
              className="w-full h-12 bg-background-off-white border border-border-muted rounded-xl px-12 focus:ring-2 focus:ring-primary focus:border-transparent text-body-lg transition-all duration-300 placeholder:text-outline"
              placeholder="Cari lokasi atau nama pasar..."
              type="text"
            />
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
          </div>

          {/* Filter chips */}
          <div className="flex gap-xs overflow-x-auto no-scrollbar py-2">
            {['Terdekat', 'Sedang Buka', 'Ongkir Murah', 'Rating Tinggi'].map((chip, i) => (
              <button
                key={chip}
                className={`px-md py-xs rounded-full font-bold text-label-bold whitespace-nowrap active:scale-95 transition-transform ${
                  i === 0
                    ? 'bg-primary-fixed text-on-primary-fixed-variant'
                    : 'bg-surface-white border border-border-muted text-on-surface-variant hover:bg-surface-container-low transition-colors'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        {/* Market List */}
        <div className="space-y-md">
          {markets.map((market) => (
            <div
              key={market.id}
              className="bg-surface-white p-md rounded-xl card-shadow border border-transparent hover:border-primary-fixed transition-all duration-300"
            >
              <div className="flex gap-md">
                <div className="w-24 h-24 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {market.imageUrl ? (
                    <img src={market.imageUrl} alt={market.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[48px] text-primary opacity-60">storefront</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-title-md text-on-surface">{market.name}</h3>
                    <span className="bg-primary-fixed px-2 py-0.5 rounded-full font-bold text-badge-cap text-on-primary-fixed-variant flex-shrink-0 ml-2">
                      BUKA
                    </span>
                  </div>
                  <p className="text-body-sm text-text-secondary mt-1 line-clamp-1">{market.address}</p>
                  <div className="flex items-center gap-sm mt-xs">
                    <div className="flex items-center text-primary gap-0.5">
                      <span className="material-symbols-outlined text-[16px]">storefront</span>
                      <span className="font-bold text-label-bold">{market._count.sellerShops}+ Penjual</span>
                    </div>
                    <div className="flex items-center text-secondary gap-0.5">
                      <span className="material-symbols-outlined text-[16px]">delivery_dining</span>
                      <span className="font-bold text-label-bold">Rp 5.000</span>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href={`/markets/${market.slug}`}
                className="block w-full mt-md bg-primary text-on-primary py-sm rounded-full font-bold text-label-bold active:scale-95 transition-transform shadow-btn-primary text-center"
              >
                Belanja di Pasar Ini
              </Link>
            </div>
          ))}

          {markets.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-[48px] text-outline opacity-30 mb-xs">storefront</span>
              <p className="text-text-secondary text-body-sm mt-xs">Belum ada pasar tersedia</p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-around items-center px-xs pb-6 pt-2 bg-surface-white shadow-bottom-nav rounded-t-xl border-t border-border-muted">
        {[
          { href: '/', icon: 'home', label: 'Home' },
          { href: '/markets', icon: 'storefront', label: 'Markets', active: true },
          { href: '/login', icon: 'shopping_cart', label: 'Cart' },
          { href: '/login', icon: 'receipt_long', label: 'Orders' },
          { href: '/login', icon: 'person', label: 'Profile' },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 ${item.active ? 'text-primary bg-surface-container rounded-full px-4 py-1' : 'text-text-secondary'}`}
          >
            <span
              className="material-symbols-outlined"
              style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
