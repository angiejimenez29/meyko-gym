import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { BookingStepper } from '@/features/booking/components/BookingStepper'
import { TopBar } from '@/features/shared/components/TopBar'
import { createReservation } from '@/features/booking/actions/createReservation'
import { YapeSubmitButton } from '@/features/booking/components/YapeSubmitButton'
import { ShieldCheck } from 'lucide-react'

function formatSessionDateTimeStr(isoDate: string, isoTime: string) {
  const date = new Date(`${isoDate}T${isoTime}`)
  return new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }).format(date)
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function PaymentPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: SearchParams }) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  
  const spotsRaw = resolvedSearchParams.spots as string
  const clientNameRaw = resolvedSearchParams.name as string || ''
  const clientName = clientNameRaw.includes('%20') || clientNameRaw.includes('+') 
    ? decodeURIComponent(clientNameRaw.replace(/\+/g, ' '))
    : clientNameRaw
  const clientPhone = resolvedSearchParams.phone as string

  if (!spotsRaw || !clientName || !clientPhone) {
    // Missing info, go back to space selection gracefully instead of 404
    redirect(`/reserva/${resolvedParams.id}/espacio`)
  }

  const spotsArray = spotsRaw.split(',').map(s => parseInt(s.trim(), 10)).filter(s => !isNaN(s))
  if (spotsArray.length === 0) {
    notFound()
  }

  const supabase = await createClient()

  const { data: session, error } = await supabase
    .from('sessions')
    .select(`
      id,
      session_date,
      start_time,
      theme,
      price,
      instructor:instructors (
        full_name
      )
    `)
    .eq('id', resolvedParams.id)
    .single()

  if (error || !session) {
    notFound()
  }

  const dateTimeStr = formatSessionDateTimeStr(session.session_date, session.start_time)
  const instructorName = session.instructor 
    ? (Array.isArray(session.instructor) ? session.instructor[0]?.full_name : session.instructor.full_name)
    : 'Instructor'

  const totalAmount = session.price * spotsArray.length

  return (
    <div className="min-h-screen bg-[#0B0914] flex flex-col relative">
      <TopBar title="Pago con Yape" backUrl={`/reserva/${resolvedParams.id}/espacio`} />

      <div className="flex-1 w-full max-w-md mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-8">
           <div className="space-y-1">
             <p className="text-white/60 text-xs uppercase tracking-widest">Powered by Culqi</p>
             <p className="text-white font-bold text-3xl">S/. {totalAmount.toFixed(2)}</p>
           </div>
        </div>

        <BookingStepper currentStep={3} />

        {/* Resumen Card */}
        <div className="bg-[#151226] border border-white/5 rounded-2xl p-6 space-y-4 mb-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-white/60 text-sm">
              {spotsArray.length === 1 ? 'Espacio seleccionado' : 'Espacios seleccionados'}
            </span>
            <span className="text-yellow-400 font-bold text-2xl">
              {spotsArray.map(s => `#${s}`).join(', ')}
            </span>
          </div>
          
          <div className="space-y-2 pt-2">
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

        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-[#742284] rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-[#742284]/30">
             {/* Mock Yape Logo */}
             <span className="text-white font-bold italic text-2xl">Yape</span>
          </div>
          <p className="text-white font-medium">Pago con Yape</p>
          <p className="text-white/50 text-sm px-6">Serás redirigido de forma segura a la app de Yape para completar esta transacción.</p>
          
          <form action={createReservation}>
            <input type="hidden" name="sessionId" value={session.id} />
            <input type="hidden" name="spots" value={spotsRaw} />
            <input type="hidden" name="clientName" value={clientName} />
            <input type="hidden" name="clientPhone" value={clientPhone} />
            
            <YapeSubmitButton amount={totalAmount} />
          </form>

          <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-6 text-white/40 text-xs">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>SSL Encriptado</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Powered by Culqi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
