import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/prompts/system'
import { buildAuditPrompt } from '@/lib/claude'
import { AuditRequestSchema, AuditResultSchema } from '@/lib/schemas'

export const maxDuration = 60

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://bam.com',
    'X-Title': 'BAM Content Advisor',
  },
})

const MODEL = process.env.OPENROUTER_MODEL ?? 'anthropic/claude-sonnet-4-5'

const rateLimitStore = new Map<string, number>()

type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } }

function parseAuditJson(text: string): unknown {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  return JSON.parse(cleaned)
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const lastRequest = rateLimitStore.get(ip)
  if (lastRequest && Date.now() - lastRequest < 90_000) {
    return NextResponse.json(
      { message: 'Please wait before running another audit.' },
      { status: 429 }
    )
  }
  rateLimitStore.set(ip, Date.now())

  const parsed = AuditRequestSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid request data.' }, { status: 400 })
  }

  const { profile, onboarding, screenshotUrls } = parsed.data

  try {
    const userPrompt = buildAuditPrompt(profile as any, onboarding, screenshotUrls)

    const userContent: ContentPart[] = []

    if (screenshotUrls && screenshotUrls.length > 0) {
      userContent.push({
        type: 'text',
        text: "Here are the agent's Instagram screenshots:",
      })
      for (const url of screenshotUrls) {
        userContent.push({ type: 'image_url', image_url: { url } })
      }
    }

    userContent.push({ type: 'text', text: userPrompt })

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ]

    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 4000,
      messages,
    })

    const rawText = completion.choices[0]?.message?.content ?? ''

    let auditJson: unknown
    try {
      auditJson = parseAuditJson(rawText)
    } catch {
      // Retry with explicit JSON instruction
      const retry = await client.chat.completions.create({
        model: MODEL,
        max_tokens: 4000,
        messages: [
          ...messages,
          { role: 'assistant', content: rawText },
          {
            role: 'user',
            content:
              'Your previous response was not valid JSON. Return only the JSON object, no other text, no markdown code fences.',
          },
        ],
      })
      const retryText = retry.choices[0]?.message?.content ?? ''
      auditJson = parseAuditJson(retryText)
    }

    const validated = AuditResultSchema.safeParse(auditJson)
    if (!validated.success) {
      console.error('Audit schema validation failed:', rawText)
      return NextResponse.json(
        { message: 'Audit generation failed. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ audit: validated.data })
  } catch (err) {
    console.error('Audit error:', err)
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
