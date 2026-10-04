/**
 * Content for the "What you can become" part of /certificate.
 *
 * ROLES and BRANCH_FIT are general descriptions of work, not claims about any company or placement.
 * PATHS are illustrative and labelled that way on the page.
 *
 * ALUMNI is the only place real outcomes go. Add an entry ONLY for a real student who completed the workshop,
 * has agreed to be named, and whose company and role you have confirmed. Nothing is shown from here until
 * `verified` is true. Never add made-up or "typical" entries: they would be fake testimonials.
 */

export type Role = {
  icon: string;
  title: string;
  does: string;
  proof: string;
  next: string;
  /** Skills the role is built on. The first few are the ones the workshop touches. */
  skills: string[];
};

export const ROLES: Role[] = [
  {
    icon: "💬",
    title: "GenAI / LLM Application Developer",
    does: "Builds chatbots, assistants and summarisers on top of language-model APIs.",
    proof: "Your workshop app is exactly this: a prompt, a model and an interface, deployed publicly.",
    next: "Add retrieval over your own documents, then evaluation and logging.",
    skills: ["Python", "Prompt design", "LLM APIs", "Gradio", "Hugging Face"],
  },
  {
    icon: "🧠",
    title: "AI / ML Engineer (entry level)",
    does: "Works with models, data and evaluation to make AI features reliable.",
    proof: "You've shipped a model-backed product end to end, which most fresh graduates haven't.",
    next: "Learn model evaluation, fine-tuning basics and data pipelines.",
    skills: ["Python", "Model evaluation", "Transformers", "Data pipelines"],
  },
  {
    icon: "🛠️",
    title: "Software Engineer, AI-enabled products",
    does: "Adds AI features to existing web and mobile products.",
    proof: "You've integrated an external AI API, handled secrets safely and deployed to a public URL.",
    next: "Build the same feature inside a larger app with auth, a database and tests.",
    skills: ["Python", "APIs", "Deployment", "Secrets handling", "Git"],
  },
  {
    icon: "📊",
    title: "Data / Business Analyst with AI",
    does: "Uses language models to clean, summarise and explain data and reports faster.",
    proof: "Your project turns messy text into a clear answer, the core move in AI-assisted analysis.",
    next: "Pair it with SQL, spreadsheets and a dashboard tool.",
    skills: ["Python", "SQL", "LLM summarising", "Dashboards"],
  },
  {
    icon: "⚙️",
    title: "AI Automation / Prompt Engineer",
    does: "Designs prompts and workflows that automate repetitive business tasks.",
    proof: "You've tuned a prompt until an app behaved, and you can show it running.",
    next: "Learn workflow tools and how to test prompts systematically.",
    skills: ["Prompt design", "LLM APIs", "Workflow tools", "Testing prompts"],
  },
  {
    icon: "🤝",
    title: "AI Solutions / Product Associate",
    does: "Demonstrates AI features to customers and turns their needs into product ideas.",
    proof: "A live link lets you demo a real working thing instead of describing one.",
    next: "Practise explaining trade-offs: cost, accuracy and limits of models.",
    skills: ["Demoing", "Prompt design", "Cost vs accuracy", "Writing"],
  },
];

/** How a branch and AI fit together. General directions, not promises. */
export const BRANCH_FIT: { branch: string; fit: string }[] = [
  { branch: "CSE / IT", fit: "Software, GenAI and ML engineering roles." },
  { branch: "ECE", fit: "Embedded and edge-AI work, plus tools that read datasheets and specs." },
  { branch: "EEE", fit: "Power and grid analytics, fault diagnosis assistants." },
  { branch: "Mechanical", fit: "Maintenance and reliability analytics, design and material-selection assistants." },
  { branch: "Civil", fit: "Site reporting, code-compliance assistants and estimation tools." },
  { branch: "Chemical", fit: "Process safety and plant-operations support tools." },
  { branch: "Biotech", fit: "Literature review, protocol and bioinformatics assistants." },
];

/** Illustrative only. The page labels these as examples, not real students. */
export const PATHS = [
  {
    from: "Mechanical, final year",
    build: "Machine-fault explainer chatbot",
    steps: ["Adds the live link to the resume", "Applies to maintenance-analytics and AI-assisted engineering roles", "Talks through the project in interviews"],
  },
  {
    from: "ECE, final year",
    build: "Datasheet summariser",
    steps: ["Shares the project on LinkedIn", "Applies to embedded and tooling roles", "Uses the app as a demo in technical rounds"],
  },
  {
    from: "CSE, final year",
    build: "Resume-to-JD match coach",
    steps: ["Extends it with retrieval and evaluation", "Applies to GenAI developer roles", "Shows a deployed app next to the repo"],
  },
];

export type Alumnus = {
  name: string;
  college: string;
  batch: number;
  company: string;
  role: string;
  quote?: string;
  /** Set true only after confirming the student, the company and the role, and getting their permission. */
  verified: boolean;
};

/** Real, confirmed outcomes only. Empty until the first cohort has results. */
export const ALUMNI: Alumnus[] = [];
