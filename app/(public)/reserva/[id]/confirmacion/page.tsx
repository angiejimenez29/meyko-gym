import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BookingStepper } from '@/features/booking/components/BookingStepper'
import { Check } from 'lucide-react'
import { TopBar } from '@/features/shared/components/TopBar'

function formatSessionDateTimeStr(isoDate: string, isoTime: string) {
  const date = new Date(`${isoDate}T${isoTime}`)
  return new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }).format(date)
}

export default async function ConfirmationPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ reservaId?: string, name?: string, phone?: string, spots?: string }> }) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  
  if (!resolvedSearchParams.reservaId) {
    notFound()
  }

  const clientNameRaw = resolvedSearchParams.name || 'Cliente'
  const clientName = clientNameRaw.includes('%20') || clientNameRaw.includes('+')
    ? decodeURIComponent(clientNameRaw.replace(/\+/g, ' '))
    : clientNameRaw
  const clientPhone = resolvedSearchParams.phone || '--'
  const spotsRaw = resolvedSearchParams.spots || ''
  
  const spotNumbersArray = spotsRaw.split(',').map(s => parseInt(s.trim(), 10)).filter(s => !isNaN(s))
  const spotsString = spotNumbersArray.length > 0 ? spotNumbersArray.map((s: number) => `#${s}`).join(', ') : '--'
  const isMultiple = spotNumbersArray.length > 1

  const supabase = await createClient()

  // We query ONLY sessions because reservations table is blocked by RLS for public read
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      session_date,
      start_time,
      theme,
      price,
      instructor:instructors ( full_name )
    `)
    .eq('id', resolvedParams.id)
    .single()

  const session = data as any

  if (error || !session) {
    // Return a fallback UI instead of 404 just in case
    return (
      <div className="min-h-screen bg-[#0B0914] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Reserva Confirmada</h1>
        <p className="text-white/70">Tu reserva se guardó, pero hubo un problema al cargar los detalles de la sesión.</p>
        <Link href="/">
          <button className="px-6 py-3 bg-[#D6007A] text-white rounded-xl font-bold">Volver al Inicio</button>
        </Link>
      </div>
    )
  }

  const instructorName = session?.instructor 
    ? (Array.isArray(session.instructor) ? session.instructor[0]?.full_name : session.instructor.full_name)
    : 'Instructor'

  const dateTimeStr = session ? formatSessionDateTimeStr(session.session_date, session.start_time) : ''

  return (
    <div className="min-h-screen bg-[#0B0914] flex flex-col relative pb-12">
      {/* Remove back button for confirmation page, or use a custom top bar, but the design shows a hamburger menu. We'll just show Logo and Menu for now */}
      <div className="flex items-center justify-between px-5 py-4">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center">
               <span className="text-white font-bold italic text-sm">M</span>
            </div>
            <span className="text-white font-semibold">Meikyo Gym</span>
         </div>
         <button className="p-2 text-white/80">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
         </button>
      </div>

      {/* Hero Banner with gradient */}
      <div className="w-full bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 py-10 px-6 text-center text-black relative overflow-hidden mb-6">
        {/* Decorative circles (Optional bg blobs can be simulated with pseudo elements or absolutely positioned divs) */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

        <div className="w-16 h-16 bg-black/20 rounded-full mx-auto flex items-center justify-center mb-4 relative z-10">
          <Check className="w-8 h-8 text-white stroke-[3]" />
        </div>
        
        <h1 className="text-3xl font-bold mb-3 relative z-10 text-gray-900">¡Reserva Confirmada!</h1>
        <p className="text-sm font-medium text-gray-800 leading-relaxed max-w-sm mx-auto relative z-10">
          Tu pago fue procesado exitosamente, se enviarán los detalles al número de WhatsApp vinculado.
        </p>
      </div>

      <div className="w-full max-w-md mx-auto px-5 space-y-6">
        
        <BookingStepper currentStep={4} />

        {/* Resumen Card */}
        <div className="bg-[#151226] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-white/60 text-sm">{isMultiple ? 'Espacios' : 'Espacio'}</span>
            <span className="text-yellow-400 font-bold text-2xl">{spotsString}</span>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Nombre</span>
              <span className="text-white font-medium">{clientName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Celular</span>
              <span className="text-white font-medium">{clientPhone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Instructor</span>
              <span className="text-white font-medium">{instructorName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Día y hora</span>
              <span className="text-white font-medium capitalize">{dateTimeStr}</span>
            </div>
            {session.theme && (
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Temática</span>
                <span className="text-white font-medium">{session.theme}</span>
              </div>
            )}
          </div>
        </div>

        {/* Importante Notice */}
        <div className="bg-[#1f1a24] border border-[#3b3024] rounded-xl p-4">
          <p className="text-white/70 text-sm leading-relaxed">
            <strong className="text-yellow-400 font-bold">Importante:</strong> Llega 10 minutos antes de la clase. Escanea el QR en la entrada para un check-in automático.
          </p>
        </div>

        <Link href="/" className="block w-full mt-8">
          <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl py-4 transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/20 text-lg">
            Volver al Inicio
          </button>
        </Link>
      </div>
    </div>
  )
}
