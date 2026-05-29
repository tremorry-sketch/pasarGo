'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email atau password salah')
      setLoading(false)
      return
    }

    const res = await fetch('/api/auth/session')
    const session = await res.json()
    const role = session?.user?.role

    const roleRedirect: Record<string, string> = {
      BUYER: '/buyer',
      SELLER: '/seller',
      COURIER: '/courier',
      ADMIN: '/admin',
    }

    router.push(roleRedirect[role] ?? '/')
  }

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
          Selamat Datang
        </h1>
        <p className="text-on-primary/80 text-body-sm mt-xs">Masuk ke akun PasarGo kamu</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-margin-mobile py-xl bg-surface">
        <form onSubmit={handleSubmit} className="space-y-md">
          <Input
            label="Email"
            type="email"
            placeholder="contoh@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="email"
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon="lock"
            required
          />

          {error && (
            <div className="bg-error-container border border-error rounded-xl p-sm text-body-sm text-error">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-sm">
            Masuk
          </Button>
        </form>

        <p className="text-center text-body-sm text-text-secondary mt-lg">
          Belum punya akun?{' '}
          <Link href="/register" className="text-primary font-bold">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
