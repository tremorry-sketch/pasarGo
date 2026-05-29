'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch('/api/seller/products')
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/seller/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    await load()
  }

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
        <h1 className="font-bold text-headline-sm text-on-surface" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Kelola Produk
        </h1>
        <Link
          href="/seller/products/new"
          className="flex items-center gap-xs bg-primary text-on-primary px-md py-xs rounded-full font-bold text-label-bold squishy-btn shadow-btn-primary"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tambah
        </Link>
      </header>

      <main className="pt-20 pb-28 px-margin-mobile space-y-md">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-xl text-center">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-lg">
              <span className="material-symbols-outlined text-[48px] text-outline">inventory_2</span>
            </div>
            <h2 className="font-bold text-headline-sm text-on-surface mb-xs" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Belum Ada Produk
            </h2>
            <p className="text-body-sm text-text-secondary mb-lg">Tambah produk pertama kamu</p>
            <Link
              href="/seller/products/new"
              className="bg-primary text-on-primary px-xl py-md rounded-full font-bold text-label-bold shadow-btn-primary squishy-btn"
            >
              Tambah Produk
            </Link>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className={`bg-surface-white rounded-xl card-shadow border border-border-muted p-md ${!product.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-md">
                <div className="w-16 h-16 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary opacity-60 text-[28px]">
                    {product.category?.name?.toLowerCase().includes('sayur') ? 'eco' :
                     product.category?.name?.toLowerCase().includes('ikan') ? 'set_meal' :
                     product.category?.name?.toLowerCase().includes('ayam') ? 'egg' : 'shopping_basket'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-xs mb-base">
                    <p className="font-bold text-on-surface text-body-lg">{product.name}</p>
                    {!product.isActive && (
                      <span className="text-[10px] font-bold bg-surface-container text-text-secondary px-xs py-base rounded-full">
                        NONAKTIF
                      </span>
                    )}
                  </div>
                  <p className="text-body-sm text-text-secondary">{product.category?.name}</p>
                  <div className="flex items-center gap-md mt-xs">
                    <p className="font-bold text-primary text-label-bold">
                      {formatCurrency(product.price)}/{product.unit}
                    </p>
                    <p className="text-body-sm text-text-secondary">Stok: {product.stock}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(product.id, product.isActive)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    product.isActive
                      ? 'bg-primary-fixed/30 text-primary'
                      : 'bg-surface-container text-outline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]" style={product.isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {product.isActive ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}
