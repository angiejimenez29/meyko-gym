import { CheckCircle2 } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    { title: 'Elige tu clase', description: 'Selecciona el horario y la temática que más te guste del catálogo.' },
    { title: 'Selecciona tu espacio', description: 'Escoge tu lugar exacto en el salón interactivo. Sin necesidad de crear cuenta.' },
    { title: 'Paga con Yape', description: 'Confirma tu reserva al instante pagando con Yape. Recibirás tu QR por WhatsApp.' },
  ]

  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white">¿Cómo funciona?</h2>
        <p className="text-white/60 mt-3 text-lg">Reservar tu espacio es súper fácil y rápido.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 font-bold text-2xl">
              {index + 1}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
