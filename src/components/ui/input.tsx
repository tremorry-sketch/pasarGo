import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: string // Material Symbol name
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-body-sm font-bold text-on-surface mb-xs">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-xl border border-border-muted bg-background-off-white px-md py-sm text-body-lg text-on-surface',
              'placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon && 'pl-10',
              error && 'border-error focus:ring-error',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-body-sm text-error">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
