import Link from "next/link";

const modes = [
  { icon: "⚡", title: "Quick Snap", desc: "Photo + note + voice in 60 seconds. One hand. One tap. Memory saved.", color: "from-amber-500 to-orange-600", bg: "bg-amber-50" },
  { icon: "📖", title: "Journal & Diary", desc: "6 beautiful templates with guided prompts. No more blank-page anxiety.", color: "from-blue-500 to-indigo-600", bg: "bg-blue-50" },
  { icon: "🎨", title: "Scrapbook Builder", desc: "Drag-and-drop canvas with 96+ stickers, frames, ribbons, washi tape, and caption boxes.", color: "from-emerald-500 to-green-600", bg: "bg-emerald-50" },
  { icon: "✨", title: "Full Memory", desc: "Scrapbook + journal combined in one guided flow. The complete story, beautifully told.", color: "from-purple-500 to-violet-600", bg: "bg-purple-50" },
  { icon: "🌀", title: "Vision Board", desc: "Free canvas with no rules. Power words, photos, chaos mode. Pure creative freedom.", color: "from-yellow-500 to-amber-600", bg: "bg-yellow-50" },
  { icon: "✍️", title: "Creative Studio", desc: "Blog drafts, short stories, song lyrics, idea dumps, content calendars. Your creative space.", color: "from-sky-500 to-blue-600", bg: "bg-sky-50" },
];

const whyItems = [
  { icon: "🔒", title: "Private by Default", desc: "Your memories are yours. End-to-end encryption. No social feed. No algorithms. Just you." },
  { icon: "🎙️", title: "Voice Capture", desc: "Can't write? Speak it. AI transcription saves both the audio and the text. Inspired by real accessibility needs." },
  { icon: "📅", title: "On This Day", desc: "Get surprised by a memory from exactly one year ago. The most emotionally powerful retention feature in the app." },
  { icon: "👨‍👩‍👧", title: "Family Circle", desc: "Share specific memories with specific people. Love and comment. Private group sharing for your closest people." },
  { icon: "📚", title: "Print & Bind", desc: "Export any memory book as a PDF. Send it to print. Hold your family memories in a real hardcover book." },
  { icon: "☁️", title: "Cloud Backup", desc: "Every memory is automatically backed up. Switch phones, switch platforms — your memories travel with you." },
];

const testimonials = [
  { name: "Sarah M.", role: "Mom of 3", text: "I documented our entire Disney trip in Quick Snaps while we were there. Turned them into scrapbook pages on the plane home. My kids couldn't believe it.", avatar: "S" },
  { name: "James K.", role: "Travel Blogger", text: "I've tried Day One, Canva, and Shutterfly. Nothing combines journaling and scrapbooking like this. The Creative Studio alone is worth the subscription.", avatar: "J" },
  { name: "Maria L.", role: "Grandmother", text: "My daughter shares her family memory books with me through Family Circle. I get to see my grandkids' milestones even from 800 miles away.", avatar: "M" },
];

const tiers = [
  {
    name: "Free", price: "$0", period: "forever", highlight: false, badge: null,
    features: ["10 pages per month", "1 memory book", "Basic stickers & frames", "Private entries", "Cloud backup", "Quick Snap & Journal"],
    cta: "Get Started Free",
  },
  {
    name: "Pro", price: "$7.99", period: "/month", highlight: true, badge: "MOST POPULAR",
    features: ["Unlimited pages & books", "All 96+ stickers & 6 themes", "PDF export & print-to-bind", "Voice memos & AI transcription", "Family Circle sharing", "On This Day memories", "Vision Board & Creative Studio", "Priority support"],
    cta: "Start 7-Day Free Trial",
  },
  {
    name: "Family", price: "$99.99", period: "/year", highlight: false, badge: "BEST VALUE",
    features: ["Everything in Pro", "Up to 5 family members", "Shared memory books", "All premium sticker packs", "Hardcover book ordering", "Family analytics dashboard"],
    cta: "Start Family Plan",
  },
];

