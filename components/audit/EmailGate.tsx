'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { getScoreColor } from '@/lib/utils'

interface Props {
  bioScore: number
  feedScore: number
  issueCount: number
  onEmailSubmit: (email: string) => void
  isSubmitting: boolean
}

export default function EmailGate({
  bioScore,
  feedScore,
  issueCount,
  onEmailSubmit,
  isSubmitting,
}: Props) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address.')
      return
    }

    setEmailError(null)
    onEmailSubmit(trimmed)
  }

  return (
    <div className="space-y-5">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold">Your audit is ready.</h2>
      </div>

      {/* Score badges */}
      <div className="flex gap-3 flex-wrap">
        <div className="border rounded-xl px-4 py-2.5 text-center min-w-[120px]">
          <p className="text-xs text-gray-500 mb-0.5">Bio Score</p>
          <p className={`text-2xl font-bold ${getScoreColor(bioScore)}`}>
            {bioScore}<span className="text-base font-normal text-gray-400">/10</span>
          </p>
        </div>
        <div className="border rounded-xl px-4 py-2.5 text-center min-w-[120px]">
          <p className="text-xs text-gray-500 mb-0.5">Feed Score</p>
          <p className={`text-2xl font-bold ${getScoreColor(feedScore)}`}>
            {feedScore}<span className="text-base font-normal text-gray-400">/10</span>
          </p>
        </div>
      </div>

      {/* Teaser text */}
      <p className="text-sm text-gray-600">
        We found <strong>{issueCount} specific issues</strong> and rewrote your bio.
        Enter your email to see your full audit.
      </p>

      {/* Blurred preview + form overlay */}
      <div className="relative rounded-xl overflow-hidden min-h-[320px]">
        {/* Blurred placeholder content */}
        <div
          className="pointer-events-none select-none opacity-50 space-y-3 p-4 bg-gray-50 rounded-xl"
          style={{ filter: 'blur(4px)' }}
          aria-hidden="true"
        >
          <div className="h-24 bg-gray-200 rounded-lg w-full" />
          <div className="h-16 bg-gray-200 rounded-lg w-3/4" />
          <div className="h-32 bg-gray-200 rounded-lg w-full" />
          <div className="h-10 bg-gray-200 rounded-lg w-1/2" />
        </div>

        {/* Form overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-5 space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(null) }}
                placeholder="your@email.com"
                className={`w-full border rounded-lg px-3 py-2.5 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-black ${
                  emailError ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {emailError && (
                <p className="text-xs text-red-600">{emailError}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
                ) : (
                  'See My Full Audit →'
                )}
              </button>
            </form>
            <p className="text-xs text-center text-gray-400">
              We&apos;ll also send you a weekly content tip from Eric. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
