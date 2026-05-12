# Cherish.

**The moments pass. The memories don't have to.**

A privacy-first digital memory keeping app that combines scrapbooking, journaling, voice capture, and family sharing into one beautiful experience. Built with Next.js 15, Supabase, Prisma, and Stripe — deployable to Railway in minutes.

---

## What Cherish Does

- **Quick Snap** — Photo + note + voice + location in 60 seconds flat
- **Journal & Diary** — 6 pre-built templates (Travel Day, Daily Reflection, Big Milestone, Family Moment, Gratitude, Free Write) with writing prompts
- **Scrapbook Pages** — Drag-and-drop canvas with stickers, frames, ribbons, caption boxes (Favorite Memory, Trip Details, Funniest Moment, etc.), background colors, and 6 layout options
- **Full Memory** — Scrapbook + journal combined in a 3-step guided flow
- **Vision Board & Collage** — 5 free-canvas modes with power words, feeling words, goal phrases, and shuffle/chaos controls
- **Creative Studio** — 6 sub-modes for bloggers, writers, songwriters (Blog Post, Short Story, Song Lyrics, Idea Dump, Content Calendar, Voice to Text)

Everything is **private by default**, backed up to the cloud, and exportable as PDF for print-to-bind physical books.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router, Server Components, Server Actions) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS with Cherish brand tokens |
| **Database** | PostgreSQL via Supabase |
| **ORM** | Prisma |
| **Auth** | Supabase Auth (email/password, SSR cookie-based sessions) |
| **File Storage** | Supabase Storage (photos, voice memos) |
| **Payments** | Stripe (subscriptions, webhooks) |
| **Voice AI** | OpenAI Whisper API (transcription) |
| **State** | Zustand (client-side canvas state) |
| **Hosting** | Railway (nixpacks auto-detect) |

---

## Project Structure

```
cherish-app/
├── prisma/
│   ├── schema.prisma          # Full data model (17 tables)
│   └── seed.ts                # Admin user + sample templates/stickers
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page (public)
│   │   ├── layout.tsx         # Root layout
│   │   ├── onboarding/        # Theme picker, use-case chips, welcome
│   │   ├── (auth)/            # Login & signup pages
│   │   ├── (app)/             # Authenticated app routes
│   │   │   ├── home/          # 6 creation mode cards, streak, nudge
│   │   │   ├── library/       # Memory books + recent captures
│   │   │   ├── timeline/      # Chronological view + On This Day
│   │   │   ├── circle/        # Family Circle sharing
│   │   │   ├── profile/       # Account, plan, settings
│   │   │   └── create/        # All 6 creation modes
│   │   │       ├── quick-snap/
│   │   │       ├── journal/
│   │   │       ├── scrapbook/  # Full canvas builder
│   │   │       ├── full-memory/
│   │   │       ├── vision-board/
│   │   │       └── creative-studio/
│   │   ├── admin/             # Admin-only dashboard
│   │   │   ├── dashboard/     # Stats, charts, recent users
│   │   │   ├── users/         # User management table
│   │   │   └── content/       # Template & sticker pack management
│   │   └── api/
│   │       ├── health/        # Railway health check
│   │       ├── auth/          # Signup, login, callback, logout
│   │       ├── memories/      # CRUD with tier limit enforcement
│   │       ├── voice-transcribe/  # Whisper API integration
│   │       ├── stripe-webhook/    # Subscription lifecycle
│   │       └── admin/         # Admin stats API
│   ├── components/
│   │   ├── layout/            # BottomNav
│   │   └── creation/          # ModeCards
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── supabase-server.ts # Server-side Supabase client
│   │   ├── supabase-browser.ts # Client-side Supabase client
│   │   ├── supabase-middleware.ts # Auth session refresh
│   │   ├── stripe.ts          # Stripe client + plan definitions
│   │   └── tier-limits.ts     # Feature gating by subscription tier
│   ├── store/                 # Zustand store (canvas state)
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Auth route protection
├── railway.toml               # Railway deployment config
├── nixpacks.toml              # Nixpacks build config
├── Dockerfile                 # Docker fallback build
├── .env.example               # Environment variable template
└── package.json
```

---

