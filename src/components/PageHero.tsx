/** Shared page header: eyebrow, big title, lead paragraph. Gives every page the same confident start. */
export default function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="container-mid animate-fade-in-up pb-10 pt-16 text-center sm:pt-20">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h1 className="display">{title}</h1>
      {lead && <p className="lead mx-auto mt-5 max-w-2xl">{lead}</p>}
      {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
    </section>
  );
}
