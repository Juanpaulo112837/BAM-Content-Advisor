'use client'

import { useState } from 'react'
import { UserCircle, XCircle } from 'lucide-react'
import { BioAudit } from '@/types'
import { getScoreColor, getScoreLabel } from '@/lib/utils'

interface Props {
  result: BioAudit
  currentBio: string
}

export default function BioAuditCard({ result, currentBio }: Props) {
  const [copyLabel, setCopyLabel] = useState('Copy')

  async function handleCopy() {
    await navigator.clipboard.writeText(result.rewrittenBio)
    setCopyLabel('Copied!')
    setTimeout(() => setCopyLabel('Copy'), 2000)
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-base">Bio Audit</h3>
        </div>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full border whitespace-nowrap shrink-0 ${getScoreColor(result.score)} bg-white`}
        >
          {result.score}/10 — {getScoreLabel(result.score)}
        </span>
      </div>

      {/* Current bio */}
      <div className="space-y-1.5">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          Your current bio
        </p>
        <div className="bg-gray-50 rounded-lg px-3 py-2.5 min-h-[48px]">
          {currentBio.trim() ? (
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{currentBio}</p>
          ) : (
            <p className="text-sm text-red-500 italic">Your bio is empty.</p>
          )}
        </div>
      </div>

      {/* Issues */}
      {result.issues.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            What&apos;s not working
          </p>
          <ul className="space-y-1.5">
            {result.issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700">{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Rewritten bio */}
      <div className="space-y-1.5">
        <p className="text-xs text-green-600 font-medium uppercase tracking-wide">
          Your new bio
        </p>
        <div className="relative bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
          {result.rewrittenBio ? (
            <p className="text-sm text-gray-800 pr-16 break-words">{result.rewrittenBio}</p>
          ) : (
            <p className="text-sm text-amber-600 italic">
              Bio rewrite unavailable — try running the audit again.
            </p>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-2 right-2 text-xs font-medium bg-white border border-gray-200 rounded-md px-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            {copyLabel}
          </button>
        </div>
        {result.rewrittenBio && (
          <p className="text-xs text-gray-400 text-right">
            {result.rewrittenBio.length}/160 characters
          </p>
        )}
      </div>

      {/* Explanation */}
      <div className="space-y-1.5">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          Why these changes
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">{result.explanation}</p>
      </div>
    </div>
  )
}
