import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFollowers(count: number): string {
  if (count < 1000) return String(count)
  if (count < 1_000_000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
}

export function getScoreColor(score: number): string {
  if (score <= 4) return 'text-red-600'
  if (score <= 6) return 'text-yellow-600'
  if (score <= 8) return 'text-blue-600'
  return 'text-green-600'
}

export function getScoreLabel(score: number): string {
  if (score <= 4) return 'Needs Work'
  if (score <= 6) return 'Getting There'
  if (score <= 8) return 'Pretty Good'
  return 'Solid'
}

export function truncateCaption(caption: string, maxLength: number = 120): string {
  if (caption.length <= maxLength) return caption
  return caption.slice(0, maxLength) + '...'
}

export function cleanInstagramHandle(input: string): string {
  return input
    .replace(/^@/, '')
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
    .replace(/\/+$/, '')
    .trim()
}
