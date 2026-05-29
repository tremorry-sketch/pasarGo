export const dynamic = 'force-dynamic'

import { auth, signOut } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function BuyerProfilePage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { name: true, email: true, phone: true, address: true, createdAt: true },
  })

  const totalOrders = await prisma.order.count({ where: { buyerId: session!.user.id } })

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface shadow-header">
        <h1 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Profil Saya
        </h1>
      </header>

      <main className="pt-20 pb-32 px-margin-mobile space-y-lg">
        {/* Avatar + Name */}
        <section className="flex flex-col items-center pt-lg">
          <div className="w-24 h-24 bg-primary-fixed rounded-full flex items-center justify-center mb-md shadow-btn-primary">
            <span className="material-symbols-outlined text-[48px] text-on-primary-fixed-variant" style={{ fontVariationSettings: "'FILL' 1" }}>
              person
            </span>
          </div>
          <h2 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {user?.name}
          </h2>
          <p className="text-body-sm text-text-secondary">{user?.email}</p>
        </section>

        {/* Stats */}
        <section className="bg-primary text-on-primary rounded-xl p-lg text-center relative overflow-hidden card-shadow">
          <p className="font-bold text-[40px]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{totalOrders}</p>
          <p className="text-body-sm opacity-80">Total Pesanan</p>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary-container rounded-full opacity-30" />
        </section>

        {/* Info */}
        <section className="bg-surface-white rounded-xl card-shadow p-md space-y-md">
          {user?.phone && (
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">phone</span>
              </div>
              <div>
                <p className="font-bold text-label-bold text-text-secondary uppercase tracking-wider text-[10px]">WhatsApp</p>
                <p className="text-body-lg text-on-surface">{user.phone}</p>
              </div>
            </div>
          )}
          {user?.address && (
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">location_on</span>
              </div>
              <div>
                <p className="font-bold text-label-bold text-text-secondary uppercase tracking-wider text-[10px]">Alamat</p>
                <p className="text-body-lg text-on-surface">{user.address}</p>
              </div>
            </div>
          )}
        </section>

        {/* Menu */}
        <section className="bg-surface-white rounded-xl card-shadow overflow-hidden">
          {[
            { href: '/buyer/orders', icon: 'receipt_long', label: 'Riwayat Pesanan' },
            { href: '/markets', icon: 'storefront', label: 'Jelajahi Pasar' },
          ].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-md px-md py-md hover:bg-surface-container-low transition-colors active:scale-[0.98] ${i > 0 ? 'border-t border-border-muted' : ''}`}
            >
              <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">{item.icon}</span>
              </div>
              <span className="font-bold text-body-lg text-on-surface flex-1">{item.label}</span>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </Link>
          ))}
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
