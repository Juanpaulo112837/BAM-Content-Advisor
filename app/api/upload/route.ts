import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const files = formData.getAll('screenshots') as File[]

  if (files.length === 0 || files.length > 5) {
    return NextResponse.json(
      { error: 'Please upload between 1 and 5 screenshots' },
      { status: 400 }
    )
  }

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: `"${file.name}" is not an image. Only image files are allowed.` },
        { status: 400 }
      )
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `"${file.name}" exceeds the 10MB size limit.` },
        { status: 400 }
      )
    }
  }

  try {
    const uploads = await Promise.all(
      files.map((file) =>
        put(`audit-uploads/${Date.now()}-${file.name}`, file, {
          access: 'public',
          addRandomSuffix: true,
        })
      )
    )

    const urls = uploads.map((result) => result.url)
    return NextResponse.json({ urls })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}
