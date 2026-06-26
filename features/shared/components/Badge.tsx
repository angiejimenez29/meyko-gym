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
            "bg-state-magenta/20 text-state-magenta": variant === 'default',
            "bg-state-green/20 text-state-green": variant === 'success',
            "bg-state-yellow/20 text-state-yellow": variant === 'warning',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'
