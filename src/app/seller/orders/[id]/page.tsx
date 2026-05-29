'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/shared/order-status-badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, ORDER_STATUS_LABEL } from '@/lib/utils'
import type { Order } from '@/types'

const ACTION_LABELS: Record<string, string> = {
  PLACED: 'Konfirmasi Pesanan',
  SELLER_REVIEW: 'Setujui & Lanjut',
  SELLER_CONFIRMED: 'Mulai Packing',
  PACKING: 'Selesai Packing',
  READY_FOR_PICKUP: 'Request Kurir',
}

export default function SellerOrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/seller/orders/${id}`).then(r => r.json()).then(setOrder)
  }, [id])

  async function handleAction(action?: 'CANCEL') {
    setLoading(true)
    const res = await fetch(`/api/seller/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action === 'CANCEL' ? { action: 'CANCEL', cancelReason: 'Stok habis' } : {}),
    })
    if (res.ok) {
      const updated = await fetch(`/api/seller/orders/${id}`).then(r => r.json())
      setOrder(updated)
    }
    setLoading(false)
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="material-symbols-outlined text-primary animate-spin text-[32px]">refresh</span>
      </div>
    )
  }

  const actionLabel = ACTION_LABELS[order.status]

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex items-center gap-md px-margin-mobile py-sm bg-surface shadow-header">
        <Link href="/seller/orders" className="material-symbols-outlined text-primary active:scale-95 transition-transform">
          arrow_back
        </Link>
        <h1 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Order {order.orderNumber}
        </h1>
      </header>

      <main className="pt-20 pb-32 px-margin-mobile space-y-md">
        {/* Status Card */}
        <section className="bg-surface-white rounded-xl card-shadow border-l-[5px] border-status-reviewing p-md mt-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-body-sm text-text-secondary">Status</p>
              <p className="font-semibold text-title-md text-on-surface mt-base">
                {ORDER_STATUS_LABEL[order.status as keyof typeof ORDER_STATUS_LABEL] ?? order.status}
              </p>
            </div>
            <OrderStatusBadge status={order.status as any} />
          </div>
        </section>

        {/* Buyer Info */}
        {order.buyer && (
          <section className="bg-surface-white rounded-xl card-shadow p-md space-y-md">
            <h2 className="font-semibold text-title-md">Info Pembeli</h2>
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-body-lg">{order.buyer.name}</p>
                {order.buyer.phone && (
                  <a href={`https://wa.me/${order.buyer.phone}`} className="flex items-center gap-xs text-primary text-body-sm font-bold">
                    <span className="material-symbols-outlined text-[16px]">phone</span>
                    {order.buyer.phone}
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-start gap-md pt-md border-t border-border-muted">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <p className="text-body-sm text-text-secondary">{order.deliveryAddress}</p>
            </div>
            {order.buyerNote && (
              <div className="flex items-start gap-md bg-secondary-container/20 rounded-xl p-sm">
                <span className="material-symbols-outlined text-secondary text-[18px]">sticky_note_2</span>
                <p className="text-body-sm text-on-surface">Catatan: {order.buyerNote}</p>
              </div>
            )}
            {order.ifStockEmpty && (
              <p className="text-body-sm text-text-secondary">
                Jika stok kosong:{' '}
                <span className="font-bold text-on-surface">
                  {order.ifStockEmpty === 'CONTACT' ? 'Hubungi dulu' : order.ifStockEmpty === 'REPLACE' ? 'Ganti barang' : 'Batalkan item'}
                </span>
              </p>
            )}
          </section>
        )}

        {/* Items */}
        <section className="bg-surface-white rounded-xl card-shadow p-md">
          <h2 className="font-semibold text-title-md mb-md">Daftar Item</h2>
          <div className="space-y-md">
            {order.items?.map((item) => (
              <div key={item.id} className={`flex items-center gap-md ${item.isCancelled ? 'opacity-40' : ''}`}>
                <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary opacity-60">shopping_basket</span>
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-on-surface text-body-lg ${item.isCancelled ? 'line-through' : ''}`}>
                    {item.productName}
                  </p>
                  <p className="text-body-sm text-text-secondary">{item.quantity} {item.productUnit}</p>
                  {item.note && (
                    <p className="text-body-sm text-secondary">Catatan: {item.note}</p>
                  )}
                </div>
                <p className="font-bold text-primary text-label-bold">
                  {formatCurrency(item.priceAtOrder * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-border-muted mt-md pt-md flex justify-between items-center">
            <span className="font-bold text-body-lg text-on-surface">Total</span>
            <span className="font-bold text-headline-sm text-primary" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              {formatCurrency(order.total)}
            </span>
          </div>
        </section>

        {/* Actions */}
        {actionLabel && !['COMPLETED', 'CANCELLED', 'DELIVERED', 'ON_DELIVERY', 'PICKED_UP'].includes(order.status) && (
          <section className="space-y-md">
            <Button fullWidth size="xl" loading={loading} onClick={() => handleAction()}>
              {actionLabel}
            </Button>
            {order.status === 'PLACED' && (
              <Button fullWidth size="lg" variant="danger" loading={loading} onClick={() => handleAction('CANCEL')}>
                Tolak Pesanan
              </Button>
            )}
          </section>
        )}

        {['COMPLETED', 'DELIVERED'].includes(order.status) && (
          <div className="bg-primary-fixed/30 rounded-xl p-md text-center">
            <span className="material-symbols-outlined text-[36px] text-primary mb-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
              task_alt
            </span>
            <p className="font-bold text-on-surface text-body-lg">Pesanan Selesai!</p>
          </div>
        )}
      </main>
    </div>
  )
}
