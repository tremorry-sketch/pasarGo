import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  rightElement?: React.ReactNode
  className?: string
  showNotif?: boolean
  showSearch?: boolean
  variant?: 'default' | 'market' // market shows location pin icon
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  rightElement,
  className,
  showNotif,
  showSearch,
  variant = 'default',
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface shadow-header',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {backHref && (
          <Link href={backHref} className="material-symbols-outlined text-[#006b2d] active:scale-95 transition-transform">
            arrow_back
          </Link>
        )}
        {variant === 'market' && (
          <span className="material-symbols-outlined text-[#006b2d]">location_on</span>
        )}
        <div>
          {subtitle && (
            <p className="font-bold text-[10px] text-[#66736B] uppercase tracking-wider">{subtitle}</p>
          )}
          <h1
            className="font-headline-sm text-[#006b2d]"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-xs">
        {showSearch && (
          <button className="p-xs rounded-full hover:bg-surface-container-low transition-colors active:scale-95">
            <span className="material-symbols-outlined text-[#3e4a3e]">search</span>
          </button>
        )}
        {showNotif && (
          <Link href="/buyer/notifications" className="p-xs rounded-full hover:bg-surface-container-low relative">
            <span className="material-symbols-outlined text-[#3e4a3e]">notifications</span>
          </Link>
        )}
        {rightElement}
      </div>
    </header>
  )
}
