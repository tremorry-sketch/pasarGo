export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const QUICK_CATEGORIES = [
  { icon: 'eco', label: 'Sayur' },
  { icon: 'nutrition', label: 'Buah' },
  { icon: 'restaurant', label: 'Bumbu' },
  { icon: 'set_meal', label: 'Ikan' },
  { icon: 'egg', label: 'Ayam' },
  { icon: 'kebab_dining', label: 'Daging' },
  { icon: 'shopping_basket', label: 'Sembako' },
  { icon: 'egg_alt', label: 'Telur' },
]

export default async function BuyerHome() {
  const session = await auth()
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Kamu'

  const markets = await prisma.market.findMany({
    where: { isActive: true },
    include: { _count: { select: { sellerShops: { where: { isActive: true } } } } },
    take: 3,
  })

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* TopAppBar */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface shadow-header">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">eco</span>
          <span className="font-bold text-headline-sm text-primary" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            PasarGo
          </span>
        </div>
        <div className="flex items-center gap-xs">
          <Link href="/buyer/notifications" className="p-xs rounded-full hover:bg-surface-container-low relative">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </Link>
        </div>
      </header>

      <main className="pt-20 pb-32 px-margin-mobile space-y-lg">
        {/* Greeting + Search */}
        <section className="pt-sm">
          <div className="mb-md">
            <p className="text-text-secondary text-body-sm">Selamat pagi,</p>
            <p className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              {firstName} 👋
            </p>
          </div>
          <Link
            href="/markets"
            className="flex items-center gap-sm bg-surface-white border border-border-muted rounded-xl px-md py-sm shadow-sm"
          >
            <span className="material-symbols-outlined text-outline">search</span>
            <span className="text-outline-variant text-body-lg">Cari sayur, buah, ikan...</span>
          </Link>
        </section>

        {/* Location strip */}
        <div className="flex items-center gap-xs py-xs border-b border-border-muted">
          <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
          <span className="text-body-sm text-text-secondary flex-1">Pilih lokasi pasar</span>
          <Link href="/markets" className="text-body-sm text-primary font-bold">Ganti</Link>
        </div>

        {/* Category Grid */}
        <section>
          <div className="flex justify-between items-end mb-md">
            <div>
              <h2 className="font-bold text-headline-sm text-on-background" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Kategori Segar
              </h2>
              <p className="text-text-secondary text-body-sm">Pilih kebutuhan dapur kamu</p>
            </div>
            <Link href="/markets" className="text-primary font-bold text-label-bold flex items-center gap-base">
              Semua <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-sm">
            {QUICK_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href="/markets"
                className="flex flex-col items-center gap-sm p-sm bg-surface-white rounded-xl card-shadow hover:-translate-y-1 transition-transform cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                </div>
                <span className="text-[12px] font-bold text-on-surface text-center leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Pasar Terdekat */}
        <section>
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-bold text-headline-sm text-on-background" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Pasar Terdekat
            </h2>
            <Link href="/markets" className="text-primary font-bold text-label-bold flex items-center gap-base">
              Lihat semua <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="space-y-md">
            {markets.map((market) => (
              <Link
                key={market.id}
                href={`/markets/${market.slug}`}
                className="flex items-center gap-md p-md bg-surface-white rounded-xl card-shadow hover:border hover:border-primary-fixed transition-all duration-200 active:scale-[0.98]"
              >
                <div className="w-14 h-14 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[28px]">storefront</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-on-surface text-body-lg">{market.name}</p>
                  <p className="text-body-sm text-text-secondary truncate">{market.address}</p>
                  <p className="text-label-bold text-primary font-bold mt-0.5">
                    {market._count.sellerShops} penjual aktif
                  </p>
                </div>
                <span className="material-symbols-outlined text-outline">chevron_right</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

    </div>
  )
}
