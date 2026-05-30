export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { AddToCartButton } from '@/components/buyer/add-to-cart-button'

export default async function MarketDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const market = await prisma.market.findUnique({
    where: { slug, isActive: true },
    include: {
      sellerShops: {
        where: { isActive: true },
        include: {
          products: {
            where: { isActive: true },
            include: { category: true },
          },
        },
      },
    },
  })

  if (!market) notFound()

  const allProducts = market.sellerShops.flatMap((shop) =>
    shop.products.map((p) => ({ ...p, shopName: shop.name, shopSlug: shop.slug }))
  )

  const categories = Array.from(new Set(allProducts.map((p) => p.category?.name).filter(Boolean)))

  return (
    <div className="min-h-screen bg-background text-on-surface pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface shadow-header">
        <div className="flex items-center gap-2">
          <Link href="/markets" className="material-symbols-outlined text-primary active:scale-95 transition-transform">
            arrow_back
          </Link>
          <div>
            <p className="font-bold text-[10px] text-text-secondary uppercase tracking-wider">Browsing</p>
            <h1 className="font-bold text-headline-sm text-primary" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              {market.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-xs">
          <button className="p-xs rounded-full hover:bg-surface-container-low transition-colors active:scale-95">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
          </button>
        </div>
      </header>

      <main className="pt-24 px-margin-mobile">
        {/* Search Bar */}
        <div className="mb-lg">
          <div className="flex items-center bg-surface-white border border-border-muted rounded-xl px-md py-sm shadow-sm">
            <span className="material-symbols-outlined text-outline mr-sm">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 w-full text-body-lg text-on-surface placeholder:text-outline-variant outline-none"
              placeholder="Cari produk segar..."
              type="text"
            />
          </div>
        </div>

        {/* Promo Banner */}
        <div className="relative overflow-hidden rounded-xl h-40 mb-lg card-shadow bg-primary-container">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary-container/60" />
          <div className="relative z-10 p-lg h-full flex flex-col justify-end bg-gradient-to-t from-primary/80 to-transparent">
            <p className="font-bold text-white uppercase text-[10px] mb-base tracking-wider">Pilihan Hari Ini</p>
            <h2 className="font-bold text-headline-md text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Produk Segar Pagi Ini
            </h2>
          </div>
        </div>

        {/* Category Chips */}
        <section className="mb-lg overflow-x-auto whitespace-nowrap no-scrollbar -mx-margin-mobile px-margin-mobile flex gap-sm py-base">
          <button className="px-lg py-sm rounded-full bg-primary-fixed text-on-primary-fixed-variant font-bold text-label-bold shadow-sm squishy-btn">
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-lg py-sm rounded-full bg-surface-white border border-border-muted font-bold text-label-bold text-on-surface-variant squishy-btn"
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Product Grid */}
        <section className="grid grid-cols-2 gap-gutter">
          {allProducts.map((product) => (
            <article
              key={product.id}
              className="bg-surface-white rounded-[18px] p-sm card-shadow flex flex-col h-full"
            >
              <div className="relative mb-sm h-32 w-full rounded-[12px] overflow-hidden bg-surface-container">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-primary opacity-40">shopping_basket</span>
                  </div>
                )}
                <div className="absolute top-xs right-xs bg-surface-container-low/90 backdrop-blur-sm px-xs py-base rounded-full text-[10px] font-bold text-primary">
                  Fresh
                </div>
              </div>
              <div className="flex-grow">
                <p className="text-text-secondary text-[12px]">{product.shopName}</p>
                <h3 className="font-semibold text-title-md text-on-surface leading-tight mb-xs">{product.name}</h3>
                <p className="font-bold text-primary text-[16px]">
                  {formatCurrency(product.price)}
                  <span className="text-[12px] font-normal text-text-secondary">/{product.unit}</span>
                </p>
              </div>
              <AddToCartButton productId={product.id} />
            </article>
          ))}

          {allProducts.length === 0 && (
            <div className="col-span-2 rounded-[18px] border-2 border-dashed border-border-muted flex flex-col items-center justify-center p-xl text-text-secondary">
              <span className="material-symbols-outlined text-[32px] opacity-30 mb-xs">more_horiz</span>
              <p className="text-body-sm text-center">Belum ada produk di pasar ini</p>
            </div>
          )}
        </section>
      </main>

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-36px)] max-w-md z-40">
        <Link
          href="/buyer/cart"
          className="w-full bg-status-done text-white rounded-full p-md flex items-center justify-between shadow-[0px_8px_24px_rgba(20,40,28,0.2)] squishy-btn transition-transform"
        >
          <div className="flex items-center gap-md">
            <div className="relative">
              <span className="material-symbols-outlined">shopping_basket</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-label-bold">Lihat Keranjang</p>
            </div>
          </div>
          <div className="flex items-center gap-xs font-bold uppercase tracking-wider text-[11px]">
            Buka
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
