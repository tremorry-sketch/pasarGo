'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import type { CartItem } from '@/types'

export default function CartPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [address] = useState('Jl. Melati No. 42, RT 05/02, Kebayoran Baru, Jakarta Selatan')

  async function loadCart() {
    const res = await fetch('/api/cart')
    const data = await res.json()
    setItems(data.items ?? [])
    setLoading(false)
  }

  useEffect(() => { loadCart() }, [])

  async function updateQty(productId: string, quantity: number) {
    if (quantity <= 0) {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
    } else {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      })
    }
    await loadCart()
  }

  const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0)
  const deliveryFee = 15000
  const total = subtotal + deliveryFee
  const shopId = items[0]?.product?.shopId

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="material-symbols-outlined text-primary animate-spin text-[32px]">refresh</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface shadow-header">
        <div className="flex items-center gap-xs">
          <button
            onClick={() => router.back()}
            className="material-symbols-outlined text-primary active:scale-95 transition-transform"
          >
            arrow_back
          </button>
          <h1 className="font-bold text-headline-sm text-primary" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Keranjang
          </h1>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-surface-container-low p-2 rounded-full">
          delete_sweep
        </span>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-32 pb-32 px-margin-mobile text-center">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-lg">
            <span className="material-symbols-outlined text-[48px] text-outline">shopping_basket</span>
          </div>
          <h2 className="font-bold text-headline-sm text-on-surface mb-xs" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Keranjang Kosong
          </h2>
          <p className="text-body-sm text-text-secondary mb-lg">Yuk pilih produk segar dari pasar!</p>
          <Link
            href="/markets"
            className="bg-primary text-on-primary px-xl py-md rounded-full font-bold text-label-bold shadow-btn-primary squishy-btn"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <main className="pt-20 pb-40 px-margin-mobile space-y-lg">
          {/* Delivery Address */}
          <section className="bg-surface-white rounded-xl p-md card-shadow border-l-[5px] border-primary mt-lg">
            <div className="flex justify-between items-start mb-sm">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <h2 className="font-semibold text-title-md">Alamat Pengiriman</h2>
              </div>
              <button className="text-primary font-bold text-label-bold">GANTI</button>
            </div>
            <p className="font-bold text-body-lg text-on-surface">Rumah Utama</p>
            <p className="text-body-sm text-text-secondary leading-relaxed mt-base">{address}</p>
          </section>

          {/* Cart Items */}
          <section className="space-y-sm">
            <h2 className="font-semibold text-title-md px-base">Item di keranjang</h2>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-md bg-surface-white p-md rounded-xl card-shadow items-center"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[36px] text-primary opacity-50">shopping_basket</span>
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-title-md text-on-surface">{item.product.name}</h3>
                  <p className="text-body-sm text-text-secondary mb-xs">
                    {item.quantity} {item.product.unit}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-label-bold text-primary">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                    <div className="flex items-center gap-sm bg-surface-container rounded-full px-sm py-xs">
                      <button
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="material-symbols-outlined text-[18px] text-primary"
                      >
                        {item.quantity <= 1 ? 'delete' : 'remove'}
                      </button>
                      <span className="font-bold text-label-bold min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                        className="material-symbols-outlined text-[18px] text-primary"
                      >
                        add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Order Summary */}
          <section className="bg-surface-white rounded-xl p-md card-shadow">
            <h2 className="font-semibold text-title-md mb-md">Ringkasan Pesanan</h2>
            <div className="space-y-sm">
              <div className="flex justify-between text-body-sm text-text-secondary">
                <span>Subtotal ({items.length} item)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-body-sm text-text-secondary">
                <span>Ongkir</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="border-t border-border-muted pt-sm flex justify-between font-bold text-body-lg text-on-surface">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Sticky Checkout Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface-white border-t border-border-muted px-margin-mobile py-md shadow-bottom-nav">
          <button
            onClick={() => router.push(`/buyer/checkout?shopId=${shopId}`)}
            className="w-full bg-primary text-on-primary py-md rounded-full font-bold text-headline-sm shadow-btn-primary squishy-btn flex items-center justify-between px-xl"
          >
            <span className="text-on-primary/80 text-body-sm">{formatCurrency(total)}</span>
            <span>Lanjut Checkout</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  )
}
