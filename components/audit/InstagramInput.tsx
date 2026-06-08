'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Camera, Loader2, X } from 'lucide-react'
import { cleanInstagramHandle } from '@/lib/utils'

interface Props {
  mode: 'handle' | 'screenshot-fallback'
  fallbackMessage?: string
  onHandleSubmit: (handle: string) => void
  onUploaded: (urls: string[]) => void
  isLoadingHandle: boolean
  isMobile?: boolean
}

const MAX_FILE_SIZE = 10 * 1024 * 1024

export default function InstagramInput({
  mode,
  fallbackMessage,
  onHandleSubmit,
  onUploaded,
  isLoadingHandle,
  isMobile = false,
}: Props) {
  const [handleInput, setHandleInput] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [noInputError, setNoInputError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previews])

  function validateAndAddFiles(incoming: FileList | null) {
    if (!incoming) return
    setUploadError(null)

    const valid: File[] = []
    for (const file of Array.from(incoming)) {
      if (!file.type.startsWith('image/')) {
        setUploadError(`"${file.name}" is not an image. Only images allowed.`)
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`"${file.name}" exceeds the 10MB limit.`)
        return
      }
      valid.push(file)
    }

    const combined = [...files, ...valid].slice(0, 5)
    const newPreviews = valid.slice(0, 5 - files.length).map((f) => URL.createObjectURL(f))
    setFiles(combined)
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, 5))
  }

  function removeFile(index: number) {
    URL.revokeObjectURL(previews[index])
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        const MAX = 1200
        let w = img.naturalWidth
        let h = img.naturalHeight
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX }
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Failed to load image')) }
      img.src = objectUrl
    })
  }

  async function handleUploadSubmit() {
    if (files.length === 0) return
    setIsUploading(true)
    setUploadError(null)
    try {
      const urls = await Promise.all(files.map(compressImage))
      onUploaded(urls)
    } catch {
      setUploadError('Could not process images. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  function handleHandleSubmit() {
    const clean = cleanInstagramHandle(handleInput)
    if (clean) {
      setNoInputError(null)
      onHandleSubmit(clean)
    } else if (files.length === 0) {
      setNoInputError('Please upload screenshots or enter your Instagram handle.')
    }
  }

  const uploadArea = (large = false) => (
    <div className="space-y-3">
      <div
        className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer
          ${large ? 'min-h-[160px]' : 'min-h-[120px]'}
          ${isDragOver ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragOver(false)
          validateAndAddFiles(e.dataTransfer.files)
        }}
      >
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <Camera className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 md:hidden">Tap to add photos</p>
          <p className="text-sm text-gray-500 hidden md:block">
            Click or drop screenshots here
          </p>
          <p className="text-xs text-gray-400 mt-1">Up to 5 images, max 10MB each</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => validateAndAddFiles(e.target.files)}
        />
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative w-[60px] h-[60px] rounded-lg overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                className="absolute top-0 right-0 bg-black/70 text-white rounded-bl-lg p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadError && (
        <p className="text-sm text-red-600">{uploadError}</p>
      )}

      {files.length > 0 && (
        <button
          type="button"
          onClick={handleUploadSubmit}
          disabled={isUploading}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-60"
        >
          {isUploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
          ) : (
            'Analyze My Screenshots →'
          )}
        </button>
      )}
    </div>
  )

  if (mode === 'screenshot-fallback') {
    return (
      <div className="space-y-5">
        {fallbackMessage && (
          <div className="flex gap-3 items-start bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm">{fallbackMessage}</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-1">Upload screenshots</h2>
          <p className="text-sm text-gray-500 mb-4">Works for any profile, public or private.</p>
          {uploadArea(true)}
        </div>

        <button
          type="button"
          onClick={() => onHandleSubmit('')}
          className="text-sm text-gray-500 underline hover:text-gray-700"
        >
          Try a different handle →
        </button>
      </div>
    )
  }

  const handleSection = (
    <div>
      <h2 className="text-lg font-semibold mb-3">Enter your Instagram handle</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={handleInput ? `@${handleInput}` : ''}
          placeholder="@yourusername"
          disabled={isLoadingHandle}
          onChange={(e) => {
            setHandleInput(cleanInstagramHandle(e.target.value))
            setNoInputError(null)
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleHandleSubmit()}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleHandleSubmit}
          disabled={isLoadingHandle || !handleInput}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {isLoadingHandle ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
          ) : (
            'Pull My Profile →'
          )}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1.5">Must be a public profile</p>
    </div>
  )

  const uploadSection = (
    <div>
      <h2 className="text-lg font-semibold mb-1">Upload screenshots instead</h2>
      <p className="text-sm text-gray-500 mb-3">Works for any profile, public or private.</p>
      {uploadArea(false)}
    </div>
  )

  const divider = (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-sm text-gray-400">or</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )

  return (
    <div className="space-y-6">
      {noInputError && (
        <p className="text-sm text-red-600">{noInputError}</p>
      )}
      {isMobile ? (
        <>{uploadSection}{divider}{handleSection}</>
      ) : (
        <>{handleSection}{divider}{uploadSection}</>
      )}
    </div>
  )
}
