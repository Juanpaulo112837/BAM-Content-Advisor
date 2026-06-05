export interface InstagramProfile {
  username: string
  bio: string
  fullName: string
  followersCount: number
  postsCount: number
  recentPosts: InstagramPost[]
  source: 'apify' | 'screenshots'
}

export interface InstagramPost {
  caption: string
  timestamp: string
  type: 'image' | 'video' | 'carousel' | 'reel'
}

export interface OnboardingAnswers {
  market: string
  experience: string
  knownFor: string
  enjoyPosting: string
  postingFrequency: 'consistently' | 'occasionally' | 'barely'
}

export interface BioAudit {
  score: number
  issues: string[]
  rewrittenBio: string
  explanation: string
}

export interface FeedAudit {
  score: number
  whatIsWorking: string[]
  whatIsMissing: string[]
  whatToStop: string[]
  contentMixAnalysis: {
    authorityContent: number
    personalityContent: number
    localContent: number
    listingContent: number
  }
  redFlags: string[]
}

export interface GamePlanAction {
  priority: number
  action: string
  why: string
  howToStart: string
}

export interface GamePlan {
  actions: GamePlanAction[]
}

export interface AuditResult {
  bioAudit: BioAudit
  feedAudit: FeedAudit
  gamePlan: GamePlan
}

export type AuditStep = 'input' | 'onboarding' | 'loading' | 'email-gate' | 'results'
