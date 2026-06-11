'use client'

const BAMX_URL = process.env.NEXT_PUBLIC_BAMX_URL ?? '#'

export default function BAMxUpsell() {
  return (
    <div className="bg-amber-50 rounded-xl p-8 space-y-4">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
        Want more?
      </p>

      <p className="text-gray-800 text-base leading-relaxed">
        BAMx members get live sessions with Eric every month, where he pulls up member
        profiles on the spot and gives direct feedback based on what&apos;s actually
        moving right now. If you want Eric to actually look at your page, this is where
        that happens.
      </p>

      <p className="text-gray-800 text-base leading-relaxed">
        You also get a full content playbook every week in BAMx. No researching what&apos;s
        trending, no staring at a blank screen. Just ready-to-use posts, captions, and
        email scripts that are highly customizable. So even on your busiest weeks, you
        always have something to post.
      </p>

      <a
        href={BAMX_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full sm:w-auto text-center bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
      >
        Join BAMx →
      </a>
    </div>
  )
}

interface Testimonial {
  quote: string
  name: string
  location: string
}

const TESTIMONIALS: Testimonial[] = []

export function TestimonialsSection() {
  if (TESTIMONIALS.length === 0) return null
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">What agents are saying</h3>
      {TESTIMONIALS.map((t, i) => (
        <div key={i} className="border rounded-xl p-4">
          <p className="text-sm text-gray-700">&ldquo;{t.quote}&rdquo;</p>
          <p className="text-xs text-gray-500 mt-2">— {t.name}, {t.location}</p>
        </div>
      ))}
    </div>
  )
}