## Setup & Deployment

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Stripe](https://stripe.com) account (test mode)
- An [OpenAI](https://platform.openai.com) API key (for Whisper)
- A [Railway](https://railway.app) account

### 1. Clone & Install

```bash
git clone https://github.com/ThaGuff/CHERISH.git
cd CHERISH
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **Settings → Database** and copy the connection string → `DATABASE_URL`
4. In **Authentication → Settings**, set the Site URL to your Railway domain
5. Create a **Storage bucket** called `cherish-uploads` (set to private)

### 3. Configure Environment

```bash
cp .env.example .env
# Fill in all values from Supabase, Stripe, and OpenAI
```

### 4. Initialize Database

```bash
npx prisma db push        # Push schema to Supabase Postgres
npx tsx prisma/seed.ts     # Seed templates, stickers, admin user
```

### 5. Set Up Stripe

1. Create Products and Prices in Stripe Dashboard (test mode):
   - Pro Monthly: $7.99/mo
   - Pro Annual: $64.99/yr
   - Family Annual: $99.99/yr
   - Founding Member: $4.79/mo
2. Copy each Price ID into your `.env` as `STRIPE_PRO_MONTHLY_PRICE_ID`, etc.
3. Set up a webhook endpoint: `https://your-domain.railway.app/api/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### 6. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

### 7. Deploy to Railway

**Option A: One-click from GitHub**

1. Go to [railway.app](https://railway.app)
2. **New Project → Deploy from GitHub Repo → ThaGuff/CHERISH**
3. Add all environment variables from `.env.example`
4. Railway auto-detects the `railway.toml` and builds with nixpacks
5. Done. Your app is live.

**Option B: Railway CLI**

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### 8. Post-Deploy

1. Update Supabase Site URL to your Railway domain
2. Update Stripe webhook URL to your Railway domain
3. Sign up via the app, then run this SQL in Supabase to make yourself admin:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## Subscription Tiers

| Tier | Price | Pages/Mo | Books | Voice | PDF | Family Circle | Stickers |
|------|-------|----------|-------|-------|-----|---------------|----------|
| **Free** | $0 | 10 | 1 | ✗ | ✗ | ✗ | Basic |
| **Pro Monthly** | $7.99/mo | ∞ | ∞ | ✓ | ✓ | ✓ | All |
| **Pro Annual** | $64.99/yr | ∞ | ∞ | ✓ | ✓ | ✓ | All |
| **Family** | $99.99/yr | ∞ | ∞ | ✓ | ✓ | ✓ (5 members) | All |
| **Founding** | $4.79/mo (locked) | ∞ | ∞ | ✓ | ✓ | ✓ | All |

---

## UGC Strategy Recommendations

To maximize adoption and create a flywheel of user-generated content:

### 1. Community Challenges (Weekly)
Run themed weekly challenges ("Sunday Scrapbook", "Throwback Thursday", "Milestone Monday"). Users opt in to share entries in a public showcase. Top picks get featured — drives engagement and social sharing.

### 2. User Template Marketplace
Let Pro users design custom scrapbook templates and sell them. Revenue split 70/30 (creator/platform). Creates a creator economy within the app and an incentive for power users to stay subscribed.

### 3. Public Memory Books (Opt-In)
Allow users to make individual memory books shareable via unique link. Travel bloggers share trip books as content. Wedding books shared with guests. This creates organic discovery and SEO traffic while keeping everything private by default.

### 4. Community Sticker Submissions
Let users submit sticker designs. Curated packs get published with credit. Top contributors earn free Pro months. Builds a creative community around the product.

### 5. Print-Ready Affiliate Program
Partner with print services (Blurb, Shutterfly) and let users export directly to hardcover. Premium upsell plus affiliate revenue. The physical book becomes word-of-mouth marketing.

---

## Database Schema Highlights

- **17 tables** covering users, memory books, memories (polymorphic), photos, voice memos, tags, family circles, reactions, subscriptions, and admin-managed templates/stickers
- **Row-Level Security** via Prisma queries scoped to `userId`
- **Polymorphic memories** — one `Memory` parent with type-specific child tables (QuickSnap, JournalEntry, ScrapbookPage, VisionBoard, CreativePost)
- **Tier enforcement** built into API routes — checks `pagesPerMonth` limit before every create
- **Streak tracking** — automatic daily streak counter updated on memory creation

---

## License

Proprietary. All rights reserved.

---

Built with intention. Designed to last.
**Cherish.** — *The moments pass. The memories don't have to.*
