/**
 * Workshop Growth OS — Central Configuration
 * Change values here to reuse this system for any future workshop.
 */

export const WORKSHOP_CONFIG = {
  // ── Identity ──────────────────────────────────────────────────────────────
  title: "Build Your First AI Project in 60 Minutes",
  tagline: "Walk into your next placement interview with a live AI project link on your resume.",
  shortTitle: "AI Workshop",

  // ── Dates (ISO 8601, Asia/Kolkata) ────────────────────────────────────────
  /** Workshop date/time for Session 1 */
  sessionDate: "2025-11-15T15:00:00+05:30",
  /** Workshop date/time for Session 2 (overflow) */
  session2Date: "2025-11-22T15:00:00+05:30",
  /** Registration closes (end of Day 7) */
  registrationCloses: "2025-11-14T23:59:59+05:30",
  /** Campaign start date (Day 1) */
  campaignStart: "2025-11-08T00:00:00+05:30",

  // ── Capacity ──────────────────────────────────────────────────────────────
  /** Maximum real registrations in Session 1 before overflow to Session 2 */
  seatCap: 600,
  /** Target registration count (the 500 from the brief) */
  registrationTarget: 500,

  // ── Reward Tiers ──────────────────────────────────────────────────────────
  /** Total budget in INR */
  totalBudget: 2000,

  referralRewards: [
    { rank: 1, label: "1st place referrer", amountINR: 400, minVerifiedReferrals: 1 },
    { rank: 2, label: "2nd place referrer", amountINR: 200, minVerifiedReferrals: 1 },
    { rank: 3, label: "3rd place referrer", amountINR: 100, minVerifiedReferrals: 1 },
  ] as const,

  ambassadorReward: {
    label: "Top ambassador (verified registrations only)",
    amountINR: 300,
  },

  metaTestBudget: 500, // INR incl. 18% GST ≈ ₹424 actual ad spend
  reserveBudget: 500, // D4 reserve — follows the winning channel

  // ── College Cup Prize ────────────────────────────────────────────────────
  collegeCupPrize: "College Spotlight live Q&A session with the NxtWave team",

  // ── 60-Minute Agenda ─────────────────────────────────────────────────────
  agenda: [
    { timeRange: "0–10 min", task: "Set up Google Colab + your API key" },
    { timeRange: "10–40 min", task: "Build an LLM-powered app with Gradio" },
    { timeRange: "40–55 min", task: "Deploy it to Hugging Face Spaces — get a public link" },
    { timeRange: "55–60 min", task: "Get your certificate · Add the project to LinkedIn and your resume" },
  ] as const,

  // ── Target Audience ───────────────────────────────────────────────────────
  targetGradYear: 2027,
  targetBranches: [
    "CSE / IT",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "Chemical",
    "Biotech",
    "Other Engineering",
    "Non-engineering",
  ] as const,

  // ── Day Plan (7-day campaign, cumulative targets) ─────────────────────────
  dayPlan: [
    { day: 1, label: "D1", cumulativeTarget: 40,  actions: "TPO emails sent; ambassadors recruited; kits live" },
    { day: 2, label: "D2", cumulativeTarget: 130, actions: "All channels live; TPO phone follow-ups; Meta test starts" },
    { day: 3, label: "D3", cumulativeTarget: 230, actions: "Checkpoint vs scenario table → rules" },
    { day: 4, label: "D4", cumulativeTarget: 320, actions: "Meta test ends → reserve to the winner; swap in winning headline" },
    { day: 5, label: "D5", cumulativeTarget: 400, actions: "\"Leaderboard closes in 48 hrs\"" },
    { day: 6, label: "D6", cumulativeTarget: 480, actions: "Last call; real seats-left count" },
    { day: 7, label: "D7", cumulativeTarget: 550, actions: "Final push; calendar + reminder messages" },
  ] as const,

  // ── OG / SEO ──────────────────────────────────────────────────────────────
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogDescription:
    "Free · Final-year engineers · Leave with a live AI project link for your resume",
  ogImageAlt: "Build Your First AI Project in 60 Minutes — Free Workshop",

  // ── Prototype Notice ─────────────────────────────────────────────────────
  prototypeBanner:
    "Prototype built for the NxtWave Growth Challenge — not an official NxtWave event.",
} as const;

export type WorkshopConfig = typeof WORKSHOP_CONFIG;
