'use client'

import { AlertTriangle, CheckCircle2, LayoutGrid, MinusCircle, XCircle } from 'lucide-react'
import { FeedAudit } from '@/types'
import { getScoreColor, getScoreLabel } from '@/lib/utils'

interface Props {
  result: FeedAudit
}

const CONTENT_BARS = [
  { key: 'authorityContent',    label: 'Authority Content',    color: 'bg-blue-500' },
  { key: 'personalityContent',  label: 'Personality Content',  color: 'bg-purple-500' },
  { key: 'localContent',        label: 'Local Content',        color: 'bg-green-500' },
  { key: 'listingContent',      label: 'Listing Content',      color: 'bg-orange-500' },
] as const

export default function FeedAuditCard({ result }: Props) {
  const { contentMixAnalysis } = result

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-base">Feed Audit</h3>
        </div>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full border whitespace-nowrap shrink-0 ${getScoreColor(result.score)} bg-white`}
        >
          {result.score}/10 — {getScoreLabel(result.score)}
        </span>
      </div>

      {/* Content mix */}
      <div className="space-y-2">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          Your content mix
        </p>
        <div className="space-y-2">
          {CONTENT_BARS.map(({ key, label, color }) => {
            const pct = contentMixAnalysis[key] ?? 0
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">{label}</span>
                  <span className="text-xs font-medium text-gray-700">{pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 pt-1">
          Healthy mix: ~30% authority, ~30% personality, ~20% local, ~20% listings
        </p>
      </div>

      {/* Red flags */}
      {result.redFlags.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-red-600 font-medium uppercase tracking-wide">
            Red flags
          </p>
          <ul className="space-y-1.5">
            {result.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What's working */}
      {result.whatIsWorking.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-green-600 font-medium uppercase tracking-wide">
            What&apos;s working
          </p>
          <ul className="space-y-1.5">
            {result.whatIsWorking.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What's missing */}
      {result.whatIsMissing.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            What&apos;s missing
          </p>
          <ul className="space-y-1.5">
            {result.whatIsMissing.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <MinusCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What to stop */}
      {result.whatToStop.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            What to stop
          </p>
          <ul className="space-y-1.5">
            {result.whatToStop.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
