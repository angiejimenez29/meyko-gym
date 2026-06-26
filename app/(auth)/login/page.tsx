"use client"

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { login } from '@/features/auth/actions/login'
import Link from 'next/link'
import { Loader2, AlertCircle, Mail, Lock } from 'lucide-react'

const initialState = {
  error: null as string | null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#D6007A] text-white font-medium py-3.5 px-4 rounded-xl shadow-[0_4px_25px_rgba(214,0,122,0.3)] hover:shadow-[0_0_30px_rgba(214,0,122,0.6)] hover:scale-[1.02] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
    >
      {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Iniciar Sesión'}
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useActionState(login, initialState)

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-10 text-center w-full flex flex-col items-center">
        {/* Logo recreado del screenshot */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#D6007A] to-[#9B00E8] flex items-center justify-center shadow-[0_0_40px_rgba(214,0,122,0.5)] mb-6 overflow-hidden relative">
           <div className="flex gap-1 transform rotate-12 relative z-10">
              <div className="w-2.5 h-7 bg-white rounded-full transform -skew-x-[20deg] opacity-90"></div>
              <div className="w-2.5 h-10 bg-white rounded-full transform -skew-x-[20deg] -translate-y-1.5 opacity-90"></div>
              <div className="w-2.5 h-7 bg-white rounded-full transform -skew-x-[20deg] translate-y-1 opacity-90"></div>
           </div>
        </div>
        <h1 className="text-2xl font-medium text-[#D6007A] mb-2 tracking-wide">Meikyo Gym</h1>
        <p className="text-[#84849A] text-[13px] font-medium tracking-wide">Portal de Instructora</p>
      </div>

      <form action={formAction} className="space-y-4 w-full">
        <div className="relative">
          <label htmlFor="login-email" className="sr-only">Correo Electrónico</label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#84849A]">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="login-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            className="w-full bg-container border border-foreground/5 rounded-2xl pl-12 pr-4 py-3.5 text-[13px] text-foreground placeholder-foreground/50 focus:outline-none focus:border-[#D6007A]/50 focus:bg-background transition-colors"
            placeholder="cesar.reyes@gmail.com"
          />
        </div>

        <div className="relative">
          <label htmlFor="login-password" className="sr-only">Contraseña</label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#84849A]">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="login-password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full bg-container border border-foreground/5 rounded-2xl pl-12 pr-4 py-3.5 text-[13px] text-foreground placeholder-foreground/50 focus:outline-none focus:border-[#D6007A]/50 focus:bg-background transition-colors"
            placeholder="••••••••"
          />
        </div>

        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3 flex items-center justify-center gap-2 mt-4 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-[12px] text-red-200 font-medium">{state.error}</p>
          </div>
        )}

        <div className="pt-2">
          <SubmitButton />
        </div>
      </form>

      <div className="mt-8 text-center">
        <Link href="#" className="text-[12px] text-foreground/80 hover:text-foreground transition-colors font-medium hover:underline focus-visible:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </div>
  )
}
