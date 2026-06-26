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

  const isNameValid = name.trim().split(' ').filter(Boolean).length >= 2
  const isPhoneValid = phone.length >= 9

  const handleContinue = () => {
    if (selectedSpots.length === 0 || !isNameValid || !isPhoneValid) return

    const params = new URLSearchParams()
    params.set('spots', selectedSpots.join(','))
    params.set('name', name.trim())
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
        className={`fixed bottom-0 left-0 w-full bg-container/95 backdrop-blur-xl border-t border-foreground/10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-5 px-6 pb-8 z-50 transition-transform duration-300 ${selectedSpots.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-background border border-state-yellow/30 rounded-xl p-3 flex flex-col items-center justify-center mb-4">
             <span className="text-foreground/80 text-xs">
                {selectedSpots.length === 1 ? 'Espacio seleccionado' : 'Espacios seleccionados'}
             </span>
             <span className="text-state-yellow text-2xl font-bold">
                {selectedSpots.length > 0 ? selectedSpots.map(s => `#${s}`).join(', ') : '--'}
             </span>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="client-name" className="text-foreground/80 text-xs ml-1 mb-1 block">Nombre Completo</label>
              <Input 
                id="client-name"
                value={name}
                autoComplete="name"
                onChange={e => setName(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
                placeholder="Ej. Luz Maria Begonias"
                className={`bg-background text-foreground transition-colors ${name.length > 0 && !isNameValid ? 'border-red-400/50 focus:border-red-400' : 'border-foreground/10'}`}
              />
              {name.length > 0 && !isNameValid && (
                 <span className="text-red-400 text-xs font-medium ml-1 mt-1 block">Ingresa tu nombre y apellido.</span>
              )}
            </div>
            <div>
              <label htmlFor="client-phone" className="text-foreground/80 text-xs ml-1 mb-1 block">Número de Celular</label>
              <Input 
                id="client-phone"
                value={phone}
                autoComplete="tel"
                inputMode="tel"
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                placeholder="Ej. 956632585"
                type="tel"
                className={`bg-background text-foreground transition-colors ${phone.length > 0 && !isPhoneValid ? 'border-red-400/50 focus:border-red-400' : 'border-foreground/10'}`}
              />
              {phone.length > 0 && !isPhoneValid && (
                 <span className="text-red-400 text-xs font-medium ml-1 mt-1 block">El número debe tener 9 dígitos.</span>
              )}
            </div>
          </div>

          <button 
            disabled={!isNameValid || !isPhoneValid || selectedSpots.length === 0}
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
