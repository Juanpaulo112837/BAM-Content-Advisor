import { NextRequest, NextResponse } from 'next/server'
import { EmailCaptureSchema } from '@/lib/schemas'

export async function POST(req: NextRequest) {
  try {
    const parsed = EmailCaptureSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const { email, instagramHandle, market } = parsed.data

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

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Capture email unexpected error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
