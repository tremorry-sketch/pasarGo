'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const DELIVERY_STATUS_LABEL: Record<string, string> = {
  AVAILABLE: 'Job Tersedia',
  ACCEPTED: 'Job Diterima',
  HEADING_TO_SELLER: 'Menuju Penjual',
  PICKED_UP: 'Barang Diambil',
  ON_DELIVERY: 'Dalam Pengiriman',
  DELIVERED: 'Terkirim',
}

const NEXT_ACTION: Record<string, string> = {
  ACCEPTED: 'Konfirmasi Menuju Penjual',
  HEADING_TO_SELLER: 'Konfirmasi Barang Diambil',
  PICKED_UP: 'Mulai Antar ke Pembeli',
  ON_DELIVERY: 'Konfirmasi Sudah Terkirim',
}

const STATUS_STEPS = ['ACCEPTED', 'HEADING_TO_SELLER', 'PICKED_UP', 'ON_DELIVERY', 'DELIVERED']
const STEP_LABELS = ['Terima', 'Pick Up', 'Antar', 'Selesai']

export default function CourierJobDetailPage() {
  const { id } = useParams()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await fetch(`/api/courier/jobs/${id}`)
    const data = await res.json()
    setJob(data)
  }

  useEffect(() => { load() }, [id])

  async function handleAccept() {
    setLoading(true)
    await fetch(`/api/courier/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ACCEPT' }),
    })
    await load()
    setLoading(false)
  }

  async function handleNext() {
    setLoading(true)
    await fetch(`/api/courier/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'NEXT' }),
    })
    await load()
    setLoading(false)
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="material-symbols-outlined text-primary animate-spin text-[32px]">refresh</span>
      </div>
    )
  }

  const isMine = !!job.courierId
  const isDelivered = job.status === 'DELIVERED'
  const nextAction = NEXT_ACTION[job.status]
  const currentStepIdx = STATUS_STEPS.indexOf(job.status)

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex items-center gap-md px-margin-mobile py-sm bg-surface shadow-header">
        <Link href="/courier/jobs" className="material-symbols-outlined text-primary active:scale-95 transition-transform">
          arrow_back
        </Link>
        <h1 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Detail Job
        </h1>
      </header>

      <main className="pt-20 pb-32 px-margin-mobile space-y-md">
        {/* Status Card */}
        <section className={`rounded-xl p-md card-shadow text-center mt-md ${isDelivered ? 'bg-primary-fixed/30' : 'bg-surface-white'}`}>
          <span
            className={`material-symbols-outlined text-[40px] mb-xs ${isDelivered ? 'text-primary' : 'text-status-reviewing'}`}
            style={{ fontVariationSettings: isDelivered ? "'FILL' 1" : "'FILL' 0" }}
          >
            {isDelivered ? 'task_alt' : 'moped'}
          </span>
          <p className="font-bold text-title-md text-on-surface">{DELIVERY_STATUS_LABEL[job.status] ?? job.status}</p>
          <p className="text-body-sm text-text-secondary">Order #{job.order?.orderNumber}</p>
        </section>

        {/* Progress Stepper (if accepted) */}
        {isMine && (
          <section className="bg-surface-white rounded-xl card-shadow p-md">
            <div className="flex items-center justify-between relative px-2 mb-sm">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border-muted -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all"
                style={{ width: `${Math.max(0, (currentStepIdx / (STATUS_STEPS.length - 1))) * 100}%` }}
              />
              {STATUS_STEPS.map((step, i) => {
                const done = i < currentStepIdx
                const active = i === currentStepIdx
                return (
                  <div
                    key={step}
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                      done ? 'bg-primary' : active ? 'bg-surface-white border-2 border-primary' : 'bg-surface-white border-2 border-border-muted'
                    }`}
                  >
                    {done && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                    {active && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase px-1">
              {STEP_LABELS.map((l) => <span key={l}>{l}</span>)}
            </div>
          </section>
        )}

        {/* Pickup Info */}
        <section className="bg-surface-white rounded-xl card-shadow p-md space-y-md">
          <div>
            <p className="font-bold text-label-bold text-text-secondary uppercase tracking-wider text-[10px] mb-sm">Ambil Dari</p>
            <div className="flex items-start gap-md">
              <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">storefront</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-body-lg">{job.order?.shop?.name}</p>
                <p className="text-body-sm text-text-secondary">{job.order?.shop?.market?.name}</p>
                <p className="text-body-sm text-text-secondary">{job.order?.shop?.market?.address}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Drop Info */}
        <section className="bg-surface-white rounded-xl card-shadow p-md">
          <p className="font-bold text-label-bold text-text-secondary uppercase tracking-wider text-[10px] mb-sm">Antar Ke</p>
          <div className="flex items-start gap-md mb-md">
            <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-error">location_on</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-on-surface text-body-lg">{job.order?.buyer?.name}</p>
              <p className="text-body-sm text-text-secondary">{job.dropAddress}</p>
              {job.order?.buyer?.phone && (
                <a href={`https://wa.me/${job.order.buyer.phone}`} className="flex items-center gap-xs text-primary font-bold text-label-bold mt-xs">
                  <span className="material-symbols-outlined text-[16px]">phone</span>
                  {job.order.buyer.phone}
                </a>
              )}
            </div>
          </div>
          <div className="bg-surface-container-low p-sm rounded-xl flex items-center gap-md">
            <span className="material-symbols-outlined text-on-surface-variant">inventory_2</span>
            <p className="text-body-sm text-on-surface">{job.order?.items?.length} item produk pasar</p>
          </div>
          {job.order?.deliveryNote && (
            <p className="text-body-sm text-secondary mt-sm">Catatan: {job.order.deliveryNote}</p>
          )}
        </section>

        {/* Earnings */}
        <section className="bg-surface-white rounded-xl card-shadow p-md flex items-center justify-between">
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 bg-primary-fixed/30 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">payments</span>
            </div>
            <p className="font-semibold text-title-md">Ongkir</p>
          </div>
          <p className="font-bold text-headline-sm text-primary" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Rp 15.000
          </p>
        </section>

        {/* Actions */}
        {!isMine && job.status === 'AVAILABLE' && (
          <Button fullWidth size="xl" loading={loading} onClick={handleAccept}>
            Ambil Job Ini
          </Button>
        )}

        {isMine && nextAction && !isDelivered && (
          <Button fullWidth size="xl" loading={loading} onClick={handleNext}>
            {nextAction}
          </Button>
        )}

        {isDelivered && (
          <div className="bg-primary-fixed/30 rounded-xl p-lg text-center">
            <span className="material-symbols-outlined text-[48px] text-primary mb-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              task_alt
            </span>
            <p className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Pengiriman Selesai!
            </p>
            <p className="text-body-sm text-text-secondary mt-xs">Terima kasih sudah mengantar dengan baik.</p>
          </div>
        )}
      </main>
    </div>
  )
}
