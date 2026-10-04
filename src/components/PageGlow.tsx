const TONES = {
  violet: ["rgba(91,33,182,0.45)", "rgba(162,28,175,0.30)"],
  amber: ["rgba(180,83,9,0.40)", "rgba(190,18,60,0.22)"],
  green: ["rgba(21,128,61,0.40)", "rgba(13,148,136,0.25)"],
  pink: ["rgba(190,24,93,0.38)", "rgba(109,40,217,0.30)"],
  blue: ["rgba(29,78,216,0.38)", "rgba(79,70,229,0.28)"],
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
