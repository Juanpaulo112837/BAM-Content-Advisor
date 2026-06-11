import 'server-only'
import { Resend } from 'resend'
import type { AuditResult } from '@/types'

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendAuditResultsEmail({
  to,
  instagramHandle,
  submittedBio,
  auditResult,
}: {
  to: string
  instagramHandle: string
  submittedBio: string
  auditResult: AuditResult
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { bioAudit, feedAudit, gamePlan } = auditResult
  const topRecommendations = gamePlan.actions.slice(0, 3)
  const bamxUrl = process.env.NEXT_PUBLIC_BAMX_URL ?? 'https://www.skool.com/bamx'

  const recommendationsHtml = topRecommendations
    .map(
      (a) => `
    <div style="border-left:3px solid #000;padding:12px 16px;margin-bottom:12px;background:#f9f9f9;border-radius:0 6px 6px 0;">
      <p style="margin:0 0 4px;font-weight:600;font-size:14px;color:#111;">${esc(a.action)}</p>
      <p style="margin:0 0 6px;font-size:13px;color:#555;">${esc(a.why)}</p>
      <p style="margin:0;font-size:13px;color:#333;"><strong>Start here:</strong> ${esc(a.howToStart)}</p>
    </div>`
    )
    .join('')

  const submittedBioHtml = submittedBio
    ? `<div style="margin-bottom:12px;">
        <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#999;font-weight:600;">Current bio</p>
        <p style="margin:0;font-size:14px;color:#555;padding:10px 12px;background:#f5f5f5;border-radius:6px;">${esc(submittedBio)}</p>
      </div>`
    : ''

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your Instagram Audit Results</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px 16px;color:#111;background:#fff;">

  <h1 style="font-size:22px;font-weight:700;margin:0 0 4px;">Your Instagram Content Audit</h1>
  <p style="margin:0 0 28px;color:#666;font-size:14px;">@${esc(instagramHandle)}</p>

  <!-- Scores -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
    <tr>
      <td width="48%" style="background:#f5f5f5;border-radius:10px;padding:16px;text-align:center;">
        <p style="margin:0;font-size:28px;font-weight:700;color:#111;">${bioAudit.score}/10</p>
        <p style="margin:4px 0 0;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Bio Score</p>
      </td>
      <td width="4%"></td>
      <td width="48%" style="background:#f5f5f5;border-radius:10px;padding:16px;text-align:center;">
        <p style="margin:0;font-size:28px;font-weight:700;color:#111;">${feedAudit.score}/10</p>
        <p style="margin:4px 0 0;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Feed Score</p>
      </td>
    </tr>
  </table>

  <!-- Bio section -->
  <h2 style="font-size:16px;font-weight:700;margin:0 0 12px;">Your Bio</h2>
  ${submittedBioHtml}
  <div style="margin-bottom:28px;">
    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#999;font-weight:600;">Rewritten</p>
    <p style="margin:0;font-size:14px;padding:10px 12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;color:#111;">${esc(bioAudit.rewrittenBio)}</p>
  </div>

  <!-- Top Recommendations -->
  <h2 style="font-size:16px;font-weight:700;margin:0 0 12px;">Top Recommendations</h2>
  ${recommendationsHtml}

  <div style="margin:32px 0;height:1px;background:#e5e5e5;"></div>

  <!-- BAMx CTA -->
  <div style="background:#fffbeb;border-radius:12px;padding:24px;margin-bottom:32px;">
    <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#92400e;font-weight:600;">Want more?</p>

    <p style="margin:0 0 14px;font-size:14px;line-height:1.65;color:#1c1917;">
      BAMx members get live sessions with Eric every month, where he pulls up member profiles
      on the spot and gives direct feedback based on what&apos;s actually moving right now.
      If you want Eric to actually look at your page, this is where that happens.
    </p>

    <p style="margin:0 0 20px;font-size:14px;line-height:1.65;color:#1c1917;">
      You also get a full content playbook every week in BAMx. No researching what&apos;s trending,
      no staring at a blank screen. Just ready-to-use posts, captions, and email scripts that
      are highly customizable. So even on your busiest weeks, you always have something to post.
    </p>

    <a href="${bamxUrl}" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      Join BAMx &rarr;
    </a>
  </div>

  <p style="font-size:12px;color:#999;margin:0;">
    You&apos;re receiving this because you ran a free content audit at the BAM Content Advisor.
  </p>

</body>
</html>`

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'audit@nowbam.com',
    to,
    subject: `Your Instagram Audit Results — @${instagramHandle}`,
    html,
  })
}
