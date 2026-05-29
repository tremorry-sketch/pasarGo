'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

export default function ShopDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [shop, setShop] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const shopRes = await fetch(`/api/shops/${slug}`)
      const shopData = await shopRes.json()
      setShop(shopData)

      const prodRes = await fetch(`/api/products?shopId=${shopData.id}`)
      const prodData = await prodRes.json()
      setProducts(prodData)

      const cartRes = await fetch('/api/cart')
      const cartData = await cartRes.json()
      const cartMap: Record<string, number> = {}
      for (const item of cartData.items ?? []) {
        cartMap[item.productId] = item.quantity
      }
      setCart(cartMap)
      setLoading(false)
    }
    load()
  }, [slug])

  async function updateCart(productId: string, quantity: number) {
    const newQty = Math.max(0, quantity)
    setCart((prev) => ({ ...prev, [productId]: newQty }))
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: newQty }),
    })
  }

  const cartCount = Object.values(cart).filter((q) => q > 0).length
  const cartTotal = products.reduce((acc, p) => acc + p.price * (cart[p.id] ?? 0), 0)

  if (loading || !shop) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="material-symbols-outlined text-primary animate-spin text-[32px]">refresh</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-32">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface shadow-header">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="material-symbols-outlined text-primary active:scale-95 transition-transform">
            arrow_back
          </button>
          <div>
            <p className="font-bold text-[10px] text-text-secondary uppercase tracking-wider">{shop.market?.name}</p>
            <h1 className="font-bold text-headline-sm text-primary" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              {shop.name}
            </h1>
          </div>
        </div>
        <Link href="/buyer/cart" className="p-xs rounded-full hover:bg-surface-container-low relative">
          <span className="material-symbols-outlined text-on-surface-variant">shopping_cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-on-secondary text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </header>

      <main className="pt-20 px-margin-mobile space-y-md">
        {/* Shop Info Card */}
        <div className="bg-surface-white rounded-xl card-shadow p-md flex items-center gap-md">
          <div className="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-[28px]">storefront</span>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-title-md text-on-surface">{shop.name}</h2>
            <p className="text-body-sm text-text-secondary">{shop.market?.name}</p>
            <div className="flex items-center gap-xs mt-xs">
              <span className="material-symbols-outlined text-[14px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="font-bold text-label-bold text-on-surface">{shop.rating?.toFixed(1)}</span>
              <span className="text-text-secondary text-body-sm">• {shop.totalOrders} pesanan</span>
            </div>
          </div>
          <div className="flex items-center gap-xs bg-primary-fixed/30 px-sm py-xs rounded-full">
            <span className="text-[10px] font-bold text-on-primary-fixed-variant">BUKA</span>
          </div>
        </div>

        {/* Products */}
        <section>
          <p className="font-bold text-label-bold text-text-secondary mb-sm uppercase tracking-wider">
            {products.length} Produk Tersedia
          </p>
          <div className="space-y-sm">
            {products.map((product) => {
              const qty = cart[product.id] ?? 0
              return (
                <div
                  key={product.id}
                  className="bg-surface-white rounded-xl card-shadow p-md flex items-center gap-md"
                >
                  <div className="w-16 h-16 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary opacity-60 text-[28px]">
                      {product.category?.name?.toLowerCase().includes('sayur') ? 'eco' :
                       product.category?.name?.toLowerCase().includes('ikan') ? 'set_meal' :
                       product.category?.name?.toLowerCase().includes('ayam') ? 'egg' : 'shopping_basket'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-on-surface text-body-lg">{product.name}</p>
                    <p className="text-body-sm text-text-secondary">{product.category?.name}</p>
                    <p className="font-bold text-primary mt-xs">
                      {formatCurrency(product.price)}<span className="font-normal text-text-secondary text-body-sm">/{product.unit}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-xs flex-shrink-0">
                    {qty > 0 ? (
                      <>
                        <button
                          onClick={() => updateCart(product.id, qty - 1)}
                          className="w-8 h-8 bg-surface-container rounded-full flex items-center justify-center active:scale-90"
                        >
                          <span className="material-symbols-outlined text-[18px] text-primary">remove</span>
                        </button>
                        <span className="font-bold text-label-bold w-6 text-center">{qty}</span>
                        <button
                          onClick={() => updateCart(product.id, qty + 1)}
                          className="w-8 h-8 bg-primary rounded-full flex items-center justify-center active:scale-90"
                        >
                          <span className="material-symbols-outlined text-[18px] text-on-primary">add</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => updateCart(product.id, 1)}
                        className="flex items-center gap-xs bg-primary text-on-primary px-md py-xs rounded-full font-bold text-label-bold squishy-btn shadow-btn-primary"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Tambah
                      </button>
                    )}
                  </div>
                </div>
              )
            })}

            {products.length === 0 && (
              <div className="text-center py-xl bg-surface-white rounded-xl card-shadow">
                <span className="material-symbols-outlined text-[40px] text-outline opacity-40">inventory_2</span>
                <p className="text-body-sm text-text-secondary mt-xs">Belum ada produk di toko ini</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-36px)] max-w-md z-40">
          <Link
            href="/buyer/cart"
            className="w-full bg-status-done text-white rounded-full p-md flex items-center justify-between shadow-[0px_8px_24px_rgba(20,40,28,0.2)] squishy-btn"
          >
            <div className="flex items-center gap-md">
              <div className="relative">
                <span className="material-symbols-outlined">shopping_basket</span>
                <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div>
                <p className="font-bold text-label-bold">{cartCount} Item di Keranjang</p>
                <p className="text-body-sm opacity-70">{formatCurrency(cartTotal)}</p>
              </div>
            </div>
            <div className="flex items-center gap-xs font-bold uppercase tracking-wider text-[11px]">
              Lihat <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
