import { CheckCircle2 } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    { title: 'Elige tu clase', description: 'Selecciona el horario y la temática que más te guste del catálogo.' },
    { title: 'Selecciona tu espacio', description: 'Escoge tu lugar exacto en el salón interactivo. Sin necesidad de crear cuenta.' },
    { title: 'Paga con Yape', description: 'Confirma tu reserva al instante pagando con Yape. Recibirás tu QR por WhatsApp.' },
  ]

  return (
    <section className="py-12">
      <div className="text-center mb-10 flex flex-col items-center">
        <h2 className="text-[22px] md:text-4xl font-bold text-white mb-1 md:mb-3">¿Cómo reservo?</h2>
        <p className="text-sm md:text-lg text-white font-bold">Elige, paga y entrena.</p>
        <p className="text-xs md:text-base text-white/50 font-medium mt-1">Así de fácil y sin crear cuenta.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10">
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
