'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

export function YapeSubmitButton({ amount }: { amount: number }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#742284] text-white font-semibold rounded-xl py-4 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#742284]/20"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Procesando Pago...
        </>
      ) : (
        `Abrir Yape para pagar S/. ${amount.toFixed(2)}`
      )}
    </button>
  )
}
