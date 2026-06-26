'use client'

import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

export interface Spot {
  id?: string
  spot_number: number
  status: 'available' | 'reserved' | 'present'
}

interface SpaceGridProps {
  spots: Spot[]
  capacity: number
  selectedSpots: number[]
  onToggleSpot: (spotNumber: number) => void
}

export function SpaceGrid({ spots, capacity, selectedSpots, onToggleSpot }: SpaceGridProps) {
  // Generate all grid spots based on capacity
  const allSpots = Array.from({ length: capacity }, (_, i) => {
    const spotNumber = i + 1
    const dbSpot = spots.find(s => s.spot_number === spotNumber)
    return {
      spot_number: spotNumber,
      status: dbSpot ? dbSpot.status : 'available'
    }
  })

  return (
    <div className="w-full flex flex-col items-center">
      {/* Instructor / Mirror Area */}
      <div className="w-full max-w-[320px] bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl py-3 px-4 flex items-center justify-center gap-2 mb-8 shadow-lg shadow-pink-500/20">
        <User className="w-5 h-5 text-white" />
        <span className="text-white font-medium tracking-wide">INSTRUCTOR / ESPEJO</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-3 max-w-[320px] mx-auto mb-8">
        {allSpots.map(spot => {
          const isSelected = selectedSpots.includes(spot.spot_number)
          const isAvailable = spot.status === 'available'

          return (
            <button
              key={spot.spot_number}
              disabled={!isAvailable}
              onClick={() => isAvailable && onToggleSpot(spot.spot_number)}
              className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all',
                !isAvailable && 'bg-foreground/10 text-foreground/80 cursor-not-allowed',
                isAvailable && !isSelected && 'bg-[#00E676] text-black hover:brightness-110',
                isSelected && 'bg-state-yellow text-black ring-4 ring-state-yellow/30 scale-105'
              )}
            >
              {spot.spot_number}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3 w-full max-w-[320px] text-sm text-foreground/70">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-[#00E676]"></div>
          <span>Espacio disponible</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-foreground/10 border border-foreground/5"></div>
          <span>Espacio ocupado</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-state-yellow"></div>
          <span>Tu selección</span>
        </div>
      </div>
    </div>
  )
}
