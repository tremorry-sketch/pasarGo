export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function CourierDashboard() {
  const session = await auth()

  const [availableJobs, myActiveJobs, todayEarnings] = await Promise.all([
    prisma.delivery.count({ where: { status: 'AVAILABLE', courierId: null } }),
    prisma.delivery.findMany({
      where: {
        courierId: session!.user.id,
        status: { notIn: ['DELIVERED'] },
      },
      include: {
        order: {
          include: {
            buyer: { select: { name: true, phone: true } },
            shop: { include: { market: true } },
          },
        },
      },
      orderBy: { acceptedAt: 'desc' },
      take: 3,
    }),
    prisma.delivery.count({
      where: {
        courierId: session!.user.id,
        status: 'DELIVERED',
        deliveredAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
  ])

  const firstName = session!.user.name?.split(' ')[0] ?? 'Kurir'

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm glass-header shadow-header">
        <div className="flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary">location_on</span>
          <div className="flex flex-col">
            <span className="font-bold text-[10px] text-text-secondary uppercase tracking-widest">DRIVER ZONE</span>
            <h1 className="font-bold text-headline-sm text-primary" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              PasarGo
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center active:scale-95 transition-transform relative">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </div>
          <Link href="/courier/profile" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary">
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-32 px-margin-mobile space-y-lg">
        {/* Quick Stats */}
        <section className="grid grid-cols-2 gap-md">
          <div className="bg-surface-white p-md rounded-xl card-shadow border-l-4 border-primary">
            <p className="font-bold text-text-secondary text-[11px] mb-1 uppercase tracking-wider">Saldo</p>
            <h2 className="font-semibold text-title-md text-on-surface">Rp 0</h2>
          </div>
          <div className="bg-surface-white p-md rounded-xl card-shadow border-l-4 border-status-placed">
            <p className="font-bold text-text-secondary text-[11px] mb-1 uppercase tracking-wider">Total Hari Ini</p>
            <h2 className="font-semibold text-title-md text-on-surface">{todayEarnings} Job</h2>
          </div>
        </section>

        {/* Active Job */}
        {myActiveJobs.length > 0 && (
          <section className="space-y-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Job Aktif
              </h3>
              <span className="bg-primary-container text-on-primary-container px-xs py-1 rounded-full text-badge-cap font-bold uppercase">
                SEDANG DIANTAR
              </span>
            </div>
            {myActiveJobs.map((job) => (
              <Link key={job.id} href={`/courier/jobs/${job.id}`}>
                <div className="bg-surface-white rounded-xl shadow-header overflow-hidden active:scale-[0.98] transition-transform">
                  <div className="p-md space-y-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-text-secondary text-body-sm mb-base">Tujuan Pengiriman</p>
                        <h4 className="font-semibold text-title-md leading-tight">{job.dropAddress}</h4>
                      </div>
                      <button className="bg-surface-container p-xs rounded-lg active:scale-90 transition-transform">
                        <span className="material-symbols-outlined text-primary">directions</span>
                      </button>
                    </div>

                    {/* Progress stepper */}
                    <div className="flex items-center justify-between relative px-2">
                      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border-muted -translate-y-1/2 z-0" />
                      <div className="absolute top-1/2 left-0 w-1/2 h-0.5 bg-primary -translate-y-1/2 z-0" />
                      {['check', 'check', 'radio_button_checked', 'circle'].map((icon, i) => (
                        <div
                          key={i}
                          className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                            i < 2 ? 'bg-primary' : i === 2 ? 'bg-surface-white border-2 border-primary' : 'bg-surface-white border-2 border-border-muted'
                          }`}
                        >
                          {i < 2 && <span className="material-symbols-outlined text-white text-[14px]">{icon}</span>}
                          {i === 2 && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase px-1">
                      <span>Pesan</span><span>Pick Up</span>
                      <span className="text-primary">Antar</span><span>Selesai</span>
                    </div>

                    <div className="bg-surface-container-low p-md flex items-center justify-between border-t border-border-muted -mx-md -mb-md rounded-b-xl">
                      <div className="flex items-center gap-sm">
                        <div className="w-10 h-10 rounded-lg bg-surface-white border border-border-muted flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant">package_2</span>
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface text-body-lg">{job.order.shop.name}</p>
                          <p className="text-body-sm text-text-secondary">{job.order.shop.market?.name}</p>
                        </div>
                      </div>
                      <span className="font-bold text-headline-sm text-primary">Rp 15.000</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}

        {/* Available Jobs */}
        <section className="space-y-sm">
          <h3 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Job Tersedia ({availableJobs})
          </h3>
          {availableJobs === 0 ? (
            <div className="text-center py-xl bg-surface-white rounded-xl card-shadow">
              <span className="material-symbols-outlined text-[40px] text-outline opacity-40">moped</span>
              <p className="text-body-sm text-text-secondary mt-xs">Belum ada job tersedia</p>
            </div>
          ) : (
            <Link href="/courier/jobs">
              <div className="bg-surface-white p-md rounded-xl card-shadow border border-border-muted active:scale-[0.98] transition-transform">
                <div className="flex justify-between items-start mb-md">
                  <div className="flex gap-sm">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">storefront</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-title-md">Job Tersedia</h4>
                      <p className="text-body-sm text-text-secondary">Tap untuk lihat semua</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-headline-sm text-primary">Rp 15.000</p>
                    <p className="text-[11px] font-bold text-text-secondary">COD ONGKIR</p>
                  </div>
                </div>
                <button className="w-full bg-primary text-on-primary py-sm rounded-full font-bold text-label-bold active:scale-95 transition-all shadow-btn-primary">
                  LIHAT SEMUA JOB
                </button>
              </div>
            </Link>
          )}
        </section>
      </main>

    </div>
  )
}
