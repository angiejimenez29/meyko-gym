import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BookingStepper } from '@/features/booking/components/BookingStepper'
import { LocationMap } from '@/features/booking/components/LocationMap'
import { TopBar } from '@/features/shared/components/TopBar'
import { Calendar, Clock, MapPin, User as UserIcon } from 'lucide-react'

function formatSessionDate(isoString: string) {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
}

function formatSessionTime(isoString: string) {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date)
}

export default async function ClassDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      instructor:instructors (
        full_name,
        profile_image_url,
        years_experience
      ),
      session_spots ( status )
    `)
    .eq('id', resolvedParams.id)
    .single()

  const session = data as any

  if (error || !session) {
    notFound()
  }

  const dateStr = formatSessionDate(`${session.session_date}T${session.start_time}`)
  const timeStr = formatSessionTime(`${session.session_date}T${session.start_time}`)

  const instructorName = session.instructor 
    ? (Array.isArray(session.instructor) ? session.instructor[0]?.full_name : session.instructor.full_name)
    : 'Instructor'
  
  const instructorExp = session.instructor
    ? (Array.isArray(session.instructor) ? session.instructor[0]?.years_experience : session.instructor.years_experience)
    : 5

  const availableSpots = session.session_spots
    ? session.session_spots.filter((s: any) => s.status === 'available').length
    : session.capacity

  const progressPercentage = ((session.capacity - availableSpots) / session.capacity) * 100

  return (
    <div className="min-h-screen bg-[#0B0914] flex flex-col pb-24">
      <TopBar title="Detalles de la Clase" backHref="/clases" />

      <main className="flex-1 w-full max-w-md mx-auto px-5 mt-6 space-y-6">
        <BookingStepper currentStep={1} />

        {/* Info Box */}
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-2xl p-5 border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-pink-500/20 p-2 rounded-xl">
              <Calendar className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <p className="text-white font-medium capitalize">{dateStr}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-pink-500/20 p-2 rounded-xl">
              <Clock className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <p className="text-white font-medium">{timeStr}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            {session.special_guest && (
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Invitado Especial</p>
                <p className="text-white text-sm font-medium">{session.special_guest}</p>
              </div>
            )}
            {session.theme && (
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Temática del Día</p>
                <p className="text-yellow-400 text-sm font-medium">{session.theme}</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructor */}
        <div className="space-y-3">
          <h2 className="text-white font-semibold">Instructor</h2>
          <div className="bg-[#151226] p-4 rounded-2xl flex items-center gap-4 border border-white/5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">{instructorName.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-white font-medium">{instructorName}</p>
              <p className="text-yellow-400 text-xs mt-1">Entrenador Certificado</p>
              <p className="text-white/50 text-xs mt-1">{instructorExp}+ años de experiencia en fitness</p>
            </div>
          </div>
        </div>

        {/* Ubicacion y Precio */}
        <div className="space-y-3">
          <h2 className="text-white font-semibold">Ubicación y Precio</h2>
          <div className="bg-[#151226] p-4 rounded-2xl border border-white/5 space-y-4">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-pink-500 shrink-0" />
              <div>
                <p className="text-white/60 text-xs">Ubicación</p>
                <p className="text-white text-sm font-medium">Super Exlocal</p>
                <p className="text-white/40 text-xs">Av. Principal 123, San Isidro, Lima</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center shrink-0">
                <span className="text-yellow-400 text-xs font-bold">$</span>
              </div>
              <div>
                <p className="text-white/60 text-xs">Precio por persona</p>
                <p className="text-white font-bold">S/. {session.price.toFixed(2)}</p>
              </div>
            </div>

            <LocationMap />
          </div>
        </div>
      </main>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0B0914]/95 backdrop-blur-md border-t border-white/10 p-5 px-6 pb-8 z-50">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Cupos disponibles</span>
            <span className="text-yellow-400 font-bold">{availableSpots} de {session.capacity}</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <Link href={`/reserva/${resolvedParams.id}/espacio`} className="block w-full">
            <button 
              disabled={availableSpots === 0}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl py-4 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {availableSpots > 0 ? 'Continuar a la Reserva' : 'Clase Llena'}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
