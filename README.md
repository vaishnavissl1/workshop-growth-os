# Workshop Growth OS

**Live:** https://workshop-growth-os.vercel.app

A working growth system for one workshop: *"Build Your First AI Project in 60 Minutes"* (free, for 2027-batch engineering students). Built for the NxtWave Growth Challenge. The campaign itself is **simulated**; the system around it is real and running.

> This is a prototype built for the NxtWave Growth Challenge, not an official NxtWave event.

## What it does

| Area | What's built |
|---|---|
| **Site** | Home, Register, Program, Certificate, FAQ, Leaderboard, each its own page. Pages that need an account send signed-out visitors to sign up, then bring them back. |
| **Registration** | Branch picker with project ideas, validated form, duplicate handling, referral and ambassador attribution, 600-seat cap with automatic overflow to a repeat session, honeypot and per-IP rate limit. |
| **Referral loop** | Personal invite link per student (with a personalised WhatsApp preview image), live leaderboard (top referrers and a College Cup), "N more to overtake #M" nudges, one-tap WhatsApp share. |
| **Accounts** | Sign up, log in, forgot/reset password, settings page (edit profile, change password, delete account). Reviewer accounts go straight to the dashboard. |
| **Admin** (`/admin`) | KPI strip, cumulative-vs-500 chart, funnel, channel table with cost, decision rules R0–R6 with green/amber/red status, a live scenario simulator, and a loader for simulated data. |
| **Simulation** | `POST /api/simulate` seeds the plan's pessimistic / base / optimistic scenarios (235 / 553 / 1,118 registrations) across 7 days. Simulated rows are flagged and never mix into real numbers. |
| **Ambassador kit** (`/ambassador?amb=CODE`) | Tracked link, three copy-ready messages in English, Telugu, Kannada and Hindi (AI-drafted, marked for native-speaker review), TPO email template. |
| **Project checker** (`/evaluate`) | Paste a Hugging Face Space link and get a score out of 100 against a six-point rubric (live, uses a model, real interface, key kept secret, documented, own work), with a specific next step for each miss. Rule-based by default; a written AI review switches on when `ANTHROPIC_API_KEY` is set. |
| **Starter kit** | On registering, each student gets a personalised, runnable `app.py` for the project they picked. |
| **Analytics** | PostHog with a 3-way `headline_variant` flag driving the home-page subhead. |

## What is *not* built

Be honest about the edges:

- No live WhatsApp reminders (the plan's reminder flow is not implemented).
- No workshop-day live tracker. The project checker is rule-based; the written AI review needs an API key that this deployment does not have.
- The starter code is valid Python and follows the workshop steps, but I have not run it against a live model.
- The TPO email generator is a fill-in template, not an LLM call. The vernacular messages use pre-written drafts unless an `ANTHROPIC_API_KEY` is set.
- PostHog has the events and the flag; I did not build the funnel insight or dashboard inside PostHog. The in-app funnel is computed from the database.
- All conversion numbers in the plan are assumptions or simulated, not measured.

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Supabase (Postgres + Auth) · PostHog · Recharts · Vercel.

## Run it locally

```bash
npm install
cp .env.local.example .env.local   # fill in the values below
npm run dev                        # http://localhost:3000
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for invite links and previews |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project (the anon key reads nothing but two public views) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. All table access goes through the server |
| `ADMIN_PASSWORD`, `REVIEWER_PASSWORD` | Password sign-in for `/admin` (admin can load data; reviewer is read-only) |
| `RATE_LIMIT_SALT` | Salt for hashed IPs in the rate limiter |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Analytics |
| `ANTHROPIC_API_KEY` (optional) | Written AI review in the project checker, and live translation in the ambassador kit |

Workshop title, dates, seat cap, reward tiers and the day plan live in [`src/config.ts`](src/config.ts), so the same system can run another workshop.

## Design decisions worth knowing

- **Tables are locked to the server.** Row-level security is on everywhere and the public key has no table access. The only public objects are two views that expose first name, college, invite code and counts: no phone, email or surname. Supabase labels them "UNRESTRICTED" because views can't have RLS; that is by design and documented on the views.
- **`register()` is a security-definer function** that normalises the phone, validates input, drops invalid referrers, applies attribution precedence (referral > ambassador > tpo > meta > direct), enforces the seat cap, and returns the existing invite code on duplicates. It is callable only by the server.
- **Sessions live in `localStorage`, not cookies**, because WhatsApp's in-app browser drops cookies. Referral codes travel the same way (URL, `localStorage`, and a hidden form field).
- **Account sign-up doesn't depend on email.** Supabase's built-in email sender is limited to a few messages an hour, so the server creates a confirmed account and the browser signs in. Trade-off: email addresses aren't verified; registrations link only to the account that created them, never claimed by email.
- **Reviewer and admin roles** live in `app_metadata`, which only the server can write.
- **No fabricated social proof.** The certificate page shows roles the skill supports and an alumni section that renders only entries marked `verified` in `src/data/careers.ts` (empty until the first cohort has real outcomes).

## Project layout

```
src/app/            pages and API routes (register, profile, signup, simulate, admin, ...)
src/components/     UI (header, footer, forms, auth, admin dashboard)
src/lib/            Supabase clients, auth helpers, stats, simulation, share links
src/data/           project ideas per branch, career roles
src/config.ts       workshop configuration
```
