import Link from 'next/link'
import Image from 'next/image'
import { ClipboardList, Sparkles, Upload } from 'lucide-react'

function CtaButton() {
  return (
    <div className="space-y-2">
      <Link
        href="/audit"
        className="inline-block bg-black text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-gray-800 transition-colors w-full sm:w-auto text-center"
      >
        Audit My Profile — It&apos;s Free →
      </Link>
      <p className="text-sm text-gray-400">No account needed. Takes about 2 minutes.</p>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-3">
        <div className="max-w-4xl mx-auto">
          <Image
            src="/logo.png"
            alt="BAMx"
            width={100}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </div>
      </nav>

      <main className="flex-1">
        {/* SECTION 1 — Hero */}
        <section className="max-w-4xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl space-y-6">
            <div className="inline-block bg-amber-400 text-black text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Free Tool
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Get Roasted.
              <br />
              Get Better.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
              The Broke Agent&apos;s AI tool audits your Instagram profile and tells you
              exactly what to fix — in Eric&apos;s words, not corporate BS.
            </p>
            <CtaButton />
          </div>
        </section>

        {/* SECTION 2 — How it works */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-10">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Upload className="w-6 h-6" />,
                  title: 'Upload your screenshots',
                  desc: 'Take a few screenshots of your bio and recent posts. Or enter your handle and we\'ll pull your public profile.',
                },
                {
                  icon: <Sparkles className="w-6 h-6" />,
                  title: 'AI runs the audit',
                  desc: 'We run your profile through Eric\'s content frameworks — the same ones he uses in BAMx live audits.',
                },
                {
                  icon: <ClipboardList className="w-6 h-6" />,
                  title: 'Get your game plan',
                  desc: 'Rewritten bio, feed breakdown, and 3–5 specific actions you can start today.',
                },
              ].map((step, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center shrink-0">
                      {step.icon}
                    </div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — What you get */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-10">What&apos;s in the audit</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Bio Audit',
                  desc: 'We rewrite your bio from scratch using Eric\'s framework. You get the new bio ready to copy-paste, plus an explanation of every change.',
                },
                {
                  title: 'Feed Audit',
                  desc: 'We break down your content mix, call out the red flags Eric would spot in 10 seconds, and show you exactly what\'s missing.',
                },
                {
                  title: 'Game Plan',
                  desc: '3–5 prioritized actions in Eric\'s voice. Direct. Specific. No fluff.',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl p-6 space-y-2 hover:border-gray-400 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <h3 className="font-semibold text-base">{card.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — Final CTA */}
        <section className="bg-gray-950 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Your page is being judged anyway.
            </h2>
            <p className="text-gray-400 text-base md:text-lg">
              Might as well know what people are actually seeing.
            </p>
            <div className="pt-2 flex flex-col items-center space-y-2">
              <Link
                href="/audit"
                className="inline-block bg-amber-400 text-black px-8 py-4 rounded-lg font-semibold text-base hover:bg-amber-300 transition-colors"
              >
                Audit My Profile — It&apos;s Free →
              </Link>
              <p className="text-sm text-gray-500">No account needed. Takes about 2 minutes.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-400">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="BAMx" width={60} height={24} className="h-6 w-auto opacity-60" />
            <span>Content Advisor — Built on Eric Simon&apos;s frameworks</span>
          </div>
          <span>© 2025 BAM Media</span>
        </div>
      </footer>
    </div>
  )
}
