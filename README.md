# Workshop Growth OS

> **Prototype built for the NxtWave Growth Challenge — not an official NxtWave event.**

A config-driven workshop registration and growth-tracking system built with Next.js (App Router, TypeScript), Tailwind CSS, Supabase, PostHog, and Vercel.

## Workshop

**Title:** Build Your First AI Project in 60 Minutes  
**Target:** 500 final-year (2027 batch) engineering students  
**Budget:** ₹2,000 · **Seat cap:** 600

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + RLS) |
| Analytics | PostHog (funnel + session recording + A/B flags) |
| Charts | Recharts |
| Deployment | Vercel |

---

## Getting Started

```bash
# 1. Clone and install
git clone https://github.com/vaishnavissl1/workshop-growth-os
cd workshop-growth-os
npm install

# 2. Set up env vars
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, etc.

# 3. Run dev server
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
src/
  app/           # Next.js App Router pages
  components/    # Shared components (PrototypeBanner, etc.)
  config.ts      # ← Single source of truth for workshop config
```

## Configuration

All workshop parameters live in [`src/config.ts`](src/config.ts):

- Title, tagline
- Workshop dates (Session 1 & 2)
- Seat cap (600) and registration target (500)
- Reward tiers (referrer prizes, ambassador reward)
- Budget breakdown (₹2,000)
- 7-day campaign day plan with cumulative targets
- 60-minute agenda

Change these values to reuse the system for any future workshop.

---

## Build Plan

| Prompt | Status | Feature |
|---|---|---|
| P1 | ✅ | Scaffold + config + banner |
| P2 | ⬜ | Supabase data model + RLS + `register()` RPC |
| P3 | ⬜ | Tier 1: landing, form, referral, leaderboard, admin |
| P4 | ⬜ | Deploy + edge-case tests |
| P5 | ⬜ | Simulation + scenario simulator |
| P6 | ⬜ | PostHog funnel + A/B flag |
| P7 | ⬜ | Ambassador kit + TPO generator + reminder flow |
| P8 | ⬜ | Keep-alive cron |
| P9 | ⬜ | AI project evaluator (T3a) |
| P10 | ⬜ | Live engagement tracker (T3b) |

---

## Disclaimer

This is a simulation built for an internship growth challenge. No real campaign is run and no students are contacted. All numbers are labelled **Assumption** or **Simulated** as required by the brief.
