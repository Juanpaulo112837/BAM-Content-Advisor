import { InstagramProfile, OnboardingAnswers } from '@/types'

const FREQUENCY_LABELS: Record<OnboardingAnswers['postingFrequency'], string> = {
  consistently: 'Consistently (multiple times per week)',
  occasionally: 'Occasionally (once a week or less)',
  barely: 'Barely at all (a few times a month or less)',
}

const ROLE_LABELS: Record<OnboardingAnswers['agentRole'], string> = {
  solo: 'Solo agent (independent)',
  'team-agent': 'Agent on a team',
  'team-leader': 'Team leader',
  broker: 'Broker/owner',
}

export function buildAuditPrompt(
  profile: InstagramProfile,
  onboarding: OnboardingAnswers,
  screenshotUrls?: string[]
): string {
  const bio = profile.bio.trim()
    ? profile.bio
    : '[Bio is empty — this is itself a problem]'

  const postsSection =
    profile.recentPosts.length === 0
      ? '[No posts available — analysis based on screenshots only]'
      : profile.recentPosts
          .map((post, i) => {
            const caption =
              post.caption.trim() === ''
                ? '[no caption]'
                : post.caption.length > 180
                ? post.caption.slice(0, 180) + '...'
                : post.caption
            return `${i + 1}. (${post.type}) ${caption}`
          })
          .join('\n')

  const prompt = `## AGENT'S INSTAGRAM PROFILE DATA

Handle: @${profile.username}
Total Posts: ${profile.postsCount}

Current Bio:
${bio}

Recent Posts:
${postsSection}

---

## AGENT'S ONBOARDING ANSWERS

Market/City: ${onboarding.market}
Years in Real Estate: ${onboarding.experience}
Agent role: ${ROLE_LABELS[onboarding.agentRole]}
What they want to be known for: ${onboarding.knownFor}
What they enjoy posting about: ${onboarding.enjoyPosting}
Posting frequency: ${FREQUENCY_LABELS[onboarding.postingFrequency]}

---

Run the full content audit on this agent's profile. Return only the JSON audit result. Reference their actual bio text and actual post captions where relevant — do not give generic advice. If their feed is over 60% listing posts, flag it as a red flag. If their bio is empty or missing required elements, say so directly in Eric's voice. If they post barely at all, make posting consistency the first action item in the game plan.${
    screenshotUrls && screenshotUrls.length > 0
      ? '\nIf screenshot images have been provided above, use them as additional visual context for your analysis.'
      : ''
  }`

  return prompt
}
