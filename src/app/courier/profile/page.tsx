export const dynamic = 'force-dynamic'

import { auth, signOut } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function CourierProfilePage() {
  const session = await auth()

  const [user, totalDeliveries] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session!.user.id },
      select: { name: true, email: true, phone: true },
    }),
    prisma.delivery.count({
      where: { courierId: session!.user.id, status: 'DELIVERED' },
    }),
  ])

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex items-center px-margin-mobile py-sm bg-surface shadow-header">
        <h1 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Profil Kurir
        </h1>
      </header>

      <main className="pt-20 pb-32 px-margin-mobile space-y-lg">
        {/* Avatar */}
        <section className="flex flex-col items-center pt-lg">
          <div className="w-24 h-24 bg-primary-fixed rounded-full flex items-center justify-center mb-md shadow-btn-primary">
            <span className="material-symbols-outlined text-[48px] text-on-primary-fixed-variant" style={{ fontVariationSettings: "'FILL' 1" }}>
              moped
            </span>
          </div>
          <h2 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {user?.name}
          </h2>
          <p className="text-body-sm text-text-secondary">{user?.email}</p>
        </section>

        {/* Stats */}
        <section className="bg-primary rounded-2xl p-lg text-on-primary text-center">
          <p className="font-bold text-[40px]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {totalDeliveries}
          </p>
          <p className="text-body-sm opacity-80">Total Pengiriman Selesai</p>
        </section>

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
