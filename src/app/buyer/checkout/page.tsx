'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import type { CartItem } from '@/types'

const STOCK_EMPTY_OPTIONS = [
  { value: 'CONTACT', label: 'Hubungi saya dulu', icon: 'chat' },
  { value: 'REPLACE', label: 'Ganti dengan barang serupa', icon: 'swap_horiz' },
  { value: 'CANCEL_ITEM', label: 'Batalkan item itu saja', icon: 'remove_circle' },
]

const PAYMENT_OPTIONS = [
  { value: 'COD', label: 'Bayar di Tempat (COD)', icon: 'payments' },
  { value: 'MANUAL_TRANSFER', label: 'Transfer Manual', icon: 'account_balance' },
]

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shopId = searchParams.get('shopId') ?? ''

  const [items, setItems] = useState<CartItem[]>([])
  const [form, setForm] = useState({
    deliveryAddress: '',
    deliveryNote: '',
    buyerNote: '',
    ifStockEmpty: 'CONTACT',
    paymentMethod: 'COD',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/cart').then(r => r.json()).then((data) => {
      const shopItems = (data.items ?? []).filter((i: CartItem) => i.product.shopId === shopId)
      setItems(shopItems)
    })
  }, [shopId])

  const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0)
  const deliveryFee = 15000
  const total = subtotal + deliveryFee

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!form.deliveryAddress) return
    setLoading(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId, ...form }),
    })
    if (res.ok) {
      const order = await res.json()
      router.push(`/buyer/orders/${order.id}`)
    } else {
      alert('Gagal membuat pesanan. Coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex items-center gap-md px-margin-mobile py-sm bg-surface shadow-header">
        <Link href="/buyer/cart" className="material-symbols-outlined text-primary active:scale-95 transition-transform">
          arrow_back
        </Link>
        <h1 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Checkout
        </h1>
      </header>

      <form onSubmit={handleCheckout} className="pt-20 pb-32 px-margin-mobile space-y-lg">
        {/* Order Summary */}
        <section className="bg-surface-white rounded-xl card-shadow p-md border-l-[5px] border-primary mt-lg">
          <h2 className="font-semibold text-title-md mb-md">Ringkasan Belanja</h2>
          <div className="space-y-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-body-sm">
                <span className="text-text-secondary">{item.product.name} × {item.quantity} {item.product.unit}</span>
                <span className="font-bold text-on-surface">{formatCurrency(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border-muted mt-md pt-md space-y-xs">
            <div className="flex justify-between text-body-sm text-text-secondary">
              <span>Ongkir</span><span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-body-lg">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </section>

        {/* Delivery Address */}
        <section className="bg-surface-white rounded-xl card-shadow p-md">
          <div className="flex items-center gap-xs mb-md">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <h2 className="font-semibold text-title-md">Alamat Pengiriman</h2>
          </div>
          <div className="space-y-md">
            <div>
              <label className="block font-bold text-body-sm text-on-surface mb-xs">
                Alamat Lengkap <span className="text-error">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Tulis alamat lengkap termasuk nomor rumah dan patokan"
                value={form.deliveryAddress}
                onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                className="w-full rounded-xl border border-border-muted bg-background-off-white px-md py-sm text-body-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <Input
              label="Catatan Pengiriman (opsional)"
              placeholder="Contoh: Titip di pos satpam"
              value={form.deliveryNote}
              onChange={(e) => setForm({ ...form, deliveryNote: e.target.value })}
            />
            <Input
              label="Catatan untuk Penjual (opsional)"
              placeholder="Contoh: Bayam jangan yang layu"
              value={form.buyerNote}
              onChange={(e) => setForm({ ...form, buyerNote: e.target.value })}
            />
          </div>
        </section>

        {/* If stock empty */}
        <section className="bg-surface-white rounded-xl card-shadow p-md">
          <div className="flex items-center gap-xs mb-md">
            <span className="material-symbols-outlined text-primary">help_outline</span>
            <h2 className="font-semibold text-title-md">Jika Stok Kosong</h2>
          </div>
          <div className="space-y-sm">
            {STOCK_EMPTY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-md p-md rounded-xl border-2 cursor-pointer transition-colors ${
                  form.ifStockEmpty === opt.value
                    ? 'border-primary bg-primary-fixed/20'
                    : 'border-border-muted bg-background-off-white'
                }`}
              >
                <input
                  type="radio"
                  name="ifStockEmpty"
                  value={opt.value}
                  checked={form.ifStockEmpty === opt.value}
                  onChange={() => setForm({ ...form, ifStockEmpty: opt.value })}
                  className="hidden"
                />
                <span className={`material-symbols-outlined ${form.ifStockEmpty === opt.value ? 'text-primary' : 'text-outline'}`}>
                  {opt.icon}
                </span>
                <span className={`font-bold text-body-lg ${form.ifStockEmpty === opt.value ? 'text-primary' : 'text-on-surface'}`}>
                  {opt.label}
                </span>
                {form.ifStockEmpty === opt.value && (
                  <span className="material-symbols-outlined text-primary ml-auto" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                )}
              </label>
            ))}
          </div>
        </section>

        {/* Payment Method */}
        <section className="bg-surface-white rounded-xl card-shadow p-md">
          <div className="flex items-center gap-xs mb-md">
            <span className="material-symbols-outlined text-primary">payments</span>
            <h2 className="font-semibold text-title-md">Metode Pembayaran</h2>
          </div>
          <div className="space-y-sm">
            {PAYMENT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-md p-md rounded-xl border-2 cursor-pointer transition-colors ${
                  form.paymentMethod === opt.value
                    ? 'border-primary bg-primary-fixed/20'
                    : 'border-border-muted bg-background-off-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={opt.value}
                  checked={form.paymentMethod === opt.value}
                  onChange={() => setForm({ ...form, paymentMethod: opt.value })}
                  className="hidden"
                />
                <span className={`material-symbols-outlined ${form.paymentMethod === opt.value ? 'text-primary' : 'text-outline'}`}>
                  {opt.icon}
                </span>
                <span className={`font-bold text-body-lg ${form.paymentMethod === opt.value ? 'text-primary' : 'text-on-surface'}`}>
                  {opt.label}
                </span>
                {form.paymentMethod === opt.value && (
                  <span className="material-symbols-outlined text-primary ml-auto" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                )}
              </label>
            ))}
          </div>
        </section>
      </form>

      {/* Sticky Submit */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface-white border-t border-border-muted px-margin-mobile py-md shadow-bottom-nav">
        <Button
          type="submit"
          fullWidth
          size="xl"
          loading={loading}
          onClick={(e) => handleCheckout(e as any)}
        >
          Pesan Sekarang — {formatCurrency(total)}
        </Button>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-background"><span className="material-symbols-outlined animate-spin text-primary text-[32px]">refresh</span></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
