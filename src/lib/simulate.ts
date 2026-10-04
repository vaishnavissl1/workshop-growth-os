import { WORKSHOP_CONFIG as cfg } from "@/config";

export type Scenario = "base" | "pessimistic" | "optimistic";

/** PLAN.md §3 sensitivity table: registrations per channel. Totals: 553 / 235 / 1,118. */
export const SCENARIOS: Record<Scenario, { tpo: number; ambassador: number; referral: number; colleges: number }> = {
  pessimistic: { tpo: 96, ambassador: 108, referral: 31, colleges: 8 },
  base: { tpo: 240, ambassador: 202, referral: 111, colleges: 15 },
  optimistic: { tpo: 500, ambassador: 360, referral: 258, colleges: 20 },
};

/** Share of each channel's registrations landing on D1..D7 (referral builds later, TPO circulars land early). */
const DAY_SHAPE: Record<"tpo" | "ambassador" | "referral", number[]> = {
  tpo: [10, 25, 25, 15, 10, 10, 5],
  ambassador: [5, 20, 20, 20, 15, 12, 8],
  referral: [0, 5, 15, 20, 25, 20, 15],
};

/** Relative traffic by IST hour: lunch and late-evening peaks, quiet overnight. */
const HOUR_WEIGHT = [1, 0, 0, 0, 0, 1, 2, 4, 6, 6, 5, 6, 9, 9, 6, 5, 5, 6, 7, 9, 10, 10, 7, 3];

const FIRST = ["Aarav", "Ananya", "Rohit", "Sneha", "Karthik", "Divya", "Vikram", "Meghana", "Arjun", "Pooja", "Harsha", "Lakshmi", "Nikhil", "Swathi", "Rahul", "Priyanka", "Sai", "Keerthi", "Manoj", "Bhavana"];
const LAST = ["Reddy", "Sharma", "Nair", "Iyer", "Gupta", "Rao", "Patel", "Kumar", "Singh", "Das", "Menon", "Naidu"];
export const SIM_COLLEGES = [
  "Amrita Vishwa Vidyapeetham, Bengaluru", "CBIT, Hyderabad", "VNR VJIET, Hyderabad", "JNTU Hyderabad", "GITAM University, Visakhapatnam",
  "KL University, Vijayawada", "R.V. College of Engineering, Bengaluru", "BMS College of Engineering, Bengaluru", "PSG College of Technology, Coimbatore",
  "SRM Institute of Science and Technology", "VIT Vellore", "Anna University, Chennai", "NIT Warangal", "Manipal Institute of Technology",
  "Lovely Professional University", "College of Engineering, Pune", "Delhi Technological University", "NIT Trichy", "JNTU Kakinada", "SASTRA University, Thanjavur",
];
const BRANCHES: [string, number][] = [["CSE / IT", 35], ["ECE", 20], ["EEE", 10], ["Mechanical", 12], ["Civil", 8], ["Chemical", 3], ["Biotech", 3], ["Other Engineering", 5], ["Non-engineering", 4]];
const VARIANTS: [string, number][] = [["control", 30], ["resume", 40], ["certificate", 30]];
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Deterministic PRNG so a scenario always seeds the same data. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function weighted<T>(items: [T, number][], r: number): T {
  const sum = items.reduce((n, [, w]) => n + w, 0);
  let x = r * sum;
  for (const [v, w] of items) {
    if ((x -= w) < 0) return v;
  }
  return items[items.length - 1][0];
}

export type SimAmbassador = { code: string; name: string; college: string; is_simulated: true };
export type SimRow = {
  name: string; phone: string; email: string; college: string; branch: string; grad_year: number; consent: true;
  ref_code: string; referred_by: string | null; source: "tpo" | "ambassador" | "referral"; ambassador_code: string | null;
  headline_variant: string; session: number; is_simulated: true; created_at: string;
};

