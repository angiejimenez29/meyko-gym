import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface TopBarProps {
  title: string
  backHref?: string
  className?: string
}

export function TopBar({ title, backHref, className }: TopBarProps) {
  return (
    <div className="h-16 w-full shrink-0">
      <div className={cn("flex items-center h-16 px-4 border-b border-foreground/10 bg-background sticky top-16 md:top-[72px] z-40", className)}>
        {backHref && (
          <Link href={backHref} className="mr-4 p-2 rounded-full hover:bg-foreground/10 transition-colors">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Link>
        )}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
    </div>
  )
}
