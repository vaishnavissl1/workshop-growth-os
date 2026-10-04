import AuthGate from "@/components/auth/AuthGate";
import PageGlow from "@/components/PageGlow";
import PageHero from "@/components/PageHero";
import ProjectChecker from "@/components/ProjectChecker";

export const metadata = { title: "Project checker" };

const RUBRIC = [
  ["25", "It's live", "Your Space is running and anyone can open it."],
  ["25", "It uses an AI model", "Your code calls a language model."],
  ["15", "It has a real interface", "People can type something in and get an answer."],
  ["15", "The API key is kept secret", "Your key is stored as a secret, not written in the code."],
  ["10", "It explains itself", "The README says what the app does."],
  ["10", "It's your own work", "You changed the starter for your own idea."],
];

export default function EvaluatePage() {
  return (
    <AuthGate>
      <>
        <PageGlow tone="green" />
        <PageHero
          eyebrow="Project checker"
          title={<>Is your project <span className="gradient-text">resume-ready?</span></>}
          lead="Paste your Hugging Face Space link. In a few seconds you'll see a score out of 100 and exactly what to fix."
        />
        <div className="container-mid">
          <ProjectChecker />
        </div>

        <section className="container-mid pt-20">
          <div className="mb-8 text-center">
            <p className="eyebrow mb-3">How it&apos;s scored</p>
            <h2 className="section-title">Six checks, 100 points</h2>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {RUBRIC.map(([pts, title, text]) => (
              <li key={title} className="card flex gap-4 !p-6">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#FBF2F3] text-lg font-bold text-[#991B1B]">{pts}</span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-[0.95rem] text-slate-600">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </>
    </AuthGate>
  );
}
