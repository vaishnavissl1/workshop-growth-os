import { WORKSHOP_CONFIG as cfg } from "@/config";
import { ALUMNI, BRANCH_FIT, PATHS, ROLES } from "@/data/careers";

const INTERVIEW_QS = [
  ["“Walk me through a project you built.”", "You can, from the first prompt to the live link."],
  ["“How did you get the model to behave?”", "You tuned a prompt and tested it against real inputs."],
  ["“How did you deploy it?”", "Hugging Face Spaces, with the API key kept as a secret."],
];

/** The "what you can become" half of /certificate: roles, how to use the certificate, example paths, verified alumni. */
export default function CareerSections() {
  const alumni = ALUMNI.filter((a) => a.verified);

  return (
    <>
      {/* Roles */}
      <section className="container-wide pt-24">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3">What you can become</p>
          <h2 className="section-title">Roles this project speaks to</h2>
          <p className="lead mx-auto mt-4 max-w-2xl">
            A deployed AI app shows hiring managers you can build with these tools. These are the kinds of roles where that matters.
          </p>
        </div>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((r) => (
            <li key={r.title} className="card card-lift flex flex-col !p-8">
              <span aria-hidden="true" className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-3xl">{r.icon}</span>
              <h3 className="text-xl font-semibold">{r.title}</h3>
              <p className="mt-2 text-gray-400">{r.does}</p>
              <p className="mt-4 text-[0.95rem] text-gray-200">
                <strong className="text-[var(--color-primary-light)]">Your project shows: </strong>
                {r.proof}
              </p>
              <p className="mt-3 text-[0.95rem] text-gray-400">
                <strong className="text-gray-300">Next step: </strong>
                {r.next}
              </p>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-gray-400">
          A workshop certificate and one project don&apos;t guarantee a job. They give you something real to show while you keep building.
        </p>
      </section>

      {/* Branch fit */}
      <section className="container-mid pt-24">
        <div className="card !p-8 sm:!p-12">
          <p className="eyebrow mb-3 text-center">Your branch + AI</p>
          <h2 className="section-title text-center">Not a CSE student? You still fit</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {BRANCH_FIT.map((b) => (
              <li key={b.branch} className="inset p-5">
                <p className="font-semibold text-[var(--color-primary-light)]">{b.branch}</p>
                <p className="mt-1 text-[0.95rem] text-gray-300">{b.fit}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Use it in applications */}
      <section className="container-mid pt-24">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-3">Make it work for you</p>
          <h2 className="section-title">Use it in applications and interviews</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card !p-8">
            <h3 className="mb-3 text-xl font-semibold">A resume line you can copy</h3>
            <p className="inset p-4 text-[0.95rem] leading-relaxed text-gray-200">
              Built and deployed a live LLM-powered app (Python, Gradio, Hugging Face Spaces) that [what yours does]. Public link: [your URL].
            </p>
            <p className="mt-4 text-sm text-gray-400">Add the certificate under Licenses &amp; certifications: {cfg.title}.</p>
          </div>
          <div className="card !p-8">
            <h3 className="mb-3 text-xl font-semibold">Questions it prepares you for</h3>
            <ul className="space-y-3">
              {INTERVIEW_QS.map(([q, a]) => (
                <li key={q}>
                  <p className="font-medium text-gray-100">{q}</p>
                  <p className="text-sm text-gray-400">{a}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Illustrative paths */}
      <section className="container-wide pt-24">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-3">Example paths</p>
          <h2 className="section-title">What could happen next</h2>
          <p className="notice-amber mx-auto mt-5 inline-block px-4 py-2 text-sm">
            Illustrative examples to show the idea. These are not real students.
          </p>
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {PATHS.map((p) => (
            <li key={p.from} className="card !p-8">
              <p className="text-sm font-semibold text-[var(--color-primary-light)]">{p.from}</p>
              <h3 className="mt-1 text-xl font-semibold">Builds: {p.build}</h3>
              <ol className="mt-5 space-y-3">
                {p.steps.map((s, i) => (
                  <li key={s} className="flex gap-3 text-[0.95rem] text-gray-300">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-200">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </section>

      {/* Last section. Real, verified alumni get your headline; until there are any, show the roles this leads toward. */}
      <section className="container-wide pt-24">
        {alumni.length > 0 ? (
          <>
            <div className="mb-10 text-center">
              <p className="eyebrow mb-3">Alumni outcomes</p>
              <h2 className="section-title">Students who did our courses ended up in these job roles</h2>
            </div>
            <ul className="grid gap-6 md:grid-cols-3">
              {alumni.map((a) => (
                <li key={a.name} className="card !p-8">
                  <p className="text-xl font-semibold">{a.name}</p>
                  <p className="text-sm text-gray-400">{a.college} · Batch {a.batch}</p>
                  <p className="mt-4 text-lg font-semibold text-[var(--color-primary-light)]">{a.role}</p>
                  <p className="text-gray-300">{a.company}</p>
                  {a.quote && <p className="mt-4 text-[0.95rem] italic text-gray-400">“{a.quote}”</p>}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-b from-violet-900/25 to-violet-900/5 p-8 text-center sm:p-14">
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" aria-hidden="true" />
            <div className="relative">
              <p className="eyebrow mb-3">Where it can lead</p>
              <h2 className="section-title">Job roles this skill opens up</h2>
              <p className="lead mx-auto mt-4 max-w-2xl">
                One deployed project won&apos;t land a job on its own, but it puts you in the conversation for roles like these.
              </p>
              <ul className="mt-10 flex flex-wrap justify-center gap-3">
                {ROLES.map((r) => (
                  <li key={r.title} className="chip !flex items-center gap-2 !px-5">
                    <span aria-hidden="true">{r.icon}</span>
                    {r.title}
                  </li>
                ))}
              </ul>
              <p className="mt-10">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/register" className="btn-cta btn-lg !text-[#111827]">Start with your first project</a>
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
