import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookingStepperProps {
  currentStep: number
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  const steps = [1, 2, 3, 4]

  return (
    <div className="flex items-center justify-center w-full px-4 mb-8">
      {steps.map((step, index) => {
        const isCompleted = step < currentStep
        const isActive = step === currentStep

        return (
          <div key={step} className="flex items-center">
            {/* Circle */}
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors',
                isCompleted ? 'bg-yellow-400 text-black' : isActive ? 'bg-pink-500 text-white' : 'bg-white/5 text-white/40'
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : step}
            </div>

            {/* Line connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-[2px] w-8 mx-2 transition-colors',
                  step < currentStep ? 'bg-yellow-400' : 'bg-white/10'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
