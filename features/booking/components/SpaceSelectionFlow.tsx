'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SpaceGrid, Spot } from './SpaceGrid'
import { Input } from '@/features/shared/components/Input'

interface SpaceSelectionFlowProps {
  sessionId: string
  spots: Spot[]
  capacity: number
}

export function SpaceSelectionFlow({ sessionId, spots, capacity }: SpaceSelectionFlowProps) {
  const router = useRouter()
  const [selectedSpots, setSelectedSpots] = useState<number[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleToggleSpot = (spot: number) => {
    setSelectedSpots(prev => {
      if (prev.includes(spot)) {
        return prev.filter(s => s !== spot)
      } else {
        return [...prev, spot].sort((a, b) => a - b)
      }
    })
  }

  const handleContinue = () => {
    if (selectedSpots.length === 0 || !name || !phone) return

    const params = new URLSearchParams()
    params.set('spots', selectedSpots.join(','))
    params.set('name', name)
    params.set('phone', phone)

    router.push(`/reserva/${sessionId}/pago?${params.toString()}`)
  }

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-5 pb-32">
      <SpaceGrid 
        spots={spots} 
        capacity={capacity} 
        selectedSpots={selectedSpots} 
        onToggleSpot={handleToggleSpot} 
      />

      {/* Bottom Floating Form */}
      <div 
        className={`fixed bottom-0 left-0 w-full bg-[#0B0914]/95 backdrop-blur-md border-t border-white/10 p-5 px-6 pb-8 z-50 transition-transform duration-300 ${selectedSpots.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-[#151226] border border-yellow-400/30 rounded-xl p-3 flex flex-col items-center justify-center mb-4">
             <span className="text-white/60 text-xs">
                {selectedSpots.length === 1 ? 'Espacio seleccionado' : 'Espacios seleccionados'}
             </span>
             <span className="text-yellow-400 text-2xl font-bold">
                {selectedSpots.length > 0 ? selectedSpots.map(s => `#${s}`).join(', ') : '--'}
             </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-white/60 text-xs ml-1 mb-1 block">Nombre Completo</label>
              <Input 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Luz Maria Begonias"
                className="bg-[#151226] border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs ml-1 mb-1 block">Número de Celular</label>
              <Input 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Ej. 956632585"
                type="tel"
                className="bg-[#151226] border-white/10 text-white"
              />
            </div>
          </div>

          <button 
            disabled={!name || !phone}
            onClick={handleContinue}
            className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl py-4 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            Continuar al Pago
          </button>
        </div>
      </div>
    </div>
  )
}
