import { NextRequest, NextResponse } from 'next/server'
import { EmailCaptureSchema } from '@/lib/schemas'

export async function POST(req: NextRequest) {
  try {
    const parsed = EmailCaptureSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const { email, instagramHandle, market } = parsed.data

    // GoHighLevel — fire and forget
    if (process.env.GHL_WEBHOOK_URL) {
      fetch(process.env.GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          instagram: instagramHandle,
          market,
          source: 'bam-content-advisor',
          tags: ['content-audit', 'free-tool'],
        }),
      }).catch((err) => console.error('GHL webhook error:', err))
    }

    // Kit — subscribe to Viral Agent Newsletter, fire and forget
    if (process.env.KIT_API_KEY && process.env.KIT_FORM_ID) {
      fetch(
        `https://api.convertkit.com/v3/forms/${process.env.KIT_FORM_ID}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.KIT_API_KEY,
            email,
            tags: process.env.KIT_TAG_ID ? [Number(process.env.KIT_TAG_ID)] : undefined,
          }),
        }
      ).catch((err) => console.error('Kit subscribe error:', err))
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Capture email unexpected error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
