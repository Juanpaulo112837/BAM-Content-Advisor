import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { scrapeInstagramProfile } from '@/lib/apify'

export const maxDuration = 60

const RequestSchema = z.object({
  username: z.string().min(1).max(50),
})

export async function POST(req: NextRequest) {
  let body
  try {
    body = RequestSchema.parse(await req.json())
  } catch {
    return NextResponse.json(
      { error: 'invalid_input', message: 'Please enter a valid Instagram username.' },
      { status: 400 }
    )
  }

  try {
    const profile = await scrapeInstagramProfile(body.username)

    if (!profile) {
      return NextResponse.json({
        status: 'not_found',
        message:
          'We could not find that profile. It may be private or the username may be incorrect. You can upload screenshots instead.',
      })
    }

    if (profile.recentPosts.length === 0) {
      return NextResponse.json({
        status: 'partial',
        profile,
        message: 'Profile found but posts could not be read. Your audit will focus on the bio.',
      })
    }

    return NextResponse.json({ status: 'success', profile })
  } catch (err: any) {
    const message: string = err?.message ?? ''

    if (
      message.includes('Apify failed to start') ||
      message.includes('fetch failed') ||
      err instanceof TypeError
    ) {
      return NextResponse.json({
        status: 'apify_unavailable',
        message:
          'Automatic profile loading is unavailable right now. Please upload screenshots of your profile instead.',
      })
    }

    console.error('Scrape error:', err)
    return NextResponse.json({
      status: 'apify_unavailable',
      message: 'Something went wrong loading your profile. Please upload screenshots instead.',
    })
  }
}
