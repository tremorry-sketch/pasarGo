'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const router = useRouter()

  async function handleAdd() {
    setLoading(true)
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 }),
    })
    setLoading(false)
    if (res.status === 401) {
      router.push('/login')
      return
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="mt-md w-full bg-primary text-white py-sm rounded-xl font-bold text-label-bold squishy-btn flex items-center justify-center gap-base shadow-lg shadow-primary/20 disabled:opacity-60"
    >
      {added ? (
        <>
          <span className="material-symbols-outlined text-[20px]">check</span>
          Ditambah!
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[20px]">{loading ? 'hourglass_empty' : 'add'}</span>
          Tambah
        </>
      )}
    </button>
  )
}
