import { BRAND, useArt } from "./useArtId";

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/** Deterministic gradient cover for blog posts without an image. */
export default function GradientCover({
  seed,
  label,
  className = "",
}: {
  seed: string;
  label?: string;
  className?: string;
}) {
  const { prefix, ref } = useArt();
  const h = hash(seed);
  const colors = [BRAND.blue, BRAND.green, BRAND.red];
  const lead = h % 3;
  const pick = (n: number, min: number, max: number) =>
    min + (((h >>> (n * 5)) & 31) / 31) * (max - min);
  const blobs = [0, 1, 2].map((i) => ({
    cx: pick(i * 2, 40, 360),
    cy: pick(i * 2 + 1, 30, 200),
    r: pick(i + 6, 110, 170) * (i === 0 ? 1.15 : 0.85),
    color: colors[(lead + i) % 3],
  }));
  const rings = 3 + (h % 3);

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 225"
      className={`block w-full h-auto ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        {blobs.map((b, i) => (
          <radialGradient key={i} id={`${prefix}-b${i}`}>
            <stop offset="0" stopColor={b.color} stopOpacity="0.95" />
            <stop offset="1" stopColor={b.color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      <rect width="400" height="225" fill={BRAND.ink} />
      {blobs.map((b, i) => (
        <circle
          key={i}
          cx={b.cx}
          cy={b.cy}
          r={b.r}
          fill={`url(#${prefix}-b${i})`}
        />
      ))}
      <g fill="none" stroke="#ffffff" strokeOpacity="0.16">
        {Array.from({ length: rings }, (_, i) => (
          <circle
            key={i}
            cx={pick(9, 260, 340)}
            cy={pick(10, 60, 160)}
            r={28 + i * 26}
          />
        ))}
      </g>
      {label && (
        <text
          x="24"
          y="200"
          fill="#ffffff"
          fillOpacity="0.85"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize="13"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
