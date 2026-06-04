"use client"

import dynamic from 'next/dynamic'

const GymMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      <span className="text-white/40 font-medium animate-pulse">Cargando mapa...</span>
    </div>
  )
})

export default function MapWrapper() {
  return <GymMap />
}
