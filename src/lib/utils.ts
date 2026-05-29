import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { OrderStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateOrderNumber(): string {
  const date = new Date()
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `PSR-${ymd}-${rand}`
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  DRAFT: 'Draft',
  PLACED: 'Pesanan Masuk',
  SELLER_REVIEW: 'Dikonfirmasi Penjual',
  SELLER_CONFIRMED: 'Dikonfirmasi',
  PACKING: 'Sedang Dikemas',
  READY_FOR_PICKUP: 'Siap Diambil',
  FINDING_COURIER: 'Mencari Kurir',
  COURIER_ASSIGNED: 'Kurir Ditugaskan',
  PICKED_UP: 'Barang Diambil Kurir',
  ON_DELIVERY: 'Dalam Pengiriman',
  DELIVERED: 'Terkirim',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
  DISPUTE: 'Dalam Sengketa',
}

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  PLACED: 'bg-blue-100 text-blue-700',
  SELLER_REVIEW: 'bg-yellow-100 text-yellow-700',
  SELLER_CONFIRMED: 'bg-green-100 text-green-700',
  PACKING: 'bg-orange-100 text-orange-700',
  READY_FOR_PICKUP: 'bg-teal-100 text-teal-700',
  FINDING_COURIER: 'bg-purple-100 text-purple-700',
  COURIER_ASSIGNED: 'bg-indigo-100 text-indigo-700',
  PICKED_UP: 'bg-cyan-100 text-cyan-700',
  ON_DELIVERY: 'bg-blue-200 text-blue-800',
  DELIVERED: 'bg-green-200 text-green-800',
  COMPLETED: 'bg-green-300 text-green-900',
  CANCELLED: 'bg-red-100 text-red-700',
  DISPUTE: 'bg-red-200 text-red-800',
}
