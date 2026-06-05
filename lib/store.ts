import { create } from 'zustand'
import { AuditStep, InstagramProfile, OnboardingAnswers, AuditResult } from '@/types'

interface AuditStore {
  // State
  step: AuditStep
  screenshotUrls: string[]
  instagramHandle: string
  profile: InstagramProfile | null
  onboarding: OnboardingAnswers | null
  email: string
  auditResult: AuditResult | null
  error: string | null
  isLoading: boolean

  // Actions
  setStep: (step: AuditStep) => void
  setScreenshotUrls: (urls: string[]) => void
  setInstagramHandle: (handle: string) => void
  setProfile: (profile: InstagramProfile | null) => void
  setOnboarding: (answers: OnboardingAnswers) => void
  setEmail: (email: string) => void
  setAuditResult: (result: AuditResult) => void
  setError: (error: string | null) => void
  setIsLoading: (loading: boolean) => void
  reset: () => void
}

const initialState = {
  step: 'input' as AuditStep,
  screenshotUrls: [] as string[],
  instagramHandle: '',
  profile: null,
  onboarding: null,
  email: '',
  auditResult: null,
  error: null,
  isLoading: false,
}

export const useAuditStore = create<AuditStore>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setScreenshotUrls: (screenshotUrls) => set({ screenshotUrls }),
  setInstagramHandle: (instagramHandle) => set({ instagramHandle }),
  setProfile: (profile) => set({ profile }),
  setOnboarding: (onboarding) => set({ onboarding }),
  setEmail: (email) => set({ email }),
  setAuditResult: (auditResult) => set({ auditResult }),
  setError: (error) => set({ error }),
  setIsLoading: (isLoading) => set({ isLoading }),
  reset: () => set(initialState),
}))
