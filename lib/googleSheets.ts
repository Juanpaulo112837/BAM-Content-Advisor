import 'server-only'
import { google } from 'googleapis'

export interface AuditRowData {
  email: string
  instagramHandle?: string
  submittedBio?: string
  rewrittenBio?: string
  market?: string
  experience?: string
  agentRole?: string
  knownFor?: string
  enjoyPosting?: string
  postingFrequency?: string
  referralSource?: string
  bioScore?: number | null
  feedScore?: number | null
  auditSummary?: string
  emailSentStatus?: 'sent' | 'failed' | 'skipped'
}

export async function appendAuditRow(data: AuditRowData): Promise<void> {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const tabName = process.env.GOOGLE_SHEETS_TAB_NAME ?? 'Audit Submissions'

  if (!clientEmail || !privateKey || !spreadsheetId) return

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tabName}!A:Q`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toISOString(),           // A: Timestamp
        data.email,                         // B: Email
        data.instagramHandle ?? '',         // C: Instagram Handle
        data.submittedBio ?? '',            // D: Submitted Bio
        data.rewrittenBio ?? '',            // E: Rewritten Bio
        data.market ?? '',                  // F: Market
        data.experience ?? '',              // G: Experience
        data.agentRole ?? '',               // H: Agent Role
        data.knownFor ?? '',                // I: Known For
        data.enjoyPosting ?? '',            // J: Enjoy Posting
        data.postingFrequency ?? '',        // K: Posting Frequency
        data.referralSource ?? '',          // L: Referral Source
        data.bioScore ?? '',                // M: Bio Score
        data.feedScore ?? '',               // N: Feed Score
        data.auditSummary ?? '',            // O: Audit Summary
        'bam-content-advisor',              // P: Source
        data.emailSentStatus ?? 'skipped',  // Q: Email Sent Status
      ]],
    },
  })
}
