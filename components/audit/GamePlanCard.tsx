'use client'

import { Zap } from 'lucide-react'
import { GamePlan } from '@/types'

interface Props {
  result: GamePlan
}

export default function GamePlanCard({ result }: Props) {
  return (
    <div className="bg-gray-950 text-white rounded-xl p-6 space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-base">Your Game Plan</h3>
        </div>
        <p className="text-sm text-gray-400">Do these in order. Start with #1 today.</p>
      </div>

      {/* Actions */}
      <div className="space-y-0">
        {result.actions.map((action, i) => (
          <div key={action.priority}>
            <div className="flex gap-4 py-5">
              {/* Priority number */}
              <div className="shrink-0 w-10 text-right">
                <span className="text-3xl font-bold text-gray-600 leading-none">
                  {String(action.priority).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2 min-w-0">
                <p className="font-semibold text-white text-base leading-snug">
                  {action.action}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Why first: </span>
                  <span className="text-gray-300">{action.why}</span>
                </p>
                <p className="text-sm italic text-gray-400">
                  <span className="not-italic text-gray-500">How to start: </span>
                  {action.howToStart}
                </p>
              </div>
            </div>

            {/* Divider between actions */}
            {i < result.actions.length - 1 && (
              <div className="border-t border-gray-800" />
            )}
          </div>
        ))}
      </div>

      {/* Footer quote */}
      <p className="text-xs text-gray-500 border-t border-gray-800 pt-4">
        The agents who win on social aren&apos;t the ones who post perfectly.
        They&apos;re the ones who don&apos;t stop.
      </p>
    </div>
  )
}
