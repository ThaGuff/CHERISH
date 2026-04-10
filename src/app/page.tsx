import Link from "next/link";

const features = [
  {
    icon: "⚡",
    title: "Quick Snap",
    desc: "Photo + note + voice in 60 seconds. Capture the moment with one hand.",
  },
  {
    icon: "📖",
    title: "Journal & Diary",
    desc: "6 beautiful templates with prompts. Write with or without photos.",
  },
  {
    icon: "🎨",
    title: "Scrapbook Pages",
    desc: "Drag-and-drop canvas with stickers, frames, ribbons, and captions.",
  },
  {
    icon: "✨",
    title: "Full Memory",
    desc: "Scrapbook + journal combined. The complete story, beautifully told.",
  },
  {
    icon: "🌀",
    title: "Vision Board & Collage",
    desc: "Free canvas with no rules. Cut, layer, and create pure visual chaos.",
  },
  {
    icon: "✍️",
    title: "Creative Studio",
    desc: "Blog drafts, stories, song lyrics, ideas. Your creative space.",
  },
];

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "10 pages per month",
      "1 memory book",
      "Basic stickers",
      "Private entries",
      "Cloud backup",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$7.99",
    period: "/month",
    features: [
      "Unlimited pages & books",
      "All stickers & themes",
      "PDF export & print-to-bind",
      "Voice memos & transcription",
      "Family Circle sharing",
      "On This Day memories",
    ],
    cta: "Start Pro Trial",
    highlight: true,
  },
  {
    name: "Family",
    price: "$99.99",
    period: "/year",
    features: [
      "Pro for up to 5 members",
      "Shared memory books",
      "Family Circle premium",
      "All sticker packs",
      "Print-to-bind books",
    ],
    cta: "Start Family Plan",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cherish-50">
      {/* ── NAV ─────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cherish-50/80 backdrop-blur-xl border-b border-cherish-300/30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-cherish-500">
            Cherish.
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">
              Sign in
            </Link>
            <Link href="/signup" className="btn-primary text-sm !py-2 !px-5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────── */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-cherish-500 font-medium text-sm tracking-wide uppercase mb-4">
            Private · Beautiful · Yours
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-cherish-900 leading-[1.1] mb-6">
            The moments pass.
            <br />
            <span className="text-cherish-500 italic">
              The memories don&apos;t have to.
            </span>
          </h1>
          <p className="text-lg text-cherish-900/60 max-w-xl mx-auto mb-10 font-body">
            A privacy-first digital memory keeper that combines scrapbooking,
            journaling, voice capture, and family sharing — all in one beautiful
            place. Capture in the moment. Design at your own pace. Print and
            hold it forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary text-base px-8 py-4">
              Create Your Free Account
            </Link>
            <Link href="#features" className="btn-outline text-base px-8 py-4">
              See How It Works
            </Link>
          </div>
          <p className="text-xs text-cherish-900/40 mt-4">
            Free forever · No credit card required
          </p>
        </div>
      </section>

      {/* ── FEATURES ────────────────── */}
      <section id="features" className="py-20 px-6 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="label-upper text-cherish-500 mb-2">
              Six creation modes
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cherish-900">
              What will you create today?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card-hover p-6 group">
                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">
                  {f.icon}
                </span>
                <h3 className="font-display text-lg font-bold text-cherish-900 mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-cherish-900/55 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHERISH ─────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="label-upper text-cherish-500 mb-2">The problem</p>
            <h2 className="font-display text-3xl font-bold text-cherish-900 mb-4">
              Your memories deserve better
            </h2>
            <p className="text-cherish-900/60 leading-relaxed mb-4">
              You go on amazing trips. You live through milestones. But physical
              scrapbooking takes hours. Social media is too public. Journal apps
              lack design tools. No single product combines everything — until
              now.
            </p>
            <p className="text-cherish-900/60 leading-relaxed">
              Cherish lets you capture in 60 seconds, design at your own pace,
              keep everything private, and export as a real printable book.
            </p>
          </div>
          <div className="bg-gradient-to-br from-cherish-100 to-cherish-200 rounded-3xl p-8 text-center">
            <span className="text-6xl block mb-4">📖</span>
            <p className="font-display text-xl font-bold text-cherish-700 mb-2">
              Capture → Design → Keep → Print
            </p>
            <p className="text-sm text-cherish-600">
              From a 60-second snap to a hardcover book
            </p>
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────── */}
      <section id="pricing" className="py-20 px-6 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="label-upper text-cherish-500 mb-2">Simple pricing</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cherish-900">
              Start free. Upgrade when you&apos;re ready.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`card p-6 flex flex-col ${
                  tier.highlight
                    ? "border-cherish-500 border-2 shadow-lg shadow-cherish-500/10 relative"
                    : ""
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cherish-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-cherish-900">
                  {tier.name}
                </h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-cherish-900">
                    {tier.price}
                  </span>
                  <span className="text-cherish-900/50 text-sm">
                    {tier.period}
                  </span>
                </div>
                <ul className="flex-1 space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="text-sm text-cherish-900/65 flex items-start gap-2"
                    >
                      <span className="text-cherish-500 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={
                    tier.highlight
                      ? "btn-primary text-center text-sm"
                      : "btn-outline text-center text-sm"
                  }
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────── */}
      <footer className="py-12 px-6 border-t border-cherish-300/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-display text-xl font-bold text-cherish-500">
              Cherish.
            </span>
            <p className="text-xs text-cherish-900/40 mt-1">
              © {new Date().getFullYear()} Cherish. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-cherish-900/50">
            <a href="#" className="hover:text-cherish-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-cherish-500 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-cherish-500 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
