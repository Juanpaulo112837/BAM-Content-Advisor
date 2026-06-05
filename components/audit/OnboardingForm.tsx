'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { OnboardingAnswersSchema } from '@/lib/schemas'
import { OnboardingAnswers } from '@/types'

interface Props {
  onSubmit: (answers: OnboardingAnswers) => void
  instagramHandle: string
}

const FREQUENCY_OPTIONS: {
  value: OnboardingAnswers['postingFrequency']
  label: string
  subtext: string
}[] = [
  { value: 'consistently', label: 'Consistently', subtext: 'Multiple times a week' },
  { value: 'occasionally', label: 'Occasionally', subtext: 'Once a week or less' },
  { value: 'barely', label: 'Barely at all', subtext: 'A few times a month or less' },
]

export default function OnboardingForm({ onSubmit, instagramHandle }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingAnswers>({
    resolver: zodResolver(OnboardingAnswersSchema),
  })

  const selectedFrequency = watch('postingFrequency')

  async function onFormSubmit(data: OnboardingAnswers) {
    setIsSubmitting(true)
    await onSubmit(data)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-bold">Tell us about yourself</h2>
          {instagramHandle && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              @{instagramHandle}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          The more context you give, the better the audit. These answers are what make your
          results specific to you — not generic advice.
        </p>
      </div>

      {/* Q1 — market */}
      <Field
        label="What market or city do you work in?"
        hint="The more specific, the better. A neighborhood is better than a city."
        error={errors.market?.message}
      >
        <textarea
          {...register('market')}
          rows={2}
          placeholder="e.g. Austin, TX — or even more specific: South Austin, mainly 78704 and Bouldin Creek"
          className={inputClass(!!errors.market)}
        />
      </Field>

      {/* Q2 — experience */}
      <Field
        label="How long have you been a real estate agent?"
        hint={null}
        error={errors.experience?.message}
      >
        <input
          {...register('experience')}
          type="text"
          placeholder="e.g. 8 months  |  3 years, mostly buyers  |  Just got licensed last month"
          className={inputClass(!!errors.experience)}
        />
      </Field>

      {/* Q3 — knownFor */}
      <Field
        label="What do you want to be known for?"
        hint="Not sure yet? Describe your favorite type of client or deal."
        error={errors.knownFor?.message}
      >
        <textarea
          {...register('knownFor')}
          rows={3}
          placeholder="e.g. Luxury listings in Scottsdale  |  First-time buyers who are overwhelmed by the process  |  Investor deals and off-market finds in Detroit"
          className={inputClass(!!errors.knownFor)}
        />
      </Field>

      {/* Q4 — enjoyPosting */}
      <Field
        label="What do you actually enjoy posting about — or wish you could?"
        hint="Be honest. 'I hate all of it' is a valid answer and actually useful."
        error={errors.enjoyPosting?.message}
      >
        <textarea
          {...register('enjoyPosting')}
          rows={3}
          placeholder="e.g. Behind-the-scenes of listings, I love interior design  |  Market data and trends  |  Honestly I have no idea what to post, that's why I'm here"
          className={inputClass(!!errors.enjoyPosting)}
        />
      </Field>

      {/* Q5 — postingFrequency */}
      <Field
        label="How often are you currently posting?"
        hint={null}
        error={errors.postingFrequency?.message}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {FREQUENCY_OPTIONS.map((opt) => {
            const selected = selectedFrequency === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('postingFrequency', opt.value, { shouldValidate: true })}
                className={`text-left border-2 rounded-xl px-4 py-3 transition-colors
                  ${selected
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400'
                  }`}
              >
                <p className="font-medium text-sm">{opt.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{opt.subtext}</p>
              </button>
            )
          })}
        </div>
      </Field>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 px-6 rounded-xl font-semibold text-base hover:bg-gray-800 transition-colors disabled:opacity-60 min-h-[52px]"
      >
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Running your audit...</>
        ) : (
          'Run My Audit →'
        )}
      </button>
    </form>
  )
}

function inputClass(hasError: boolean) {
  return `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none transition-colors ${
    hasError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
  }`
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint: string | null
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
