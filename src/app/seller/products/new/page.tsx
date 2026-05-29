'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Category } from '@/types'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({ name: '', categoryId: '', price: '', unit: 'kg', stock: '', description: '', minOrder: '0.25' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/seller/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock), minOrder: Number(form.minOrder) }),
    })

    if (res.ok) {
      router.push('/seller/products')
    } else {
      const data = await res.json()
      setError(data.error || 'Gagal menambah produk')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex items-center gap-md px-margin-mobile py-sm bg-surface shadow-header">
        <Link href="/seller/products" className="material-symbols-outlined text-primary active:scale-95 transition-transform">
          arrow_back
        </Link>
        <h1 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Tambah Produk
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="pt-20 pb-32 px-margin-mobile space-y-md">
        <Input
          label="Nama Produk"
          placeholder="Contoh: Bayam Segar"
          icon="shopping_basket"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        {/* Category */}
        <div>
          <p className="font-bold text-label-bold text-text-secondary uppercase tracking-wider text-[10px] mb-sm">Kategori</p>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">
              category
            </span>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full rounded-xl border border-border-muted bg-surface-white pl-[48px] pr-md py-md text-body-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="">Pilih kategori...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-md">
          <Input
            label="Harga (Rp)"
            type="number"
            placeholder="15000"
            icon="payments"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          {/* Unit */}
          <div>
            <p className="font-bold text-label-bold text-text-secondary uppercase tracking-wider text-[10px] mb-sm">Satuan</p>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full rounded-xl border border-border-muted bg-surface-white px-md py-md text-body-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {['kg', 'gram', 'ikat', 'buah', 'liter', 'pcs', 'bungkus', 'sisir'].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-md">
          <Input
            label="Stok"
            type="number"
            placeholder="10"
            icon="inventory_2"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <Input
            label="Min. Order"
            type="number"
            placeholder="0.25"
            icon="remove_shopping_cart"
            value={form.minOrder}
            onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
            step="0.25"
          />
        </div>

        {/* Description */}
        <div>
          <p className="font-bold text-label-bold text-text-secondary uppercase tracking-wider text-[10px] mb-sm">Deskripsi (opsional)</p>
          <textarea
            rows={3}
            placeholder="Keterangan produk..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl border border-border-muted bg-surface-white px-md py-md text-body-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {error && (
          <div className="bg-error-container rounded-xl p-md flex items-center gap-md">
            <span className="material-symbols-outlined text-error text-[20px]">error</span>
            <p className="text-body-sm text-error font-bold">{error}</p>
          </div>
        )}

        <Button type="submit" fullWidth size="xl" loading={loading}>
          Simpan Produk
        </Button>
      </form>
    </div>
  )
}
