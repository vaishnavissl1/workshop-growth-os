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
            <li key={a.name} className="card !p-8 text-center">
              <div className="flex justify-center"><Avatar name={a.name} size="h-20 w-20 text-2xl" /></div>
              <p className="mt-5 text-2xl font-semibold text-[#991B1B]">{a.line}</p>
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
        <ul className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3">
          {HIRING_COMPANIES.map((c) => (
            <li key={c} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-lg font-semibold text-slate-700">{c}</li>
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
            <li key={p.name} className="rounded-3xl bg-[#334155] p-7 text-white">
              <Avatar name={p.name} />
              <h3 className="mt-5 text-2xl font-semibold !text-white">{p.name}</h3>
              <p className="text-slate-200">{p.role}</p>
              <p className="mt-5 inline-block rounded-lg bg-white px-4 py-2 text-xl font-bold text-[#1D4ED8]">{p.lpa} LPA</p>
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
            <li key={m.name} className="card !p-6 text-center">
              <div className="flex justify-center"><Avatar name={m.name} /></div>
              <h3 className="mt-4 text-lg font-semibold">{m.name}</h3>
              <p className="text-[0.95rem] text-slate-500">{m.role}</p>
              {m.company && <p className="mt-2 font-semibold text-[#991B1B]">{m.company}</p>}
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
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{s.role}</p>
              <blockquote className="mt-3 flex-1 text-[1.0125rem] leading-relaxed text-slate-600">{s.quote}</blockquote>
              <p className="mt-5 font-semibold">{s.name}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Collaborations + recognition */}
      <section className="container-wide pt-24">
        <Heading eyebrow="Partners">Our world-class <span className="gradient-text">collaborations</span></Heading>
        <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-5 md:grid-cols-3">
          {COLLABORATIONS.map((c, i) => (
            <li
              key={c}
              className={`flex h-28 items-center justify-center rounded-3xl px-4 text-center text-xl font-bold ${
                ["bg-[#FFE0E0] text-[#1E293B]", "bg-[#A8000F] text-white", "bg-[#E06A00] text-white", "bg-[#0F2F3A] text-white", "bg-[#12151F] text-white", "bg-slate-200 text-[#1E293B]"][i % 6]
              }`}
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-mid pb-10 pt-24">
        <div className="rounded-3xl bg-[#FBF2F3] p-8 text-center sm:p-14">
          <p className="eyebrow mb-3">NxtWave recognised by</p>
          <p className="text-lg font-semibold text-slate-700">{RECOGNISED_BY.join("  ·  ")}</p>
          <blockquote className="mx-auto mt-10 max-w-2xl text-3xl font-bold leading-snug text-[#991B1B] sm:text-4xl">“{SHARK_TANK.quote}”</blockquote>
          <p className="mt-3 text-sm text-slate-500">*{SHARK_TANK.where}</p>
          <p className="mt-4 text-lg font-semibold">{SHARK_TANK.by}</p>
          <p className="text-slate-500">{SHARK_TANK.title}</p>
        </div>
      </section>
    </>
  );
}
