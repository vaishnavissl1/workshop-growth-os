const TONES = {
  violet: ["rgba(153,27,27,0.09)", "rgba(255,178,24,0.10)"],
  amber: ["rgba(255,178,24,0.16)", "rgba(153,27,27,0.07)"],
  green: ["rgba(22,163,74,0.10)", "rgba(255,178,24,0.08)"],
  pink: ["rgba(220,38,38,0.09)", "rgba(153,27,27,0.07)"],
  blue: ["rgba(30,41,59,0.08)", "rgba(153,27,27,0.06)"],
} as const;

/** Per-page colour wash behind the content, so each route reads as its own destination. */
export default function PageGlow({ tone }: { tone: keyof typeof TONES }) {
  const [a, b] = TONES[tone];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[1]"
      style={{
        background: `radial-gradient(60rem 28rem at 50% 0%, ${a}, transparent 70%), radial-gradient(40rem 24rem at 100% 100%, ${b}, transparent 70%)`,
      }}
    />
  );
}
