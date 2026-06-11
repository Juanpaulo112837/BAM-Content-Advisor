'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useAuditStore } from '@/lib/store'
import { cleanInstagramHandle } from '@/lib/utils'
import InstagramInput from '@/components/audit/InstagramInput'
import OnboardingForm from '@/components/audit/OnboardingForm'
import AuditProgress from '@/components/audit/AuditProgress'
import EmailGate from '@/components/audit/EmailGate'
import BioAuditCard from '@/components/audit/BioAuditCard'
import FeedAuditCard from '@/components/audit/FeedAuditCard'
import GamePlanCard from '@/components/audit/GamePlanCard'
import BAMxUpsell from '@/components/audit/BAMxUpsell'
import { OnboardingAnswers } from '@/types'

export default function AuditPage() {
  const store = useAuditStore()

  const [inputMode, setInputMode] = useState<'handle' | 'screenshot-fallback'>('handle')
  const [apifyFallbackMessage, setApifyFallbackMessage] = useState('')
  const [isLoadingHandle, setIsLoadingHandle] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Scroll to top when results appear
  useEffect(() => {
    if (store.step === 'results') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [store.step])

  function handleStartOver() {
    store.reset()
    setInputMode('handle')
    setApifyFallbackMessage('')
  }

  async function handleHandleSubmit(handle: string) {
    if (!handle) {
      setInputMode('handle')
      setApifyFallbackMessage('')
      return
    }

    const cleanHandle = cleanInstagramHandle(handle)
    store.setInstagramHandle(cleanHandle)
    setIsLoadingHandle(true)

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanHandle }),
      })
      const data = await res.json()

      if (data.status === 'success' || data.status === 'partial') {
        store.setProfile(data.profile)
        store.setStep('onboarding')
      } else if (data.status === 'not_found') {
        setApifyFallbackMessage(data.message)
        setInputMode('screenshot-fallback')
      } else if (data.status === 'apify_unavailable') {
        setApifyFallbackMessage(data.message)
        setInputMode('screenshot-fallback')
      }
    } catch {
      setApifyFallbackMessage(
        'Could not connect to our profile loader. Please upload screenshots instead.'
      )
      setInputMode('screenshot-fallback')
    } finally {
      setIsLoadingHandle(false)
    }
  }

  async function handleOnboardingSubmit(answers: OnboardingAnswers) {
    store.setOnboarding(answers)
    store.setStep('loading')

    const profile = store.profile ?? {
      username: store.instagramHandle,
      bio: '',
      fullName: '',
      followersCount: 0,
      postsCount: 0,
      recentPosts: [],
      source: 'screenshots' as const,
    }

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          onboarding: answers,
          screenshotUrls: store.screenshotUrls,
        }),
      })
      const data = await res.json()

      if (!res.ok || !data.audit) {
        throw new Error(data.message || 'Audit failed')
      }

      store.setAuditResult(data.audit)
      store.setStep('email-gate')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      store.setError(message)
      store.setStep('onboarding')
    }
  }

  function handleEmailSubmit(email: string) {
    store.setEmail(email)
    const topRecommendations = store.auditResult?.gamePlan?.actions?.slice(0, 3) ?? []
    const auditSummary = topRecommendations.map((a) => a.action).join(' | ')
    fetch('/api/capture-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        instagramHandle: store.instagramHandle,
        submittedBio: store.profile?.bio ?? '',
        rewrittenBio: store.auditResult?.bioAudit?.rewrittenBio ?? '',
        market: store.onboarding?.market,
        experience: store.onboarding?.experience,
        agentRole: store.onboarding?.agentRole,
        knownFor: store.onboarding?.knownFor,
        enjoyPosting: store.onboarding?.enjoyPosting,
        postingFrequency: store.onboarding?.postingFrequency,
        referralSource: store.onboarding?.referralSource,
        bioScore: store.auditResult?.bioAudit?.score,
        feedScore: store.auditResult?.feedAudit?.score,
        auditSummary,
        auditResult: store.auditResult,
      }),
    }).catch(() => {})
    store.setStep('results')
  }

  const showStartOver = store.step !== 'loading' && store.step !== 'results'

  const STEP_LABELS: Partial<Record<typeof store.step, string>> = {
    input: 'Step 1 of 3 — Your profile',
    onboarding: 'Step 2 of 3 — About you',
    'email-gate': 'Step 3 of 3 — Almost there',
  }
  const stepLabel = STEP_LABELS[store.step]

  return (
    <div className="min-h-screen pb-28 md:pb-8">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-3 mb-2">
        <div className="max-w-2xl mx-auto">
          <Image src="/logo.png" alt="BAMx" width={80} height={32} priority className="h-8 w-auto" />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Start over */}
      {showStartOver && (
        <button
          type="button"
          onClick={handleStartOver}
          className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block transition-colors"
        >
          ← Start over
        </button>
      )}

      {/* Error alert */}
      {store.error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm flex-1">{store.error}</p>
          <button
            type="button"
            onClick={() => store.setError(null)}
            className="shrink-0 hover:text-red-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP: input */}
      {store.step === 'input' && (
        <>
          {isMobile && (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-4">
              Most agents do this from their phone — just screenshot your profile.
            </p>
          )}
          <InstagramInput
            mode={inputMode}
            fallbackMessage={apifyFallbackMessage}
            isLoadingHandle={isLoadingHandle}
            isMobile={isMobile}
            onUploaded={(urls) => {
              store.setScreenshotUrls(urls)
              store.setStep('onboarding')
            }}
            onHandleSubmit={handleHandleSubmit}
          />
        </>
      )}

      {/* STEP: onboarding */}
      {store.step === 'onboarding' && (
        <OnboardingForm
          instagramHandle={store.instagramHandle}
          onSubmit={handleOnboardingSubmit}
        />
      )}

      {/* STEP: loading */}
      {store.step === 'loading' && <AuditProgress />}

      {/* STEP: email-gate */}
      {store.step === 'email-gate' && store.auditResult && (
        <EmailGate
          bioScore={store.auditResult.bioAudit.score}
          feedScore={store.auditResult.feedAudit.score}
          issueCount={
            store.auditResult.bioAudit.issues.length +
            store.auditResult.feedAudit.redFlags.length
          }
          onEmailSubmit={handleEmailSubmit}
          isSubmitting={false}
        />
      )}

      {/* STEP: results */}
      {store.step === 'results' && store.auditResult && (
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Your Content Audit</h1>
            <p className="text-gray-500 mt-1">
              @{store.instagramHandle || 'your profile'}
            </p>
            <div className="mt-2">
              {store.profile?.source === 'apify' ? (
                <span className="inline-block text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                  ✓ Profile pulled automatically
                </span>
              ) : (
                <span className="inline-block text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                  Based on uploaded screenshots
                </span>
              )}
            </div>
          </div>

          <BioAuditCard
            result={store.auditResult.bioAudit}
            currentBio={store.profile?.bio ?? ''}
          />
          <FeedAuditCard result={store.auditResult.feedAudit} />
          <GamePlanCard result={store.auditResult.gamePlan} />
          <BAMxUpsell />

          <div className="pb-4">
            <button
              type="button"
              onClick={handleStartOver}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Run another audit
            </button>
          </div>
        </div>
      )}

      {/* Mobile step indicator — hidden on md and above */}
      {stepLabel && (
        <div
          className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 px-4 pt-3 z-10"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          <p className="text-xs text-center text-gray-500 font-medium">{stepLabel}</p>
        </div>
      )}
      </div>
    </div>
  )
}
