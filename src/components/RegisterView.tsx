import { WORKSHOP_CONFIG as cfg } from "@/config";
import Countdown from "@/components/Countdown";
import PageGlow from "@/components/PageGlow";
import RegisterForm from "@/components/RegisterForm";
import { closesLabel, seatsLeft, sessionLabel } from "@/lib/seats";

const PERKS = [
  ["🎁", "Starter code for your project, the moment you register"],
  ["🔗", "A live public link to your AI app"],
  ["📜", "Certificate with your name + project title"],
  ["🏆", "Proof you built it before your batch"],
];

/** The registration page body, shared by /register and the personalised /r/[code] invite page. */
export default async function RegisterView({
  refCode,
  inviter,
}: {
  refCode?: string;
  inviter?: { firstName: string; college: string; project?: string | null };
}) {
  const left = await seatsLeft();

  return (
    <>
      <PageGlow tone="violet" />
      <div className="container-wide animate-fade-in-up pb-4 pt-12 sm:pt-16">
        {inviter && (
          <div className="notice-violet mx-auto mb-8 max-w-3xl p-4 text-center text-base font-medium">
            {inviter.firstName} from {inviter.college} invited you
            {inviter.project ? (
              <>
                {" "}· they&apos;re building: <strong>{inviter.project}</strong>
              </>
            ) : null}
          </div>
        )}

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.35fr]">
          <aside className="lg:sticky lg:top-28">
            <p className="eyebrow mb-4">Reserve your seat</p>
            <h1 className="section-title !text-[clamp(2rem,4vw,3.25rem)]">
              Build Your First <span className="gradient-text">AI Project</span> in 60 Minutes
            </h1>
            <p className="lead mt-5">Free, live and hands-on. Takes about a minute to register.</p>

            <div className="card mt-8 !p-7">
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <span className="relative flex h-3 w-3 items-center justify-center" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Seats left in Session 1
              </p>
              <p className="mt-1 text-5xl font-bold text-[var(--color-success-text)]">
                {left}
                <span className="text-xl font-medium text-slate-500"> / {cfg.seatCap}</span>
              </p>
              <p className="mt-4 text-[0.95rem] text-slate-600">
                {sessionLabel(cfg.sessionDate)} IST
                <span className="block text-slate-500">Repeat session {sessionLabel(cfg.session2Date)} IST</span>
              </p>
              <div className="mt-4"><Countdown closesAt={cfg.registrationCloses} /></div>
              <p className="mt-3 text-sm text-slate-500">Registration closes {closesLabel()}.</p>
            </div>

            <ul className="mt-6 space-y-3">
              {PERKS.map(([icon, text]) => (
                <li key={text} className="flex items-center gap-4 text-[1.0125rem] text-slate-800">
                  <span aria-hidden="true" className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#FBF2F3] text-2xl">{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
          </aside>

          <div className="card !p-8 sm:!p-10">
            <RegisterForm refCode={refCode} />
          </div>
        </div>
      </div>
    </>
  );
}
