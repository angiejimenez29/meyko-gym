import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning'
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
          {
            "bg-[#FF00FF]/20 text-[#FF00FF]": variant === 'default',
            "bg-[#39FF14]/20 text-[#39FF14]": variant === 'success',
            "bg-[#FFFF00]/20 text-[#FFFF00]": variant === 'warning',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'
