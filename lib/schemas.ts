import { z } from 'zod'

export const OnboardingAnswersSchema = z.object({
  market: z.string().min(2).max(300),
  experience: z.string().min(1).max(100),
  knownFor: z.string().min(2).max(300),
  enjoyPosting: z.string().min(2).max(300),
  postingFrequency: z.enum(['consistently', 'occasionally', 'barely']),
})

export const AuditRequestSchema = z.object({
  profile: z.object({
    username: z.string(),
    bio: z.string(),
    recentPosts: z.array(
      z.object({
        caption: z.string(),
        type: z.string(),
        timestamp: z.string(),
      })
    ),
  }),
  onboarding: OnboardingAnswersSchema,
  screenshotUrls: z.array(z.string().min(1)).max(5).optional(),
})

export const EmailCaptureSchema = z.object({
  email: z.string().email(),
  instagramHandle: z.string().optional(),
  market: z.string().optional(),
})

export const BioAuditSchema = z.object({
  score: z.number().min(1).max(10),
  issues: z.array(z.string()).min(1).max(8),
  rewrittenBio: z.string().max(160),
  explanation: z.string(),
})

export const FeedAuditSchema = z.object({
  score: z.number().min(1).max(10),
  whatIsWorking: z.array(z.string()),
  whatIsMissing: z.array(z.string()),
  whatToStop: z.array(z.string()),
  contentMixAnalysis: z.object({
    authorityContent: z.number().min(0).max(100),
    personalityContent: z.number().min(0).max(100),
    localContent: z.number().min(0).max(100),
    listingContent: z.number().min(0).max(100),
  }),
  redFlags: z.array(z.string()).max(6),
})

export const GamePlanSchema = z.object({
  actions: z
    .array(
      z.object({
        priority: z.number(),
        action: z.string().max(80),
        why: z.string(),
        howToStart: z.string(),
      })
    )
    .min(3)
    .max(5),
})

export const AuditResultSchema = z.object({
  bioAudit: BioAuditSchema,
  feedAudit: FeedAuditSchema,
  gamePlan: GamePlanSchema,
})

export type OnboardingAnswers = z.infer<typeof OnboardingAnswersSchema>
export type AuditRequest = z.infer<typeof AuditRequestSchema>
export type EmailCapture = z.infer<typeof EmailCaptureSchema>
export type BioAudit = z.infer<typeof BioAuditSchema>
export type FeedAudit = z.infer<typeof FeedAuditSchema>
export type GamePlan = z.infer<typeof GamePlanSchema>
export type AuditResult = z.infer<typeof AuditResultSchema>
