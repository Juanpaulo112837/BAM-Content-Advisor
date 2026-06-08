'use client'

const BAMX_URL = process.env.NEXT_PUBLIC_BAMX_URL ?? '#'

export default function BAMxUpsell() {
  return (
    <div className="bg-amber-50 rounded-xl p-8 space-y-4">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
        Want more?
      </p>

      <p className="text-gray-800 text-base leading-relaxed">
        This audit is built on the same frameworks Eric uses in the BAMx Content Audits —
        his monthly live session where he reviews real agents&apos; profiles on the spot and
        tells them exactly what to fix. BAMx members also get a full content drop every
        week: posts, captions, and email scripts you can customize and use. If you want
        Eric to actually look at your page, that&apos;s where it happens.
      </p>

      <div className="space-y-2">
        <a
          href={BAMX_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full sm:w-auto text-center bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
        >
          Learn about BAMx →
        </a>
        <p className="text-xs text-gray-400">
          Eric&apos;s monthly live content audits + weekly content drops
        </p>
      </div>
    </div>
  )
}
