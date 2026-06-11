import { NextRequest, NextResponse } from 'next/server'
import { EmailCaptureSchema } from '@/lib/schemas'
import { appendAuditRow } from '@/lib/googleSheets'
import { sendAuditResultsEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const parsed = EmailCaptureSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const {
      email, instagramHandle, submittedBio, rewrittenBio,
      market, experience, agentRole, knownFor, enjoyPosting,
      postingFrequency, referralSource, bioScore, feedScore,
      auditSummary, auditResult,
    } = parsed.data

    // GHL — CRM contact capture only (fire and forget)
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

    // Kit — Viral Agent Newsletter subscription (fire and forget)
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

    // Email then Sheets run sequentially in background IIFE
    // Sheets runs after email so emailSentStatus is accurate
    ;(async () => {
      let emailSentStatus: 'sent' | 'failed' | 'skipped' = 'skipped'

      if (process.env.RESEND_API_KEY && auditResult) {
        try {
          await sendAuditResultsEmail({
            to: email,
            instagramHandle: instagramHandle ?? '',
            submittedBio: submittedBio ?? '',
            auditResult,
          })
          emailSentStatus = 'sent'
        } catch (err) {
          console.error('Resend error:', err)
          emailSentStatus = 'failed'
        }
      }

      if (process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
        appendAuditRow({
          email,
          instagramHandle,
          submittedBio,
          rewrittenBio,
          market,
          experience,
          agentRole,
          knownFor,
          enjoyPosting,
          postingFrequency,
          referralSource,
          bioScore,
          feedScore,
          auditSummary,
          emailSentStatus,
        }).catch((err) => console.error('Sheets append error:', err))
      }
    })()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Capture email unexpected error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
