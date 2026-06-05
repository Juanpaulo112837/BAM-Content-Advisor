import { InstagramProfile, InstagramPost } from '@/types'

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN

function cleanUsername(input: string): string {
  return input
    .replace(/^@/, '')
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
    .replace(/\/+$/, '')
    .trim()
}

function mapPost(post: any): InstagramPost {
  let type: InstagramPost['type'] = 'image'
  if (post.type === 'Video' || post.is_video === true) {
    type = 'video'
  } else if (post.type === 'Sidecar' || post.is_sidecar === true) {
    type = 'carousel'
  } else if (post.product_type === 'clips') {
    type = 'reel'
  }

  return {
    caption: post.caption || '',
    timestamp: post.timestamp || post.taken_at_timestamp || '',
    type,
  }
}

function mapToProfile(raw: any, username: string): InstagramProfile {
  return {
    username,
    bio: raw.biography || raw.bio || '',
    fullName: raw.fullName || raw.full_name || '',
    followersCount: raw.followersCount || raw.followers_count || 0,
    postsCount: raw.postsCount || raw.posts_count || 0,
    source: 'apify',
    recentPosts: (raw.latestPosts || raw.posts || []).map(mapPost),
  }
}

async function pollApifyRun(runId: string): Promise<any | null> {
  const maxAttempts = 20
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  for (let i = 0; i < maxAttempts; i++) {
    await delay(2000)

    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_TOKEN}`
    )
    const { data } = await statusRes.json()

    if (data.status === 'SUCCEEDED') {
      const datasetRes = await fetch(
        `https://api.apify.com/v2/datasets/${data.defaultDatasetId}/items?token=${APIFY_API_TOKEN}`
      )
      const items = await datasetRes.json()
      return items[0] || null
    }

    if (data.status === 'FAILED' || data.status === 'ABORTED') {
      return null
    }
  }

  return null
}

export async function scrapeInstagramProfile(
  username: string
): Promise<InstagramProfile | null> {
  const cleanedUsername = cleanUsername(username)

  if (!cleanedUsername || cleanedUsername.length > 30) {
    throw new Error('Invalid Instagram username')
  }

  const runRes = await fetch(
    `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs?token=${APIFY_API_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [cleanedUsername], resultsLimit: 18 }),
    }
  )

  if (!runRes.ok) {
    throw new Error('Apify failed to start')
  }

  const { data: run } = await runRes.json()
  const raw = await pollApifyRun(run.id)

  if (!raw) return null

  return mapToProfile(raw, cleanedUsername)
}
