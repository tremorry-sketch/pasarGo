import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  DRAFT:              { label: 'DRAFT',       bg: '#dbe5db', text: '#3e4a3e' },
  PLACED:             { label: 'BARU',        bg: '#246BFE', text: '#ffffff' },
  SELLER_REVIEW:      { label: 'REVIEW',      bg: '#F6A623', text: '#ffffff' },
  SELLER_CONFIRMED:   { label: 'DIKONFIRMASI',bg: '#159947', text: '#ffffff' },
  PACKING:            { label: 'DIKEMAS',     bg: '#915BFF', text: '#ffffff' },
  READY_FOR_PICKUP:   { label: 'SIAP',        bg: '#159947', text: '#ffffff' },
  FINDING_COURIER:    { label: 'CARI KURIR',  bg: '#F6A623', text: '#ffffff' },
  COURIER_ASSIGNED:   { label: 'KURIR OK',    bg: '#0051d4', text: '#ffffff' },
  PICKED_UP:          { label: 'DIAMBIL',     bg: '#0B6B31', text: '#ffffff' },
  ON_DELIVERY:        { label: 'DIKIRIM',     bg: '#0B6B31', text: '#ffffff' },
  DELIVERED:          { label: 'TERKIRIM',    bg: '#159947', text: '#ffffff' },
  COMPLETED:          { label: 'SELESAI',     bg: '#17201A', text: '#ffffff' },
  CANCELLED:          { label: 'DIBATALKAN',  bg: '#D64545', text: '#ffffff' },
  DISPUTE:            { label: 'SENGKETA',    bg: '#D64545', text: '#ffffff' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, bg: '#dbe5db', text: '#3e4a3e' }
  return (
    <span
      className="inline-flex items-center px-sm py-base rounded-full text-badge-cap font-bold tracking-widest whitespace-nowrap"
      style={{ backgroundColor: cfg.bg, color: cfg.text, fontSize: '11px', letterSpacing: '0.05em' }}
    >
      {cfg.label}
    </span>
  )
}
