/* eslint-disable @next/next/no-img-element -- NIAT's own photos and logos, served as plain files from public/niat */
import PageGlow from "@/components/PageGlow";
import PageHero from "@/components/PageHero";
import {
  ADVISOR_QUOTE, ADVISORS, COLLABORATIONS, HIRING_COMPANIES, MENTORS, MICRO_EARN, MICRO_SPECIALISATIONS,
  OUTCOMES, PLACEMENTS, RECOGNISED_BY, SHARK_TANK, STATES, STORIES,
} from "@/data/niat";

export const metadata = { title: "Why NIAT" };

const initials = (name: string) =>
  name.replace(/^Dr\.\s*/, "").split(/\s+/).map((w) => w[0]).filter((c) => /[A-Za-z]/.test(c)).slice(0, 2).join("").toUpperCase();

function Avatar({ name, size = "h-16 w-16 text-xl" }: { name: string; size?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex flex-shrink-0 items-center justify-center rounded-full font-bold text-white ${size}`}
      style={{ backgroundImage: "linear-gradient(to bottom right, #B91C1C, #7F1D1D)" }}
    >
      {initials(name)}
    </span>
  );
}

function Heading({ eyebrow, children, lead }: { eyebrow: string; children: React.ReactNode; lead?: string }) {
  return (
    <div className="mb-12 text-center">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="section-title">{children}</h2>
      {lead && <p className="lead mx-auto mt-4 max-w-2xl">{lead}</p>}
    </div>
  );
}

/** About NIAT and NxtWave: who is behind the workshop and what their longer programs lead to. */
export default function WhyNiatPage() {
  return (
    <>
      <PageGlow tone="amber" />
      <PageHero
        eyebrow="Why NIAT"
        title={<>The people and outcomes <span className="gradient-text">behind the workshop</span></>}
        lead="This workshop is one hour. NIAT, NxtWave of Innovation in Advanced Technologies, is where that hour can lead."
      />

      {/* Outcomes */}
      <section aria-label="Outcomes" className="border-y border-slate-200 bg-slate-50">
        <dl className="container-wide grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {OUTCOMES.map(([n, label]) => (
            <div key={label} className="text-center">
              <dt className="text-4xl font-bold gradient-text sm:text-5xl">{n}</dt>
              <dd className="mt-1 text-[0.95rem] text-slate-500">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Exclusive benefits */}
      <section className="container-wide pt-24">
        <Heading eyebrow="For NIATians" lead="NIATians are students of NIAT's industry-ready upskilling program.">
          Exclusive <span className="gradient-text">benefits</span> for NIATians
        </Heading>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-[#6B0012] p-8 text-white sm:p-10">
            <h3 className="text-3xl font-semibold !text-white">Add micro-specialisations to your journey</h3>
            <p className="mt-3 text-lg text-rose-100">NIATians can now earn IIT Kharagpur OCN Micro-Specialisations.</p>
            <div className="mt-6 rounded-2xl bg-[#FFB218] p-5 text-[#1E293B]">
              <p className="font-semibold">Micro-specialisations offered</p>
              <ul className="mt-2 space-y-1">
                {MICRO_SPECIALISATIONS.map((m) => <li key={m}>{m}</li>)}
              </ul>
            </div>
            <div className="mt-4 rounded-2xl bg-[#FFF1CC] p-5 text-[#1E293B]">
              <p className="font-semibold">What qualifying learners earn</p>
              <ul className="mt-2 space-y-1 text-[0.95rem]">
                {MICRO_EARN.map((m) => <li key={m}>{m}</li>)}
              </ul>
            </div>
            <p className="mt-4 text-sm text-rose-200">IIT Kharagpur credentials are conferred by IIT Kharagpur at its discretion.</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex-1 rounded-3xl bg-gradient-to-br from-[#FBDCDC] via-[#FDEBD8] to-[#FBE3B4] p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#6B0012]">Earn a minimum of</p>
              <p className="mt-1 text-6xl font-bold text-[#991B1B]">₹30,000</p>
              <p className="text-xl font-semibold text-[#6B0012]">per project</p>
              <ul className="mt-6 space-y-2 border-t border-[#991B1B]/30 pt-5 text-lg text-[#6B0012]">
                <li>At least 1 <strong>real-world industry project</strong></li>
                <li>From <strong>startups &amp; MNCs</strong></li>
              </ul>
              <p className="mt-4 text-sm text-[#6B0012]">*Subject to eligibility criteria</p>
            </div>
            <div className="rounded-3xl bg-[#1E293B] p-8 text-white sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Allocating</p>
              <p className="mt-1 text-5xl font-bold text-[#FFB218]">₹100 crores</p>
              <p className="mt-1 text-lg text-slate-200">worth of AI tokens for NIATians</p>
              <p className="mt-3 text-sm text-slate-400">*Terms and conditions apply</p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutions */}
      <section className="container-wide pt-24">
        <Heading eyebrow="Where it's offered">
          Our upskilling program, offered at <span className="gradient-text">35+ institutions</span>
        </Heading>
        <ul className="flex flex-wrap justify-center gap-3">
          {STATES.map((s) => (
            <li key={s} className="rounded-xl bg-[#FBF2F3] px-5 py-3 text-lg font-medium text-slate-700">{s}</li>
          ))}
        </ul>
      </section>

      {/* Advisors */}
      <section className="container-wide pt-24">
        <Heading eyebrow="Guidance">Our <span className="gradient-text">advisors</span></Heading>
        <ul className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {ADVISORS.map((a) => (
            <li key={a.name} className="rounded-3xl border border-[#F3E3C3] bg-[#FFF8EC] p-8 text-center shadow-sm">
              <img src={`/niat/advisor-${a.slug}.png`} alt={a.name} width={239} height={239} loading="lazy" className="mx-auto h-48 w-48 rounded-3xl bg-[#FFEFC4] object-cover" />
              <p className="mt-6 text-2xl font-semibold text-[#991B1B]">{a.line}</p>
              <h3 className="mt-4 text-xl font-semibold">{a.name}</h3>
              <p className="text-slate-500">{a.role}</p>
            </li>
          ))}
        </ul>
        <figure className="mx-auto mt-8 max-w-3xl text-center">
          <blockquote className="text-lg italic text-slate-600">“{ADVISOR_QUOTE.text}”</blockquote>
          <figcaption className="mt-2 font-semibold">{ADVISOR_QUOTE.by}</figcaption>
        </figure>
      </section>

      {/* Hiring companies */}
      <section className="container-wide pt-24">
        <Heading eyebrow="Placements" lead="On track to onboard 5000+ companies in the next 2 years.">
          <span className="gradient-text">2500+ companies</span> have hired NxtWave students
        </Heading>
        <ul className="mx-auto grid max-w-6xl grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {HIRING_COMPANIES.map((c, i) => (
            <li key={i} className="flex h-20 items-center justify-center rounded-xl border border-slate-200 bg-white px-4">
              <img src={`/niat/hire-${String(i + 1).padStart(2, "0")}.png`} alt={c} loading="lazy" className="max-h-10 w-auto max-w-full object-contain" />
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-slate-500">
          Placement outcomes depend on each learner&apos;s effort, skills and performance. Joining a program does not by itself assure a job or internship.
        </p>
      </section>

      {/* Top placements */}
      <section className="container-wide pt-24">
        <Heading eyebrow="Outcomes"><span className="gradient-text">Top placements</span> by NxtWave</Heading>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLACEMENTS.map((p) => (
            <li key={p.name} className="flex flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-slate-200 to-slate-400">
              <img src={`/niat/placed-${p.slug}.png`} alt={p.name} loading="lazy" className="mx-auto mt-6 h-56 w-auto object-contain object-bottom" />
              <div className="flex flex-1 flex-col bg-[#334155] p-6 text-white">
                <h3 className="text-2xl font-semibold !text-white">{p.name}</h3>
                <p className="text-slate-200">{p.role}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="rounded-lg bg-white px-4 py-2 text-xl font-bold text-[#1D4ED8]">{p.lpa} LPA</p>
                  <img src={`/niat/logo-p-${p.slug}.png`} alt={p.company} loading="lazy" className="max-h-8 w-auto max-w-[45%] object-contain" />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-slate-500">Outcomes are from multiple NxtWave programs.</p>
      </section>

      {/* Mentors */}
      <section className="container-wide pt-24">
        <Heading eyebrow="Mentors">Mentors from <span className="gradient-text">world-class</span> tech companies</Heading>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MENTORS.map((m) => (
            <li key={m.name} className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-center shadow-sm">
              <img src={`/niat/mentor-${m.slug}.png`} alt={m.name} loading="lazy" className="h-48 w-full bg-slate-100 object-cover object-top" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{m.name}</h3>
                <p className="text-[0.95rem] text-slate-500">{m.role}</p>
                <img src={`/niat/logo-m-${m.slug}.png`} alt={m.company} loading="lazy" className="mx-auto mt-4 h-9 w-auto max-w-[70%] object-contain" />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Learner stories */}
      <section className="container-wide pt-24">
        <Heading eyebrow="Learner stories">
          How NxtWave learners built skills and landed roles at <span className="gradient-text">top companies</span>
        </Heading>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((s) => (
            <li key={s.name} className="card flex flex-col !p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="text-lg text-slate-500">{s.role}</p>
                <img src={`/niat/logo-s-${s.slug}.${s.logoExt}`} alt={s.company} loading="lazy" className="max-h-9 w-auto max-w-[45%] object-contain" />
              </div>
              <blockquote className="mt-4 flex-1 text-[1.0125rem] leading-relaxed text-slate-600">{s.quote}</blockquote>
              <div className="mt-6 flex items-center gap-3">
                {s.photo ? (
                  <img src={`/niat/story-${s.slug}.png`} alt="" loading="lazy" className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <Avatar name={s.name} size="h-11 w-11 text-sm" />
                )}
                <p className="font-semibold">{s.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Collaborations + recognition */}
      <section className="container-wide pt-24">
        <Heading eyebrow="Partners">Our world-class <span className="gradient-text">collaborations</span></Heading>
        <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-5 md:grid-cols-3">
          {COLLABORATIONS.map((c) => (
            <li key={c.name} className={`flex h-36 items-center justify-center gap-3 rounded-[2rem] px-6 text-xl font-bold ${c.tile}`}>
              <img src={`/niat/${c.logo}`} alt={c.label ? "" : c.name} loading="lazy" className={c.label ? "h-10 w-auto" : "max-h-14 w-auto max-w-[75%] object-contain"} />
              {c.label && <span>{c.label}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-mid pb-10 pt-24">
        <div className="rounded-3xl bg-[#FBF2F3] p-8 text-center sm:p-14">
          <p className="mb-6 text-3xl font-semibold text-[#991B1B]">NxtWave recognised by</p>
          <ul className="flex flex-wrap items-center justify-center gap-8">
            {RECOGNISED_BY.map((r) => (
              <li key={r.name}><img src={`/niat/${r.logo}`} alt={r.name} loading="lazy" className="h-14 w-auto" /></li>
            ))}
          </ul>
          <img src="/niat/anupam-mittal.webp" alt={SHARK_TANK.by} loading="lazy" className="mx-auto mt-10 h-56 w-auto" />
          <blockquote className="mx-auto mt-8 max-w-2xl text-3xl font-bold leading-snug text-[#991B1B] sm:text-4xl">“{SHARK_TANK.quote}”</blockquote>
          <p className="mt-3 text-sm text-slate-500">*{SHARK_TANK.where}</p>
          <p className="mt-4 text-lg font-semibold">{SHARK_TANK.by}</p>
          <p className="text-slate-500">{SHARK_TANK.title}</p>
        </div>
      </section>
    </>
  );
}
