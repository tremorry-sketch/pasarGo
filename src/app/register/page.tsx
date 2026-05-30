'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Role } from '@/types'

const ROLES = [
  { value: 'BUYER', label: 'Pembeli', icon: 'shopping_basket' },
  { value: 'SELLER', label: 'Penjual', icon: 'storefront' },
  { value: 'COURIER', label: 'Kurir', icon: 'moped' },
]

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = (searchParams.get('role') as Role) || 'BUYER'

  const [role, setRole] = useState<string>(defaultRole)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Password tidak cocok')
      return
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Gagal mendaftar')
      setLoading(false)
      return
    }

    router.push('/login?registered=1')
  }

  return (
    <div className="flex-1 px-margin-mobile py-lg bg-surface">
      {/* Role Selector */}
      <div className="mb-lg">
        <p className="font-bold text-body-sm text-on-surface mb-sm">Daftar sebagai:</p>
        <div className="flex gap-sm">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={cn(
                'flex-1 flex flex-col items-center gap-xs py-md rounded-xl border-2 transition-all font-bold text-label-bold',
                role === r.value
                  ? 'border-primary bg-primary-fixed/30 text-primary'
                  : 'border-border-muted text-text-secondary bg-surface-white'
              )}
            >
              <span className="material-symbols-outlined text-[22px]" style={role === r.value ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {r.icon}
              </span>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-md">
        <Input label="Nama Lengkap" placeholder="Nama kamu" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} icon="person" required />
        <Input label="Email" type="email" placeholder="contoh@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} icon="email" required />
        <Input label="No. WhatsApp" type="tel" placeholder="08xxxxxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} icon="phone" />
        <Input label="Password" type="password" placeholder="Min. 6 karakter" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} icon="lock" required />
        <Input label="Konfirmasi Password" type="password" placeholder="Ulangi password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} icon="lock" required />

        {error && (
          <div className="bg-error-container border border-error/20 rounded-xl p-sm text-body-sm text-error">
            {error}
          </div>
        )}

        <Button type="submit" fullWidth size="lg" loading={loading} className="mt-sm">
          Daftar Sekarang
        </Button>
      </form>

      <p className="text-center text-body-sm text-text-secondary mt-lg">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-primary font-bold">Masuk</Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary px-margin-mobile pt-12 pb-xl text-on-primary text-center">
        <div className="flex justify-center mb-md">
          <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[40px] text-on-primary">eco</span>
          </div>
        </div>
        <h1 className="font-bold text-display-lg-mobile" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Buat Akun
        </h1>
        <p className="text-on-primary/80 text-body-sm mt-xs">Bergabung dengan PasarGo</p>
      </div>

      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><span className="material-symbols-outlined animate-spin text-primary">refresh</span></div>}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
