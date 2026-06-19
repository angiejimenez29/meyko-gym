import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BookingStepper } from '@/features/booking/components/BookingStepper'
import { TopBar } from '@/features/shared/components/TopBar'
import { SpaceSelectionFlow } from '@/features/booking/components/SpaceSelectionFlow'

function formatSessionDate(isoString: string) {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
}

function formatSessionTime(isoString: string) {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date)
}

export default async function SpaceSelectionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      id,
      session_date,
      start_time,
      capacity,
      session_spots ( id, spot_number, status )
    `)
    .eq('id', resolvedParams.id)
    .single()

  const session = data as any

  if (error || !session) {
    notFound()
  }

  const dateStr = formatSessionDate(`${session.session_date}T${session.start_time}`)
  const timeStr = formatSessionTime(`${session.session_date}T${session.start_time}`)
  
  const spots = session.session_spots || []

  return (
    <div className="min-h-screen bg-[#0B0914] flex flex-col relative overflow-hidden">
      <TopBar title="Selecciona tu Espacio" backHref={`/reserva/${resolvedParams.id}`} />

      <div className="text-center mt-2 mb-6 space-y-1">
         <p className="text-white/60 text-sm capitalize">{dateStr} - {timeStr}</p>
      </div>

      <BookingStepper currentStep={2} />

      <div className="text-center mb-6 px-5">
         <h2 className="text-white font-medium text-lg">Mapa de la Planta del Gimnasio</h2>
         <p className="text-white/40 text-sm mt-1">Toca el número del espacio que deseas reservar</p>
      </div>

      <SpaceSelectionFlow 
        sessionId={session.id} 
        capacity={session.capacity} 
        spots={spots} 
      />
    </div>
  )
}
