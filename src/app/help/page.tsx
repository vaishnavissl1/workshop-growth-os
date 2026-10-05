import HelpForm from "@/components/HelpForm";
import PageGlow from "@/components/PageGlow";
import PageHero from "@/components/PageHero";

export const metadata = { title: "Help centre" };

const QUICK = [
  ["I can't log in", "Reset your password from the login page. The link arrives by email.", "/forgot-password", "Reset password"],
  ["Is my seat confirmed?", "Your account page shows your seat, session and invite link.", "/account", "Open my account"],
  ["What do I need on the day?", "A laptop, a stable connection and a free Google account. The program page has the full hour.", "/program", "See the program"],
  ["How do I get my certificate?", "Finish the build and deploy it. The certificate page explains each step.", "/certificate", "Certificate steps"],
  ["Is my project good enough?", "Paste your Hugging Face Space link and get a score with what to fix.", "/evaluate", "Check my project"],
  ["More questions", "Sessions, referrals, prizes and how your details are used.", "/faq", "Read the FAQ"],
];

export default function HelpPage() {
  return (
    <>
      <PageGlow tone="blue" />
      <PageHero eyebrow="Help centre" title={<>How can we <span className="gradient-text">help?</span></>} lead="Find a quick answer below, or send us your question." />

      <section className="container-wide">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {QUICK.map(([title, text, href, cta]) => (
            <li key={title} className="card card-lift flex flex-col !p-7">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 flex-1 text-slate-500">{text}</p>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href={href} className="mt-4 font-semibold">{cta} →</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-mid pb-10 pt-20">
        <div className="card !p-8 sm:!p-12">
          <p className="eyebrow mb-3">Still stuck?</p>
          <h2 className="section-title">Ask us directly</h2>
          <p className="lead mb-8 mt-3">Send your question and we&apos;ll reply by email.</p>
          <HelpForm />
        </div>
      </section>
    </>
  );
}
