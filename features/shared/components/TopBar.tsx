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
    <div className={cn("flex items-center h-16 px-4 border-b border-white/10 bg-[#0B0914]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B0914]/60 sticky top-0 z-50", className)}>
      {backHref && (
        <Link href={backHref} className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
      )}
      <h1 className="text-lg font-semibold text-white">{title}</h1>
    </div>
  )
}
