'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'

const STEPS = [
  { label: 'Reading your profile...', duration: 2500 },
  { label: 'Analyzing your last 18 posts...', duration: 3000 },
  { label: "Running Eric's bio framework...", duration: 3000 },
  { label: 'Checking your content mix...', duration: 2500 },
  { label: 'Writing your rewritten bio...', duration: 2500 },
  { label: 'Building your game plan...', duration: 2000 },
  { label: 'Almost done...', duration: 1500 },
]

export default function AuditProgress() {
  const [currentStep, setCurrentStep] = useState(0)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    let elapsed = 0
    STEPS.forEach((step, i) => {
      const id = setTimeout(() => {
        setCurrentStep(i + 1)
      }, elapsed + step.duration)
      timeoutsRef.current.push(id)
      elapsed += step.duration
    })

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }
  }, [])

  const progress = Math.round((currentStep / STEPS.length) * 100)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-[480px] space-y-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">Auditing your Instagram...</h2>
          <p className="text-sm text-gray-500 mt-1">
            Hang tight. This usually takes 15–20 seconds.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-black rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const isDone = i < currentStep
            const isCurrent = i === currentStep

            return (
              <div key={i} className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-black animate-spin shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                )}
                <span
                  className={`text-sm transition-colors ${
                    isDone
                      ? 'text-gray-400 line-through'
                      : isCurrent
                      ? 'text-black font-semibold'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 pt-2">
          Eric would say your page is already being judged. Might as well see the receipts.
        </p>
      </div>
    </div>
  )
}