export function buildScenario(scenario: Scenario) {
  const spec = SCENARIOS[scenario];
  const rnd = mulberry32({ base: 553, pessimistic: 235, optimistic: 1118 }[scenario]);
  const start = new Date(cfg.campaignStart).getTime();

  const ambassadors: SimAmbassador[] = Array.from({ length: 30 }, (_, i) => ({
    code: `AMB-${String(i + 1).padStart(3, "0")}`,
    name: `${FIRST[(i * 7) % FIRST.length]} ${LAST[(i * 5) % LAST.length]}`,
    college: SIM_COLLEGES[i % SIM_COLLEGES.length],
    is_simulated: true,
  }));
  const tpoColleges = SIM_COLLEGES.slice(0, spec.colleges);

  type Draft = Omit<SimRow, "ref_code" | "referred_by" | "phone" | "email" | "session">;
  const drafts: Draft[] = [];

  const timestamp = (day: number) => {
    const hour = weighted(HOUR_WEIGHT.map((w, h) => [h, w] as [number, number]), rnd());
    return new Date(start + day * 86400000 + (hour * 60 + Math.floor(rnd() * 60)) * 60000 + Math.floor(rnd() * 60000)).toISOString();
  };
  const person = (college: string, source: SimRow["source"], amb: string | null, day: number): Draft => {
    const branch = weighted(BRANCHES, rnd());
    return {
      name: `${FIRST[Math.floor(rnd() * FIRST.length)]} ${LAST[Math.floor(rnd() * LAST.length)]}`,
      college,
      branch,
      // ~88% are 2027 batch; with ~4% non-engineering that gives ~85% verified.
      grad_year: rnd() < 0.88 ? 2027 : rnd() < 0.5 ? 2026 : 2028,
      consent: true,
      source,
      ambassador_code: amb,
      headline_variant: weighted(VARIANTS, rnd()),
      is_simulated: true,
      created_at: timestamp(day),
    };
  };

  for (const channel of ["tpo", "ambassador", "referral"] as const) {
    const n = spec[channel];
    const shape = DAY_SHAPE[channel];
    const total = shape.reduce((a, b) => a + b, 0);
    // Largest-remainder split so each channel sums to exactly its scenario number.
    const raw = shape.map((w) => (w / total) * n);
    const perDay = raw.map(Math.floor);
    let left = n - perDay.reduce((a, b) => a + b, 0);
    [...raw.keys()].sort((a, b) => raw[b] - Math.floor(raw[b]) - (raw[a] - Math.floor(raw[a]))).forEach((i) => {
      if (left-- > 0) perDay[i]++;
    });
    perDay.forEach((count, day) => {
      for (let i = 0; i < count; i++) {
        if (channel === "tpo") drafts.push(person(tpoColleges[Math.floor(rnd() ** 1.4 * tpoColleges.length)], "tpo", null, day));
        else if (channel === "ambassador") {
          const a = ambassadors[Math.floor(rnd() ** 1.8 * ambassadors.length)];
          drafts.push(person(a.college, "ambassador", a.code, day));
        } else drafts.push(person("", "referral", null, day));
      }
    });
  }

  drafts.sort((a, b) => a.created_at.localeCompare(b.created_at));

  const used = new Set<string>();
  const code = () => {
    for (;;) {
      const c = Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(rnd() * CODE_CHARS.length)]).join("");
      if (!used.has(c)) return used.add(c) && c;
    }
  };

  const rows: SimRow[] = [];
  drafts.forEach((d, i) => {
    let referred_by: string | null = null;
    let college = d.college;
    if (d.source === "referral") {
      // Pick an earlier registrant; squaring skews picks toward early joiners so a few referrers dominate.
      const pool = rows;
      const ref = pool.length ? pool[Math.floor(rnd() ** 2 * pool.length)] : null;
      referred_by = ref?.ref_code ?? null;
      college = ref && rnd() < 0.75 ? ref.college : SIM_COLLEGES[Math.floor(rnd() * SIM_COLLEGES.length)];
    }
    const n = 90000_00000 + i;
    rows.push({
      ...d,
      college,
      ref_code: code(),
      referred_by,
      phone: String(n),
      email: `sim${i + 1}@example.invalid`,
      session: i < cfg.seatCap ? 1 : 2,
    });
  });

  return { ambassadors, rows };
}
