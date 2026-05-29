export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function CourierJobsPage({ searchParams }: { searchParams: Promise<{ mine?: string }> }) {
  const session = await auth()
  const sp = await searchParams
  const isMine = sp.mine === '1'

  const jobs = await prisma.delivery.findMany({
    where: isMine
      ? { courierId: session!.user.id, status: { notIn: ['DELIVERED'] } }
      : { status: 'AVAILABLE', courierId: null },
    include: {
      order: {
        include: {
          buyer: { select: { name: true } },
          shop: { include: { market: true } },
          items: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface shadow-header">
        <h1 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          {isMine ? 'Job Aktif Saya' : 'Job Tersedia'}
        </h1>
      </header>

      {/* Toggle Tabs */}
      <div className="fixed top-[52px] left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 flex gap-xs px-margin-mobile py-sm bg-surface border-b border-border-muted">
        <Link
          href="/courier/jobs"
          className={`flex-1 py-sm rounded-full font-bold text-label-bold text-center transition-colors ${
            !isMine ? 'bg-primary text-on-primary shadow-btn-primary' : 'bg-surface-white border border-border-muted text-on-surface-variant'
          }`}
        >
          Tersedia ({isMine ? '?' : jobs.length})
        </Link>
        <Link
          href="/courier/jobs?mine=1"
          className={`flex-1 py-sm rounded-full font-bold text-label-bold text-center transition-colors ${
            isMine ? 'bg-primary text-on-primary shadow-btn-primary' : 'bg-surface-white border border-border-muted text-on-surface-variant'
          }`}
        >
          Job Saya
        </Link>
      </div>

      <main className="pt-32 pb-28 px-margin-mobile space-y-md">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-xl text-center">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-lg">
              <span className="material-symbols-outlined text-[40px] text-outline">moped</span>
            </div>
            <p className="text-body-sm text-text-secondary">
              {isMine ? 'Tidak ada job aktif' : 'Belum ada job tersedia'}
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <Link key={job.id} href={`/courier/jobs/${job.id}`}>
              <div className="bg-surface-white p-md rounded-xl card-shadow border border-border-muted active:scale-[0.98] transition-transform">
                <div className="flex justify-between items-start mb-md">
                  <div className="flex gap-sm">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">storefront</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-title-md">{job.order.shop.name}</h4>
                      <p className="text-body-sm text-text-secondary">{job.order.shop.market?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-headline-sm text-primary">Rp 15.000</p>
                    <p className="text-[11px] font-bold text-text-secondary">COD ONGKIR</p>
                  </div>
                </div>

                <div className="flex items-center gap-gutter py-sm border-y border-border-muted mb-md">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-text-secondary text-[18px]">location_on</span>
                    <span className="text-body-sm font-bold text-on-surface truncate max-w-[160px]">{job.dropAddress}</span>
                  </div>
                  <div className="flex items-center gap-xs ml-auto">
                    <span className="material-symbols-outlined text-text-secondary text-[18px]">inventory_2</span>
                    <span className="text-body-sm font-bold">{job.order.items.length} item</span>
                  </div>
                </div>

                <div className="w-full bg-primary text-on-primary py-sm rounded-full font-bold text-label-bold flex items-center justify-center gap-xs shadow-btn-primary">
                  {isMine ? 'Update Status' : 'AMBIL JOB'}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </main>
    </div>
  )
}
