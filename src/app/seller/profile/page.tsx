export const dynamic = 'force-dynamic'

import { auth, signOut } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function SellerProfilePage() {
  const session = await auth()

  const [shop, user] = await Promise.all([
    prisma.sellerShop.findUnique({
      where: { userId: session!.user.id },
      include: { market: true },
    }),
    prisma.user.findUnique({
      where: { id: session!.user.id },
      select: { name: true, email: true, phone: true },
    }),
  ])

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex items-center px-margin-mobile py-sm bg-surface shadow-header">
        <h1 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Profil Penjual
        </h1>
      </header>

      <main className="pt-20 pb-32 px-margin-mobile space-y-lg">
        {/* Avatar */}
        <section className="flex flex-col items-center pt-lg">
          <div className="w-24 h-24 bg-primary-fixed rounded-full flex items-center justify-center mb-md shadow-btn-primary">
            <span className="material-symbols-outlined text-[48px] text-on-primary-fixed-variant" style={{ fontVariationSettings: "'FILL' 1" }}>
              storefront
            </span>
          </div>
          <h2 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {shop?.name ?? user?.name}
          </h2>
          <p className="text-body-sm text-text-secondary">{user?.email}</p>
        </section>

        {/* Shop Info */}
        {shop && (
          <section className="bg-surface-white rounded-xl card-shadow p-md space-y-md">
            <h2 className="font-semibold text-title-md">Info Toko</h2>

            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">storefront</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-on-surface">{shop.name}</p>
                <p className="text-body-sm text-text-secondary">
                  {shop.isVerified ? '✓ Terverifikasi' : 'Menunggu verifikasi'}
                </p>
              </div>
              {shop.isVerified && (
                <span className="material-symbols-outlined text-status-ready" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              )}
            </div>

            <div className="flex items-center gap-md border-t border-border-muted pt-md">
              <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">location_on</span>
              </div>
              <div>
                <p className="font-bold text-label-bold text-text-secondary uppercase tracking-wider text-[10px]">Lokasi</p>
                <p className="text-body-lg text-on-surface">{shop.market?.name}</p>
                <p className="text-body-sm text-text-secondary">{shop.market?.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-md border-t border-border-muted pt-md">
              <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <div>
                <p className="font-bold text-label-bold text-text-secondary uppercase tracking-wider text-[10px]">Rating</p>
                <p className="text-body-lg text-on-surface">
                  {shop.rating.toFixed(1)} ⭐ · {shop.totalOrders} pesanan
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Contact */}
        <section className="bg-surface-white rounded-xl card-shadow p-md space-y-md">
          <h2 className="font-semibold text-title-md">Kontak</h2>
          {user?.phone && (
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">phone</span>
              </div>
              <p className="text-body-lg text-on-surface">{user.phone}</p>
            </div>
          )}
        </section>

        {/* Logout */}
        <form action={async () => {
          'use server'
          await signOut({ redirectTo: '/' })
        }}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-sm p-md bg-error-container text-error rounded-xl font-bold text-body-lg active:scale-[0.98] transition-transform"
          >
            <span className="material-symbols-outlined">logout</span>
            Keluar
          </button>
        </form>
      </main>
    </div>
  )
}