const stats = [
  { value: "60s", label: "To capture a memory" },
  { value: "96+", label: "Stickers & elements" },
  { value: "6", label: "Creation modes" },
  { value: "∞", label: "Memories to keep" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cherish-50 relative overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-cherish-500">Cherish.</span>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-cherish-900/60 hover:text-cherish-500 transition-colors">Features</a>
            <a href="#how" className="text-sm text-cherish-900/60 hover:text-cherish-500 transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-cherish-900/60 hover:text-cherish-500 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
            <Link href="/signup" className="btn-primary text-sm !py-2.5 !px-5 !rounded-xl">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cherish-100/50 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-cherish-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-cherish-300/30 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-cherish-700">Now in beta — Join the founding members</span>
          </div>
          <h1 className="font-display text-[3.2rem] md:text-7xl font-bold text-cherish-900 leading-[1.05] mb-6 tracking-tight">
            The moments pass.
            <br />
            <span className="bg-gradient-to-r from-cherish-500 via-cherish-600 to-amber-600 bg-clip-text text-transparent italic">
              The memories don&apos;t have to.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-cherish-900/55 max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            The only app that combines digital scrapbooking, private journaling,
            voice capture, and family sharing — all in one beautiful place.
            Capture in 60 seconds. Design when you&apos;re ready. Print and keep forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/signup" className="btn-primary text-base px-10 py-4 !rounded-2xl text-lg">
              Start Creating — It&apos;s Free
            </Link>
            <a href="#features" className="btn-outline text-base px-8 py-4 !rounded-2xl">
              See All Features ↓
            </a>
          </div>
          <p className="text-xs text-cherish-900/35">No credit card required · Free forever plan · Cancel anytime</p>
        </div>

        {/* Stats bar */}
        <div className="max-w-3xl mx-auto mt-16 grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-cherish-500">{s.value}</p>
              <p className="text-[11px] text-cherish-900/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features — 6 Modes */}
      <section id="features" className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="label-upper text-cherish-500 mb-3">Six creation modes</p>
            <h2 className="section-title mb-4">
              Everything you need.<br className="hidden md:block" /> Nothing you don&apos;t.
            </h2>
            <p className="text-base text-cherish-900/50 max-w-xl mx-auto">
              Each mode is designed for a different moment in your life. Use one or use all six — they work together seamlessly.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modes.map((m, i) => (
              <div
                key={m.title}
                className={`${m.bg} rounded-3xl p-7 border border-white/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer relative overflow-hidden`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/30 to-transparent rounded-bl-full" />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {m.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-cherish-900 mb-2">{m.title}</h3>
                <p className="text-sm text-cherish-900/55 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6 bg-white/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="label-upper text-cherish-500 mb-3">How it works</p>
            <h2 className="section-title">Four steps. Infinite memories.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", icon: "📸", title: "Capture", desc: "Snap a photo, write a note, record your voice. 60 seconds is all it takes." },
              { step: "02", icon: "🎨", title: "Design", desc: "Turn captures into beautiful scrapbook pages with stickers, frames, and captions." },
              { step: "03", icon: "📖", title: "Tell the Story", desc: "Add journal entries, guided prompts, favorite memories, and funniest moments." },
              { step: "04", icon: "📚", title: "Keep Forever", desc: "Cloud-backed, private by default. Export as PDF. Print and bind into a real book." },
            ].map((s) => (
              <div key={s.step} className="text-center group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{s.icon}</div>
                <div className="text-xs font-bold text-cherish-500 mb-2">STEP {s.step}</div>
                <h3 className="font-display text-lg font-bold text-cherish-900 mb-2">{s.title}</h3>
                <p className="text-sm text-cherish-900/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Cherish */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="label-upper text-cherish-500 mb-3">Why Cherish</p>
            <h2 className="section-title">Built for real life.<br />Not for likes.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyItems.map((item) => (
              <div key={item.title} className="card-hover !p-6 group">
                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                <h3 className="font-display text-base font-bold text-cherish-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-cherish-900/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-b from-white/40 to-cherish-100/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="label-upper text-cherish-500 mb-3">What people are saying</p>
            <h2 className="section-title">Loved by memory keepers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card !p-6">
                <p className="text-sm text-cherish-900/65 leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cherish-300 to-cherish-400 flex items-center justify-center text-white font-bold text-sm">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-cherish-900">{t.name}</p>
                    <p className="text-[11px] text-cherish-900/40">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="label-upper text-cherish-500 mb-3">Simple pricing</p>
            <h2 className="section-title mb-4">Start free. Upgrade when you&apos;re ready.</h2>
            <p className="text-base text-cherish-900/45">No hidden fees. No surprises. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div key={tier.name} className={`card !p-7 flex flex-col relative ${
                tier.highlight ? "!border-cherish-500 !border-2 shadow-xl shadow-cherish-500/10 scale-[1.02]" : ""
              }`}>
                {tier.badge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 badge text-white px-3 py-1 ${
                    tier.highlight ? "bg-cherish-500" : "bg-emerald-500"
                  }`}>{tier.badge}</span>
                )}
                <h3 className="font-display text-xl font-bold text-cherish-900">{tier.name}</h3>
                <div className="mt-2 mb-5">
                  <span className="text-4xl font-bold text-cherish-900">{tier.price}</span>
                  <span className="text-cherish-900/40 text-sm ml-1">{tier.period}</span>
                </div>
                <ul className="flex-1 space-y-2.5 mb-7">
                  {tier.features.map((f) => (
                    <li key={f} className="text-sm text-cherish-900/60 flex items-start gap-2.5">
                      <span className="text-cherish-500 mt-0.5 flex-shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={tier.highlight ? "btn-primary text-center" : "btn-outline text-center"}>
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-cherish-900/35 mt-8">
            🎉 <strong>Founding Member pricing:</strong> $4.79/mo locked for life — available during beta only.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-title mb-4">
            Your family&apos;s story<br />deserves more than a camera roll.
          </h2>
          <p className="text-base text-cherish-900/50 mb-8 max-w-lg mx-auto">
            Start capturing, designing, and keeping your memories today. It&apos;s free, it&apos;s private, and it takes 30 seconds to sign up.
          </p>
          <Link href="/signup" className="btn-primary text-lg px-12 py-5 !rounded-2xl inline-block">
            Create Your Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-cherish-300/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-display text-xl font-bold text-cherish-500">Cherish.</span>
            <p className="text-xs text-cherish-900/30 mt-1">© {new Date().getFullYear()} Cherish. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-sm text-cherish-900/40">
            <a href="#" className="hover:text-cherish-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cherish-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-cherish-500 transition-colors">Contact</a>
            <a href="#" className="hover:text-cherish-500 transition-colors">Blog</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
