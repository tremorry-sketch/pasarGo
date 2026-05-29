'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Role } from '@/types'

interface NavItem {
  href: string
  label: string
  icon: string // Material Symbol name
}

const BUYER_NAV: NavItem[] = [
  { href: '/buyer', label: 'Home', icon: 'home' },
  { href: '/markets', label: 'Markets', icon: 'storefront' },
  { href: '/buyer/cart', label: 'Cart', icon: 'shopping_cart' },
  { href: '/buyer/orders', label: 'Orders', icon: 'receipt_long' },
  { href: '/buyer/profile', label: 'Profile', icon: 'person' },
]

const SELLER_NAV: NavItem[] = [
  { href: '/seller', label: 'Dashboard', icon: 'home' },
  { href: '/seller/orders', label: 'Pesanan', icon: 'receipt_long' },
  { href: '/seller/products', label: 'Produk', icon: 'inventory_2' },
  { href: '/seller/profile', label: 'Profil', icon: 'person' },
]

const COURIER_NAV: NavItem[] = [
  { href: '/courier', label: 'Dashboard', icon: 'home' },
  { href: '/courier/jobs', label: 'Job', icon: 'moped' },
  { href: '/courier/history', label: 'Riwayat', icon: 'history' },
  { href: '/courier/profile', label: 'Profil', icon: 'person' },
]

const ADMIN_NAV: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/orders', label: 'Order', icon: 'receipt_long' },
  { href: '/admin/markets', label: 'Pasar', icon: 'storefront' },
  { href: '/admin/reports', label: 'Laporan', icon: 'bar_chart' },
]

const NAV_MAP: Record<Role, NavItem[]> = {
  BUYER: BUYER_NAV,
  SELLER: SELLER_NAV,
  COURIER: COURIER_NAV,
  ADMIN: ADMIN_NAV,
}

export function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname()
  const items = NAV_MAP[role]

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-around items-center px-xs pb-6 pt-2 bg-surface-white shadow-bottom-nav rounded-t-xl border-t border-border-muted">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90',
              isActive
                ? 'text-[#006b2d] bg-[#e6f1e7] rounded-full px-4 py-1'
                : 'text-[#66736B]'
            )}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold tracking-wide leading-none">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
